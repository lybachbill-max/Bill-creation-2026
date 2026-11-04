"""Shared content for DEDEMAN Greece P.O. P0A1030690 (Gripwell Forgings & Tools, HOLZER) – EU market.
Group modules (content_vce / content_spn / content_lub) import from here."""
import json, math, os

HERE = os.path.dirname(os.path.abspath(__file__))
VERSION = "V1"
DATE = "04/11/2026"
STATUS = "Incomplete"
PH = "[___]"
MARKET = "EU-27 – Greece (POD Thessaloniki); Ally DEDEMAN (RO)"
AQL = "Cri: 0 | Ma: 1.5 | Mi: 4.0"
SAMPLING = ("ISO 2859-1 Single sampling, Normal | General inspection: Level II; Special inspection: S-3; "
            "special check list: 3 pcs per SKU | each SKU = own lot (grouping only with QS approval – see open points)")
LEGAL_STREAM = "GPSR (EU) 2023/988 – NO CE marking; DEDEMAN (HOLZER own brand) = manufacturer, Gripwell = producer"
ALLIES = ["DEDEMAN", "HAGEBAU (HGB)", "ITM / Bricomarché", "BCM", "JUMBO / Coop", "PEVEX", "MERKUR", "WOODIE'S", "KENT", "BMR"]
RESULT_LIST = ["Conformed", "Passed", "Pending", "Failed", "N/A", "Information", "Yes", "No", "Low risk", "High risk"]
DOC_STATUS = ["N/A", "Missing", "Pending", "Yes", "No"]
PO = "P0A1030690"
GI = dict(ally="DEDEMAN", supplier="Gripwell Forgings & Tools (contact: Gunit S. Rana)",
          factory="Gripwell Forgings & Tools, E-35 Industrial Area, Jalandhar, India",
          place=PH, po=f"P.O. / SAP {PO} – P.O. date 19/10/2026", etd="ETD 30/12/2026 · FOB, port of loading " + PH,
          brand="HOLZER – DEDEMAN own brand (DEDEMAN = GPSR manufacturer)", origin="India · POD Thessaloniki (GR)")
PO_ANNEX = f"DEDEMAN {PO} (ETD 30/12/2026)"
TOL_DIM = [("≤ 100 mm", "± 1 mm*"), ("> 100 – 300 mm", "± 2 mm*"), ("> 300 mm", "± 1 %*")]
TOL_WGT = [("Product weight", "± 5 %*"), ("Carton gross weight", "± 5 %*"), ("Carton dimensions", "± 10 mm*")]

# ------------------------------------------------------------------ P.O. data
_ALL = json.load(open(os.path.join(HERE, "po_skus.json"), encoding="utf8"))


def skus(refs_prefixes=None, refs=None):
    out = []
    for k in _ALL:
        if refs and k["ref"] in refs or refs_prefixes and k["ref"].split("/")[0] in refs_prefixes:
            k = dict(k)
            k["img_path"] = os.path.join(HERE, "img", k["img"]) if k.get("img") else None
            out.append(k)
    return out


# ------------------------------------------------------------------ ISO 2859-1 (code letters + n are tabulated;
# Ac/Re printed only where certain, otherwise VERIFY)
_L2 = [(8, "A", 2), (15, "B", 3), (25, "C", 5), (50, "D", 8), (90, "E", 13), (150, "F", 20), (280, "G", 32),
       (500, "H", 50), (1200, "J", 80), (3200, "K", 125), (10000, "L", 200)]
_S3 = [(15, 2), (50, 3), (150, 5), (500, 8), (3200, 13), (35000, 20)]
_AC15 = {"G": "1/2", "H": "2/3", "J": "3/4", "K": "5/6", "L": "7/8"}
_AC40 = {"E": "1/2", "F": "2/3", "G": "3/4", "H": "5/6", "J": "7/8", "K": "10/11", "L": "14/15"}


