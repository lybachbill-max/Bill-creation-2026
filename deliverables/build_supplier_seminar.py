from seminar_helpers import *

N = 9
VNC = "3C6E8F"  # Globe Blue tint for Vietnamese lines

def header(s, n, title, vn):
    rect(s, 0, 0, 0.18, 7.5, CORAL)
    text(s, 0.5, 0.25, 12.3, 0.6, title, size=24, bold=True, color=NAVY)
    text(s, 0.5, 0.8, 12.3, 0.35, vn, size=14, color=BLUE, font="Arial Narrow")
    rect(s, 0.55, 1.2, 1.2, 0.05, CORAL)
    text(s, 0.5, 7.08, 10, 0.3,
         "A.R.E.N.A. Vietnam · Quality Activities Seminar for Suppliers · Hội thảo Chất lượng dành cho Nhà cung cấp · Nov 2026",
         size=8, color=GREY)
    text(s, 12.2, 7.08, 0.7, 0.3, f"{n} / {N}", size=8, color=GREY, align=PP_ALIGN.RIGHT)

def bi(items, size=10, bullet="• "):
    """items: list of (en, vn) -> paragraphs EN then VN (italic, blue)."""
    out = []
    for en, vn in items:
        out.append([(bullet + en if bullet else en, {"size": size})])
        out.append([(("   " if bullet else "") + vn, {"size": size - 1, "italic": True, "color": VNC, "font": "Arial Narrow"})])
    return out

def label(s, x, y, w, en, vn, color=CORAL_D):
    text(s, x, y, w, 0.3, [[(en.upper(), {"bold": True, "size": 10}), ("  ·  " + vn.upper(), {"size": 9, "font": "Arial Narrow"})]],
         color=color)

# ---------------- 1. Cover ----------------
s = prs.slides.add_slide(BL)
rect(s, 0, 0, 13.333, 7.5, NAVY)
rect(s, 9.75, 1.3, 4.3, 4.3, CORAL, shape=MSO_SHAPE.OVAL)
rect(s, 9.95, 1.62, 4.0, 4.0, NAVY, shape=MSO_SHAPE.OVAL)
rect(s, 10.35, 2.05, 3.2, 3.2, BLUE, shape=MSO_SHAPE.OVAL)
text(s, 0.8, 0.7, 6, 0.5, "a.r.e.n.a.", size=22, bold=True, color=WHITE)
text(s, 0.8, 1.9, 9, 1.6, ["Quality Activities Seminar", "for Suppliers 2026–2027"], size=38, bold=True, color=WHITE)
rect(s, 0.85, 3.55, 1.6, 0.06, CORAL)
text(s, 0.8, 3.75, 9, 0.9, ["Hội thảo Hoạt động Chất lượng", "dành cho Nhà cung cấp 2026–2027"], size=20, color="BFD8E4", font="Arial Narrow")
text(s, 0.8, 4.95, 9, 0.9,
     [[("For established and prospective suppliers", {"size": 14})],
      [("Dành cho nhà cung cấp hiện hữu và tiềm năng", {"size": 13, "italic": True, "color": "BFD8E4", "font": "Arial Narrow"})]],
     color=WHITE)
text(s, 0.8, 6.55, 9, 0.4, "A.R.E.N.A. Vietnam · Quality & Compliance · November 2026", size=10, color="9AA3B5")

# ---------------- 2. Who we are + agenda ----------------
s = prs.slides.add_slide(BL)
header(s, 2, "Who we are and who does what", "Chúng tôi là ai và vai trò của từng bên")
label(s, 0.55, 1.4, 7.5, "Who we are", "Chúng tôi là ai")
text(s, 0.55, 1.72, 7.6, 1.6, bi([
    ("A.R.E.N.A. is a sourcing office: we connect Asian suppliers of non-food consumer products with European retail Allies.",
     "A.R.E.N.A. là văn phòng tìm nguồn: kết nối nhà cung cấp châu Á hàng tiêu dùng phi thực phẩm với các Đối tác bán lẻ châu Âu."),
    ("We are not a party to the sale. Contracts, invoices and payment run directly between you and the Ally.",
     "Chúng tôi không phải một bên của giao dịch. Hợp đồng, hóa đơn và thanh toán do Quý vị và Đối tác thực hiện trực tiếp."),
    ("Departments: GARDEN · DIY · DECO · AUTO · BUILDING.", "Ngành hàng: GARDEN · DIY · DECO · AUTO · BUILDING."),
], size=11), spacing=1)
rows = [("Supplier / Producer", "Nhà cung cấp / Nhà sản xuất",
         "Makes the product, holds test evidence and technical file, signs DoC/DoP where it is the manufacturer.",
         "Sản xuất, lưu bằng chứng thử nghiệm và hồ sơ kỹ thuật, ký DoC/DoP khi là nhà sản xuất.", BLUE),
        ("Ally (retailer)", "Đối tác (nhà bán lẻ)",
         "Buys and imports. On own-brand / private-label items the Ally is the manufacturer.",
         "Mua và nhập khẩu. Với hàng nhãn riêng, Đối tác là nhà sản xuất.", CORAL_D),
        ("A.R.E.N.A.", "A.R.E.N.A.",
         "Guides, verifies and inspects. Never manufacturer, importer or GPSR responsible person.",
         "Hướng dẫn, xác minh và kiểm tra. Không bao giờ là nhà sản xuất, nhà nhập khẩu hay người chịu trách nhiệm GPSR.", NAVY)]
