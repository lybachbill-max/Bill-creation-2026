# ARENA FRI Standard – Sack truck (non-powered), EU – ARENA-FRI-STD-TRO-V1

Status: **Incomplete / DRAFT** – 19 mandatory rows "QS to fill" (ARENA `*` proposals, drawing values). Only QS sets Released.

- `output/FRI_template_Sack_truck_EU_(V1).docx` – FRI form (10-point skeleton, dropdowns, checkboxes) + bilingual guideline A–G
- `output/fig*.png` – original schematics embedded in the form

Rebuild:
```
pip install python-docx openpyxl matplotlib
cd src && python3 figures_tro.py ../build && python3 build_docx.py "../build/FRI_template_Sack_truck_EU_(V1).docx" ../build
```
Content lives in `src/content_tro.py` (single content source).