def table1(sku_list):
    rows = []
    for k in sku_list:
        q = int(float(k["qty"]))
        code, n = next((c, n) for lim, c, n in _L2 if q <= lim)
        n = min(n, q)
        s3 = min(next(n3 for lim, n3 in _S3 if q <= lim), q)
        ctns = k["ctns"]
        try:
            open_c = math.ceil(math.sqrt(float(ctns)))
        except (TypeError, ValueError):
            open_c = "VERIFY"
        rows.append([k["ref"], q, code, n, _AC15.get(code, "VERIFY (Tab. 2-A)"), _AC40.get(code, "VERIFY (Tab. 2-A)"),
                     s3, open_c, "3 pcs"])
    return rows


SAMPLING_TABLE = [
    ("51–90", "E", "13", "VERIFY (Tab. 2-A)", "1/2", "5"),
    ("91–150", "F", "20", "VERIFY (Tab. 2-A)", "2/3", "5"),
    ("151–280", "G", "32", "1/2", "3/4", "8"),
    ("281–500", "H", "50", "2/3", "5/6", "8"),
    ("501–1 200", "J", "80", "3/4", "7/8", "13"),
    ("1 201–3 200", "K", "125", "5/6", "10/11", "13"),
]


# ------------------------------------------------------------------ shared blocks (CAT-prefixed per group)
def docs(cat, test_doc_en, test_doc_vi, extra=()):
    d = [
        (f"{cat}-DOC-01", f"Approved P.O./P.I. {PO} (SKU, qty, EAN, carton data, country of origin India)", f"P.O./P.I. {PO} đã duyệt (mã, SL, EAN, thùng, xuất xứ Ấn Độ)", True),
        (f"{cat}-DOC-02", "Approved DEDEMAN/HOLZER print file per SKU (version no.) – label, colour box, card, hanger, carton marks + QS artwork review record", "File in DEDEMAN/HOLZER đã duyệt theo SKU (số phiên bản) – nhãn, hộp màu, thẻ, móc treo, ký mã hiệu + biên bản QS duyệt", True),
        (f"{cat}-DOC-03", "DEDEMAN packing & pallet specification (carton marks, DDM RO code, pallet)", "Quy cách đóng gói & pallet DEDEMAN (ký mã hiệu, mã DDM RO, pallet)", True),
        (f"{cat}-DOC-04", "Approved supplier drawing / specification per SKU (nominal dimensions + tolerances, material, hardness)", "Bản vẽ / thông số NCC đã duyệt theo SKU (kích thước, dung sai, vật liệu, độ cứng)", True),
        (f"{cat}-DOC-05", "Golden sample per SKU / set (sealed, ref. no.)", "Mẫu chuẩn theo SKU / bộ (niêm phong, số tham chiếu)", True),
        (f"{cat}-DOC-06", "GPSR technical documentation / risk assessment of DEDEMAN as manufacturer (GPSR (EU) 2023/988 Art. 9(2)) – supplier input available", "Hồ sơ kỹ thuật / đánh giá rủi ro GPSR của DEDEMAN (Điều 9(2)) – có dữ liệu NCC", True),
        (f"{cat}-DOC-07", test_doc_en, test_doc_vi, True),
        (f"{cat}-DOC-08", "REACH: SVHC Art. 33 declaration; Annex XVII entry 50 §5 PAH report for rubber/plastic skin-contact parts where present", "REACH: tuyên bố SVHC Điều 33; báo cáo PAH Phụ lục XVII mục 50 §5 cho chi tiết cao su/nhựa tiếp xúc da (nếu có)", True),
        (f"{cat}-DOC-09", "PPWR (EU) 2025/40 packaging declaration (heavy metals Pb+Cd+Hg+Cr(VI) ≤ 100 mg/kg, materials) + basis of any 'recyclable' claim", "Tuyên bố bao bì PPWR (kim loại nặng ≤ 100 mg/kg, vật liệu) + cơ sở cho tuyên bố 'tái chế được'", True),
    ]
    d += list(extra)
    d.append((f"{cat}-DOC-{len(d) + 1:02d}", "Factory records: heat-treatment / hardness, plating or coating process, incoming material certificates", "Hồ sơ nhà máy: nhiệt luyện / độ cứng, mạ hoặc sơn, chứng chỉ vật liệu đầu vào", False))
    return d


