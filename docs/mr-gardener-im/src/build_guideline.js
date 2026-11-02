const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, ImageRun, Header, Footer, PageNumber, LevelFormat,
  TableOfContents, PageBreak, PageOrientation
} = require('docx');

const NAVY = '151F37', CORAL = 'DC5733', BLUE = '006293', GREY = '5A5A5A', LIGHT = 'EAF2F6', VERIFYC = 'FFF2CC';
const FULL = 9638; // A4 portrait, 2 cm margins

// ---------- helpers ----------
const run = (t, o = {}) => new TextRun({ text: t, font: 'Arial', size: o.size || 20, bold: o.bold, italics: o.italics, color: o.color });
// rich: '**bold**' and '[VERIFY]' highlight
function rich(t, o = {}) {
  const parts = t.split(/(\*\*[^*]+\*\*|\bVERIFY\b|\bUNVERIFIED\b)/g).filter(Boolean);
  return parts.map(p => {
    if (p.startsWith('**')) return run(p.slice(2, -2), { ...o, bold: true });
    if (p === 'VERIFY' || p === 'UNVERIFIED') return new TextRun({ text: p, font: 'Arial', size: o.size || 20, bold: true, color: 'B45F06', highlight: 'yellow' });
    return run(p, o);
  });
}
const en = (t, o = {}) => new Paragraph({ spacing: { before: o.before ?? 80, after: 0 }, alignment: o.align, children: rich(t, o) });
const vn = (t, o = {}) => new Paragraph({ spacing: { before: 0, after: o.after ?? 100 }, alignment: o.align, children: rich(t, { ...o, italics: true, color: GREY }) });
const bi = (e, v, o = {}) => [en(e, o), vn(v, o)];
function H(level, e, v) {
  return [
    new Paragraph({ heading: level, spacing: { before: level === HeadingLevel.HEADING_1 ? 320 : 220, after: 0 }, children: [new TextRun({ text: e, font: 'Arial' })] }),
    new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: v, font: 'Arial', italics: true, color: level === HeadingLevel.HEADING_1 ? CORAL : BLUE, size: level === HeadingLevel.HEADING_1 ? 24 : 21 })] }),
  ];
}
const H1 = (e, v) => H(HeadingLevel.HEADING_1, e, v);
const H2 = (e, v) => H(HeadingLevel.HEADING_2, e, v);
function bullets(items) {
  const out = [];
  for (const [e, v] of items) {
    out.push(new Paragraph({ numbering: { reference: 'bul', level: 0 }, spacing: { before: 60, after: 0 }, children: rich(e) }));
    out.push(new Paragraph({ indent: { left: 720 }, spacing: { before: 0, after: 60 }, children: rich(v, { italics: true, color: GREY }) }));
  }
  return out;
}
const border = { style: BorderStyle.SINGLE, size: 4, color: 'A6A6A6' };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(content, w, o = {}) {
  let paras;
  if (Array.isArray(content)) {
    paras = [new Paragraph({ spacing: { before: 0, after: 0 }, children: rich(content[0], { size: o.size || 17, bold: o.bold, color: o.color }) }),
             new Paragraph({ spacing: { before: 20, after: 0 }, children: rich(content[1], { size: o.size || 17, italics: true, color: o.header ? 'DCE6F0' : GREY }) })];
  } else {
    paras = String(content).split('|').map(line => new Paragraph({ spacing: { before: 0, after: 0 }, children: rich(line, { size: o.size || 17, bold: o.bold, color: o.color }) }));
  }
  return new TableCell({
    width: { size: w, type: WidthType.DXA }, borders,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 }, children: paras,
  });
}
function table(widths, header, rows, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const trs = [new TableRow({ tableHeader: true, children: header.map((h, i) => cell(h, widths[i], { fill: o.headFill || BLUE, bold: true, color: 'FFFFFF', header: true })) })];
  rows.forEach((r, ri) => trs.push(new TableRow({ children: r.map((c, i) => {
    const isVerify = (Array.isArray(c) ? c[0] : String(c)).includes('VERIFY');
    return cell(c, widths[i], { fill: (o.firstColFill && i === 0) ? LIGHT : (ri % 2 ? 'F7F9FA' : undefined) });
  }) })));
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, rows: trs });
}
const spacer = () => new Paragraph({ spacing: { before: 0, after: 80 }, children: [] });
const img = (f, w, h) => new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: fs.readFileSync(path.join(__dirname, '..', f)), transformation: { width: w, height: h } })] });
function swatch(hex, w) { return new TableCell({ width: { size: w, type: WidthType.DXA }, borders, shading: { fill: hex, type: ShadingType.CLEAR, color: 'auto' }, children: [new Paragraph({ children: [] })] }); }

// ---------- content ----------
const C = [];

// Title block
C.push(new Paragraph({ spacing: { before: 600, after: 0 }, children: [run('A.R.E.N.A. Vietnam · Quality & Compliance', { size: 22, color: BLUE, bold: true })] }));
C.push(new Paragraph({ spacing: { before: 200, after: 0 }, children: [run('Mr. GARDENER (hagebau own brand)', { size: 28, color: CORAL, bold: true })] }));
C.push(new Paragraph({ spacing: { before: 60, after: 0 }, children: [run('Guideline for building the Instruction Manual (IM)', { size: 44, color: NAVY, bold: true })] }));
C.push(new Paragraph({ spacing: { before: 60, after: 300 }, children: [run('Hướng dẫn xây dựng Sách hướng dẫn sử dụng (IM) cho nhãn hiệu Mr. GARDENER', { size: 28, color: GREY, italics: true })] }));
C.push(table([2600, 7038], [['Field', 'Trường'], ['Value', 'Giá trị']], [
  [['Document code', 'Mã tài liệu'], 'ARENA-GL-GARDEN-IM-MRG-01'],
  [['Revision / date', 'Phiên bản / ngày'], 'Rev. 0 · 02 Nov 2026'],
  [['Status', 'Trạng thái'], ['DRAFT for QS review – contains VERIFY items (§11)', 'BẢN NHÁP để QS xem xét – có các mục VERIFY (§11)']],
  [['Owner', 'Người phụ trách'], 'Lybachbill – Internal Quality Auditor (IQA)'],
  [['Users', 'Người sử dụng'], ['Suppliers (producers), A.R.E.N.A. QS / QC / PPS-Pkg', 'Nhà cung cấp (nhà sản xuất), QS / QC / PPS-Pkg của A.R.E.N.A.']],
  [['Ally / brand', 'Đối tác / nhãn hiệu'], 'HAGEBAU (HGB) · Mr. GARDENER'],
  [['Source documents', 'Tài liệu nguồn'], 'Mr. GARDENER Design Manual, Glasmeyer Branding GmbH, status 13.06.2019 (59 p.) – cited "DM p.x"|IM general format, 24 March 2026 (template, DE, art. 997447) – cited "IM-GF"|ARENA rulebook rev. c2 (1 Nov 2026)'],
], { firstColFill: true }));
C.push(spacer());
C.push(...bi('**Rule:** this guideline governs layout, structure and the A.R.E.N.A. check. It does not replace the Design Manual, the product standard or the Ally\'s instructions. Where they conflict, the Ally\'s written instruction prevails.',
  '**Quy tắc:** hướng dẫn này quy định bố cục, cấu trúc và việc kiểm tra của A.R.E.N.A. Không thay thế Design Manual, tiêu chuẩn sản phẩm hoặc chỉ thị của Đối tác. Khi có mâu thuẫn, chỉ thị bằng văn bản của Đối tác được ưu tiên.'));
C.push(new Paragraph({ children: [new PageBreak()] }));
C.push(new TableOfContents('Contents / Mục lục', { hyperlink: true, headingStyleRange: '1-2' }));
C.push(new Paragraph({ children: [new PageBreak()] }));

// 1 Purpose
C.push(...H1('1. Purpose and scope', '1. Mục đích và phạm vi'));
C.push(...bullets([
  ['Defines how a supplier builds a Mr. GARDENER IM that (a) follows the brand CI of the Design Manual and (b) contains the content required by EU product law and EN IEC/IEEE 82079-1.',
   'Quy định cách nhà cung cấp xây dựng IM Mr. GARDENER (a) tuân thủ nhận diện thương hiệu theo Design Manual và (b) có đủ nội dung theo luật sản phẩm EU và EN IEC/IEEE 82079-1.'],
  ['Applies to all Mr. GARDENER items: corded electric, battery, petrol, pumps/water technology, robotic mowers, non-powered garden hardware, hoses/fittings, fencing/WPC (modules in §6).',
   'Áp dụng cho mọi mặt hàng Mr. GARDENER: điện dây, pin, xăng, bơm/thiết bị nước, robot cắt cỏ, dụng cụ vườn không động cơ, ống/khớp nối, hàng rào/WPC (các mô-đun ở §6).'],
  ['Base language of the IM: **German (DE)** for DE/AT. Further languages per Ally order (§7).',
   'Ngôn ngữ gốc của IM: **tiếng Đức (DE)** cho DE/AT. Ngôn ngữ khác theo đơn hàng của Đối tác (§7).'],
  ['Out of scope: packaging artwork (see DM p.16–41 and artwork-packaging-compliance-master), type plate artwork (DM p.43), DoC drafting.',
   'Ngoài phạm vi: thiết kế bao bì (xem DM tr.16–41), nhãn thông số (DM tr.43), soạn DoC.'],
]));

