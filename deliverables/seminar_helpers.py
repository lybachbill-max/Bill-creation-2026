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

