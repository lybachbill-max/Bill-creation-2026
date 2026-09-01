# CBAM Communication Console

A single-page reference and working app for filling out the EU CBAM (Carbon
Border Adjustment Mechanism) Communication Template v2.1.1, built for
A.R.E.N.A. Vietnam and its ally suppliers.

It is a static, dependency-free HTML/CSS/JS app — all data ships inline in
`index.html`, so it runs by simply opening the file in a browser, no build
step required.

## Features

- **Scope check** — type a finished good's 8-digit CN code and check it
  against the 569 Annex I codes read from the template's own
  `Parameters_CNCodes` sheet, with the matching goods category.
- **Cell guideline** — a searchable, filterable row-by-row map of every
  workbook cell (sheet, cell reference, field, mandatory/optional/
  calculated/conditional, input type, current value, and how the number was
  collected).
- **SEE ledger** — an editable ledger of production output, electricity,
  fuel and precursor inputs that recalculates direct/indirect/total specific
  embedded emissions (SEE) live, with a sanity-check gauge and control
  totals.
- **Gap register** — open data gaps per supplier case, tagged by severity
  and owner.
- **Corrections** — a table of places where an older step-by-step guide
  pointed at the wrong cell, verified against the live v2.1.1 workbook.
- **Case switcher** — toggle between supplier cases (default vs. actual
  figures) to see how the same cells and calculations change.
- **Exports** — download the cell map as CSV or the full data pack (inputs,
  results, cell values, gaps) as JSON, or print the page.

## Running locally

Just open `index.html` in a browser, or serve it:

```
npm run dev
```

then visit the printed local URL.
