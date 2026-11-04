"""Group A – Bench vices & anvil (VCE) – DEDEMAN P0A1030690, HOLZER, EU (Greece)."""
import re
from dd_common import *  # noqa: F401,F403
import dd_common as B

CAT = "VCE"
DOC_ID = f"ARENA-FRI-STD-{CAT}-{B.VERSION}"
CATEGORY = "Bench vices & anvil (HOLZER) – DEDEMAN P0A1030690"
CATEGORY_VI = "Ê-tô bàn & đe (HOLZER)"
TITLE_EN = "BENCH VICES & ANVIL – DEDEMAN P0A1030690"
TITLE_VI = "Ê-TÔ BÀN & ĐE – DEDEMAN P0A1030690"
SKUS = B.skus(refs=["184/0053", "196/4613", "148/4612", "109/1288", "109/1289", "109/1290", "109/1291",
                    "124/3025", "124/3026", "124/3027"])
TABLE1 = B.table1(SKUS)
FIGS = ["fig_vce_points.png", "fig_vce_tests.png"]
FIG_CAPTION = ("Critical points – see Fig. A1 (A vice side, B jaws, C anvil) and Fig. A2 (test set-ups):",
               "Điểm quan trọng – xem Hình A1 và Hình A2:")
MATRIX_NOTE = ("Matrix note: no OJ-cited EN for bench vices or anvils (SoA). Nominal jaw width from P.O. description; other limits = "
               "approved supplier drawing (DOC-04) or ARENA proposals marked * – QS to confirm. GS claims (124/3025, 124/3026) need the "
               "GS certificate (DOC-10). | Ghi chú: không có EN hài hòa; giới hạn theo bản vẽ hoặc đề xuất ARENA *.")
SCOPE = ("Used by A.R.E.N.A. QC or an appointed inspection body for the FRI of HOLZER bench vices (SG-iron baby vices with swivel "
         "base, fabricated-steel fixed-base vices 80–150 mm, PVG precision vices with swivel base) and a 5 kg SG-iron anvil supplied "
         "by Gripwell Forgings & Tools (India) to DEDEMAN for Greece. Legal stream: GPSR (EU) 2023/988 – NO CE marking. DEDEMAN "
         "(HOLZER own brand) is the GPSR manufacturer; Gripwell is the producer. Hand tools without a drive system are outside the "
         "Machinery Regulation (O3). A.R.E.N.A. is a sourcing office only: never manufacturer, importer or GPSR responsible person.")

DOCS = B.docs(CAT, "Accredited lab report per vice type: clamping-force / spindle-torque & jaw-hardness test, coating adhesion "
              "(no., lab, date ≤ 2 years, valid at ETD, supplier ref. shown)",
              "Báo cáo PTN được công nhận theo kiểu ê-tô: lực kẹp / mô-men trục vít, độ cứng hàm, độ bám sơn (≤ 2 năm, có mã hàng)",
              extra=[(f"{CAT}-DOC-10", "GS certificate (TÜV or other GS body) valid for PVG vices 124/3025 and 124/3026 as DEDEMAN/HOLZER type – holder, "
                      "certificate no., validity, model list – or removal of 'TÜV GS approved' from product and print",
                      "Chứng nhận GS hợp lệ cho ê-tô PVG 124/3025, 124/3026 theo kiểu DEDEMAN/HOLZER – hoặc xóa 'TÜV GS approved'", True)])

