"""ARENA FRI Standard – Sack truck (non-powered), category TRO, EU market.
Single content source for the .docx form + guideline and the .xlsx checklist."""

VERSION = "V1"
DATE = "04/11/2026"
CAT = "TRO"
DOC_ID = f"ARENA-FRI-STD-{CAT}-{VERSION}"
CATEGORY = "Sack truck / hand truck – non-powered"
CATEGORY_VI = "Xe đẩy tay 2 bánh – không động cơ"
STATUS = "Incomplete"   # Draft / Released / Incomplete – only QS sets Released
MARKET = "EU-27 + EEA-3 (incl. Northern Ireland – EU rules)"
AQL = "Cri: 0 | Ma: 1.5 | Mi: 4.0"
SAMPLING = "ISO 2859-1 Single sampling, Normal | General inspection: Level II; Special inspection: S-3; special check list: 3 pcs"
PH = "[___]"

ALLIES = ["HAGEBAU (HGB)", "ITM / Bricomarché", "BCM", "DEDEMAN", "JUMBO / Coop", "PEVEX",
          "MERKUR", "WOODIE'S", "KENT", "BMR"]
RESULT_LIST = ["Conformed", "Passed", "Pending", "Failed", "N/A", "Information", "Yes", "No",
               "Low risk", "High risk"]
DOC_STATUS = ["N/A", "Missing", "Pending", "Yes", "No"]

# ---------------------------------------------------------------- documents
DOCS = [
    ("TRO-DOC-01", "Approved P.O./P.I. (SKU, qty, EAN, carton data, country of origin)", "P.O./P.I. đã duyệt (mã hàng, số lượng, EAN, thùng, xuất xứ)", True),
    ("TRO-DOC-02", "Approved Ally print file (version no.) + QS artwork review record", "File in Ally đã duyệt (số phiên bản) + biên bản QS duyệt artwork", True),
    ("TRO-DOC-03", "Ally packing & pallet specification", "Quy cách đóng gói & pallet của Ally", True),
    ("TRO-DOC-04", "Approved supplier drawing per SKU (nominal values + tolerances, rated load)", "Bản vẽ NCC đã duyệt theo SKU (kích thước danh nghĩa, dung sai, tải định mức)", True),
    ("TRO-DOC-05", "Golden sample per SKU/variant (sealed, ref. no.)", "Mẫu chuẩn theo SKU/biến thể (niêm phong, số tham chiếu)", True),
    ("TRO-DOC-06", "GPSR risk assessment / technical documentation reference (Ally or supplier – GPSR (EU) 2023/988 Art. 9(2))", "Đánh giá rủi ro GPSR / hồ sơ kỹ thuật (Ally hoặc NCC – GPSR Điều 9(2))", True),
    ("TRO-DOC-07", "Accredited lab report – static/rated-load & durability test (no., lab, date ≤ 2 years, valid at ETD, item ref. shown)", "Báo cáo phòng thí nghiệm được công nhận – thử tải định mức & độ bền (số, PTN, ngày ≤ 2 năm, còn hiệu lực tại ETD, có mã hàng)", True),
    ("TRO-DOC-08", "REACH Annex XVII entry 50 §5 PAH report on grips (and tyres – QS to confirm scope) + SVHC Art. 33 declaration", "Báo cáo PAH REACH Phụ lục XVII mục 50 §5 cho tay nắm (và lốp – QS xác nhận) + tuyên bố SVHC Điều 33", True),
    ("TRO-DOC-09", "PPWR (EU) 2025/40 packaging declaration (heavy metals Pb+Cd+Hg+Cr(VI) ≤ 100 mg/kg, material list)", "Tuyên bố bao bì PPWR (EU) 2025/40 (kim loại nặng ≤ 100 mg/kg, danh mục vật liệu)", True),
    ("TRO-DOC-10", "Instruction / safety leaflet in destination language(s) as approved", "Hướng dẫn sử dụng / an toàn bằng ngôn ngữ nước đến như đã duyệt", True),
    ("TRO-DOC-11", "Factory production records: weld / coating process, incoming wheel & tyre inspection", "Hồ sơ sản xuất: quy trình hàn / sơn, kiểm tra đầu vào bánh & lốp", False),
]

