"""Data-driven FRI template builder (fallback build per fri-report-template-generator spec)."""
import sys, copy, itertools
from docx import Document
from docx.shared import Pt, Emu, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import content_tro as C

W_TOTAL = 11330  # dxa usable width
NAVY, CORAL, BLUE = "151F37", "DC5733", "006293"
_sdt_id = itertools.count(100001)


# ------------------------------------------------------------------ low-level helpers
def el(tag, **attrs):
    e = OxmlElement(tag)
    for k, v in attrs.items():
        e.set(qn(k), str(v))
    return e


def fmt_run(run, size=9, bold=False, italic=False, color=None):
    run.font.name = "Arial"
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    rpr = run._r.get_or_add_rPr()
    rf = rpr.find(qn("w:rFonts"))
    if rf is None:
        rf = el("w:rFonts"); rpr.insert(0, rf)
    for a in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rf.set(qn(a), "Arial")
    return run


def para(container, text="", size=9, bold=False, italic=False, color=None, align=None, new=True):
    p = container.add_paragraph() if new else container.paragraphs[0]
    if text:
        fmt_run(p.add_run(text), size, bold, italic, color)
    if align:
        p.alignment = align
    return p


def bi(cell, en, vi, size=9, bold=False, first=True, color=None, vi_color="7F7F7F"):
    """English line on top, Vietnamese below (grey italic, 1 pt smaller)."""
    p = cell.paragraphs[0] if first and not cell.paragraphs[0].text and not cell.paragraphs[0].runs else cell.add_paragraph()
    fmt_run(p.add_run(en), size, bold, color=color)
    if vi:
        q = cell.add_paragraph()
        fmt_run(q.add_run(vi), size - 1, bold=False, italic=True, color=vi_color)
    return p


def text(cell, t, size=9, bold=False, color=None, italic=False, first=True):
    p = cell.paragraphs[0] if first and not cell.paragraphs[0].runs else cell.add_paragraph()
    fmt_run(p.add_run(t), size, bold, italic, color)
    return p


def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    for s in tcPr.findall(qn("w:shd")):
        tcPr.remove(s)
    tcPr.append(el("w:shd", **{"w:val": "clear", "w:color": "auto", "w:fill": fill}))


def cant_split(row, header=False, keep_next=False):
    trPr = row._tr.get_or_add_trPr()
    trPr.append(el("w:cantSplit"))
    if header:
        trPr.append(el("w:tblHeader"))
    if keep_next:
        for c in row.cells:
            for p in c.paragraphs:
                p.paragraph_format.keep_with_next = True


TBLPR_ORDER = ["tblStyle", "tblpPr", "tblOverlap", "bidiVisual", "tblStyleRowBandSize", "tblStyleColBandSize",
               "tblW", "jc", "tblCellSpacing", "tblInd", "tblBorders", "shd", "tblLayout", "tblCellMar", "tblLook"]


def table(container, widths, rows=1, style="Table Grid"):
    t = container.add_table(rows=rows, cols=len(widths))
    t.style = style
    tblPr = t._tbl.tblPr
    for tag in ("w:tblW", "w:tblLayout"):
        for x in tblPr.findall(qn(tag)):
            tblPr.remove(x)
    tblPr.append(el("w:tblW", **{"w:w": sum(widths), "w:type": "dxa"}))
    tblPr.append(el("w:tblLayout", **{"w:type": "fixed"}))
    grid = t._tbl.tblGrid
    for gc, w in zip(grid.findall(qn("w:gridCol")), widths):
        gc.set(qn("w:w"), str(w))
    for r in t.rows:
        set_row_widths(r, widths)
    t._widths = widths
    return t


def set_row_widths(row, widths):
    for c, w in zip(row.cells, widths):
        tcPr = c._tc.get_or_add_tcPr()
        for x in tcPr.findall(qn("w:tcW")):
            tcPr.remove(x)
        tcPr.insert(0, el("w:tcW", **{"w:w": w, "w:type": "dxa"}))


def add_row(t):
    r = t.add_row()
    set_row_widths(r, t._widths)
    return r


def merge(row, a, b):
    """Merge cells a..b of a row; fix width; drop empty paragraphs left behind."""
    c = row.cells[a].merge(row.cells[b])
    w = sum(row.table._widths[a:b + 1]) if hasattr(row.table, "_widths") else None
    tcPr = c._tc.get_or_add_tcPr()
    for x in tcPr.findall(qn("w:tcW")):
        tcPr.remove(x)
    if w:
        tcPr.insert(0, el("w:tcW", **{"w:w": w, "w:type": "dxa"}))
    ps = c.paragraphs
    for p in ps[1:]:
        if not p.text and not p.runs:
            p._p.getparent().remove(p._p)
    return c


def order_tblpr(doc):
    roots = [doc.element.body] + [s.header._element for s in doc.sections] + [s.footer._element for s in doc.sections]
    for tblPr in itertools.chain.from_iterable(r.iter(qn("w:tblPr")) for r in roots):
        kids = list(tblPr)
        def key(e):
            n = e.tag.split("}")[1]
            return TBLPR_ORDER.index(n) if n in TBLPR_ORDER else 99
        for k in kids:
            tblPr.remove(k)
        for k in sorted(kids, key=key):
            tblPr.append(k)


