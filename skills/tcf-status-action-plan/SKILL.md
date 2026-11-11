---
name: "tcf-status-action-plan"
description: "Build the A.R.E.N.A. TCF status and action plan workbook (bilingual EN/VI or English only, confirmed first) for a P.O.: cross-check P.O./P.I. lines, validate supplier reports and declarations per validation round, per-item requirements, testing body, actions, AI/IM lines, ETD − 45 d due dates. Every cited standard, edition and regulation date is live-checked (rulebook §4.2: register if verified ≤ 30 days, else OJ / CEN / GB designated lists) and given a status CURRENT / PASS-COEX / WATCH / BLOCKED / SoA / UNVERIFIED; report editions are judged by the edition rule. Outdoor seating / tables → EN 581-1/-2/-3. Default output: two worksheets (TCF status + Test plan, compact layout, with a Standards check block); full layout, validation log, CE/DoC guideline, flowchart and roadmap on request."
---

# TCF Status and Action Plan / Trạng thái TCF và Kế hoạch hành động

Builds one Excel workbook (plus the supplier report PDFs) that QS/IQA uses to track, per ordered item, which TCF test/document requirements are met, which supplier reports are accepted, who may test, what each party must do by when – and, for CE-marked items, how the CE marking and declaration of conformity are created. A.R.E.N.A. validates only; it is never the manufacturer, importer, operator or DoC signatory.

## When to use
- User uploads a P.O./VPO/P.I. item list, an Ally offer / quotation sheet or a lab test request (often with pictures) and asks for a TCF status, test request, test plan, action plan or "accumulated status".
- User uploads supplier test reports or declarations and asks to validate them, link them to items, or hyperlink conditional acceptances.
- User uploads the P.O./P.I. files of an existing TCF workbook and asks to cross-check / add the P.O. data, remove items not on the P.O.s, renumber items, add assembly-instruction / instruction-manual lines, revise due dates, or log a supplier submission (validation round).
- User asks to add a CE marking / DoC guideline for an item of such a workbook.
- User asks to revise such a workbook (material correction, new report, updated input file or picture, header changes, language change).

Do NOT use for the TCF Validation Guideline .docx (use tcf-validation-guideline) or the generic TCF tracker. For a stand-alone DoC/DoP/CE label document use ce-marking-doc-dop. For a full assessment of an existing assembly-instruction document use assembly-instruction-assessment.

## Key requirements (mandatory in every build and revision)
These three rules drive the validation logic AND are printed in the workbook as a "Key requirements" notes block (see Workbook layout).

**K-1 Report validity.** An accredited (ISO/IEC 17025) laboratory test report is accepted for 2 years from its ISSUE date, and it must remain valid up to the ETD of the shipment (valid until = issue date + 2 years ≥ ETD of the P.O.). Applies to all reports, food contact included. An amended / re-issued report keeps the issue date of the original report (an amendment does not restart validity).

**K-2 Existing valid reports first.** Before any "send sample" action is planned, review and identify the existing valid reports that can be leveraged for this shipment – this reduces testing cost and shortens the project timeline. A report valid at ETD that fully covers the product scope → ACCEPTED, no retest. A report that expires before the shipment ETD or does not fully cover the product scope (test, component, material, design) → retest line with priority "ASAP", stating the reason (`Rn expires <date> before ETD <date>` or `scope gap: <test / component> in Rn`), to avoid delays in shipment approval and compliance clearance.

**K-3 Supplier reference.** The supplier item reference (with the Ally article no. / GTIN where available) must be laid down in every test report and in every requested or concerned document (declarations, mill certs, identity statements, lab extension letters, in-house reports). A report or document without it is NOT ACCEPTED until amended by its issuer (only the issuing lab may amend a lab report). A grouped report must carry the pictures AND supplier refs of every item it covers (or a C-1 extension letter / C-2 identity statement listing them).

Workbook text of the notes block (bilingual mode: EN line, then VI line; English-only mode: EN line):
1. EN: "Report validity: an accredited (ISO/IEC 17025) laboratory test report is accepted for 2 years from its issue date and must remain valid up to the ETD of the shipment." VI: "Hiệu lực báo cáo: báo cáo thử nghiệm của phòng thử nghiệm được công nhận (ISO/IEC 17025) được chấp nhận trong 2 năm kể từ ngày phát hành và phải còn hiệu lực đến ngày ETD của lô hàng."
2. EN: "Existing reports first: review and identify existing valid reports that can be leveraged for this shipment, to reduce testing cost and shorten the project timeline. For reports that expire before the shipment ETD or do not fully cover the product scope, arrange retesting as soon as possible to avoid delays in shipment approval and compliance clearance." VI: "Ưu tiên báo cáo hiện có: rà soát và xác định các báo cáo còn hiệu lực có thể sử dụng cho lô hàng này, nhằm giảm chi phí thử nghiệm và rút ngắn tiến độ dự án. Với báo cáo hết hiệu lực trước ngày ETD hoặc không bao phủ đầy đủ phạm vi sản phẩm, sắp xếp thử nghiệm lại càng sớm càng tốt để tránh chậm trễ phê duyệt xuất hàng và phê duyệt tuân thủ."
3. EN: "Supplier reference: the supplier item reference must be stated in every test report and in every requested or concerned document; reports or documents without it are not accepted until amended by the issuer." VI: "Mã tham chiếu NCC: mã hàng của nhà cung cấp phải được ghi trên mọi báo cáo thử nghiệm và mọi tài liệu được yêu cầu hoặc liên quan; báo cáo hoặc tài liệu không có thông tin này không được chấp nhận cho đến khi được đơn vị phát hành sửa đổi."

## Standards live check (mandatory in every build and revision – rulebook §0, §3, §4.2)
No standard, edition, OJ citation, coexistence date or regulation date is written into the workbook from memory or from this skill. Editions quoted in this skill are examples "as checked on <date>" only.
1. **List** every standard and regulation date the workbook will cite: requirement lines, Test plan, Q.S remarks, notes, CE / DoC texts, and the editions stated in the supplier's reports.
2. **Look up** each one, highest source first:
   - **Regulatory Register:** an entry marked **V** and verified ≤ 30 days ago may be used. Use the canonical copy, or the Drive mirror after checking its "synced" date.
   - **Otherwise, live check.**
     - EU / EEA / CH / NI: OJ / EUR-Lex hEN list (the CID and its amendments) → Commission hEN summary list → CEN / ISO catalogue (non-hEN standards) → accredited-lab bulletins.
     - GB: DBT / OPSS Notice of Publication (designated standards) → BSI.
   - Say plainly when the register could not be read, and update it afterwards.
3. **Assign a status** per standard:
   - **CURRENT:** edition OJ-cited / GB-designated.
   - **PASS-COEX:** older edition still cited until a date. Accept; never block.
   - **WATCH:** newer edition published, not cited. Gap test only; never inject.
   - **BLOCKED:** citation withdrawn, cited replacement exists. Inject the replacement.
   - **SoA:** no edition cited. The current CEN / ISO edition is state of the art.
   - **UNVERIFIED:** could not be confirmed. Say so; never block or guess.
4. **Judge every report edition** by the edition rule (**P-10**).
5. **Print a "Standards check" block** in sheet 1, below the Key requirements. Columns: Standard · Edition to use · Status · Notes (OJ / CEN reference, coexistence date, restrictions) · Source (URL). The heading gives the date checked.
6. **Name the date checked** in the reply, and cite the sources.
7. **Re-check if older than 30 days.** When a workbook or tool reuses a check older than 30 days, re-check before citing and flag it in the title / notes.

Example (as checked 11 Nov 2026 – re-check before use):