# ---------------------------------------------------------------- inspection details (items 1-7)
ITEMS = {
    1: ("Quantity", "Số lượng", [
        ("TRO-D02-01", "Presented qty ≥ 100 % produced and ≥ 80 % packed; per SKU vs P.O./P.I.", "Số lượng trình ≥ 100 % sản xuất, ≥ 80 % đóng gói; theo SKU so với P.O./P.I.", "All"),
        ("TRO-D02-02", "Factory name/address = P.O./P.I. and factory inspected", "Tên/địa chỉ nhà máy = P.O./P.I. và nhà máy được kiểm", "—"),
    ]),
    2: ("Packing check", "Kiểm tra đóng gói", [
        ("TRO-D04-01", "Carton marks: Ally art. no., EAN/ITF-14, qty, GW/NW, dimensions, lot, Made in …", "Ký mã hiệu thùng: mã Ally, EAN/ITF-14, SL, GW/NW, kích thước, lô, Made in …", "√cartons"),
        ("TRO-D04-02", "ITF-14 scan on carton; SSCC readable and not covered by film", "Quét ITF-14 trên thùng; SSCC đọc được, không bị màng che", "5 pcs"),
        ("TRO-D04-03", "Pallet type and loaded height per Ally spec; ISPM 15 mark on two opposite faces (wood pallets)", "Loại pallet & chiều cao theo Ally; dấu ISPM 15 trên hai mặt đối diện (pallet gỗ)", "All pallets"),
        ("TRO-D04-04", "Protection: toe-plate edges and handle ends padded; wheels/axle protected; no metal-to-metal rub; loose parts bag complete", "Bảo vệ: mép bàn xúc & đầu tay cầm có đệm; bánh/trục được bảo vệ; không cọ kim loại; túi phụ kiện đủ", "II"),
        ("TRO-D04-05", "Carton strength: no crush/tear; drop test 1 carton/SKU (T12)", "Độ bền thùng: không bẹp/rách; thử rơi 1 thùng/SKU (T12)", "1 ctn/SKU"),
    ]),
    3: ("Artwork / marking", "Artwork / nhãn mác", [
        ("TRO-D05-01", "Label/carton/leaflet match approved Ally print-file version (deviation = Major)", "Nhãn/thùng/HDSD đúng phiên bản file in Ally đã duyệt (sai = Lỗi nặng)", "II"),
        ("TRO-D05-02", "Manufacturer identity on product (or packaging if not possible): name, trade name, postal + electronic address – GPSR Art. 9(6); EU importer identity not obscuring it – Art. 11(3)", "Thông tin nhà sản xuất trên sản phẩm (hoặc bao bì): tên, thương hiệu, địa chỉ bưu chính + điện tử – GPSR Điều 9(6); thông tin nhà nhập khẩu EU không che khuất – Điều 11(3)", "II"),
        ("TRO-D05-03", "Type, batch or serial no. on product – GPSR Art. 9(5); lot on label = lot on inspection record", "Kiểu, số lô hoặc số sê-ri trên sản phẩm – GPSR Điều 9(5); lô trên nhãn = lô kiểm", "II"),
        ("TRO-D05-04", "Rated (max.) load in kg permanently marked on frame, = drawing and P.O.; legible after rub test T11", "Tải tối đa (kg) ghi cố định trên khung, = bản vẽ và P.O.; đọc được sau thử chà T11", "II"),
        ("TRO-D05-05", "Safety information / instructions in destination language(s) as approved – GPSR Art. 9(7)", "Thông tin an toàn / hướng dẫn bằng ngôn ngữ nước đến như đã duyệt – GPSR Điều 9(7)", "II"),
        ("TRO-D05-06", "Pneumatic tyres: size and max. pressure moulded on sidewall; valve cap present", "Lốp hơi: cỡ và áp suất tối đa đúc trên hông lốp; có nắp van", "II"),
        ("TRO-D05-07", "PROHIBITED content (Critical): CE mark or DoC/DoP/hEN claim (GPSR-only product), GS/TÜV marks without valid certificate for the Ally type, A.R.E.N.A./buying agent named as operator, other customer's branding, ISO 9001 shown as product mark, claims without legal basis", "NỘI DUNG CẤM (Nghiêm trọng): dấu CE hoặc tuyên bố DoC/DoP/hEN (sản phẩm chỉ GPSR), dấu GS/TÜV không có chứng nhận hợp lệ, ghi A.R.E.N.A./đại lý mua hàng là nhà vận hành, thương hiệu khách khác, ISO 9001 như dấu sản phẩm", "All samples"),
        ("TRO-D05-08", "EAN on product label / packaging scanned and = P.O.", "Quét EAN trên nhãn / bao bì = P.O.", "5 pcs"),
        ("TRO-D05-09", "'Made in …' on product, label and carton = P.O./P.I. country and factory inspected", "'Made in …' trên sản phẩm, nhãn, thùng = nước trong P.O./P.I. và nhà máy kiểm", "II"),
        ("TRO-D05-10", "Instruction leaflet: intended use, rated load, load-centred-against-frame rule, no persons carried, stairs warning, tyre pressure, assembly if KD (method per EN IEC/IEEE 82079-1 – SoA)", "HDSD: mục đích sử dụng, tải định mức, xếp hàng sát khung, không chở người, cảnh báo cầu thang, áp suất lốp, lắp ráp nếu tháo rời (theo EN IEC/IEEE 82079-1 – SoA)", "II"),
    ]),
    4: ("Sample comparison", "So sánh mẫu", [
        ("TRO-D06-01", "vs golden sample: frame design, tube Ø/section, toe-plate type (fixed/folding), wheel type (solid/pneumatic/puncture-proof), colour, grips, finish", "So với mẫu chuẩn: kiểu khung, ống, bàn xúc (cố định/gập), loại bánh (đặc/hơi/chống thủng), màu, tay nắm, lớp phủ", "3 pcs"),
    ]),
    6: ("Workmanship", "Tay nghề / ngoại quan", [
        ("TRO-D07-01", "Safety check: no sharp edges/burrs on toe plate, handle, brackets; tube ends closed (caps/plugs); no crack in welds, frame or toe plate; axle retainers fitted", "An toàn: không cạnh sắc/bavia trên bàn xúc, tay cầm, giá; đầu ống bịt kín; không nứt mối hàn, khung, bàn xúc; có chốt giữ trục", "S-3"),
        ("TRO-D07-02", "Weld quality: continuous, no porosity, burn-through, undercut; spatter removed (zone A/B)", "Chất lượng hàn: liên tục, không rỗ, cháy thủng, khuyết; sạch xỉ (vùng A/B)", "II"),
        ("TRO-D07-03", "Coating: full coverage incl. inner tube ends, no peeling, runs, rust, bare spots (zone A visible in use, B sides, C underside)", "Lớp phủ: phủ kín cả đầu ống, không bong, chảy, gỉ, hở (vùng A, B, C)", "II"),
        ("TRO-D07-04", "Wheels/tyres: no cut, bubble, mould flash; hub concentric; rim not bent", "Bánh/lốp: không rách, phồng, ba via; may ơ đồng tâm; vành không cong", "II"),
        ("TRO-D07-05", "Fasteners: all present, correct size, tightened; no stripped threads; no loose parts rattling", "Bulông/ốc: đủ, đúng cỡ, siết chặt; không tuôn ren; không lỏng lạo", "II"),
        ("TRO-D07-06", "Folding parts (if any): no pinch/shear point between moving parts – gaps < 8 mm or > 25 mm* (ARENA proposal, QS to confirm)", "Bộ phận gập (nếu có): không điểm kẹp/cắt – khe < 8 mm hoặc > 25 mm* (đề xuất ARENA, QS xác nhận)", "S-3"),
    ]),
}

