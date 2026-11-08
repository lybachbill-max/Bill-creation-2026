from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
import sys

NAVY, CORAL, CORAL_D, BLUE = "151F37", "DC5733", "C24A28", "006293"
WHITE, INK, GREY = "FFFFFF", "151F37", "5B6170"
BLUE_T, CORAL_T, NAVY_T = "E5EFF4", "FBEAE5", "E8E9EC"
PH = [("PHASE 1", "Compliance & Technical", "Tuân thủ & Kỹ thuật", BLUE, BLUE_T),
      ("PHASE 2", "Sourcing Support", "Hỗ trợ Tìm nguồn", CORAL_D, CORAL_T),
      ("PHASE 3", "Quality Control", "Kiểm soát Chất lượng", NAVY, NAVY_T)]

def rgb(h): return RGBColor.from_string(h)

prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
BL = prs.slide_layouts[6]

def rect(s, x, y, w, h, fill, line=None, shape=MSO_SHAPE.RECTANGLE):
    sh = s.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.fill.solid(); sh.fill.fore_color.rgb = rgb(fill)
    if line: sh.line.color.rgb = rgb(line); sh.line.width = Pt(0.75)
    else: sh.line.fill.background()
    sh.shadow.inherit = False
    return sh

def text(s, x, y, w, h, paras, size=10, color=INK, bold=False, align=PP_ALIGN.LEFT,
         anchor=MSO_ANCHOR.TOP, font="Arial", margin=0.05, spacing=0):
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True; tf.vertical_anchor = anchor
    for side in ("left", "right", "top", "bottom"):
        setattr(tf, f"margin_{side}", Inches(margin))
    if isinstance(paras, str): paras = [paras]
    for i, p in enumerate(paras):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = align
        if spacing: para.space_after = Pt(spacing)
        runs = p if isinstance(p, list) else [(p, {})]
        for r in runs:
            if isinstance(r, str): r = (r, {})
            run = para.add_run(); run.text = r[0]
            f = run.font; f.name = r[1].get("font", font); f.size = Pt(r[1].get("size", size))
            f.bold = r[1].get("bold", bold); f.italic = r[1].get("italic", False)
            f.color.rgb = rgb(r[1].get("color", color))
    return tb

def header(s, n, title, vn):
    rect(s, 0, 0, 0.18, 7.5, CORAL)
    text(s, 0.5, 0.3, 11.5, 0.6, title, size=24, bold=True, color=NAVY)
    text(s, 0.5, 0.85, 11.5, 0.35, vn, size=13, color=BLUE, font="Arial Narrow")
    rect(s, 0.55, 1.25, 1.2, 0.05, CORAL)
    text(s, 0.5, 7.05, 9, 0.3, "A.R.E.N.A. Vietnam · Quality & Compliance · Quality Team Roles · Nov 2026",
         size=8, color=GREY)
    text(s, 12.2, 7.05, 0.7, 0.3, f"{n} / 5", size=8, color=GREY, align=PP_ALIGN.RIGHT)

# ---------- Slide 1: title ----------
s = prs.slides.add_slide(BL)
rect(s, 0, 0, 13.333, 7.5, NAVY)
rect(s, 9.75, 1.3, 4.3, 4.3, CORAL, shape=MSO_SHAPE.OVAL)
rect(s, 9.95, 1.62, 4.0, 4.0, NAVY, shape=MSO_SHAPE.OVAL)
rect(s, 10.35, 2.05, 3.2, 3.2, BLUE, shape=MSO_SHAPE.OVAL)
text(s, 0.8, 0.7, 6, 0.5, "a.r.e.n.a.", size=22, bold=True, color=WHITE)
text(s, 0.8, 2.3, 9, 1.6, ["The Quality Team", "across the 3-Phase Flow"], size=40, bold=True, color=WHITE)
rect(s, 0.85, 4.05, 1.6, 0.06, CORAL)
text(s, 0.8, 4.3, 9, 0.5, "Đội ngũ Chất lượng theo 3 Giai đoạn", size=20, color="BFD8E4", font="Arial Narrow")
text(s, 0.8, 5.0, 9, 0.9,
     ["Compliance & Technical  →  Sourcing Support  →  Quality Control",
      "Who does what at each phase · aligned to ARENA-SOP-00-00-INT (P1–P7, gates G1–G5)"],
     size=13, color=WHITE, spacing=4)
text(s, 0.8, 6.6, 9, 0.4, "A.R.E.N.A. Vietnam · Quality & Compliance · November 2026 · Internal",
     size=10, color="9AA3B5")