def dropdown(paragraph, items, placeholder="Choose an item.", selected=None, size=9, color=None):
    sdt = el("w:sdt")
    pr = el("w:sdtPr")
    pr.append(el("w:id", **{"w:val": next(_sdt_id)}))
    if selected is None:
        pr.append(el("w:showingPlcHdr"))
    dd = el("w:dropDownList")
    dd.append(el("w:listItem", **{"w:displayText": placeholder, "w:value": ""}))
    for it in items:
        dd.append(el("w:listItem", **{"w:displayText": it, "w:value": it}))
    pr.append(dd)
    sdt.append(pr)
    content = el("w:sdtContent")
    r = el("w:r")
    rpr = el("w:rPr")
    rpr.append(el("w:rFonts", **{"w:ascii": "Arial", "w:hAnsi": "Arial", "w:cs": "Arial"}))
    if selected is None:
        rpr.append(el("w:color", **{"w:val": "808080"}))
    elif color:
        rpr.append(el("w:color", **{"w:val": color}))
    rpr.append(el("w:sz", **{"w:val": size * 2}))
    r.append(rpr)
    tx = el("w:t"); tx.text = selected if selected else placeholder
    tx.set(qn("xml:space"), "preserve")
    r.append(tx)
    content.append(r)
    sdt.append(content)
    paragraph._p.append(sdt)
    return sdt


def checkbox(paragraph, label, checked=False, size=9):
    sdt = el("w:sdt")
    pr = el("w:sdtPr")
    pr.append(el("w:id", **{"w:val": next(_sdt_id)}))
    cb = OxmlElement("w14:checkbox")
    c1 = OxmlElement("w14:checked"); c1.set(qn("w14:val"), "1" if checked else "0")
    c2 = OxmlElement("w14:checkedState"); c2.set(qn("w14:val"), "2612"); c2.set(qn("w14:font"), "MS Gothic")
    c3 = OxmlElement("w14:uncheckedState"); c3.set(qn("w14:val"), "2610"); c3.set(qn("w14:font"), "MS Gothic")
    cb.extend([c1, c2, c3]); pr.append(cb)
    sdt.append(pr)
    content = el("w:sdtContent")
    r = el("w:r"); rpr = el("w:rPr")
    rpr.append(el("w:rFonts", **{"w:ascii": "MS Gothic", "w:hAnsi": "MS Gothic", "w:eastAsia": "MS Gothic"}))
    rpr.append(el("w:sz", **{"w:val": size * 2})); r.append(rpr)
    tx = el("w:t"); tx.text = "☒" if checked else "☐"; r.append(tx)
    content.append(r); sdt.append(content)
    paragraph._p.append(sdt)
    fmt_run(paragraph.add_run(f" {label}   "), size)


def result_dd(cell, first=True):
    p = cell.paragraphs[0] if first and not cell.paragraphs[0].runs else cell.add_paragraph()
    dropdown(p, C.RESULT_LIST)
    return p


def header_row(t, labels, fill=NAVY, fg="FFFFFF", vi=None):
    r = t.rows[0]
    for i, l in enumerate(labels):
        c = r.cells[i]
        shade(c, fill)
        if isinstance(l, tuple):
            bi(c, l[0], l[1], 8.5, True, color=fg, vi_color="BDD7EE")
        else:
            text(c, l, 8.5, True, fg)
    cant_split(r, header=True)
    return r


def section_bar(doc, en, vi, fill=NAVY):
    t = table(doc, [W_TOTAL])
    c = t.rows[0].cells[0]
    shade(c, fill)
    bi(c, en, vi, 10, True, color="FFFFFF", vi_color="BDD7EE")
    cant_split(t.rows[0], keep_next=True)
    return t


def spacer(doc, pts=3):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(0)
    fmt_run(p.add_run(""), pts)
    return p


def picture(cell_or_doc, path, width_in):
    p = cell_or_doc.paragraphs[0] if hasattr(cell_or_doc, "paragraphs") and not cell_or_doc.paragraphs[0].runs else cell_or_doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(path, width=Inches(width_in))
    return p


def field(paragraph, instr):
    r = paragraph.add_run(); fmt_run(r, 7.5)
    r._r.append(el("w:fldChar", **{"w:fldCharType": "begin"}))
    r2 = paragraph.add_run(); fmt_run(r2, 7.5)
    it = el("w:instrText"); it.text = f" {instr} "; it.set(qn("xml:space"), "preserve"); r2._r.append(it)
    r3 = paragraph.add_run(); fmt_run(r3, 7.5)
    r3._r.append(el("w:fldChar", **{"w:fldCharType": "separate"}))
    r4 = paragraph.add_run("1"); fmt_run(r4, 7.5)
    r5 = paragraph.add_run(); fmt_run(r5, 7.5)
    r5._r.append(el("w:fldChar", **{"w:fldCharType": "end"}))


# ------------------------------------------------------------------ document parts
def setup(doc):
    s = doc.sections[0]
    s.page_width, s.page_height = Emu(7560310), Emu(10692130)
    for m in ("left_margin", "right_margin", "top_margin", "bottom_margin"):
        setattr(s, m, Inches(0.2))
    s.header_distance = Inches(0.15); s.footer_distance = Inches(0.15)
    st = doc.styles["Normal"]
    st.font.name = "Arial"; st.font.size = Pt(9)
    pf = st.paragraph_format
    pf.space_before = Pt(0); pf.space_after = Pt(0); pf.line_spacing = 1.0
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    # settings zoom
    settings = doc.settings.element
    z = settings.find(qn("w:zoom"))
    if z is None:
        z = el("w:zoom"); settings.insert(0, z)
    z.set(qn("w:percent"), "100")