ITEMS = {
    1: B.item1(CAT),
    2: B.item2(CAT, "Protection: colour box fits, inner corner pads; vice handle secured; jaws and anvil face protected (oil / paper); "
                    "no loose parts; heavy items packed 1 pc/inner as P.O.",
               "Bảo vệ: hộp vừa, đệm góc; tay quay cố định; hàm & mặt đe được bảo vệ (dầu/giấy); không lỏng; hàng nặng 1 cái/hộp"),
    3: B.item3(CAT, "Product marking: HOLZER brand, jaw width (mm), batch / type no. cast or labelled on body – GPSR Art. 9(5)",
               "Ghi nhãn sản phẩm: HOLZER, bề rộng hàm (mm), số lô / kiểu trên thân – Điều 9(5)",
               extra=[(f"{CAT}-D05-09", "Instruction leaflet: bench mounting (bolt size, bench strength), max. hand force – no extension pipe or hammer on handle, "
                       "swivel lock, maintenance; anvil: stable mounting, eye protection when striking",
                       "HDSD: lắp bàn (cỡ bu lông), chỉ dùng lực tay – không nối ống hay búa vào tay quay, khóa đế xoay, bảo dưỡng; đe: đặt vững, đeo kính", "II"),
                      (f"{CAT}-D05-10", "Weight marking on carton for heavy units (> 10 kg* per DEDEMAN spec) and 'heavy – lift with care' symbol where specified",
                       "Ghi khối lượng trên thùng hàng nặng (> 10 kg*) và ký hiệu 'hàng nặng' nếu quy định", "II")]),
    4: B.item4(CAT, "vs golden sample: body material/finish (SG-iron wrinkle black, steel black, PVG blue), jaw plates, spindle & handle chrome, "
                    "swivel base, pipe jaws (PVG), anvil horn & machined face, colour box",
               "So với mẫu chuẩn: vật liệu/màu thân, má kẹp, trục & tay mạ crôm, đế xoay, hàm kẹp ống (PVG), sừng & mặt đe, hộp màu"),
    6: ("Workmanship", "Tay nghề / ngoại quan", [
        (f"{CAT}-D07-01", "Safety check: castings / weldments without crack, cold shut or blow hole in load path (body, slide, base, anvil waist); handle end stops fitted both ends; no sharp edges or burrs",
         "An toàn: vật đúc / hàn không nứt, rỗ trên đường chịu lực; chặn hai đầu tay quay; không cạnh sắc / bavia", "S-3"),
        (f"{CAT}-D07-02", "Jaw plates: hardened serration complete, screws tight and flush, plates parallel", "Má kẹp: răng đều, vít chặt & phẳng, song song", "II"),
        (f"{CAT}-D07-03", "Coating: powder / wrinkle coat full coverage, no peeling, runs, bare spots; machined surfaces (slide, jaws, anvil face) rust-protected", "Lớp sơn phủ kín, không bong/chảy/hở; mặt gia công được chống gỉ", "II"),
        (f"{CAT}-D07-04", "Chrome-plated spindle, handle, locking nuts: no peeling, blisters, rust, pits", "Trục, tay quay, đai ốc mạ crôm: không bong, phồng, gỉ, rỗ", "II"),
        (f"{CAT}-D07-05", "Fasteners & swivel base: all present, tightened; lock levers/nuts operate", "Bu lông & đế xoay: đủ, chặt; cần/đai ốc khóa hoạt động", "II"),
    ]),
}

