"""Group C – Lubrication tools: oil can & grease gun (LUB) – DEDEMAN P0A1030690, HOLZER, EU (Greece)."""
from dd_common import *  # noqa: F401,F403
import dd_common as B

CAT = "LUB"
DOC_ID = f"ARENA-FRI-STD-{CAT}-{B.VERSION}"
CATEGORY = "Lubrication tools – oil can & grease gun (HOLZER) – DEDEMAN P0A1030690"
CATEGORY_VI = "Dụng cụ bôi trơn – bình dầu & súng bơm mỡ (HOLZER)"
TITLE_EN = "OIL CAN & GREASE GUN – DEDEMAN P0A1030690"
TITLE_VI = "BÌNH DẦU & SÚNG BƠM MỠ – DEDEMAN P0A1030690"
SKUS = B.skus(refs=["149/2538", "151/0740"])
TABLE1 = B.table1(SKUS)
FIGS = ["fig_lub_points.png"]
FIG_CAPTION = ("Critical points and leak points – see Fig. C1 (A oil can, B grease gun):", "Điểm quan trọng và điểm rò – xem Hình C1:")
MATRIX_NOTE = ("Matrix note: no OJ-cited EN for oil cans or manual grease guns (SoA). Capacity from P.O. (500 ml / 15 oz); other limits = "
               "approved drawing (DOC-04) or ARENA proposals marked * – QS to confirm. Pressure claims need DOC-07. | Ghi chú: không có EN "
               "hài hòa; giới hạn theo bản vẽ hoặc đề xuất ARENA *.")
SCOPE = ("Used by A.R.E.N.A. QC or an appointed inspection body for the FRI of the HOLZER oil can 500 ml with flexible spout "
         "(149/2538) and grease gun 15 oz with flexible hose (151/0740), epoxy powder coated, supplied EMPTY by Gripwell Forgings & "
         "Tools (India) to DEDEMAN for Greece. Legal stream: GPSR (EU) 2023/988 – NO CE marking. DEDEMAN (HOLZER own brand) is the "
         "GPSR manufacturer; Gripwell is the producer. If either item is supplied pre-filled with oil or grease, CLP labelling and an "
         "SDS apply and the item must be re-assessed (O6). Pressure Equipment Directive scope of the grease gun to be confirmed (O7). "
         "A.R.E.N.A. is a sourcing office only: never manufacturer, importer or GPSR responsible person.")

DOCS = B.docs(CAT, "Accredited lab report per item: leak / pressure test (grease gun: rated working pressure if claimed), coating, "
              "REACH on hose and seals – no., lab, date ≤ 2 years, valid at ETD, supplier refs shown",
              "Báo cáo PTN theo sản phẩm: thử rò / áp suất (súng mỡ: áp suất làm việc nếu có ghi), lớp sơn, REACH cho ống & gioăng",
              extra=[(f"{CAT}-DOC-10", "Supplier declaration: items supplied empty (no oil / grease) – otherwise CLP label + SDS (Reg. (EC) 1272/2008)",
                      "Tuyên bố NCC: sản phẩm giao rỗng (không dầu / mỡ) – nếu không cần nhãn CLP + SDS", True)])