# ---------- Slide 2: team + phases ----------
s = prs.slides.add_slide(BL)
header(s, 2, "One team, three phases", "Một đội ngũ, ba giai đoạn — cơ cấu và luồng công việc")
# org column
text(s, 0.55, 1.5, 4.2, 0.3, "QUALITY TEAM STRUCTURE · CƠ CẤU", size=10, bold=True, color=CORAL_D)
org = [("Quality Director", "Giám đốc Chất lượng", "Policy, governance, TPA/DOA decisions", NAVY, WHITE),
       ("Quality Manager", "Trưởng phòng Chất lượng", "Planning, territories, KPI follow-up", BLUE, WHITE),
       ("Quality Assistant", "Trợ lý Chất lượng", "Document control, trackers, data", BLUE_T, INK),
       ("9 Quality Supervisors (QS)", "9 Giám sát Chất lượng", "One product-family territory each · own SRC", CORAL_D, WHITE),
       ("QC Inspectors", "Kiểm tra viên QC", "On-site inspection CP1–CP10", NAVY_T, INK),
       ("IQA — Internal Quality Auditor", "Kiểm toán Chất lượng Nội bộ", "Independent audit & QCP review · advisory", "FFFFFF", INK)]
y = 1.85
for t, vn, d, f, c in org:
    r = rect(s, 0.55, y, 4.2, 0.74, f, line=NAVY if f == "FFFFFF" else None)
    text(s, 0.65, y + 0.03, 4.0, 0.7,
         [[(t, {"bold": True, "size": 11})], [(vn, {"size": 9, "font": "Arial Narrow"})], [(d, {"size": 9})]],
         color=c)
    y += 0.83
# phases
text(s, 5.2, 1.5, 7.8, 0.3, "THE THREE PHASES · BA GIAI ĐOẠN", size=10, bold=True, color=CORAL_D)
info = [("SOP P1–P2 · 8-link chain links 1–4",
         "Define the compliance baseline: pathway, standards, QSD/QCP, test plan, technical file."),
        ("SOP P2–P3 · 8-link chain link 5",
         "Back the sourcing team: supplier qualification, RFx technical input, FPC, golden sample, artwork."),
        ("SOP P4–P7 · 8-link chain links 6–8",
         "Verify and release: DPI, FRI, test reports, DoC/DoP, SRC, complaints and 8D/CAPA.")]
x = 5.2
for i, (p, en, vn, col, tint) in enumerate(PH):
    chev = s.shapes.add_shape(MSO_SHAPE.CHEVRON if i else MSO_SHAPE.PENTAGON,
                              Inches(x), Inches(1.85), Inches(2.75), Inches(0.95))
    chev.fill.solid(); chev.fill.fore_color.rgb = rgb(col); chev.line.fill.background()
    text(s, x + (0.35 if i else 0.15), 1.9, 2.1, 0.85,
         [[(p, {"size": 9, "bold": True})], [(en, {"size": 12, "bold": True})], [(vn, {"size": 9, "font": "Arial Narrow"})]],
         color=WHITE, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, x + 0.05, 2.95, 2.45, 2.25, tint)
    text(s, x + 0.12, 3.02, 2.33, 2.15,
         [[(info[i][0], {"bold": True, "size": 9, "color": col})], [(info[i][1], {"size": 10})]],
         spacing=6)
    x += 2.6
rect(s, 5.25, 5.4, 7.6, 1.45, "FFFFFF", line=CORAL)
text(s, 5.35, 5.45, 7.4, 1.4,
     [[("Two ETD gates run through all phases · Hai mốc ETD", {"bold": True, "color": CORAL_D, "size": 10})],
      "• ETD − 45 days: test reports, declarations and technical file complete (accredited reports valid 2 yrs and still valid at ETD).",
      "• SRC issued by QS at least 7 days (default buffer) before ETD. IQA advises; QS owns the gate."],
     size=10, spacing=3)