| Standard | Edition | Status | Reference |
|---|---|---|---|
| EN 71-1 | 2014+A1:2018 | CURRENT | CID (EU) 2023/740; no presumption for wave rollers (cl. 3.19, 4.15.1 – CID (EU) 2025/1785). EN 71-1:2026 = gap test only. |
| EN 71-2 | 2020 | CURRENT | CID (EU) 2023/740 |
| EN 71-3 | 2019+A2:2024 | CURRENT | CID (EU) 2025/2519; 2019+A1:2021 PASS-COEX until 16 Jun 2027 |
| EN 581-1 | 2017 | SoA | not an hEN |
| EN 581-2 / -3 | 2026 | SoA | not hENs; CEN 20 May 2026; older edition only with the Ally's written acceptance |
| AfPS GS 2019:01 PAK | rev. 10 Apr 2020 | UNVERIFIED | GS-mark specification, not a CE standard; confirm on BAuA |

## Step 0 – one round of questions BEFORE generating (mandatory)
First read the inputs (item list, pictures, every report, certificate columns of offer sheets) so the questions are specific. Then ask once (AskUserQuestion when available, otherwise plain text), max 4 questions, skipping anything the user already stated or uploaded:
1. **Language** – Bilingual EN / VI (QS team) or English only (Ally / supplier).
2. **P.O. / P.I. files (P.O. no., lines, FRI, shipment ETD per P.O.)** – ask whenever no P.O. / P.I. file has been uploaded: "Please upload the P.O. / P.I. files – or tell me if they are not available yet." If the user does not have them yet → leave every P.O.-derived field BLANK (see **No P.O. / P.I. yet**); never estimate, derive or invent P.O. numbers, Ally item numbers, quantities, FRI or ETD dates.
3. **Legal stream of borderline items** – e.g. a children's play article (toy under TSD vs GPSR only), an electrical accessory, PPE-like gloves. Recommend the stricter stream.
4. **Item-number mapping** (reports use supplier refs, order uses Ally article numbers) – show the proposed mapping and ask to confirm.
5. **No evidence at all** (no reports, empty certificate columns) – "build now, all OPEN" or "wait for the supplier's reports".
6. **Removing an item that is a group lead sample** – ask which item takes over the lead (recommend the item of the same material / process with the earliest FRI) and whether to keep the old numbering or renumber 1…n.
Other gaps (packaging type, Ally lab nomination) → build with a visible "TBC" cell. For a revision, keep language, P.O. data, ETDs and decisions unless asked. If unattended: bilingual, P.O.-derived fields blank, stricter legal stream, mapping flagged open, build all OPEN; state these choices at the top of the reply. Record language, ETD per P.O. (or "P.O. / P.I. not yet available") and legal-stream decisions in the title row / notes.

## Language rules
### English only
All labels, statuses, verdicts, actions and notes in English. Action status list `Open, In progress, Done, N/A, Cancelled`.

### Bilingual EN / VI
- Every visible label is bilingual in the SAME cell: English line on top, Vietnamese below (`"English\nTiếng Việt"`, wrap on): title, headers, "Action plan" group header, legends, summary labels, notes (incl. Key requirements), statuses, verdicts, actions, PIC, requirement texts, remarks, 10-point check texts, test plan, testing-body rules, validation log, CE/DoC guideline.
- Proper nouns, report numbers, standards, item refs and units unchanged in both lines.
- Formula-driven values keep the English keyword FIRST: `OPEN (CRI) – … / MỞ (CRI) – …`; verdicts `"NOT MET"&CHAR(10)&"CHƯA ĐẠT"`, `"NOT MET – no evidence"&CHAR(10)&"CHƯA ĐẠT – chưa có bằng chứng"`, `"CONDITIONAL"&CHAR(10)&"CÓ ĐIỀU KIỆN"`, `"MET"&CHAR(10)&"ĐẠT"`; action status `Open – Mở`, `In progress – Đang thực hiện`, `Done – Hoàn thành`, `N/A – Không áp dụng`, `Cancelled – Hủy`.
- DoC template: English + the official language of the Ally's main market (e.g. German for HGB) in the text columns; Vietnamese only in the QS-notes column.
- Row height = 12.5 pt × (wrapped lines of EN + VI, chars per line ≈ column width) + 6; Arial 9 for dense bilingual sheets.

### Both modes
- Sheet and file names English/ASCII.
- Count with wildcards (`COUNTIF(range,"Open*")`, `"NOT MET*"`, `"OPEN (CRI)*"`, `"Lab only*"`; "Lab or internal" = `COUNTIF("Lab or internal*") − COUNTIF("Lab or internal – witnessed*")`), format with begins-with / `LEFT()` rules (stopIfTrue, NOT MET before MET) – same formulas in both modes.
- All texts in one dict / helper `BI(en, vi)`; a `lang` switch renders `EN` or `EN + "\n" + VI`.
- The chat reply follows the user's language.

Glossary (bilingual mode):
| English | Tiếng Việt |
|---|---|
| No. / Item name / Picture / Supplier item no. | STT / Tên mặt hàng / Hình ảnh / Mã hàng NCC |
| HGB ref (P.O. no.) / HGB no. / HAGE no. | Tham chiếu HGB (số P.O.) / Mã HGB / Số HAGE |
| TCF requirement (test / document) | Yêu cầu TCF (thử nghiệm / tài liệu) |
| Evidence type / Material test / Product test / Document / QC check / Supporting | Loại bằng chứng / Thử vật liệu / Thử sản phẩm / Tài liệu / Kiểm tra QC / Hỗ trợ |
| Testing by (acceptable) | Đơn vị thử nghiệm được chấp nhận |
| Evidence submitted | Bằng chứng đã nộp |
| TCF assessment accumulated status | Trạng thái đánh giá TCF lũy kế |
| Q.S remark (item) / Item verdict (test evidence) | Nhận xét Q.S (mặt hàng) / Kết luận mặt hàng (bằng chứng thử nghiệm) |
| Action plan / Action required / PIC / Due date / Status | Kế hoạch hành động / Hành động cần thực hiện / Người phụ trách / Hạn hoàn thành / Tình trạng |
| Lab only (ISO/IEC 17025) | Chỉ PTN (ISO/IEC 17025) |
| Lab or internal – witnessed | PTN hoặc nội bộ – có QC chứng kiến |
| Lab or internal / Internal – A.R.E.N.A. QC | PTN hoặc nội bộ / Nội bộ – QC A.R.E.N.A. |
| Accepted / Conditional / Not accepted / Expired / Open / N/A | Chấp nhận / Có điều kiện / Không chấp nhận / Hết hiệu lực / Mở / Không áp dụng |
| Partial / Rejected / Not covered / Not submitted / Info | Đạt một phần / Không chấp nhận / Không bao phủ / Chưa nộp / Thông tin |
| Report validation / Test plan / Testing body rules / Key requirements / Validation log | Thẩm định báo cáo thử nghiệm / Kế hoạch thử nghiệm / Quy tắc đơn vị thử nghiệm / Yêu cầu chính / Nhật ký thẩm định |
| shipment ETD / issue date / valid until / valid at ETD / earliest ETD / due (ETD − 45 d) | ETD lô hàng / ngày phát hành / hiệu lực đến / còn hiệu lực tại ETD / ETD sớm nhất / hạn (ETD − 45 ngày) |
| P.O. / P.I. not yet available | Chưa có P.O. / P.I. |
| existing valid report / retest ASAP / scope gap | báo cáo còn hiệu lực hiện có / thử nghiệm lại ngay / thiếu phạm vi |
| supplier reference / supplier ref missing | mã tham chiếu NCC / thiếu mã tham chiếu NCC |
| assembly instruction / instructions for use / installation instruction | hướng dẫn lắp ráp / hướng dẫn sử dụng / hướng dẫn lắp đặt |
| co-extruded / single-extruded / core / cap layer | đồng đùn / đùn đơn lớp / lõi / lớp phủ |
| CE marking / EC declaration of conformity / technical documentation / safety assessment | Dấu CE / Tuyên bố hợp quy EC / Hồ sơ kỹ thuật / Đánh giá an toàn |
| internal production control / EC-type examination / notified body | Kiểm soát sản xuất nội bộ / Thử nghiệm kiểu EC / Tổ chức thông báo |
| metal release / migration / sensory (odour, taste) | thôi nhiễm kim loại / thôi nhiễm / cảm quan (mùi, vị) |
| corrosion / mechanical / sharp edges, points / heat resistance / bristle retention / stability | chống ăn mòn / cơ học / cạnh sắc, đầu nhọn / chịu nhiệt / độ bám lông chổi / độ ổn định |
| lab extension letter / identity statement / mill cert 3.1 / material declaration | thư mở rộng của PTN / cam kết đồng nhất / chứng chỉ vật liệu 3.1 / khai báo vật liệu |
| consolidation pending / renew for next P.O. / reference item | chờ hợp nhất hồ sơ / thử lại cho P.O. sau / mặt hàng tham chiếu |
| ✓ met · ~ partly met / to verify · ✗ not met · – not applicable | ✓ đạt · ~ đạt một phần / cần xác minh · ✗ không đạt · – không áp dụng |