def build_header_footer(doc):
    s = doc.sections[0]
    hdr = s.header
    widths = [3000, 4630, 3700]
    first_p = hdr.paragraphs[0]
    t = hdr.add_table(rows=2, cols=3, width=Emu(0))
    t.style = "Table Grid"
    tblPr = t._tbl.tblPr
    for tag in ("w:tblW", "w:tblLayout"):
        for x in tblPr.findall(qn(tag)):
            tblPr.remove(x)
    tblPr.append(el("w:tblW", **{"w:w": sum(widths), "w:type": "dxa"}))
    tblPr.append(el("w:tblLayout", **{"w:type": "fixed"}))
    for gc, w in zip(t._tbl.tblGrid.findall(qn("w:gridCol")), widths):
        gc.set(qn("w:w"), str(w))
    t._widths = widths
    for r in t.rows:
        set_row_widths(r, widths)
    # header table before the default paragraph so header ends with a paragraph
    first_p._p.addprevious(t._tbl)
    a = t.rows[0].cells[0]; a2 = t.rows[1].cells[0]
    m = a.merge(a2)
    text(m, "A.R.E.N.A.", 14, True, CORAL)
    text(m, "Quality department | Phòng Chất lượng", 8, False, NAVY, first=False)
    b = t.rows[0].cells[1].merge(t.rows[1].cells[1])
    p = text(b, "INSPECTION REPORT", 14, True, NAVY); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    q = text(b, "BÁO CÁO KIỂM HÀNG (FRI)", 8, False, "7F7F7F", italic=True, first=False); q.alignment = WD_ALIGN_PARAGRAPH.CENTER
    text(t.rows[0].cells[2], f"Report no. | Số báo cáo: {C.PH}", 8)
    text(t.rows[0].cells[2], f"Product category: {C.CATEGORY}", 8, first=False)
    text(t.rows[0].cells[2], f"Loại sản phẩm: {C.CATEGORY_VI}", 7, italic=True, color="7F7F7F", first=False)
    rc = t.rows[1].cells[2]
    p = text(rc, "Result | Kết quả: ", 9, True)
    dropdown(p, ["Passed", "Pending", "Failed"], size=9)
    fp = hdr.paragraphs[-1]; fmt_run(fp.add_run(""), 2)

    ftr = s.footer
    p = ftr.paragraphs[0]
    fmt_run(p.add_run(f"{C.DOC_ID} · {C.DATE} · Status: {C.STATUS} · "), 7.5, color="555555")
    if C.STATUS != "Released":
        fmt_run(p.add_run("DRAFT – not usable as validation benchmark · "), 7.5, True, color="C00000")
    fmt_run(p.add_run("Page "), 7.5); field(p, "PAGE"); fmt_run(p.add_run(" / "), 7.5); field(p, "NUMPAGES")


def general_info(doc):
    section_bar(doc, "GENERAL INFORMATION", "THÔNG TIN CHUNG")
    w = [2300, 3365, 2300, 3365]
    t = table(doc, w, rows=0)
    rows = [
        (("Ally", "Khách hàng"), "ALLY"), (("Inspection date", "Ngày kiểm"), C.PH),
        (("Supplier", "Nhà cung cấp"), C.PH), (("Inspection type", "Loại kiểm"), "Final Random Inspection (FRI)"),
        (("Factory (name, address)", "Nhà máy (tên, địa chỉ)"), C.PH), (("Inspection place", "Nơi kiểm"), C.PH),
        (("P.O. / P.I. no.", "Số P.O. / P.I."), C.PH), (("ETD / Port of loading", "ETD / Cảng xếp"), C.PH),
        (("Destination market", "Thị trường đến"), C.MARKET), (("Legal stream", "Khung pháp lý"), "GPSR (EU) 2023/988 – NO CE marking"),
    ]
    for i in range(0, len(rows), 2):
        r = add_row(t)
        for j in range(2):
            (en, vi), val = rows[i + j]
            lc = r.cells[j * 2]; vc = r.cells[j * 2 + 1]
            shade(lc, "E8ECF4"); bi(lc, en, vi, 8.5, True)
            if val == "ALLY":
                dropdown(vc.paragraphs[0], C.ALLIES)
            else:
                text(vc, val, 8.5)
        cant_split(r)
    spacer(doc)
    # item table per SKU
    w = [1400, 1600, 1700, 2830, 1200, 1200, 1400]
    t = table(doc, w)
    header_row(t, [("SKU / Item no.", "Mã hàng"), ("Ally art. no.", "Mã Ally"), ("EAN", "EAN"), ("Description", "Mô tả"),
                   ("Order qty", "SL đặt"), ("Presented qty", "SL trình"), ("Cartons", "Số thùng")])
    for _ in range(3):
        r = add_row(t)
        for c in r.cells:
            text(c, C.PH, 8.5)
        cant_split(r)
    spacer(doc)
    # documents
    w = [1300, 8030, 2000]
    t = table(doc, w)
    header_row(t, [("ID", "Mã"), ("Documents checklist", "Danh mục tài liệu"), ("Status", "Tình trạng")])
    for id_, en, vi, mand in C.DOCS:
        r = add_row(t)
        text(r.cells[0], id_, 8, True)
        bi(r.cells[1], en + ("" if mand else "  (informative)"), vi, 8.5)
        dropdown(r.cells[2].paragraphs[0], C.DOC_STATUS)
        cant_split(r)
    spacer(doc)
    # sampling
    w = [2300, 9030]
    t = table(doc, w, rows=0)
    for (en, vi), val in [
        (("Sampling plan", "Kế hoạch lấy mẫu"), C.SAMPLING),
        (("AQL", "AQL"), C.AQL + "  (branded goods per QSD)"),
        (("Table 1 – sample size per SKU", "Bảng 1 – cỡ mẫu theo SKU"), "Paste the Excel Table 1 per P.O. here (lot, code letter, n, Ma/Mi Ac/Re, Cri 0/1, S-3 n, cartons ≥ √N). Update if presented qty differs. | Dán Bảng 1 Excel theo P.O."),
    ]:
        r = add_row(t)
        shade(r.cells[0], "E8ECF4"); bi(r.cells[0], en, vi, 8.5, True)
        text(r.cells[1], val, 8.5)
        cant_split(r)
    r = add_row(t)
    shade(r.cells[0], "E8ECF4"); bi(r.cells[0], "Inspector / Reviewer", "Người kiểm / Người duyệt", 8.5, True)
    text(r.cells[1], f"Inspector: {C.PH}      Reviewer (QS): {C.PH}", 8.5)
    r = add_row(t)
    shade(r.cells[0], "E8ECF4"); bi(r.cells[0], "Re-inspection", "Kiểm lại", 8.5, True)
    p = r.cells[1].paragraphs[0]
    checkbox(p, "Yes | Có"); checkbox(p, "No | Không")
    fmt_run(p.add_run(f"   Previous report no.: {C.PH}"), 8.5)