y = 3.75
for en, vn, d_en, d_vn, col in rows:
    rect(s, 0.55, y, 2.1, 0.85, col)
    text(s, 0.6, y, 2.0, 0.85, [[(en, {"bold": True, "size": 11})], [(vn, {"size": 9, "font": "Arial Narrow"})]],
         color=WHITE, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, 2.68, y, 5.47, 0.85, NAVY_T)
    text(s, 2.75, y, 5.35, 0.85, bi([(d_en, d_vn)], size=10, bullet=""), anchor=MSO_ANCHOR.MIDDLE)
    y += 0.9
rect(s, 0.55, 6.5, 7.6, 0.45, "FFFFFF", line=BLUE)
text(s, 0.65, 6.5, 7.45, 0.45,
     [[("Markets / Thị trường: ", {"bold": True, "color": BLUE}),
       ("EU-27 · EEA-3 · CH · GB · NI · CA · US — NI follows EU rules (CE; UKCA not valid in NI).", {})]],
     size=9.5, anchor=MSO_ANCHOR.MIDDLE)
# agenda
rect(s, 8.55, 1.4, 4.3, 5.55, NAVY)
text(s, 8.75, 1.5, 4.0, 0.5, [[("Agenda", {"bold": True, "size": 16})], [("Chương trình", {"size": 11, "font": "Arial Narrow", "color": "BFD8E4"})]], color=WHITE)
ag = [("How we work together", "Cách chúng ta phối hợp"),
      ("Compliance and technical documents", "Hồ sơ tuân thủ và kỹ thuật"),
      ("Supplier qualification and production control", "Đánh giá nhà cung cấp và kiểm soát sản xuất"),
      ("QMS and CSR requirements", "Yêu cầu QMS và CSR"),
      ("Packaging and artwork L0–L3", "Bao bì và thiết kế in L0–L3"),
      ("Inspection, shipment release and CAPA", "Kiểm tra, phát hành lô hàng và CAPA"),
      ("Regulatory watch 2026–2027", "Cập nhật quy định 2026–2027")]
y = 2.2
for i, (en, vn) in enumerate(ag):
    rect(s, 8.75, y + 0.05, 0.42, 0.42, CORAL, shape=MSO_SHAPE.OVAL)
    text(s, 8.75, y + 0.05, 0.42, 0.42, str(i + 3), size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER,
         anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, 9.3, y, 3.45, 0.7, [[(en, {"size": 11, "bold": True})], [(vn, {"size": 10, "italic": True, "font": "Arial Narrow", "color": "BFD8E4"})]],
         color=WHITE)
    y += 0.66