ITEMS = {
    1: B.item1(CAT),
    2: B.item2(CAT, "Protection: oil can spout and grease-gun hose coiled and fixed, coupler protected (cap / bag); colour label / colour box intact; "
                    "no dents; inner packs per P.O. (10 / 1 per inner)",
               "Bảo vệ: vòi bình dầu & ống súng mỡ cuộn cố định, đầu nối có nắp / túi; nhãn / hộp màu nguyên; không móp; đóng gói trong theo P.O."),
    3: B.item3(CAT, "Product marking: HOLZER, capacity (500 ml / 15 oz – metric value shown as approved), batch / type no. on body or label – GPSR Art. 9(5)",
               "Ghi nhãn: HOLZER, dung tích (500 ml / 15 oz – có giá trị hệ mét), số lô / kiểu – Điều 9(5)",
               extra=[(f"{CAT}-D05-09", "Instructions: filling / loading cartridge, bleeding air, use with grease nipples, max. pressure only if supported by DOC-07, "
                       "do not point hose at persons, clean after use; Greek text as approved",
                       "Hướng dẫn: nạp dầu / ống mỡ, xả khí, dùng với vú mỡ, áp suất tối đa chỉ khi có DOC-07, không chĩa vào người; tiếng Hy Lạp", "II"),
                      (f"{CAT}-D05-10", "No hazard pictogram / CLP text unless the item is supplied filled (then CLP label mandatory – O6)",
                       "Không có hình cảnh báo CLP trừ khi sản phẩm có chứa dầu / mỡ (khi đó bắt buộc nhãn CLP)", "II")]),
    4: B.item4(CAT, "vs golden sample: body shape and colour (blue epoxy oil can), pump trigger, flexible spout length, grease-gun barrel, "
                    "lever, T-handle, hose and coupler type, colour label / colour box",
               "So với mẫu chuẩn: thân & màu, cò bơm, vòi mềm, thân súng, cần bơm, tay chữ T, ống & đầu nối, nhãn / hộp màu"),
    6: ("Workmanship", "Tay nghề / ngoại quan", [
        (f"{CAT}-D07-01", "Safety check: no sharp edges on can seams, lever or barrel ends; hose crimp complete; lever pivot pin secured",
         "An toàn: không cạnh sắc ở mép hàn, cần, đầu thân; ép ống đầy đủ; chốt cần bơm cố định", "S-3"),
        (f"{CAT}-D07-02", "Seams and threads: can seam continuous, no pinholes; barrel/head and cap threads clean, not cross-threaded",
         "Mối ghép & ren: mép bình liên tục, không lỗ; ren đầu / nắp sạch, không chéo ren", "II"),
        (f"{CAT}-D07-03", "Coating: epoxy powder coat full coverage, no peeling, runs, rust; inside of can clean and dry (no residue, no rust)",
         "Lớp sơn epoxy phủ kín, không bong / chảy / gỉ; bên trong bình sạch, khô", "II"),
        (f"{CAT}-D07-04", "Flexible spout / hose: no cracks, kinks or delamination; fittings tight", "Vòi / ống mềm: không nứt, gập, bong lớp; đầu nối chặt", "II"),
    ]),
}

MATRIX = [
    (f"{CAT}-D09-01", "V", "Capacity (oil can)", "Dung tích (bình dầu)", "C1-A", "Fill with water to the brim / max. mark, pour into graduated cylinder", "≥ 500 ml (marked)", "Graduated cylinder 5 ml", "P24"),
    (f"{CAT}-D09-02", "ls", "Flexible spout length (oil can)", "Chiều dài vòi (bình dầu)", "C1-A", "Rule along the spout", "Drawing ± tol. table", "Rule 1 mm", "P25"),
    (f"{CAT}-D09-03", "lb", "Barrel length / Ø (grease gun)", "Chiều dài / Ø thân (súng mỡ)", "C1-B", "Rule / caliper", "Drawing; fits 400 g (14–15 oz) cartridge*", "Rule / caliper", "P26"),
    (f"{CAT}-D09-04", "lh", "Hose length (grease gun)", "Chiều dài ống (súng mỡ)", "C1-B", "Rule, hose straight", "Drawing ± tol. table", "Rule 1 mm", "P26"),
    (f"{CAT}-D09-05", "M", "Coupler / nipple thread (grease gun)", "Ren đầu nối (súng mỡ)", "C1-B", "Thread gauge; fit on test grease nipple", "M10×1* per drawing", "Thread gauge", "P27"),
    (f"{CAT}-D09-06", "m", "Net weight", "Khối lượng tịnh", "—", "Scale, empty", "P.O. NW ± 10 %*", "Scale 1 g", "P28"),
]

