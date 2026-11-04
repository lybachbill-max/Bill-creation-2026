"""Group B – Spanners & wrenches (SPN) – DEDEMAN P0A1030690, HOLZER, EU (Greece)."""
import re
from dd_common import *  # noqa: F401,F403
import dd_common as B

CAT = "SPN"
DOC_ID = f"ARENA-FRI-STD-{CAT}-{B.VERSION}"
CATEGORY = "Spanners & wrenches (HOLZER) – DEDEMAN P0A1030690"
CATEGORY_VI = "Cờ lê & chìa vặn (HOLZER)"
TITLE_EN = "SPANNERS & WRENCHES – DEDEMAN P0A1030690"
TITLE_VI = "CỜ LÊ & CHÌA VẶN – DEDEMAN P0A1030690"
SKUS = B.skus(refs_prefixes=["326", "230", "240", "250"])
TABLE1 = B.table1(SKUS)
FIGS = ["fig_spn_points.png", "fig_spn_tests.png"]
FIG_CAPTION = ("Critical points – see Fig. B1 (A open-end / combination, B section & head angle, C L-socket) and Fig. B2 (on-site checks):",
               "Điểm quan trọng – xem Hình B1 và Hình B2:")
MATRIX_NOTE = ("Matrix note: no OJ-cited EN for hand spanners (SoA). The P.O. cites DIN 3110 (open-end) and DIN 3113 (combination); "
               "opening tolerances per DIN ISO 691 and proof torque per DIN ISO 1711-1 – values from A.R.E.N.A.'s licensed copies "
               "(QS to fill, current editions to be verified). Proof torque = lab report only. | Ghi chú: không có EN hài hòa; "
               "dung sai miệng theo DIN ISO 691 – QS điền giá trị.")
SCOPE = ("Used by A.R.E.N.A. QC or an appointed inspection body for the FRI of HOLZER spanners supplied by Gripwell Forgings & Tools "
         "(India) to DEDEMAN for Greece: L-socket wrenches 6×12-point with through hole (326/…), elliptical double open-end "
         "spanners (230/…), elliptical combination spanners (240/…), elliptical ring spanners (250/…) and 7 sets on recessed panels / "
         "plastic hangers – 31CrV3 chrome-vanadium, satin or chrome finish. Legal stream: GPSR (EU) 2023/988 – NO CE marking. "
         "DEDEMAN (HOLZER own brand) is the GPSR manufacturer; Gripwell is the producer. A.R.E.N.A. is a sourcing office only: "
         "never manufacturer, importer or GPSR responsible person.")

DOCS = B.docs(CAT, "Accredited lab report per spanner type: proof torque (DIN ISO 1711-1), hardness, opening dimensions (DIN ISO 691 / "
              "DIN 3110 / DIN 3113), corrosion protection – no., lab, date ≤ 2 years, valid at ETD, supplier refs shown",
              "Báo cáo PTN theo loại cờ lê: mô-men thử (DIN ISO 1711-1), độ cứng, kích thước miệng (DIN ISO 691 / DIN 3110 / 3113), chống ăn mòn")

