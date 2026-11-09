// Builds the bilingual EUDR & CBAM training deck (.pptx) in the ARENA brand palette.
// NOTE: ARENA_MASTER_TEMPLATE.pptx was not available in the skill folder; this deck applies
// the brand palette and Arial rules with pptxgenjs instead of duplicating template slides.
const path = require('path');
const PptxGenJS = require('pptxgenjs');
const C = require('./content');

const NAVY = '151F37', CORAL = 'DC5733', CORAL_D = 'C24A28', BLUE = '006293', WHITE = 'FFFFFF';
const TINT = 'E6EFF4', NAVY_T = '2B3550', GREY = '5A6270', LINE = 'B8C4CC';
const F = 'Arial', FN = 'Arial Narrow';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in
pptx.title = `${C.META.docId} — ${C.META.title.en}`;
const W = 13.33;

// ---------- helpers
function frame(slide, n, title, sub) {
  slide.background = { color: WHITE };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.12, fill: { color: NAVY }, line: { color: NAVY } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.28, w: 1.1, h: 0.05, fill: { color: CORAL }, line: { color: CORAL } });
  slide.addText(title, { x: 0.5, y: 0.3, w: 12.3, h: 0.6, fontFace: F, fontSize: 26, bold: true, color: NAVY, margin: 0 });
  slide.addText(sub, { x: 0.5, y: 0.86, w: 12.3, h: 0.36, fontFace: F, fontSize: 15, italic: true, color: BLUE, margin: 0 });
  slide.addText([
    { text: 'a.r.e.n.a.', options: { bold: true, color: CORAL } },
    { text: `  ·  ${C.META.docId} · ${C.META.rev}  ·  ${n}`, options: { color: GREY } },
  ], { x: 0.5, y: 7.05, w: 12.3, h: 0.3, fontFace: F, fontSize: 9, margin: 0 });
}

// bilingual runs for a text box: EN line then VN line (italic)
function biRuns(items, o = {}) {
  const runs = [];
  items.forEach((it, i) => {
    runs.push({ text: it.en, options: { fontSize: o.en || 14, color: o.color || NAVY, bold: !!o.bold, bullet: o.bullet ? { indent: 16 } : false, breakLine: true, paraSpaceBefore: i === 0 ? 0 : (o.gap ?? 8) } });
    runs.push({ text: it.vn, options: { fontSize: o.vn || 11.5, color: o.vnColor || GREY, italic: true, bullet: false, indentLevel: o.bullet ? 1 : 0, breakLine: i < items.length - 1 } });
  });
  return runs;
}

function cell(v, header, zebra, o = {}) {
  const fill = header ? NAVY : zebra ? TINT : WHITE;
  if (v && typeof v === 'object' && 'en' in v) {
    return {
      text: [
        { text: v.en, options: { fontSize: o.en || 11, bold: header || o.boldEn, color: header ? WHITE : (o.color || NAVY), breakLine: true } },
        { text: v.vn, options: { fontSize: o.vn || 9, italic: true, color: header ? 'C9D5DD' : GREY } },
      ],
      options: { fill: { color: fill }, valign: 'top' },
    };
  }
  return { text: String(v), options: { fontSize: o.en || 11, bold: header || o.boldEn, color: header ? WHITE : NAVY, fill: { color: fill }, valign: 'top' } };
}
const hdr = (en, vn) => ({ en, vn });

function table(slide, headers, rows, colW, y, o = {}) {
  const data = [headers.map((h) => cell(h, true)), ...rows.map((r, i) => r.map((v, j) => cell(v, false, i % 2 === 1, { ...o, boldEn: j === 0 && o.boldFirst })))];
  slide.addTable(data, { x: 0.5, y, w: colW.reduce((a, b) => a + b, 0), colW, fontFace: F, border: { type: 'solid', pt: 0.5, color: LINE }, margin: [3, 5, 3, 5], autoPage: false });
}

function callout(slide, item, y, h = 0.85, color = CORAL_D) {
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y, w: 12.33, h, fill: { color }, line: { color } });
  slide.addText(biRuns([item], { en: 16, vn: 12.5, bold: true, color: WHITE, vnColor: 'F6DED6' }), { x: 0.7, y, w: 12, h, fontFace: F, valign: 'middle', margin: 0 });
}

let n = 0;
const next = () => { n += 1; return pptx.addSlide(); };

