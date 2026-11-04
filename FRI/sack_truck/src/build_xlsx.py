"""Requirement checklist FRI_checklist_TRO_<PO>_(V1).xlsx – same content source as the .docx."""
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
import content_tro as C

NAVY = "151F37"
HDR = Font(name="Arial", bold=True, color="FFFFFF", size=9)
F = Font(name="Arial", size=9)
FB = Font(name="Arial", size=9, bold=True)
FILL = PatternFill("solid", fgColor=NAVY)
WRAP = Alignment(wrap_text=True, vertical="top")
THIN = Border(*(Side(style="thin", color="BFBFBF"),) * 4)


def sheet(ws, head, rows, widths):
    ws.append(head)
    for c in ws[1]:
        c.font, c.fill, c.alignment, c.border = HDR, FILL, WRAP, THIN
    for r in rows:
        ws.append(list(r))
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.font, c.alignment, c.border = F, WRAP, THIN
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[ws.cell(1, i).column_letter].width = w
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = ws.dimensions


def main(out):
    req = C.requirements()
    total = len(req)
    mand = sum(r["mandatory"] == "Y" for r in req)
    qs = sum(r["mandatory"] == "Y" and r["status"] == "QS to fill" for r in req)
    status = "Incomplete" if qs else "Draft"

    wb = Workbook()
    ws = wb.active
    ws.title = "Cover"
    cover = [
        ("A.R.E.N.A. – ARENA FRI Standard requirement checklist", ""),
        ("Document ID", C.DOC_ID), ("Version", C.VERSION), ("Status", status),
        ("Readiness", "DRAFT – not usable as validation benchmark (mandatory rows 'QS to fill')" if qs else "Ready for QS approval"),
        ("Owner", "QS"), ("Approver (name, date)", C.PH), ("Effective date", C.PH),
        ("Category", f"{C.CATEGORY} ({C.CAT})"), ("Destination market", C.MARKET),
        ("Legal stream", "GPSR (EU) 2023/988 – NO CE marking; Machinery Reg. (EU) 2023/1230 out of scope (assessment)"),
        ("P.O.", "Generic – P.O. annex blank " + C.PH), ("AQL", C.AQL), ("Sampling", C.SAMPLING),
        ("IDs total", total), ("IDs mandatory", mand), ("Mandatory 'QS to fill'", qs),
        ("", ""), ("Revision", ""),
    ]
    for a, b in cover:
        ws.append([a, b])
    for v, d, ch in C.REVISIONS:
        ws.append([f"{v} · {d}", ch])
    ws["A1"].font = Font(name="Arial", bold=True, size=12, color="DC5733")
    for row in ws.iter_rows(min_row=2):
        row[0].font = FB
        row[1].font = F
        row[1].alignment = WRAP
    ws["B5"].font = Font(name="Arial", bold=True, color="C00000", size=9)
    ws.column_dimensions["A"].width = 28
    ws.column_dimensions["B"].width = 100

    ws = wb.create_sheet("Requirements")
    head = ["ID", "Layer", "CP", "Step", "SKU", "Requirement EN", "Requirement VI", "Method", "Sample size",
            "Accept limit", "Reject class", "Evidence required", "Source", "Mandatory", "Status", "Market"]
    keys = ["id", "layer", "cp", "step", "sku", "en", "vi", "method", "sample", "limit", "reject", "evidence",
            "source", "mandatory", "status", "market"]
    sheet(ws, head, [[r[k] for k in keys] for r in req],
          [13, 7, 5, 6, 6, 45, 40, 40, 10, 28, 9, 20, 22, 9, 11, 6])
    n = len(req) + 1
    for col, lst in (("N", '"Y,N"'), ("O", '"Defined,QS to fill"'), ("K", '"Cri,Maj,Min,Cri/Maj,—"')):
        dv = DataValidation(type="list", formula1=lst, allow_blank=True)
        ws.add_data_validation(dv)
        dv.add(f"{col}2:{col}{n}")
    ws.conditional_formatting.add(f"A2:P{n}", FormulaRule(formula=['$O2="QS to fill"'],
                                  fill=PatternFill("solid", fgColor="FFF2CC")))
    for row in ws.iter_rows(min_row=2, max_col=1):
        row[0].font = FB

    ws = wb.create_sheet("Open points")
    sheet(ws, ["No.", "Observation", "Rule / action", "Owner", "Linked IDs", "Due"],
          [list(o) + [C.PH] for o in C.OPEN_POINTS], [6, 60, 55, 8, 25, 12])

    ws = wb.create_sheet("Precedence")
    ws.append(["Order of precedence"])
    ws.append(["1 EU law and any OJ-cited standard → 2 Ally protocol / QC Pack → 3 ARENA FRI Standard → 4 inspector practice. The ARENA standard never relaxes a higher-level requirement."])
    ws.append([])
    start = ws.max_row + 1
    ws.append(["Market", "Standard / act", "Source used", "Status", "Clauses / values used"])
    for r in C.STANDARDS_REF:
        ws.append(list(r))
    ws["A1"].font = FB
    for c in ws[start]:
        c.font, c.fill = HDR, FILL
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = WRAP
            if c.row != start:
                c.font = F
    for col, w in zip("ABCDE", [10, 32, 36, 40, 45]):
        ws.column_dimensions[col].width = w

    ws = wb.create_sheet("Retired")
    sheet(ws, ["ID", "Retired in version", "Reason", "Replaced by"], [], [14, 16, 60, 14])

    ws = wb.create_sheet("Inspector brief")
    brief = [
        "INSPECTOR BRIEF – appointed inspection body | " + C.DOC_ID,
        f"Scope: FRI of manual sack trucks (non-powered) for {C.MARKET}. GPSR only – any CE mark = Critical.",
        f"Sampling: {C.SAMPLING}. AQL {C.AQL}. Each SKU/variant is its own lot; open ≥ √cartons from different pallets.",
        "Critical points: Table 2 rows TRO-D09-01…12 on 3 pcs per SKU – record every reading and the worst value.",
        "On-site tests TRO-T1…T12: written method and criterion in the form; T2 only on a factory rig, otherwise N/A with lab report TRO-DOC-07. Never stand persons on the toe plate.",
        "Equipment: " + "; ".join(f"{e} ({r})" for e, _, r, _ in C.EQUIPMENT) + ". Record instrument ID and calibration due date; out-of-calibration tools not used.",
        f"Mandatory photos: TRO-P01…P{len(C.PHOTO_IDS):02d} in the fixed order of the Sequence list.",
        "Rule: report every result against its requirement ID; a mandatory ID without a result = not done.",
        "Verdict: TRO-V-01…05. Report to A.R.E.N.A. QS within 24 h. The inspector does not release shipments – QS issues the SRC.",
    ]
    for b in brief:
        ws.append([b])
    ws["A1"].font = Font(name="Arial", bold=True, size=11, color="DC5733")
    for row in ws.iter_rows(min_row=2):
        row[0].font, row[0].alignment = F, WRAP
    ws.column_dimensions["A"].width = 130
    wb.save(out)
    print("saved", out, total, mand, qs, status)


if __name__ == "__main__":
    main(sys.argv[1])