TESTS = [
    (f"{CAT}-T1", "Oil can pump function", "Chức năng bơm bình dầu", "S-3",
     "Fill with light machine oil or water (factory choice, record), pump the trigger 10 times through the spout.",
     "Steady jet from the spout tip; trigger returns. No output = Major."),
    (f"{CAT}-T2", "Oil can leak test", "Thử rò bình dầu", "S-3",
     "Filled can, cap and spout tight: hold inverted 5 min* over white paper, check leak points L1–L3 (Fig. C1). Empty and dry after test.",
     "No drip at seam, cap, spout or pump. Leak = Major."),
    (f"{CAT}-T3", "Grease gun function (dry + grease if available)", "Chức năng súng mỡ", "S-3",
     "Operate lever and T-handle full travel; load grease or a cartridge if the factory has it, pump 10 strokes into a test nipple.",
     "Smooth stroke, follower spring returns, grease delivered. No delivery / jam = Major."),
    (f"{CAT}-T4", "Grease gun leak / coupler test", "Thử rò / đầu nối súng mỡ", "S-3",
     "With grease: pump against a blocked test nipple 10 strokes; check L1 head thread, L2 hose crimp, L3 coupler.",
     "No leak; coupler grips the nipple and releases by hand. Leak or coupler slips = Major; hose pulls out = Critical. "
     "If no grease available: N/A, covered by DOC-07."),
    (f"{CAT}-T5", "Flexible spout / hose bend", "Uốn vòi / ống mềm", "3 pcs",
     "Bend spout / hose 10 times by hand to its normal working radius.", "No crack, kink or loosening at fittings. Crack = Major."),
    (f"{CAT}-T6", "Coating adhesion – cross-cut", "Độ bám sơn – cắt ô", "1 pc/SKU",
     "Cross-cut on a flat area, tape pull – method EN ISO 2409 (current edition, SoA).", "Classification ≤ 1* (ARENA); class 2 = Minor, ≥ 3 = Major."),
    (f"{CAT}-T7", "Barcode scan", "Quét mã vạch", "5 pcs/SKU", "Scan label / box EAN and carton code; write digits.", "Readable and = approved print file. Wrong = Major."),
    (f"{CAT}-T8", "Label rub test", "Thử chà nhãn", "3 pcs", "Rub colour label 15 s wet (oil-wet cloth) + 15 s dry.", "Legible, not peeling. Fail = Minor."),
    (f"{CAT}-T9", "Carton drop test", "Thử rơi thùng", "1 ctn/SKU",
     "1 corner, 3 edges, 6 faces; ≤ 9.5 kg 76 cm, 9.5–18.6 kg 61 cm* (ARENA practice unless DEDEMAN spec).",
     "No dent or damage that affects function / sale. Damage = Major."),
]

GROUP_DEFECTS = [
    ("Hose pulls out of crimp / fitting under pumping", "Ống tuột khỏi đầu ép khi bơm", "Cri", f"{CAT}-T4"),
    ("Sharp edge on can seam, lever or barrel end", "Cạnh sắc ở mép bình, cần, đầu thân", "Cri", f"{CAT}-D07-01"),
    ("Item supplied filled without CLP label / SDS", "Có chứa dầu / mỡ nhưng không có nhãn CLP / SDS", "Cri", f"{CAT}-D05-10"),
    ("Leak at seam, cap, pump, head thread or coupler", "Rò ở mép, nắp, bơm, ren đầu hoặc đầu nối", "Maj", f"{CAT}-T2"),
    ("Pump / lever does not deliver", "Bơm / cần không ra dầu / mỡ", "Maj", f"{CAT}-T1"),
    ("Coupler does not grip nipple / wrong thread", "Đầu nối không bám vú mỡ / sai ren", "Maj", f"{CAT}-D09-05"),
    ("Capacity below marked value", "Dung tích nhỏ hơn ghi", "Maj", f"{CAT}-D09-01"),
    ("Spout / hose cracked or kinked", "Vòi / ống nứt hoặc gập", "Maj", f"{CAT}-T5"),
    ("Coating peeling / rust / dents", "Bong sơn / gỉ / móp", "Maj", f"{CAT}-D07-03"),
    ("Pressure claim without test report", "Ghi áp suất không có báo cáo thử", "Maj", f"{CAT}-D05-09"),
    ("Cosmetic scratch zone B", "Trầy vùng B", "Min", f"{CAT}-D07-03"),
]
DEFECTS = B.defects(CAT, GROUP_DEFECTS)