ITEMS = {
    1: B.item1(CAT),
    2: B.item2(CAT, "Protection: each spanner on its card / panel / hanger as P.O.; cards not bent; sets held in panel; inner bundles "
                    "per P.O. (pcs/inner); no metal-to-metal rubbing damage; anti-rust protection intact",
               "Bảo vệ: mỗi cờ lê trên thẻ / khay / móc như P.O.; thẻ không cong; bộ giữ chắc trong khay; bó theo P.O.; không trầy; còn chống gỉ"),
    3: B.item3(CAT, "Marking on each tool: size(s) in mm on both ends, HOLZER, material 'CrV' (31CrV3) as approved, DIN no. only if "
                    "supported by DOC-07; batch / type identification on tool or card – GPSR Art. 9(5)",
               "Ghi trên dụng cụ: cỡ (mm) hai đầu, HOLZER, 'CrV', số DIN chỉ khi có DOC-07; số lô / kiểu trên dụng cụ hoặc thẻ – Điều 9(5)",
               extra=[(f"{CAT}-D05-09", "Set panel / hanger: piece count and sizes printed = actual tools in the set and their positions; 'DIN 3110 / DIN 3113' printed only with DOC-07",
                       "Khay / móc bộ: số chiếc và cỡ in = thực tế và vị trí; 'DIN 3110 / 3113' chỉ khi có DOC-07", "II"),
                      (f"{CAT}-D05-10", "Spelling on card / panel as approved (P.O. descriptions contain 'Eliptical', 'Seel', 'Bramnd' – not to appear on print unless approved)",
                       "Chính tả trên thẻ / khay như đã duyệt (P.O. có lỗi 'Eliptical', 'Seel', 'Bramnd')", "II")]),
    4: B.item4(CAT, "vs golden sample: type (open-end / combination / ring / L-socket), elliptical shank, head angle and offset, finish "
                    "(satin / chrome / matt), laser or electro marking, card / panel / hanger design",
               "So với mẫu chuẩn: loại, thân elip, góc đầu & độ lệch, lớp hoàn thiện, khắc laser, thẻ / khay / móc"),
    6: ("Workmanship", "Tay nghề / ngoại quan", [
        (f"{CAT}-D07-01", "Safety check: no crack in head, jaw or ring (forging lap / quench crack); no burr or sharp edge in openings; L-socket weld/bend without crack",
         "An toàn: không nứt đầu, miệng, vòng (gấp nếp rèn / nứt tôi); không bavia trong miệng; cờ lê L không nứt ở góc uốn", "S-3"),
        (f"{CAT}-D07-02", "Finish: chrome / satin plating uniform, no peeling, blisters, rust, pits, bare spots (zone A openings & ring, B shank, C inside socket)",
         "Lớp mạ đều, không bong, phồng, gỉ, rỗ, hở (vùng A miệng & vòng, B thân, C trong ống)", "II"),
        (f"{CAT}-D07-03", "Forging & machining: openings clean and symmetric, 12-point rings fully broached, no flash; shank straight, no twist",
         "Rèn & gia công: miệng sạch, đối xứng, vòng 12 cạnh đủ, không ba via; thân thẳng, không xoắn", "II"),
        (f"{CAT}-D07-04", "Marking: laser / electro marking complete, legible, aligned", "Khắc: đầy đủ, rõ, thẳng hàng", "II"),
        (f"{CAT}-D07-05", "Packaging hold: card / hanger / panel not cracked, tool retained, clip intact", "Thẻ / móc / khay không nứt, giữ chắc dụng cụ", "II"),
    ]),
}

MATRIX = [
    (f"{CAT}-D09-01", "s", "Opening / ring size, each end", "Cỡ miệng / vòng mỗi đầu", "B1-A, B2", "GO / NO-GO gauge, or caliper across flats at the jaw centre (ring: across flats of 12-point)", "Nominal + DIN ISO 691 tol. (QS to fill)", "GO/NO-GO set / caliper 0.01 mm", "P24"),
    (f"{CAT}-D09-02", "l", "Overall length", "Chiều dài tổng", "B1-A", "Rule / caliper end to end", "Drawing ± tol. table", "Rule 1 mm", "P25"),
    (f"{CAT}-D09-03", "β", "Head angle / ring offset", "Góc đầu / độ lệch vòng", "B1-B", "Protractor against shank axis", "Drawing (15° typical – QS)", "Protractor 1°", "P26"),
    (f"{CAT}-D09-04", "l1/l2", "L-socket legs; through hole present (326/…)", "Chân cờ lê L; lỗ xuyên (326/…)", "B1-C", "Rule; check through hole on short elbow by sight", "Drawing; hole present", "Rule 1 mm", "P27"),
    (f"{CAT}-D09-05", "m", "Net weight", "Khối lượng tịnh", "—", "Scale", "P.O. NW ± 10 %*", "Scale 1 g", "P28"),
    (f"{CAT}-D09-06", "set", "Set content (sets)", "Thành phần bộ", "—", "Count pieces, read sizes vs description and panel print", "= P.O. description", "—", "P29"),
    (f"{CAT}-D09-07", "HRC", "Hardness (info)", "Độ cứng (tham khảo)", "—", "File test on shank; portable tester if equipped", "File skids; HRC per drawing (QS)", "File / tester", "P30"),
]

