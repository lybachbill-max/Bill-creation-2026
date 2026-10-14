---
name: master-quality-compliance-guidelines
description: >
  Master orchestration skill for A.R.E.N.A. Vietnam's 8-link quality compliance
  chain: 4-step determination → pathway (A/B-CPR/B/C/D/E) → module/AVCP →
  type-examination → FPC → DoC/DoP → CE mark → SRC release. Triggers on:
  master compliance, compliance chain, full compliance guideline, compliance
  gate, P.O. compliance, order compliance check, end-to-end compliance, full
  compliance package. Applicable at product category and P.O. level. Covers
  GARDEN, DIY, DECO, AUTO, BUILDING for EU-27, EEA, Switzerland, Canada, US.
  Generates .docx with 8 sequenced gates, document register, RACI, and go/no-go
  criteria per chain link. Also triggers on: GS mark / TÜV GS process, process
  flowchart, regulatory cross-check of a guideline, bilingual EN/VI guideline,
  updating a supplier/inspection checklist into an MCG.
---

# Master Quality Compliance Guidelines
## Complete 8-Link Compliance Chain — Product Category & P.O. Level

> **Skill revision:** 2026-10-14 — adds Step 0 regulatory currency cross-check, Machinery
> Regulation switch-over rules, GS mark process, process flowcharts (with non-mermaid
> fallback), bilingual EN/VI mode, versioning rules, and the manual pallet truck category
> configuration (first encoded from MCG-DIY-HT-PT-001).

> **Organisation Context**: A.R.E.N.A. Vietnam is a **sourcing office**, not a manufacturer.
> It sources non-food consumer products from supplier factories and connects them to retail
> partners (HAGEBAU, ITM, BCM, DEDEMAN, JUMBO/Coop) across EU-27, EEA-3, Switzerland,
> Canada, and US markets. This skill is the master orchestration layer — it sequences all
> specialist skills in the correct compliance chain order and generates the governing
> compliance guideline document for a product category or a specific Purchase Order.

---

## Purpose

The complete compliance chain for any CE-regulated or GPSR-governed product is:

```
LINK 1          LINK 2         LINK 3          LINK 4
4-Step Method → Pathway    → Module/AVCP  → Type-Exam / ITT
                (A/B-CPR/     (A→H; AVCP     (NB certificate
                 B/C/D/E)      1+/1/2+/3/4)   or ITT report)

LINK 5          LINK 6         LINK 7          LINK 8
FPC/Production → DoC or DoP → CE/Mark      → SRC Release
Module           (declaration   (affixed by     (gate verified
(ongoing          of conformity  manufacturer    by QC/QS)
 production        or performance or TAB)
 control)          signed)
```

Each link is a compliance gate. Failure at any link invalidates all subsequent links.
A product cannot proceed to Link 6 without a valid Link 4 output.
A P.O. cannot be released without all 8 gates verified and documented.

This skill operates at **two levels**:

- **Category Level** — Applied when a new product category is introduced, a tender is assessed,
  or a new supplier is qualified. Produces the Master Quality Compliance Guideline document
  that governs all future P.O.s for that category.
  Where the tender is a live RFI/RFQ/RFP, Links 1–4 are established **during** the RFx under
  ARENA-SOP-01-04 — route to `arena-rfx-process`. Rule R-01 applies: no RFQ may be issued
  without a current QSD, so the Category-Level MCG (or at minimum Links 1–4) precedes the RFQ.

- **P.O. Level** — Applied when a specific Purchase Order is placed. Validates that all
  Link 1–8 outputs are current, complete, and correctly matched to the specific P.O.
  specifications, destination market, and retail partner requirements.

---

## When to Use

Trigger this skill when the user:

- Asks for a "complete compliance package" or "full compliance guideline" for a product
- Requests an end-to-end compliance assessment for a new category or new supplier
- Needs to know what compliance documents are required for a specific P.O.
- Asks to verify P.O. compliance readiness before production or shipment
- Needs a master document that governs all compliance obligations for a product range
- Requests compliance gate verification for a specific order
- Mentions "compliance chain", "compliance gates", "all compliance documents", "P.O. compliance"
- Asks which skills to run and in which order for a new product
- Needs a compliance orchestration document for an international tender
- Wants to onboard a new supplier with full compliance visibility
- References "Master Compliance Guideline", "MCG", or "compliance master file"

---

## Two Operating Modes

### Mode 1 — Category-Level Master Quality Compliance Guideline (MCG)

**Trigger:** New product category | New supplier | Tender classification | Product range review

**Output:** MCG document (.docx) — the permanent governing reference for all P.O.s of
this product category. Contains the full 8-link chain analysis, all applicable documents,
standards, testing requirements, RACI, and go/no-go criteria per gate.

**Scope:** Covers the product category irrespective of specific order quantities,
supplier identity, or retailer. Supplier and manufacturer fields left as `[___]` placeholders.

**Validity:** MCG is reissued when: pathway classification changes, a directive is revised,
an hEN is superseded, a market destination is added, or a retail partner changes requirements.

### Mode 2 — P.O.-Level Compliance Gate Verification

**Trigger:** Specific Purchase Order placed | Pre-production check | Pre-shipment release

**Output:** P.O. Compliance Gate Verification Report (.docx) — a P.O.-specific checklist
that maps each Link 1–8 gate to the actual documents held, their validity status, and
the Go / Conditional / No-Go decision per gate.

**Scope:** Supplier-specific, market-specific, retailer-specific, batch-specific.
All fields populated with actual data: supplier name, factory address, P.O. number,
production batch, inspection dates, certificate numbers, expiry dates.

**Validity:** Per shipment. A new P.O. Compliance Gate Report is produced for each order.

---

## Workflow

```
User Request
     │
     ├── Mode 1 (Category)? ──► Collect Step 1 inputs (product + markets + retailers)
     │                          Run LINK 1 → LINK 8 analysis
     │                          Generate MCG .docx
     │
     └── Mode 2 (P.O.)? ──────► Collect P.O. inputs (P.O. number + supplier + batch)
                                 Verify each gate against held documents
                                 Generate P.O. Gate Verification Report .docx
     │
     ▼
Read /mnt/skills/public/docx/SKILL.md before generating any output
```

### Step 0 — Regulatory Currency Cross-Check (mandatory, every run)

Before writing any link, verify that every legal act and standard to be cited is **current on
the issue date**. Never rely on the source checklist or on memory for editions and dates.

| Check | Rule |
|-------|------|
| Repealed acts | Never cite as applicable: GPSD 2001/95/EC (repealed 13/12/2024 → GPSR (EU) 2023/988); PPWD 94/62/EC (→ PPWR (EU) 2025/40, applicable 12/08/2026). Flag them in the change log if present in the source. |
| Machinery | MD 2006/42/EC applies to machinery placed on the EU market up to 19/01/2027; Machinery Regulation (EU) 2023/1230 from 20/01/2027. Decide per P.O. on the **EU placing-on-market (arrival) date**; prepare dual MD/MR documentation when a P.O. straddles the date. |
| hEN citation under MR | Check whether a Commission Implementing Decision citing harmonised standards under MR has been published. MD citations do **not** give presumption of conformity under MR Art. 20 — until cited, the technical file must demonstrate Annex III EHSR directly. |
| Standard editions | Run the `harmonised-standard-lookup` preflight (VERSION_DB / WATCH) and confirm edition + amendments. Presumption of conformity follows the **OJ-cited** edition, not CEN withdrawal. Example: EN 16307-5:2023 superseded :2013 at CEN level (29/12/2023) but its OJ citation is unconfirmed → cite the last OJ-cited edition for presumption and require new test reports to cover :2023. |
| PPWR staging | Art. 5(4) + packaging DoC since 12/08/2026; Art. 12 labelling from the later of 12/08/2028 or 24 months after implementing acts; Art. 44 harmonised registers pending (use national EPR schemes meanwhile). |
| Switzerland | EU-CH MRA covers MD today; update for MR depends on EU-CH package ratification — flag CH lots after 20/01/2027. |
| Pending amendments | Check Omnibus IV (digital DoC/instructions), CBAM downstream extension (COM(2025) 989, proposed 2028), POPs/REACH Candidate List updates. |

**Output:** an **Annex — Regulatory Cross-Check Log** (item · finding · status ✅ confirmed /
🔧 corrected / ⚠️ open · source). Items that cannot be confirmed from official text are marked
“verify” in the body and listed as open. If official sites (EUR-Lex, gesetze-im-internet.de) are
unreachable, say so in the log and in the reply; never present secondary-source findings as
confirmed official text.

### Language Mode

| Mode | Output |
|------|--------|
| EN (default) | English only |
| EN-VI (bilingual) | Vietnamese directly beneath each English heading, paragraph, bullet, table cell and flowchart label — see **Bilingual EN/VI Mode** |

### Versioning Rule

Each revision is saved as a **new file** with an incremented version (`_v1.1`, `_v1.2`, …;
bilingual edition `_EN-VI_v1.x`). Never overwrite the previous version. Record every revision in
the change-log section and in the cover “Version / status” field.

