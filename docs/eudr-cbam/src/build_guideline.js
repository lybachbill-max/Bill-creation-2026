// Builds the bilingual EUDR & CBAM alignment guideline (.docx).
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, AlignmentType, HeadingLevel, LevelFormat, Header, Footer,
  PageNumber, TableOfContents, PageBreak,
} = require('docx');
const C = require('./content');

const NAVY = '151F37', CORAL = 'C24A28', BLUE = '006293', GREY = '5A6270', TINT = 'E6EFF4', LINE = 'B8C4CC';
const FONT = 'Arial';
const PAGE_W = 11906, MARGIN = 1000, CONTENT_W = PAGE_W - 2 * MARGIN; // 9906 DXA

// ---------- helpers
const enRun = (t, o = {}) => new TextRun({ text: t, font: FONT, size: o.size || 20, bold: o.bold, color: o.color });
const vnRun = (t, o = {}) => new TextRun({ text: t, font: FONT, size: o.size || 18, italics: true, color: o.color || GREY });

// Bilingual paragraph pair (EN line above VN line)
function bi(item, o = {}) {
  return [
    new Paragraph({ children: [enRun(item.en, o)], spacing: { after: 0 }, keepNext: true, ...(o.bullet ? { numbering: { reference: 'bul', level: 0 } } : {}) }),
    new Paragraph({ children: [vnRun(item.vn, o)], spacing: { after: o.after ?? 120 }, ...(o.bullet ? { indent: { left: 720 } } : {}) }),
  ];
}
const biList = (items) => items.flatMap((it) => bi(it, { bullet: true }));

function heading(item, level = 1) {
  const hl = level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2;
  return [
    new Paragraph({ heading: hl, children: [new TextRun({ text: item.en })] }),
    new Paragraph({ children: [vnRun(item.vn, { size: level === 1 ? 22 : 20, color: BLUE })], spacing: { after: 160 }, keepNext: true }),
  ];
}

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: border, bottom: border, left: border, right: border };

function cellContent(v, header) {
  if (v && typeof v === 'object' && 'en' in v) {
    return [
      new Paragraph({ children: [enRun(v.en, { size: 17, bold: header, color: header ? 'FFFFFF' : undefined })], spacing: { after: 0 } }),
      new Paragraph({ children: [vnRun(v.vn, { size: 15, color: header ? 'DDE6EC' : GREY })], spacing: { after: 0 } }),
    ];
  }
  return [new Paragraph({ children: [enRun(String(v), { size: 17, bold: header, color: header ? 'FFFFFF' : undefined })] })];
}

// widths: fractions summing to 1
function table(headers, rows, fracs) {
  const widths = fracs.map((f) => Math.floor(f * CONTENT_W));
  widths[widths.length - 1] = CONTENT_W - widths.slice(0, -1).reduce((a, x) => a + x, 0);
  const mk = (vals, header, zebra) => new TableRow({
    tableHeader: header,
    cantSplit: true,
    children: vals.map((v, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      borders,
      margins: { top: 60, bottom: 60, left: 90, right: 90 },
      shading: header ? { type: ShadingType.CLEAR, color: 'auto', fill: NAVY } : zebra ? { type: ShadingType.CLEAR, color: 'auto', fill: TINT } : undefined,
      children: cellContent(v, header),
    })),
  });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [mk(headers, true), ...rows.map((r, i) => mk(r, false, i % 2 === 1))],
  });
}
const gap = () => new Paragraph({ children: [], spacing: { after: 120 } });
const note = (item) => bi(item, { size: 16, after: 200 });

function callout(item, color = CORAL) {
  return new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 24, color, space: 8 } },
    indent: { left: 200 },
    spacing: { before: 120, after: 200 },
    children: [enRun(item.en, { bold: true, color: NAVY }), new TextRun({ break: 1 }), vnRun(item.vn)],
  });
}

const H = (en, vn) => ({ en, vn });