TESTS = [
    (f"{CAT}-T1", "Opening gauge check", "Kiểm tra cỡ miệng", "3 pcs/SKU",
     "Every end of every sample: GO gauge enters, NO-GO does not (Fig. B2); without gauges, caliper at jaw centre, record value.",
     "Within DIN ISO 691 tolerance for the nominal size (QS to fill). Out of tolerance = Major; NO-GO enters = Major."),
    (f"{CAT}-T2", "Fit on hex gauge / nut", "Lắp vừa lục giác chuẩn", "S-3",
     "Fit each end on a reference hex nut/bolt head of the nominal size; turn by hand in both directions.",
     "Full engagement, no rocking that lets the jaw ride off the flats, ring seats fully. Slips off = Major."),
    (f"{CAT}-T3", "Hardness spot check", "Kiểm tra độ cứng", "3 pcs/SKU family",
     "File test on shank near head; portable hardness tester if available (record HRC).", "File skids (hardened); HRC per drawing/test report. Soft = Critical (risk of opening/breaking under torque)."),
    (f"{CAT}-T4", "Plating / finish check", "Kiểm tra lớp mạ", "S-3",
     "Inspect under lamp, scrape test with fingernail at jaw edge, check inside openings and socket.", "No peeling, blister, rust. Peeling/rust = Major."),
    (f"{CAT}-T5", "Marking durability", "Độ bền ký hiệu", "3 pcs",
     "Rub laser / electro marking 15 s with cloth + light oil.", "Size and brand remain legible. Illegible size = Major."),
    (f"{CAT}-T6", "Set holder retention (sets)", "Giữ dụng cụ trong khay (bộ)", "S-3",
     "Hold the set panel / hanger upside down and shake 5 times; remove and refit each tool.",
     "No tool falls out; panel/hanger not cracked; sizes in right positions. Tool falls out = Minor; missing tool = Major."),
    (f"{CAT}-T7", "Barcode scan", "Quét mã vạch", "5 pcs/SKU", "Scan card / panel EAN and carton code; write digits.", "Readable and = approved print file (P.O. EANs inconsistent – O1). Wrong = Major."),
    (f"{CAT}-T8", "Card / label rub test", "Thử chà thẻ / nhãn", "3 pcs", "Rub printed label 15 s wet + 15 s dry.", "Legible, not peeling. Fail = Minor."),
    (f"{CAT}-T9", "Carton drop test", "Thử rơi thùng", "1 ctn/sub-family",
     "1 corner, 3 edges, 6 faces; ≤ 9.5 kg 76 cm, 9.5–18.6 kg 61 cm, 18.6–27.7 kg 46 cm* (ARENA practice unless DEDEMAN spec).",
     "No product or card damage that makes the item unsaleable. Damage = Major."),
]