### Source Checklist Conversion

When the user supplies an existing inspection checklist / product-requirements template:
1. Extract it fully (pandoc / python-docx) and keep its structure (defect definitions, zones,
   tolerance tables, defect classification, packaging data tables).
2. Correct outdated references (Step 0), add missing tests required by the hEN / directive,
   define the sampling plan, and add a **Change Log versus Source Checklist** section.
3. Reissue the corrected checklist as **Annex A** of the MCG (with legal reference and fail class
   per item), defect table as Annex B (keep existing bilingual defect names), measurement sheet
   as Annex C, PPWR packaging data as Annex D.

---

## Step 1: Collect Inputs

### Mode 1 — Category Level Inputs

| Input | Description | Example |
|-------|-------------|---------|
| **Product name** | Full category name | BATHROOM TOWELS |
| **A.R.E.N.A. department** | GARDEN / DIY / DECO / AUTO / BUILDING | DECO |
| **Product Family** | **QSD is generated at this level** — look up in Master Reference | Sanitary |
| **Product Sub-Family** | **QCP is generated at this level** — one QCP per sub-family | Bathroom and toilet accessories |
| **Power source** | None / Mains / Battery / Gas / Solar | None |
| **Construction use?** | Permanently incorporated into works? | No |
| **Wireless / RF?** | Wi-Fi, Bluetooth, NFC, RF? | No |
| **Child appeal?** | Could children use or access? | Yes (infant variants) |
| **Key materials** | Primary materials | Cotton, bamboo-cotton, polyester |
| **Biocidal claim?** | Antimicrobial / pesticidal function? | No (standard) |
| **Vehicle component?** | Within UN ECE / Type Approval scope? | No |
| **Target markets** | EU-27, Switzerland, Canada, US | EU-27 + Canada |
| **Retail partners** | HAGEBAU / ITM / BCM / DEDEMAN / JUMBO | All Allies |

### Mode 2 — P.O. Level Additional Inputs

| Input | Description | Example |
|-------|-------------|---------|
| **P.O. number** | A.R.E.N.A. Purchase Order reference | PO-2026-DECO-00142 |
| **Supplier / Factory** | Manufacturer name and address | [Supplier Name], Vietnam |
| **Production batch** | Batch or lot code | B2026-04 |
| **Order quantity** | Total units ordered | 12,000 pcs |
| **Destination market** | Specific MS or country | Germany (HAGEBAU) |
| **Shipment window** | Planned production + shipment dates | May–June 2026 |
| **Existing certificates held** | List all current certificates on file | OEKO-TEX No. XY-123456 |
| **Previous inspection results** | Last DPI/FRI pass/fail history | FRI PASS — Feb 2026 |

---

## LINK 1 — 4-Step Compliance Determination

**Purpose:** Determine the correct compliance pathway before any document or test is
commissioned. The pathway is the output of this link — not an inference from product
appearance or material.

**Companion skill:** `/mnt/skills/user/quality-compliance-pathway/SKILL.md`

### Step I — Intended Use

Define the product's functional identity and generate candidate directive list:
- What does it do? In what context? For what user population?
- What is the reasonably foreseeable misuse?
- Is it a vehicle component? → If YES → Pathway D. Stop.
- Does it carry a biocidal/antimicrobial claim? → If YES → Pathway E overlay.

### Step II — Directive Scope Check (Decisive)

For each candidate directive, read the scope clause directly:

| Candidate Directive | Scope Clause Reference | In Scope? | Justification |
|--------------------|----------------------|-----------|---------------|
| CPR 305/2011 (transition to (EU) 2024/3110 — check applicable regime per product/hEN) | Art. 2(1) | Yes / No | [State reason] |
| LVD 2014/35/EU | Art. 1(1) | Yes / No | [State reason] |
| Machinery Directive 2006/42/EC (until 19/01/2027) | Art. 1(1); Art. 2(a) | Yes / No | [State reason] — note: assemblies for lifting loads powered solely by directly applied human effort are in scope |
| Machinery Reg (EU) 2023/1230 (from 20/01/2027) | Art. 2; Art. 3 definition of “machinery” | Yes / No | [State reason] — verify citation of hENs under MR (Step 0) |
| GPSR (EU) 2023/988 | Art. 2(1) | Complementary | Aspects not covered by sectoral law; accident notification, online sales, recalls |
| Market Surveillance Reg (EU) 2019/1020 | Art. 4 | Yes / No | EU economic operator mandatory for listed legislation (incl. machinery) |
| Toys Reg (EU) 2025/2509 | Art. 2(1) | Yes / No | [State reason] |
| PPE Reg (EU) 2016/425 | Art. 3(1) | Yes / No | [State reason] |
| EMC 2014/30/EU | Art. 2(1) | Yes / No | [State reason] |
| RED 2014/53/EU | Art. 1(1) | Yes / No | [State reason] |
| RoHS 2011/65/EU | Art. 2(1) | Yes / No | [State reason] |

### Step III — Material Composition Overlays

| Material Signal | Overlay Triggered | Action Required |
|----------------|-------------------|-----------------|
| Wood / rubber / leather / palm oil | EUDR 2023/1115 | Due diligence statement |
| Dyed textiles | REACH Annex XVII Entry 43 | Azo dye test EN ISO 14362-1 |
| Finishing agents | Formaldehyde risk | EN ISO 14184-1 test |
| DWR / fluorinated finish | PFAS / POPs overlay | PFAS screening |
| EEE components | RoHS / WEEE | RoHS compliance + producer reg |
| Steel / aluminium | CBAM | Emissions data from supplier |
| Metal accessories | REACH Entry 27 (Ni) | Ni release test if skin contact |
| Biocidal treatment | BPR Art. 58 | Active substance authorisation |
| All products | REACH Art. 33 SVHC | SVHC declaration per shipment |
| All products | PPWR (EU) 2025/40 | Packaging compliance + EPR |

### Step IV — Market Destination

| Market | Key Parallel Requirements Activated |
|--------|-------------------------------------|
| EU-27 | GPSR Art. 9 file + EU RP + REACH + PPWR + Textile/sector-specific labelling |
| Switzerland | PrSG + Cassis de Dijon + Swiss importer ID + trilingual (JUMBO/Coop) |
| Canada | CCPSA + bilingual EN/FR + TLA + CSA (if electrical) |
| US | CPSC / CPSIA + Prop 65 + UL/FCC (if electrical) |
| France (ITM) | VOC A+ + mineral oil packaging + French language |
| Germany (HAGEBAU) | GS mark (where applicable) + OEKO-TEX (textiles) |
| Romania (DEDEMAN) | Romanian language + EU law direct application |

**Link 1 Output:** Pathway confirmed + Directive Stack table + Overlay checklist

**Gate 1 Go/No-Go:**
- ✅ GO — Pathway clearly assigned with scope clause justification documented
- ⚠️ CONDITIONAL — Boundary product; escalate to senior QS for scope ruling
- ❌ NO-GO — Insufficient product information to classify; request additional data

---

## LINK 2 — Pathway Assignment and Compliance Route

**Purpose:** Assign the product to one of six pathways and confirm the legal framework
governing all subsequent links.

**Companion skill:** `/mnt/skills/user/quality-compliance-pathway/SKILL.md`

### Pathway Decision Matrix

| Pathway | Trigger Condition | CE / Mark | Declaration | Links 3–7 Required |
|---------|------------------|-----------|-------------|---------------------|
| **A** | Directive in scope + hEN published in OJEU | CE | DoC or DoP | Module/AVCP → ITT → FPC → DoC/DoP → CE |
| **B-CPR** | CPR in scope + no hEN + EAD published by EOTA | CE | DoP (ETA-ref) | TAB/ETA → FPC → DoP → CE |
| **B** | Directive in scope + no hEN + no EAD | CE | DoC | Bespoke assessment → FPC → DoC → CE |
| **C** | No directive in scope | None | GPSR Art. 9 | Risk assessment → Safety file |
| **D** | Vehicle component / UN ECE Reg | "e"/"E" mark | Type Approval Cert | Technical Service → CoP |
| **E** | Biocidal product / treated article | None | Authorisation | Competent Authority |

### Directive Stack Table (populate for every product)

| Directive / Regulation | Scope Confirmed | hEN / EAD | Pathway | Module / AVCP | NB / TAB? | Declaration |
|------------------------|----------------|-----------|---------|---------------|-----------|-------------|
| [Per product] | Yes / No | [Cite or N/A] | A/B-CPR/B/C/D/E | [Module] | Yes / No | DoC / DoP / None |

**Link 2 Output:** Pathway assignment confirmed + Directive Stack table complete

**Gate 2 Go/No-Go:**
- ✅ GO — Single unambiguous pathway assigned; directive stack complete
- ⚠️ CONDITIONAL — Multi-directive product; confirm each directive independently
- ❌ NO-GO — Pathway cannot be confirmed; send back to Link 1