def item1(cat):
    return ("Quantity", "Số lượng", [
        (f"{cat}-D02-01", "Presented qty ≥ 100 % produced and ≥ 80 % packed, per SKU vs P.O. (qty and pcs/ctn × ctns)", "Số lượng ≥ 100 % sản xuất, ≥ 80 % đóng gói, theo SKU so với P.O.", "All"),
        (f"{cat}-D02-02", "Factory = Gripwell Forgings & Tools, Jalandhar (P.O./P.I.) and the site inspected", "Nhà máy = Gripwell, Jalandhar (P.O./P.I.) và nơi được kiểm", "—"),
    ])


def item2(cat, protection_en, protection_vi):
    return ("Packing check", "Kiểm tra đóng gói", [
        (f"{cat}-D04-01", "Carton marks per DEDEMAN spec: Ally code, DDM RO code, supplier ref., EAN/ITF-14, qty, GW/NW, dimensions, lot, Made in India", "Ký mã hiệu theo DEDEMAN: mã Ally, mã DDM RO, mã NCC, EAN/ITF-14, SL, GW/NW, kích thước, lô, Made in India", "√cartons"),
        (f"{cat}-D04-02", "ITF-14 / outer barcode scanned and = approved print file (record digits – P.O. outer codes inconsistent, see O1)", "Quét ITF-14 / mã thùng = file in đã duyệt (ghi lại số – mã thùng trong P.O. không nhất quán, xem O1)", "5 ctns"),
        (f"{cat}-D04-03", "Pallet type / loaded height per DEDEMAN; ISPM 15 mark on two opposite faces (wood pallets); SSCC readable", "Pallet & chiều cao theo DEDEMAN; dấu ISPM 15 hai mặt đối diện (pallet gỗ); SSCC đọc được", "All pallets"),
        (f"{cat}-D04-04", protection_en, protection_vi, "II"),
        (f"{cat}-D04-05", "Carton strength: no crush/tear; carton drop test 1 carton/SKU family (see tests)", "Độ bền thùng: không bẹp/rách; thử rơi 1 thùng/họ SKU", "1 ctn"),
    ])


def item3(cat, product_marking_en, product_marking_vi, extra=()):
    rows = [
        (f"{cat}-D05-01", "Label / colour box / card / hanger / carton match the approved DEDEMAN print-file version per SKU (deviation = Major)", "Nhãn / hộp / thẻ / móc / thùng đúng phiên bản file in DEDEMAN theo SKU (sai = Lỗi nặng)", "II"),
        (f"{cat}-D05-02", "GPSR manufacturer identity = DEDEMAN (HOLZER own brand): name, postal + electronic address on product or, where not possible, on packaging – GPSR Art. 9(6); Gripwell not shown as manufacturer unless the print file says so", "Thông tin NSX theo GPSR = DEDEMAN: tên, địa chỉ bưu chính + điện tử trên sản phẩm hoặc bao bì – Điều 9(6); Gripwell không ghi là NSX trừ khi file in quy định", "II"),
        (f"{cat}-D05-03", product_marking_en, product_marking_vi, "II"),
        (f"{cat}-D05-04", "Safety information / instructions in the language(s) of the destination Member State (Greek) as approved – GPSR Art. 9(7); other languages per print file", "Thông tin an toàn / hướng dẫn bằng ngôn ngữ nước đến (tiếng Hy Lạp) như đã duyệt – Điều 9(7)", "II"),
        (f"{cat}-D05-05", "PROHIBITED content (Critical): CE mark or DoC/DoP/hEN claim; GS / TÜV mark or 'GS approved' text without a valid GS certificate for this DEDEMAN type; A.R.E.N.A./buying agent named as operator; other customer's branding; ISO 9001 shown as product mark", "NỘI DUNG CẤM (Nghiêm trọng): dấu CE / tuyên bố DoC-DoP-hEN; dấu GS/TÜV không có chứng nhận GS hợp lệ cho kiểu DEDEMAN; ghi A.R.E.N.A. là nhà vận hành; thương hiệu khác; ISO 9001 như dấu SP", "All samples"),
        (f"{cat}-D05-06", "Product EAN scanned on 5 pcs/SKU = approved print file; record the digits; duplicate or invalid EAN vs P.O. (see O1) reported to QS same day", "Quét EAN 5 mẫu/SKU = file in đã duyệt; ghi số; EAN trùng/sai so với P.O. (O1) báo QS trong ngày", "5 pcs"),
        (f"{cat}-D05-07", "'Made in India' on product/packaging and carton = P.O./P.I. origin and factory inspected", "'Made in India' trên sản phẩm/bao bì/thùng = xuất xứ P.O./P.I. và nhà máy kiểm", "II"),
        (f"{cat}-D05-08", "Environmental claims ('recyclable', 'recycled') only as on the approved print file and with the basis in DOC-09; spelling of texts as approved", "Tuyên bố môi trường ('tái chế') chỉ như file in đã duyệt và có cơ sở DOC-09; chính tả đúng như đã duyệt", "II"),
    ]
    rows += list(extra)
    return ("Artwork / marking", "Artwork / nhãn mác", rows)