// ---------- cover
const cover = [
  new Paragraph({ spacing: { before: 2200 }, children: [new TextRun({ text: 'A.R.E.N.A. VIETNAM · QUALITY & COMPLIANCE', font: FONT, size: 20, bold: true, color: CORAL })] }),
  new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: C.META.title.en, font: FONT, size: 56, bold: true, color: NAVY })] }),
  new Paragraph({ children: [new TextRun({ text: C.META.title.vn, font: FONT, size: 36, color: BLUE })] }),
  new Paragraph({ spacing: { before: 200, after: 600 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORAL, space: 6 } }, children: [enRun(C.META.subtitle.en, { size: 22 }), new TextRun({ break: 1 }), vnRun(C.META.subtitle.vn, { size: 20 })] }),
  table([H('Field', 'Mục'), H('Value', 'Giá trị')], [
    [H('Document ID', 'Mã tài liệu'), C.META.docId],
    [H('Revision', 'Phiên bản'), C.META.rev],
    [H('Date', 'Ngày'), C.META.date],
    [H('Owner', 'Chủ trì'), C.META.owner],
    [H('Approval', 'Phê duyệt'), C.META.approver],
    [H('Governing rules', 'Quy tắc áp dụng'), 'ARENA Rulebook rev. c2 · ARENA-SOP-00-00-INT'],
  ], [0.3, 0.7]),
  gap(),
  ...C.META.statusBasis.flatMap((s) => bi(s, { size: 16, after: 100 })),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ children: [enRun('Contents · Mục lục', { bold: true, size: 26, color: NAVY })], spacing: { after: 120 } }),
  new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-2' }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- body