---

## LINK 3 — Module / AVCP System Determination

**Purpose:** Determine the specific conformity assessment procedure required by each
applicable directive. This controls NB engagement, QMS requirements, and the evidence
that must appear in the DoC/DoP.

**Companion skill:** `/mnt/skills/user/harmonised-standard-lookup/SKILL.md`

### NLF Module Reference (Pathway A and B — non-CPR directives)

| Module | Who Assesses | NB Required | Coverage | Typical Application in A.R.E.N.A. |
|--------|-------------|-------------|----------|-----------------------------------|
| **A** | Manufacturer | No | Design + production (self) | LVD, EMC, RoHS — most electrical consumer products |
| **A1** | Manufacturer + accredited lab | No | Design + supervised testing | Some Machinery categories |
| **B** | Notified Body | YES — design | Design only (must pair with C/C2/D/E/F) | PPE Cat II/III, high-risk Machinery |
| **C** | Manufacturer | No | Production conformity to type | Follows Module B for PPE Cat II |
| **C2** | Manufacturer + NB random checks | YES — surveillance | Production + random NB checks | PPE Cat III option |
| **D** | Manufacturer QMS + NB audit | YES — QMS | Full production QMS | PPE Cat III, PED, Machinery high-risk |
| **E** | Manufacturer QMS + NB audit | YES — QMS | Product testing QMS | PED alternative |
| **F** | NB verifies each batch | YES — production | Batch / product verification | PED high categories |
| **G** | NB verifies each unit | YES — unit | Individual unit | Bespoke/one-off products |
| **H** | Manufacturer QMS (incl. design) + NB | YES — full QMS | Design + production integrated QMS | Machinery high-risk, PED Cat IV |

**Module A wording rule:** For Module A / MD Annex VIII products there is no NB certificate —
never write “CE certification” or “CE certificate”; write “DoC + accredited test report”. No NB
number follows the CE mark; an NB number on marking/DoC without NB involvement is a NO-GO.

**Module selection rule:** The directive specifies which modules are available for each product
risk category. The manufacturer does not freely choose — the applicable module is
prescribed by Annex of the directive based on risk level.

### CPR AVCP System Reference (Pathway A and B-CPR — CPR only)

| AVCP | FPC Audit | Type Testing | NB / TAB Involvement | Typical A.R.E.N.A. Products |
|------|-----------|-------------|---------------------|---------------------------|
| **1+** | NB audits FPC | NB tests market samples | Full NB — highest | Structural anchors (high consequence) |
| **1** | NB audits FPC | NB tests type | Full NB | Structural screws EN 14592, some fasteners |
| **2+** | NB audits FPC | Manufacturer tests type | NB for FPC only | Some floor coverings |
| **3** | No FPC audit | NB tests type | NB for type testing | SPC flooring EN 16511, wall tiles |
| **4** | No FPC audit | Manufacturer tests type | None | Ceramic tiles, sanitaryware, WC pans |

**AVCP determination rule:** The AVCP system is specified in the hEN's Annex ZA (Pathway A)
or in the EAD (Pathway B-CPR). It cannot be selected by the manufacturer.

### Module / AVCP Output Table

| Directive | Pathway | Module / AVCP | NB / TAB Required | NB/TAB Name | NB/TAB Number | Certificate / Approval Ref |
|-----------|---------|---------------|------------------|-------------|---------------|--------------------------|
| [Per directive] | A/B/B-CPR | [Module or System] | Yes/No | [___] | [___] | [___] |

**Link 3 Output:** Module/AVCP confirmed per directive + NB/TAB identified (if required)

**Gate 3 Go/No-Go:**
- ✅ GO — Module/AVCP confirmed; NB/TAB identified and NANDO-listed where required
- ⚠️ CONDITIONAL — NB not yet engaged; proceed with engagement action plan
- ❌ NO-GO — Module requires NB; no NB identified or NB not listed for this directive

---

## LINK 4 — Type-Examination / Initial Type Testing

**Purpose:** Establish the design approval or declared performance baseline that all
subsequent production must conform to. This is the technical anchor of the entire
compliance chain — every Link 5–8 output depends on a valid Link 4 document.

**Companion skills:**
- `/mnt/skills/user/essential-characteristics-testing/SKILL.md`
- `/mnt/skills/user/harmonised-standard-lookup/SKILL.md`
- `/mnt/skills/user/quality-compliance-pathway/SKILL.md` (Pathway B-CPR / CPR route)

### EU Type-Examination (Module B — NLF Directives)

**Conducted by:** Notified Body (mandatory — no exceptions)
**Scope:** Product design — technical file, drawings, calculations, representative specimen
**Output:** EU Type-Examination Certificate (NB reference number, product type, directive,
expiry date, conditions/restrictions)
**Validity:** Typically 5 years — must be renewed against current standards at expiry
**DoC reference:** NB name + NB number + certificate reference number mandatory in DoC

**A.R.E.N.A. verification checklist (Module B products):**
- [ ] Certificate issued by a NANDO-listed NB for the applicable directive
- [ ] Certificate covers the exact product type being sourced (model number, variant, voltage, etc.)
- [ ] Certificate is within validity period (not expired)
- [ ] Certificate cites the current version of the applicable hEN (check for supersession)
- [ ] Any restrictions or conditions in the certificate are reflected in the product design
- [ ] Design change since last certificate → NB notified → supplementary certificate or revision obtained
- [ ] Certificate renewal process initiated ≥ 3 months before expiry

### Initial Type Testing (CPR — AVCP Systems 1, 1+, 2+, 3)

**Conducted by:** NB Product Certification Body / Testing Laboratory (Systems 1, 1+, 3)
  or Manufacturer's own accredited lab (System 2+ and 4)
**Scope:** All essential characteristics declared in the hEN Annex ZA or EAD
**Output:** ITT Test Report documenting measured performance values per characteristic
**DoP reference:** ITT results are directly declared as performance values in the DoP
**Validity:** No fixed expiry — ITT must be repeated on any product or process change

**Structural difference from Module B:**
- Module B = design approval against Essential Requirements → DoC confirms conformity
- ITT = measured performance values → DoP declares actual performance (not conformity)
- The customer uses DoP performance values to verify fitness for their intended use in works

**A.R.E.N.A. verification checklist (ITT products):**
- [ ] ITT conducted by NB or ISO/IEC 17025-accredited lab as required by AVCP system
- [ ] ITT covers ALL essential characteristics declared in hEN Annex ZA / EAD
- [ ] ITT test methods match current hEN / EAD specified methods
- [ ] DoP declared values match ITT report results exactly — no rounding without justification
- [ ] hEN version cited in ITT is current (not superseded or withdrawn)
- [ ] Any product or production process change since last ITT → new ITT commissioned
- [ ] System 4: manufacturer's own ITT reports from ISO/IEC 17025-accredited lab confirmed

### Lifting Machinery (MD/MR Annex I/III Part 4) — Mandatory Tests

- Static test 1.5 × rated load (manually operated machinery) and dynamic test 1.1 × rated load
  (Annex I 4.1.2.3) — both required; source checklists often omit the dynamic test.
- Annex I 4.1.3: static and dynamic tests on **all** lifting machinery before putting into
  service → FPC must hold 100 % end-of-line load-test records per serial number.
- Rated load marking (4.3.3), overload/pressure-limiting device, load holding (drift), controlled
  lowering and crushing/shearing gaps (EN ISO 13854) belong in the type-test matrix and in the
  FRI functional tests (special level S-3, Ac 0).

### Pathway C — No Type-Examination / No ITT

For Pathway C (GPSR Safety Net) products, there is no type-examination or ITT.
Instead:
- GPSR Art. 6 **internal risk assessment** is the equivalent baseline
- Voluntary standard test reports support the risk assessment
- GPSR Art. 9 **product safety information file** holds all evidence
- Companion skill: `/mnt/skills/user/gpsr-risk-assessment/SKILL.md`

**Link 4 Output Document Register:**

| Document | Applicable Pathway | Issued By | Reference No. | Validity | Status |
|----------|-------------------|-----------|---------------|----------|--------|
| EU Type-Examination Certificate | A, B (Module B) | Notified Body | [___] | [Date] | [Valid/Expired/Pending] |
| ITT Test Report | A, B-CPR, B (CPR) | NB Lab / Accredited Lab | [___] | On change | [Valid/Change pending] |
| European Technical Assessment (ETA) | B-CPR | TAB | [___] | On change | [Valid/Change pending] |
| GPSR Internal Risk Assessment | C | QS / Manufacturer | [___] | On change | [Valid/Update pending] |
| Voluntary Standard Test Reports | C (supporting) | Accredited Lab | [___] | 2 years | [Valid/Expired] |
| Chemical Test Reports (REACH suite) | ALL | Accredited Lab | [___] | 2 years | [Valid/Expired] |