// ---------- 1. Title
{
  const s = next();
  s.background = { color: NAVY };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: CORAL }, line: { color: CORAL } });
  s.addText('A.R.E.N.A. VIETNAM · QUALITY & COMPLIANCE', { x: 0.9, y: 1.2, w: 11, h: 0.4, fontFace: F, fontSize: 14, bold: true, color: CORAL, charSpacing: 2, margin: 0 });
  s.addText(C.META.title.en, { x: 0.9, y: 1.85, w: 11.5, h: 1.0, fontFace: F, fontSize: 44, bold: true, color: WHITE, margin: 0 });
  s.addText(C.META.title.vn, { x: 0.9, y: 2.85, w: 11.5, h: 0.6, fontFace: F, fontSize: 26, color: '7FB6D1', margin: 0 });
  s.addShape(pptx.ShapeType.rect, { x: 0.9, y: 3.75, w: 1.4, h: 0.06, fill: { color: CORAL }, line: { color: CORAL } });
  s.addText(biRuns([C.META.subtitle], { en: 18, vn: 14, color: WHITE, vnColor: 'AEB8C8' }), { x: 0.9, y: 4.0, w: 11.5, h: 1.0, fontFace: F, margin: 0 });
  s.addText(`${C.META.docId} · ${C.META.rev} · ${C.META.date} · Owner: ${C.META.owner}`, { x: 0.9, y: 6.4, w: 11.5, h: 0.4, fontFace: F, fontSize: 12, color: 'AEB8C8', margin: 0 });
}

// ---------- 2. What changed / status basis
{
  const s = next();
  frame(s, n, 'What changed since the skill snapshots', 'Những thay đổi so với bản skill cũ');
  const cards = [
    [hdr('EUDR Annex I', 'Phụ lục I EUDR'), hdr('Delegated Reg. (EU) 2026/2102 applies from 18 Sep 2026: cattle leather out, rubber narrowed to Hevea.', 'QĐ ủy quyền (EU) 2026/2102 áp dụng từ 18/9/2026: da bò bị loại, cao su chỉ còn Hevea.')],
    [hdr('EUDR dates', 'Mốc EUDR'), hdr('30 Dec 2026 large/medium · 30 Jun 2027 micro/small. Review COM(2026) 191: no new delay.', '30/12/2026 lớn/vừa · 30/6/2027 siêu nhỏ/nhỏ. Rà soát COM(2026) 191: không hoãn thêm.')],
    [hdr('CBAM threshold', 'Ngưỡng CBAM'), hdr('50 t per importer per year (Reg. 2025/2083) — not €2,500 per consignment.', '50 tấn/nhà nhập khẩu/năm (QĐ 2025/2083) — không phải 2.500 €/lô.')],
    [hdr('CBAM deadlines', 'Hạn CBAM'), hdr('Certificates on sale 1 Feb 2027 · first declaration 30 Sep 2027 (not 31 May).', 'Bán chứng chỉ từ 1/2/2027 · khai báo đầu tiên 30/9/2027 (không phải 31/5).')],
  ];
  cards.forEach(([h, t], i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pptx.ShapeType.rect, { x, y: 1.6, w: 2.95, h: 3.3, fill: { color: TINT }, line: { color: TINT } });
    s.addShape(pptx.ShapeType.rect, { x, y: 1.6, w: 2.95, h: 0.07, fill: { color: i < 2 ? BLUE : CORAL }, line: { color: i < 2 ? BLUE : CORAL } });
    s.addText(biRuns([h], { en: 16, vn: 12, bold: true, color: NAVY }), { x: x + 0.15, y: 1.8, w: 2.65, h: 0.8, fontFace: F, valign: 'top', margin: 0 });
    s.addText(biRuns([t], { en: 13, vn: 11 }), { x: x + 0.15, y: 2.65, w: 2.65, h: 2.15, fontFace: F, valign: 'top', margin: 0 });
  });
  s.addText(biRuns(C.META.statusBasis.slice(0, 2), { en: 11, vn: 9.5, gap: 4 }), { x: 0.5, y: 5.1, w: 12.33, h: 1.8, fontFace: F, valign: 'top', margin: 0 });
}

