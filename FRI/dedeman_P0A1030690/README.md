# DEDEMAN Greece – P.O. P0A1030690 (Gripwell Forgings & Tools, HOLZER) – FRI templates V1

EU market (POD Thessaloniki), GPSR only – NO CE. DEDEMAN (HOLZER own brand) = GPSR manufacturer, Gripwell = producer.
AQL Cri 0 / Ma 1.5 / Mi 4.0. Status **Incomplete / DRAFT** until QS fills `*` / drawing values and releases.

| Group | Template | SKUs |
|---|---|---|
| A | `output/FRI_template_A_Vices_Anvil_DEDEMAN_P0A1030690_(V1).docx` (ARENA-FRI-STD-VCE-V1) | 10 |
| B | `output/FRI_template_B_Spanners_Wrenches_DEDEMAN_P0A1030690_(V1).docx` (ARENA-FRI-STD-SPN-V1) | 48 |
| C | `output/FRI_template_C_Oil_can_Grease_gun_DEDEMAN_P0A1030690_(V1).docx` (ARENA-FRI-STD-LUB-V1) | 2 |

Rebuild (from `src/`):
```
pip install python-docx matplotlib pillow
python3 figures_dd.py ../build
python3 ../../common/fri_builder.py "../build/<name>.docx" ../build content_vce .   # or content_spn / content_lub
```
`src/po_skus.json` + `src/img/` = SKU data and pictures extracted from the P.O. workbook (no prices).