**Gate 4 Go/No-Go:**
- ✅ GO — All Link 4 documents current, valid, and covering the exact product in scope
- ⚠️ CONDITIONAL — Certificate/report expiring within 3 months; renewal in progress
- ❌ NO-GO — Certificate expired / design changed without re-assessment / ITT incomplete

---

## LINK 5 — Ongoing FPC / Production Module

**Purpose:** Ensure that what is being produced is consistent with the type-approved
design (Link 4) or the GPSR-assessed product definition. FPC is the production bridge
between the initial approval and every unit shipped.

**Companion skills:**
- `/mnt/skills/user/factory-production-control/SKILL.md`
- `/mnt/skills/user/supplier-production-line-audit/SKILL.md`
- `/mnt/skills/user/supplier-evaluation-framework/SKILL.md`
- `/mnt/skills/user/product-specification-production-process/SKILL.md`
- `/mnt/skills/user/fmea-generator/SKILL.md`

### FPC Requirements by Pathway and AVCP System

| Pathway / AVCP | FPC Obligation | Who Audits FPC | Frequency |
|---------------|----------------|----------------|-----------|
| A — AVCP 1+ | Mandatory | NB — formal surveillance audit | Annual minimum |
| A — AVCP 1 | Mandatory | NB — formal surveillance audit | Annual minimum |
| A — AVCP 2+ | Mandatory | NB — formal surveillance audit | Annual minimum |
| A — AVCP 3 | Mandatory | Manufacturer self-managed | Continuous; NB does not audit |
| A — AVCP 4 | Mandatory | Manufacturer self-managed | Continuous; no external audit |
| B-CPR | Mandatory per EAD | TAB or NB per EAD requirements | Per EAD specification |
| B (non-CPR) | Per directive module | NB if Module D/H; self if C | Per module |
| Module A (NLF) | Mandatory | Manufacturer self-managed | Continuous internal |
| Module D (NLF) | Mandatory — formal QMS | NB surveillance audits | Annual minimum |
| Module H (NLF) | Mandatory — full QMS | NB surveillance audits | Annual minimum |
| C (GPSR) | Voluntary but strongly recommended | A.R.E.N.A. QC / 3rd party | Per order (FRI mandatory) |

### FPC Minimum Content (All AVCP Systems and CPR Products)

An FPC system must document and control:

1. **Incoming material control** — raw materials and components verified against specification
2. **Equipment calibration** — measuring and testing equipment calibration records
3. **In-process control** — production parameter checks at defined intervals
4. **Product testing** — final product testing against declared essential characteristics
5. **Non-conforming product** — identification, segregation, and disposition procedure
6. **Corrective action** — documented CAPA for out-of-specification results
7. **Record retention** — minimum 10 years for CPR; per directive for NLF

### A.R.E.N.A. Production Control Gate (All Products, All Pathways)

Beyond the formal FPC requirement, A.R.E.N.A. imposes its own production control gates:

| Control | Trigger | Executor | Standard |
|---------|---------|----------|----------|
| DPI — During Production Inspection | First order from supplier; or at 30–50% production on critical orders | QC / 3rd Party | A.R.E.N.A. QC Pack |
| ILI — In-Line Inspection | Risk Cat. 3 or large promotional orders | QC | A.R.E.N.A. QC Pack |
| FRI — Final Random Inspection | Every shipment, mandatory | QC / 3rd Party | ANSI/ASQ Z1.4; AQL 2.5/4.0 |
| Golden Sample | Every production order, every colour/variant | QS | Per QSD specification |
| Production Audit | New supplier or post-complaint | QS / IQA | Supplier audit skill |

**Link 5 Output:** FPC record reference + A.R.E.N.A. inspection schedule per order

**Gate 5 Go/No-Go:**
- ✅ GO — FPC system verified at factory; DPI/ILI passed (where applicable); FRI booked
- ⚠️ CONDITIONAL — First order from new supplier; DPI mandatory before proceeding
- ❌ NO-GO — FPC system not established; NB surveillance overdue; critical FRI fail

---

## LINK 6 — Declaration of Conformity (DoC) or Declaration of Performance (DoP)

**Purpose:** Issue the legally binding declaration that all prior links have been
completed and the product meets its applicable requirements. This is the formal
compliance statement that enables CE marking (Link 7).

**Companion skill:** `/mnt/skills/user/ce-marking-doc-dop/SKILL.md`

### DoC — Declaration of Conformity (All CE Directives except CPR)

**Issued by:** Manufacturer (or their authorised representative in EU)
**Legal basis:** Blue Guide 4.3; individual directive requirements
**Mandatory content:**
- Manufacturer name and address
- Product description (type, model, batch/serial number)
- Statement that the DoC is issued under sole responsibility of the manufacturer
- Object of declaration (product identifier)
- All applicable directives and regulations
- Reference to harmonised standards or common specifications applied (with version dates)
- Module reference and NB name + number + certificate reference (where NB involved)
- Place and date of issue
- Name and signature of authorised signatory

**Critical DoC rules:**
- Non-CPR multi-directive products: all directives on ONE combined DoC
- CPR + non-CPR product: SEPARATE DoC for non-CPR directives; SEPARATE DoP for CPR
- DoC must reference the current (not superseded) version of each hEN
- Module A: no NB reference. Module B+: NB name + number + certificate number mandatory
- DoC language: official language(s) of Member State(s) of market placement
- MD: instructions contain the DoC or a document setting out its contents (Annex I 1.7.4.2(c)).
  MR Art. 21: DoC (Annex V Part A) accompanies the machinery or the manufacturer gives the
  internet address where it can be accessed. A.R.E.N.A. default for DIY channel: paper copy in box.
- MR Art. 10(7) instructions: digital allowed (downloadable, printable, access marked on the
  machine, online ≥ lifetime / 10 years); paper copy free on request within one month; safety
  information on paper where non-professional use is foreseeable → paper manual for DIY retail.
- Importer marking (MR Art. 13 / Reg. 2019/1020 Art. 4 / GPSR): importer name and contact on the
  product or, where impossible, packaging/accompanying document — Critical at FRI.

### DoP — Declaration of Performance (CPR only)

**Issued by:** Manufacturer
**Legal basis:** CPR 305/2011 Arts. 4–7; Commission Delegated Regulation (EU) 574/2014
**Mandatory content:**
- Unique identification code of the product-type
- Intended use(s) of the product
- List of essential characteristics for which the DoP is issued
- Performance of the product for each essential characteristic (actual values from ITT)
  or "No Performance Determined" (NPD) where the characteristic is not declared
- AVCP system applied
- NB name + number + certificate reference (Systems 1+, 1, 2+, 3)
- hEN or EAD reference (with date and version)
- Manufacturer name and address
- Authorised representative (if applicable)
- Date of issue

**Critical DoP rules:**
- DoP declares PERFORMANCE VALUES (measured) — not a statement of conformity
- NPD is permitted for characteristics not relevant to the intended use of the works
- DoP must be made freely available — on website, paper copy on request, accompanying product
- For Pathway B-CPR: DoP references ETA number, EAD, and TAB instead of hEN and NB

### Pathway C — No DoC, No DoP

GPSR does not require a Declaration of Conformity. CE marking does not apply.
The equivalent document is the **GPSR Art. 9 Product Safety Information File**
which must be maintained for 10 years and made available to market surveillance
authorities on request.

**Link 6 Document Register:**

| Document | Pathway | Issued By | Reference | Signed By | Date | Language |
|----------|---------|-----------|-----------|-----------|------|----------|
| DoC (combined multi-directive) | A, B | Manufacturer | [___] | [___] | [___] | EN + market lang |
| DoP | A (CPR), B-CPR | Manufacturer | [___] | [___] | [___] | EN + market lang |
| GPSR Art. 9 Safety File | C | QS / EU RP | [___] | [___] | [___] | EN + market lang |

**Gate 6 Go/No-Go:**
- ✅ GO — DoC/DoP correctly drafted, all mandatory fields complete, signed, language correct
- ⚠️ CONDITIONAL — DoC references superseded hEN version; revise before shipping
- ❌ NO-GO — DoC/DoP missing; wrong declaration type (DoC issued for CPR product); no signature

---

## LINK 7 — CE Marking / Conformity Mark Affixation

**Purpose:** Affix the legally prescribed conformity mark to the product, confirming
to the market that all prior links in the compliance chain have been completed.

**Companion skill:** `/mnt/skills/user/artwork-packaging-compliance-master/SKILL.md`

### CE Marking Rules (Pathway A, B, B-CPR)

- **Affixed by:** Manufacturer (or their authorised representative)
- **Affixed when:** After DoC/DoP has been drawn up — never before
- **Format:** CE letters per Annex II of Regulation (EU) 765/2008; minimum height 5 mm
  (unless product dimensions make this impractical — proportional reduction permitted)
- **NB number:** Where Module B or equivalent NB involvement applies, the NB's
  four-digit number is affixed immediately after the CE mark
- **Placement:** On the product, its data plate, or on the packaging (if product too small);
  visible, legible, and indelible