SUMMARY = [
    ("Quantity", "Số lượng"), ("Packing", "Đóng gói"), ("Artwork / marking", "Artwork / nhãn mác"),
    ("Sample comparison", "So sánh mẫu"), ("Measurement & critical points", "Đo & điểm quan trọng"),
    ("Workmanship", "Tay nghề / ngoại quan"), ("On-site tests", "Thử nghiệm tại xưởng"),
    ("Disposal material", "Vật liệu thải bỏ / bao bì"), ("Other requirements", "Yêu cầu khác"), ("Close meeting", "Họp kết thúc"),
]


def summary(doc):
    spacer(doc)
    section_bar(doc, "INSPECTION RESULT SUMMARY", "TÓM TẮT KẾT QUẢ KIỂM")
    w = [600, 4130, 2000, 4600]
    t = table(doc, w)
    header_row(t, ["No.", ("Criteria", "Tiêu chí"), ("Result", "Kết quả"), ("Remark", "Ghi chú")])
    for i, (en, vi) in enumerate(SUMMARY, 1):
        r = add_row(t)
        text(r.cells[0], str(i), 8.5, True)
        bi(r.cells[1], en, vi, 8.5)
        result_dd(r.cells[2])
        text(r.cells[3], "", 8.5, color="C00000")
        cant_split(r)
    r = add_row(t)
    c = merge(r, 0, 1)
    shade(c, "FCE4D6"); bi(c, "OVERALL RESULT", "KẾT QUẢ CHUNG", 9, True)
    dropdown(r.cells[2].paragraphs[0], ["Passed", "Pending", "Failed"])
    cant_split(r)


DET_W = [1250, 5480, 1000, 1500, 2100]


def detail_table(doc):
    t = table(doc, DET_W)
    header_row(t, [("ID", "Mã"), ("Check item", "Hạng mục kiểm"), ("Sample", "Mẫu"), ("Result", "Kết quả"), ("Remark", "Ghi chú")])
    return t


def item_head(t, no, en, vi):
    r = add_row(t)
    c = merge(r, 0, 4)
    shade(c, "D9E2F3")
    bi(c, f"{no}. {en}", vi, 9, True)
    cant_split(r, keep_next=True)


def check_row(t, id_, en, vi, sample):
    r = add_row(t)
    text(r.cells[0], id_, 7.5, True)
    bi(r.cells[1], en, vi, 8.5)
    text(r.cells[2], sample, 8)
    result_dd(r.cells[3])
    cant_split(r)