// 2 Roles
C.push(...H1('2. Roles and responsibilities', '2. Vai trò và trách nhiệm'));
C.push(table([2200, 7438], [['Party', 'Bên'], ['Role for the IM', 'Vai trò đối với IM']], [
  [['hagebau (HGB)', 'hagebau (HGB)'], ['Brand owner; places Mr. GARDENER under its own name → **GPSR manufacturer** ("hergestellt für"). Final approval of the IM.', 'Chủ nhãn hiệu; đưa Mr. GARDENER ra thị trường dưới tên mình → **nhà sản xuất theo GPSR** ("hergestellt für"). Phê duyệt IM cuối cùng.']],
  [['Supplier (producer)', 'Nhà cung cấp (nhà sản xuất)'], ['Writes the IM content; responsible for legally sound content of illustration, operation and warranty and for consequential damage (DM p.2). Provides translations, line drawings, technical data, test-report references.', 'Soạn nội dung IM; chịu trách nhiệm về tính hợp pháp của hình minh họa, vận hành, bảo hành và thiệt hại phát sinh (DM tr.2). Cung cấp bản dịch, bản vẽ nét, thông số kỹ thuật, tham chiếu báo cáo thử nghiệm.']],
  [['Glasmeyer Branding GmbH', 'Glasmeyer Branding GmbH'], ['Brand agency. Designs not made by Glasmeyer **must** be submitted for assessment/correction, stating format and kind of print item; text review is mandatory (DM p.2). Supplies logo/CD data on request.', 'Đơn vị thương hiệu. Thiết kế không do Glasmeyer làm **bắt buộc** phải gửi để đánh giá/chỉnh sửa, ghi rõ khổ và loại ấn phẩm; bắt buộc duyệt văn bản (DM tr.2). Cung cấp file logo/CD khi được yêu cầu.']],
  [['A.R.E.N.A. QS', 'QS A.R.E.N.A.'], ['Checks the draft against this guideline (§10 checklist) before it goes to Glasmeyer/HGB; tracks approval in the TCF; FRI checks the printed IM.', 'Kiểm tra bản nháp theo hướng dẫn này (danh mục §10) trước khi gửi Glasmeyer/HGB; theo dõi phê duyệt trong TCF; FRI kiểm tra IM đã in.']],
  [['A.R.E.N.A. IQA', 'IQA A.R.E.N.A.'], ['Owns this guideline. Advisory only.', 'Quản lý hướng dẫn này. Chỉ tư vấn.']],
], { firstColFill: true }));
C.push(spacer());
C.push(...bi('A.R.E.N.A. is a pure sourcing office: never manufacturer, importer, distributor or GPSR responsible person, and never the author or approver of the legal content of the IM.',
  'A.R.E.N.A. là văn phòng tìm nguồn thuần túy: không bao giờ là nhà sản xuất, nhà nhập khẩu, nhà phân phối hay người chịu trách nhiệm theo GPSR, và không soạn hay phê duyệt nội dung pháp lý của IM.'));

// 3 Workflow
C.push(...H1('3. Workflow', '3. Quy trình'));
C.push(table([700, 5300, 1900, 1738], [['Step', 'Bước'], ['Action', 'Hành động'], ['Owner', 'Phụ trách'], ['Output', 'Kết quả']], [
  ['S1', ['Send this guideline, the IM general format and the request for logo files (pdf/eps only, DM p.5) to the supplier.', 'Gửi hướng dẫn này, IM general format và yêu cầu file logo (chỉ pdf/eps, DM tr.5) cho nhà cung cấp.'], 'QS', ['Kick-off', 'Khởi động']],
  ['S2', ['Draft master text using the chapter structure (§5), the product risk assessment and the IM clauses of the product standard.', 'Soạn văn bản gốc theo cấu trúc chương (§5), đánh giá rủi ro sản phẩm và các điều khoản IM của tiêu chuẩn sản phẩm.'], 'Supplier', ['Draft v0.x', 'Bản nháp v0.x']],
  ['S3', ['Professional translation into German (and other languages). Machine translation only with native-speaker review.', 'Dịch chuyên nghiệp sang tiếng Đức (và ngôn ngữ khác). Dịch máy chỉ khi có người bản ngữ duyệt.'], 'Supplier', ['DE text', 'Văn bản DE']],
  ['S4', ['Check against §10 checklist; return comments; repeat until no open Critical/Major items.', 'Kiểm tra theo danh mục §10; gửi nhận xét; lặp lại đến khi không còn lỗi Critical/Major.'], 'QS', ['Checklist', 'Danh mục']],
  ['S5', ['Apply brand layout (§4). Submit PDF to Glasmeyer stating format, print type and binding (DM p.2).', 'Áp dụng bố cục thương hiệu (§4). Gửi PDF cho Glasmeyer, ghi rõ khổ, loại in và đóng gáy (DM tr.2).'], 'Supplier', ['Layout PDF', 'PDF bố cục']],
  ['S6', ['Glasmeyer text/design correction → HGB written approval.', 'Glasmeyer chỉnh sửa văn bản/thiết kế → HGB phê duyệt bằng văn bản.'], 'Glasmeyer / HGB', ['Approval', 'Phê duyệt']],
  ['S7', ['Print-ready PDF; archive approved version + approval e-mail in the TCF. Due by **ETD − 45 days** (rulebook §3).', 'PDF sẵn sàng in; lưu bản đã duyệt + email phê duyệt vào TCF. Hạn **ETD − 45 ngày** (rulebook §3).'], 'Supplier / QS', ['Approved IM', 'IM đã duyệt']],
  ['S8', ['FRI: printed IM = approved version (version code, languages, art. no.), present in every unit.', 'FRI: IM đã in = bản đã duyệt (mã phiên bản, ngôn ngữ, mã hàng), có trong mỗi sản phẩm.'], 'QC', ['FRI CP artwork', 'FRI CP artwork']],
]));

// 4 Brand layout
C.push(...H1('4. Brand layout rules (from the Design Manual)', '4. Quy tắc bố cục thương hiệu (theo Design Manual)'));
C.push(...bi('The Design Manual is written for packaging. It defines no IM page layout. The rules below transfer its CI elements to the IM. Items marked "recommended" are A.R.E.N.A. proposals that Glasmeyer confirms at S5/S6.',
  'Design Manual được viết cho bao bì, không quy định bố cục trang IM. Các quy tắc dưới đây chuyển các yếu tố CI sang IM. Mục ghi "khuyến nghị" là đề xuất của A.R.E.N.A., Glasmeyer xác nhận ở bước S5/S6.'));
C.push(...H2('4.1 Logo', '4.1 Logo'));
C.push(...bullets([
  ['Protected word-pictorial trademark: lettering "Mr." + rectangle with radial gradient and frame + lettering "GARDENER". **Use only the provided logo files (pdf or eps).** Never redraw, recolour or retype (DM p.5).', 'Nhãn hiệu chữ-hình được bảo hộ: chữ "Mr." + hình chữ nhật có dải màu tỏa tròn và viền + chữ "GARDENER". **Chỉ dùng file logo được cung cấp (pdf hoặc eps).** Không vẽ lại, đổi màu hay gõ lại (DM tr.5).'],
  ['Scale proportionally as a whole only (DM p.5–7).', 'Chỉ thu phóng tỷ lệ toàn bộ (DM tr.5–7).'],
  ['Normal logo on white/light backgrounds (IM cover and header). Negative logo only for transparent stickers (DM p.6). Black & white variants for 1-colour printing of the IM interior (DM p.7).', 'Logo thường trên nền trắng/sáng (bìa và đầu trang IM). Logo âm bản chỉ cho nhãn dán trong suốt (DM tr.6). Biến thể đen trắng cho in 1 màu ruột IM (DM tr.7).'],
]));
C.push(table([3400, 4838, 1400], [['Logo element', 'Thành phần logo'], ['CMYK (DM p.5)', 'CMYK (DM tr.5)'], ['Preview*', 'Xem trước*']], [
  [['Lettering "Mr." + shadow behind "GARDENER"', 'Chữ "Mr." + bóng sau "GARDENER"'], '00/00/00/100', ''],
  [['Lettering "GARDENER"', 'Chữ "GARDENER"'], '00/00/00/00 (white)', ''],
  [['Frame (rectangle)', 'Viền (hình chữ nhật)'], '85/15/100/65', ''],
  [['Inner rectangle radial gradient', 'Dải màu tỏa tròn bên trong'], 'Interior 00/00/100/25 (18 %) · Centre 1 60/00/100/45 (65 %) · Centre 2 80/00/100/85 (82 %) · Exterior 80/00/100/100 (100 %)', ''],
]));
C.push(...bi('*Preview colours in this document are screen approximations only. Print with the CMYK values.', '*Màu xem trước trong tài liệu này chỉ là mô phỏng trên màn hình. In theo giá trị CMYK.', { size: 16 }));