- **Prohibition:** CE marking must NOT be affixed to products not covered by a CE directive.
  False CE marking is a market surveillance violation under Regulation (EU) 2019/1020 Art. 30(5).

### "e" / "E" Mark Rules (Pathway D — Vehicle Type Approval)

- Small circle containing: "e" (national) or "E" (UN ECE) + country code number + approval number
- Affixed per the specific UN ECE Regulation requirements
- Cannot be combined with CE marking

### Pathway C — No Conformity Mark

No CE mark, no "e"/"E" mark, no conformity mark of any kind.
EU Responsible Person identification is mandatory under GPSR Art. 4/16.
Manufacturer identification is mandatory under GPSR Art. 9.

### Marking Verification Checklist (QC at FRI)

| Marking Element | Pathway | Check | Accept / Reject |
|----------------|---------|-------|-----------------|
| CE mark present and correct format (min 5 mm) | A, B, B-CPR | Visual + measure | Per Annex II |
| NB number present immediately after CE (where NB involved) | A (Module B+), B, B-CPR | Visual | 4-digit NB number |
| CE mark absent (Pathway C) | C | Confirm NOT present | Reject if CE applied incorrectly |
| EU Responsible Person name + address | ALL (EU market) | Label check | Full name and address |
| Manufacturer name + address / trade name | ALL | Label check | Present and legible |
| Product ID / batch code | ALL | Label check | Traceability confirmed |
| Market-specific language requirements | Per destination | Label check | Per market destination |
| OEKO-TEX / GS / voluntary marks | Per retailer | Verify certificate current | Per retailer spec |

**Link 7 Output:** Artwork approval record + marking compliance confirmed at FRI

**Gate 7 Go/No-Go:**
- ✅ GO — CE/mark correctly affixed; EU RP and manufacturer identification correct; no
  prohibited marks applied to Pathway C products
- ⚠️ CONDITIONAL — Minor marking error correctable before packing is sealed
- ❌ NO-GO — CE mark incorrectly applied to Pathway C product; NB number missing where required;
  EU RP absent; wrong language on label

---

## LINK 8 — SRC Release (Shipment Release Certificate)

**Purpose:** The final gate. The SRC confirms that ALL prior links (1–7) have been
verified for the specific shipment and authorises release of the goods for shipment.

**Companion skills:**
- `/mnt/skills/user/qc-pack/SKILL.md`
- `/mnt/skills/user/fri-validation/SKILL.md`
- `/mnt/skills/user/export-packaging-compliance/SKILL.md`

### SRC Release Conditions — Universal (All Pathways, All Markets)

The following must ALL be confirmed before the SRC is issued:

**Link 1–2 Gates:**
- [ ] Pathway classification confirmed and documented (MCG on file)
- [ ] Directive stack complete and verified

**Link 3 Gate:**
- [ ] Module/AVCP confirmed; NB/TAB engagement verified where required

**Link 4 Gate:**
- [ ] Type-Examination Certificate current and valid (Pathway A/B with Module B)
- [ ] ITT Test Reports current and complete (Pathway A/B-CPR/B for CPR)
- [ ] ETA current and valid (Pathway B-CPR)
- [ ] GPSR Risk Assessment on file and current (Pathway C)
- [ ] Chemical test reports (REACH suite) within validity (2 years); covers all variants in shipment

**Link 5 Gate:**
- [ ] FRI PASS — AQL 2.5 Major, AQL 4.0 Minor, zero Critical defects
- [ ] Golden sample match confirmed by QC
- [ ] DPI passed (where applicable — first order or critical order)
- [ ] FPC records verified at factory (where AVCP audit required)

**Link 6 Gate:**
- [ ] DoC or DoP on file, correctly drafted, signed, and in correct language(s)
- [ ] GPSR Art. 9 Safety File established and archived (Pathway C)

**Link 7 Gate:**
- [ ] Label compliance confirmed at FRI: CE/mark, EU RP, manufacturer, product ID, batch code
- [ ] Market-specific language requirements verified
- [ ] No prohibited marks applied (e.g., no CE on Pathway C product)

**Additional SRC Conditions by Market:**

| Market | Additional Release Conditions |
|--------|------------------------------|
| EU — HAGEBAU | OEKO-TEX certificate valid + covers all variants in shipment; DOP download QR on carton |
| EU — JUMBO/Coop | Swiss importer ID on label; trilingual DE/FR/IT confirmed |
| EU — ITM | French-language label confirmed; VOC A+ if applicable |
| EU — DEDEMAN | Romanian-language label confirmed |
| Canada | Bilingual EN/FR label confirmed by QC at FRI; CGSB-86.1 care labelling present |
| All EU | PPWR disposal data recorded (packaging weight + material type per SKU) |
| All EU | SVHC declaration received and filed for this shipment |
| All markets | EPR producer registration confirmed for destination country (where required) |

### SRC Document — Mandatory Content

The SRC is a signed document issued by QS (or QC with QS countersignature) confirming:
- P.O. number, supplier, factory, production batch, shipment quantity
- Product description and destination market
- Confirmation of each Link 1–8 gate: PASS / CONDITIONAL / FAIL
- List of all supporting documents by reference number and validity date
- Overall release decision: RELEASED / RELEASED WITH CONDITIONS / HOLD
- QS signature + date

**Gate 8 Go/No-Go:**
- ✅ RELEASED — All 8 gates confirmed PASS; SRC issued; goods may ship
- ⚠️ RELEASED WITH CONDITIONS — Minor open items documented; resolved before vessel departure
- ❌ HOLD — One or more critical gates FAIL; goods must not ship until resolved;
  escalate to QS Manager + Ally notification if delay impacts confirmed sailing window

---

## Output Structure

### Mode 1 — Master Quality Compliance Guideline (MCG) Document

**File name:** `MCG_[Product]_[Department]_[Markets]_v[X.X].docx`
**Example:** `MCG_Bathroom_Towels_DECO_EU_CA_v1.0.docx`

**Sections:**
1. Cover Page — Product, pathway badge, markets, document reference, date
2. Executive Summary — Pathway determination + key implications per market
3. Link 1 — 4-Step Determination (Steps I–IV with decision tables)
4. Link 2 — Pathway Assignment and Directive Stack
5. Link 3 — Module / AVCP System Determination
6. Link 4 — Type-Examination / ITT / Risk Assessment Requirements
7. Link 5 — FPC and Production Control Requirements
8. Link 6 — DoC / DoP / GPSR Safety File Requirements
9. Link 7 — CE Marking / Conformity Mark Requirements
10. Link 8 — SRC Release Conditions and Document Register
11. Complete Document Register (all documents, owners, validity, retention)
12. RACI Matrix (per link: Responsible / Accountable / Consulted / Informed)
13. Regulatory Watch (upcoming changes affecting this category)
14. Companion Skills Reference (which skill to invoke for each link)
15. Change Log versus Source Checklist (when a source checklist was supplied) and revision history
- Flowcharts: Fig. 1 in Executive Summary §1.1, Fig. 2 in Link 5, Fig. 3 in GS section (if GS)
- GS Mark Certification Process section (if GS ordered by an Ally)
- Annex A — Updated inspection checklist · Annex B — Defect classification · Annex C —
  Measurement data sheet · Annex D — PPWR packaging data · Annex E — Regulatory Cross-Check Log
- Bilingual edition file name: `MCG_[Product]_[Department]_[Markets]_EN-VI_v[X.X].docx`

### Mode 2 — P.O. Compliance Gate Verification Report

**File name:** `POCGV_[PO-Number]_[Product]_[Supplier]_[Date].docx`
**Example:** `POCGV_PO-2026-DECO-00142_Towels_SupplierABC_2026-04-12.docx`

**Sections:**
1. Cover Page — P.O. number, supplier, product, destination, shipment date
2. Gate Verification Summary — 8-gate traffic light table (✅ / ⚠️ / ❌)
3. Link-by-Link Gate Detail — each gate with document references and validity dates
4. Open Items Register — conditional items with owner, deadline, resolution status
5. SRC Decision — RELEASED / RELEASED WITH CONDITIONS / HOLD
6. Supporting Document Index — all documents verified, reference numbers, expiry dates
7. QS Signatory Block

---

## RACI Matrix per Compliance Chain Link

| Link | Responsible | Accountable | Consulted | Informed |
|------|-------------|-------------|-----------|----------|
| 1 — 4-Step Determination | QS | QS Manager | Merchandiser, Ally | IQA, PPS-P |
| 2 — Pathway Assignment | QS | QS Manager | Ally (validation) | PPS-P, Supplier |
| 3 — Module / AVCP | QS | QS Manager | NB / TAB (if required) | Supplier, Ally |
| 4 — Type-Exam / ITT | Supplier + NB/Lab | QS | QS | Ally, PPS-P |
| 5 — FPC / Production Control | Supplier (FPC) + QC (inspection) | QS | IQA, 3rd Party | PPS-P, Ally |
| 6 — DoC / DoP | Supplier / Manufacturer | QS | QS (review) | Ally, PPS-L |
| 7 — CE Mark / Marking | Supplier | QC (verify at FRI) | QS | Ally |
| 8 — SRC Release | QS (issue) | QS Manager | QC (FRI input) | PPS-L, Ally, Merchandiser |