const body = [
  ...heading(H('1. Purpose and scope', '1. Mục đích và phạm vi')),
  ...heading(H('1.1 Purpose', '1.1 Mục đích'), 2), ...biList(C.PURPOSE),
  ...heading(H('1.2 Scope', '1.2 Phạm vi'), 2), ...biList(C.SCOPE),

  ...heading(H('2. A.R.E.N.A. supporting role and role matrix', '2. Vai trò hỗ trợ của A.R.E.N.A. và ma trận vai trò')),
  callout(C.POSITION_HEADLINE, BLUE),
  ...biList(C.POSITION),
  callout(H('Rule: supporting office overall. EUDR — no regulatory role. CBAM — drafts only, on written Ally request, case by case.', 'Quy tắc: văn phòng hỗ trợ. EUDR — không có vai trò pháp lý. CBAM — chỉ soạn dự thảo, khi Ally yêu cầu bằng văn bản, từng trường hợp.')),
  table([H('Regime', 'Quy định'), H('A.R.E.N.A. (supporting office)', 'A.R.E.N.A. (văn phòng hỗ trợ)'), H('Supplier', 'Nhà cung cấp'), H('Ally / importer', 'Ally / nhà nhập khẩu')], C.ROLE_MATRIX, [0.14, 0.28, 0.29, 0.29]),
  ...note(C.ROLE_NOTE),

  ...heading(H('3. EUDR — EU requirements', '3. EUDR — Yêu cầu của EU')),
  ...heading(H('3.1 Regulatory status (live check 9 Nov 2026)', '3.1 Tình trạng pháp lý (kiểm tra 9/11/2026)'), 2),
  table([H('Item', 'Mục'), H('Status', 'Tình trạng'), H('Source', 'Nguồn')], C.EUDR_STATUS, [0.26, 0.54, 0.2]),
  gap(),
  ...heading(H('3.2 Commodity scope after Delegated Reg. (EU) 2026/2102', '3.2 Phạm vi hàng hóa sau QĐ ủy quyền (EU) 2026/2102'), 2),
  table([H('Commodity', 'Hàng hóa'), H('Typical items', 'Mặt hàng điển hình'), H('2026/2102 effect', 'Ảnh hưởng của 2026/2102')], C.EUDR_COMMODITIES, [0.18, 0.37, 0.45]),
  gap(),
  ...heading(H('3.3 Operator duties (Supplier or Ally — never A.R.E.N.A.)', '3.3 Nghĩa vụ của Operator (Nhà cung cấp hoặc Ally — không bao giờ là A.R.E.N.A.)'), 2),
  ...biList(C.EUDR_OPERATOR_DUTIES),
  ...heading(H('3.4 A.R.E.N.A. working rules for EUDR', '3.4 Quy tắc làm việc của A.R.E.N.A. đối với EUDR'), 2),
  ...biList(C.EUDR_ARENA_RULES),

  ...heading(H('4. CBAM — EU and UK requirements', '4. CBAM — Yêu cầu của EU và Anh')),
  ...heading(H('4.1 Regulatory status (live check 9 Nov 2026)', '4.1 Tình trạng pháp lý (kiểm tra 9/11/2026)'), 2),
  table([H('Item', 'Mục'), H('Status', 'Tình trạng'), H('Source', 'Nguồn')], C.CBAM_STATUS, [0.24, 0.56, 0.2]),
  gap(),
  ...heading(H('4.2 CN scope for A.R.E.N.A. product families', '4.2 Phạm vi mã CN cho các nhóm hàng A.R.E.N.A.'), 2),
  table([H('CN', 'CN'), H('Description', 'Mô tả'), H('Annex I', 'Phụ lục I'), H('Department / note', 'Ngành hàng / ghi chú')], C.CBAM_CN, [0.18, 0.4, 0.12, 0.3]),
  ...note(C.CBAM_CN_NOTE),
  ...heading(H('4.3 Market split', '4.3 Phân chia thị trường'), 2),
  table([H('Market', 'Thị trường'), H('CBAM position', 'Vị trí CBAM')], C.CBAM_MARKETS, [0.25, 0.75]),
  gap(),
  ...heading(H('4.4 Declarant / importer duties (Ally side)', '4.4 Nghĩa vụ của người khai / nhà nhập khẩu (phía Ally)'), 2),
  ...biList(C.CBAM_DECLARANT_DUTIES),

  ...heading(H('5. A.R.E.N.A. CBAM procedure (on written Ally request)', '5. Quy trình CBAM của A.R.E.N.A. (khi Ally yêu cầu bằng văn bản)')),
  table([H('Step', 'Bước'), H('Action', 'Hành động'), H('Owner', 'Phụ trách'), H('Record', 'Hồ sơ')], C.CBAM_WORKFLOW, [0.13, 0.55, 0.15, 0.17]),
  gap(),
  ...heading(H('5.1 Supplier data to request (EU Communication Template v2.1.1)', '5.1 Dữ liệu cần yêu cầu nhà cung cấp (Mẫu trao đổi thông tin EU v2.1.1)'), 2),
  ...biList(C.CBAM_SUPPLIER_DATA),
  ...note(H('Tool: the CBAM Communication Console in this repository (index.html) gives the cell-by-cell guide, scope check, SEE ledger and gap register for the template.', 'Công cụ: CBAM Communication Console trong kho mã (index.html) hướng dẫn từng ô, kiểm tra phạm vi, sổ SEE và sổ khoảng trống cho mẫu.')),
  ...heading(H('5.2 Boundaries', '5.2 Giới hạn'), 2),
  ...biList(C.CBAM_ARENA_RULES),
  ...heading(H('5.3 CBAM cost next to FOB — default and actual values', '5.3 Chi phí CBAM bên cạnh giá FOB — giá trị mặc định và thực tế'), 2),
  callout(H('FOB + CBAM line (default | actual) — never CBAM inside FOB.', 'FOB + dòng CBAM (mặc định | thực tế) — không bao giờ gộp CBAM vào FOB.'), BLUE),
  ...biList(C.CBAM_COST_PRINCIPLES),
  table([H('Element', 'Yếu tố'), H('Default value (route A)', 'Giá trị mặc định (phương án A)'), H('Actual value (route C)', 'Giá trị thực tế (phương án C)')], C.CBAM_COST_FORMULA, [0.2, 0.4, 0.4]),
  gap(),
  ...bi(C.CBAM_COST_EXAMPLE_INTRO, { size: 18 }),
  table([H('Route', 'Phương án'), H('SEE used tCO₂e/t', 'SEE áp dụng'), H('SEFA tCO₂e/t', 'SEFA'), H('Cert. per t', 'Chứng chỉ/tấn'), H('CBAM €/pc', 'CBAM €/sp'), H('% of FOB', '% FOB')],
    C.CBAM_COST_EXAMPLE, [0.3, 0.17, 0.19, 0.1, 0.12, 0.12]),
  gap(),
  table([H('Import year (route A, €82.32 held)', 'Năm nhập khẩu (A, giữ giá 82,32 €)'), H('CBAM €/pc', 'CBAM €/sp'), H('% of FOB', '% FOB')], C.CBAM_COST_PROJECTION, [0.5, 0.25, 0.25]),
  gap(),
  ...biList(C.CBAM_COST_EXAMPLE_NOTES),
  ...heading(H('5.4 Origin comparison — Viet Nam, China, India (default route)', '5.4 So sánh xuất xứ — Việt Nam, Trung Quốc, Ấn Độ (giá trị mặc định)'), 2),
  ...biList(C.ORIGIN_INTRO),
  table([H('CN', 'CN'), H('Goods', 'Hàng hóa'), H('Default VN', 'Mặc định VN'), H('Default IN', 'Mặc định IN'), H('Default CN', 'Mặc định CN'),
    H('€/t 2026 VN · IN · CN', '€/tấn 2026 VN · IN · CN'), H('€/t 2028 VN · IN · CN', '€/tấn 2028 VN · IN · CN')],
    C.ORIGIN_MATRIX, [0.12, 0.22, 0.09, 0.09, 0.09, 0.195, 0.195]),
  ...note(H('Default values in tCO₂e/t before mark-up. € per tonne of goods at €82.32 per certificate.', 'Giá trị mặc định tính bằng tCO₂e/tấn, trước mức cộng. € mỗi tấn hàng với giá 82,32 €/chứng chỉ.')),
  ...biList(C.ORIGIN_NOTES),
  ...note(H('Tool: skill cbam-default-value-po-cost builds the per-P.O./P.I. cost pack (A/B/C comparison, € per piece, % of FOB, 50 t check, 2026–2034 projection) as a DRAFT for Ally review.', 'Công cụ: skill cbam-default-value-po-cost lập bảng chi phí theo P.O./P.I. (so sánh A/B/C, €/sp, % FOB, kiểm tra 50 tấn, dự báo 2026–2034) dưới dạng DỰ THẢO để Ally xem xét.')),

  ...heading(H('6. Alignment with A.R.E.N.A. procedures', '6. Đối chiếu với quy trình A.R.E.N.A.')),
  ...bi(H('Neither regime adds a gate to ARENA-SOP-00-00-INT or a link to the 8-link compliance chain. The table shows how each touchpoint treats EUDR and CBAM.', 'Không quy định nào thêm cổng vào ARENA-SOP-00-00-INT hay mắt xích vào chuỗi tuân thủ 8 mắt xích. Bảng dưới cho biết cách mỗi điểm tiếp xúc xử lý EUDR và CBAM.')),
  table([H('A.R.E.N.A. touchpoint', 'Điểm tiếp xúc A.R.E.N.A.'), H('EUDR', 'EUDR'), H('CBAM', 'CBAM')], C.SOP_ALIGNMENT, [0.28, 0.36, 0.36]),
  gap(),

  ...heading(H('7. Key dates 2025–2028', '7. Các mốc thời gian 2025–2028')),
  table([H('Date', 'Ngày'), H('Event', 'Sự kiện'), H('Regime', 'Quy định')], C.TIMELINE, [0.16, 0.66, 0.18]),
  gap(),

  ...heading(H('8. Skill and tool corrections (for Register §5)', '8. Hiệu chỉnh skill và công cụ (cho Sổ đăng ký §5)')),
  table([H('Skill / tool', 'Skill / công cụ'), H('Snapshot says', 'Bản cũ ghi'), H('Verified / rule', 'Đã xác minh / quy tắc')], C.SKILL_FLAGS, [0.24, 0.38, 0.38]),
  gap(),

  ...heading(H('9. VERIFY register (open before Rev. 1)', '9. Danh sách VERIFY (cần xử lý trước Rev. 1)')),
  ...biList(C.VERIFY),

  ...heading(H('10. Sources', '10. Nguồn')),
  ...C.SOURCES.map((s) => new Paragraph({ numbering: { reference: 'num', level: 0 }, children: [enRun(s, { size: 18 })], spacing: { after: 60 } })),
];

const doc = new Document({
  creator: 'IQA',
  title: `${C.META.docId} ${C.META.title.en}`,
  styles: {
    default: { document: { run: { font: FONT, size: 20 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 30, bold: true, color: NAVY }, paragraph: { spacing: { before: 360, after: 0 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 23, bold: true, color: BLUE }, paragraph: { spacing: { before: 240, after: 0 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  features: { updateFields: true },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 1100, bottom: 1100, left: MARGIN, right: MARGIN } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${C.META.docId} · ${C.META.rev}`, font: FONT, size: 14, color: GREY })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ font: FONT, size: 14, color: GREY, children: ['Internal — A.R.E.N.A. Vietnam Quality & Compliance · Page ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES] })] })] }) },
    children: [...cover, ...body],
  }],
});

const out = path.join(__dirname, '..', `${C.META.docId}_EUDR_CBAM_Alignment_Guideline_Rev0.docx`);
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('wrote', out); });