EQUIPMENT = [
    ("Graduated cylinder 500 ml + funnel", "Ống đong 500 ml + phễu", "5 ml", "D09-01"),
    ("Steel rule 500 mm, caliper 150 mm", "Thước lá 500 mm, thước kẹp 150 mm", "1 mm / 0.02 mm", "D09-02…04"),
    ("Thread gauge + test grease nipple (blocked and open)", "Calip ren + vú mỡ thử (bịt và hở)", "—", "D09-05, T3, T4"),
    ("Light machine oil or water; grease cartridge (if available)", "Dầu máy nhẹ hoặc nước; ống mỡ (nếu có)", "—", "T1–T4"),
    ("White paper, stopwatch, cloth", "Giấy trắng, đồng hồ bấm giờ, giẻ", "—", "T2, T8"),
    ("Scale 0–3 kg", "Cân 0–3 kg", "1 g", "D09-06"),
    ("Cross-cut cutter + tape, barcode scanner", "Dao cắt ô + băng dính, máy quét mã vạch", "per EN ISO 2409", "T6, T7"),
]
SAMPLING_TABLE = B.SAMPLING_TABLE
STEPS = B.steps(CAT, [f"{CAT}-T1…T9 – written method + criterion; empty and dry every tested sample before repacking"],
                [f"{CAT}-D09-01…06 3 pcs/SKU; record all readings + worst value"])
VERDICT = B.verdict(CAT)
PHOTO_IDS = B.photo_ids(CAT, ["Product views (oil can, grease gun)", "Capacity V in cylinder", "Spout length", "Barrel / hose length",
                              "Coupler thread gauge", "Net weight", "T1 pump jet", "T2 inverted leak check", "T3 grease delivery",
                              "T4 coupler on nipple", "T5 hose bend", "T6 cross-cut", "Inside of can – clean / dry"])
STANDARDS_REF = B.SHARED_STANDARDS + [
    ("EU", "Oil can / grease gun product standard", "None OJ-cited found", "SoA", "Limits per drawing; ARENA *"),
    ("EU", "PED 2014/68/EU (grease gun)", "Not opened this session", "UNVERIFIED – scope to confirm", "O7"),
    ("EU", "CLP Reg. (EC) 1272/2008", "Not opened this session", "Applies only if supplied filled", "O6, DOC-10"),
    ("DE (EU national)", "DIN 71412 (grease nipples)", "Licensed copy not opened", "SoA – edition to verify", "Coupler fit T4 (QS)"),
]
OPEN_POINTS = B.SHARED_OPEN + [
    ("O6", "Supply condition (empty vs filled) not stated in P.O.", "Supplier declaration DOC-10; if filled → CLP label + SDS", "QS", f"{CAT}-DOC-10, {CAT}-D05-10"),
    ("O7", "Pressure Equipment Directive 2014/68/EU scope for a manual grease gun not verified", "QS confirm before release; no CE unless in scope", "QS", f"{CAT}-D05-05"),
    ("O8", "15 oz (US unit) in P.O. – metric capacity on print not confirmed", "Print file shows metric value (ml / g)", "QS", f"{CAT}-D05-03"),
]
LESSONS = B.SHARED_LESSONS + ["Empty and dry every leak-tested sample – residue oil damages the colour label and carton."]
REVISIONS = B.REVISIONS

TABLE2_BLOCKS = []
for i, k in enumerate(SKUS):
    can = k["ref"] == "149/2538"
    keep = ("V", "ls", "m") if can else ("lb", "lh", "M", "m")
    rows = []
    for id_, ref, en, vi, fig, how, lim, tool, ph in MATRIX:
        if ref not in keep:
            continue
        spec = f"{k['nw']} kg (P.O.) ± 10 %*" if ref == "m" and k.get("nw") else lim
        rows.append([id_, (f"{ref} – {en}", f"{ref} – {vi}"), spec, "", "", "", "", None])
    TABLE2_BLOCKS.append(dict(
        title=(f"SKU {k['ref']} · Ally {k['ally']} · {k['desc'][:90]}", f"Mã {k['ref']} · Bản vẽ: {B.PH}"),
        page_break=(i == 0),
        head=[("ID", "Mã"), ("Parameter", "Thông số"), ("Specification", "Yêu cầu"), "S1", "S2", "S3", ("Worst", "Kém nhất"), ("Result", "Kết quả")],
        widths=[1250, 2650, 2000, 950, 950, 950, 1180, 1400], rows=rows))