def item4(cat, en, vi):
    return ("Sample comparison", "So sánh mẫu", [(f"{cat}-D06-01", en, vi, "3 pcs/SKU")])


SHARED_DEFECTS = [
    ("CE mark / DoC-DoP-hEN claim on GPSR-only product", "Dấu CE / tuyên bố DoC-DoP-hEN trên sản phẩm chỉ GPSR", "Cri", "D05-05"),
    ("GS / TÜV mark or 'GS approved' without valid certificate for the DEDEMAN type", "Dấu GS/TÜV hoặc 'GS approved' không có chứng nhận hợp lệ", "Cri", "D05-05"),
    ("Prohibited content (A.R.E.N.A. as operator, other brand)", "Nội dung cấm (A.R.E.N.A. là nhà vận hành, thương hiệu khác)", "Cri", "D05-05"),
    ("DEDEMAN manufacturer identity missing or wrong", "Thiếu / sai thông tin NSX DEDEMAN", "Cri", "D05-02"),
    ("Artwork differs from approved print file", "Artwork khác file in đã duyệt", "Maj", "D05-01"),
    ("Greek safety / instruction text missing", "Thiếu thông tin an toàn tiếng Hy Lạp", "Maj", "D05-04"),
    ("EAN wrong / duplicate / not scannable", "EAN sai / trùng / không quét được", "Maj", "D05-06"),
    ("'Made in …' differs from P.O./P.I. or factory", "'Made in …' khác P.O./P.I. hoặc nhà máy", "Maj", "D05-07"),
    ("ISPM 15 missing on wood pallet", "Thiếu ISPM 15 trên pallet gỗ", "Maj", "D04-03"),
    ("Unsubstantiated environmental claim / spelling error on print", "Tuyên bố môi trường không có cơ sở / lỗi chính tả", "Maj", "D05-08"),
    ("Wrong carton marks / ITF-14 / SSCC not scannable", "Sai ký mã hiệu / ITF-14 / SSCC không quét được", "Min", "D04-02"),
]


def defects(cat, group_defects):
    out = []
    for en, vi, cls, link in list(group_defects) + SHARED_DEFECTS:
        out.append((en, vi, cls, link if link.startswith(cat) else f"{cat}-{link}"))
    return out