## Inputs
1. Order file, Ally offer sheet or lab quotation: Ally, P.O. no., seller, producer, Ally article no. / GTIN, supplier ref, description, pictures, dates (P.I., FRI, ETD per P.O.). A previous test-request/quotation sheet is input only – its "No request" decisions are re-checked, not copied. In the ARENA offer-sheet template (sheet "ARENA", headers row 8, items from row 9) locate the columns by their row-8 header text, not by letter – template v1.4.7: pictures in column R ("Item Picture (preview)"), certificate/report columns BU–CP; older versions: pictures in Q, certificates BT–CO. Read the certificate columns: a test name without lab and date is a REQUEST, not evidence; empty = no evidence. The offer-sheet "Item Description (Including article sizes, colour, etc…)" text is the source for parts lists, assembly state ("Accessory for assembly", "set: 2x … + 4x …") and WPC extrusion type.
2. ARENA P.I. / VPO files (`<date>_VPO<no>_<P.O. no.>_<supplier>.xlsx`): sheet "ProformaInvoice"; P.O. no. in N11, P.I. date N13; header row 21, lines from row 23 to the "Total" row: B Supplier Ref · C Ally item number (e.g. hagebau item number) · D Ally second number (HAGE number) · E Description · G EAN · N Order Qty · Q Inspection (FRI) date · R Shipment ETD · Y ARENA item id. Locate columns by header text if the template changes. A file named "_revised" supersedes the earlier one for the same P.O. Not uploaded → ask (Step 0 Q2).
3. Supplier material declaration per item (component, material, colour, logo method, food contact, polymer of composites such as WPC, extrusion type, recycled content, additives, binder). If missing, take components from the description / report component lists and add a material-declaration document line.
4. All test reports and supporting documents (PDF / DOC), including reports from earlier orders or other customers that might be leveraged (K-2). Hash them (md5) – validate unique files only, say how many duplicates there were, and compare against files already validated in earlier rounds (identical resubmission).
5. Ally lab nomination, if any (otherwise sheet "Testing body rules" applies).
6. A previous version of the workbook edited by the user = the baseline for a revision (see Revisions).

## P.O. cross-check (mandatory whenever P.O. / P.I. files are given)
- Read every P.I. line by script. Match each line to a TCF item by supplier ref; check Ally item no., second number, EAN = item GTIN, description. Every P.O. line must match exactly one item; quantities per P.O. must sum to the P.I. total; report the line count per P.O. (count it, never estimate).
- Write two columns right after "Supplier item no.": **"<Ally> ref (P.O. no.)"** – one line per P.O. line `<P.O. no.> L<line> · <qty> pcs · FRI <dd Mmm yyyy> · ETD <dd Mmm yyyy>` sorted by P.O. then ETD; **"<Ally> no."** – `<Ally item no.>` / `HAGE <no.>` / `'<P.O. description>'`. Add a header comment naming the P.I. files and dates.
- Items in the TCF that are on none of the P.O.s: report them; on the user's request remove their rows (pictures, row heights, conditional formats and validations shifted), record the removal in a comment on A1, re-point any grouping that used a removed item as lead sample (Step 0 Q6) in sheet 1 AND Test plan, and renumber 1…n if asked.
- Description mismatches (TCF item name vs P.O. description vs quotation) → check the quotation text first before calling descriptions "swapped"; then a Specification consistency remark for the Merchandiser to confirm supplier ref ↔ Ally no. ↔ EAN before artwork / label release.
- The earliest FRI per item drives urgency: name in the reply every item whose FRI is within 14 days and still has open evidence.

### No P.O. / P.I. yet
When no P.O. / P.I. file is uploaded, ask the user for it first (Step 0 Q2). If the user does not have it yet:
- Keep the columns "<Ally> ref (P.O. no.)" and "<Ally> no." with headers but leave their cells BLANK – no Ally numbers derived from GTINs, no quantities, no FRI, no ETD.
- Test plan "Earliest ETD (items covered)" and "Due per item" BLANK; "Report due" = `=IF(I<row>="","",I<row>-45)` so it fills itself once an ETD is typed in; Validation log "Due" BLANK.
- K-1 validity is checked provisionally at today, noted "ETD not yet available – re-check at P.O.".
- Title row / notes: "P.O. / P.I. not yet available – P.O. fields left blank; run the P.O. cross-check when received."
- Ask again (or remind in the reply) when the user later sends documents for that order, then run the full P.O. cross-check.

## Legal stream per item (decide before building lines)
- **Toy** (designed or intended for play by children < 14, e.g. sandbox / sandpit, play tent): Toy Safety Directive 2009/48/EC → CE mandatory, EN 71-1/-2/-3 (+ other parts if relevant), safety assessment, technical documentation, EC DoC, warnings. Toy Safety Regulation (EU) 2025/2509 applies from 1 Aug 2030 (DPP replaces the DoC; TSD toys placed earlier stay available).
- **Other CE legislation** (LVD/EMC/RoHS, machinery, PPE, CPR, gas, pressure, radio): CE / DoC or DoP per that act.
- **Everything else**: GPSR (EU) 2023/988 – **CE prohibited** (CE on a non-CE product is misleading, Reg. (EC) 765/2008 Art. 30); GPSR Art. 9 marking instead.
- Own-brand / private label: the Ally is the manufacturer (signs DoC, keeps technical documentation); the factory is the producer; A.R.E.N.A. validates. An Ally established in the EU needs no separate EU responsible person on labels / instructions.
- **Overlays to check per item**: REACH (Annex XVII, SVHC), POPs (SCCP, PBDE – recycled plastics, WPC), PPWR packaging heavy metals, CBAM (CN 72/73 iron & steel, 76 aluminium – e.g. 100 % aluminium articles CN 7616 are CBAM goods: emissions data + authorised declarant), EUDR (wood CN 44 etc.; WPC under CN 39xx out of scope – confirm CN code), BPR (treated articles / biocide additives; pest-control claims – physical barriers N/A if no active substance and no biocidal claim).
- **Outdoor furniture** (seating and tables for adults, camping / domestic / contract use, e.g. garden / patio / balcony / bistro chairs, benches, loungers, tables, sets; GARDEN department):
  - **Lines:** EN 581-1 (general safety), EN 581-2 (seating) and EN 581-3 (tables), mechanical, "Lab or internal", MAJ. These replace the generic stability / load line.
  - **Editions:** EN 581 parts are not hENs, so they are SoA (P-10); editions come from the live check.
  - **FRI:** AQL Major 1.0 for outdoor furniture (rulebook §3).
  - **Not covered:** indoor furniture standards (seating, tables, storage) are added only after the live check gives their edition and status.
- **Specification consistency**: flag conflicts in the source (dimensions in title vs description, duplicate items, GTIN "NEW", P.O. description vs item) as document lines "Specification consistency" with a correction action (compact layout: in the Q.S remark of the item).