C.push(...H2('4.2 Measurement unit ("square")', '4.2 Đơn vị đo ("ô vuông")'));
C.push(...bullets([
  ['1 square = height of the rounded green logo rectangle at the logo size used. All distances are given in squares or fractions: 1, 1/2, 1/4, 1/5, 1/16 (DM p.9–10).', '1 ô vuông = chiều cao hình chữ nhật xanh bo góc của logo ở kích thước đang dùng. Mọi khoảng cách tính bằng ô vuông hoặc phân số: 1, 1/2, 1/4, 1/5, 1/16 (DM tr.9–10).'],
  ['Determine the square again for every logo size (cover vs. page header).', 'Xác định lại ô vuông cho mỗi kích thước logo (bìa và đầu trang).'],
]));

C.push(...H2('4.3 Lines and green bar', '4.3 Đường kẻ và thanh xanh'));
C.push(table([2300, 5338, 2000], [['Element', 'Thành phần'], ['Specification', 'Thông số'], ['Source', 'Nguồn']], [
  [['Orange line', 'Đường cam'], ['Gradient CMYK 00/20/100/00 (10 %) → 00/58/100/00 (40 %) → 00/20/100/00 (70 %) → 00/58/100/00 (100 %). Thickness = stem of the "D" in GARDENER. Runs behind the logo rectangle at ratio 2:3 ((square − line) ÷ 5 = 1 part; 2 parts above, 3 below).', 'Dải màu CMYK 00/20/100/00 (10 %) → 00/58/100/00 (40 %) → 00/20/100/00 (70 %) → 00/58/100/00 (100 %). Độ dày = nét đứng chữ "D" trong GARDENER. Chạy sau hình chữ nhật logo theo tỷ lệ 2:3 ((ô vuông − đường) ÷ 5 = 1 phần; 2 phần trên, 3 phần dưới).'], 'DM p.17–18'],
  [['Green-yellow line', 'Đường xanh-vàng'], ['Linear 20/00/80/00 (0 %) → 00/00/30/00 (100 %). Same thickness. Marks the end of the layout; area below stays white.', 'Tuyến tính 20/00/80/00 (0 %) → 00/00/30/00 (100 %). Cùng độ dày. Đánh dấu cuối bố cục; vùng bên dưới để trắng.'], 'DM p.17, 22'],
  [['Green bar', 'Thanh xanh'], ['Linear 80/00/100/75 (0 %) → 70/00/100/00 (50 %) → 65/00/100/00 (100 %). Carries the product name (left) and type designation (right).', 'Tuyến tính 80/00/100/75 (0 %) → 70/00/100/00 (50 %) → 65/00/100/00 (100 %). Chứa tên sản phẩm (trái) và mã kiểu (phải).'], 'DM p.19, 22'],
  [['Type-designation box', 'Ô mã kiểu'], ['Rectangle CMYK 00/75/100/00, height 3/4 square, 1/4 square left/right padding, 1/2 square to edge.', 'Hình chữ nhật CMYK 00/75/100/00, cao 3/4 ô, lề trái/phải 1/4 ô, cách mép 1/2 ô.'], 'DM p.35'],
]));
C.push(spacer());
const sw = [['85/15/100/65', '0F4A1E'], ['00/20/100/00', 'FFCC00'], ['00/58/100/00', 'F7941D'], ['20/00/80/00', 'D6E05A'], ['80/00/100/75', '103C14'], ['65/00/100/00', '5BBA47'], ['00/75/100/00', 'F26522']];
C.push(new Table({ width: { size: FULL, type: WidthType.DXA }, columnWidths: sw.map(() => 1376).slice(0, 6).concat([FULL - 1376 * 6]), rows: [
  new TableRow({ children: sw.map((s, i) => swatch(s[1], i < 6 ? 1376 : FULL - 1376 * 6)) }),
  new TableRow({ children: sw.map((s, i) => cell(s[0], i < 6 ? 1376 : FULL - 1376 * 6, { size: 15 })) }),
] }));

C.push(...H2('4.4 Background (cover only)', '4.4 Nền (chỉ trên bìa)'));
C.push(...bullets([
  ['Background = blue-green colour fond + one image fond chosen by product range (DM p.12): **lawn** – motorised garden tools (mowers, scythes); **drops** – water technology (pumps, hoses); **branch/leaves** – garden technology (hedge clippers, shredders); **autumn leaves** – garden hardware (leaf blowers, leaf brooms).', 'Nền = nền màu xanh lam-lục + một ảnh nền chọn theo nhóm sản phẩm (DM tr.12): **cỏ** – dụng cụ có động cơ (máy cắt cỏ, máy cắt viền); **giọt nước** – thiết bị nước (bơm, ống); **cành/lá** – thiết bị vườn (tông đơ hàng rào, máy nghiền); **lá thu** – dụng cụ vườn (máy thổi lá, chổi lá).'],
  ['Colour fond starts at top-left on the orange line; image fond is anchored bottom-right on the green-yellow line (DM p.13). Image data come from the Glasmeyer data package.', 'Nền màu bắt đầu từ góc trên-trái tại đường cam; ảnh nền neo ở góc dưới-phải tại đường xanh-vàng (DM tr.13). Dữ liệu ảnh lấy từ gói dữ liệu Glasmeyer.'],
  ['**Recommended:** no photo backgrounds on text pages – they reduce legibility of safety text.', '**Khuyến nghị:** không dùng ảnh nền ở trang chữ – làm giảm độ dễ đọc của nội dung an toàn.'],
]));

C.push(...H2('4.5 Typography', '4.5 Kiểu chữ'));
C.push(table([2500, 3800, 3338], [['Use', 'Sử dụng'], ['Font / colour', 'Phông / màu'], ['Source / note', 'Nguồn / ghi chú']], [
  [['Product name on cover', 'Tên sản phẩm trên bìa'], 'Impact Regular, CAPITALS (units excepted), tracking +20, CMYK 00/00/00/00; headline 3/4 square, subline 2/4 square, line distance 1/5 square', ['DM p.30; too long → scale until 1/2 square fits to margin, tracking down to 0', 'DM tr.30; quá dài → thu nhỏ đến khi còn 1/2 ô tới lề, giảm khoảng chữ tới 0']],
  [['Type designation', 'Mã kiểu'], 'Impact Regular, white, text height 1/4 + 1/16 square', 'DM p.35'],
  [['Chapter headings (IM)', 'Tiêu đề chương (IM)'], 'Impact Regular or Univers Bold, CMYK 85/15/100/65', ['Recommended – confirm with Glasmeyer', 'Khuyến nghị – Glasmeyer xác nhận']],
  [['Body text, safety text (IM)', 'Nội dung, cảnh báo an toàn (IM)'], 'Univers Regular, **100 % K on white**', ['Recommended for legibility. Minimum size: VERIFY against EN IEC/IEEE 82079-1 legibility clause; A.R.E.N.A. house minimum 9 pt', 'Khuyến nghị để dễ đọc. Cỡ tối thiểu: VERIFY theo điều khoản độ dễ đọc của EN IEC/IEEE 82079-1; tối thiểu nội bộ 9 pt']],
  [['Distributor block', 'Khối nhà phân phối'], 'Univers Roman (company name bold), CMYK 85/15/100/65, ≥ 6 pt, automatic line spacing', 'DM p.34'],
]));

C.push(...H2('4.6 Pictograms and safety signs', '4.6 Biểu tượng và ký hiệu an toàn'));
C.push(...bullets([
  ['Technical pictograms (weight, power, cutting width, flow rate, IPX4 …) in the DM look, colour CMYK 85/15/100/65 (DM p.38). Use them in the Technical data chapter.', 'Biểu tượng kỹ thuật (khối lượng, công suất, bề rộng cắt, lưu lượng, IPX4 …) theo mẫu DM, màu CMYK 85/15/100/65 (DM tr.38). Dùng trong chương Thông số kỹ thuật.'],
  ['Safety signs are **not** brand-coloured: use ISO 7010 graphical symbols and ISO 3864 colours (warning yellow/black, mandatory blue/white, prohibition red). Signs on the product must be reproduced identically in the IM and explained.', 'Ký hiệu an toàn **không** dùng màu thương hiệu: dùng ký hiệu ISO 7010 và màu ISO 3864 (cảnh báo vàng/đen, bắt buộc xanh/trắng, cấm đỏ). Ký hiệu trên sản phẩm phải được tái hiện giống hệt trong IM và giải thích.'],
  ['Regulatory marks (CE, crossed-out wheeled bin, protection-class symbols, LWA label) in their legal form and proportions, black or white only.', 'Dấu pháp lý (CE, thùng rác gạch chéo, ký hiệu cấp bảo vệ, nhãn LWA) theo đúng hình dạng và tỷ lệ pháp định, chỉ màu đen hoặc trắng.'],
]));