def steps(cat, d08_bullets, d09_bullets):
    return [
        ("D01", "Preparation", "Chuẩn bị", [f"{cat}-D01-01 Check DOC list received; golden samples per SKU available", f"{cat}-D01-02 Confirm all * values and open points with QS before travel", f"{cat}-D01-03 Equipment list B complete and in calibration", f"{cat}-D01-04 Factory readiness ≥ 100 % produced / ≥ 80 % packed"], "GI, DOC", "—"),
        ("D02", "Arrival, identification, quantity", "Đến nơi, nhận diện, số lượng", [f"{cat}-D02-01 Count per SKU vs P.O.", f"{cat}-D02-02 Factory = P.O./P.I.; Pending if not ready"], "1", "P01–P04"),
        ("D03", "Sampling & carton selection", "Lấy mẫu & chọn thùng", [f"{cat}-D03-01 Open ≥ √cartons from different pallets", f"{cat}-D03-02 Each SKU = own lot (Table 1); grouping only with written QS approval"], "GI", "P05"),
        ("D04", "Packing", "Đóng gói", [f"{cat}-D04-01…05 see form item 2"], "2", "P06–P12"),
        ("D05", "Artwork, marking & labels", "Artwork, nhãn mác", [f"{cat}-D05-01…  see form item 3; NO CE; GS only with certificate; A.R.E.N.A. never named"], "3", "P13–P20"),
        ("D06", "Sample comparison", "So sánh mẫu", [f"{cat}-D06-01 vs golden sample, 3 pcs/SKU"], "4", "P21–P22"),
        ("D07", "Workmanship", "Ngoại quan", [f"{cat}-D07-…  Level II; zones A (working faces) / B (visible) / C (hidden); photos with ruler"], "6", "see F"),
        ("D08", "On-site tests", "Thử nghiệm tại xưởng", d08_bullets, "7", "see F"),
        ("D09", "Special check list – critical points (3 pcs/SKU)", "Đo điểm quan trọng (3 mẫu/SKU)", d09_bullets, "5, Table 2", "see F"),
        ("D10", "Packing & product data", "Dữ liệu đóng gói & sản phẩm", [f"{cat}-D10-01 Carton size / GW / NW vs P.O.", f"{cat}-D10-02 Packaging material weight per sales unit (section 8)"], "2, 8", "see F"),
        ("D11", "Golden & shipment sample sealing", "Niêm phong mẫu", [f"{cat}-D11-01 Seal shipment sample per SKU family, record seal serial no."], "10", "see F"),
        ("D12", "Close meeting", "Họp kết thúc", [f"{cat}-D12-01 Findings explained, factory signs record"], "10", "see F"),
        ("D13", "Verdict, report & photos", "Kết luận, báo cáo & ảnh", [f"{cat}-V-01…05 apply; report to QS ≤ 24 h; QS issues the SRC, not the inspector"], "Summary", "—"),
    ]


def verdict(cat):
    return [
        (f"{cat}-V-01", "Any Critical defect or prohibited content → FAILED", "Bất kỳ lỗi nghiêm trọng hoặc nội dung cấm → KHÔNG ĐẠT"),
        (f"{cat}-V-02", "Major or Minor count > Ac, or any special-check value out of limit → FAILED", "Số lỗi nặng/nhẹ > Ac hoặc giá trị đo ngoài giới hạn → KHÔNG ĐẠT"),
        (f"{cat}-V-03", "Production < 100 % / packing < 80 %, golden sample or judgement document missing, blocking open point → PENDING", "Sản xuất < 100 % / đóng gói < 80 %, thiếu mẫu chuẩn / tài liệu, điểm mở chặn → CHỜ"),
        (f"{cat}-V-04", "All mandatory IDs reported with result, none failed → PASSED", "Tất cả ID bắt buộc có kết quả, không lỗi → ĐẠT"),
        (f"{cat}-V-05", "A mandatory ID without a result = not done → report incomplete", "ID bắt buộc không có kết quả = chưa làm → báo cáo chưa đầy đủ"),
    ]


SHARED_PHOTOS_HEAD = ["Factory gate / name board", "Warehouse / finished goods", "Cartons stacked per P.O.", "Quantity count sheet",
                      "Opened cartons selected", "Carton marks – side 1", "Carton marks – side 2", "ITF-14 scan + digits",
                      "Pallet & loaded height", "ISPM 15 marks (2 faces)", "SSCC label", "Inside carton / protection",
                      "Colour box / card / hanger front", "Colour box / card back – DEDEMAN identity", "Greek safety text",
                      "Product marking (size, brand, batch)", "EAN scan + digits", "Made in India", "Prohibited-content screen (no CE / GS)",
                      "Environmental claim on print", "Golden sample vs product – front", "Golden sample vs product – detail"]
