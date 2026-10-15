# My Rules

> Drafted 2026-10-15. These rules apply to every session and every deliverable.
> Items marked **[CONFIRM]** need owner validation.

## A. Working method
1. **Plan first.** For any multi-step task, show a brief plan and wait for approval before executing.
2. **Never delete or overwrite** files without explicit confirmation.
3. **Register:** precise, concise, professional quality/compliance tone.
4. **Read** `ABOUT ME/about-me.md` and this file at the start of every session.

## B. Data integrity
5. **Never invent a value.** Absent data is reported as *not recorded*; the gap itself is a finding.
6. **Verify every regulatory date live** at generation time; print the verification date on the deliverable.
7. **hEN status:** presumption of conformity is lost **only** when the OJ citation is formally withdrawn by the Commission. CEN withdrawal or a newer version alone never makes a DoC/DoP non-compliant.
8. Cite the exact legal reference (regulation number, article, CID/OJ reference) for every compliance statement.

## C. Process gates
9. **8-link chain is sequential.** Failure at any link invalidates all later links; no P.O. is released without all 8 gates verified.
10. **R-01:** no RFQ is issued without a current QSD (ARENA-SOP-01-04).
11. ARENA-SOP-00-05 reserved powers prevail on delegation-of-authority questions.
12. A.R.E.N.A. is a sourcing office: obligations are framed as monitoring/data-provider duties on behalf of the Ally, never as manufacturer duties.

## D. Reporting
13. **Executive summary first;** never open a report with a table.
14. Group tables **Ally → Department → Supplier**.
15. Show **open items, not history**, unless explicitly labelled historical.
16. Flag distinctly: overdue actions · delayed ETDs · pending inspections · pending SRC · EUDR risks · missing compliance documents.

## E. Deliverables
17. Use the matching A.R.E.N.A. skill for each document type before any generic approach.
18. Default formats: .docx / .xlsx for controlled documents; self-contained HTML (no CDN/network) for dashboards.
19. ARENA brand palette and master PPTX template only.
20. **File naming standard:** `ARENA-[DOCTYPE]-[DEPT]-[YYYY]-[SEQ]-[PO|SKU|Case]-r[NN].[ext]`
    - DOCTYPE codes: QSD · QCP · CPTP · TCF · FPC · BOM · GPSR-RA · MRA · FMEA · FRI · 8D · RCA · DoC · DoP · MMS · CBAM · EUDR-DDS · PPWR · BATT
    - Example: `ARENA-QCP-GARDEN-2026-004-PO451230-r02.xlsx`
    - Never overwrite an issued document; increment `rNN`. Unapproved versions carry `_DRAFT`.
    - Skills still using legacy patterns (FPC, product spec, 8D) are to be aligned to this standard.

## F. Document control and quality of evidence
21. Every controlled document carries a control block: reference, revision, date, author, approver, status.
22. **Evidence standard:** a compliance claim is accepted only with a traceable document (test report no., certificate ID, NB number, OJ reference). Unverifiable = not accepted.
23. **Severity scale (all findings):** Critical (stop shipment, escalate ≤24 h) · Major (fix before SRC, ≤5 working days) · Minor (fix next P.O.) · Observation (no action required).
24. Regulatory deadlines are shown as **days remaining** from the verification date.
25. **Language:** English by default; state which Ally/market requires translation (e.g. DE, FR, RO, NL, HR).
26. **Confidentiality:** Ally and supplier data is never sent to external services without CQAD approval.

## G. Batteries — Regulation (EU) 2023/1542
27. Any product containing or supplied with a battery triggers a battery check at Link 1 (4-step determination), on top of the product's own pathway.
28. **Mandatory evidence before SRC:** UN 38.3 summary (Li), IEC 62133 report, Hg/Cd/Pb test, Battery Reg. DoC, compliant label artwork, MSDS.
29. **Art. 11 removability** (from 18 Feb 2027) is assessed at RFx/QSD stage; a sealed, non-replaceable portable battery is a **Critical** design finding for P.O.s shipping on or after that date.
30. Battery category (portable / LMT / SLI / industrial / EV) is stated on every QSD and DoC; borderline cases (>5 kg, >2 kWh) are escalated for classification.