def details(doc, figs):
    spacer(doc)
    section_bar(doc, "INSPECTION DETAILS", "CHI TIẾT KIỂM TRA")
    t = detail_table(doc)
    for k in (1, 2, 3, 4):
        en, vi, rows = C.ITEMS[k]
        item_head(t, k, en, vi)
        for id_, e, v, s in rows:
            check_row(t, id_, e, v, s)
    # item 5
    item_head(t, 5, "Measurement & critical points", "Đo kích thước & điểm quan trọng")
    r = add_row(t)
    c = merge(r, 0, 4)
    bi(c, "Dimensional tolerances (unless the approved drawing states tighter values) – ARENA proposals *, QS to confirm:",
       "Dung sai kích thước (trừ khi bản vẽ quy định chặt hơn) – đề xuất ARENA *, QS xác nhận:", 8.5)
    nt_w = [5555, 5555]
    outer = table(c, [5480, 5480])
    for (title, rows_), cell in zip([(("Dimension", "Tolerance"), C.TOL_DIM), (("Weight / carton", "Tolerance"), C.TOL_WGT)], outer.rows[0].cells):
        inner = table(cell, [3200, 2050])
        text(inner.rows[0].cells[0], title[0], 8, True); text(inner.rows[0].cells[1], title[1], 8, True)
        shade(inner.rows[0].cells[0], "E8ECF4"); shade(inner.rows[0].cells[1], "E8ECF4")
        for a, b in rows_:
            rr = add_row(inner); text(rr.cells[0], a, 8); text(rr.cells[1], b, 8)
        cell.add_paragraph()
    c.add_paragraph()
    cant_split(r)
    r = add_row(t)
    c = merge(r, 0, 4)
    bi(c, "Critical points – see Fig. 1 (A side, B front, C tilted) and Fig. 2 (test set-ups):",
       "Điểm quan trọng – xem Hình 1 và Hình 2:", 8.5, True)
    picture(c, figs[0], 7.6)
    cant_split(r)
    r = add_row(t)
    c = merge(r, 0, 4)
    mw = [1150, 450, 2300, 3400, 2100, 1600]
    mw = [1250, 500, 2350, 3500, 2050, 1310]
    mt = table(c, mw)
    for i, h in enumerate(["ID", "Ref.", "Parameter / Thông số", "How to measure", "Limit (EU) – per SKU", "Tool"]):
        shade(mt.rows[0].cells[i], NAVY); text(mt.rows[0].cells[i], h, 7.5, True, "FFFFFF")
    for id_, ref, en, vi, fig, how, lim, tool, ph in C.MATRIX:
        rr = add_row(mt)
        text(rr.cells[0], id_, 7, True); text(rr.cells[1], ref, 8, True, "C00000")
        bi(rr.cells[2], en, vi, 7.5); text(rr.cells[3], how, 7); text(rr.cells[4], lim, 7.5); text(rr.cells[5], tool, 7)
        cant_split(rr)
    text(c, "Matrix note: no OJ-cited EN exists for manual sack trucks (SoA). Limits = approved supplier drawing per SKU (fill in P.O. annex) or ARENA proposals marked * – QS to confirm before release. | Ghi chú: không có EN hài hòa; giới hạn theo bản vẽ đã duyệt hoặc đề xuất ARENA *.",
         7.5, italic=True, color="555555", first=False)
    cant_split(r)
    # item 6
    en, vi, rows = C.ITEMS[6]
    item_head(t, 6, en, vi)
    for id_, e, v, s in rows:
        check_row(t, id_, e, v, s)
    # item 7
    item_head(t, 7, "On-site tests", "Thử nghiệm tại xưởng")
    for id_, en, vi, sample, method, crit in C.TESTS:
        r = add_row(t)
        text(r.cells[0], id_, 7.5, True)
        bi(r.cells[1], en, vi, 8.5, True)
        text(r.cells[1], "Method: " + method, 7.5, first=False)
        text(r.cells[1], "Criterion: " + crit, 7.5, color="1F4E79", first=False)
        text(r.cells[2], sample, 8)
        result_dd(r.cells[3])
        cant_split(r)
    r = add_row(t)
    c = merge(r, 0, 4)
    picture(c, figs[1], 7.6)
    cant_split(r)


def table2(doc):
    p = doc.add_paragraph(); p.add_run().add_break(WD_BREAK.PAGE)
    section_bar(doc, "TABLE 2 – SPECIAL CHECK LIST / CRITICAL-POINT MEASUREMENTS (3 pcs per SKU)",
                "BẢNG 2 – DANH SÁCH KIỂM TRA ĐẶC BIỆT / ĐO ĐIỂM QUAN TRỌNG (3 mẫu / SKU)")
    w = [1200, 2600, 1900, 1050, 1050, 1050, 1180, 1300]
    t = table(doc, w)
    header_row(t, [("ID", "Mã"), ("Parameter", "Thông số"), ("Specification (drawing)", "Yêu cầu (bản vẽ)"),
                   "S1", "S2", "S3", ("Worst", "Kém nhất"), ("Result", "Kết quả")])
    r = add_row(t)
    c = merge(r, 0, 7)
    bi(c, f"SKU: {C.PH}   Drawing ref./rev.: {C.PH}   Rated load: {C.PH} kg   Wheel type: {C.PH}",
       "Mã hàng / Bản vẽ / Tải định mức / Loại bánh", 8.5, True)
    cant_split(r, keep_next=True)
    for id_, ref, en, vi, fig, how, lim, tool, ph in C.MATRIX:
        r = add_row(t)
        text(r.cells[0], id_, 7.5, True)
        bi(r.cells[1], f"{ref} – {en}", f"{ref} – {vi}", 8)
        text(r.cells[2], C.PH + "  " + lim, 7.5)
        result_dd(r.cells[7])
        cant_split(r)
    text(t.add_row().cells[0], "", 2)
    t._tbl.remove(t.rows[-1]._tr)


def defects(doc):
    spacer(doc)
    section_bar(doc, "DEFECT LIST", "DANH SÁCH LỖI")
    w = [500, 5130, 1300, 800, 800, 800, 2000]
    t = table(doc, w)
    header_row(t, ["No.", ("Defect description", "Mô tả lỗi"), ("Linked ID", "Mã liên quan"), "Cri", "Ma", "Mi", ("Remark", "Ghi chú")])
    for i, (en, vi, cls, link) in enumerate(C.DEFECTS, 1):
        r = add_row(t)
        text(r.cells[0], str(i), 8)
        bi(r.cells[1], f"[{cls}] {en}", vi, 8)
        text(r.cells[2], link, 7.5)
        cant_split(r)
    for _ in range(3):
        r = add_row(t); text(r.cells[0], "", 8); cant_split(r)
    r = add_row(t)
    c = merge(r, 0, 2); shade(c, "E8ECF4")
    bi(c, "Total defectives found (per SKU)", "Tổng số lỗi phát hiện (theo SKU)", 8.5, True)
    cant_split(r)
    r = add_row(t)
    c = merge(r, 0, 2); shade(c, "E8ECF4")
    bi(c, "Defectives accepted (Ac)", "Số lỗi chấp nhận (Ac)", 8.5, True)
    text(r.cells[3], "0", 8.5, True); text(r.cells[4], "?", 8.5, True); text(r.cells[5], "?", 8.5, True)
    cant_split(r)
    r = add_row(t)
    c = merge(r, 0, 2); shade(c, "FCE4D6")
    bi(c, "AQL result", "Kết quả AQL", 8.5, True)
    c2 = merge(r, 3, 6)
    dropdown(c2.paragraphs[0], ["Passed", "Failed", "Pending"])
    cant_split(r)
    spacer(doc)
    section_bar(doc, "DEFECT PHOTOS", "HÌNH ẢNH LỖI", fill=BLUE)
    t = table(doc, [3776, 3777, 3777])
    for _ in range(1):
        r = add_row(t)
    for row in t.rows:
        row.height = Inches(1.9)
        for cell in row.cells:
            text(cell, "Photo + defect no. | Ảnh + số lỗi", 7.5, italic=True, color="999999")
        cant_split(row)