SHARED_PHOTOS_TAIL = ["Carton dimensions", "Carton gross weight", "Packaging material weights", "Golden sample seal",
                      "Shipment sample seal + serial", "Defect close-up", "Defect overview", "Close-meeting record signed"]


def photo_ids(cat, group_photos):
    allp = SHARED_PHOTOS_HEAD + list(group_photos) + SHARED_PHOTOS_TAIL
    return [(f"{cat}-P{i:02d}", f"P{i:02d} {p}") for i, p in enumerate(allp, 1)]


SHARED_STANDARDS = [
    ("EU", "GPSR (EU) 2023/988", "EUR-Lex (search result, 04/11/2026)", "Applies from 13/12/2024 (Art. 52) – V", "Art. 9(2), 9(5), 9(6), 9(7)"),
    ("EU", "Machinery Reg. (EU) 2023/1230 / Dir. 2006/42/EC", "EUR-Lex (search result)", "Hand tools without drive system – out of scope (assessment)", "No CE"),
    ("EU", "PPWR (EU) 2025/40", "EUR-Lex / Commission (search result)", "Applies from 12/08/2026 – V", "DOC-09, section 8"),
    ("EU", "REACH Annex XVII entry 50 §5; Art. 33", "EUR-Lex Reg. 1272/2013; ECHA guideline", "V (later amendments not checked)", "1 mg/kg per listed PAH – skin-contact rubber/plastic"),
    ("EU", "Directive (EU) 2024/825 (environmental claims)", "Not opened this session", "UNVERIFIED – QS check application date", "'Recyclable' claims D05-08"),
    ("EU", "EN ISO 2409 cross-cut", "Not opened – method reference", "SoA, current edition", "Coating adhesion test"),
]

SHARED_OPEN = [
    ("O1", "P.O. EAN issues: product codes with 14/15 digits (326/2836, /2839, /2843, /2845; 240/2038); duplicate product EANs (230/2069=/2070; 240/2040=/2041; 240/2043=/2044; 240/2045=/2046=/2047; 250/2338=250/4981); most 14-digit outer codes fail the GTIN check digit (look like '59491111…'); 148/4612 outer has 12 digits; 109/1291 no outer code", "QS to obtain corrected EAN list from DEDEMAN before FRI; inspector scans and records actual digits", "QS", "D05-06, D04-02"),
    ("O2", "49 + 10 + 2 SKUs: each SKU is its own lot under ISO 2859-1 → large sample effort for small lots", "QS may approve grouping SKUs of identical construction/finish differing only in size into one lot (written approval, recorded in report)", "QS", "D03-02"),
    ("O3", "Hand tools (no drive system) assessed out of Machinery Reg. scope – GPSR only", "QS confirm; no CE on product or print", "QS", "D05-05"),
    ("O4", "Language of safety information for Greece and DEDEMAN print-file languages not confirmed", "QS confirm required languages with DEDEMAN", "QS", "D05-04"),
    ("O5", "Directive (EU) 2024/825 application to 'recyclable' claims not verified", "QS verify; keep claim only with basis", "QS", "D05-08"),
]

SHARED_LESSONS = [
    "Scan every barcode and write the digits – this P.O. already contains invalid and duplicate EANs.",
    "GS / TÜV text on print or product needs a valid GS certificate for the DEDEMAN type – otherwise Critical.",
    "A visual estimate is not accepted where a gauge exists – record all readings and the worst value.",
    "Never use an extension pipe or hammer to force a clamp/torque test – hand force with the standard handle only.",
]

REVISIONS = [("V1", DATE, f"First issue for DEDEMAN {PO} (rebuilt per spec; master form not available)")]

DET_SAMPLE = "S-3"