GROUP_DEFECTS = [
    ("Crack in head / jaw / ring (forging lap, quench crack)", "Nứt đầu / miệng / vòng", "Cri", f"{CAT}-D07-01"),
    ("Soft tool (file bites) – hardness not achieved", "Dụng cụ mềm (giũa ăn) – không đạt độ cứng", "Cri", f"{CAT}-T3"),
    ("Burr / sharp edge in opening", "Bavia / cạnh sắc trong miệng", "Cri", f"{CAT}-D07-01"),
    ("Opening out of tolerance / NO-GO enters", "Cỡ miệng ngoài dung sai / calip không lọt bị lọt", "Maj", f"{CAT}-T1"),
    ("Slips off hex gauge / ring not seating", "Trượt khỏi lục giác / vòng không vào", "Maj", f"{CAT}-T2"),
    ("Wrong size marked / size marking illegible", "Ghi sai cỡ / cỡ không rõ", "Maj", f"{CAT}-D05-03"),
    ("Plating peeling / rust / pits", "Bong mạ / gỉ / rỗ", "Maj", f"{CAT}-T4"),
    ("Set content or sizes differ from description / panel print", "Bộ thiếu / sai cỡ so với mô tả / in", "Maj", f"{CAT}-D09-06"),
    ("DIN claim without test report", "Ghi DIN không có báo cáo thử", "Maj", f"{CAT}-D05-09"),
    ("Tool falls out of panel / hanger", "Dụng cụ rơi khỏi khay / móc", "Min", f"{CAT}-T6"),
    ("Cosmetic marks zone B / marking misaligned", "Vết vùng B / khắc lệch", "Min", f"{CAT}-D07-04"),
]
DEFECTS = B.defects(CAT, GROUP_DEFECTS)

EQUIPMENT = [
    ("GO / NO-GO gauge set for 6–32 mm (or plug gauges)", "Bộ calip lọt/không lọt 6–32 mm", "per DIN ISO 691", "T1, D09-01"),
    ("Digital caliper 150 mm", "Thước kẹp điện tử 150 mm", "0.01 mm", "T1, D09-01/04"),
    ("Reference hex nuts / bolt heads 6–32 mm", "Đai ốc / đầu bu lông lục giác chuẩn 6–32 mm", "—", "T2"),
    ("Steel rule 500 mm", "Thước lá 500 mm", "1 mm", "D09-02/04"),
    ("Protractor", "Thước đo góc", "1°", "D09-03"),
    ("Scale 0–3 kg", "Cân 0–3 kg", "1 g", "D09-05"),
    ("Hardness test file; portable hardness tester if available", "Giũa thử cứng; máy đo độ cứng cầm tay", "—", "T3, D09-07"),
    ("Lamp, 3× lens, barcode scanner, cloth + light oil", "Đèn, kính lúp 3×, máy quét, giẻ + dầu nhẹ", "—", "T4–T8"),
]
SAMPLING_TABLE = B.SAMPLING_TABLE
STEPS = B.steps(CAT, [f"{CAT}-T1…T9 – written method + criterion; proof-torque test only in the lab report (DOC-07)"],
                [f"{CAT}-D09-01…07 3 pcs/SKU; every end of every sample", "Record actual EAN digits per SKU (O1)"])
VERDICT = B.verdict(CAT)
PHOTO_IDS = B.photo_ids(CAT, ["Sub-family views (L-socket, open-end, combination, ring, sets)", "Opening GO/NO-GO per end", "Length l",
                              "Head angle β", "L-socket through hole", "Net weight", "Set content vs panel print", "Hardness file test",
                              "T2 hex fit", "T4 plating close-up", "T5 marking rub", "T6 set shake test"])