# ---------- Slide 3: matrix ----------
s = prs.slides.add_slide(BL)
header(s, 3, "Position × phase: key tasks", "Vị trí × giai đoạn: nhiệm vụ chính")
LX, LW, CW, TOP = 0.55, 2.15, 3.43, 1.5
for i, (p, en, vn, col, tint) in enumerate(PH):
    cx = LX + LW + 0.05 + i * (CW + 0.05)
    rect(s, cx, TOP, CW, 0.5, col)
    text(s, cx, TOP, CW, 0.5, [[(f"{p} · {en}", {"bold": True, "size": 11})], [(vn, {"size": 8, "font": "Arial Narrow"})]],
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0.02)
rows = [
 ("Quality Director", "Giám đốc CL",
  ["Sets compliance policy and pathway governance", "Decides per TPA/DOA matrix (SOP-00-05)"],
  ["Strategic layer with factory GM + Head of Sourcing", "Final call on supplier qualification escalations"],
  ["Owns 21-KPI quality review", "Escalation point for critical NCs / recalls"]),
 ("Quality Manager", "Trưởng phòng CL",
  ["Allocates QS territories and workload", "Reviews pathway register and QSD quality"],
  ["Assigns QS to RFx (T1/T2/T3) technical review", "Reviews VQA / SVR and FPC audit results"],
  ["Plans inspection resources", "Tracks FRI pass rate and CAPA closure"]),
 ("Quality Assistant", "Trợ lý CL",
  ["Files test reports, DoC/DoP, TCF (ARENA TechFile)", "Tracks report validity vs ETD"],
  ["Sends supplier document requests (CDF)", "Maintains VQA workbook and supplier tracker"],
  ["Supports inspection booking and report filing", "Updates IQS / QS Daily Alert data"]),
 ("Quality Supervisor (QS) ×9", "Giám sát CL",
  ["4-step pathway determination (A, B-CPR, B, C, D, E)", "QSD, QCP, standards edition check, ECT/test plan, GPSR RA"],
  ["Technical input to RFx; VQA pre-qualification (PASS ≥ 80%)", "Line audit, FPC, golden sample, artwork review L0–L3"],
  ["Docs complete at ETD − 45; FRI review", "Issues SRC (≥ 7 d pre-ETD); leads 8D/CAPA"]),
 ("QC Inspector", "Kiểm tra viên QC",
  ["Reviews QC Pack and inspection brief readiness"],
  ["Verifies golden sample; supports factory audits"],
  ["DPI and FRI CP1–CP10 (ISO 2859-1; AQL Cr 0 · Ma 2.5)", "CP5/CP6 packaging and loading checks"]),
 ("IQA", "Kiểm toán CL Nội bộ",
  ["Audits pathway / QSD vs rulebook and Register", "Adds retailer QCP layer"],
  ["QCP artwork conformance review (NB-9 / BR-6)", "Cross-checks supplier audit evidence"],
  ["FRI validation audit; advises on SRC", "Decides rework feasibility on CP5/CP6 fail"]),
]
RH, y = 0.79, TOP + 0.55
for k, (t, vn, *cells) in enumerate(rows):
    rect(s, LX, y, LW, RH, NAVY if k % 2 == 0 else BLUE)
    text(s, LX + 0.05, y, LW - 0.1, RH, [[(t, {"bold": True, "size": 11})], [(vn, {"size": 9, "font": "Arial Narrow"})]],
         color=WHITE, anchor=MSO_ANCHOR.MIDDLE)
    for i, c in enumerate(cells):
        cx = LX + LW + 0.05 + i * (CW + 0.05)
        rect(s, cx, y, CW, RH, PH[i][4])
        text(s, cx + 0.04, y, CW - 0.08, RH, [f"• {b}" for b in c], size=9, anchor=MSO_ANCHOR.MIDDLE, spacing=2)
    y += RH + 0.04