// ---------- 3. Position
{
  const s = next();
  frame(s, n, 'A.R.E.N.A. role: supporting sourcing office', 'Vai trò của A.R.E.N.A.: văn phòng tìm nguồn hàng hỗ trợ');
  s.addText(biRuns(C.POSITION.slice(0, 3), { en: 15, vn: 12, bullet: true, gap: 10 }), { x: 0.5, y: 1.55, w: 12.33, h: 3.3, fontFace: F, valign: 'top', margin: 0 });
  callout(s, hdr('Supporting office.   EUDR — no regulatory role.   CBAM — drafts only, on written Ally request, case by case.', 'Văn phòng hỗ trợ.   EUDR — không có vai trò pháp lý.   CBAM — chỉ soạn dự thảo, khi Ally yêu cầu bằng văn bản, từng trường hợp.'), 5.0, 1.0);
  s.addText(biRuns([hdr('Basis: ARENA Rulebook rev. c2, §2 — regulatory roles unchanged; "supporting" describes the overall function only.', 'Cơ sở: ARENA Rulebook rev. c2, §2 — vai trò pháp lý không đổi; "hỗ trợ" chỉ mô tả chức năng chung.')], { en: 11, vn: 9.5 }), { x: 0.5, y: 6.2, w: 12.33, h: 0.7, fontFace: F, margin: 0 });
}

// ---------- 4. Role matrix
{
  const s = next();
  frame(s, n, 'Who does what', 'Ai làm gì');
  table(s, [hdr('Regime', 'Quy định'), hdr('A.R.E.N.A. (supporting)', 'A.R.E.N.A. (hỗ trợ)'), hdr('Supplier', 'Nhà cung cấp'), hdr('Ally / importer', 'Ally / nhà nhập khẩu')], C.ROLE_MATRIX, [1.9, 3.45, 3.49, 3.49], 1.55, { en: 12, vn: 10, boldFirst: true });
  s.addText(biRuns([C.ROLE_NOTE], { en: 10, vn: 9 }), { x: 0.5, y: 6.45, w: 12.33, h: 0.5, fontFace: F, margin: 0 });
}

// ---------- 5. EUDR status
{
  const s = next();
  frame(s, n, 'EUDR — regulatory status', 'EUDR — tình trạng pháp lý (kiểm tra 9/11/2026)');
  table(s, [hdr('Item', 'Mục'), hdr('Status', 'Tình trạng'), hdr('Source', 'Nguồn')], C.EUDR_STATUS, [3.0, 6.83, 2.5], 1.55, { en: 12.5, vn: 10.5, boldFirst: true });
}

// ---------- 6. EUDR scope
{
  const s = next();
  frame(s, n, 'EUDR — what is in scope now', 'EUDR — phạm vi hiện tại sau (EU) 2026/2102');
  table(s, [hdr('Commodity', 'Hàng hóa'), hdr('Typical items', 'Mặt hàng điển hình'), hdr('2026/2102 effect', 'Ảnh hưởng của 2026/2102')], C.EUDR_COMMODITIES, [2.2, 4.4, 5.73], 1.55, { en: 11.5, vn: 9.5, boldFirst: true });
}

// ---------- 7. EUDR duties vs ARENA rules
{
  const s = next();
  frame(s, n, 'EUDR — Operator duties vs A.R.E.N.A. rules', 'EUDR — nghĩa vụ Operator và quy tắc A.R.E.N.A.');
  const col = (x, w, color, title, items) => {
    s.addShape(pptx.ShapeType.rect, { x, y: 1.55, w, h: 0.55, fill: { color }, line: { color } });
    s.addText(biRuns([title], { en: 14, vn: 11, bold: true, color: WHITE, vnColor: 'E3E9EE' }), { x: x + 0.15, y: 1.55, w: w - 0.3, h: 0.55, fontFace: F, valign: 'middle', margin: 0 });
    s.addText(biRuns(items, { en: 11.5, vn: 9.5, bullet: true, gap: 6 }), { x, y: 2.2, w, h: 4.7, fontFace: F, valign: 'top', margin: 2 });
  };
  col(0.5, 6.0, BLUE, hdr('Operator (Supplier or Ally)', 'Operator (Nhà cung cấp hoặc Ally)'), C.EUDR_OPERATOR_DUTIES);
  col(6.83, 6.0, CORAL_D, hdr('A.R.E.N.A. staff — boundaries', 'Nhân viên A.R.E.N.A. — giới hạn'), C.EUDR_ARENA_RULES);
}