## Core rules (apply literally)
- **Item name.** The product noun follows the Ally P.O. description (e.g. "Sandbox" when the P.O. says "WPC Sandbox", not the quotation's "Sandpit"); dimensions, material and process come from the quotation. Apply the renamed noun everywhere (sheet 1, Test plan, Validation log, comments). No P.O. yet → keep the quotation noun and re-check at P.O.
- **WPC extrusion type.** Read the quotation material text for every WPC item and state the process in the item name: "co-extruded WPC" ("co-extrution", "co-extrusion", "capped") or "single-extruded WPC" ("single extrusion", "single extruded"); not stated → "WPC – extrusion type TBC" and the material declaration must state it. Never write plain "extruded" for a WPC whose type is known. Co-extruded WPC chemistry (PAH, Cd, POPs, SVHC) tests core and cap layer as separate materials. Grouping (P-6) only within the same process, same core compound and same colour – for co-extruded also the same cap-layer colour; single-extruded and co-extruded are never grouped.
- **P-6 material vs product test.** A MATERIAL test (metal release, migration, REACH/POPs, SVHC, heavy metals, packaging heavy metals, ink / coating chemistry, EN 71-3) is accepted for any item made of the same material (same grade; plastics/WPC same polymer AND colour/compound AND extrusion process; ink/coating same product). A PRODUCT test (sensory, corrosion, mechanical, edges/points, heat, stability, load, bristle retention, accuracy, EN 71-1/-2) must be on the item itself or an identical part – never transferred to a different design (C-5).
- **Reference items in reports.** "Reference item … not verified by the laboratory" / "reference photo – not tested" / an additional report ("_AD") issued "based exclusively on a past tested sample" with model / buyer / PO removed = material evidence only, by applicant declaration → CONDITIONAL / Partial with C-1 lab re-issue naming the supplier ref or C-2 identity statement + the original report. Compare the reference / test photo with the item picture: if the design differs, every product test is still OPEN for that item.
- **P-7 validity = K-1.** Valid until = issue date + 2 years, checked against the ETD of the P.O. that ships the item (all reports, food contact included; an amended / additional report keeps the original issue date). Report expiring before ETD → verdict `NOT ACCEPTED – expires before ETD`; item lines `OPEN (sev) – Rn expires <date> before ETD <date> (K-1); retest Jx ASAP` with the evidence still linked. Item without ETD (no P.O. yet) → checked provisionally at today, "ETD not yet available – re-check at P.O.". Flag "renew for next P.O." when the report expires within 6 months after ETD.
- **P-8 leverage existing reports = K-2.** For every test line, first search the R-register for a report that is valid at ETD (K-1), states the supplier ref (K-3) and covers the full scope (test, component, material/compound, design per P-6) → ACCEPTED, action "Use existing report Rn (valid to <date> ≥ ETD <date>); file in the item TCF; no retest", status Done. Partial scope → keep the accepted part and add a retest line `Retest ASAP – scope gap: <test / component> in Rn`. Only when nothing usable exists → new test.
- **P-9 supplier reference = K-3.** Check that every report / document states the supplier item ref (and Ally article no. / GTIN where available). Missing → verdict `NOT ACCEPTED – supplier ref missing`; item line `OPEN (sev) – Rn without supplier ref (K-3); lab to amend report`. Every action that requests a report or document includes "supplier ref <ref> on the report / document".
- **P-10 edition rule (rulebook §3).** For every report line tied to a standard, read the edition stated in the report:
  - **Cited edition (CURRENT):** ACCEPTED, if K-1 and K-3 are met.
  - **Older edition still coexisting (PASS-COEX):** ACCEPTED, noting "PASS-COEX until <date>". If the coexistence date falls before the ETD: `OPEN (sev) – coexistence ended <date> before ETD; retest to <cited edition> ASAP`.
  - **Withdrawn edition (BLOCKED / not cited):** `OPEN (sev) – edition no longer cited; retest to <cited edition> ASAP`.
  - **Newer edition, not cited (WATCH):** `CONDITIONAL – gap test only; evidence to the cited edition needed`.
  - **SoA standard, older edition:** `CONDITIONAL – accepted only with <Ally>'s written acceptance`, with action "<Ally>: decide in writing; if not, new testing to <current edition>".
  - **No edition stated:** `CONDITIONAL – QS to confirm the edition`.
  - **UNVERIFIED status:** never block; flag it in the Standards check.
- **Material declaration check.** Accept only when: supplier, factory, date, name, position, signature and company stamp filled; delivered as signed PDF / scan (an editable .doc/.docx is not accepted); supplier ref + Ally no. / GTIN stated (K-3); only components of THIS item (non-applicable template rows removed); every metal part declared with material, coating and weight % (e.g. steel corners, screws – grade stainless A2/304 or galvanised carbon steel); polymer, wood flour %, recycled content, additives, binder type (formaldehyde-based → REACH Entry 77), biocides, flame retardants, WPC extrusion type. Map a declaration to an item by Ally no. AND P.O. description AND quotation description; if they disagree, state the most likely item and keep the line open until the supplier confirms.
- **Consolidation (C-1..C-9).** Another product's report needs C-1 lab extension letter (only the issuing lab may change a report; supplier-edited report = CRI reject) or C-2 signed identity statement – both listing the supplier refs of the covered items; C-3 mill cert 3.1 / compound data / XRF for material identity; C-7 other customers' names internal; C-8 non-applicable reports not filed.
- **Scope traps.** A metal-migration test on a metal head never covers a plastic handle. REACH XVII-63 Pb covers jewellery, child-mouthable articles and PVC; XVII-46a NPE covers textiles washed in water – write N/A with this reason. If a WPC/plastic might be PVC-based, the material declaration decides whether Pb + phthalates are added. Recycled PE / WPC always needs POPs (SCCP/MCCP, PBDE) – a report without them is a scope gap.
- **Report integrity.** Flag inconsistencies (a conclusion citing a test absent from the body; a sum reported N.D. while a component is detected, e.g. "Sum of 4 PAHs" N.D. with pyrene 0.51 mg/kg; "applicant's requirement" limits; NSS result exactly at the limit with visible red rust) as check 2/9 "~" and add a correction / confirmation action.
- **Severity.** CRI = food-contact metal release, overall migration, bristle retention/shedding, and for CE items the conformity documents (DoC, CE, technical documentation) plus the core safety standards (toys: EN 71-1 and EN 71-3). Everything else MAJ.
- **Item verdict (test evidence, formula).** Any OPEN (CRI) → NOT MET; no ACCEPTED or CONDITIONAL line at all → `NOT MET – no evidence`; else any OPEN or CONDITIONAL → CONDITIONAL; else MET. State that the full item TCF verdict also needs the document deliverables.
- **No commercial wording.** Never write cost approval, quotation, price, "accept cost", "==> Test request". (The K-2 note on reducing testing cost and timeline is the only cost reference allowed.)
- **Grouping.** Test one item, put pictures AND supplier refs of identical items on the report: identical parts across sets, same compound/colour/extrusion process across a range, same coating, one SVHC sample per material, one packaging heavy-metal sample per packaging type (carton / pallet-packed / sleeve …).
- **User corrections override earlier declarations** (material, mapping, design, legal stream, item name).

## Assembly instruction / instructions for use (one document line per item, every build)
Decide from the quotation / P.O. text and pictures how the item reaches the consumer:
| Supplied as | Line | Content (requirement text) |
|---|---|---|
| Loose parts / "Accessory for assembly" / "set: n x …" | **Assembly instruction + instructions for use** | EN 82079-1; GPSR Art. 9(7): safety information first, parts and hardware list (every fastener with quantity), tools, illustrated steps, use limits (load, level ground, not a seat / step), care, UV / weathering |
| Set needing fixing (trellis, wall items) | **Assembly instruction + fixing instruction** | as above + fixing method, anchor type, max load (plant / wind) |
| Toy supplied disassembled | **Assembly instruction + instructions for use – toy** | TSD 2009/48/EC Art. 11 + Annex V; EN 71-1; structure per EN 82079-1: adult-assembly warning where required by EN 71-1, parts and screw list, periodic check of fixings, care, warnings and age grading consistent with the packaging (move "assembly instructions" out of the toy marking line to avoid a duplicate) |
| Loose strips / simple installation | **Instructions for use / installation** | GPSR Art. 9(7): installation steps, CAUTION sharp edges – wear gloves, keep children away; may be printed on packaging / label insert |
| Pre-assembled, set into ground | **Instructions for use / installation** | GPSR Art. 9(7): installation depth, check for buried cables / pipes, CAUTION metal parts, care; may be on label / insert (Ally to confirm) |
Every line adds: Ally (manufacturer, own brand) name, postal + electronic address; product type / batch ID; language(s) per Ally markets (HGB: at least DE); "no EU responsible person needed" when the Ally is EU-established. Evidence type Document · Testing by Document · Action AI: "Supplier: submit draft artwork (PDF + editable file) for A.R.E.N.A. QS review; <Ally> approves final artwork before printing. A.R.E.N.A. QC: check correct version in each carton at FRI." · Action IM: "Supplier: submit draft artwork (leaflet or packaging print) for A.R.E.N.A. QS review; <Ally> approves final artwork. A.R.E.N.A. QC: check at FRI." Colour variants share one artwork with item-specific ID / EAN; similar products may share a template but the parts list and drawings stay item-specific. Test plan job **J7** "Assembly instruction / instructions for use – document review". For a full review of a submitted instruction document use assembly-instruction-assessment.

## Accumulated status values (full layout, sheet 1)
`OPEN (CRI) – …` · `OPEN (MAJ) – …` (no evidence / expires before ETD / scope gap / supplier ref missing / depends on item m / document missing) · `CONDITIONAL – …` (accepted subject to a consolidation document) · `ACCEPTED – Rn …, valid to <date> ≥ ETD <date>` (action "Use existing report Rn …; file in the item TCF; no retest", status Done) · `N/A – <reason>`. Colours: OPEN red, CONDITIONAL amber, ACCEPTED green.

## Testing body (lab and/or internal)
| Category | Applies to | Accepted evidence |
|---|---|---|
| Lab only (ISO/IEC 17025) | metal release, migration, VOC, bisphenols, REACH chemicals, AfPS GS PAH, SVHC, heavy metals, packaging heavy metals, ink / coating chemistry, sensory, ALL toy EN 71 tests | report of a lab whose accreditation scope covers the method |
| Lab or internal – witnessed | corrosion (EN ISO 8442-1 / ISO 9227), bristle retention, thermometer accuracy | lab report, or in-house report meeting IT-1…IT-5 witnessed + countersigned by A.R.E.N.A. QC (IT-6) |
| Lab or internal | mechanical, edges/points/burrs, heat resistance/deformation, assembly, stability / load (non-toy) | lab report, or in-house report meeting IT-1…IT-5 |
| Internal – A.R.E.N.A. QC | XRF material identity, visual/edge checks at FRI | QC record: device ID, daily reference check, readings, photos; lab OES/XRF or mill cert 3.1 also accepted; supplier in-house OES = supporting only |
| Document | declarations, DoC, labelling, assembly instructions / instructions for use, CN code, CBAM data, mill certs | signed document reviewed by QS, stating the supplier ref (K-3) |

In-house conditions: IT-1 written method = standard clause and criteria · IT-2 calibrated equipment, traceable certificate · IT-3 trained tester · IT-4 sample ID (supplier ref, Ally article no. / GTIN, batch) + photos before/after · IT-5 raw data, pass/fail, signed by factory QA manager · IT-6 A.R.E.N.A. QC witness (on site or live video) + countersign · IT-7 failure, doubt or Ally request → ISO/IEC 17025 retest, lab result prevails. Unless the Ally nominates a lab.

## Supporting documents
- **Lab accreditation certificate** (CNAS/DAkkS …): register as R-n, type "Supporting", verdict `ACCEPTED (supporting)` if valid at ETD; closes check 1 for that lab's reports. Note "~ scope schedule not attached – verify the methods on the accreditation body website".
- **Supplier in-house analysis** (OES, XRF, internal test sheet): verdict `CONDITIONAL` (supporting); record which IT-1…IT-5 items are missing; batch-specific.
- **Extra tests in a report without a TCF line** (e.g. NSS on screws of a WPC item): log as "Info – supporting", note the result and any confirmation needed (e.g. screw grade).

## 10-point report check (sheet "Report validation")
1 Lab competence · 2 Report integrity · 3 Specimen ↔ ordered item/material (P-6) · 4 Applicant/producer link + supplier ref stated (K-3) · 5 Standard / list edition · 6 Scope covers requirement (K-2 scope gap) · 7 Results vs limits (EDQM: 3rd migration ≤ SRL, 1st+2nd ≤ 7×SRL; single use: 1 migration ≤ SRL) · 8 Validity (K-1: issue + 2 years ≥ ETD) · 9 Remarks/limitations · 10 Usable for the Ally TCF. Mark ✓ / ~ / ✗ / – with a short note (green / yellow / red / grey). Verdicts: ACCEPTED · ACCEPTED (item a) / CONDITIONAL (item b) · CONDITIONAL · NOT ACCEPTED – expires before ETD · NOT ACCEPTED – supplier ref missing · NOT ACCEPTED – <reason> · ACCEPTED (supporting). Read the actual PDF (pdftotext -layout, all result tables, component list, tested-sample and reference photos rendered as images, declaration / re-issue letters) – never infer results from file names. **No documents received** → keep the sheet with the ETD/FRI row (blank if no P.O. yet), one merged row "No test report, certificate or declaration received … register each document here when received" and the 10-point legend; no hyperlinks, deliver the workbook only.

## Validation log (sheet "Validation log", added at the first supplier submission)
- Rule printed in row 2: each supplier submission = one validation round, numbered from 1 ("Val. #1" = the first logged submission); new rounds are added below with the next number, never overwriting earlier rounds. An identical resubmission (same md5 / same content) is still a new round when the user logs it, with verdicts carried over and the note "identical to Val. #n – nothing changed".
- Layout (summaries ABOVE the log so the log's COUNTIF ranges never overlap them): row 1 title; row 2 rule; "Summary by round" (Val. # · Lines · Accepted · Partial · Rejected · Not covered · Not submitted · Info, COUNTIFS on the log range down to row 500); "Current TCF status per item (live)" – per item: item no. (formula to sheet 1), supplier ref, TCF rows, Open, In progress, Done, N/A, Cancelled (COUNTA / COUNTIF on each item's status range in sheet 1) + Total; then the log header.
- Log columns: Val. # · Validation date · Date received · Document (file) · Doc. ref / issue date · Issued by · Item no. · Supplier item no. · Ally no. (blank if no P.O. yet) · TCF requirement · Result · Findings · Action required (supplier) · Due (ETD − 45 d; blank if no ETD). One row per document × TCF requirement it is offered for, plus "Not covered" rows for the item's requirements the document does not cover and "Not submitted" rows for requested documents that did not arrive.
- Result list (data validation): Accepted · Partial · Rejected · Not covered · Not submitted · Info; colours: Rejected / Not submitted red, Partial / Not covered amber, Accepted green; overdue Due in bold red when < TODAY() and result not Accepted / Info.
- Tag the matching "Evidence submitted" cells in sheet 1 with `[Val. #n, <date>]`. After any row insertion / deletion in sheet 1, rewrite the live status formulas (openpyxl does not shift references).

## Due dates
- **With ETD known (P.I. files or user input): due = earliest ETD of the items covered − 45 days.** "Items covered" includes the sample item AND every item grouped on its report. Test plan columns added after Status: "Earliest ETD (items covered)" (date input) and "Due per item (ETD − 45 d)" (text, items grouped by date, e.g. `Item 1: 18 Sep 2026 · item 7: 23 Sep 2026 · items 2, 5, 6, 8: 11 Oct 2026`); "Report due" = formula `=IF(I<row>="","",I<row>-45)`; header comment stating the rule and the P.O.s. Bold red when < TODAY() and status not Done / N/A / Cancelled. The Validation log Due uses the same rule per item.
- If a due date is already past at build time, say so in the reply and name the remaining hard deadline (first FRI per item) and the options (Ally accepts a short ETD delay, or a documented first-shipment exception decided by the Ally and the SRC owner (QS)).
- **No P.O. / P.I. yet (user confirmed not available):** leave Earliest ETD, Due per item, Validation log Due and every action due date BLANK – no proposed or estimated dates; the Report due formula stays and fills once an ETD is entered. Retest lines (K-2) still say "ASAP" in the action text.

- **Two gates (added 2026-10-25):** (1) test reports, declarations and technical file due **ETD − 45 d** (rule above); (2) SRC issued at least the SRC buffer (default 7 d, user input) before ETD. Any roadmap built with this workbook or with the TPM (essential-characteristics-testing Step 7b) must show both gates per item / SKU; never replace the ETD − 45 d document due date with the SRC buffer.

## Optional sheets: "Flowchart" and "Roadmap" (on request, or when the user asks for a project plan / roadmap)
- **Flowchart** – rendered PNG (Graphviz `dot`) of the execution flow for this P.O. (Ally decisions → supplier submissions / CAPA → validation rounds → testing → report validation (10-point check) → TCF verdict → artwork / marking → FRI → SRC → ETD), owner colours (Ally / supplier / A.R.E.N.A. / lab), decisions as diamonds; below it a step-interpretation table: Step · Stage (EN/VI) · R · A · C/I · Entry criteria · Actions & interpretation · Evidence · Exit criterion / gate · Linked sheet · Roadmap ID.
- **Roadmap** – Gantt with predecessor-driven Start (`MAX(end of predecessors)+1`, fixed-start override), editable durations (planning assumptions, stated as such), status drop-down, late flag (end < TODAY() and not DONE), current-week marker; gate block per item: earliest ETD (from this workbook), documents due (ETD − 45 d) vs planned TCF completion, SRC buffer vs planned SRC → ON TRACK / AT RISK / "ETD not set". No proposed dates when ETD is unknown.
- Same structure and formulas as the TPM Flowchart / Roadmap (essential-characteristics-testing Step 7b; reference ARENA-TPM-AUTO-BIKE-MERKUR-01 Rev.2) so the two workbooks read the same way.

## Workbook layout – full (on request only)
File: `<Ally>_TCF_Status_Action_Plan_<category / supplier>_<PO no. or order label>[_EN-VI].xlsx`, Arial (10, or 9 for dense bilingual), A3 landscape fit-to-width, print titles.

**Sheet 1 "TCF status <Ally>"** – title row 1 (Ally, category, order, language, ETD per P.O. or "P.O. / P.I. not yet available"); two-row header (rows 2–3); data from row 4; freeze panes C4.
Columns: No. · Item name · Picture · Supplier item no. (Ally article no. / GTIN + supplier refs, one per line) · <Ally> ref (P.O. no.) · <Ally> no. · TCF requirement (test / document) · Evidence type · Testing by (acceptable) · Evidence submitted · TCF assessment accumulated status · Q.S remark (item) · Item verdict (test evidence) · merged "Action plan" header over: Action required · PIC · Due date · Status.
- One row per requirement; item columns merged per item; one pastel band per item; picture per **Picture alignment** (centred in col C of the item's first row, within its block); auto row heights.
- Summary block (formulas): lines OPEN CRI / OPEN MAJ / CONDITIONAL / ACCEPTED / N/A; lines per testing-body category + document lines; items NOT MET / CONDITIONAL / MET; actions open, done, overdue (SUMPRODUCT with TODAY(), begins-with tests in bilingual mode; blank due dates are never overdue).
- **"Key requirements" block** directly below the data (above the summary): merged across all columns, light-yellow fill, bold title, the three K-1/K-2/K-3 texts.
- Notes: assessment basis (ETD per P.O. or "P.O. / P.I. not yet available", FRI, mapping, no-evidence statement), legal streams and overlays, testing-body legend, status legend + verdict rule, how to close a line, due-date rule (ETD − 45 d), P-6 rule, hyperlink instructions (if any).

**["CE & DoC guideline", "EC DoC template"]** – only for CE items, see below.

**"Validation log"** – from the first supplier submission, see above.

**"Report validation"** – row 2: ETD per P.O. input (yellow; blank if no P.O. yet) and FRI date input. One row per unique document R1…Rn: Ref · Report no./lab · Issued/tested · Applicant · Supplier ref stated? · Specimen as tested (incl. reference items) · Tests and result (key numbers) · Type · 10 checks · Verdict · Accepted for (item/component) · Conditions to close · Valid until (issue + 2 years) · Valid at ETD? (formula; "ETD not yet available" when blank) · Report file (hyperlink). Overall line with counts per verdict; note on missing product-test evidence.

**"Test plan"** – Job (J1…) · Test · Sample (item) · Items covered – pictures and supplier refs on the report · Evidence type · Testing by (acceptable) · PIC · Sample / test start by · Report due (formula ETD − 45) · Status · Earliest ETD (items covered) · Due per item. Typical jobs: J1 toy / food contact, J2 material chemistry per compound (co-extruded: core + cap layer), J3 coating, J4 physical per item, J5 SVHC per material, J6 packaging per type, J7 assembly instruction / instructions for use review. Retests are named as such (`Retest ASAP – Rn expires <date> before ETD <date>` / `Retest ASAP – scope gap …`). "Key requirements" block below the table.

**"Testing body rules"** – category table ("Applies to" filled with this order's tests) and IT-1…IT-7.

## CE marking and DoC guideline (only when an item is CE-mandatory)
Add two sheets right after sheet 1 and point the item's CE lines and Q.S remark to them:

**"CE & DoC guideline"** (bilingual per language choice), sections:
- A. Which items need CE + DoC (CE mandatory) and which must NOT carry CE (GPSR items) – with legislation and marking instead.
- B. Roles: Ally = manufacturer (signs DoC, technical documentation, 10-year retention); factory = producer (samples, material declaration, SDS, test reports, production control, applies marking as specified); A.R.E.N.A. = validates, checks marking at FRI, never signs.
- C. Step table (Step · Task · What to do / criterion · Who · Output (TCF) · Reference · Target). For toys: 1 classification (TSD Art. 2; not public playground EN 1176) → 2 safety assessment (Art. 18: physical/mechanical, flammability, chemical incl. CMR / element migration / PAH / phthalates / POPs, hygiene, electrical, radioactivity) → 3 conformity route (Art. 19(2) internal production control only when harmonised standards cover ALL hazards and are applied in full, else Art. 19(3) EC-type examination by a notified body) → 4 tests to the cited EN 71 parts on samples from the approved / new tooling (existing valid reports first, K-2) → 5 technical documentation (Annex IV a–g) → 6 EC DoC (Art. 15, Annex III, colour image mandatory, language of each Member State of sale) → 7 CE marking (Art. 16–17, ≥ 5 mm, on toy / label / packaging, also on packaging if not visible) → 8 traceability and manufacturer marking (type/batch, name, trade mark, address, electronic contact, GTIN) → 9 warnings and instructions (Art. 11, Annex V; "Warning" / "Achtung"; decided in the safety assessment, no copied generic age warnings) → 10 series conformity and FRI checks (retest on material / mould / supplier change) → 11 retention 10 years → 12 outlook (TSR 2025/2509 DPP from 1 Aug 2030). For other CE acts adapt the steps (module, NB number, DoC model of Decision 768/2008/EC Annex III, DoP for CPR).
- D. CE artwork specification: logo per Reg. (EC) 765/2008 Annex II, proportions, ≥ 5 mm, NB number only if a NB is involved, position on product label + packaging, adjacent traceability data, FRI checks; "no CE anywhere" row for GPSR items.

**"EC DoC template"**: one row per element of the applicable model (TSD Annex III: title, 1 unique identification, 2 manufacturer, 3 sole-responsibility sentence, 4 object incl. colour image, 5 legislation, 6 harmonised standards with dates, 7 notified body or "not applicable – Art. 19(2)", 8 additional information (test reports), signature block). Columns: No. · element · English text · text in the market language (e.g. Deutsch) · fill-in source / QS check (bilingual). Manufacturer, address, DoC number, batch, signatory = `[___]` filled by the Ally – never by A.R.E.N.A. and never pre-filled with supplier names. List only CE legislation in point 5 (REACH / GPSR are not CE acts).
- **Verify every cited standard and its transition date** with the **Standards live check** before writing (harmonised-standard-lookup skill or EUR-Lex / lab bulletins); never copy editions from this skill or an earlier workbook. Cite sources and the date checked in the reply.
- In sheet 1 the CE item gets CRI document lines (toy conformity documents) and CRI test lines (EN 71-1, EN 71-3), with actions "follow sheet CE & DoC guideline steps …".

## Workbook layout – compact (DEFAULT: two worksheets – user decision 11 Nov 2026)
File: `<Ally>_TCF_<P.O. no(s).>[_EN | _EN-VI].xlsx` (short; no supplier company name). **Exactly two worksheets: "TCF status <Ally>" and "Test plan".**
- Validation log, Report validation, Testing body rules, CE & DoC guideline / EC DoC template, Flowchart and Roadmap are added **only on request**.
- Their key facts go into the two sheets instead: report verdict, validity, supplier-ref and edition findings in Evidence submitted / Action required; the item verdict, due date (ETD − 45 d) and urgent FRI in the Q.S remark.
- For CE items, the CE requirement lines name the steps directly: safety assessment, technical documentation, EC DoC, CE marking.

**Sheet 1 "TCF status <Ally>"** – 13 columns: No. · Item name · Picture · Supplier item no. (supplier ref + GTIN, "GTIN: NEW" kept as flagged) · <Ally> ref (P.O. no.) (blank if no P.O. yet) · <Ally> no. (blank if no P.O. yet) · TCF requirement (test / document) · Evidence type · Testing by (acceptable) · Evidence submitted · Q.S remark (item) · Action required · Status. No accumulated status, item verdict, PIC, due date or summary block. Evidence submitted is coloured (green accepted · amber conditional · red not accepted). Then the "Key requirements" block (K-1/K-2/K-3) and the **"Standards check" block** below the data.
- Evidence submitted values: `None` · `Grouped: test on item n (Jx <job>)` · `Rn <report no.> – valid to <date> / ETD <date>` (existing valid report, K-2) · `Rn <report no.> – expires <date> before ETD <date>` · `Rn <report no.> – supplier ref missing` · `<document> – <short verdict> [Val. #n, <date>]`.
- Q.S remark additions are dated and prefixed `IQA <dd Mmm yyyy>:`; keep the original remark text above them unless it is factually wrong (then correct it and say "previous remark corrected").
- Standard action phrases (keep the user's wording when revising):
  - Lab: "Send sample of item n to an ISO/IEC 17025 lab accredited for the method (Jx <job>); supplier ref on the report; file the report in the TCF."
  - In-house: "Test item n (J4 physical tests) in-house (IT-1…IT-5); supplier ref on the report; file the report in the TCF."
  - Witnessed: "Test item n (J4 physical tests) at an ISO/IEC 17025 lab, or in-house witnessed by A.R.E.N.A. QC (IT-1…IT-6); supplier ref on the report; file the report in the TCF."
  - Grouped: "Put picture and supplier ref of item n on the report of item m; sign identity statement (same <compound and colour / material / coating / packaging type>)."
  - Document: "Supplier: submit <document> stating supplier ref <ref> …"
  - AI / IM: see Assembly instruction section.
  - Existing valid report: "Use existing report Rn (valid to <date> ≥ ETD <date>); file in the TCF; no retest." (Status Done)
  - Retest: "Retest ASAP – Rn expires <date> before ETD <date> / scope gap: <…>; send sample of item n to …"
  - Supplier ref missing: "Lab to amend Rn with supplier ref <ref>; re-submit."
- Status values: Open / In progress / Done / N/A / Cancelled (bilingual per language rule).

**Sheet "Test plan"** – 10 columns: Job · Test · Sample (item) · Items covered – pictures and supplier refs on the report · Evidence type · Testing by (acceptable) · Report due (formula; blank until an ETD is entered) · Status · Earliest ETD (items covered) · Due per item (ETD − 45 d). "Key requirements" block below the table.
- Keep Testing by consistent between sheet 1 and Test plan (e.g. edges/assembly = "Lab or internal" in both, unless the user deliberately set "Internal" in both).
- Report due must be consistent with any date written in sheet 1 actions; flag dates that are unrealistic for the test scope.

## Picture alignment (mandatory when the input contains pictures)
- **Map by picture centre, never by `anchor._from.row` alone.** Offer-sheet pictures are often anchored near the bottom of the row above (large `rowOff`), so the start row points to the wrong item. For each image compute top = row top + `_from.rowOff`, bottom = `to` row top + `to.rowOff` (TwoCellAnchor) or top + `ext.height` (OneCellAnchor), using the sheet's real row heights (default height for unset rows); assign it to the row that contains (top + bottom) / 2. Only images in the picture column count (logos in rows 1–7 are ignored).
- One picture per item: the top-most image of that row; extra images of the same row are alternate views (note them, do not shift them to the next item). A row with no image → picture cell "No picture in offer sheet / Không có hình trong offer sheet" + a Specification consistency line.
- **Verify before building:** make a contact sheet labelled "item no. + item name" with the picture actually assigned, and compare each picture with the description and materials. A picture that shows another article (e.g. a spatula for a cleaning brush, a single basket for a 4-piece set) → Specification consistency line "Offer picture shows … – supplier to send correct picture"; never swap pictures between items on assumption.
- **Placement in the workbook:** picture in column C of the item's FIRST row, inside the item's own merged block – OneCellAnchor with colOff = (column width px − picture width) / 2 (horizontally centred) and rowOff ≈ 4 px; scaled to fit 135–145 × 105–110 px keeping aspect ratio; the item block height ≥ picture height + margin (raise the last row of the block if needed) so no picture overlaps the next item.
- **Picture sources other than an offer sheet.** Screenshot of an offer row → crop the picture cell of THAT row only (no neighbouring cells, borders, header or other rows). Separate sample photos → choose the view that shows ONE complete unit of the item as the picture; the other photos are alternate views.
- **Clean picture (what is inserted must show only the product):** crop to one unit of the item – no second unit, other articles, table / room background where avoidable, neighbouring objects cut at the edge, screen overlays (app icons, rotate arrows, markup, watermarks), cell borders. Never paint over or edit a picture; if no clean crop exists, use another view or insert it with a remark "picture with overlay – supplier to send a clean picture". Keep every part of a set (e.g. a remote control in a candle set) inside the crop.
- **State the picture source** in the Q.S remark: "offer reference (marketing) photo" or "sample photo <view>" – a marketing photo is not evidence of the actual product.
- **Duplicate check:** md5-hash every assigned picture; the same picture on two different articles (not identical-by-design variants) → Specification consistency line on the later item "Offer picture is identical to item n – supplier to send the correct picture".
- **Sample photos used as evidence** (e.g. CE or WEEE marking visible): save the original files next to the workbook as `R<n>_SamplePhoto_Item<k>_<view>.jpg`, register each as R-n type "Supporting" on "Report validation" (verdict `CONDITIONAL (supporting) – marking presence only`), hyperlink the file (short single-line link text, e.g. "R1 photo ▸ open / mở") and deliver in the zip. Never reference "photos in this chat". CE printed on a sample without DoC / test evidence → CRI line `OPEN (CRI) – CE marking seen on the sample, no DoC / test evidence`.
- **Cross-check what is stored, not only the source:** after recalc, unzip the xlsx and view every file in `xl/media` against its anchor row in `xl/drawings/drawing1.xml` (item no. ↔ picture), and confirm no media file is shared by two different articles.
- After recalc / render, look at a page with several pictures (incl. any item whose picture came from a shifted anchor) and confirm each picture sits in its own item block.
- Revision with an updated file or picture: re-run the mapping from the new input, never reuse the previous picture-to-item assignment.

## Hyperlinks (tested pitfalls)
- Name PDFs `R<n>_<Lab>_<ReportNo>_<short>.pdf`, saved in the SAME folder as the workbook; link with a bare relative file name, no sub-folder.
- Evidence-submitted link text short: `Rn <report no.> ▸ open` (LibreOffice does not wrap hyperlink cells). Link every line whose evidence is a report (accepted, conditional, expired, supplier ref missing).
- Internal jump to the report verdict: formula `=HYPERLINK("#'Report validation'!R<row>","<status text> ▸ see validation")` (bilingual: `&CHAR(10)&"… ▸ xem thẩm định"`). Never cell.hyperlink for internal links – LibreOffice recalc rewrites them to an external file reference.
- After recalc, unzip the xlsx and check every `Target=` in `xl/worksheets/_rels/*.rels` exists next to the workbook.
- Deliver: a flat zip (workbook + PDFs) AND the workbook as an individual file. Tell the user: extract first, open in desktop Excel from that folder, click Yes on the security notice; links cannot work inside a zip, Excel Online, Google Sheets or a preview window.

## Build procedure
0. Read all inputs, decide legal streams and overlays, then Step 0 questions (always ask for the P.O. / P.I. when none was uploaded).
1. Read the xlsx skill SKILL.md. Load the order/offer sheet with openpyxl (warnings off) and map pictures to items per **Picture alignment** (section above); make the item-labelled contact sheet and look at it before building. Run the **P.O. cross-check** when P.I. files are given; otherwise apply **No P.O. / P.I. yet**.
2a. Run the **Standards live check** for every standard and date the workbook will cite, including the editions stated in the reports. Record status, date checked and source.
2. Hash and read every document; render tested-sample and reference photos; build the R-register and 10-point checks, including validity at ETD (K-1) and supplier ref (K-3); apply the material declaration check and the edition rule (P-10).
3. Build the per-item requirement list from components and legal stream: food contact → metal release / migration / sensory; handles → REACH Cd, Pb, PAH, phthalates (+ SCCP); composites / recycled plastics (WPC, extrusion type stated) → PAH, Cd, POPs + material declaration (polymer, extrusion type, additives, binder, biocides); coatings → Pb, Cd; every material → SVHC; printed logo → ink chemistry; packaging → heavy metals per type; product tests per function (edges, assembly, stability / strength when loaded, load, corrosion of steel parts); outdoor seating / tables → EN 581-1/-2/-3 (SoA); toys → EN 71 + CE documents; editions of every standard from the **Standards live check**; labelling (GPSR Art. 9 or toy marking); **assembly instruction / instructions for use per item**; CN code (CBAM / EUDR); spec consistency. For each test line apply P-8 (existing valid report first) before planning a new test. Mark each line ACCEPTED / CONDITIONAL / OPEN / N/A (with reason).
4. Write with openpyxl from the text dict for the chosen language and layout (default compact, two worksheets); add the Key requirements blocks and the Standards check block; add the CE & DoC sheets and Validation log when needed; due dates per **Due dates**. Strings starting with `=` or `==>` that are not formulas get `cell.data_type = 's'`. Only Excel-2007 functions (COUNTIF, COUNTIFS, SUMPRODUCT, IF, LEFT, HYPERLINK, CHAR, TODAY).
5. Run `recalc.py`; require 0 errors. Check the stored pictures (`xl/media` ↔ anchor rows, clean crop, no shared media). Render with soffice, look at page 1, a page with several pictures (alignment), the Key requirements block, the validation sheet / log and the CE/DoC sheets (zoom on a dense cell); no clipped text (raise row heights for long requirement texts); Vietnamese diacritics in bilingual mode.
6. Check summary counts against the per-item verdicts and the Validation log summary against its rows, check sheet 1 vs Test plan consistency (testing body, dates, grouping, item numbers), verify links, package and deliver.
7. Reply concisely: language and ETDs used (or "P.O. / P.I. not yet available – P.O. fields blank"), legal-stream decisions, P.O. cross-check result, verdict counts, existing reports leveraged vs retests needed (with reason), report / declaration verdicts, key findings (scope traps, supplier refs missing, integrity issues, design differences, CBAM / EUDR / BPR, spec conflicts), due dates already past and the next hard deadline, what to do next, the Standards check result (status per standard, date checked, sources; any UNVERIFIED or > 30-day-old entry named); no step recap. Update the project note if a Project is attached.

## Revisions
- **Baseline rule.** When the user provides an edited version of the workbook (xlsx, or a text export of it) and an input file or picture is updated, that version is the template: reproduce its sheets, columns, headers, wording, groupings, statuses and decisions exactly (compact or full layout as found). Change only the lines affected by the updated input, plus the K-1/K-2/K-3 consequences (validity at ETD, leverage / retest, supplier ref). If only a text export is given, ask for the .xlsx when pictures must be kept.
- **P.O. arriving later:** when P.O. / P.I. files are sent for a workbook built without them, run the full P.O. cross-check, fill the blank P.O. columns, ETDs and due dates, re-check K-1 validity at the real ETD and apply the P.O. item names.
- **Never overwrite** the user's file or a delivered version: save each revision as a new version (`…_IQA-review_<date>_v2.xlsx`, `_v3` …) and name the version in the reply.
- Prefer rebuilding from the script; when patching an existing workbook with openpyxl: inserting / deleting rows does NOT move pictures, row heights, conditional-format ranges, data-validation ranges or formulas in other sheets – shift image anchors (`_from.row`, `to.row`), rebuild the row-height map, re-add CF / DV ranges to the new last row and rewrite cross-sheet formulas (Validation log live status). Inserting columns: shift widths, CF (incl. formula references), DV.
- **Renumbering items 1…n:** rewrite every "item n" / "items n, m" / "items n / m" / "Item n → item m" reference in all sheets and comments with one mapping (watch slash lists, bare lists such as "7, 10 (item 8)" and "Carton: 2, 3 …", and references to removed items, e.g. "former item 1 <ref>"); remove stale cell / row references (e.g. "E47", "row 59") from remarks; then scan for numbers > n.
- **Every revision re-runs the Standards live check** for the standards it touches, and for any entry checked more than 30 days earlier.
- Keep language, ETDs, legal-stream decisions and user-renamed headers unless asked to change (bilingual: add the Vietnamese line). A material, mapping, design, item-name or legal-stream correction updates item name, requirement lines, evidence mapping, affected report verdicts, CE/DoC sheets, test plan, validation log, notes and summary.
- When new evidence (quotation text, P.O. data) contradicts an earlier remark you wrote, correct the remark in the workbook and say so in the reply.
- Before delivering, list in the reply (max ~8 lines) what changed vs the baseline and any inconsistencies found in it (e.g. date in an action vs Test plan due date, truncated remarks, testing-body mismatch between sheets, CE item without CE & DoC sheet).

## Change Log

| Date | Change |
|---|---|
| 2026-11-11 | Mandatory Standards live check (rulebook §0 / §4.2) with status codes and a Standards check block; P-10 edition rule for report editions; hard-coded editions removed (example table "as checked 11 Nov 2026"); outdoor furniture EN 581-1/-2/-3 (SoA); default output = compact two worksheets (TCF status + Test plan), short file name; other sheets on request. Aligned with the A.R.E.N.A. IQS TCF page. |
| 2026-10-25 | Two-gate rule (documents ETD − 45 d; SRC ≥ buffer before ETD) added to Due dates; optional "Flowchart" (with step interpretation) and "Roadmap" (Gantt, ETD gates) sheets aligned with the TPM in essential-characteristics-testing Step 7b; description extended. |