# ---------------------------------------------------------------- dimensional tolerance tables (item 5)
TOL_DIM = [("≤ 500 mm", "± 3 mm*"), ("> 500 – 1000 mm", "± 5 mm*"), ("> 1000 mm", "± 0.5 %*")]
TOL_WGT = [("Product weight", "± 5 %*"), ("Carton gross weight", "± 5 %*"), ("Carton dimensions", "± 10 mm*")]

# ---------------------------------------------------------------- special check list / Table 2 (3 pcs)
MATRIX_HEAD = ["ID", "Ref.", "Parameter / Thông số", "Fig.", "How to measure / Cách đo", "Limit (EU) / Giới hạn", "Tool / Dụng cụ", "Photo"]
MATRIX = [
    ("TRO-D09-01", "H", "Overall height", "Chiều cao tổng", "1A", "Truck upright on flat floor, floor → top of handle/grip", "Drawing ± tol. table", "Tape 1 mm", "P30"),
    ("TRO-D09-02", "L", "Toe-plate depth", "Chiều sâu bàn xúc", "1A", "Frame front face → toe-plate front edge, at centre", "Drawing ± tol. table", "Rule/caliper 1 mm", "P31"),
    ("TRO-D09-03", "W", "Toe-plate width", "Chiều rộng bàn xúc", "1B", "Across toe plate at front edge", "Drawing ± tol. table", "Rule 1 mm", "P31"),
    ("TRO-D09-04", "t", "Toe-plate thickness", "Độ dày bàn xúc", "1A", "Caliper at front edge, 3 points, record min.", "Drawing (no minus tol.)", "Caliper 0.02 mm", "P32"),
    ("TRO-D09-05", "B", "Overall width (wheel outer faces)", "Chiều rộng tổng (mặt ngoài bánh)", "1B", "Across wheel outer faces at axle height", "Drawing ± tol. table", "Tape 1 mm", "P33"),
    ("TRO-D09-06", "D", "Wheel diameter", "Đường kính bánh", "1A", "Over tyre, pneumatic at max. marked pressure", "Drawing ± 3 mm*", "Caliper / tape", "P34"),
    ("TRO-D09-07", "Tube", "Frame tube Ø × wall", "Ống khung Ø × thành", "1A", "Caliper at handle and upright, record min.", "Drawing (no minus tol.)", "Caliper 0.02 mm", "P35"),
    ("TRO-D09-08", "m", "Product net weight", "Khối lượng tịnh", "—", "Scale, without packaging", "Drawing / P.O. ± 5 %*", "Scale 10 g", "P36"),
    ("TRO-D09-09", "δ", "Toe-plate permanent deflection after T2", "Độ võng dư bàn xúc sau T2", "2", "Straightedge on toe plate, feeler gauge at front edge, before vs after", "≤ 2 mm* (ARENA)", "Feeler gauge", "P42"),
    ("TRO-D09-10", "R", "Wheel radial run-out / axial play", "Độ đảo hướng kính / rơ dọc trục", "2", "Dial gauge on tyre tread / hub face, 1 slow turn, max − min", "≤ 3 mm* / ≤ 1.5 mm*", "Dial indicator 0.01 mm", "P45"),
    ("TRO-D09-11", "α", "Balance angle with rated load (info)", "Góc cân bằng khi chất tải (tham khảo)", "1C", "Tilt until handle force ≈ 0, protractor on frame", "Record (information)", "Protractor 1°", "P46"),
    ("TRO-D09-12", "F", "Handle force at 35° tilt with rated load (info)", "Lực tay cầm ở góc 35° khi chất tải (tham khảo)", "1C", "Spring scale at grip, vertical pull", "Record (information)", "Spring scale 1 N", "P46"),
]