# ---------------- 3. How we work together ----------------
s = prs.slides.add_slide(BL)
header(s, 3, "How we work together: three phases", "Cách chúng ta phối hợp: ba giai đoạn")
ph_detail = [
    ([("Product requirements set: compliance pathway, standards, QSD / QCP", "Xác định yêu cầu: lộ trình tuân thủ, tiêu chuẩn, QSD / QCP"),
      ("Test plan agreed; lab samples sent", "Thống nhất kế hoạch thử nghiệm; gửi mẫu đến phòng thí nghiệm")],
     "You provide: existing test reports, material declarations, product data",
     "Quý vị cung cấp: báo cáo thử nghiệm sẵn có, công bố vật liệu, dữ liệu sản phẩm"),
    ([("Factory pre-qualification and audit", "Đánh giá sơ bộ và đánh giá nhà máy"),
      ("Golden sample, milestone plan, artwork", "Mẫu chuẩn, kế hoạch tiến độ, thiết kế in")],
     "You provide: QMS evidence, capacity, FPC records, artwork files",
     "Quý vị cung cấp: bằng chứng hệ thống quản lý chất lượng, năng lực, hồ sơ FPC, file thiết kế"),
    ([("In-process and final inspection", "Kiểm tra trong sản xuất và kiểm tra cuối"),
      ("Shipment release (SRC), loading, complaints", "Phát hành lô hàng (SRC), đóng hàng, khiếu nại")],
     "You provide: ready goods on time, corrective actions, export documents",
     "Quý vị cung cấp: hàng sẵn sàng đúng hạn, hành động khắc phục, chứng từ xuất khẩu"),
]
x = 0.55
for i, (p, en, vn, col, tint) in enumerate(PH):
    chev = s.shapes.add_shape(MSO_SHAPE.CHEVRON if i else MSO_SHAPE.PENTAGON, Inches(x), Inches(1.45), Inches(4.25), Inches(0.85))
    chev.fill.solid(); chev.fill.fore_color.rgb = rgb(col); chev.line.fill.background()
    text(s, x + (0.4 if i else 0.15), 1.45, 3.5, 0.85,
         [[(f"{p} · {en}", {"size": 12, "bold": True})], [(vn, {"size": 10, "font": "Arial Narrow"})]],
         color=WHITE, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, x + 0.05, 2.4, 3.95, 1.5, tint)
    text(s, x + 0.12, 2.45, 3.8, 1.45, bi(ph_detail[i][0], size=10), spacing=1)
    rect(s, x + 0.05, 3.95, 3.95, 1.1, "FFFFFF", line=col)
    text(s, x + 0.12, 3.95, 3.8, 1.1, bi([(ph_detail[i][1], ph_detail[i][2])], size=9.5, bullet=""), anchor=MSO_ANCHOR.MIDDLE)
    x += 4.1
label(s, 0.55, 5.15, 12, "Who you will meet", "Quý vị sẽ làm việc với ai")
people = [("Quality Director", "Giám đốc Chất lượng", "Escalations, policy", "Vấn đề vượt cấp, chính sách"),
          ("Quality Supervisor (QS)", "Giám sát Chất lượng", "Your compliance contact; issues SRC", "Đầu mối tuân thủ; phát hành SRC"),
          ("Quality Controller (QC)", "Kiểm soát Chất lượng", "On-site inspections", "Kiểm tra tại nhà máy"),
          ("PPS Production", "PPS Sản xuất", "Production follow-up, bookings", "Theo dõi sản xuất, đặt lịch"),
          ("PPS Packaging", "PPS Bao bì", "Artwork files, packaging", "File thiết kế, bao bì"),
          ("PPS Logistics", "PPS Logistics", "Export documents, loading", "Chứng từ xuất khẩu, đóng hàng")]