---

## Voluntary Marks — GS Mark Process (Germany)

Trigger: Ally order specifying GS (typically HAGEBAU, DE/AT). Add a dedicated MCG section
“GS Mark Certification Process” and a GS flowchart.

| Topic | Content |
|-------|---------|
| Legal basis | Product Safety Act ProdSG (in force 16/07/2021): **§ 20** award (validity ≤ 5 years or limited to a production lot; § 20(2) no GS where CE legislation already provides at least equivalent third-party assessment), **§ 21–22** GS body duties (type test against AfPS specifications, production controls, public certificate list, suspension/withdrawal), **§ 24** manufacturer and importer obligations, GS symbol per ProdSG Annex. Verify § 39 fine provision against official text. |
| GS body | ZLS-recognised and DAkkS-accredited, listed by BAuA (TÜV SÜD, TÜV Rheinland, TÜV NORD, DEKRA, Intertek …); verify ZLS scope covers the product category. |
| Eligibility | Ready-to-use product; Module A / no mandatory third-party type examination → eligible. GS never replaces CE, DoC or technical file. |
| Test basis | Category hENs + **AfPS GS 2019:01 PAK** (mandatory for new GS since 01/07/2020): category 2 (skin contact > 30 s / repeated, e.g. grips) BaP < 0.5 mg/kg, Σ15 PAH < 10 mg/kg; category 3 BaP < 1 mg/kg, Σ15 PAH < 50 mg/kg (confirm category with GS body). German instructions checked. |
| Process (10 steps) | 1 scope (models, Ally brands) → 2 GS body + quotation + written test programme → 3 application by manufacturer (certificate holder, trade-name listing) → 4 technical documents incl. **critical components list** → 5 samples → 6 type test (fail → CAPA → re-test) → 7 initial factory inspection before award (fail → corrective actions) → 8 certificate → 9 GS mark artwork approval → 10 certificate in QC pack, verified online. Indicative 6–10 weeks. |
| Importer duty (§ 24) | Before placing GS-marked goods on the German market the importer verifies a valid certificate and documents date, GS body and certificate number → SRC condition. |
| Maintenance | Annual factory surveillance; follow-up samples; renewal ≥ 3 months before expiry; change of design / component / sub-supplier / factory / standard → notify GS body **before** shipment; suspension → stop marking, HOLD GS lots. |
| Gate | GO: certificate valid for model + Ally brand + factory, surveillance < 12 months, artwork approved, importer record on file. NO-GO: no/expired certificate, factory or model not covered, GS mark without approval (Critical defect at FRI). |

---

## Process Flowcharts (embed in every MCG)

| Figure | Location | Content |
|--------|----------|---------|
| Fig. 1 — 8-link compliance chain | Executive Summary §1.1 | Start → Link 1 → decision “EU arrival ≥ 20/01/2027?” (MD/MR, where machinery) → Links 2–7 → gate “all gates PASS for this P.O.?” → Link 8 SRC; test-fail → CAPA loop; gate-fail → HOLD; side branch to Fig. 3 when GS ordered |
| Fig. 2 — inspection & release | Link 5 section | Sample validation → golden sample → DPI (first/critical order) → FRI (AQL) → document check → SRC; corrective loops at each gate; open items → released with conditions / HOLD |
| Fig. 3 — GS process | GS section (only if GS ordered) | 10 steps with owners; test and factory gates with CAPA loops; change-management gate; maintenance end node |

**Layout rules:** vertical main column; activity = rounded rectangle (light blue, navy border,
numbered badge); gate = diamond (amber); NO-GO / corrective path = red box to the right;
neutral side branch (e.g. GS, DPI) = blue box to the left; start = navy pill; release = green
pill; owner in italics right of each step; legend under the chart; branch labels centred above
the arrow (never overlapping boxes). Keep text short; split lines manually.

**Rendering:**
1. Preferred: mermaid → PNG with `mmdc -i chart.mmd -o chart.png -b white -w 1400 -s 2`.
2. Fallback when `mmdc` is not installed: generate the chart as SVG (programmatic layout) and
   screenshot it with Playwright/Chromium at deviceScaleFactor 2 (`page.setContent(svg)` →
   `locator('svg').screenshot()`); store both SVG and PNG with the deliverable.
3. **Always view the PNG before embedding** and fix overlaps / overflowing text.
4. .docx: `ImageRun` on its own page (page break before), width so height ≤ ≈ 9 in on A4
   (e.g. 450–600 px), caption under the figure. .xlsx: `openpyxl.drawing.image.Image` on a
   dedicated “Workflow” sheet.

---

## Bilingual EN/VI Mode

Use when the user asks for English + Vietnamese (factory and QC teams in Vietnam).