MATRIX = [
    (f"{CAT}-D09-01", "b", "Jaw width (vices)", "Bề rộng hàm", "A1-B", "Across jaw plate, caliper", "= nominal ± 1 mm*", "Caliper 0.02 mm", "P24"),
    (f"{CAT}-D09-02", "a", "Max. jaw opening (vices)", "Độ mở hàm tối đa", "A1-A", "Open fully, caliper / rule between plates", "≥ drawing value", "Caliper / rule 1 mm", "P25"),
    (f"{CAT}-D09-03", "c", "Throat depth (vices)", "Chiều sâu hàm", "A1-A", "Top of jaw → top of slide", "Drawing ± tol. table", "Rule 1 mm", "P25"),
    (f"{CAT}-D09-04", "g", "Closed-jaw gap / parallelism (vices)", "Khe hở hàm khép", "A1-B", "Close by hand, feeler gauge at both ends", "≤ 0.2 mm* (ARENA)", "Feeler gauge 0.05 mm", "P26"),
    (f"{CAT}-D09-05", "h", "Mounting hole Ø / pitch (vices)", "Lỗ bắt bàn Ø / khoảng cách", "—", "Caliper on base holes", "Drawing ± tol. table", "Caliper 0.02 mm", "P27"),
    (f"{CAT}-D09-06", "m", "Net weight", "Khối lượng tịnh", "A1-C", "Scale, without packaging", "P.O. / drawing ± 5 %* (anvil 5 kg ± 3 %*)", "Scale 10 g", "P28"),
    (f"{CAT}-D09-07", "f", "Anvil face flatness", "Độ phẳng mặt đe", "A1-C", "Straightedge on face, feeler gauge", "≤ 0.5 mm* (ARENA)", "Straightedge + feeler", "P29"),
    (f"{CAT}-D09-08", "HRC", "Jaw / anvil face hardness (info)", "Độ cứng hàm / mặt đe (tham khảo)", "—", "File test; portable hardness tester if equipped", "File skids; HRC per drawing (QS)", "File / tester", "P30"),
]

TESTS = [
    (f"{CAT}-T1", "Spindle function", "Chức năng trục vít", "S-3",
     "Open and close the vice over the full travel by hand with the supplied handle.",
     "Smooth, no binding or abnormal play; moving jaw guided without rocking. Binding = Major."),
    (f"{CAT}-T2", "Clamping test (hand force)", "Thử kẹp (lực tay)", "S-3",
     "Clamp a steel bar (25 mm*) at mid-jaw; tighten firmly by hand with the supplied handle only – no extension pipe, no hammer (Fig. A2); "
     "if a torque wrench adaptor exists apply the drawing torque. Hold 1 min*, release.",
     "No slipping, crack, permanent bending of handle or spindle; jaw plates stay fixed. Crack/break = Critical; bent handle = Major."),
    (f"{CAT}-T3", "Swivel-base lock (swivel models)", "Khóa đế xoay (loại xoay)", "S-3",
     "Unlock: rotate 360°; lock at 0° and 90°; push sideways on the moving jaw by hand.",
     "Rotates freely when unlocked; no rotation when locked. Lock fails = Major. N/A fixed-base models."),
    (f"{CAT}-T4", "Handle retention", "Giữ tay quay", "S-3",
     "Slide the handle to each end and pull.", "Handle cannot leave the spindle (end stops). Handle comes off = Critical."),
    (f"{CAT}-T5", "Baby vice table clamp (196/4613, 148/4612)", "Kẹp bàn ê-tô mini", "S-3",
     "Clamp onto a 40 mm* board, clamp a part and work it by hand.", "Vice stays fixed, clamp screw does not slip. Slip = Major. N/A other models."),
    (f"{CAT}-T6", "PVG pipe jaws & fine adjustment (124/30xx)", "Hàm kẹp ống & chỉnh tinh (PVG)", "3 pcs",
     "Clamp a 25 mm* tube in the pipe jaws; operate fine-adjustment screws.", "Tube held without slipping; screws adjust smoothly. Fail = Major."),
    (f"{CAT}-T7", "Casting integrity – ring / tap test", "Kiểm tra vật đúc – gõ nghe", "S-3",
     "Suspend or rest on wood, tap body and anvil with a steel rod; inspect dull-sounding parts with lamp + 3× lens (dye penetrant if available).",
     "Clear ring, no crack. Crack = Critical."),
    (f"{CAT}-T8", "Coating adhesion – cross-cut", "Độ bám sơn – cắt ô", "1 pc/SKU",
     "Cross-cut on a flat body area, tape pull – method EN ISO 2409 (current edition, SoA).", "Classification ≤ 1* (ARENA); class 2 = Minor, ≥ 3 = Major."),
    (f"{CAT}-T9", "Barcode scan", "Quét mã vạch", "5 pcs/SKU", "Scan product EAN and carton code; write digits.", "Readable and = approved print file. Wrong = Major; unreadable = Minor."),
    (f"{CAT}-T10", "Label rub test", "Thử chà nhãn", "3 pcs", "Rub label / sticker 15 s wet + 15 s dry cloth.", "Legible, not peeling. Fail = Minor."),
    (f"{CAT}-T11", "Carton drop test", "Thử rơi thùng", "1 ctn/SKU family",
     "1 corner, 3 edges, 6 faces; ≤ 9.5 kg 76 cm, 9.5–18.6 kg 61 cm, 18.6–27.7 kg 46 cm, > 27.7 kg 30 cm* (ARENA practice unless DEDEMAN spec).",
     "No product damage, no part escapes the carton. Damage = Major."),
]