x = 0.55
for i, (en, vn, d, dv) in enumerate(people):
    col = [NAVY, CORAL_D, BLUE, NAVY, CORAL_D, BLUE][i]
    rect(s, x, 5.5, 2.0, 0.5, col)
    text(s, x, 5.5, 2.0, 0.5, [[(en, {"bold": True, "size": 9.5})], [(vn, {"size": 8.5, "font": "Arial Narrow"})]],
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0.02)
    rect(s, x, 6.02, 2.0, 0.85, NAVY_T)
    text(s, x + 0.03, 6.02, 1.94, 0.85, [[(d, {"size": 9})], [(dv, {"size": 8.5, "italic": True, "color": VNC, "font": "Arial Narrow"})]],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    x += 2.06

# ---------------- 4. Compliance & technical documents ----------------
s = prs.slides.add_slide(BL)
header(s, 4, "Phase 1 · Compliance and technical documents", "Giai đoạn 1 · Hồ sơ tuân thủ và kỹ thuật")
label(s, 0.55, 1.4, 6, "Test reports", "Báo cáo thử nghiệm", BLUE)
rect(s, 0.55, 1.72, 6.0, 3.3, BLUE_T)
text(s, 0.65, 1.78, 5.8, 3.2, bi([
    ("From an accredited laboratory (ISO/IEC 17025).", "Do phòng thí nghiệm được công nhận (ISO/IEC 17025) cấp."),
    ("Accepted for 2 years from issue date and still valid at shipment ETD.", "Có hiệu lực 2 năm kể từ ngày cấp và phải còn hiệu lực tại ETD."),
    ("Your item reference must appear in every report and document.", "Mã hàng của Quý vị phải có trong mọi báo cáo và tài liệu."),
    ("We reuse valid reports first; retest only for gaps or expiry.", "Ưu tiên dùng báo cáo còn hiệu lực; chỉ thử lại khi thiếu hoặc hết hạn."),
], size=12), spacing=4)
label(s, 6.85, 1.4, 6, "Which standard edition?", "Phiên bản tiêu chuẩn nào?", BLUE)
rect(s, 6.85, 1.72, 6.0, 3.3, BLUE_T)
text(s, 6.95, 1.78, 5.8, 3.2, bi([
    ("Harmonised standard cited in the EU Official Journal: test to the cited edition (or an older one still in coexistence).",
     "Tiêu chuẩn hài hòa được công bố trên Công báo EU: thử theo phiên bản được công bố (hoặc phiên bản cũ còn thời gian chuyển tiếp)."),
    ("A newer, not-yet-cited edition: optional extra gap test only.",
     "Phiên bản mới chưa được công bố: chỉ thử bổ sung phần chênh lệch (tùy chọn)."),
    ("No cited edition: current EN / ISO edition = state of the art.",
     "Không có phiên bản được công bố: áp dụng phiên bản EN / ISO hiện hành."),
    ("GB: designated standards apply for UKCA; CE evidence accepted where GB recognises CE.",
     "GB: áp dụng tiêu chuẩn chỉ định cho UKCA; chấp nhận bằng chứng CE khi GB công nhận CE."),
], size=12), spacing=4)
label(s, 0.55, 5.2, 12, "Documents we will ask for", "Tài liệu chúng tôi sẽ yêu cầu", BLUE)
docs = [("Test reports", "Báo cáo thử nghiệm"), ("DoC / DoP", "Tuyên bố hợp chuẩn"), ("Technical file", "Hồ sơ kỹ thuật"),
        ("Material / REACH declarations", "Công bố vật liệu / REACH"), ("Product and packaging data", "Dữ liệu sản phẩm và bao bì")]
x = 0.55
for en, vn in docs:
    rect(s, x, 5.52, 2.38, 0.65, BLUE)
    text(s, x, 5.52, 2.38, 0.65, [[(en, {"bold": True, "size": 10})], [(vn, {"size": 9, "font": "Arial Narrow"})]],
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    x += 2.46
rect(s, 0.55, 6.3, 12.3, 0.62, CORAL_D)
text(s, 0.7, 6.3, 12.1, 0.62,
     [[("Deadline: all test reports, declarations and technical file at ETD − 45 days.", {"bold": True, "size": 12})],
      [("Hạn chót: toàn bộ báo cáo thử nghiệm, tuyên bố và hồ sơ kỹ thuật trước ETD 45 ngày.", {"size": 11, "italic": True, "font": "Arial Narrow"})]],
     color=WHITE, anchor=MSO_ANCHOR.MIDDLE)

# ---------------- 5. Qualification & production control ----------------
s = prs.slides.add_slide(BL)
header(s, 5, "Phase 2 · Supplier qualification and production control", "Giai đoạn 2 · Đánh giá nhà cung cấp và kiểm soát sản xuất")
label(s, 0.55, 1.4, 6, "Pre-qualification score (VQA)", "Điểm đánh giá sơ bộ (VQA)", CORAL_D)
bands = [("PASS", "ĐẠT", "≥ 80%", BLUE), ("CONDITIONAL", "CÓ ĐIỀU KIỆN", "60–79%", CORAL_D), ("NOT QUALIFIED", "KHÔNG ĐẠT", "< 60%", NAVY)]
x = 0.55
for en, vn, sc, col in bands:
    rect(s, x, 1.75, 1.95, 1.1, col)
    text(s, x, 1.75, 1.95, 1.1, [[(sc, {"bold": True, "size": 20})], [(en, {"bold": True, "size": 10})], [(vn, {"size": 9, "font": "Arial Narrow"})]],
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    x += 2.02
rect(s, 0.55, 2.95, 5.98, 0.85, "FFFFFF", line=NAVY)
text(s, 0.65, 2.95, 5.8, 0.85, bi([("No ISO 9001 and no documented QMS = Not Qualified, whatever the score.",
                                    "Không có ISO 9001 và không có hệ thống QMS bằng văn bản = Không đạt, bất kể điểm số.")],
                                  size=10.5, bullet=""), anchor=MSO_ANCHOR.MIDDLE)
label(s, 0.55, 4.0, 6, "Then, before production", "Tiếp theo, trước khi sản xuất", CORAL_D)
rect(s, 0.55, 4.32, 5.98, 2.6, CORAL_T)
text(s, 0.65, 4.38, 5.8, 2.5, bi([
    ("Production-line audit of your factory.", "Đánh giá dây chuyền sản xuất tại nhà máy."),
    ("Factory production control (FPC): incoming, in-process and final checks with records.",
     "Kiểm soát sản xuất tại nhà máy (FPC): kiểm tra đầu vào, trong quá trình và cuối cùng, có hồ sơ."),
    ("Golden sample approved and kept as the reference for inspection.",
     "Mẫu chuẩn được phê duyệt và lưu làm chuẩn so sánh khi kiểm tra."),
], size=12), spacing=5)
label(s, 6.85, 1.4, 6, "What good looks like", "Thế nào là tốt", NAVY)
kp = [("≥ 80%", "FPC audit score", "Điểm đánh giá FPC"),
      ("≥ 95%", "Final inspection passed at first submission", "Đạt kiểm tra cuối ngay lần đầu"),
      ("≤ 30 days", "Corrective action (CAPA) closed", "Đóng hành động khắc phục (CAPA)"),
      ("On time", "Documents delivered by ETD − 45", "Nộp tài liệu trước ETD 45 ngày"),
      ("Zero", "Compliance failures after shipment", "Lỗi tuân thủ sau khi giao hàng")]
y = 1.75
for v, en, vn in kp:
    rect(s, 6.85, y, 1.7, 0.92, NAVY)
    text(s, 6.85, y, 1.7, 0.92, v, size=17, bold=True, color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, 8.58, y, 4.27, 0.92, NAVY_T)
    text(s, 8.68, y, 4.1, 0.92, [[(en, {"size": 11, "bold": True})], [(vn, {"size": 10, "italic": True, "color": VNC, "font": "Arial Narrow"})]],
         anchor=MSO_ANCHOR.MIDDLE)
    y += 1.03

# ---------------- 6. QMS & CSR ----------------
s = prs.slides.add_slide(BL)
header(s, 6, "QMS and CSR requirements and references", "Yêu cầu và tài liệu tham chiếu về QMS và CSR")
label(s, 0.55, 1.4, 6, "Quality management (QMS)", "Hệ thống quản lý chất lượng", BLUE)
rect(s, 0.55, 1.72, 6.0, 3.95, BLUE_T)
text(s, 0.65, 1.76, 5.8, 3.9, bi([
    ("Valid accredited ISO 9001 certificate (scope, body, expiry) — or QMI grade A/B.",
     "Chứng nhận ISO 9001 còn hiệu lực, được công nhận (phạm vi, tổ chức, hạn) — hoặc QMI hạng A/B."),
    ("Quality manual, signed quality policy, KPIs and management review.",
     "Sổ tay chất lượng, chính sách chất lượng có ký duyệt, KPI và xem xét của lãnh đạo."),
    ("CAPA with root cause (5-Why, Fishbone, 8D); internal audits at least yearly.",
     "CAPA có phân tích nguyên nhân gốc (5-Why, Xương cá, 8D); đánh giá nội bộ ít nhất mỗi năm."),
    ("Non-conforming product: tag, segregate, quarantine, re-inspect after rework.",
     "Sản phẩm không phù hợp: gắn thẻ, tách riêng, cách ly, kiểm tra lại sau khi sửa."),
    ("Product-safety complaint: inform A.R.E.N.A. within 24 hours.",
     "Khiếu nại an toàn sản phẩm: báo A.R.E.N.A. trong vòng 24 giờ."),
    ("A.R.E.N.A. FPC / QMS audit renewed at least every 3 years.",
     "Đánh giá FPC / QMS của A.R.E.N.A. được thực hiện lại ít nhất 3 năm một lần."),
], size=10.5), spacing=2)
label(s, 6.85, 1.4, 6, "Social and environmental (CSR)", "Trách nhiệm xã hội và môi trường", CORAL_D)
rect(s, 6.85, 1.72, 6.0, 3.95, CORAL_T)
text(s, 6.95, 1.76, 5.8, 3.9, bi([
    ("Signed Supplier Agreement, Quality Guideline and amfori BSCI terms.",
     "Ký Thỏa thuận Nhà cung cấp, Hướng dẫn Chất lượng và điều khoản amfori BSCI."),
    ("Recognised social audit within 2 years (amfori BSCI, SMETA, SA8000; Fair Stone for stone) covering the factory address.",
     "Đánh giá xã hội được công nhận trong 2 năm (amfori BSCI, SMETA, SA8000; Fair Stone cho đá) đúng địa chỉ nhà máy."),
    ("No child labour, no forced or bonded labour, no recruitment fees; legal hours and wages.",
     "Không lao động trẻ em, không lao động cưỡng bức, không thu phí tuyển dụng; giờ làm và lương đúng luật."),
    ("Environment and safety: ISO 14001 or amfori BEPI, permits, chemicals with SDS, fire safety.",
     "Môi trường và an toàn: ISO 14001 hoặc amfori BEPI, giấy phép, hóa chất có SDS, an toàn PCCC."),
    ("Wood / paper products: valid FSC or PEFC chain-of-custody certificate.",
     "Sản phẩm gỗ / giấy: chứng nhận chuỗi hành trình FSC hoặc PEFC còn hiệu lực."),
], size=10.5), spacing=2)
label(s, 0.55, 5.8, 12, "References", "Tài liệu tham chiếu", NAVY)
refs = [("ISO 9001", "Quality management"), ("ISO 14001", "Environmental mgmt"), ("amfori BSCI", "Code of Conduct"),
        ("SMETA / SA8000", "Social audit / cert."), ("amfori BEPI", "Environmental"), ("FSC / PEFC CoC", "Chain of custody"),
        ("ILO C29 · C138 · C182", "Forced / child labour")]
x = 0.55
for i, (r, d) in enumerate(refs):
    w = 1.7 if i < 6 else 2.0
    rect(s, x, 6.1, w - 0.05, 0.8, NAVY if i % 2 == 0 else BLUE)
    text(s, x, 6.1, w - 0.05, 0.8, [[(r, {"bold": True, "size": 10})], [(d, {"size": 8.5})]],
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0.03)
    x += w

# ---------------- 7. Packaging & artwork ----------------
s = prs.slides.add_slide(BL)
header(s, 7, "Packaging and artwork L0–L3", "Bao bì và thiết kế in L0–L3")
label(s, 0.55, 1.4, 5, "How to submit artwork", "Cách nộp file thiết kế", CORAL_D)
rect(s, 0.55, 1.72, 4.6, 5.2, CORAL_T)
text(s, 0.65, 1.78, 4.4, 5.1, bi([
    ("Send all files to PPS Packaging only — not to QS or the Ally directly.",
     "Chỉ gửi file cho PPS Bao bì — không gửi trực tiếp cho QS hay Đối tác."),
    ("Format: AI / PDF, CMYK, ≥ 300 dpi, 3 mm bleed, all four levels.",
     "Định dạng: AI / PDF, CMYK, ≥ 300 dpi, tràn lề 3 mm, đủ bốn cấp."),
    ("Incomplete files are returned at once with a deficiency list.",
     "File chưa đầy đủ sẽ được trả lại ngay kèm danh sách thiếu sót."),
    ("Print only from the released, version-locked final files. No deviation.",
     "Chỉ in theo file cuối đã phát hành và khóa phiên bản. Không được sai khác."),
    ("Own-brand items: follow the Ally's brand guidelines (logo, Pantone, fonts).",
     "Hàng nhãn riêng: tuân theo hướng dẫn thương hiệu của Đối tác (logo, Pantone, phông chữ)."),
], size=12), spacing=5)
levels = [("L0", "On-product", "Trên sản phẩm",
           "CE mark where required · manufacturer name and address · type / batch no. · warnings",
           "Dấu CE nếu áp dụng · tên và địa chỉ nhà sản xuất · số loại / lô · cảnh báo"),
          ("L1", "Consumer pack", "Bao bì bán lẻ",
           "EAN-13 · all market languages · GPSR contact details · recycling and safety symbols",
           "EAN-13 · đủ ngôn ngữ thị trường · thông tin liên hệ GPSR · ký hiệu tái chế và an toàn"),
          ("L2", "Shipping carton", "Thùng carton",
           "ITF-14 · shipper marks · gross weight and dimensions (±3%) · handling marks",
           "ITF-14 · nhãn vận chuyển · trọng lượng và kích thước (±3%) · ký hiệu bốc xếp"),
          ("L3", "Pallet / transport", "Pallet / vận chuyển",
           "ISPM 15 mark on wood · pallet weight and stacking limit · retailer pallet label if required",
           "Dấu ISPM 15 trên gỗ · trọng lượng pallet và giới hạn xếp chồng · nhãn pallet nếu Đối tác yêu cầu")]
label(s, 5.45, 1.4, 7, "What each level must carry", "Nội dung bắt buộc từng cấp", CORAL_D)
y = 1.72
for i, (lv, en, vn, d, dv) in enumerate(levels):
    col = [CORAL_D, BLUE, NAVY, CORAL_D][i]
    rect(s, 5.45, y, 0.8, 1.22, col)
    text(s, 5.45, y, 0.8, 1.22, lv, size=20, bold=True, color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, 6.28, y, 6.57, 1.22, NAVY_T)
    text(s, 6.38, y, 6.4, 1.22,
         [[(en, {"bold": True, "size": 11}), ("  ·  " + vn, {"size": 10, "font": "Arial Narrow", "color": VNC})],
          [(d, {"size": 10})], [(dv, {"size": 9.5, "italic": True, "color": VNC, "font": "Arial Narrow"})]],
         anchor=MSO_ANCHOR.MIDDLE, spacing=1)
    y += 1.31

# ---------------- 7. Inspection, release, CAPA ----------------
s = prs.slides.add_slide(BL)
header(s, 8, "Phase 3 · Inspection, shipment release and CAPA", "Giai đoạn 3 · Kiểm tra, phát hành lô hàng và CAPA")
label(s, 0.55, 1.4, 6, "Inspections", "Kiểm tra", NAVY)
rect(s, 0.55, 1.72, 6.0, 2.75, NAVY_T)
text(s, 0.65, 1.78, 5.8, 2.65, bi([
    ("During production (DPI) and final random inspection (FRI): 10 checkpoints CP1–CP10.",
     "Kiểm tra trong sản xuất (DPI) và kiểm tra ngẫu nhiên cuối (FRI): 10 điểm CP1–CP10."),
    ("Sampling ISO 2859-1. AQL: Critical 0 · Major 2.5 (1.0 outdoor furniture) · Minor per QC Pack.",
     "Lấy mẫu ISO 2859-1. AQL: Nghiêm trọng 0 · Nặng 2.5 (1.0 đồ nội thất ngoài trời) · Nhẹ theo QC Pack."),
    ("CP5 cartons and CP6 marking checked against the released files.",
     "CP5 kiểm tra thùng và CP6 kiểm tra nhãn so với file đã phát hành."),
], size=12), spacing=5)
label(s, 6.85, 1.4, 6, "If an inspection fails", "Nếu không đạt kiểm tra", NAVY)
rect(s, 6.85, 1.72, 6.0, 2.75, NAVY_T)
text(s, 6.95, 1.78, 5.8, 2.65, bi([
    ("Rework or re-label, then re-inspection — if the timeline allows.",
     "Làm lại hoặc dán nhãn lại, sau đó kiểm tra lại — nếu tiến độ cho phép."),
    ("Root cause and 8D corrective action, closed within 30 days.",
     "Phân tích nguyên nhân gốc và hành động khắc phục 8D, đóng trong vòng 30 ngày."),
    ("Complaints after shipment follow the same 8D / CAPA route.",
     "Khiếu nại sau giao hàng cũng xử lý theo quy trình 8D / CAPA."),
], size=12), spacing=5)
label(s, 0.55, 4.65, 12, "Your timeline to shipment", "Mốc thời gian đến khi giao hàng", NAVY)
rect(s, 0.9, 5.55, 11.6, 0.08, NAVY)
marks = [(0.9, "Order", "Đặt hàng", BLUE), (4.9, "ETD − 45 days", "ETD − 45 ngày", CORAL_D),
         (7.6, "FRI", "Kiểm tra cuối", BLUE), (9.9, "SRC ≥ ETD − 7 days", "SRC ≥ ETD − 7 ngày", CORAL_D), (12.4, "ETD", "Ngày tàu chạy", NAVY)]
notes = {1: ("Documents complete", "Hoàn tất hồ sơ"), 3: ("Shipment Release Certificate by QS", "Chứng nhận phát hành lô hàng do QS cấp")}
for i, (mx, en, vn, col) in enumerate(marks):
    rect(s, mx - 0.13, 5.46, 0.26, 0.26, col, shape=MSO_SHAPE.OVAL)
    text(s, mx - 1.0, 4.95, 2.0, 0.5, [[(en, {"bold": True, "size": 10.5})], [(vn, {"size": 9, "italic": True, "font": "Arial Narrow", "color": VNC})]],
         align=PP_ALIGN.CENTER, color=col)
    if i in notes:
        text(s, mx - 1.2, 5.8, 2.4, 0.55, [[(notes[i][0], {"size": 9.5})], [(notes[i][1], {"size": 9, "italic": True, "font": "Arial Narrow", "color": VNC})]],
             align=PP_ALIGN.CENTER)
rect(s, 0.55, 6.42, 12.3, 0.5, CORAL_D)
text(s, 0.7, 6.42, 12.1, 0.5,
     [[("No SRC, no shipment.  ", {"bold": True, "size": 12}), ("Không có SRC, không được xuất hàng.", {"size": 11, "italic": True, "font": "Arial Narrow"})]],
     color=WHITE, anchor=MSO_ANCHOR.MIDDLE)

# ---------------- 8. Regulatory watch ----------------
s = prs.slides.add_slide(BL)
header(s, 9, "Regulatory watch 2026–2027", "Cập nhật quy định 2026–2027")
cols = [(0.55, 2.55, "Regulation · Quy định"), (3.13, 3.55, "Key dates · Mốc thời gian"), (6.71, 6.14, "What you need to do · Quý vị cần làm gì")]
for x, w, h in cols:
    rect(s, x, 1.38, w, 0.36, NAVY)
    text(s, x + 0.05, 1.38, w - 0.1, 0.36, h, size=10, bold=True, color=WHITE, anchor=MSO_ANCHOR.MIDDLE)
reg = [
 ("GPSR", "(EU) 2023/988", "Applies since 13 Dec 2024.",
  "Traceability on product / pack (type, batch, manufacturer) and safety information in market languages.",
  "Ghi truy xuất trên sản phẩm / bao bì (loại, lô, nhà sản xuất) và thông tin an toàn bằng ngôn ngữ thị trường."),
 ("PPWR", "(EU) 2025/40", "General application 12 Aug 2026. Labelling dates: VERIFY (Art. 12).",
  "Share packaging material and substance data; minimise packaging; support the packaging DoC.",
  "Cung cấp dữ liệu vật liệu và hóa chất bao bì; giảm thiểu bao bì; hỗ trợ DoC bao bì."),
 ("Batteries", "(EU) 2023/1542", "QR code and removability: 18 Feb 2027. Other labelling (Art. 13): VERIFY.",
  "Battery data, labels and DoC; design portable batteries to be removable.",
  "Dữ liệu pin, nhãn và DoC; thiết kế pin di động có thể tháo rời."),
 ("REACH PFHxA", "Entry 79 · (EU) 2024/2462", "10 Oct 2026: consumer clothing, footwear, mixtures. 10 Oct 2027: other textiles.",
  "PFAS declarations and test reports for textiles, coatings and treatments.",
  "Công bố PFAS và báo cáo thử nghiệm cho vải, lớp phủ và xử lý bề mặt."),
 ("Toy Safety Reg.", "(EU) 2025/2509", "In force 1 Jan 2026; applies 1 Aug 2030. Directive 2009/48/EC until then.",
  "Keep EN 71 / Directive compliance now; prepare for the digital product passport.",
  "Duy trì tuân thủ EN 71 / Chỉ thị hiện nay; chuẩn bị hộ chiếu số sản phẩm."),
 ("Machinery Reg.", "(EU) 2023/1230", "Applies 20 Jan 2027 (Directive 2006/42/EC until 19 Jan 2027).",
  "Update risk assessment, DoC and instructions for machines placed from 20 Jan 2027.",
  "Cập nhật đánh giá rủi ro, DoC và hướng dẫn cho máy đưa ra thị trường từ 20/01/2027."),
 ("EUDR", "(EU) 2023/1115 as amended", "30 Dec 2026 large / medium operators; 30 Jun 2027 micro / small.",
  "Give geolocation and legality data for wood, rubber etc. to the Ally. A.R.E.N.A. has no EUDR role.",
  "Cung cấp dữ liệu định vị và tính hợp pháp của gỗ, cao su… cho Đối tác. A.R.E.N.A. không có vai trò EUDR."),
 ("CBAM", "EU 2023/956 · UK", "EU: definitive since 1 Jan 2026; first declaration 30 Sep 2027. UK: from 1 Jan 2027.",
  "Embedded-emissions data for steel / aluminium goods on Ally request. Declarant = Ally / importer.",
  "Dữ liệu phát thải cho hàng thép / nhôm khi Đối tác yêu cầu. Người khai báo = Đối tác / nhà nhập khẩu."),
]
y, RH = 1.77, 0.6
for i, (nm, ref, dt, en, vn) in enumerate(reg):
    tint = BLUE_T if i % 2 == 0 else "FFFFFF"
    rect(s, 0.55, y, 2.55, RH, BLUE if i % 2 == 0 else NAVY)
    text(s, 0.6, y, 2.45, RH, [[(nm, {"bold": True, "size": 10.5})], [(ref, {"size": 8.5})]], color=WHITE, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, 3.13, y, 3.55, RH, tint, line="D0D4DB")
    runs = []
    for part in dt.split("VERIFY"):
        runs.append((part, {}))
        runs.append(("VERIFY", {"bold": True, "color": CORAL_D}))
    runs = runs[:-1]
    text(s, 3.18, y, 3.45, RH, [runs], size=9, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, 6.71, y, 6.14, RH, tint, line="D0D4DB")
    text(s, 6.76, y, 6.04, RH, [[(en, {"size": 9})], [(vn, {"size": 8.5, "italic": True, "color": VNC, "font": "Arial Narrow"})]],
         anchor=MSO_ANCHOR.MIDDLE)
    y += RH + 0.03
text(s, 0.55, 6.85, 12.3, 0.25,
     "Status checked 8 Nov 2026 (live search, secondary sources); VERIFY = confirm on EUR-Lex. GB: CE accepted for most regimes; NI follows EU rules. · "
     "Kiểm tra ngày 8/11/2026; VERIFY = cần xác nhận trên EUR-Lex.",
     size=7.5, color=GREY)

prs.save(sys.argv[1])
print("saved")