# ---------------------------------------------------------------- on-site tests (item 7)
TESTS = [
    ("TRO-T1", "Assembly check (if supplied knocked-down)", "Kiểm tra lắp ráp (nếu tháo rời)", "S-3",
     "Assemble per instruction leaflet using only the tools listed; all parts/fasteners present; holes align without force.",
     "Assembled without force or extra tools; parts complete; leaflet steps correct. Missing part = Major; unsafe assembly = Critical."),
    ("TRO-T2", "Static rated-load test (factory rig only)", "Thử tải tĩnh định mức (chỉ khi có giá thử)", "1 pc/SKU",
     "Truck upright; place sandbags = marked rated load evenly on toe plate against frame; hold 30 min*; then tilt to travel position (Fig. 1C) and hold 5 min*. Measure δ before/after (D09-09). N/A if no rig – covered by TRO-DOC-07.",
     "No crack, weld failure, axle/bracket bending; δ ≤ 2 mm*; wheels still rotate freely. Crack/failure = Critical; δ > limit = Major."),
    ("TRO-T3", "Roll test loaded", "Thử lăn có tải", "S-3",
     "Load = rated load (or 50 %* if rig missing, note it); push 50 m* on factory floor incl. one 20 mm* step up/down 5 times.",
     "Straight running, no binding, wobble, abnormal noise; toe plate does not scrape; no part loosens. Wheel/axle failure = Critical; binding = Major."),
    ("TRO-T4", "Stability check", "Kiểm tra ổn định", "S-3",
     "Unloaded and with rated load: truck stands upright on level floor when released; folding toe plate/handle locked.",
     "Does not tip backward or forward by itself; locks hold. Tip-over or lock release = Critical."),
    ("TRO-T5", "Wheel play & run-out", "Độ rơ & đảo bánh", "3 pcs",
     "Truck inverted; check hub/axle play by hand; dial gauge radial on tread and axial on hub face; one slow turn (Fig. 2).",
     "Radial run-out ≤ 3 mm*, axial play ≤ 1.5 mm*; axle retainer (clip/cap/split pin) secure. Retainer missing = Critical; out of limit = Major."),
    ("TRO-T6", "Tyre pressure hold (pneumatic only)", "Giữ áp suất lốp (chỉ lốp hơi)", "S-3",
     "Inflate to max. pressure marked on sidewall; record with gauge; wait 15 min*; record again; soap check valve.",
     "Pressure drop ≤ 10 %*; no leak at valve/bead; no bulge. Leak = Major; burst/bulge = Critical. N/A for solid wheels."),
    ("TRO-T7", "Grip retention", "Độ bám tay nắm", "S-3",
     "Pull and twist each grip by hand; if spring scale available pull axially 200 N* for 10 s.",
     "Grip does not slide off or rotate; no exposed tube end. Grip comes off = Critical; rotates = Major."),
    ("TRO-T8", "Coating adhesion – cross-cut", "Độ bám sơn – cắt ô", "1 pc/SKU",
     "Cross-cut 6 × 6 cuts (1 mm spacing ≤ 60 µm, 2 mm > 60 µm) on flat frame area, tape pull – method EN ISO 2409 (current edition, SoA).",
     "Classification ≤ 1* (ARENA). Class 2 = Minor; ≥ 3 = Major."),
    ("TRO-T9", "Weld integrity (visual + tap)", "Kiểm tra mối hàn (quan sát + gõ)", "S-3",
     "All load-bearing welds (toe plate–frame, axle brackets, cross-bars) inspected with lamp + 3× lens; tap with rubber mallet.",
     "Continuous weld, no crack, no porosity > 1 mm*, no lack of fusion. Crack = Critical; porosity/undercut = Major."),
    ("TRO-T10", "Barcode scan", "Quét mã vạch", "5 pcs",
     "Scan EAN on product/packaging and ITF-14 on carton with scanner.",
     "Readable and = P.O. Not readable / wrong = Minor (wrong EAN = Major)."),
    ("TRO-T11", "Marking rub test", "Thử chà nhãn", "3 pcs",
     "Rub label and rated-load marking 15 s with water-soaked cloth + 15 s dry cloth.",
     "Legible; label not curled/peeled. Illegible rated load = Major."),
    ("TRO-T12", "Carton drop test", "Thử rơi thùng", "1 ctn/SKU",
     "Drop 1 corner, 3 edges, 6 faces; height ≤ 9.5 kg 76 cm, 9.5–18.6 kg 61 cm, > 18.6 kg 46 cm* (ARENA practice unless Ally spec gives values).",
     "No product damage, no part escape; carton may dent. Product damage = Major."),
]