GROUP_DEFECTS = [
    ("Crack in casting / weld (body, slide, base, anvil)", "Nứt vật đúc / mối hàn", "Cri", f"{CAT}-T7"),
    ("Break or crack under clamping test", "Gãy / nứt khi thử kẹp", "Cri", f"{CAT}-T2"),
    ("Handle comes off spindle (end stop missing)", "Tay quay rơi khỏi trục (thiếu chặn)", "Cri", f"{CAT}-T4"),
    ("Sharp edge / burr on jaws, base or handle", "Cạnh sắc / bavia", "Cri", f"{CAT}-D07-01"),
    ("Jaw width / opening out of tolerance", "Bề rộng / độ mở hàm ngoài dung sai", "Maj", f"{CAT}-D09-01"),
    ("Closed-jaw gap > limit", "Khe hở hàm vượt giới hạn", "Maj", f"{CAT}-D09-04"),
    ("Spindle binding / swivel lock fails", "Trục kẹt / khóa xoay hỏng", "Maj", f"{CAT}-T1"),
    ("Jaw plate loose / serration incomplete", "Má kẹp lỏng / răng không đều", "Maj", f"{CAT}-D07-02"),
    ("Coating peeling / rust on machined faces", "Bong sơn / gỉ mặt gia công", "Maj", f"{CAT}-D07-03"),
    ("Chrome peeling / pitting", "Bong / rỗ lớp crôm", "Maj", f"{CAT}-D07-04"),
    ("Anvil weight or flatness out of limit", "Khối lượng / độ phẳng đe ngoài giới hạn", "Maj", f"{CAT}-D09-06"),
    ("Cosmetic scratch / coating mark zone B", "Trầy / vết sơn vùng B", "Min", f"{CAT}-D07-03"),
]
DEFECTS = B.defects(CAT, GROUP_DEFECTS)

EQUIPMENT = [
    ("Caliper 200 mm", "Thước kẹp 200 mm", "0.02 mm", "D09-01/02/05"),
    ("Steel rule 300 mm + tape 3 m", "Thước lá 300 mm + thước dây 3 m", "1 mm", "D09-02/03"),
    ("Feeler gauge set + 300 mm straightedge", "Bộ thước lá căn + thước thẳng 300 mm", "0.05 mm", "D09-04/07"),
    ("Platform scale 0–30 kg", "Cân bàn 0–30 kg", "10 g", "D09-06, D10"),
    ("Hardness test file; portable hardness tester if available", "Giũa thử cứng; máy đo độ cứng cầm tay nếu có", "—", "D09-08"),
    ("Steel bar Ø25 mm*, steel tube Ø25 mm*, board 40 mm*", "Thanh thép Ø25, ống thép Ø25, ván 40 mm", "—", "T2, T5, T6"),
    ("Steel rod for ring test, lamp, 3× lens, dye penetrant (if available)", "Que thép, đèn, kính lúp 3×, thuốc thử thẩm thấu (nếu có)", "—", "T7"),
    ("Cross-cut cutter + tape", "Dao cắt ô + băng dính", "per EN ISO 2409", "T8"),
    ("Barcode scanner, stopwatch", "Máy quét mã vạch, đồng hồ bấm giờ", "—", "T9, T2"),
]
SAMPLING_TABLE = B.SAMPLING_TABLE
STEPS = B.steps(CAT, [f"{CAT}-T1…T11 – written method + criterion; hand force only, never an extension pipe"],
                [f"{CAT}-D09-01…08 3 pcs/SKU; record all readings + worst value", "Jaw width b decides SKU identity – measure first"])