# ---------- Slide 4: outputs, gates, KPIs ----------
s = prs.slides.add_slide(BL)
header(s, 4, "What each phase must deliver", "Đầu ra, cổng kiểm soát và KPI của từng giai đoạn")
cols = [
 (["Compliance pathway (4-step method)", "QSD (13 sections) and QCP (11 sheets)",
   "Standards status: CURRENT / PASS-COEX / WATCH / SoA", "Test plan (ECT / TPM) and GPSR risk assessment",
   "TCF opened on lead item"],
  "Gate: QSD complete before P3", "SO-2 · 100% QSD completeness before P3"),
 (["VQA pre-qualification score (PASS ≥ 80%)", "Production line audit / SVR",
   "FPC set-up and audit", "Golden sample approved", "Artwork released L0–L3 (QS + IQA + Ally)"],
  "Gate: supplier qualified, artwork released", "SO-3 · Supplier FPC audit score ≥ 80%"),
 (["Test reports, DoC/DoP, technical file at ETD − 45", "DPI and FRI CP1–CP10 reports",
   "CE / conformity marking verified", "SRC issued ≥ 7 days pre-ETD", "8D / CAPA on complaints"],
  "Gate: SRC release (QS)", "SO-4 · FRI pass ≥ 95% first submission\nSO-5 · CAPA closure ≤ 30 days"),
]
x = 0.55
for i, (items, gate, kpi) in enumerate(cols):
    p, en, vn, col, tint = PH[i]
    rect(s, x, 1.5, 4.05, 0.75, col)
    text(s, x + 0.1, 1.5, 3.85, 0.75, [[(f"{p} · {en}", {"bold": True, "size": 13})], [(vn, {"size": 10, "font": "Arial Narrow"})]],
         color=WHITE, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, x, 2.3, 4.05, 2.3, tint)
    text(s, x + 0.12, 2.35, 3.85, 0.3, "KEY OUTPUTS · ĐẦU RA", size=9, bold=True, color=col)
    text(s, x + 0.12, 2.65, 3.85, 2.35, [f"• {b}" for b in items], size=11, spacing=5)
    rect(s, x, 4.72, 4.05, 0.55, "FFFFFF", line=col)
    text(s, x + 0.1, 4.72, 3.85, 0.55, gate, size=11, bold=True, color=col, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, x, 5.37, 4.05, 1.0, NAVY_T)
    text(s, x + 0.1, 5.37, 3.85, 1.0, [[("KPI", {"bold": True, "size": 9, "color": CORAL_D})]] + kpi.split("\n"),
         size=10, anchor=MSO_ANCHOR.MIDDLE)
    x += 4.18
text(s, 0.55, 6.55, 12.3, 0.3,
     "Overall: SO-1 zero post-shipment compliance failures · SO-6 Ally documentation on time at P5.",
     size=10, bold=True, color=NAVY)

# ---------- Slide 5: interfaces & boundaries ----------
s = prs.slides.add_slide(BL)
header(s, 5, "Interfaces and role boundaries", "Phối hợp liên phòng ban và giới hạn vai trò")
text(s, 0.55, 1.5, 6.0, 0.3, "WHO THE QUALITY TEAM WORKS WITH · PHỐI HỢP", size=10, bold=True, color=CORAL_D)
ifs = [("Merchandiser", "Milestones, inspection timing, corrective-action negotiation"),
       ("DCO", "Department category ownership (SOP-00-06)"),
       ("PPS-P", "Production follow-up, inspection booking"),
       ("PPS-Pkg", "Single receipt point for artwork files; version lock"),
       ("PPS-L", "Export-side documents only; no import clearance"),
       ("Ally", "Commercial approval; manufacturer on own-brand items")]
y = 1.85
for r, d in ifs:
    rect(s, 0.55, y, 1.45, 0.66, BLUE)
    text(s, 0.55, y, 1.45, 0.66, r, size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, 2.03, y, 4.5, 0.66, BLUE_T)
    text(s, 2.13, y, 4.35, 0.66, d, size=10, anchor=MSO_ANCHOR.MIDDLE)
    y += 0.72
text(s, 6.95, 1.5, 6.0, 0.3, "ROLE BOUNDARIES · GIỚI HẠN VAI TRÒ", size=10, bold=True, color=CORAL_D)
rect(s, 6.95, 1.85, 5.9, 3.45, "FFFFFF", line=NAVY)
text(s, 7.1, 1.95, 5.65, 3.3, [
    [("A.R.E.N.A. is a pure sourcing office.", {"bold": True})],
    "Never manufacturer, importer, Operator, CBAM declarant or GPSR responsible person.",
    [("EUDR: ", {"bold": True}), ("no role. Supplier and Ally only.", {})],
    [("CBAM (EU / UK): ", {"bold": True}), ("drafts only, on written Ally request, case by case.", {})],
    [("Standards: ", {"bold": True}), ("never block a cited edition, never inject a non-cited one; no cited edition = current CEN/ISO (SoA).", {})],
    [("Markets: ", {"bold": True}), ("EU-27 · EEA-3 · CH · GB · NI · CA · US. NI follows EU rules (CE; UKCA not valid).", {})],
    [("SRC: ", {"bold": True}), ("owned by QS; IQA advises, not the gate owner.", {})],
], size=11, spacing=7)
rect(s, 6.95, 5.45, 5.9, 0.6, CORAL_D)
text(s, 7.05, 5.45, 5.7, 0.6, "QC Pack outputs are always bilingual: English line above Vietnamese.",
     size=11, bold=True, color=WHITE, anchor=MSO_ANCHOR.MIDDLE)

prs.save(sys.argv[1])
print("saved")