def sections_8_10(doc):
    spacer(doc)
    section_bar(doc, "8. DISPOSAL MATERIAL / PACKAGING DATA (PPWR (EU) 2025/40)",
                "8. VẬT LIỆU THẢI BỎ / DỮ LIỆU BAO BÌ (PPWR)")
    p = doc.add_paragraph()
    fmt_run(p.add_run("Applicable | Áp dụng:  "), 8.5, True)
    checkbox(p, "Yes | Có", checked=True); checkbox(p, "No | Không")
    w = [3500, 2200, 2000, 1800, 1830]
    t = table(doc, w)
    header_row(t, [("Table 1 – Packaging component", "Thành phần bao bì"), ("Material", "Vật liệu"), ("Weight per sales unit (g)", "KL / đơn vị bán (g)"),
                   ("Recycled content claim", "Tỉ lệ tái chế"), ("Remark", "Ghi chú")])
    for comp in ["Carton box | Thùng carton", "Inner carton / dividers | Vách ngăn", "Plastic bag / film | Túi / màng nhựa",
                 "Foam / corner protectors | Xốp / bọc góc", "Label / leaflet paper | Nhãn / HDSD", "Strap / tape | Dây đai / băng keo"]:
        r = add_row(t); text(r.cells[0], comp, 8); cant_split(r)
    spacer(doc)
    w = [5665, 5665]
    t = table(doc, w)
    header_row(t, [("Table 2 – Batteries / lamps", "Pin / bóng đèn"), ("Status", "Tình trạng")])
    r = add_row(t); text(r.cells[0], "Batteries or lamps included | Có pin hoặc bóng đèn", 8.5)
    dropdown(r.cells[1].paragraphs[0], ["N/A", "Yes"], selected="N/A")
    spacer(doc)
    section_bar(doc, "9. OTHER REQUIREMENTS", "9. YÊU CẦU KHÁC")
    p = doc.add_paragraph(); fmt_run(p.add_run("Any other Ally requirement | Yêu cầu khác của Ally:  "), 8.5, True)
    checkbox(p, "Yes | Có"); checkbox(p, "No | Không", checked=True)
    spacer(doc)
    section_bar(doc, "10. CLOSE MEETING", "10. HỌP KẾT THÚC")
    t = table(doc, [W_TOTAL])
    c = t.rows[0].cells[0]
    bi(c, "Findings were explained to the factory representative. The factory acknowledges the results above; the final decision (SRC) is issued by A.R.E.N.A. QS, not by the inspector.",
       "Kết quả đã được giải thích cho đại diện nhà máy. Nhà máy xác nhận kết quả; quyết định cuối cùng (SRC) do QS A.R.E.N.A. ban hành, không phải người kiểm.", 8.5)
    text(c, f"Factory representative (name, signature): {C.PH}        Inspector: {C.PH}        Date: {C.PH}", 8.5, first=False)
    cant_split(t.rows[0])


def photos(doc):
    p = doc.add_paragraph(); p.add_run().add_break(WD_BREAK.PAGE)
    section_bar(doc, "INSPECTION PHOTOS", "HÌNH ẢNH KIỂM TRA", fill=BLUE)
    t = table(doc, [3776, 3777, 3777], rows=0)
    seq = [lbl for _, lbl in C.PHOTO_IDS]
    for i in range(11):
        r = add_row(t)
        r.height = Inches(1.55)
        for c in r.cells:
            text(c, "", 7)
        cant_split(r)
        r2 = add_row(t)
        for c in r2.cells:
            p = c.paragraphs[0]
            fmt_run(p.add_run("Sequence: "), 7.5, True)
            dropdown(p, seq, size=7)
        cant_split(r2)


