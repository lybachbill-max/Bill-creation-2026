# ARENA IQS — Quality Platform (single file)

Open `ARENA_IQS.html` in a browser and load `New_Master_File.xlsx` from the top bar.

This one file replaces `ARENA_IQS_v70_1.html` and `ARENA_IQS_v70_2.html` (branch `ccr-5c44a9f5-039cn5`):

- all v70.1 content: rulebook rev-c2 cross-check fixes, Issue SRC page, print frame fix, and every module (Order Fulfilment, Issue SRC, Final Inspection Booking, Factories, Compliance Pathway, Master File Cross-Check, PPWR Packaging Forms, Turnover Reports, Supplier Scorecard, Risk Assessment, New vs Repeat Items)
- **FRI Validation Report** (sidebar, between Order Fulfilment and Issue SRC) — replaces Final Inspection Booking, which is removed. Built on the fri-validation skill v2.9: CP1–CP10 compliance matrix, findings F- / NC- / RG- / OB- with the pattern library #1–#26, AQL Ac/Re check per ISO 2859-1 Tables 1 & 2-A, requirement coverage (Step 3e), report verdict and an independent shipment status. An open NC- blocks Issue SRC; a withheld authorisation asks for confirmation. **Import report** reads an FRI report in Word (.docx), Excel (.xlsx/.xls/.csv) or PDF and pre-fills a new validation (P.O./lot matched to the master file, report no., date, inspector, reviewer, quantities, sampling levels, AQL, defects found, results; embedded photos counted); a register exported from this page is merged back. **Export** to Excel (register, re-importable), Word (.docx validation assessment or register) or PDF (print → Save as PDF). PDF reading uses pdf.js 3.11.174 (Mozilla, Apache-2.0), embedded and loaded only when a PDF is imported; scanned (image-only) PDFs and old .doc files cannot be read. Validations are saved in the browser (localStorage) — export the register to share it or move to another computer. The Word deliverables (annotated report, supplier CAPA) stay with the skill.
- the A.R.E.N.A. order book (from the claude.ai artifact, data cut 07 Nov 26), as a new sidebar section: Order Book › A.R.E.N.A. Order Book. It runs in its own frame and uses the IQS's built-in Excel reader, so loading a master file into it works offline.
- the EUDR Radix Tree Data Entry & Upload Guideline (Wood), EN/VN, as a read-only page: Compliance › EUDR – Radix Tree Guideline. It's a copy of the Claude Docs page dated 10 Oct 2026; edits made there don't flow in.
- the CBAM Communication Console v2.1.1 (from `index.html`), under Compliance › CBAM Communication Console. It runs in its own frame so its styling and scripts stay separate from IQS. CBAM work stays drafts only, on written Ally request.
- the v70.2 Factory Audit, rebuilt as the ARENA FPC supplier audit (arena-fpc-po-checklist v1.3), with .xlsx import/export and the Tien Phong × BCM audit loaded

Not carried over: the ARENA Framework v2.3 audit editor. v70.2 replaced it; old v2.3 audits still open read-only.

Items marked VERIFY (CBAM 2025/2083 dates, EUDR Annex I 2026/2102 entries, Vietnam benchmark tier, EN 581 clause numbers, VN holiday / Tết calendar) still need checking against the official texts.