# ---------------------------------------------------------------- defects
DEFECTS = [
    ("CE mark / DoC-DoP-hEN claim on GPSR-only product", "Dấu CE / tuyên bố DoC-DoP-hEN trên sản phẩm chỉ GPSR", "Cri", "TRO-D05-07"),
    ("Prohibited content (A.R.E.N.A. as operator, other brand, invalid GS/TÜV)", "Nội dung cấm (A.R.E.N.A. là nhà vận hành, thương hiệu khác, GS/TÜV không hợp lệ)", "Cri", "TRO-D05-07"),
    ("Manufacturer / importer identity missing or wrong", "Thiếu / sai thông tin nhà sản xuất / nhập khẩu", "Cri", "TRO-D05-02"),
    ("Weld crack / frame or toe-plate crack", "Nứt mối hàn / nứt khung hoặc bàn xúc", "Cri", "TRO-D07-01"),
    ("Sharp edge, burr or open tube end", "Cạnh sắc, bavia hoặc đầu ống hở", "Cri", "TRO-D07-01"),
    ("Axle retainer missing / wheel comes off", "Thiếu chốt giữ trục / bánh rơi ra", "Cri", "TRO-T5"),
    ("Failure or crack under rated load", "Hỏng hoặc nứt khi chịu tải định mức", "Cri", "TRO-T2"),
    ("Folding lock releases / tip-over", "Khóa gập tự nhả / xe bị lật", "Cri", "TRO-T4"),
    ("Rated load missing / differs from drawing", "Thiếu tải định mức / khác bản vẽ", "Maj", "TRO-D05-04"),
    ("Artwork differs from approved version", "Artwork khác phiên bản đã duyệt", "Maj", "TRO-D05-01"),
    ("Destination-language safety text missing", "Thiếu thông tin an toàn bằng ngôn ngữ nước đến", "Maj", "TRO-D05-05"),
    ("'Made in …' differs from P.O./P.I. or factory", "'Made in …' khác P.O./P.I. hoặc nhà máy", "Maj", "TRO-D05-09"),
    ("ISPM 15 missing on wood pallet", "Thiếu dấu ISPM 15 trên pallet gỗ", "Maj", "TRO-D04-03"),
    ("Critical dimension out of tolerance", "Kích thước quan trọng ngoài dung sai", "Maj", "TRO-D09-01"),
    ("Toe-plate permanent deflection > limit", "Độ võng dư bàn xúc vượt giới hạn", "Maj", "TRO-D09-09"),
    ("Wheel binding / run-out > limit", "Bánh kẹt / độ đảo vượt giới hạn", "Maj", "TRO-T5"),
    ("Tyre leak", "Lốp xì hơi", "Maj", "TRO-T6"),
    ("Grip rotates / loose", "Tay nắm xoay / lỏng", "Maj", "TRO-T7"),
    ("Coating peeling / rust", "Bong sơn / gỉ", "Maj", "TRO-D07-03"),
    ("Weld porosity / spatter", "Rỗ / xỉ mối hàn", "Maj", "TRO-D07-02"),
    ("Scratch / coating mark zone A", "Trầy / vết sơn vùng A", "Min", "TRO-D07-03"),
    ("ITF-14 / SSCC not scannable, wrong carton marks", "ITF-14 / SSCC không quét được, sai ký mã hiệu", "Min", "TRO-D04-02"),
]

# ---------------------------------------------------------------- guideline
EQUIPMENT = [
    ("Steel tape 5 m", "Thước dây thép 5 m", "1 mm, calibrated", "D09-01/03/05"),
    ("Steel rule 300 mm + caliper 150 mm", "Thước lá 300 mm + thước kẹp 150 mm", "1 mm / 0.02 mm", "D09-02/04/07"),
    ("Dial indicator + magnetic stand", "Đồng hồ so + đế từ", "0.01 mm", "T5, D09-10"),
    ("Feeler gauge set + 500 mm straightedge", "Bộ thước lá căn + thước thẳng 500 mm", "0.05 mm", "D09-09"),
    ("Tyre pressure gauge", "Đồng hồ áp suất lốp", "0.1 bar", "T6"),
    ("Spring scale 0–300 N", "Cân lò xo 0–300 N", "1 N", "T7, D09-12"),
    ("Digital protractor", "Thước đo góc điện tử", "1°", "D09-11"),
    ("Platform scale 0–30 kg", "Cân bàn 0–30 kg", "10 g", "D09-08, D10"),
    ("Cross-cut cutter (1 & 2 mm) + tape", "Dao cắt ô (1 & 2 mm) + băng dính", "per EN ISO 2409", "T8"),
    ("Sandbags / weights = rated load", "Bao cát / quả tải = tải định mức", "± 1 %", "T2, T3"),
    ("Barcode scanner, lamp, 3× lens, rubber mallet, stopwatch", "Máy quét mã vạch, đèn, kính lúp 3×, búa cao su, đồng hồ bấm giờ", "—", "T9–T11"),
]