// ---------- 8. CBAM status
{
  const s = next();
  frame(s, n, 'CBAM — regulatory status', 'CBAM — tình trạng pháp lý (kiểm tra 9/11/2026)');
  table(s, [hdr('Item', 'Mục'), hdr('Status', 'Tình trạng'), hdr('Source', 'Nguồn')], C.CBAM_STATUS, [2.6, 7.43, 2.3], 1.5, { en: 11, vn: 9, boldFirst: true });
}

// ---------- 9. CBAM CN scope
{
  const s = next();
  frame(s, n, 'CBAM — CN scope for our families', 'CBAM — phạm vi mã CN cho nhóm hàng của chúng ta');
  table(s, [hdr('CN', 'CN'), hdr('Description', 'Mô tả'), hdr('Annex I', 'Phụ lục I'), hdr('Department / note', 'Ngành hàng / ghi chú')], C.CBAM_CN, [2.3, 5.0, 1.3, 3.73], 1.5, { en: 11.5, vn: 9.5, boldFirst: true });
  s.addText(biRuns([hdr('The CN code of the finished imported good decides — never the raw material. Checked against the 569 codes of Communication Template v2.1.1.', 'Mã CN của thành phẩm nhập khẩu quyết định — không phải nguyên liệu. Đã đối chiếu 569 mã của Mẫu trao đổi thông tin v2.1.1.')], { en: 10, vn: 8.5 }), { x: 0.5, y: 6.45, w: 12.33, h: 0.5, fontFace: F, margin: 0 });
}

// ---------- 10. CBAM markets + declarant duties
{
  const s = next();
  frame(s, n, 'CBAM — markets and the declarant', 'CBAM — thị trường và người khai');
  table(s, [hdr('Market', 'Thị trường'), hdr('CBAM position', 'Vị trí CBAM')], C.CBAM_MARKETS, [1.9, 4.4], 1.55, { en: 11.5, vn: 9.5, boldFirst: true });
  s.addShape(pptx.ShapeType.rect, { x: 7.1, y: 1.55, w: 5.73, h: 0.55, fill: { color: BLUE }, line: { color: BLUE } });
  s.addText(biRuns([hdr('Ally-side duties (declarant / UK importer)', 'Nghĩa vụ phía Ally (người khai / nhà nhập khẩu Anh)')], { en: 13, vn: 10.5, bold: true, color: WHITE, vnColor: 'E3E9EE' }), { x: 7.25, y: 1.55, w: 5.5, h: 0.55, fontFace: F, valign: 'middle', margin: 0 });
  s.addText(biRuns(C.CBAM_DECLARANT_DUTIES, { en: 11, vn: 9, bullet: true, gap: 6 }), { x: 7.1, y: 2.2, w: 5.73, h: 4.6, fontFace: F, valign: 'top', margin: 2 });
}

// ---------- 11. CBAM procedure (process flow)
{
  const s = next();
  frame(s, n, 'CBAM — A.R.E.N.A. procedure on written Ally request', 'CBAM — quy trình A.R.E.N.A. khi Ally yêu cầu bằng văn bản');
  const steps = C.CBAM_WORKFLOW;
  const bw = 1.7, gapX = 0.072;
  steps.forEach((r, i) => {
    const x = 0.5 + i * (bw + gapX);
    const color = i === 0 || i === steps.length - 1 ? CORAL_D : i % 2 ? BLUE : NAVY_T;
    s.addShape(pptx.ShapeType.chevron, { x, y: 1.6, w: bw, h: 0.75, fill: { color }, line: { color } });
    s.addText(biRuns([r[0]], { en: 12, vn: 9.5, bold: true, color: WHITE, vnColor: 'E3E9EE' }), { x: x + 0.25, y: 1.6, w: bw - 0.4, h: 0.75, fontFace: FN, valign: 'middle', align: 'center', margin: 0 });
    s.addShape(pptx.ShapeType.rect, { x, y: 2.5, w: bw, h: 3.75, fill: { color: i % 2 ? WHITE : TINT }, line: { color: LINE, width: 0.5 } });
    s.addText(biRuns([r[1]], { en: 9.5, vn: 8 }), { x: x + 0.06, y: 2.55, w: bw - 0.12, h: 2.95, fontFace: F, valign: 'top', margin: 0 });
    s.addText([
      { text: r[2].en, options: { bold: true, color: BLUE, fontSize: 9, breakLine: true } },
      { text: r[3].en, options: { color: GREY, fontSize: 8.5 } },
    ], { x: x + 0.06, y: 5.55, w: bw - 0.12, h: 0.65, fontFace: F, valign: 'bottom', margin: 0 });
  });
  s.addText(biRuns([hdr('No written request = no CBAM work. No standing mandate: each period and each Ally needs its own request.', 'Không có yêu cầu bằng văn bản = không làm CBAM. Không có ủy quyền thường trực: mỗi kỳ, mỗi Ally cần yêu cầu riêng.')], { en: 12, vn: 10, bold: true, color: CORAL_D }), { x: 0.5, y: 6.35, w: 12.33, h: 0.6, fontFace: F, margin: 0 });
}