def guideline(doc, figs):
    p = doc.add_paragraph(); p.add_run().add_break(WD_BREAK.PAGE)
    section_bar(doc, f"ARENA FRI STANDARD – SACK TRUCK (NON-POWERED) – {C.DOC_ID}",
                f"TIÊU CHUẨN FRI ARENA – XE ĐẨY TAY 2 BÁNH (KHÔNG ĐỘNG CƠ) – {C.DOC_ID}", fill=CORAL)
    # control block
    w = [2600, 3065, 2600, 3065]
    t = table(doc, w, rows=0)
    ctl = [(("Document ID", "Mã tài liệu"), C.DOC_ID), (("Version", "Phiên bản"), C.VERSION),
           (("Status", "Tình trạng"), C.STATUS + " – DRAFT, not usable as validation benchmark"), (("Owner", "Chủ sở hữu"), "QS"),
           (("Approver (name, date)", "Người duyệt (tên, ngày)"), C.PH), (("Effective date", "Ngày hiệu lực"), C.PH),
           (("Destination market", "Thị trường"), C.MARKET), (("P.O. annex", "Phụ lục P.O."), "Generic – P.O. " + C.PH)]
    for i in range(0, len(ctl), 2):
        r = add_row(t)
        for j in range(2):
            (en, vi), val = ctl[i + j]
            shade(r.cells[j * 2], "E8ECF4"); bi(r.cells[j * 2], en, vi, 8.5, True)
            text(r.cells[j * 2 + 1], val, 8.5, bold=("DRAFT" in val), color="C00000" if "DRAFT" in val else None)
        cant_split(r)
    spacer(doc)
    gp = doc.add_paragraph()
    fmt_run(gp.add_run("Order of precedence | Thứ tự ưu tiên: "), 8.5, True)
    fmt_run(gp.add_run("EU law and any OJ-cited standard → Ally protocol / QC Pack → ARENA FRI Standard → inspector practice. The ARENA standard never relaxes a higher-level requirement."), 8.5)
    gp = doc.add_paragraph()
    fmt_run(gp.add_run("Luật EU và tiêu chuẩn được trích dẫn OJ → quy trình Ally / QC Pack → Tiêu chuẩn FRI ARENA → thực hành của người kiểm."), 7.5, italic=True, color="7F7F7F")
    gp = doc.add_paragraph()
    fmt_run(gp.add_run("Scope | Phạm vi: "), 8.5, True)
    fmt_run(gp.add_run("Used by A.R.E.N.A. QC or an appointed inspection body for FRI of manual two-wheel sack trucks (steel or aluminium frame, fixed or folding toe plate, solid / pneumatic / puncture-proof wheels) shipped to the EU-27, EEA-3 or Northern Ireland. Legal stream: GPSR (EU) 2023/988 only – NO CE marking. Manual sack trucks are outside the Machinery Regulation (EU) 2023/1230 (no drive other than directly applied human effort, no lifting function) – stair-climbers or nose-lift designs must be re-classified (O3). A.R.E.N.A. is a sourcing office only: never manufacturer, importer or GPSR responsible person."), 8.5)
    spacer(doc)
    bi_heading(doc, "Standards and legal sources referenced", "Tiêu chuẩn và văn bản pháp lý tham chiếu")
    w = [700, 2400, 2700, 2730, 2800]
    t = table(doc, w)
    header_row(t, [("Market", "TT"), ("Standard / act", "Tiêu chuẩn / luật"), ("Source used", "Nguồn"), ("Status", "Tình trạng"), ("Clauses / values used", "Điều khoản / giá trị")])
    for row in C.STANDARDS_REF:
        r = add_row(t)
        for c, v in zip(r.cells, row):
            text(c, v, 7.5)
        cant_split(r)
    para(doc, "Figures are original A.R.E.N.A. schematics; no figure of any standard is reproduced (copyright of CEN / ISO). QS verifies values against licensed copies before release.", 7.5, italic=True, color="555555")
    # B equipment
    spacer(doc); bi_heading(doc, "B. Equipment", "B. Dụng cụ")
    t = table(doc, [4200, 3800, 1800, 1530])
    header_row(t, [("Tool", "Dụng cụ"), ("Dụng cụ (VI)", ""), ("Resolution", "Độ phân giải"), ("Used in", "Dùng cho")])
    for en, vi, res, use in C.EQUIPMENT:
        r = add_row(t)
        text(r.cells[0], en, 8, True); text(r.cells[1], vi, 7.5, italic=True, color="7F7F7F"); text(r.cells[2], res, 8); text(r.cells[3], use, 8)
        cant_split(r)
    para(doc, "Record instrument ID and calibration due date in the report; out-of-calibration tools are not used. | Ghi mã thiết bị và hạn hiệu chuẩn; không dùng dụng cụ quá hạn.", 7.5, italic=True, color="555555")
    # C sampling
    spacer(doc); bi_heading(doc, "C. Sampling and acceptance numbers (ISO 2859-1, single normal, Level II, AQL Ma 1.5 / Mi 4.0, Cri 0)", "C. Lấy mẫu và số chấp nhận")
    t = table(doc, [2000, 1300, 1300, 2600, 2130, 2000])
    header_row(t, [("Lot size", "Cỡ lô"), ("Code", "Mã"), ("n", "n"), ("Major 1.5 Ac/Re", "Nặng Ac/Re"), ("Minor 4.0 Ac/Re", "Nhẹ Ac/Re"), ("S-3 n", "S-3 n")])
    for row in C.SAMPLING_TABLE:
        r = add_row(t)
        for c, v in zip(r.cells, row):
            text(c, v, 8, color="C00000" if "VERIFY" in v else None)
        cant_split(r)
    para(doc, "Critical Ac 0 / Re 1 always. Open ≥ √(cartons) from different pallets. Each SKU / variant is its own lot. Special check list: 3 pcs per SKU. QS verifies this table against ISO 2859-1 Table 1 / 2-A before release.", 7.5, italic=True, color="555555")
    # D steps
    spacer(doc); bi_heading(doc, "D. Step-by-step procedure", "D. Quy trình từng bước")
    t = table(doc, [700, 2300, 5330, 1300, 1700])
    header_row(t, [("Step", "Bước"), ("Content", "Nội dung"), ("What to do (requirement IDs)", "Việc cần làm"), ("Report item", "Mục báo cáo"), ("Photo", "Ảnh")])
    for i, (s, en, vi, bullets, item, ph) in enumerate(C.STEPS):
        r = add_row(t)
        text(r.cells[0], s, 8, True)
        bi(r.cells[1], en, vi, 8, True)
        for j, b in enumerate(bullets):
            text(r.cells[2], "• " + b, 7.5, first=(j == 0))
        text(r.cells[3], item, 8); text(r.cells[4], ph, 8)
        if i % 2:
            for c in r.cells:
                shade(c, "F4F6FA")
        cant_split(r)
    # verdict
    spacer(doc); bi_heading(doc, "Verdict rules (step D13)", "Quy tắc kết luận (bước D13)")
    t = table(doc, [1300, 10030])
    header_row(t, [("ID", "Mã"), ("Rule", "Quy tắc")])
    for id_, en, vi in C.VERDICT:
        r = add_row(t); text(r.cells[0], id_, 8, True); bi(r.cells[1], en, vi, 8); cant_split(r)
    # E special check list
    p = doc.add_paragraph(); p.add_run().add_break(WD_BREAK.PAGE)
    bi_heading(doc, "E. Special check list – figures and method", "E. Danh sách kiểm tra đặc biệt – hình và phương pháp")
    picture(doc, figs[0], 7.6)
    picture(doc, figs[1], 7.6)
    t = table(doc, [1150, 500, 2300, 600, 3300, 2280, 1200])
    header_row(t, [("ID", "Mã"), "Ref", ("Check point", "Điểm kiểm"), "Fig.", ("How to measure", "Cách đo"), ("Limit (EU)", "Giới hạn"), ("Photo", "Ảnh")])
    for id_, ref, en, vi, fig, how, lim, tool, ph in C.MATRIX:
        r = add_row(t)
        text(r.cells[0], id_, 7.5, True); text(r.cells[1], ref, 8, True, "C00000"); bi(r.cells[2], en, vi, 7.5)
        text(r.cells[3], fig, 8); text(r.cells[4], f"{how} – {tool}", 7.5); text(r.cells[5], lim, 7.5); text(r.cells[6], ph, 8)
        cant_split(r)
    para(doc, "Record every reading of the 3 samples and the worst value – never only 'Pass'. A visual estimate is not accepted where a gauge exists. Out-of-limit value = Major unless the row states Critical; hold the lot and inform QS the same day.", 7.5, italic=True, color="555555")
    # F photos
    spacer(doc); bi_heading(doc, "F. Mandatory photo list", "F. Danh sách ảnh bắt buộc")
    t = table(doc, [1100, 4565, 1100, 4565])
    header_row(t, [("ID", "Mã"), ("Photo", "Ảnh"), ("ID", "Mã"), ("Photo", "Ảnh")])
    half = (len(C.PHOTO_IDS) + 1) // 2
    for i in range(half):
        r = add_row(t)
        a = C.PHOTO_IDS[i]
        text(r.cells[0], a[0], 7.5, True); text(r.cells[1], a[1], 7.5)
        if i + half < len(C.PHOTO_IDS):
            b = C.PHOTO_IDS[i + half]
            text(r.cells[2], b[0], 7.5, True); text(r.cells[3], b[1], 7.5)
        cant_split(r)
    # G open points & lessons
    spacer(doc); bi_heading(doc, "G. Open points and lessons", "G. Điểm mở và bài học")
    t = table(doc, [600, 3800, 3530, 700, 2700])
    header_row(t, [("No.", "Số"), ("Observation", "Quan sát"), ("Rule / action", "Hành động"), ("Owner", "PT"), ("Linked IDs", "Mã liên quan")])
    for row in C.OPEN_POINTS:
        r = add_row(t)
        for c, v in zip(r.cells, row):
            text(c, v, 7.5)
        cant_split(r)
    spacer(doc)
    for l in C.LESSONS:
        para(doc, "• " + l, 8)
    spacer(doc); bi_heading(doc, "Revision table", "Bảng sửa đổi")
    t = table(doc, [1200, 1600, 8530])
    header_row(t, [("Version", "Phiên bản"), ("Date", "Ngày"), ("Change", "Thay đổi")])
    for row in C.REVISIONS:
        r = add_row(t)
        for c, v in zip(r.cells, row):
            text(c, v, 8)