STANDARDS_REF = B.SHARED_STANDARDS + [
    ("DE (EU national)", "DIN 3110 (open-end) / DIN 3113 (combination)", "Cited in P.O. – licensed copy not opened", "SoA – edition to verify", "Dimensions, marking (QS to fill)"),
    ("DE (EU national)", "DIN ISO 691 (opening tolerances)", "Licensed copy not opened", "SoA – edition to verify", "T1 tolerances (QS to fill)"),
    ("DE (EU national)", "DIN ISO 1711-1 (technical requirements, proof torque)", "Licensed copy not opened", "SoA – edition to verify", "Lab report DOC-07 only"),
]
OPEN_POINTS = B.SHARED_OPEN + [
    ("O6", "Opening tolerances / proof torque values not in public EU excerpts", "QS fill from licensed DIN ISO 691 / DIN ISO 1711-1 before FRI", "QS", f"{CAT}-T1, {CAT}-D09-01"),
    ("O7", "P.O. qty / pcs per carton not integer: 326/2843 (160 / 60), 240/2044 (1 000 / 120)", "Supplier to confirm carton split", "QS", f"{CAT}-D02-01"),
    ("O8", "240/0392 (12-pc set, Ally 647250) has no line number in the P.O.", "Confirm the SKU is ordered (qty 1 488)", "QS", f"{CAT}-D02-01"),
    ("O10", "250/2339 and 250/2908 are both described as 16×17 mm ring spanners (different Ally codes 646452 / 646453)", "Supplier/DEDEMAN to confirm sizes", "QS", f"{CAT}-D09-01"),
    ("O9", "'Recyclable paper card' claim on most SKUs", "Basis in DOC-09; wording per approved print file", "QS", f"{CAT}-D05-08"),
]
LESSONS = B.SHARED_LESSONS + ["Check every end of every sample – mixed-up forging dies give a wrong size on one end only."]
REVISIONS = B.REVISIONS


def _sizes(desc):
    d = desc.replace(" ", "")
    m = re.findall(r"(\d{1,2}x\d{1,2})mm", d, re.I) or re.findall(r"(\d{1,2})mm", d, re.I)
    return m[0] if m else "per description"


_HEAD = [("ID", "Mã"), ("SKU", "Mã hàng"), ("Nominal s (mm)", "Cỡ danh nghĩa"), "s S1", "s S2", "s S3",
         ("l / β / weight", "Dài / góc / KL"), ("Marking & finish", "Ký hiệu & mạ"), ("Result", "Kết quả")]
_W = [1150, 1050, 1500, 1050, 1050, 1050, 1450, 1530, 1500]
_FAMS = [("326", "L-socket wrenches 6×12-point", "Cờ lê ống chữ L"), ("230", "Elliptical double open-end spanners (DIN 3110)", "Cờ lê 2 đầu miệng"),
         ("240", "Elliptical combination spanners (DIN 3113)", "Cờ lê vòng miệng"), ("250", "Elliptical ring spanners", "Cờ lê 2 đầu vòng")]
TABLE2_BLOCKS = []
for i, (pre, en, vi) in enumerate(_FAMS):
    rows = [[f"{CAT}-D09-01", k["ref"], _sizes(k["desc"]), "", "", "", "", "", None]
            for k in SKUS if k["ref"].startswith(pre) and "SET" not in k["desc"].upper()]
    TABLE2_BLOCKS.append(dict(title=(f"{en} – {len(rows)} SKUs · 3 pcs per SKU, each end", f"{vi} – 3 mẫu / SKU, mỗi đầu"),
                              page_break=(i == 0 or i == 2), head=_HEAD, widths=_W, rows=rows))
_sets = [k for k in SKUS if "SET" in k["desc"].upper()]
TABLE2_BLOCKS.append(dict(
    title=(f"Sets – {len(_sets)} SKUs · content check D09-06 + opening check T1 on every piece of 3 sets", "Bộ – kiểm tra thành phần + cỡ miệng mọi chiếc của 3 bộ"),
    page_break=True,
    head=[("ID", "Mã"), ("SKU", "Mã hàng"), ("Content per P.O.", "Thành phần theo P.O."), ("Set 1", "Bộ 1"), ("Set 2", "Bộ 2"), ("Set 3", "Bộ 3"),
          ("Holder", "Khay/móc"), ("Panel print = content", "In khay = thực tế"), ("Result", "Kết quả")],
    widths=[1150, 1050, 2900, 850, 850, 850, 1000, 1180, 1500],
    rows=[[f"{CAT}-D09-06", k["ref"], re.sub(r",\s*31CrV3.*", "", k["desc"])[:110], "", "", "", "", "", None] for k in _sets]))