// ---------- 12. Supplier data + boundaries
{
  const s = next();
  frame(s, n, 'CBAM — supplier data and boundaries', 'CBAM — dữ liệu nhà cung cấp và giới hạn');
  const col = (x, w, color, title, items, en, vn) => {
    s.addShape(pptx.ShapeType.rect, { x, y: 1.55, w, h: 0.55, fill: { color }, line: { color } });
    s.addText(biRuns([title], { en: 13, vn: 10.5, bold: true, color: WHITE, vnColor: 'E3E9EE' }), { x: x + 0.15, y: 1.55, w: w - 0.3, h: 0.55, fontFace: F, valign: 'middle', margin: 0 });
    s.addText(biRuns(items, { en, vn, bullet: true, gap: 5 }), { x, y: 2.2, w, h: 4.75, fontFace: F, valign: 'top', margin: 2 });
  };
  col(0.5, 6.0, BLUE, hdr('Request from the supplier (Template v2.1.1)', 'Yêu cầu nhà cung cấp (Mẫu v2.1.1)'), C.CBAM_SUPPLIER_DATA, 10.5, 8.5);
  col(6.83, 6.0, CORAL_D, hdr('A.R.E.N.A. never…', 'A.R.E.N.A. không bao giờ…'), C.CBAM_ARENA_RULES, 10.5, 8.5);
}

// ---------- 13. SOP alignment
{
  const s = next();
  frame(s, n, 'Alignment with A.R.E.N.A. procedures', 'Đối chiếu với quy trình A.R.E.N.A. — không thêm cổng mới');
  table(s, [hdr('A.R.E.N.A. touchpoint', 'Điểm tiếp xúc A.R.E.N.A.'), hdr('EUDR', 'EUDR'), hdr('CBAM', 'CBAM')], C.SOP_ALIGNMENT, [3.4, 4.46, 4.47], 1.5, { en: 12, vn: 10, boldFirst: true });
}

// ---------- 14. Timeline
{
  const s = next();
  frame(s, n, 'Key dates 2025–2028', 'Các mốc thời gian 2025–2028');
  const items = C.TIMELINE;
  const y0 = 3.95, x0 = 0.7, x1 = 12.6;
  s.addShape(pptx.ShapeType.line, { x: x0, y: y0, w: x1 - x0, h: 0, line: { color: NAVY, width: 2 } });
  const step = (x1 - x0) / (items.length - 1);
  items.forEach(([d, ev, reg], i) => {
    const x = x0 + i * step;
    const color = reg === 'EUDR' ? BLUE : reg === 'UK CBAM' ? NAVY : CORAL;
    s.addShape(pptx.ShapeType.ellipse, { x: x - 0.11, y: y0 - 0.11, w: 0.22, h: 0.22, fill: { color }, line: { color: WHITE, width: 1.5 } });
    const up = i % 2 === 0;
    const bx = Math.min(Math.max(x - 0.9, 0.4), W - 2.2);
    s.addShape(pptx.ShapeType.line, { x, y: up ? y0 - 0.55 : y0 + 0.11, w: 0, h: 0.44, line: { color, width: 1 } });
    s.addText([
      { text: d, options: { bold: true, color, fontSize: 11, breakLine: true } },
      { text: ev.en, options: { color: NAVY, fontSize: 10, breakLine: true } },
      { text: ev.vn, options: { color: GREY, fontSize: 8.5, italic: true } },
    ], { x: bx, y: up ? 1.85 : 4.5, w: 1.8, h: 1.6, fontFace: F, valign: up ? 'bottom' : 'top', align: 'center', margin: 0 });
  });
  s.addText([
    { text: '● EUDR   ', options: { color: BLUE, bold: true } },
    { text: '● EU CBAM   ', options: { color: CORAL, bold: true } },
    { text: '● UK CBAM (GB/NI)', options: { color: NAVY, bold: true } },
  ], { x: 0.5, y: 6.3, w: 12.33, h: 0.4, fontFace: F, fontSize: 12, margin: 0 });
}