SAMPLING_TABLE = [  # lot size, code, n, Ma(1.5) Ac/Re, Mi(4.0) Ac/Re, S-3 n
    ("91–150", "F", "20", "VERIFY (ISO 2859-1 Tab. 2-A)", "2/3", "5"),
    ("151–280", "G", "32", "1/2", "3/4", "8"),
    ("281–500", "H", "50", "2/3", "5/6", "8"),
    ("501–1 200", "J", "80", "3/4", "7/8", "13"),
    ("1 201–3 200", "K", "125", "5/6", "10/11", "13"),
    ("3 201–10 000", "L", "200", "7/8", "14/15", "20"),
]

STEPS = [
    ("D01", "Preparation", "Chuẩn bị", ["TRO-D01-01 Check DOC-01…11 received; golden sample available", "TRO-D01-02 Confirm all * values and open points with QS before travel", "TRO-D01-03 Equipment list B complete and in calibration", "TRO-D01-04 Factory readiness ≥ 100 % produced / ≥ 80 % packed"], "GI, DOC", "—"),
    ("D02", "Arrival, identification, quantity", "Đến nơi, nhận diện, số lượng", ["TRO-D02-01 Count per SKU vs P.O./P.I.", "TRO-D02-02 Factory = P.O./P.I.; Pending if not ready"], "1", "P01–P04"),
    ("D03", "Sampling & carton selection", "Lấy mẫu & chọn thùng", ["TRO-D03-01 Open ≥ √cartons from different pallets", "TRO-D03-02 Each SKU/variant = own lot; Table 1 per SKU"], "GI", "P05"),
    ("D04", "Packing", "Đóng gói", ["TRO-D04-01…05 see form item 2"], "2", "P06–P15"),
    ("D05", "Artwork, marking & labels", "Artwork, nhãn mác", ["TRO-D05-01…10 see form item 3; NO CE (GPSR only); A.R.E.N.A. never named"], "3", "P16–P24"),
    ("D06", "Sample comparison", "So sánh mẫu", ["TRO-D06-01 vs golden sample, 3 pcs"], "4", "P25–P27"),
    ("D07", "Workmanship", "Ngoại quan", ["TRO-D07-01…06 Level II; zones A/B/C; photos with ruler"], "6", "P50–P55"),
    ("D08", "On-site tests", "Thử nghiệm tại xưởng", ["TRO-T1…T12 – written method + criterion; T2 rig only, else N/A + DOC-07"], "7", "P40–P49"),
    ("D09", "Special check list – critical points (3 pcs)", "Danh sách kiểm tra đặc biệt (3 mẫu)", ["TRO-D09-01…12 all readings + worst value recorded, never only 'Pass'", "Instrument visible in photo"], "5, Table 2", "P30–P36"),
    ("D10", "Packing & product data", "Dữ liệu đóng gói & sản phẩm", ["TRO-D10-01 Carton size/GW/NW vs P.O.", "TRO-D10-02 Packaging material weight per sales unit (section 8)"], "2, 8", "P37–P39"),
    ("D11", "Golden & shipment sample sealing", "Niêm phong mẫu chuẩn & mẫu xuất", ["TRO-D11-01 Seal shipment sample, record seal serial no."], "10", "P56–P57"),
    ("D12", "Close meeting", "Họp kết thúc", ["TRO-D12-01 Findings explained, factory signs record"], "10", "P60"),
    ("D13", "Verdict, report & photos", "Kết luận, báo cáo & ảnh", ["TRO-V-01…05 apply; report to QS ≤ 24 h; QS issues SRC, not the inspector"], "Summary", "—"),
]

VERDICT = [
    ("TRO-V-01", "Any Critical defect or prohibited content → FAILED", "Bất kỳ lỗi nghiêm trọng hoặc nội dung cấm → KHÔNG ĐẠT"),
    ("TRO-V-02", "Major or Minor count > Ac, or any special-check value out of limit → FAILED", "Số lỗi nặng/nhẹ > Ac, hoặc giá trị đo đặc biệt vượt giới hạn → KHÔNG ĐẠT"),
    ("TRO-V-03", "Production < 100 % / packing < 80 %, golden sample or judgement document missing, blocking open point → PENDING", "Sản xuất < 100 % / đóng gói < 80 %, thiếu mẫu chuẩn hoặc tài liệu, điểm mở chặn → CHỜ"),
    ("TRO-V-04", "All mandatory IDs reported with result, none failed → PASSED", "Tất cả ID bắt buộc có kết quả, không lỗi → ĐẠT"),
    ("TRO-V-05", "A mandatory ID without a result = not done → report incomplete", "ID bắt buộc không có kết quả = chưa làm → báo cáo chưa đầy đủ"),
]