C.push(...H2('4.7 Cover and inner page (wireframes)', '4.7 Bìa và trang trong (bản phác)'));
C.push(new Table({ width: { size: FULL, type: WidthType.DXA }, columnWidths: [4819, 4819], rows: [new TableRow({ children: [
  new TableCell({ width: { size: 4819, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [img('cover_wireframe.png', 290, 411)] }),
  new TableCell({ width: { size: 4819, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [img('inner_wireframe.png', 290, 411)] }),
] })] }));
C.push(...bi('*LOGO placeholder – place the original logo file. Pink notes are construction notes, not printed.', '*Ô LOGO là chỗ giữ – đặt file logo gốc. Ghi chú màu hồng là ghi chú dựng hình, không in.', { size: 16 }));
C.push(table([2600, 7038], [['Cover element', 'Thành phần bìa'], ['Rule', 'Quy tắc']], [
  [['Top zone', 'Vùng trên'], ['White above the logo; background starts directly below the orange line (DM p.22).', 'Để trắng phía trên logo; nền bắt đầu ngay dưới đường cam (DM tr.22).']],
  [['Logo', 'Logo'], ['Upper left, on the orange line. Logo rectangle, product name, and text block aligned on one vertical line (DM p.23).', 'Góc trên-trái, trên đường cam. Hình chữ nhật logo, tên sản phẩm và khối chữ thẳng hàng một đường dọc (DM tr.23).']],
  [['Green bar', 'Thanh xanh'], ['Product name left, type designation right in orange box (DM p.22, 30, 35).', 'Tên sản phẩm bên trái, mã kiểu bên phải trong ô cam (DM tr.22, 30, 35).']],
  [['Product image', 'Hình sản phẩm'], ['As large as possible, lower right; hard shadow per DM p.20 (multiply, CMYK 85/15/100/65, 55 %, 112°).', 'Càng lớn càng tốt, góc dưới-phải; bóng cứng theo DM tr.20 (multiply, CMYK 85/15/100/65, 55 %, 112°).']],
  [['Below green-yellow line', 'Dưới đường xanh-vàng'], ['White. Document title ("Bedienungsanleitung" or for machinery "Originalbetriebsanleitung" / "Übersetzung der Originalbetriebsanleitung"), "hergestellt für" block, Art.-Nr./IAN, type, version code, print date.', 'Trắng. Tiêu đề tài liệu ("Bedienungsanleitung" hoặc với máy móc "Originalbetriebsanleitung" / "Übersetzung der Originalbetriebsanleitung"), khối "hergestellt für", Art.-Nr./IAN, kiểu, mã phiên bản, ngày in.']],
  [['No teaser', 'Không teaser'], ['Orange "product advantage" teasers (DM p.40) are sales elements – **not used in the IM**.', 'Teaser cam "ưu điểm sản phẩm" (DM tr.40) là yếu tố bán hàng – **không dùng trong IM**.']],
], { firstColFill: true }));

C.push(...H2('4.8 Format and print (recommended)', '4.8 Khổ và in ấn (khuyến nghị)'));
C.push(...bullets([
  ['A5 portrait (148 × 210 mm); saddle-stitched; page count multiple of 4; cover 4c CMYK, interior 1c (K) or 4c. Confirm with Glasmeyer at S5.', 'A5 dọc (148 × 210 mm); đóng ghim giữa; số trang bội số của 4; bìa 4 màu CMYK, ruột 1 màu (K) hoặc 4 màu. Xác nhận với Glasmeyer ở bước S5.'],
  ['Print-ready PDF: fonts embedded, images ≥ 300 dpi, line drawings as vector, 3 mm bleed (VERIFY with printer).', 'PDF sẵn sàng in: nhúng phông, ảnh ≥ 300 dpi, bản vẽ nét dạng vector, tràn lề 3 mm (VERIFY với nhà in).'],
  ['Header on inner pages: normal logo (small) right + orange line. Footer: green-yellow line, "Mr. GARDENER · product · Art.-Nr.", version code, page number.', 'Đầu trang trong: logo thường (nhỏ) bên phải + đường cam. Chân trang: đường xanh-vàng, "Mr. GARDENER · sản phẩm · Art.-Nr.", mã phiên bản, số trang.'],
  ['Paper quality, binding and robustness must keep the IM legible for the product life (EN IEC/IEEE 82079-1 durability principle).', 'Chất lượng giấy, đóng gáy và độ bền phải giữ IM dễ đọc suốt vòng đời sản phẩm (nguyên tắc độ bền EN IEC/IEEE 82079-1).'],
]));

// 5 Structure
C.push(...H1('5. Mandatory chapter structure', '5. Cấu trúc chương bắt buộc'));
C.push(...bi('Base = IM general format (IM-GF, 10 chapters), extended to garden products. Chapters marked "if applicable" are omitted only when the content does not apply; keep the order.',
  'Nền = IM general format (IM-GF, 10 chương), mở rộng cho sản phẩm vườn. Chương "nếu áp dụng" chỉ được bỏ khi không liên quan; giữ nguyên thứ tự.'));
C.push(table([500, 2400, 4938, 1800], [['No.', 'STT'], ['German heading (EN)', 'Tiêu đề tiếng Đức (EN)'], ['Required content', 'Nội dung bắt buộc'], ['Basis', 'Căn cứ']], [
  ['0', 'Titelseite (Cover)', ['§4.7: logo, product name, type, image, document title, "hergestellt für", Art.-Nr./IAN, version.', '§4.7: logo, tên SP, kiểu, hình, tiêu đề tài liệu, "hergestellt für", Art.-Nr./IAN, phiên bản.'], 'GPSR Art. 9; DM'],
  ['1', 'Inhaltsverzeichnis (Contents)', ['Chapter titles with page numbers (update after layout).', 'Tiêu đề chương kèm số trang (cập nhật sau dàn trang).'], 'IM-GF; 82079-1'],
  ['2', 'Allgemeines / Zu dieser Anleitung (About this manual)', ['Read completely before use; keep; pass on with the product; explanation of signal words and symbols used in the manual.', 'Đọc hết trước khi dùng; lưu giữ; chuyển kèm sản phẩm; giải thích từ tín hiệu và ký hiệu dùng trong sách.'], 'IM-GF; 82079-1'],
  ['3', 'Bestimmungsgemäße Verwendung (Intended use)', ['Intended use, user group (private use), environment (outdoor/indoor, weather), **reasonably foreseeable misuse** and what is not allowed.', 'Mục đích sử dụng, nhóm người dùng (dùng cá nhân), môi trường (ngoài trời/trong nhà, thời tiết), **sử dụng sai có thể dự đoán** và điều không được phép.'], 'IM-GF; MD 1.7.4.2; 82079-1'],
  ['4', 'Lieferumfang / Gerätebeschreibung (Scope of delivery, parts)', ['Vector drawing with position numbers; table Pos. – Bezeichnung – Anzahl; all languages translated.', 'Bản vẽ vector có số vị trí; bảng Pos. – Tên – Số lượng; dịch đủ mọi ngôn ngữ.'], 'IM-GF'],
  ['5', 'Symbole / Typenschild (Symbols, type plate)', ['Every symbol on product, type plate and packaging, explained; reproduction of the type plate.', 'Mọi ký hiệu trên sản phẩm, nhãn thông số và bao bì, có giải thích; tái hiện nhãn thông số.'], 'IM-GF (comment "German plate"); product std.'],
  ['6', 'Sicherheitshinweise (Safety instructions)', ['General warnings required verbatim by the product standard; product-specific warnings; residual risks; PPE. Structured safety notices (§8.2).', 'Cảnh báo chung theo nguyên văn tiêu chuẩn SP; cảnh báo riêng; rủi ro còn lại; PPE. Cảnh báo có cấu trúc (§8.2).'], 'Product std.; GPSR Art. 9(7); risk assessment'],
  ['7', 'Hinweise zu Akkus/Batterien/Ladegerät (if applicable)', ['Safe use, charging, storage, transport (Li-ion), removal/replacement, disposal.', 'Sử dụng an toàn, sạc, bảo quản, vận chuyển (Li-ion), tháo/thay, thải bỏ.'], 'Battery Reg. (EU) 2023/1542; product std.'],
  ['8', 'Technische Daten (Technical data)', ['Rated values; protection class; IP code; for machinery: LpA, LWA, uncertainty K, vibration ah with K; weight; battery type/capacity.', 'Giá trị định mức; cấp bảo vệ; mã IP; với máy móc: LpA, LWA, sai số K, rung ah kèm K; khối lượng; loại/dung lượng pin.'], 'MD 1.7.4.2(u); 2000/14/EC; product std.'],
  ['9', 'Montage (Assembly) (if applicable)', ['Step-by-step with drawings; tools; torques; check before first use.', 'Từng bước có hình; dụng cụ; lực siết; kiểm tra trước khi dùng lần đầu.'], 'MD 1.7.4.2(i); 82079-1'],
  ['10', 'Inbetriebnahme und Bedienung (Operation)', ['Start/stop, controls, working method, adjustment; for remote/timers all modes (IM-GF "Funktion").', 'Khởi động/dừng, điều khiển, cách làm việc, điều chỉnh; với remote/hẹn giờ ghi đủ chế độ (IM-GF "Funktion").'], 'IM-GF; product std.'],
  ['11', 'Wartung, Reinigung, Lagerung, Transport', ['Who may do what; switch off/unplug/remove battery first; cleaning; storage (frost, fuel); transport.', 'Ai được làm gì; tắt/rút điện/tháo pin trước; vệ sinh; bảo quản (sương giá, nhiên liệu); vận chuyển.'], 'IM-GF; MD 1.7.4.2(r,s)'],
  ['12', 'Fehlerbehebung (Troubleshooting)', ['Table: fault – possible cause – remedy; when to contact service.', 'Bảng: lỗi – nguyên nhân – khắc phục; khi nào liên hệ dịch vụ.'], 'IM-GF; 82079-1'],
  ['13', 'Ersatzteile / Zubehör / Service', ['Spare and wear parts with order numbers; service contact per HGB.', 'Phụ tùng thay thế, hao mòn kèm mã đặt hàng; liên hệ dịch vụ theo HGB.'], 'MD 1.7.4.2(t)'],
  ['14', 'Entsorgung und Umweltschutz (Disposal)', ['WEEE symbol + ElektroG text (DE); batteries; packaging sorting hint.', 'Ký hiệu WEEE + văn bản ElektroG (DE); pin; hướng dẫn phân loại bao bì.'], 'IM-GF; WEEE/ElektroG; Battery Reg.'],
  ['15', 'Garantie (Warranty) (if HGB requires)', ['Only HGB-provided text. Supplier must not write warranty promises.', 'Chỉ dùng văn bản do HGB cung cấp. Nhà cung cấp không tự viết cam kết bảo hành.'], 'DM p.2; HGB'],
  ['16', 'Konformitätserklärung (DoC) (if applicable)', ['Machinery: EC DoC or a document setting out its contents. Radio equipment: full or simplified DoC with URL.', 'Máy móc: DoC EC hoặc tài liệu nêu nội dung DoC. Thiết bị vô tuyến: DoC đầy đủ hoặc rút gọn kèm URL.'], 'MD 1.7.4.2(c) VERIFY; RED Art. 10(9)'],
  ['17', 'Kontakt / Impressum (back cover)', ['"hergestellt für" block, electronic address, Art.-Nr./IAN, type, version code, print date.', 'Khối "hergestellt für", địa chỉ điện tử, Art.-Nr./IAN, kiểu, mã phiên bản, ngày in.'], 'GPSR Art. 9(5–7); DM p.33'],
]));

// 6 Regulatory modules
C.push(...H1('6. Regulatory content modules by product type', '6. Mô-đun nội dung pháp lý theo loại sản phẩm'));
C.push(...bi('Determine applicable legislation with the 4-step pathway method first (quality-compliance-pathway). Standard editions: use the ARENA Regulatory Register / harmonised-standard-lookup – none are fixed here.',
  'Xác định văn bản pháp luật áp dụng bằng phương pháp 4 bước trước (quality-compliance-pathway). Phiên bản tiêu chuẩn: dùng ARENA Regulatory Register / harmonised-standard-lookup – không cố định ở đây.'));
C.push(table([1900, 2300, 3838, 1600], [['Product group', 'Nhóm SP'], ['Legislation (typical)', 'Luật (thường gặp)'], ['Additional IM content', 'Nội dung IM bổ sung'], ['Typical std. family', 'Họ TC thường gặp']], [
  [['All products', 'Mọi sản phẩm'], 'GPSR (EU) 2023/988 (applies since 13 Dec 2024)', ['Product identifier (type/batch/serial); manufacturer name/trade mark, postal and electronic address; instructions and safety information in a language easily understood (Art. 9(5)–(7)). Wording VERIFY on EUR-Lex.', 'Mã nhận dạng SP (kiểu/lô/số sê-ri); tên/nhãn hiệu nhà sản xuất, địa chỉ bưu chính và điện tử; hướng dẫn và thông tin an toàn bằng ngôn ngữ dễ hiểu (Điều 9(5)–(7)). Câu chữ VERIFY trên EUR-Lex.'], 'EN IEC/IEEE 82079-1'],
  [['Corded electric', 'Điện dây'], 'LVD 2014/35/EU · EMC 2014/30/EU · RoHS 2011/65/EU · WEEE 2012/19/EU (DE: ElektroG)', ['Rated voltage/frequency/power; protection class; IP code; extension cable and RCD advice; WEEE symbol + take-back text.', 'Điện áp/tần số/công suất định mức; cấp bảo vệ; mã IP; khuyến nghị dây nối dài và RCD; ký hiệu WEEE + thông tin thu hồi.'], 'EN 60335-x / EN 62841-x'],
  [['Machinery (mowers, trimmers, hedge trimmers, chain saws, shredders, blowers, robotic mowers …)', 'Máy móc (máy cắt cỏ, cắt viền, tông đơ, cưa xích, máy nghiền, máy thổi, robot …)'], 'Machinery Directive 2006/42/EC; **Machinery Regulation (EU) 2023/1230 from 20 Jan 2027** (secondary sources – VERIFY OJ)', ['"Originalbetriebsanleitung" / "Übersetzung der Originalbetriebsanleitung"; full Annex I 1.7.4.2 content: intended use, foreseeable misuse, assembly, adjustment, maintenance, spare parts, noise and vibration values, DoC (or contents). Units placed on the market from 20 Jan 2027: re-check IM against MR Annex III 1.7.4. MR Art. 10(7) allows digital instructions, but safety information on paper for non-professional users (VERIFY verbatim) → **Mr. GARDENER: always supply the full paper IM.**', '"Originalbetriebsanleitung" / "Übersetzung der Originalbetriebsanleitung"; đủ nội dung Phụ lục I 1.7.4.2: mục đích, sử dụng sai dự đoán, lắp ráp, điều chỉnh, bảo trì, phụ tùng, giá trị ồn và rung, DoC (hoặc nội dung). Hàng đưa ra thị trường từ 20/01/2027: kiểm tra lại IM theo MR Phụ lục III 1.7.4. MR Điều 10(7) cho phép hướng dẫn số, nhưng thông tin an toàn phải in giấy cho người dùng không chuyên (VERIFY nguyên văn) → **Mr. GARDENER: luôn kèm IM giấy đầy đủ.**'], 'EN 62841-4-x · EN 60335-2-x · EN 50636-2-x · EN ISO 5395'],
  [['Outdoor equipment (noise)', 'Thiết bị ngoài trời (tiếng ồn)'], 'Outdoor Noise Directive 2000/14/EC', ['Guaranteed sound power level LWA (matches the label on the machine).', 'Mức công suất âm bảo đảm LWA (trùng với nhãn trên máy).'], 'per product std.'],
  [['Petrol engine', 'Động cơ xăng'], 'MD + NRMM Reg. (EU) 2016/1628', ['Fuel/oil type and mixing ratio; refuelling (engine off, cool, outdoors); CO hazard; fuel storage and transport; engine emission information as required (VERIFY).', 'Loại nhiên liệu/dầu, tỷ lệ pha; tiếp nhiên liệu (tắt máy, nguội, ngoài trời); nguy cơ CO; bảo quản và vận chuyển nhiên liệu; thông tin khí thải động cơ theo yêu cầu (VERIFY).'], 'EN ISO 11806 · EN ISO 5395 …'],
  [['Battery-powered + charger', 'Chạy pin + bộ sạc'], 'Battery Reg. (EU) 2023/1542 · LVD (charger) · WEEE; DE: BattDG (VERIFY current German text)', ['Battery type, voltage, capacity, chemistry; charging only with the specified charger; temperature limits; transport; removal/replacement by the end-user; collection and prevention information. Art. 13 label requirements: start date depends on an implementing act reported as not yet adopted – UNVERIFIED; QR code from 18 Feb 2027 – VERIFY.', 'Loại pin, điện áp, dung lượng, hóa học; chỉ sạc bằng bộ sạc quy định; giới hạn nhiệt độ; vận chuyển; người dùng tháo/thay; thông tin thu gom và phòng ngừa. Yêu cầu nhãn Điều 13: ngày áp dụng phụ thuộc văn bản thi hành được báo là chưa ban hành – UNVERIFIED; mã QR từ 18/02/2027 – VERIFY.'], 'EN 62841-1 · EN 60335-2-29 · EN 62133-2'],
  [['Pumps / water technology', 'Bơm / thiết bị nước'], 'LVD · EMC · (MD per pathway)', ['Max. head, flow, immersion depth, liquid temperature; dry-run warning; frost; RCD ≤ 30 mA advice.', 'Cột áp, lưu lượng, độ sâu nhúng tối đa, nhiệt độ chất lỏng; cảnh báo chạy khô; sương giá; khuyến nghị RCD ≤ 30 mA.'], 'EN 60335-2-41 / -51'],
  [['Radio (app, Bluetooth, GNSS – e.g. robotic mower)', 'Vô tuyến (app, Bluetooth, GNSS – vd. robot cắt cỏ)'], 'RED 2014/53/EU incl. Delegated Reg. (EU) 2022/30', ['Frequency bands and max. transmitted power; DoC (full or simplified with URL); software/updates and account/password guidance.', 'Băng tần và công suất phát tối đa; DoC (đầy đủ hoặc rút gọn kèm URL); hướng dẫn phần mềm/cập nhật và tài khoản/mật khẩu.'], 'EN 300 328 · EN 18031-x'],
  [['Non-powered hardware, hoses, fittings, fencing/WPC', 'Dụng cụ không động cơ, ống, khớp nối, hàng rào/WPC'], 'GPSR', ['Assembly instructions, care, safe use and warnings where needed for safe use; content list (cf. DM p.52).', 'Hướng dẫn lắp ráp, bảo dưỡng, sử dụng an toàn và cảnh báo khi cần; danh sách nội dung (xem DM tr.52).'], 'per pathway'],
]));
C.push(spacer());
C.push(...bi('Packaging sorting/recycling labels (PPWR (EU) 2025/40, VerpackG) belong on the packaging, not in the IM. A short disposal hint in chapter 14 is optional.',
  'Nhãn phân loại/tái chế bao bì (PPWR (EU) 2025/40, VerpackG) đặt trên bao bì, không trong IM. Gợi ý thải bỏ ngắn ở chương 14 là tùy chọn.'));

// 7 Language & markets
C.push(...H1('7. Languages and markets', '7. Ngôn ngữ và thị trường'));
C.push(table([2000, 2400, 5238], [['Market', 'Thị trường'], ['Language', 'Ngôn ngữ'], ['Notes', 'Ghi chú']], [
  [['DE, AT', 'DE, AT'], 'German', ['Base version. For machinery the version verified by HGB (as manufacturer) is the "Originalbetriebsanleitung" – HGB confirms which language is the original.', 'Bản gốc. Với máy móc, bản do HGB (nhà sản xuất) xác nhận là "Originalbetriebsanleitung" – HGB xác nhận ngôn ngữ gốc.']],
  [['Other EU / EEA', 'EU / EEA khác'], ['Official language(s) set by each Member State', 'Ngôn ngữ chính thức do mỗi quốc gia quy định'], ['Per Ally order. One multilingual IM or separate IMs; each language complete (no mixed-language tables, cf. IM-GF finding).', 'Theo đơn hàng. Một IM đa ngữ hoặc IM riêng; mỗi ngôn ngữ đầy đủ (không bảng lẫn ngôn ngữ, xem lỗi IM-GF).']],
  [['CH', 'CH'], ['Language(s) of the sales region (DE/FR/IT)', 'Ngôn ngữ vùng bán (DE/FR/IT)'], ['VERIFY with HGB whether CH is in scope.', 'VERIFY với HGB xem CH có trong phạm vi không.']],
  [['NI', 'NI'], 'English', ['EU product rules (Windsor Framework): EU GPSR, CE marking; UKCA not valid. Only if HGB supplies NI.', 'Áp dụng quy định sản phẩm EU (Windsor Framework): EU GPSR, dấu CE; UKCA không hợp lệ. Chỉ khi HGB cung cấp cho NI.']],
  [['GB', 'GB'], 'English', ['GB General Product Safety Regulations 2005; CE accepted for most regimes; GB address requirements VERIFY. Only if in scope.', 'GB General Product Safety Regulations 2005; CE được chấp nhận cho hầu hết lĩnh vực; yêu cầu địa chỉ tại GB VERIFY. Chỉ khi trong phạm vi.']],
], { firstColFill: true }));

// 8 Text blocks
C.push(...H1('8. Standard text blocks', '8. Đoạn văn bản chuẩn'));
C.push(...bi('German text is the IM wording. English is for supplier understanding. Vietnamese is the QS note. Supplier must adapt product-specific parts.',
  'Văn bản tiếng Đức là câu chữ trong IM. Tiếng Anh để nhà cung cấp hiểu. Tiếng Việt là ghi chú cho QS. Nhà cung cấp phải điều chỉnh phần riêng của sản phẩm.'));
C.push(...H2('8.1 Introduction (chapter 2)', '8.1 Lời mở đầu (chương 2)'));
C.push(table([4819, 4819], ['DE (IM text)', ['EN / VN', 'EN / VN']], [[
  'Bitte lesen Sie diese Bedienungsanleitung vor dem ersten Gebrauch vollständig und sorgfältig durch. Sie ist Bestandteil des Produkts und enthält wichtige Hinweise zu Sicherheit, Montage, Gebrauch und Pflege. Beachten Sie alle Sicherheitshinweise. Bewahren Sie die Anleitung für späteres Nachschlagen auf und geben Sie sie bei Weitergabe des Produkts an Dritte mit.',
  ['Read completely before first use; part of the product; safety, assembly, use and care; keep and pass on.', 'Đọc hết trước khi dùng lần đầu; là một phần sản phẩm; an toàn, lắp ráp, sử dụng, bảo dưỡng; lưu giữ và chuyển giao.'],
]]));
C.push(...H2('8.2 Signal words and safety-notice structure', '8.2 Từ tín hiệu và cấu trúc cảnh báo'));
C.push(table([1700, 4300, 3638], ['DE', ['Meaning (EN)', 'Ý nghĩa (EN)'], ['Use', 'Dùng khi']], [
  ['**GEFAHR**', ['Hazard with high risk: death or serious injury if not avoided.', 'Nguy hiểm mức cao: tử vong hoặc thương tích nặng nếu không tránh.'], ['Imminent hazard', 'Nguy hiểm trực tiếp']],
  ['**WARNUNG**', ['Hazard with medium risk: may cause death or serious injury.', 'Nguy hiểm mức trung bình: có thể gây tử vong hoặc thương tích nặng.'], ['Potential hazard', 'Nguy hiểm tiềm ẩn']],
  ['**VORSICHT**', ['Hazard with low risk: minor or moderate injury.', 'Nguy hiểm mức thấp: thương tích nhẹ hoặc vừa.'], ['Minor injury', 'Thương tích nhẹ']],
  ['**HINWEIS**', ['Property damage / important information (no personal injury).', 'Hư hỏng tài sản / thông tin quan trọng (không gây thương tích).'], ['No safety-alert triangle', 'Không dùng tam giác cảnh báo']],
]));
C.push(...bi('Each notice: safety sign + signal word → type and source of hazard → possible consequence → measures to avoid it (EN IEC/IEEE 82079-1; ISO 3864-2 signal-word panel). Mandatory general warnings from the product standard are reproduced verbatim (official German translation) and are not shortened.',
  'Mỗi cảnh báo: ký hiệu an toàn + từ tín hiệu → loại và nguồn nguy hiểm → hậu quả có thể → biện pháp phòng tránh (EN IEC/IEEE 82079-1; ISO 3864-2). Cảnh báo chung bắt buộc của tiêu chuẩn SP được giữ nguyên văn (bản dịch tiếng Đức chính thức) và không được rút gọn.'));
C.push(...H2('8.3 Contact block (back cover)', '8.3 Khối liên hệ (bìa sau)'));
C.push(table([4819, 4819], ['DE (IM text)', ['Rule', 'Quy tắc']], [[
  'hergestellt für:|**hagebau Handelsgesellschaft für Baustoffe mbH & Co. KG**|Celler Straße 47, D-29614 Soltau|www.hagebau.de · [electronic address ___]|Art.-Nr./IAN: [___] · Typ: [___]|V[YYYYMM] · [MM/YY]',
  ['DM p.33 variant B (HGB = main consignor). Address as printed in DM 2019 – VERIFY current address and the electronic contact address with HGB. Variant A ("Hersteller: <supplier>") only on HGB written instruction – under GPSR the own-brand owner is the manufacturer.', 'DM tr.33 phương án B (HGB là bên gửi chính). Địa chỉ theo DM 2019 – VERIFY địa chỉ hiện tại và địa chỉ liên hệ điện tử với HGB. Phương án A ("Hersteller: <nhà cung cấp>") chỉ khi HGB chỉ thị bằng văn bản – theo GPSR chủ nhãn hiệu riêng là nhà sản xuất.'],
]]));
C.push(...H2('8.4 Disposal (chapter 14)', '8.4 Thải bỏ (chương 14)'));
C.push(...bullets([
  ['Use the crossed-out wheeled bin symbol and the ElektroG text block of IM-GF (items 1–4: separate collection, removal of batteries/lamps, take-back options, data deletion). Keep the text identical to the HGB-approved block.', 'Dùng ký hiệu thùng rác có bánh gạch chéo và khối văn bản ElektroG của IM-GF (mục 1–4: thu gom riêng, tháo pin/đèn, nơi trả lại, xóa dữ liệu). Giữ nguyên như khối HGB đã duyệt.'],
  ['Products with batteries (incl. remote-control coin cells): add the battery disposal and take-back text (Battery Reg. / BattDG – VERIFY current German wording) and chemical symbols where applicable (Hg, Cd, Pb).', 'Sản phẩm có pin (kể cả pin cúc của điều khiển): thêm văn bản thải bỏ và thu hồi pin (Battery Reg. / BattDG – VERIFY câu chữ tiếng Đức hiện hành) và ký hiệu hóa học nếu có (Hg, Cd, Pb).'],
]));

// 9 Corrections to IM-GF
C.push(...H1('9. Corrections to the current IM general format', '9. Sửa lỗi cho IM general format hiện tại'));
C.push(table([500, 3200, 4238, 1700], [['#', '#'], ['Finding (IM-GF)', 'Phát hiện (IM-GF)'], ['Action', 'Hành động'], ['Class', 'Mức']], [
  ['1', ['Cover shows nuval GmbH logo/address and service@nuval.de', 'Bìa có logo/địa chỉ nuval GmbH và service@nuval.de'], ['Replace with Mr. GARDENER cover (§4.7) and HGB "hergestellt für" block (§8.3).', 'Thay bằng bìa Mr. GARDENER (§4.7) và khối "hergestellt für" của HGB (§8.3).'], 'Major'],
  ['2', ['Safety bullet truncated: "Wasser oder an"', 'Gạch đầu dòng an toàn bị cắt: "Wasser oder an"'], ['Complete the sentence from the risk assessment (e.g. keep away from water or other liquids).', 'Hoàn thiện câu theo đánh giá rủi ro (vd. tránh xa nước hoặc chất lỏng khác).'], 'Major'],
  ['3', ['English left in German text: "LED candle", "Remote control", "battery"', 'Còn tiếng Anh trong bản Đức: "LED candle", "Remote control", "battery"'], ['Translate: "LED-Kerze", "Fernbedienung", "Batterie".', 'Dịch: "LED-Kerze", "Fernbedienung", "Batterie".'], 'Major'],
  ['4', ['Typos: "Lichtfarbe;", "Hausmüllentsorgt", "Produkt Name", "Ca."', 'Lỗi chính tả: "Lichtfarbe;", "Hausmüllentsorgt", "Produkt Name", "Ca."'], ['"Lichtfarbe:", "Hausmüll entsorgt", "Produktname", "ca."', '"Lichtfarbe:", "Hausmüll entsorgt", "Produktname", "ca."'], 'Minor'],
  ['5', ['Open comment: "Will you include the German plate?"', 'Nhận xét mở: "Will you include the German plate?"'], ['Yes – reproduce the type plate (DM p.43 look) in chapter 5.', 'Có – tái hiện nhãn thông số (theo DM tr.43) ở chương 5.'], 'Minor'],
  ['6', ['Safety notices are plain bullets without signal words', 'Cảnh báo chỉ là gạch đầu dòng, không có từ tín hiệu'], ['Apply §8.2 structure for hazards identified in the risk assessment.', 'Áp dụng cấu trúc §8.2 cho các nguy hiểm trong đánh giá rủi ro.'], 'Major'],
  ['7', ['No foreseeable misuse, troubleshooting table, spare-part/service chapter', 'Thiếu sử dụng sai dự đoán, bảng khắc phục lỗi, chương phụ tùng/dịch vụ'], ['Add chapters 3, 12, 13 per §5.', 'Bổ sung chương 3, 12, 13 theo §5.'], 'Major'],
  ['8', ['Disposal covers ElektroG only; product contains AA cells and a CR2025 coin cell', 'Thải bỏ chỉ có ElektroG; SP có pin AA và pin cúc CR2025'], ['Add battery disposal text (§8.4); add coin-cell ingestion warning if required by the product standard (VERIFY).', 'Thêm văn bản thải bỏ pin (§8.4); thêm cảnh báo nuốt pin cúc nếu tiêu chuẩn SP yêu cầu (VERIFY).'], 'Major'],
  ['9', ['CE text refers to "EU-Richtlinien" only', 'Giải thích CE chỉ nhắc "EU-Richtlinien"'], ['Use "EU-Rechtsvorschriften" (covers Directives and Regulations) or delete the CE explanation (not mandatory).', 'Dùng "EU-Rechtsvorschriften" (bao gồm Chỉ thị và Quy định) hoặc bỏ giải thích CE (không bắt buộc).'], 'Minor'],
  ['10', ['Version "V202603" and date code "26/06" not defined', 'Mã "V202603" và "26/06" chưa định nghĩa'], ['Define: V = YYYYMM of IM revision; [MM/YY] = print date. Same code on file name, footer and TCF.', 'Định nghĩa: V = YYYYMM của lần sửa IM; [MM/YY] = ngày in. Cùng mã ở tên file, chân trang và TCF.'], 'Minor'],
  ['11', ['TOC page numbers', 'Số trang mục lục'], ['Regenerate after final layout.', 'Cập nhật lại sau khi dàn trang cuối.'], 'Minor'],
]));

// 10 Checklist
C.push(...H1('10. QS pre-submission checklist (S4)', '10. Danh mục kiểm tra của QS trước khi gửi (S4)'));
C.push(...bi('Class: C = Critical (IM unsafe/illegal, blocks approval) · M = Major · m = Minor. Result: OK / NOK / N/A.', 'Mức: C = Nghiêm trọng (IM không an toàn/không hợp pháp, chặn phê duyệt) · M = Nặng · m = Nhẹ. Kết quả: OK / NOK / N/A.'));
const chk = [
  ['Correct product: Art.-Nr./IAN, type and drawings match the golden sample', 'Đúng sản phẩm: Art.-Nr./IAN, kiểu và bản vẽ khớp mẫu chuẩn', 'C'],
  ['All safety warnings required by the product standard present, verbatim', 'Đủ cảnh báo an toàn theo tiêu chuẩn SP, nguyên văn', 'C'],
  ['Hazards from the risk assessment covered with structured notices', 'Các nguy hiểm trong đánh giá rủi ro được cảnh báo có cấu trúc', 'C'],
  ['Every language complete and correct; no mixed languages', 'Mỗi ngôn ngữ đầy đủ, đúng; không lẫn ngôn ngữ', 'C'],
  ['GPSR identification: type/batch/serial reference; HGB name, postal + electronic address', 'Nhận dạng GPSR: kiểu/lô/sê-ri; tên HGB, địa chỉ bưu chính + điện tử', 'C'],
  ['Technical data = test reports = type plate (incl. LWA, LpA, K, ah)', 'Thông số = báo cáo thử = nhãn thông số (kể cả LWA, LpA, K, ah)', 'C'],
  ['Machinery: "Original-/Übersetzung der Originalbetriebsanleitung" and DoC (or contents)', 'Máy móc: "Original-/Übersetzung der Originalbetriebsanleitung" và DoC (hoặc nội dung)', 'M'],
  ['Intended use and foreseeable misuse stated', 'Nêu mục đích sử dụng và sử dụng sai dự đoán', 'M'],
  ['Symbols on product/type plate all explained; safety signs per ISO 7010', 'Giải thích đủ ký hiệu trên SP/nhãn; ký hiệu an toàn theo ISO 7010', 'M'],
  ['Battery chapter (if applicable): charging, storage, transport, removal, disposal', 'Chương pin (nếu có): sạc, bảo quản, vận chuyển, tháo, thải bỏ', 'M'],
  ['Disposal chapter: WEEE symbol + ElektroG + battery text', 'Chương thải bỏ: ký hiệu WEEE + ElektroG + văn bản pin', 'M'],
  ['Assembly, operation, maintenance, troubleshooting, spare parts complete', 'Đủ lắp ráp, vận hành, bảo trì, khắc phục lỗi, phụ tùng', 'M'],
  ['Warranty text only from HGB', 'Văn bản bảo hành chỉ từ HGB', 'M'],
  ['Original logo file used; proportional scaling; correct variant', 'Dùng file logo gốc; thu phóng đúng tỷ lệ; đúng biến thể', 'M'],
  ['Orange line, green bar, green-yellow line per DM CMYK values', 'Đường cam, thanh xanh, đường xanh-vàng đúng CMYK của DM', 'm'],
  ['Fonts Impact/Univers; body 100 % K; size ≥ house minimum', 'Phông Impact/Univers; chữ thân 100 % K; cỡ ≥ tối thiểu nội bộ', 'm'],
  ['Cover: no sales teaser; image fond matches product range', 'Bìa: không teaser bán hàng; ảnh nền đúng nhóm SP', 'm'],
  ['Version code and print date consistent (file, footer, TCF)', 'Mã phiên bản và ngày in nhất quán (file, chân trang, TCF)', 'm'],
  ['TOC and cross-references correct after layout', 'Mục lục và tham chiếu chéo đúng sau dàn trang', 'm'],
  ['Glasmeyer/HGB written approval filed in TCF before ETD − 45 days', 'Phê duyệt bằng văn bản của Glasmeyer/HGB lưu trong TCF trước ETD − 45 ngày', 'C'],
];
C.push(table([600, 6638, 800, 1600], [['ID', 'ID'], ['Check', 'Nội dung kiểm tra'], ['Class', 'Mức'], ['Result', 'Kết quả']],
  chk.map((c, i) => [`IM-${String(i + 1).padStart(2, '0')}`, [c[0], c[1]], c[2], ''])));

// 11 Open points
C.push(...H1('11. Open points and VERIFY register', '11. Điểm mở và danh sách VERIFY'));
C.push(table([500, 4400, 3138, 1600], [['#', '#'], ['Topic', 'Chủ đề'], ['Status / action', 'Trạng thái / hành động'], ['Owner', 'Phụ trách']], [
  ['1', ['EN 82079 edition. DM p.2 cites "DIN EN 82079 (IEC 82079:2013)". First edition was IEC 82079-1:2012 / EN 82079-1:2012, replaced by IEC/IEEE 82079-1:2019 = **EN IEC/IEEE 82079-1:2020** (catalogue sources; no amendment found). Not an OJ-cited hEN → SoA = 2020 edition (rulebook §3).', 'Phiên bản EN 82079. DM tr.2 ghi "DIN EN 82079 (IEC 82079:2013)". Bản đầu là IEC 82079-1:2012 / EN 82079-1:2012, được thay bằng IEC/IEEE 82079-1:2019 = **EN IEC/IEEE 82079-1:2020** (nguồn danh mục; không thấy sửa đổi). Không phải hEN trích dẫn trên OJ → SoA = bản 2020 (rulebook §3).'], ['Guideline built to 2020 (covers 2012 principles). Obtain HGB/Glasmeyer written confirmation that DM reference is read as current edition.', 'Hướng dẫn xây theo bản 2020 (bao gồm nguyên tắc 2012). Xin HGB/Glasmeyer xác nhận bằng văn bản rằng tham chiếu DM được hiểu là bản hiện hành.'], 'QS → HGB'],
  ['2', ['Design Manual status 13.06.2019 – still the valid version? (DM p.2: older versions invalid)', 'Design Manual ngày 13.06.2019 – còn hiệu lực? (DM tr.2: bản cũ hết hiệu lực)'], ['Confirm with Glasmeyer.', 'Xác nhận với Glasmeyer.'], 'QS'],
  ['3', ['Machinery Regulation (EU) 2023/1230 application 20 Jan 2027 and Art. 10(7) paper rule', 'Ngày áp dụng MR (EU) 2023/1230 20/01/2027 và quy tắc giấy Điều 10(7)'], ['Secondary sources only; EUR-Lex not reachable from this session. VERIFY on OJ.', 'Chỉ nguồn thứ cấp; không truy cập được EUR-Lex. VERIFY trên OJ.'], 'IQA'],
  ['4', ['GPSR Art. 9(5)–(7) exact wording; "electronic address" (corrigendum)', 'Câu chữ GPSR Điều 9(5)–(7); "địa chỉ điện tử" (đính chính)'], ['VERIFY on EUR-Lex; HGB to name the electronic contact address.', 'VERIFY trên EUR-Lex; HGB chỉ định địa chỉ liên hệ điện tử.'], 'IQA / HGB'],
  ['5', ['Battery Reg. Art. 13 label start date (implementing act), QR code date, BattDG German text', 'Ngày áp dụng nhãn Điều 13 (văn bản thi hành), ngày mã QR, văn bản BattDG tiếng Đức'], ['UNVERIFIED – check Register / OJ.', 'UNVERIFIED – kiểm tra Register / OJ.'], 'IQA'],
  ['6', ['ARENA Regulatory Register mirror not yet synced (created 29 Oct 2026)', 'Bản sao Regulatory Register chưa đồng bộ (tạo 29/10/2026)'], ['Re-check entries after the weekly watch run; update this guideline if needed.', 'Kiểm tra lại sau lượt rà soát hàng tuần; cập nhật hướng dẫn nếu cần.'], 'IQA'],
  ['7', ['IM format (A5), print spec, heading font, house minimum font size', 'Khổ IM (A5), thông số in, phông tiêu đề, cỡ chữ tối thiểu'], ['Recommendations – confirm with Glasmeyer at S5.', 'Khuyến nghị – xác nhận với Glasmeyer ở S5.'], 'Supplier / QS'],
  ['8', ['Markets beyond DE/AT (CH, NI, GB) and required languages', 'Thị trường ngoài DE/AT (CH, NI, GB) và ngôn ngữ yêu cầu'], ['Confirm with HGB per order.', 'Xác nhận với HGB theo đơn hàng.'], 'QS'],
  ['9', ['Glasmeyer contacts (DM p.2: A. Ingelmann, K. Wendt) still current?', 'Liên hệ Glasmeyer (DM tr.2: A. Ingelmann, K. Wendt) còn đúng?'], ['Confirm before S5.', 'Xác nhận trước S5.'], 'QS'],
]));

// Sources
C.push(...H1('12. Sources', '12. Nguồn tham khảo'));
C.push(...bullets([
  ['Mr. GARDENER Design Manual, Glasmeyer Branding GmbH for hagebau, status 13.06.2019, p.2, 5–10, 12–13, 17–23, 30–35, 38, 40–41, 43.', 'Design Manual Mr. GARDENER, Glasmeyer Branding GmbH cho hagebau, ngày 13.06.2019.'],
  ['IM general format 24 March 2026 (art. 997447, DE) incl. reviewer comment.', 'IM general format 24/03/2026 (mã 997447, DE) kèm nhận xét.'],
  ['ARENA rulebook rev. c2, 1 Nov 2026 (§2 roles, §3 edition rule and ETD gates, §6 document rules).', 'ARENA rulebook rev. c2, 01/11/2026.'],
  ['Web (secondary, checked 2 Nov 2026): tekom "New Machinery Regulation"; ibf-solutions (digital instructions, Art. 10(7)); Eurofins (GPSR manufacturer obligations); Pryor/Compliancegate (Battery Reg. Art. 13); iTeh/DIN Media/AFNOR catalogues (EN IEC/IEEE 82079-1:2020).', 'Web (nguồn thứ cấp, kiểm tra 02/11/2026): tekom; ibf-solutions; Eurofins; Pryor/Compliancegate; danh mục iTeh/DIN Media/AFNOR.'],
]));

// ---------- document ----------
const doc = new Document({
  creator: 'A.R.E.N.A. Vietnam – IQA', features: { updateFields: true }, title: 'Mr. GARDENER IM Guideline', description: 'ARENA-GL-GARDEN-IM-MRG-01 Rev.0',
  styles: {
    default: { document: { run: { font: 'Arial', size: 20 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true, font: 'Arial', color: NAVY }, paragraph: { spacing: { before: 320, after: 0 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: BLUE }, paragraph: { spacing: { before: 220, after: 0 }, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CORAL, space: 4 } }, children: [run('A.R.E.N.A. Vietnam · ARENA-GL-GARDEN-IM-MRG-01 Rev.0 · Mr. GARDENER IM Guideline', { size: 16, color: NAVY })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run('DRAFT · 02 Nov 2026 · Page ', { size: 16, color: GREY }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: GREY })] })] }) },
    children: C,
  }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync(path.join(__dirname, '..', 'ARENA-GL-GARDEN-IM-MRG-01_Rev0_MrGardener_IM_Guideline.docx'), b); console.log('written'); });