// ---------- 15. Skill corrections + VERIFY
{
  const s = next();
  frame(s, n, 'Skill corrections and open VERIFY items', 'Hiệu chỉnh skill và các mục VERIFY còn mở');
  const rows = C.SKILL_FLAGS.map((r) => [r[0].en, r[1], r[2]]);
  table(s, ['Skill / tool', hdr('Snapshot says', 'Bản cũ ghi'), hdr('Verified / rule', 'Đã xác minh / quy tắc')], rows, [1.9, 2.4, 2.4], 1.5, { en: 9.5, vn: 8, boldFirst: true });
  s.addShape(pptx.ShapeType.rect, { x: 7.4, y: 1.5, w: 5.43, h: 0.45, fill: { color: CORAL_D }, line: { color: CORAL_D } });
  s.addText('VERIFY before Rev. 1  ·  Cần xác minh trước Rev. 1', { x: 7.55, y: 1.5, w: 5.2, h: 0.45, fontFace: F, fontSize: 12, bold: true, color: WHITE, valign: 'middle', margin: 0 });
  s.addText(biRuns(C.VERIFY, { en: 9, vn: 7.5, bullet: true, gap: 3 }), { x: 7.4, y: 2.05, w: 5.43, h: 4.9, fontFace: F, valign: 'top', margin: 2 });
}

// ---------- 16. Next steps
{
  const s = next();
  s.background = { color: NAVY };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: CORAL }, line: { color: CORAL } });
  s.addText('Next steps', { x: 0.9, y: 0.7, w: 11, h: 0.7, fontFace: F, fontSize: 32, bold: true, color: WHITE, margin: 0 });
  s.addText('Các bước tiếp theo', { x: 0.9, y: 1.35, w: 11, h: 0.5, fontFace: F, fontSize: 20, color: '7FB6D1', margin: 0 });
  const steps = [
    hdr('QS team reviews this draft; QS confirms the SRC wording for CBAM and the SOP gate references.', 'Nhóm QS xem xét bản dự thảo; QS xác nhận câu chữ SRC cho CBAM và tham chiếu cổng SOP.'),
    hdr('IQA closes the VERIFY items against EUR-Lex / legislation.gov.uk and updates the Regulatory Register.', 'IQA xử lý các mục VERIFY theo EUR-Lex / legislation.gov.uk và cập nhật Sổ đăng ký pháp quy.'),
    hdr('Patch eudr-compliance-assessment and cbam-compliance-assessment; update the IQS EUDR screen to 2026/2102.', 'Cập nhật skill eudr-compliance-assessment và cbam-compliance-assessment; cập nhật màn hình EUDR của IQS theo 2026/2102.'),
    hdr('Quality Director approves Rev. 1 for release to QS, QC, PPS, Merchandisers and DCOs.', 'Giám đốc Chất lượng phê duyệt Rev. 1 để ban hành cho QS, QC, PPS, Merchandiser và DCO.'),
  ];
  steps.forEach((st, i) => {
    const y = 2.3 + i * 1.12;
    s.addShape(pptx.ShapeType.ellipse, { x: 0.9, y, w: 0.6, h: 0.6, fill: { color: CORAL_D }, line: { color: CORAL_D } });
    s.addText(String(i + 1), { x: 0.9, y, w: 0.6, h: 0.6, fontFace: F, fontSize: 18, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0 });
    s.addText(biRuns([st], { en: 15, vn: 12, color: WHITE, vnColor: 'AEB8C8' }), { x: 1.75, y: y - 0.1, w: 10.8, h: 0.85, fontFace: F, valign: 'middle', margin: 0 });
  });
}

const out = path.join(__dirname, '..', `${C.META.docId}_EUDR_CBAM_Training_Deck_Rev0.pptx`);
pptx.writeFile({ fileName: out }).then(() => console.log('wrote', out));