PHOTOS = [
    "Factory gate / name board", "Warehouse / storage area", "Cartons stacked per P.O.", "Quantity count sheet",
    "Opened cartons selected", "Carton marks – side 1", "Carton marks – side 2", "ITF-14 scan", "Pallet & loaded height",
    "ISPM 15 mark – face 1", "ISPM 15 mark – face 2", "SSCC label", "Carton inside / protection", "Loose-parts bag",
    "Packing family view", "Product label overall", "Manufacturer / importer identity", "Type / batch / serial", "Rated-load marking",
    "Safety text / leaflet", "Tyre sidewall size & pressure", "EAN scan", "Made in … on product/carton", "Prohibited-content screen (no CE)",
    "Golden sample vs product – front", "Golden sample vs product – side", "Golden sample vs product – details", "Product front view",
    "Product side view", "H overall height + tape", "L / W toe plate + rule", "t toe-plate thickness + caliper", "B overall width",
    "D wheel diameter", "Tube Ø × wall", "Net weight on scale", "Carton dimensions", "Carton gross weight", "Packaging material weights",
    "T1 assembly", "T2 static load set-up", "T2 after load – no crack", "δ deflection reading", "T3 roll test + step", "T5 run-out dial gauge",
    "α / F reading", "T6 pressure readings", "T7 grip pull", "T8 cross-cut result", "Weld close-up (T9)", "Coating zone A",
    "Coating zone C underside", "Wheel / tyre close-up", "Fasteners / axle retainer", "Folding mechanism gap", "Golden sample seal",
    "Shipment sample seal + serial", "Defect close-up", "Defect overview", "Close-meeting record signed",
]
PHOTO_IDS = [(f"TRO-P{i:02d}", f"P{i:02d} {p}") for i, p in enumerate(PHOTOS, 1)]

STANDARDS_REF = [
    ("EU", "GPSR (EU) 2023/988", "EUR-Lex (search result, 04/11/2026)", "Applies from 13/12/2024 (Art. 52) – V", "Art. 9(2), 9(5), 9(6), 9(7), 11(3)"),
    ("EU", "Machinery Reg. (EU) 2023/1230", "EUR-Lex (search result)", "Applies 20/01/2027; Art. 3(1)(a) excludes directly applied human effort except lifting (3(1)(e))", "Scope: manual sack truck OUT of scope (assessment – QS confirm)"),
    ("EU", "PPWR (EU) 2025/40", "EUR-Lex / Commission (search result)", "Applies from 12/08/2026 – V", "Heavy metals, material data (DOC-09, section 8)"),
    ("EU", "REACH Annex XVII entry 50 §5", "EUR-Lex Reg. 1272/2013; ECHA guideline", "V (later amendments not checked)", "1 mg/kg per listed PAH, skin-contact rubber/plastic parts"),
    ("EU", "Sack-truck product standard", "None found (CEN/ISO TC 110 scope only)", "SoA – no OJ-cited EN", "Limits per approved drawing; ARENA * proposals"),
    ("EU", "EN 12527–EN 12533 castors & wheels", "Not opened – orientation only", "UNVERIFIED", "Not used as a limit; open point O2"),
    ("EU", "EN ISO 2409 cross-cut", "Not opened – method reference only", "SoA, current edition", "T8 method; class limit ARENA *"),
    ("EU", "EN IEC/IEEE 82079-1", "Not opened – method reference only", "SoA", "Leaflet content check D05-10"),
]

OPEN_POINTS = [
    ("O1", "No OJ-cited EN for manual sack trucks found; all limits are drawing or ARENA * proposals", "QS confirm SoA basis and * values with Ally before release", "QS", "TRO-D09-*, T2–T9"),
    ("O2", "Wheel/castor standards EN 12527–12533 – applicability and editions not verified", "QS check licensed copy; add limits only from EU source", "QS", "TRO-D09-06, D09-10, T5"),
    ("O3", "Machinery Reg. scope exclusion is an assessment, not a ruling", "QS/Ally confirm; if any lifting function (stair-climber, nose-lift) → re-classify", "QS", "TRO-D05-07"),
    ("O4", "REACH entry 50 §5 – whether tyres are skin-contact parts", "QS check ECHA entry 50 guideline", "QS", "TRO-DOC-08"),
    ("O5", "Generic template – SKU, rated load, drawing values blank", "Fill P.O. annex per order (Table 2 Specification)", "QS", "All ANNEX rows"),
]

LESSONS = [
    "Fixed test load → use the marked rated load of each SKU, never a generic value.",
    "'Visual OK' for wheel run-out not accepted – dial gauge mandatory (T5).",
    "Visual-only weld check misses cracks – lamp + lens + mallet tap (T9).",
    "CE often printed on hand trucks by habit – Critical prohibited content for GPSR-only products.",
    "Never improvise a load test (no persons standing on the toe plate) – rig or N/A + lab report.",
]

REVISIONS = [("V1", DATE, "First issue – generic EU sack-truck FRI template (rebuilt per spec; master form not available)")]