- **Layout:** Vietnamese immediately beneath the English in the same paragraph / table cell
  (line break), italic, blue-grey (e.g. #2F5C85; light tint on navy header cells). Applies to
  cover, headings (also in TOC), paragraphs, bullets, every table cell, gate tables, captions,
  checklist annex and flowchart labels (EN line(s) + VI line(s); bilingual title, branch labels
  “YES / CÓ”, “NO / KHÔNG” and legend).
- **Do not translate:** regulation / standard numbers, clause references, product codes, skill
  names, source citations.
- **Method:** extract every text string from the document generator, translate into a
  key → value glossary (JSON), render through a `tr()` lookup; report any prose string left
  without translation. Reuse and extend the glossary for later revisions and other categories.
- **Core terminology:** DoC → Tuyên bố hợp quy · FPC → Kiểm soát sản xuất tại nhà máy ·
  Rated capacity → Tải định mức · Golden sample → Mẫu chuẩn · Sample validation → Duyệt mẫu ·
  Critical / Major / Minor → Nghiêm trọng / Nặng / Nhẹ · Gate → Cổng · GO / NO-GO → ĐẠT /
  KHÔNG ĐẠT · HOLD → TẠM GIỮ · RELEASED → PHÁT HÀNH · Ally → Đối tác · Supplier → Nhà cung cấp ·
  Technical file → Hồ sơ kỹ thuật · Instructions for use → Hướng dẫn sử dụng · Notified Body → NB
  (Tổ chức được chỉ định) · Harmonised standard → Tiêu chuẩn hài hòa.
- Keep existing Vietnamese defect names from source checklists unchanged.
- State in the reply that the translation needs native-speaker QC review before issue to
  factories (especially legal sections).

---

## Companion Skills Reference — Invocation Map

Invoke the following skills at each link to generate the specific deliverable:

| Link | Deliverable | Companion Skill |
|------|-------------|-----------------|
| 1 — 4-Step Method | Pathway determination + directive stack | `quality-compliance-pathway` |
| 1 — hEN verification | Harmonised standard confirmation | `harmonised-standard-lookup` |
| 2 — Pathway document | Full QCP .docx with all 10 sections | `quality-compliance-pathway` |
| 3 — Module/AVCP | Embedded in QCP and QSD | `quality-compliance-pathway` + `qsd-generator` |
| 4 — Test parameters | Essential characteristics testing matrix | `essential-characteristics-testing` |
| 4 — Risk assessment | GPSR Risk Assessment Excel (Pathway C) | `gpsr-risk-assessment` |
| 4 — Machinery RA | ISO 12100 DFMEA/PFMEA | `fmea-generator` |
| 4 — FMEA | Design/Process FMEA | `fmea-generator` |
| 5 — FPC document | Component taxonomy + production control | `factory-production-control` |
| 5 — FPC components | Component taxonomy + control parameters | `factory-production-control` |
| 5 — Product spec | Production process map + BOM | `product-specification-production-process` |
| 5 — Supplier audit | Factory audit checklist per P.O. | `supplier-production-line-audit` |
| 5 — Supplier scorecard | Standing qualification, rating, decision matrix | `supplier-evaluation-framework` |
| 5 — QC Pack | Pre-FRI inspection pack (CP1–CP10) | `qc-pack-excel-generator` |
| 5 — FRI validation | FRI report validation assessment | `fri-validation` |
| 6 — QSD | Full Quality Single Document | `qsd-generator` |
| 6 — DoC / DoP | CE declaration document | `ce-marking-doc-dop` |
| 6 — TCF | Technical Construction File | `technical-construction-file` |
| 6 — Construction products | CPR pathway + DoP route | `quality-compliance-pathway` |
| 7 — Artwork | L0–L3 label & packaging compliance | `artwork-packaging-compliance-master` |
| 7 — Assembly instructions | Assembly instruction assessment | `assembly-instruction-assessment` |
| 7 — Packaging | Export packaging compliance | `export-packaging-compliance` |
| 8 — QC Pack / SRC | SRC conditions + inspection readiness | `qc-pack-excel-generator` + `fri-validation` |
| ALL — RACI/SIPOC | E2E supply-chain RACI + SIPOC Excel (P1–P7) | `raci-sipoc-matrix` |
| ALL — SOP | Artwork & Packaging SOP (NB/BR, embedded template) | `raci-sipoc-arena-sop-e2e-process` |
| ALL — Alignment | Ecosystem alignment audit | `arena-project-alignment-audit` |
| ALL — Reg. watch | Regulation scope change monitoring | `regulation-scope-monitor` |

---

## Complete Document Register Template

The MCG includes a master document register covering all 8 links:

| # | Document | Link | Legal Basis | Issued By | Validity | Retention | Status |
|---|----------|------|------------|-----------|----------|-----------|--------|
| 1 | Quality Compliance Pathway (QCP) | 1–2 | Internal | QS | On change | 10 yr | |
| 2 | Harmonised Standard Lookup Record | 1–3 | OJEU | QS | On hEN change | 10 yr | |
| 3 | EU Type-Examination Certificate | 3–4 | Directive | Notified Body | 5 yr | 10 yr | |
| 4 | ITT Test Report | 4 | hEN / EAD | NB Lab / Accredited Lab | On change | 10 yr | |
| 5 | European Technical Assessment (ETA) | 4 | CPR | TAB | On change | 10 yr | |
| 6 | GPSR Internal Risk Assessment | 4 | GPSR Art. 6 | QS / Manufacturer | On change | 10 yr | |
| 7 | Chemical Test Reports (REACH suite) | 4 | REACH | Accredited Lab | 2 yr | 10 yr | |
| 8 | OEKO-TEX / Voluntary Cert | 4 | Retailer req. | Certification Body | 1 yr | 10 yr | |
| 9 | Factory Production Control Plan | 5 | Directive / CPR | Supplier | On change | 10 yr | |
| 10 | FPC NB Surveillance Audit Report | 5 | AVCP 1+/1/2+ | Notified Body | Annual | 10 yr | |
| 11 | Supplier Production Line Audit | 5 | A.R.E.N.A. | QS / IQA / 3rd Party | Per audit | 5 yr | |
| 12 | Quality Single Document (QSD) | 5–6 | A.R.E.N.A. | QS | On change | 10 yr | |
| 13 | Product Specification + Process Map | 5 | A.R.E.N.A. | QS | On change | 10 yr | |
| 14 | DFMEA / PFMEA | 5 | A.R.E.N.A. | QS | On change | 10 yr | |
| 15 | DPI / ILI Inspection Report | 5 | A.R.E.N.A. | QC / 3rd Party | Per order | 5 yr | |
| 16 | FRI Inspection Report | 5, 8 | A.R.E.N.A. | QC / 3rd Party | Per shipment | 5 yr | |
| 17 | Golden Sample Record | 5 | A.R.E.N.A. | QS | Per order | 5 yr | |
| 18 | Declaration of Conformity (DoC) | 6 | Directive | Manufacturer | On change | 10 yr | |
| 19 | Declaration of Performance (DoP) | 6 | CPR | Manufacturer | On change | 10 yr | |
| 20 | GPSR Art. 9 Product Safety File | 6 | GPSR Art. 9 | QS / EU RP | Ongoing | 10 yr | |
| 21 | Technical Construction File (TCF) | 6 | Directive | Manufacturer | 10 yr | 10 yr | |
| 22 | EU Responsible Person Designation | 6–7 | GPSR Art. 4/16 | EU RP | On change | 10 yr | |
| 23 | Artwork / Label Approval Record | 7 | GPSR / Directive | QS | Per revision | 5 yr | |
| 24 | Assembly Instruction Assessment | 7 | EN 82079-1 | QS | Per revision | 5 yr | |
| 25 | Export Packaging Compliance | 7 | PPWR / ISPM 15 | QS | Per change | 5 yr | |
| 26 | SVHC Declaration | ALL | REACH Art. 33 | Supplier | Per shipment | 10 yr | |
| 27 | PPWR Disposal Data Record | ALL | PPWR | QS / Merch. | Per shipment | 5 yr | |
| 28 | Shipment Release Certificate (SRC) | 8 | A.R.E.N.A. | QS | Per shipment | 5 yr | |

---

## Key Principles

1. **The chain is sequential and non-skippable.** Every link depends on the successful
   completion of the prior link. Link 6 (DoC/DoP) cannot be valid if Link 4 (type-exam/ITT)
   is expired or incomplete. Link 8 (SRC) cannot be issued if any upstream gate has failed.

2. **Category-level MCG governs all P.O.s.** The MCG is produced once per product
   category and remains the permanent reference. The P.O. Gate Verification Report
   maps each shipment against the MCG requirements — it does not re-derive the pathway
   or module each time.

3. **Gateway logic — not process logic.** Each link is a gate with a Go/No-Go
   decision. The compliance chain does not simply accumulate documents — it verifies
   that each link output is current, complete, and correctly matched to the specific
   product and market.

4. **Pathway C is not simpler — it is differently structured.** Pathway C products
   skip Links 3, 4 (type-exam/ITT), 6 (DoC/DoP), and 7 (CE mark) but replace them
   with a mandatory GPSR risk assessment (Link 4 equivalent) and mandatory GPSR Art. 9
   safety file (Link 6 equivalent). The SRC release conditions are equally demanding.

5. **P.O.-level verification is not a repeat of category-level classification.**
   At P.O. level the pathway is already known from the MCG. The verification confirms
   that: certificates have not expired, test reports cover the specific variants in the
   P.O., the label artwork matches the approved version, the FRI was passed, and all
   market-specific release conditions are met.

6. **Change management is the highest-risk moment.** Any change in product design,
   materials, production site, or supplier resets the chain from the point of change.
   Link 4 (type-exam/ITT) must be reassessed. Links 5–8 must be reissued. The QSD
   and QCP must be revised. The SRC cannot be issued for a changed product using
   legacy documents.

7. **Regulation-anchored throughout.** Every requirement in the chain cites a specific
   regulation, directive, standard, or contractual obligation. "Best practice" alone
   is never a sufficient basis for a compliance gate decision.

7a. **Current law only.** Every run starts with the Step 0 cross-check; repealed acts and
    withdrawn standard editions are corrected, logged and never cited as applicable.

8. **The SRC is the accountability anchor.** The SRC signatory confirms personal
   accountability that all 8 links have been verified for the specific shipment.
   It is not a rubber stamp — it is the compliance chain's legal closure document
   per A.R.E.N.A.'s quality management system.

9. **Companion skills are the execution layer.** This master skill defines the
   what and when. Each companion skill defines the how. Never generate a deliverable
   for a specific link without reading the relevant companion skill first.

10. **Accumulation by design.** As new product categories are processed through
    the 8-link chain for the first time, their unique configuration (pathway + module
    + ITT scope + overlays + market requirements) is encoded into the category-level
    MCG and feeds the QSD and QCP skill reference databases. This accumulation is
    not repetition — it is the systematic encoding of institutional compliance knowledge.

---

## Encoded Category Configurations

### Manual Hand Pallet Truck — reference MCG-DIY-HT-PT-001 (v1.0–v1.4, 14/10/2026)

| Element | Configuration |
|---------|---------------|
| Taxonomy | DIY › Hand Tools (QSD) › Storage / Moving (QCP) |
| Pathway / module | A (CE) · MD 2006/42/EC Annex VIII → MR (EU) 2023/1230 Module A (Annex VI) from 20/01/2027 · no NB |
| hENs | EN ISO 3691-5:2015 + AC:2016 + A1:2020 · EN 16307-5 (:2013 last OJ-cited — verify; test reports to :2023) · EN ISO 12100:2010 (verify MR citation) |
| Type tests | Static 1.5×Q, dynamic 1.1×Q, overload device (< 115 % max working pressure), stability, controlled lowering, load holding, tiller grips (Ø 25–35 mm, span ≥ 120 mm), crushing gaps (EN ISO 13854), edges, parking brake, coating (ISO 2409 / 9227 / 2808), PAH/phthalates/SCCP/SVHC, packaging heavy metals |
| Overlays | REACH Art. 33, Annex XVII 50/51 (grips/wheels) · POPs SCCP 0.15 % · PPWR · ISPM 15 pallets · CBAM: CN 8427 out of scope (watch 2028 downstream extension) |
| FPC CCPs | Weld inspection, 100 % pump pressure/leak + overload valve seal, 100 % end-of-line load test, fasteners/circlips, DFT, data plate |
| Marking | CE, manufacturer + importer, designation, serial, year, rated capacity at load centre, unladen mass, warnings; paper manual in Ally languages |
| Inspection | SV 1 pc incl. static test; DPI first order; FRI GI-II Cr 0 / Ma 2.5 / Mi 4.0, functional S-3 |
| GS | Optional (HAGEBAU): GS body test + AfPS PAK cat. 2 grip / cat. 3 wheels, factory inspection, § 24 importer record |
| Measurement legend | VDI 2198 symbols (Q, c, h3, h13, h14, l1/l2, b1/b5, s/e/l, D1/D2) |

---

## Product Category Master Reference

> **Source**: A.R.E.N.A. Vietnam canonical product taxonomy (Product_Category.xlsx).
> Use the hierarchy to confirm the correct Product Family and sub-families for QSD/QCP assignment.
> **This skill operates at: Product Family level (Category Mode) → Product Sub-Family level (P.O. Mode)**
> **QSD = Product Family level** | **QCP = Product Sub-Family level**

```
Department  →  Product Family          →  Product Sub-Family
(context)      (QSD level)                 (QCP level)
```

#### AUTO (code: AUTO)

**Automotive** (QSD) → sub-families: Automotive personal protection · Bikes & Bicycle accessories · Car Batteries · Car Bulbs · Car Wiper · Car mats · Jack stand and trolley jack · Lubricants · Other car accessories · Windshield Washer Fluid (Lave Glace)

#### BUILD (code: BUILDING)

**Construction** (QSD) → sub-families: Bricks, Cinder Blocks · Building aggregate · Cement fencing · Concrete Glue / Binding Powder · Concrete Mixers & masonry & Wheelbarrows · Crackfiller · Custom cut isolation · Glass · Glass block · Insulation · Mortar & Concrete · Other construction · Plaster board and tiles · Powder Base Glue · Rebar · Roof covering · Sanitation and piping · Shingles & access. · Stone / Granit · Tiles glue · Timber

**Joinery** (QSD) → sub-families: Ceiling windows · Edge bands · Metal Doors & frames · Metal gate · Plastic lattice · Plastic lattice paneling · Spare parts Outdoor woodwork · Treatment · Windows · Wooden Doors & frames · Wooden gate · indoor woodwork · outdoor woodwork

**Ladder** (QSD) → sub-families: Folding staircases · Ladders & Step Ladders · Other ladder · Scafolding

**Lumber** (QSD) → sub-families: Custom cut lattice · Floor Slabs · Moulds · Other wooden pannels · Outdoor timber · Plywood · Saw Horses Wood/Metal · Staircases

#### DECO & ARRANGMENT (code: DECO)

**Creative arts** (QSD) → sub-families: Creative arts

**Decoration access.** (QSD) → sub-families: Blinds & curtains · Curtain rods & accessories · Decoration wood & accessories · Handles · Indoor cushions · Mirrors, picture frames · Other decoration accessories

**Exterior paint** (QSD) → sub-families: Paint Facade

**Floor & Wall Covering** (QSD) → sub-families: Bar threshold · Baseboard · Carpet and rug · Ceramic tiles wall and floor · Hardwood Flooring · Interior wood · Laminated Flooring · Other wall and floor covering · Vinyl

**Household** (QSD) → sub-families: Brooms & brushes · Doormat · Drying Rack & Ironing Board (Séchoir et Table à repasser · Garbage bags (Sacs poubelle) · Indoor candles · Moving boxes (Carton de déménagement) · Other household

**Indoor furniture** (QSD) → sub-families: Closet Door, Arrangements & Wardrobe · Counter Tops · Furniture · Kitchen and bathroom furniture · Melamine Boards (Tablettes Mélaminées) · Metal Shelves · Other storage · Plastics Shelves (Etagères Plastiques) · Woodden shelves

**Interior paint** (QSD) → sub-families: Other Paint · Paint All in one · Paint PL Interior · Paint PL White · Paint Underlay · Paint Wood and ground

**Lighting** (QSD) → sub-families: Indoor lighting · Light bulbs · Lighting Fixctures · Outdoor light

**Material Treatment** (QSD) → sub-families: Cleaning and care product · Glue · Glue Support preparations · PU Foam and silicon · Tape · Wood protection & Finishing

**Paint Accessories** (QSD) → sub-families: Colorant · Other paint accessories · Paint brushes & rollers · Spray paint · Tint machine · Wallpaper table

**Sanitary** (QSD) → sub-families: Bathroom and toilet accessories · Faucets & taps · Garborator/griding · Kitchen Sinks · Kitchen accessories · Shower · Shower enclosure and cabin · Sinks, basin, bath tube, toilet block · Spare parts sanitary

**Specific paint** (QSD) → sub-families: Paint Iron&Metal Underlay

#### DIY (code: DIY)

**Cooling** (QSD) → sub-families: Air conditioner · Ceiling fan · Fan · Humidifier / dehumidifier · Other cooling & ventilation · Spare parts cooling

**Electricity** (QSD) → sub-families: Alarm & Home automation · Batteries & accessories · Cable Reels / Cords / Socket Sets · Cable and winding · Camping lights, flash lights · Electrical Conduits (Gaines) · Electrical modular equipement · Other electricity · Switch and socket · Video, Audio, & telephone accessories

**Hand Tools** (QSD) → sub-families: Caulking tools · Clamps · Hammer · Masonry tools · Measuring · Other hand tool · Personal protection · Pliers · Plumbing tools · Saws · Screwdriver & bit boxes · Staplers staples · Storage / Moving · Tiling tools · Wrenches & keys

**Hardware** (QSD) → sub-families: Anchors/Plugs · Builder hardware · Cellar Items · Chain & Ropes · Fixing hardware (screws, nails, nuts…) · Locks & padlocks · Lumber Connecters (Connecteurs) · Mails boxes · Metal storage · Other hardware · Profil system(Systeme Profilé) · Safe · Security signs · Wheels & Castors (Roues Et Roulettes)

**Heating** (QSD) → sub-families: Boilers (Gas&Electric) · Combustibles · Convector and radiators · Cooker hood · Fan heater · Fire place · Fire place accessories · Gaz patio heater · Isolation · Oil filled radiator · Other heaters · Pellet (Pellet) · Radiating panel · Smoke pipes · Steel & Aluminium Heaters · Stoves (Wood, Gaz, Fuel, pellet, …)

**Plumbing** (QSD) → sub-families: Construction Faucets · Copper&brass · Gas fittings · PVC & PE Fittings · Sanitary piping, mecanism & waist · Sleeves & Piping Fixtures · Various Plumbing Accessories (Washing…) · Water Heaters · Water treatment

**Power tools** (QSD) → sub-families: Abrasive · Air powered tool · Angle grinder, router · Battery Angle grinder, router · Battery Pneumatic rotary hammer · Compressor and accessories · Cord drill & impact drill · Cordless drill, cordless tools · Drill bits · Generator · Guns (Glue, hot air, staples …) · High pressure cleaner · One battery · Other power tool · Pneumatic rotary hammer · Power tool accessories · Sander (finishing, belt, delta ..), planer · Saws (jig, Mitre circular) and tile cuter · Spare parts power tool · Stationary power tool (Table saw, bench drill, bench grinder) · Vaccum cleaner (wet & dry) · Welding tools and access.

#### GARDEN (code: GARDEN)

**Barbecue** (QSD) → sub-families: BBQ accessories · Charcoal BBQ · Electrical BBQ · Gas BBQ · Stone / cement BBQ

**Camping** (QSD) → sub-families: Camping

**Garden Equipment** (QSD) → sub-families: Anti-pest · Composter · Fences & accessories · Fencing · Garden hand tools · Garden personal protection · Green houses · Hatchet & Axes · Heavy garden hand tool · Horticultural products · Other garden equipment · Plants protection · Pole anchors · Sprayers · Tarpaulins · Watering Accessories & connectors · Watering hoses

**Garden decoration** (QSD) → sub-families: Arrangements / accessories water treated · Composite wood · Garden Plastic shed · Garden tile · Metal garden sheds · Other garden decoration · Other wood · Outdoor candles and torch · Ponds · Pots, support and accessories plastic · Stone Furniture · Synthetic grass · Terracota and glazed Pots & supports · Treated wood · Wooden pots & accessories · Wooden sheds and carport

**Gardend Power tools** (QSD) → sub-families: Cordless garden power tool · Electrical Garden power tool · Garden power tool accessories · Gasoline garden power tool · Spare parts garden power tool · Water pumps

**Gifts - Flowers** (QSD) → sub-families: Gifts - Artificial Flowers

**Outdoor Furniture** (QSD) → sub-families: Metal outdoor furniture · Other outdoor furniture · Outdoor cushions · Resin Outdoor Furniture · Spare parts outdoor furniture · Wicker outdoor furniture · Wooden outdoor furniture

**Pet** (QSD) → sub-families: Live animals · Pet food · Pet items

**Phytosanitary & fertilizers** (QSD) → sub-families: Fertilizer · Soil

**Plants** (QSD) → sub-families: Plants

**Playset & recreation** (QSD) → sub-families: Outdoor game

**Pools** (QSD) → sub-families: Electrical pools accessories · Non electrical pool accessories · Pools · Spare parts pools

**Sun protection** (QSD) → sub-families: Awning · Gazebo · Umbrella · other sun protection · spare parts sun protection

**Xmas decorations** (QSD) → sub-families: Battery operated moving characters, train · Indoor Electrical X'mas decoration · Non elec. Xmas deco · Outdoor Electrical Xmas decoration