def bi_heading(doc, en, vi):
    p = doc.add_paragraph()
    p.paragraph_format.keep_with_next = True
    fmt_run(p.add_run(en), 10, True, color=NAVY)
    q = doc.add_paragraph()
    q.paragraph_format.keep_with_next = True
    fmt_run(q.add_run(vi), 8.5, italic=True, color="7F7F7F")


def ensure_cell_end_paragraph(doc):
    for tc in doc.element.body.iter(qn("w:tc")):
        kids = [k for k in tc if k.tag != qn("w:tcPr")]
        if kids and kids[-1].tag == qn("w:tbl"):
            tc.append(el("w:p"))


def main(out, figdir):
    figs = [f"{figdir}/fig1_tro_points.png", f"{figdir}/fig2_tro_tests.png"]
    doc = Document()
    setup(doc)
    build_header_footer(doc)
    general_info(doc)
    summary(doc)
    details(doc, figs)
    table2(doc)
    defects(doc)
    sections_8_10(doc)
    photos(doc)
    guideline(doc, figs)
    ensure_cell_end_paragraph(doc)
    order_tblpr(doc)
    # unique docPr ids
    for i, d in enumerate(doc.element.body.iter(qn("wp:docPr")), 1):
        d.set("id", str(i))
    doc.save(out)
    print("saved", out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