def requirements():
    """Every requirement row for the checklist (and ID-set check)."""
    import re
    rows = []
    def add(id_, layer, cp, step, en, vi, method, sample, limit, rej, evid, src, mand, status):
        rows.append(dict(id=id_, layer=layer, cp=cp, step=step, sku="all", en=en, vi=vi, method=method,
                         sample=sample, limit=limit, reject=rej, evidence=evid, source=src,
                         mandatory="Y" if mand else "N", status=status, market="EU"))
    for i, (id_, en, vi, mand) in enumerate(DOCS):
        add(id_, "STD", 1, "D01", en, vi, "Document review", "—", "Present, valid, item ref. shown", "—",
            "Document no.", "ARENA SOP / GPSR", mand, "Defined")
    cpmap = {1: 1, 2: 2, 3: 3, 4: 4, 6: 6}
    stepmap = {1: "D02", 2: "D04", 3: "D05", 4: "D06", 6: "D07"}
    for k, (name, vi, rows_) in ITEMS.items():
        for id_, en, vien, sample in rows_:
            rej = "Cri" if ("PROHIBITED" in en or "Safety check" in en or "identity" in en) else "Maj"
            st = "QS to fill" if "*" in en else "Defined"
            add(id_, "STD", cpmap[k], stepmap[k], en, vien, "Visual / check vs reference", sample,
                "As stated", rej, "Photo + result", "GPSR / Ally spec / ARENA", True, st)
    for id_, ref, en, vi, fig, how, lim, tool, ph in MATRIX:
        st = "QS to fill" if ("Drawing" in lim or "*" in lim) else "Defined"
        mand = "info" not in en
        add(id_, "ANNEX", 5, "D09", f"{ref} – {en}", vi, how + f" ({tool})", "3 pcs", lim,
            "Maj" if mand else "—", f"All readings + {ph}", "Approved drawing / ARENA *", mand, st if mand else "Defined")
    for id_, en, vi, sample, method, crit in TESTS:
        st = "QS to fill" if "*" in (method + crit) else "Defined"
        add(id_, "STD", 7, "D08", en, vi, method, sample, crit, "Cri/Maj", "Reading + photo", "ARENA method *", True, st)
    for s, en, vi, bullets, item, ph in STEPS:
        for b in bullets:
            bid = b.split(" ")[0]
            if re.fullmatch(rf"TRO-{s}-\d\d", bid) and not any(r["id"] == bid for r in rows):
                add(bid, "STD", 10 if s in ("D11", "D12") else 1, s, b[len(bid) + 1:], vi, "Procedure step", "—",
                    "Done and recorded", "—", "Report entry", "ARENA FRI Standard", True, "Defined")
    for pid, label in PHOTO_IDS:
        add(pid, "STD", 10, "F", f"Photo {label}", "Ảnh bắt buộc", "Photograph", "—", "Present, sharp, labelled",
            "—", "Photo", "ARENA FRI Standard", True, "Defined")
    for id_, en, vi in VERDICT:
        add(id_, "STD", 10, "D13", en, vi, "Verdict rule", "—", "Applied", "—", "Summary result", "ARENA FRI Standard", True, "Defined")
    return rows

# ---------------------------------------------------------------- builder configuration
LEGAL_STREAM = "GPSR (EU) 2023/988 – NO CE marking"
FIGS = ["fig1_tro_points.png", "fig2_tro_tests.png"]
FIG_CAPTION = ("Critical points – see Fig. 1 (A side, B front, C tilted) and Fig. 2 (test set-ups):",
               "Điểm quan trọng – xem Hình 1 và Hình 2:")
MATRIX_NOTE = ("Matrix note: no OJ-cited EN exists for manual sack trucks (SoA). Limits = approved supplier drawing per SKU "
               "(fill in P.O. annex) or ARENA proposals marked * – QS to confirm before release. | Ghi chú: không có EN hài hòa; "
               "giới hạn theo bản vẽ đã duyệt hoặc đề xuất ARENA *.")
T2_SKU_LINE = (f"SKU: {PH}   Drawing ref./rev.: {PH}   Rated load: {PH} kg   Wheel type: {PH}",
               "Mã hàng / Bản vẽ / Tải định mức / Loại bánh")
TITLE_EN = "SACK TRUCK (NON-POWERED)"
TITLE_VI = "XE ĐẨY TAY 2 BÁNH (KHÔNG ĐỘNG CƠ)"
SCOPE = ("Used by A.R.E.N.A. QC or an appointed inspection body for FRI of manual two-wheel sack trucks (steel or aluminium frame, "
         "fixed or folding toe plate, solid / pneumatic / puncture-proof wheels) shipped to the EU-27, EEA-3 or Northern Ireland. "
         "Legal stream: GPSR (EU) 2023/988 only – NO CE marking. Manual sack trucks are outside the Machinery Regulation (EU) 2023/1230 "
         "(no drive other than directly applied human effort, no lifting function) – stair-climbers or nose-lift designs must be "
         "re-classified (O3). A.R.E.N.A. is a sourcing office only: never manufacturer, importer or GPSR responsible person.")