VERDICT = B.verdict(CAT)
PHOTO_IDS = B.photo_ids(CAT, ["Product family view", "Jaw width b + caliper", "Max opening a / throat c", "Closed-jaw gap g feeler",
                              "Mounting holes", "Net weight", "Anvil face flatness", "Hardness file test", "T1 spindle", "T2 clamping set-up",
                              "T3 swivel lock", "T4 handle stops", "T5 baby vice clamp", "T6 PVG pipe jaws", "T7 ring / crack check",
                              "T8 cross-cut", "GS certificate / mark check (PVG)"])
STANDARDS_REF = B.SHARED_STANDARDS + [
    ("EU", "Bench vice / anvil product standard", "None OJ-cited found", "SoA", "Limits per drawing; ARENA *"),
    ("DE", "GS mark (ProdSG §§ 20–22) – voluntary", "Not opened this session", "Claim on PVG 124/3025-3026", "Valid GS certificate or remove claim"),
]
OPEN_POINTS = B.SHARED_OPEN + [
    ("O6", "PVG vices 124/3025 and 124/3026 described 'TÜV GS Approved'", "Obtain valid GS certificate for the DEDEMAN/HOLZER type (DOC-10) or remove the claim before FRI", "QS", f"{CAT}-D05-05, {CAT}-DOC-10"),
    ("O7", "124/3027 (80 mm PVG fixed): NW 21 kg in P.O. vs 4.3 kg for 109/1288 80 mm; SKU size 15×10×19 cm", "Supplier to confirm weight/dimensions", "QS", f"{CAT}-D09-06"),
    ("O8", "No drawing values for opening, throat, mounting holes in P.O.", "Supplier drawing per SKU (DOC-04) before FRI", "QS", f"{CAT}-D09-02…05"),
]
LESSONS = B.SHARED_LESSONS + ["Casting cracks are often invisible – ring/tap test every sample (T7)."]
REVISIONS = B.REVISIONS


def _nominal(k):
    m = re.search(r"(\d{2,3})\s*MM", k["desc"].upper())
    return f"{m.group(1)} mm" if m else "per drawing"


TABLE2_BLOCKS = []
for i, k in enumerate(SKUS):
    anvil = k["ref"] == "184/0053"
    rows = []
    for id_, ref, en, vi, fig, how, lim, tool, ph in MATRIX:
        if anvil and ref in ("b", "a", "c", "g", "h"):
            continue
        if not anvil and ref == "f":
            continue
        spec = (_nominal(k) + " ± 1 mm*") if ref == "b" else (f"{k['nw']} kg (P.O.) ± 5 %*" if ref == "m" and k.get("nw") else lim)
        if anvil and ref == "m":
            spec = "5 kg ± 3 %*"
        rows.append([id_, (f"{ref} – {en}", f"{ref} – {vi}"), spec, "", "", "", "", None])
    TABLE2_BLOCKS.append(dict(
        title=(f"SKU {k['ref']} · Ally {k['ally']} · {k['desc'][:90]}", f"Mã {k['ref']} · Bản vẽ: {B.PH}"),
        page_break=(i % 2 == 0),
        head=[("ID", "Mã"), ("Parameter", "Thông số"), ("Specification", "Yêu cầu"), "S1", "S2", "S3", ("Worst", "Kém nhất"), ("Result", "Kết quả")],
        widths=[1250, 2650, 2000, 950, 950, 950, 1180, 1400], rows=rows))
