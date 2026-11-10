// Shared bilingual content for the EUDR & CBAM alignment guideline and deck.
// Every text item is { en, vn }: English line on top, Vietnamese below.
// Status basis: live check 9 Nov 2026 (see SOURCES / VERIFY). Do not edit dates
// without re-checking the official text and the ARENA Regulatory Register.

const b = (en, vn) => ({ en, vn });

const META = {
  docId: 'ARENA-GL-QC-EUDR-CBAM-01',
  rev: 'Rev. 0 (DRAFT for QS review)',
  date: '9 Nov 2026',
  owner: 'IQA (Lybachbill)',
  approver: 'Quality Director [___]',
  title: b('EUDR & CBAM Alignment Guideline', 'Hướng dẫn tuân thủ EUDR & CBAM'),
  subtitle: b(
    'EU requirements mapped to A.R.E.N.A. procedures — roles, boundaries, workflow',
    'Yêu cầu EU đối chiếu với quy trình A.R.E.N.A. — vai trò, giới hạn, quy trình',
  ),
  statusBasis: [
    b('Status basis: live check on 9 Nov 2026. The ARENA Regulatory Register mirror was not synced (last modified 28 Oct 2026) and could not be relied on.',
      'Cơ sở tình trạng: kiểm tra trực tiếp ngày 9/11/2026. Bản sao Sổ đăng ký pháp quy ARENA chưa được đồng bộ (sửa lần cuối 28/10/2026) nên không sử dụng.'),
    b('Official hosts (EUR-Lex, Commission CBAM pages, legislation.gov.uk) were not reachable from the drafting environment. Facts were taken from official-domain search results; anything not confirmed in the text itself is marked VERIFY.',
      'Không truy cập trực tiếp được trang chính thức (EUR-Lex, trang CBAM của Ủy ban, legislation.gov.uk). Thông tin lấy từ kết quả tìm kiếm trên tên miền chính thức; nội dung chưa đối chiếu văn bản gốc được đánh dấu VERIFY.'),
    b('Before release (Rev. 1): re-verify every VERIFY item against the OJ / EUR-Lex text (GB: legislation.gov.uk, GOV.UK) and update the Regulatory Register.',
      'Trước khi ban hành (Rev. 1): kiểm tra lại mọi mục VERIFY với văn bản OJ / EUR-Lex (GB: legislation.gov.uk, GOV.UK) và cập nhật Sổ đăng ký pháp quy.'),
  ],
};

// ---------------------------------------------------------------- 1. Purpose
const PURPOSE = [
  b('Give QS, QC, PPS, Merchandisers and DCOs one reference for the EU Deforestation Regulation (EUDR) and the Carbon Border Adjustment Mechanism (CBAM).',
    'Cung cấp cho QS, QC, PPS, Merchandiser và DCO một tài liệu tham chiếu thống nhất về Quy định chống phá rừng EU (EUDR) và Cơ chế điều chỉnh biên giới carbon (CBAM).'),
  b('Fix what A.R.E.N.A. does and does not do under each regime, in line with Rulebook rev. c2 §2.',
    'Xác định rõ A.R.E.N.A. làm gì và không làm gì theo từng quy định, phù hợp Rulebook rev. c2 §2.'),
  b('Align the EU requirements with ARENA-SOP-00-00-INT, the 8-link compliance chain and the SRC release, without creating new gates.',
    'Đối chiếu yêu cầu EU với ARENA-SOP-00-00-INT, chuỗi tuân thủ 8 mắt xích và SRC, không tạo thêm cổng kiểm soát mới.'),
];

const SCOPE = [
  b('Regimes: EUDR — Regulation (EU) 2023/1115 as amended; EU CBAM — Regulation (EU) 2023/956 as amended; UK CBAM — Finance Act 2026, Part 5 (horizon, from 1 Jan 2027).',
    'Quy định: EUDR — Quy định (EU) 2023/1115 và sửa đổi; CBAM EU — Quy định (EU) 2023/956 và sửa đổi; CBAM Anh — Luật Tài chính 2026, Phần 5 (áp dụng từ 1/1/2027).'),
  b('Departments: GARDEN, DIY, DECO, AUTO, BUILDING — commercial lines, all Allies.',
    'Ngành hàng: GARDEN, DIY, DECO, AUTO, BUILDING — hàng thương mại, tất cả Ally.'),
  b('Markets: EU-27, EEA-3, CH, GB, NI, CA, US. The UK is always split into GB and NI.',
    'Thị trường: EU-27, EEA-3, CH, GB, NI, CA, US. Vương quốc Anh luôn tách GB và NI.'),
  b('Out of scope: customs import clearance, DDS filing, CBAM declarations and payments — these are never A.R.E.N.A. activities.',
    'Ngoài phạm vi: thông quan nhập khẩu, nộp DDS, khai báo và thanh toán CBAM — A.R.E.N.A. không bao giờ thực hiện.'),
];

// ---------------------------------------------------------------- 2. Position
const POSITION_HEADLINE = b('A.R.E.N.A. role: SUPPORTING sourcing office',
  'Vai trò của A.R.E.N.A.: văn phòng tìm nguồn hàng HỖ TRỢ');
const POSITION = [
  b('A.R.E.N.A. plays a supporting role: it connects Asian suppliers with retail Allies and supports sourcing, quality and communication between them.',
    'A.R.E.N.A. giữ vai trò hỗ trợ: kết nối nhà cung cấp châu Á với các Ally bán lẻ và hỗ trợ tìm nguồn, chất lượng và trao đổi thông tin giữa hai bên.'),
  b('It is not a party to the sale: contracts, invoices and payments run directly between the Supplier and the Ally.',
    'A.R.E.N.A. không phải một bên của giao dịch: hợp đồng, hóa đơn và thanh toán diễn ra trực tiếp giữa Nhà cung cấp và Ally.'),
  b('Supporting never means a regulatory role: A.R.E.N.A. is never the manufacturer, importer, Operator, trader, CBAM declarant, registrant or payer. Legal obligations and liability stay with the Supplier and the Ally.',
    'Hỗ trợ không có nghĩa là có vai trò pháp lý: A.R.E.N.A. không bao giờ là nhà sản xuất, nhà nhập khẩu, Operator, trader, người khai CBAM, người đăng ký hay người nộp tiền. Nghĩa vụ và trách nhiệm pháp lý thuộc về Nhà cung cấp và Ally.'),
  b('Within that supporting role: EUDR — no regulatory task (EUDR data run directly between Supplier and Ally). CBAM — drafts only, on written Ally request, case by case.',
    'Trong vai trò hỗ trợ đó: EUDR — không có nhiệm vụ pháp lý (dữ liệu EUDR trao đổi trực tiếp giữa Nhà cung cấp và Ally). CBAM — chỉ soạn dự thảo, khi Ally yêu cầu bằng văn bản, từng trường hợp.'),
];

// Role matrix rows: [Regime, A.R.E.N.A., Supplier, Ally / importer]
const ROLE_MATRIX = [
  [b('EUDR (EU/EEA*/NI*)', 'EUDR (EU/EEA*/NI*)'),
   b('None. No action, obligation, data or support role.', 'Không có. Không hành động, nghĩa vụ, dữ liệu hay hỗ trợ.'),
   b('Provides geolocation, legality and deforestation-free evidence to the Operator; Operator itself if it clears EU customs under its own EORI.', 'Cung cấp tọa độ, bằng chứng hợp pháp và không phá rừng cho Operator; là Operator nếu tự thông quan bằng EORI của mình.'),
   b('Usually the Operator (customs declarant / EORI holder): due diligence, DDS before release for free circulation.', 'Thường là Operator (người khai hải quan / có EORI): thẩm định, nộp DDS trước khi thông quan.')],
  [b('EU CBAM', 'CBAM EU'),
   b('On written Ally request only, case by case: compiles supplier CN code and embedded-emissions data and drafts the report. Never declares, registers or pays.', 'Chỉ khi Ally yêu cầu bằng văn bản, từng trường hợp: tổng hợp mã CN và dữ liệu phát thải từ nhà cung cấp, soạn dự thảo báo cáo. Không khai báo, đăng ký hay thanh toán.'),
   b('Owns and signs the installation emissions data (EU Communication Template).', 'Chịu trách nhiệm và ký xác nhận dữ liệu phát thải của cơ sở sản xuất (Mẫu trao đổi thông tin EU).'),
   b('Authorised CBAM declarant (or its indirect customs representative): authorisation, declaration, certificates.', 'Người khai CBAM được ủy quyền (hoặc đại diện hải quan gián tiếp): ủy quyền, khai báo, chứng chỉ.')],
  [b('UK CBAM (GB and NI)', 'CBAM Anh (GB và NI)'),
   b('Same as EU CBAM: drafts only, on written Ally request.', 'Như CBAM EU: chỉ soạn dự thảo khi Ally yêu cầu bằng văn bản.'),
   b('Provides emissions data.', 'Cung cấp dữ liệu phát thải.'),
   b('UK importer: registers with HMRC, files the return and pays the tax.', 'Nhà nhập khẩu Anh: đăng ký với HMRC, nộp tờ khai và nộp thuế.')],
  [b('GB forest-risk / timber', 'Rủi ro rừng / gỗ tại GB'),
   b('None.', 'Không có.'),
   b('Evidence to the GB placer on the market.', 'Cung cấp bằng chứng cho bên đưa hàng ra thị trường GB.'),
   b('UK Timber Regulations duties; Environment Act 2021 Sch. 17 not in force.', 'Nghĩa vụ theo UK Timber Regulations; Phụ lục 17 Luật Môi trường 2021 chưa có hiệu lực.')],
];
const ROLE_NOTE = b('* EEA incorporation of EUDR and its application in NI under the Windsor Framework: VERIFY before stating per market.',
  '* Việc EEA tiếp nhận EUDR và áp dụng tại NI theo Khung Windsor: VERIFY trước khi kết luận theo thị trường.');

// ---------------------------------------------------------------- 3. EUDR
const EUDR_STATUS = [
  // [Item, Status, Source]
  [b('Base act', 'Văn bản gốc'), b('Regulation (EU) 2023/1115 (OJ L 150, 9.6.2023)', 'Quy định (EU) 2023/1115 (OJ L 150, 9/6/2023)'), 'EUR-Lex'],
  [b('Amendments', 'Sửa đổi'), b('(EU) 2024/3234 (12-month delay); (EU) 2025/2650 (OJ 23.12.2025: further delay and simplification)', '(EU) 2024/3234 (hoãn 12 tháng); (EU) 2025/2650 (OJ 23/12/2025: hoãn tiếp và đơn giản hóa)'), 'EUR-Lex; Council PR 18.12.2025'],
  [b('Application — large/medium operators', 'Áp dụng — doanh nghiệp lớn/vừa'), b('30 Dec 2026', '30/12/2026'), 'Reg. 2025/2650; COM(2026) 191'],
  [b('Application — micro/small operators', 'Áp dụng — doanh nghiệp siêu nhỏ/nhỏ'), b('30 Jun 2027 (timber-sector micro/small: VERIFY)', '30/6/2027 (siêu nhỏ/nhỏ ngành gỗ: VERIFY)'), 'Reg. 2025/2650'],
  [b('Cut-off date', 'Ngày mốc'), b('31 Dec 2020 — fixed', '31/12/2020 — cố định'), 'Art. 2(13)'],
  [b('Annex I (product scope)', 'Phụ lục I (phạm vi sản phẩm)'), b('Delegated Reg. (EU) 2026/2102 of 13 Jul 2026, OJ 17 Sep 2026; consolidated text applies from 18 Sep 2026', 'Quy định ủy quyền (EU) 2026/2102 ngày 13/7/2026, OJ 17/9/2026; văn bản hợp nhất áp dụng từ 18/9/2026'), 'EUR-Lex CELEX 32026R2102'],
  [b('Simplification review', 'Rà soát đơn giản hóa'), b('COM(2026) 191 of 4 May 2026: no reopening of the text, no new delay', 'COM(2026) 191 ngày 4/5/2026: không sửa văn bản, không hoãn thêm'), 'Commission'],
  [b('Country benchmarking', 'Phân loại rủi ro quốc gia'), b('Implementing Reg. (EU) 2025/1093 (May 2025): low / standard / high — check per harvest country (VERIFY current list)', 'Quy định thực thi (EU) 2025/1093 (5/2025): thấp / tiêu chuẩn / cao — kiểm tra theo nước khai thác (VERIFY danh sách hiện hành)'), 'EUR-Lex'],
];

const EUDR_COMMODITIES = [
  // [Commodity, Typical ARENA items, 2026/2102 note]
  [b('Wood', 'Gỗ'), b('Garden furniture (acacia, eucalyptus, teak, rubberwood), tool handles, frames, planters, decking, MDF/plywood, paper and cardboard packaging sold as goods', 'Nội thất sân vườn (keo, bạch đàn, tếch, gỗ cao su), cán dụng cụ, khung, chậu, sàn, MDF/ván ép, giấy và bìa bán như hàng hóa'), b('Still in scope. Packaging used only to support another product is not itself in scope; reusable packaging clarified (VERIFY wording).', 'Vẫn trong phạm vi. Bao bì chỉ dùng để chứa/bảo vệ sản phẩm khác không thuộc phạm vi; bao bì tái sử dụng được làm rõ (VERIFY câu chữ).')],
  [b('Rubber (Hevea brasiliensis)', 'Cao su (Hevea brasiliensis)'), b('Gloves, mats, hoses, gaskets, tyres (AUTO)', 'Găng tay, thảm, ống, gioăng, lốp xe (AUTO)'), b('Narrowed to natural rubber of Hevea; synthetic rubber out. Conveyor/transmission belts (ex 4010) and some vulcanised articles (ex 4016) removed. Tyre lines: VERIFY.', 'Thu hẹp còn cao su thiên nhiên Hevea; cao su tổng hợp ngoài phạm vi. Băng tải/dây đai (ex 4010) và một số sản phẩm lưu hóa (ex 4016) bị loại. Dòng lốp: VERIFY.')],
  [b('Cattle', 'Gia súc'), b('Leather gloves, tool belts', 'Găng tay da, đai dụng cụ'), b('Cattle leather (ex 4107) removed. Re-screen leather items against the consolidated Annex I.', 'Da bò (ex 4107) bị loại. Rà soát lại hàng da theo Phụ lục I hợp nhất.')],
  [b('Oil palm', 'Cọ dầu'), b('Candles, waxes, oleochemicals', 'Nến, sáp, hóa chất gốc dầu'), b('More palm derivatives added (VERIFY CN lines).', 'Bổ sung thêm dẫn xuất dầu cọ (VERIFY dòng CN).')],
  [b('Soya, cocoa, coffee', 'Đậu nành, ca cao, cà phê'), b('Rare in non-food sourcing', 'Hiếm trong hàng phi thực phẩm'), b('Coffee extracts (2101 11) added from 30 Dec 2027.', 'Chiết xuất cà phê (2101 11) bổ sung từ 30/12/2027.')],
  [b('Not listed', 'Không thuộc danh mục'), b('Pure bamboo, rattan, cork, seagrass, water hyacinth', 'Tre, mây, bần, cỏ biển, lục bình nguyên chất'), b('Out of scope — but check wood frames, plywood bases or wooden parts in mixed items.', 'Ngoài phạm vi — nhưng kiểm tra khung gỗ, đế ván ép hay chi tiết gỗ trong hàng hỗn hợp.')],
];

const EUDR_OPERATOR_DUTIES = [
  b('Collect Art. 9 information: product, CN code, quantity, country of production, geolocation of every plot (polygon for plots > 4 ha), production period.',
    'Thu thập thông tin Điều 9: sản phẩm, mã CN, số lượng, quốc gia sản xuất, tọa độ từng lô đất (đa giác cho lô > 4 ha), thời gian sản xuất.'),
  b('Assess and mitigate risk (Art. 10–11) unless every production country is low-risk (simplified due diligence, Art. 13).',
    'Đánh giá và giảm thiểu rủi ro (Điều 10–11) trừ khi mọi nước sản xuất là rủi ro thấp (thẩm định đơn giản, Điều 13).'),
  b('Submit the due diligence statement (DDS) in the EU Information System before release for free circulation; the reference goes in the customs declaration.',
    'Nộp tuyên bố thẩm định (DDS) trên Hệ thống thông tin EU trước khi thông quan; số tham chiếu ghi trên tờ khai hải quan.'),
  b('Downstream operators and traders: obligations reduced by (EU) 2025/2650 — VERIFY exact duties in the consolidated text.',
    'Operator hạ nguồn và trader: nghĩa vụ được giảm theo (EU) 2025/2650 — VERIFY nghĩa vụ cụ thể trong văn bản hợp nhất.'),
  b('Keep records for 5 years.', 'Lưu hồ sơ 5 năm.'),
];

const EUDR_ARENA_RULES = [
  b('No EUDR action by A.R.E.N.A. staff: do not collect geolocation, do not assess risk, do not hold or forward EUDR records, do not draft DDS content.',
    'Nhân viên A.R.E.N.A. không thực hiện hoạt động EUDR: không thu thập tọa độ, không đánh giá rủi ro, không lưu giữ hay chuyển tiếp hồ sơ EUDR, không soạn nội dung DDS.'),
  b('EUDR is not an SRC condition. QS does not check DDS references.',
    'EUDR không phải là điều kiện SRC. QS không kiểm tra số tham chiếu DDS.'),
  b('If a Supplier or Ally asks A.R.E.N.A. for EUDR help: reply that EUDR runs directly between the Supplier and the Ally (Operator), and refer them to each other.',
    'Nếu Nhà cung cấp hoặc Ally đề nghị A.R.E.N.A. hỗ trợ EUDR: trả lời rằng EUDR do Nhà cung cấp và Ally (Operator) trực tiếp thực hiện, và đề nghị hai bên liên hệ với nhau.'),
  b('Awareness only: staff may recognise that an item contains an Annex I commodity (e.g. wooden parts) so that no A.R.E.N.A. document claims EUDR compliance.',
    'Chỉ để nhận biết: nhân viên có thể nhận ra sản phẩm có chứa hàng hóa Phụ lục I (ví dụ chi tiết gỗ) để không tài liệu nào của A.R.E.N.A. khẳng định tuân thủ EUDR.'),
  b('Never write "EUDR compliant", "deforestation-free" or a DDS number into QSD, QCP, FRI, TCF or SRC documents.',
    'Không ghi "tuân thủ EUDR", "không phá rừng" hay số DDS vào tài liệu QSD, QCP, FRI, TCF hoặc SRC.'),
];

// ---------------------------------------------------------------- 4. CBAM
const CBAM_STATUS = [
  [b('Base act', 'Văn bản gốc'), b('Regulation (EU) 2023/956', 'Quy định (EU) 2023/956'), 'EUR-Lex'],
  [b('Simplification (Omnibus)', 'Đơn giản hóa (Omnibus)'), b('Regulation (EU) 2025/2083, in force 20 Oct 2025', 'Quy định (EU) 2025/2083, hiệu lực 20/10/2025'), 'OJ L 2025/2083'],
  [b('Definitive period', 'Giai đoạn chính thức'), b('From 1 Jan 2026 (transitional reporting ended 31 Dec 2025)', 'Từ 1/1/2026 (báo cáo chuyển tiếp kết thúc 31/12/2025)'), 'Commission Q&A'],
  [b('De minimis', 'Ngưỡng miễn trừ'), b('50 tonnes per importer per calendar year (mass-based, cumulative). Replaces the old €150 consignment rule. Above 50 t, all that year\'s imports are covered.', '50 tấn/nhà nhập khẩu/năm (theo khối lượng, cộng dồn). Thay quy tắc cũ 150 €/lô. Vượt 50 tấn thì toàn bộ hàng nhập năm đó thuộc phạm vi.'), 'Reg. 2025/2083'],
  [b('Certificate sales', 'Bán chứng chỉ'), b('From 1 Feb 2027 on the common central platform', 'Từ 1/2/2027 trên nền tảng trung tâm chung'), 'Reg. 2025/2083; Commission Q&A'],
  [b('Quarterly holding', 'Nắm giữ hằng quý'), b('From 2027: at least 50% of embedded emissions imported since the start of the year', 'Từ 2027: tối thiểu 50% lượng phát thải nhập khẩu từ đầu năm'), 'Reg. 2025/2083'],
  [b('First annual declaration', 'Khai báo năm đầu tiên'), b('30 Sep 2027 for 2026 imports (not 31 May); certificates surrendered by the same date', '30/9/2027 cho hàng nhập 2026 (không phải 31/5); nộp lại chứng chỉ cùng hạn'), 'Reg. 2025/2083; Commission factsheet'],
  [b('Default values', 'Giá trị mặc định'), b('IR (EU) 2025/2621, Annex I replaced by IR (EU) 2026/1740 (OJ 31.7.2026, applies from 1 Jan 2026): "total emissions" column + mark-up +10% (2026), +20% (2027), +30% (2028 on)', 'IR (EU) 2025/2621, Phụ lục I thay bằng IR (EU) 2026/1740 (OJ 31/7/2026, áp dụng từ 1/1/2026): cột "total emissions" + mức cộng +10% (2026), +20% (2027), +30% (từ 2028)'), 'EUR-Lex via skill, 10.11.2026'],
  [b('Benchmarks / free allocation', 'Giá trị chuẩn / hạn ngạch miễn phí'), b('IR (EU) 2025/2620 (BMg Col. B, BMg* Col. A); CSCF 100% 2026–2030 (Decision (EU) 2026/1862); CBAM factor 97.5% (2026) → 0% (2034)', 'IR (EU) 2025/2620 (BMg Cột B, BMg* Cột A); CSCF 100% 2026–2030 (Quyết định (EU) 2026/1862); hệ số CBAM 97,5% (2026) → 0% (2034)'), 'EUR-Lex via skill, 10.11.2026'],
  [b('Certificate price', 'Giá chứng chỉ'), b('2026 quarterly: Q1 €75.36 · Q2 €75.28 · Q3 €82.32 · Q4 published 4 Jan 2027; weekly from 2027', '2026 theo quý: Q1 75,36 € · Q2 75,28 € · Q3 82,32 € · Q4 công bố 4/1/2027; theo tuần từ 2027'), 'Commission price page'],
  [b('Downstream extension', 'Mở rộng hạ nguồn'), b('COM(2025) 989 — proposal only (~180 downstream goods, from 1 Jan 2028 if adopted)', 'COM(2025) 989 — mới là đề xuất (~180 mặt hàng hạ nguồn, từ 1/1/2028 nếu thông qua)'), '2025/0419 (COD)'],
  [b('UK CBAM', 'CBAM Anh'), b('From 1 Jan 2027; £50,000 12-month threshold; HMRC registration (opening date VERIFY); first return and payment 31 May 2028 for 2027', 'Từ 1/1/2027; ngưỡng 50.000 £/12 tháng; đăng ký HMRC (ngày mở VERIFY); tờ khai và nộp thuế đầu tiên 31/5/2028 cho năm 2027'), 'Finance Act 2026; HMRC'],
];

const CBAM_CN = [
  // [CN, description, in Annex I?, ARENA relevance]
  ['7318', b('Screws, bolts, nuts, washers, rivets (iron/steel)', 'Vít, bu lông, đai ốc, long đen, đinh tán (sắt/thép)'), b('YES', 'CÓ'), 'DIY, BUILDING'],
  ['7326', b('Other articles of iron or steel', 'Sản phẩm khác bằng sắt hoặc thép'), b('YES', 'CÓ'), 'GARDEN, DIY, DECO'],
  ['7308', b('Structures and parts (iron/steel)', 'Kết cấu và bộ phận (sắt/thép)'), b('YES', 'CÓ'), 'BUILDING, GARDEN'],
  ['7301–7311', b('Sheet piling, tubes, fittings, tanks, containers', 'Cọc ván, ống, phụ kiện ống, bồn, thùng chứa'), b('YES', 'CÓ'), 'BUILDING, DIY'],
  ['72xx (e.g. 7217, 7229)', b('Wire, bars, flat-rolled products', 'Dây, thanh, thép cán phẳng'), b('YES', 'CÓ'), 'DIY'],
  ['7604, 7606, 7608, 7610, 7616', b('Aluminium profiles, sheets, tubes, structures, other articles', 'Nhôm định hình, tấm, ống, kết cấu, sản phẩm khác'), b('YES', 'CÓ'), 'GARDEN, BUILDING'],
  ['2523', b('Cement', 'Xi măng'), b('YES', 'CÓ'), 'BUILDING'],
  ['7315, 7317, 7320, 7323, 7324, 7325', b('Chain, nails, springs, household articles, sanitary ware, cast articles', 'Xích, đinh, lò xo, đồ gia dụng, thiết bị vệ sinh, sản phẩm đúc'), b('NO', 'KHÔNG'), b('Not in Annex I — watch COM(2025) 989', 'Không thuộc Phụ lục I — theo dõi COM(2025) 989')],
  ['7615, 6810', b('Aluminium household articles; articles of cement/concrete', 'Đồ gia dụng nhôm; sản phẩm xi măng/bê tông'), b('NO', 'KHÔNG'), b('Not in Annex I', 'Không thuộc Phụ lục I')],
  ['94xx, 82xx, 87xx', b('Finished furniture, tools, vehicle parts with steel/aluminium content', 'Nội thất, dụng cụ, phụ tùng xe hoàn chỉnh có thép/nhôm'), b('NO (today)', 'KHÔNG (hiện tại)'), b('CN of the finished good decides; downstream proposal watch-list', 'Mã CN thành phẩm quyết định; danh sách theo dõi đề xuất hạ nguồn')],
];
const CBAM_CN_NOTE = b('Checked against the 569 Annex I CN codes in the EU Communication Template v2.1.1 (Parameters_CNCodes) used by the repository CBAM Communication Console. The CN code of the finished imported good decides scope, never the raw material.',
  'Đã đối chiếu với 569 mã CN Phụ lục I trong Mẫu trao đổi thông tin EU v2.1.1 (Parameters_CNCodes) dùng trong CBAM Communication Console của kho mã. Mã CN của thành phẩm nhập khẩu quyết định phạm vi, không phải nguyên liệu.');

const CBAM_MARKETS = [
  [b('EU-27', 'EU-27'), b('EU CBAM applies to imports into the EU customs territory.', 'CBAM EU áp dụng cho hàng nhập vào lãnh thổ hải quan EU.')],
  [b('EEA-3 (NO, IS, LI) and CH', 'EEA-3 (NO, IS, LI) và CH'), b('Not EU CBAM import territory; goods originating there are exempt (linked ETS). Imports into these markets are not under EU CBAM.', 'Không phải lãnh thổ nhập khẩu CBAM EU; hàng xuất xứ từ đây được miễn (ETS liên kết). Hàng nhập vào các thị trường này không thuộc CBAM EU.')],
  [b('GB', 'GB'), b('UK CBAM from 1 Jan 2027 (HMRC tax on the UK importer).', 'CBAM Anh từ 1/1/2027 (thuế HMRC đánh vào nhà nhập khẩu Anh).')],
  [b('NI', 'NI'), b('UK CBAM applies UK-wide; any EU CBAM position for NI under the Windsor Framework: VERIFY.', 'CBAM Anh áp dụng toàn Vương quốc Anh; vị trí CBAM EU tại NI theo Khung Windsor: VERIFY.')],
  [b('CA, US', 'CA, US'), b('No CBAM in force. Not covered by this guideline.', 'Chưa có CBAM. Không thuộc hướng dẫn này.')],
];

const CBAM_DECLARANT_DUTIES = [
  b('Hold authorised CBAM declarant status before importing above 50 t per year (transitional rule for applications filed in time: VERIFY dates).',
    'Có tư cách người khai CBAM được ủy quyền trước khi nhập trên 50 tấn/năm (quy tắc chuyển tiếp cho hồ sơ nộp đúng hạn: VERIFY ngày).'),
  b('Report embedded emissions (actual verified data or default values) in the annual CBAM declaration.',
    'Báo cáo phát thải nội hàm (dữ liệu thực tế đã kiểm định hoặc giá trị mặc định) trong khai báo CBAM hằng năm.'),
  b('Buy and surrender CBAM certificates; claim any carbon price effectively paid in the country of origin (Art. 9). Vietnam: no carbon price in force — no deduction (VERIFY at each declaration).',
    'Mua và nộp lại chứng chỉ CBAM; khấu trừ giá carbon đã trả tại nước xuất xứ (Điều 9). Việt Nam: chưa có giá carbon — không khấu trừ (VERIFY mỗi kỳ khai).'),
  b('Keep records for the period set in the Regulation.', 'Lưu hồ sơ theo thời hạn của Quy định.'),
];

// CBAM workflow on written Ally request: [Step, Action, Owner, Record]
const CBAM_WORKFLOW = [
  [b('C0 Request', 'C0 Yêu cầu'), b('Written Ally request received (e-mail or letter naming items, period, deadline, recipient: declarant or UK importer). No request = no CBAM work.', 'Nhận yêu cầu bằng văn bản của Ally (e-mail/thư nêu mặt hàng, kỳ, hạn, người nhận: người khai hoặc nhà nhập khẩu Anh). Không có yêu cầu = không làm CBAM.'), b('Ally → Merchandiser/IQA', 'Ally → Merchandiser/IQA'), b('Request filed in case folder', 'Lưu yêu cầu vào hồ sơ vụ việc')],
  [b('C1 Scope', 'C1 Phạm vi'), b('Confirm the 8-digit CN code of each finished good from the supplier invoice/HS classification; check Annex I (Console scope check).', 'Xác nhận mã CN 8 số của từng thành phẩm theo hóa đơn/phân loại HS của nhà cung cấp; đối chiếu Phụ lục I (chức năng kiểm tra phạm vi của Console).'), b('QS (draft)', 'QS (dự thảo)'), b('CN list', 'Danh sách CN')],
  [b('C2 Data request', 'C2 Yêu cầu dữ liệu'), b('Send the EU Communication Template v2.1.1 to the supplier; ask for actual installation data and precursor data (wire rod, coil, billet).', 'Gửi Mẫu trao đổi thông tin EU v2.1.1 cho nhà cung cấp; yêu cầu dữ liệu thực tế của cơ sở và dữ liệu tiền chất (dây thép, cuộn, phôi).'), b('QS', 'QS'), b('Sent date', 'Ngày gửi')],
  [b('C3 Compile', 'C3 Tổng hợp'), b('Check completeness and plausibility against default values (SEE ledger, gap register). Gaps go back to the supplier; never estimate missing figures.', 'Kiểm tra đầy đủ và hợp lý so với giá trị mặc định (sổ SEE, sổ khoảng trống). Thiếu thì trả lại nhà cung cấp; không tự ước tính.'), b('QS / IQA', 'QS / IQA'), b('Gap register', 'Sổ khoảng trống')],
  [b('C4 Draft + cost', 'C4 Dự thảo + chi phí'), b('Draft the report marked "DRAFT — data provided by [Supplier]; for the declarant\'s review". Add the CBAM cost per piece next to FOB, default and actual (§5.3). Supplier signs its data.', 'Soạn dự thảo ghi "DỰ THẢO — dữ liệu do [Nhà cung cấp] cung cấp; để người khai xem xét". Thêm chi phí CBAM/sp bên cạnh giá FOB, theo giá trị mặc định và thực tế (§5.3). Nhà cung cấp ký xác nhận dữ liệu.'), b('IQA', 'IQA'), b('Draft + cost pack', 'Dự thảo + bảng chi phí')],
  [b('C5 Hand-over', 'C5 Bàn giao'), b('Send the draft to the Ally\'s declarant (EU) or the UK importer (UK). They validate, declare and pay.', 'Gửi dự thảo cho người khai của Ally (EU) hoặc nhà nhập khẩu Anh (UK). Họ thẩm tra, khai báo và nộp tiền.'), b('IQA → Ally', 'IQA → Ally'), b('Hand-over e-mail', 'E-mail bàn giao')],
  [b('C6 Close', 'C6 Đóng'), b('Close the case. No standing mandate: the next period needs a new written request.', 'Đóng hồ sơ. Không có ủy quyền thường trực: kỳ sau cần yêu cầu bằng văn bản mới.'), b('IQA', 'IQA'), b('Case closed', 'Đóng hồ sơ')],
];

const CBAM_SUPPLIER_DATA = [
  b('Installation identity: factory name and address (not trading office), country, NACE code, reporting period (calendar year).', 'Thông tin cơ sở: tên và địa chỉ nhà máy (không phải văn phòng thương mại), quốc gia, mã NACE, kỳ báo cáo (năm dương lịch).'),
  b('Production per CN code (tonnes) and production route (cold forming, hot forging, extrusion, casting).', 'Sản lượng theo mã CN (tấn) và công nghệ (dập nguội, rèn nóng, đùn, đúc).'),
  b('Fuels (GJ) and process emissions for direct emissions; electricity (MWh) and emission factor for indirect emissions.', 'Nhiên liệu (GJ) và phát thải quá trình cho phát thải trực tiếp; điện (MWh) và hệ số phát thải cho phát thải gián tiếp.'),
  b('Precursors: tonnes used per tonne of product and their embedded emissions from the steel/aluminium mill (or defaults).', 'Tiền chất: số tấn dùng cho mỗi tấn sản phẩm và phát thải nội hàm từ nhà máy thép/nhôm (hoặc giá trị mặc định).'),
  b('Carbon price paid in the country of production, with evidence (Art. 9).', 'Giá carbon đã trả tại nước sản xuất, kèm bằng chứng (Điều 9).'),
  b('Signed declaration that the data are accurate; verifier statement where available.', 'Cam kết có chữ ký về tính chính xác của dữ liệu; báo cáo kiểm định nếu có.'),
  b('For the cost line: net steel/aluminium mass per piece (kg, without packaging or non-CBAM parts) and FOB USD/pc from the quotation or P.O./P.I.', 'Cho dòng chi phí: khối lượng tịnh thép/nhôm mỗi sản phẩm (kg, không gồm bao bì hay chi tiết không thuộc CBAM) và giá FOB USD/sp theo báo giá hoặc P.O./P.I.'),
];

// ---------------------------------------------------------------- 5.3 CBAM cost next to FOB
const CBAM_COST_PRINCIPLES = [
  b('CBAM cost is shown as a separate line next to FOB — never inside FOB. FOB is the basis of the customs value; a CBAM amount built into FOB would also attract duty and VAT.',
    'Chi phí CBAM được thể hiện thành dòng riêng bên cạnh FOB — không gộp vào FOB. FOB là cơ sở trị giá hải quan; gộp CBAM vào FOB sẽ bị tính thêm thuế nhập khẩu và VAT.'),
  b('Always show two figures per item: the DEFAULT value (route A) and the ACTUAL value (route C, or route B where only the factory\'s own process data exist). The declarant chooses the route.',
    'Luôn thể hiện hai con số cho mỗi mặt hàng: giá trị MẶC ĐỊNH (phương án A) và giá trị THỰC TẾ (phương án C, hoặc B khi chỉ có dữ liệu quy trình của nhà máy). Người khai quyết định phương án.'),
  b('When: only on a written Ally request — at quotation/RFx (cost column next to FOB) and per P.O./P.I. line (cost pack). No request, no cost line.',
    'Khi nào: chỉ khi Ally yêu cầu bằng văn bản — ở bước báo giá/RFx (cột chi phí bên cạnh FOB) và theo từng dòng P.O./P.I. (bảng chi phí). Không có yêu cầu thì không có dòng chi phí.'),
  b('Show € per piece, USD per piece and % of FOB, using the import year (EU customs release date): the factor falls and the mark-up rises each year, so the cost rises.',
    'Thể hiện €/sp, USD/sp và % FOB theo năm nhập khẩu (ngày thông quan EU): hệ số giảm và mức cộng tăng hằng năm nên chi phí tăng.'),
  b('Cost sharing (surcharge to the Ally or price concession by the supplier) is a commercial decision between Supplier and Ally. A.R.E.N.A. only shows the numbers; it never negotiates or invoices CBAM.',
    'Chia sẻ chi phí (phụ thu cho Ally hoặc nhà cung cấp giảm giá) là quyết định thương mại giữa Nhà cung cấp và Ally. A.R.E.N.A. chỉ thể hiện số liệu; không đàm phán hay xuất hóa đơn CBAM.'),
  b('50 t de minimis: if the Ally\'s total CBAM imports in the year (all suppliers) are 50 t or less, nothing is payable. Only the Ally knows its total — record the Ally\'s figure, never assume it.',
    'Ngưỡng 50 tấn: nếu tổng hàng CBAM nhập trong năm của Ally (mọi nhà cung cấp) ≤ 50 tấn thì không phải nộp. Chỉ Ally biết tổng này — ghi theo số Ally cung cấp, không tự giả định.'),
];

// [Element, Default value (route A), Actual value (route C)]
const CBAM_COST_FORMULA = [
  [b('SEE used (tCO₂e/t)', 'SEE áp dụng (tCO₂e/t)'),
   b('Default "total emissions" for CN + origin × (1 + mark-up 10% / 20% / 30% from 2028). Country not listed → "Other Countries and Territories".', 'Giá trị "total emissions" theo CN + xuất xứ × (1 + mức cộng 10% / 20% / 30% từ 2028). Nước không có tên → bảng "Other Countries and Territories".'),
   b('(Direct emissions of the process + Σ precursor t × precursor SEE) ÷ t produced. No mark-up.', '(Phát thải trực tiếp của quy trình + Σ tấn tiền chất × SEE tiền chất) ÷ tấn sản xuất. Không có mức cộng.')],
  [b('Free-allocation adjustment SEFA (tCO₂e/t)', 'Điều chỉnh hạn ngạch SEFA (tCO₂e/t)'),
   b('CBAM factor × CSCF × BMg (Column B, route of the default table).', 'Hệ số CBAM × CSCF × BMg (Cột B, theo quy trình của bảng mặc định).'),
   b('Factor × CSCF × BMg* (Column A, own process) + Σ m_i × SEFA_i of the precursors.', 'Hệ số × CSCF × BMg* (Cột A, quy trình của hàng) + Σ m_i × SEFA_i của tiền chất.')],
  [b('Certificates', 'Số chứng chỉ'),
   b('MAX(0, tonnes × (SEE used − SEFA) − carbon price paid at origin ÷ certificate price)', 'MAX(0, tấn × (SEE áp dụng − SEFA) − giá carbon đã trả ÷ giá chứng chỉ)'),
   b('Same formula.', 'Cùng công thức.')],
  [b('Cost', 'Chi phí'),
   b('€ = certificates × price · €/pc = € ÷ pcs · % of FOB = (€/pc × USD per €) ÷ FOB USD/pc', '€ = số chứng chỉ × giá · €/sp = € ÷ số sp · % FOB = (€/sp × USD/€) ÷ FOB USD/sp'),
   b('Same formula.', 'Cùng công thức.')],
  [b('Declarable?', 'Được khai?'),
   b('Yes, without supplier data (Art. 7(2)(b)); needs a documented justification and a named Ally authoriser.', 'Có, không cần dữ liệu NCC (Điều 7(2)(b)); cần lý do bằng văn bản và người phê duyệt phía Ally.'),
   b('Only when verified by an accredited verifier (Art. 8). Unverified → falls back to default.', 'Chỉ khi đã được tổ chức thẩm định công nhận xác minh (Điều 8). Chưa xác minh → quay về giá trị mặc định.')],
];

const CBAM_COST_EXAMPLE_INTRO = b(
  'Worked example — steel garden frame, CN 7326 90 98, origin Viet Nam, 1,200 pcs × 8.5 kg (10.2 t), FOB USD 18.50/pc, EU release 15 Aug 2026 (Q3 price €82.32), FX 1.1256 USD/€ (assumption).',
  'Ví dụ — khung sân vườn bằng thép, CN 7326 90 98, xuất xứ Việt Nam, 1.200 sp × 8,5 kg (10,2 tấn), FOB 18,50 USD/sp, thông quan EU 15/8/2026 (giá Q3 82,32 €), tỷ giá 1,1256 USD/€ (giả định).');

// [Route, SEE used, SEFA, Certificates per t, € per piece, % of FOB]
const CBAM_COST_EXAMPLE = [
  [b('A — Default (final good)', 'A — Mặc định (thành phẩm)'), '2.37 × 1.10 = 2.607', '0.975 × 1.00 × 1.491 = 1.454', '1.153', '€0.807', '4.9%'],
  [b('B — Factory process + steel coil at default', 'B — Quy trình nhà máy + thép cuộn mặc định'), '3.789', '1.534', '2.255', '€1.578', '9.6%'],
  [b('C — Actual, verified (ILLUSTRATIVE mill SEE 2.10)', 'C — Thực tế, đã xác minh (SEE nhà máy thép GIẢ ĐỊNH 2,10)'), '2.290', '1.534', '0.756', '€0.529', '3.2%'],
];
const CBAM_COST_EXAMPLE_NOTES = [
  b('Route B is not always cheaper: Chinese HR coil at its default (3.187 × 1.1) pushes the cost above the Viet Nam final-good default. Always compare A, B and C; the declarant decides.',
    'Phương án B không phải lúc nào cũng rẻ hơn: thép cuộn Trung Quốc theo giá trị mặc định (3,187 × 1,1) làm chi phí cao hơn giá trị mặc định thành phẩm Việt Nam. Luôn so sánh A, B và C; người khai quyết định.'),
  b('Break-even mill SEE (route C = route A): 2.47 (2026) · 2.69 (2027) · 2.91 (2028) tCO₂e/t of coil. Below it, actual data lowers the cost — the key figure for the supplier–Ally discussion.',
    'Ngưỡng SEE hòa vốn của nhà máy thép (C = A): 2,47 (2026) · 2,69 (2027) · 2,91 (2028) tCO₂e/t thép cuộn. Thấp hơn ngưỡng này, dữ liệu thực tế giúp giảm chi phí — con số then chốt khi Nhà cung cấp và Ally trao đổi.'),
  b('Values: IR (EU) 2026/1740 Annex I and IR (EU) 2025/2620 as read on 10 Nov 2026 (skill cbam-default-value-po-cost). Route C mill data are illustrative only.',
    'Số liệu: Phụ lục I IR (EU) 2026/1740 và IR (EU) 2025/2620 theo bản đọc ngày 10/11/2026 (skill cbam-default-value-po-cost). Dữ liệu nhà máy thép ở phương án C chỉ để minh họa.'),
];

// Projection, route A, same item, price held at €82.32: [year, €/pc, % FOB]
const CBAM_COST_PROJECTION = [
  ['2026', '€0.807', '4.9%'],
  ['2028', '€1.217', '7.4%'],
  ['2034', '€2.156', '13.1%'],
];

const CBAM_ARENA_RULES = [
  b('Never register, declare, buy or surrender certificates, or pay UK CBAM tax.', 'Không đăng ký, khai báo, mua hay nộp lại chứng chỉ, hoặc nộp thuế CBAM Anh.'),
  b('Never sign emissions data as A.R.E.N.A.; the supplier owns its data, the declarant/importer owns the declaration.', 'Không ký dữ liệu phát thải dưới danh nghĩa A.R.E.N.A.; nhà cung cấp chịu trách nhiệm dữ liệu, người khai/nhà nhập khẩu chịu trách nhiệm khai báo.'),
  b('No standing mandate: every period and every Ally needs its own written request.', 'Không có ủy quyền thường trực: mỗi kỳ và mỗi Ally cần yêu cầu bằng văn bản riêng.'),
  b('CBAM is not a default SRC condition. If a written Ally request sets a pre-shipment delivery date, QS may note the hand-over date in the SRC file for information only (QS to confirm).', 'CBAM không phải điều kiện SRC mặc định. Nếu yêu cầu của Ally đặt hạn giao trước khi xuất hàng, QS có thể ghi ngày bàn giao vào hồ sơ SRC chỉ để thông tin (QS xác nhận).'),
  b('Never advise restructuring shipments to stay under 50 t or £50,000 (anti-circumvention, Art. 27).', 'Không tư vấn chia nhỏ lô hàng để dưới 50 tấn hoặc 50.000 £ (chống lẩn tránh, Điều 27).'),
];

// ---------------------------------------------------------------- 5. SOP alignment
// [ARENA touchpoint, EUDR, CBAM]
const SOP_ALIGNMENT = [
  [b('RFx (ARENA-SOP-01-04) / new item intake', 'RFx (ARENA-SOP-01-04) / tiếp nhận hàng mới'),
   b('Awareness only: note Annex I material in the item description. No ARENA requirement on the supplier.', 'Chỉ nhận biết: ghi chú vật liệu Phụ lục I trong mô tả hàng. Không đặt yêu cầu ARENA cho nhà cung cấp.'),
   b('Record finished-good CN code; flag Annex I items for the Ally. On a written Ally request: quotation shows FOB plus CBAM €/pc (default and actual) as separate columns (§5.3).', 'Ghi mã CN thành phẩm; đánh dấu hàng Phụ lục I để Ally biết. Khi Ally yêu cầu bằng văn bản: báo giá thể hiện FOB và chi phí CBAM €/sp (mặc định và thực tế) ở cột riêng (§5.3).')],
  [b('P.O. / P.I. issue', 'Phát hành P.O. / P.I.'),
   b('No EUDR line.', 'Không có dòng EUDR.'),
   b('On a written Ally request: CBAM cost pack per P.O./P.I. line — €/pc and % of FOB, default and actual, beside (never inside) FOB.', 'Khi Ally yêu cầu bằng văn bản: bảng chi phí CBAM theo dòng P.O./P.I. — €/sp và % FOB, mặc định và thực tế, đặt bên cạnh (không gộp vào) FOB.')],
  [b('4-step determination / Pathway (links 1–2)', 'Xác định 4 bước / Lộ trình (mắt xích 1–2)'),
   b('Not a pathway input. EUDR is not CE marking.', 'Không phải đầu vào lộ trình. EUDR không phải dấu CE.'),
   b('Not a pathway input.', 'Không phải đầu vào lộ trình.')],
  [b('QSD / QCP / TPM', 'QSD / QCP / TPM'),
   b('No EUDR clause, no compliance claim.', 'Không có điều khoản EUDR, không khẳng định tuân thủ.'),
   b('No CBAM clause; CN code field only.', 'Không có điều khoản CBAM; chỉ trường mã CN.')],
  [b('ETD − 45 days document gate', 'Cổng tài liệu ETD − 45 ngày'),
   b('No EUDR documents collected.', 'Không thu thập tài liệu EUDR.'),
   b('Only if a written Ally request sets this deadline.', 'Chỉ khi yêu cầu bằng văn bản của Ally đặt hạn này.')],
  [b('FRI (CP1–CP10)', 'FRI (CP1–CP10)'),
   b('No EUDR checkpoint.', 'Không có điểm kiểm EUDR.'),
   b('No CBAM checkpoint.', 'Không có điểm kiểm CBAM.')],
  [b('SRC release (link 8, QS-owned)', 'Phát hành SRC (mắt xích 8, QS chủ trì)'),
   b('Not an SRC condition.', 'Không phải điều kiện SRC.'),
   b('Not a default condition; information note only on written request (QS to confirm).', 'Không phải điều kiện mặc định; chỉ ghi chú thông tin khi có yêu cầu bằng văn bản (QS xác nhận).')],
  [b('SOP-00-00-INT gates G1–G5', 'Cổng G1–G5 của SOP-00-00-INT'),
   b('No gate added.', 'Không thêm cổng.'),
   b('No gate added. Gate references to be confirmed by QS against the SOP.', 'Không thêm cổng. QS xác nhận tham chiếu cổng theo SOP.')],
];

// ---------------------------------------------------------------- 6. Timeline
const TIMELINE = [
  ['20 Oct 2025', b('CBAM Omnibus (EU) 2025/2083 in force — 50 t threshold', 'CBAM Omnibus (EU) 2025/2083 có hiệu lực — ngưỡng 50 tấn'), 'CBAM'],
  ['1 Jan 2026', b('CBAM definitive period starts', 'CBAM bắt đầu giai đoạn chính thức'), 'CBAM'],
  ['18 Sep 2026', b('EUDR Annex I amended by (EU) 2026/2102', 'Phụ lục I EUDR sửa đổi theo (EU) 2026/2102'), 'EUDR'],
  ['30 Dec 2026', b('EUDR applies — large and medium operators', 'EUDR áp dụng — doanh nghiệp lớn và vừa'), 'EUDR'],
  ['1 Jan 2027', b('UK CBAM starts (GB/NI)', 'CBAM Anh bắt đầu (GB/NI)'), 'UK CBAM'],
  ['4 Jan 2027', b('2026-Q4 CBAM certificate price published', 'Công bố giá chứng chỉ CBAM quý 4/2026'), 'CBAM'],
  ['1 Feb 2027', b('EU CBAM certificate sales open', 'Mở bán chứng chỉ CBAM EU'), 'CBAM'],
  ['30 Jun 2027', b('EUDR applies — micro and small operators', 'EUDR áp dụng — doanh nghiệp siêu nhỏ và nhỏ'), 'EUDR'],
  ['30 Sep 2027', b('First EU CBAM declaration (2026 imports) and surrender', 'Khai báo CBAM EU đầu tiên (hàng nhập 2026) và nộp chứng chỉ'), 'CBAM'],
  ['30 Dec 2027', b('EUDR: coffee extracts added to Annex I apply', 'EUDR: chiết xuất cà phê bổ sung vào Phụ lục I áp dụng'), 'EUDR'],
  ['1 Jan 2028', b('CBAM downstream extension (if COM(2025) 989 is adopted)', 'Mở rộng CBAM hạ nguồn (nếu COM(2025) 989 được thông qua)'), 'CBAM'],
  ['31 May 2028', b('First UK CBAM return and payment (2027)', 'Tờ khai và nộp thuế CBAM Anh đầu tiên (năm 2027)'), 'UK CBAM'],
];

// ---------------------------------------------------------------- 7. Skill / tool flags
const SKILL_FLAGS = [
  [b('cbam-compliance-assessment', 'cbam-compliance-assessment'), b('Gives A.R.E.N.A. a standing "supply-chain data provider" role and a pre-shipment SRC gate.', 'Gán cho A.R.E.N.A. vai trò "cung cấp dữ liệu" thường trực và cổng SRC trước xuất hàng.'), b('Rulebook §2: drafts only, on written Ally request, case by case.', 'Rulebook §2: chỉ soạn dự thảo, khi Ally yêu cầu bằng văn bản, từng trường hợp.')],
  [b('cbam-compliance-assessment', 'cbam-compliance-assessment'), b('De minimis €2,500 per consignment.', 'Ngưỡng 2.500 €/lô.'), b('50 t per importer per year (Reg. 2025/2083).', '50 tấn/nhà nhập khẩu/năm (QĐ 2025/2083).')],
  [b('cbam-compliance-assessment', 'cbam-compliance-assessment'), b('First declaration and surrender 31 May 2027.', 'Khai báo và nộp chứng chỉ đầu tiên 31/5/2027.'), b('30 Sep 2027.', '30/9/2027.')],
  [b('cbam-compliance-assessment', 'cbam-compliance-assessment'), b('Lists 7315, 7317, 7320, 7325 as Annex I.', 'Liệt kê 7315, 7317, 7320, 7325 thuộc Phụ lục I.'), b('Not in Annex I (template Parameters_CNCodes).', 'Không thuộc Phụ lục I (Parameters_CNCodes của mẫu).')],
  [b('eudr-compliance-assessment', 'eudr-compliance-assessment'), b('First deferral cited as (EU) 2024/1991.', 'Lần hoãn đầu ghi là (EU) 2024/1991.'), b('(EU) 2024/3234.', '(EU) 2024/3234.')],
  [b('eudr-compliance-assessment', 'eudr-compliance-assessment'), b('Cattle leather (gloves, tool belts) in scope; Annex I not updated.', 'Da bò (găng tay, đai dụng cụ) trong phạm vi; chưa cập nhật Phụ lục I.'), b('Update to Delegated Reg. (EU) 2026/2102.', 'Cập nhật theo QĐ ủy quyền (EU) 2026/2102.')],
  [b('eudr-compliance-assessment', 'eudr-compliance-assessment'), b('SRC gate "no SRC without DDS".', 'Cổng SRC "không có DDS thì không SRC".'), b('Remove: EUDR is not an SRC condition (Rulebook §2).', 'Bỏ: EUDR không phải điều kiện SRC (Rulebook §2).')],
  [b('IQS dashboard v69.4', 'IQS dashboard v69.4'), b('EUDR Annex I screen predates 2026/2102.', 'Màn hình Phụ lục I EUDR trước 2026/2102.'), b('Update screen (open item, Rulebook §5).', 'Cập nhật màn hình (mục mở, Rulebook §5).')],
];

// ---------------------------------------------------------------- 8. VERIFY
const VERIFY = [
  b('EUDR: micro/small timber-sector application date under (EU) 2025/2650.', 'EUDR: ngày áp dụng cho doanh nghiệp siêu nhỏ/nhỏ ngành gỗ theo (EU) 2025/2650.'),
  b('EUDR: downstream operator and trader duties after (EU) 2025/2650.', 'EUDR: nghĩa vụ operator hạ nguồn và trader sau (EU) 2025/2650.'),
  b('EUDR: exact Annex I CN wording after 2026/2102 (tyres, ex 4016, palm derivatives, packaging).', 'EUDR: câu chữ CN Phụ lục I sau 2026/2102 (lốp, ex 4016, dẫn xuất cọ, bao bì).'),
  b('EUDR: current country benchmarking list (IR (EU) 2025/1093 as amended), per harvest country.', 'EUDR: danh sách phân loại quốc gia hiện hành (QĐ thực thi (EU) 2025/1093 và sửa đổi), theo nước khai thác.'),
  b('EUDR: EEA incorporation and NI application.', 'EUDR: EEA tiếp nhận và áp dụng tại NI.'),
  b('CBAM: re-check default values (IR 2026/1740), benchmarks (IR 2025/2620) and the 2026-Q4 price on EUR-Lex / the Commission page; values here are the skill\'s 10 Nov 2026 reading. Mark-up on precursor defaults (route B): confirm with the declarant\'s verifier.', 'CBAM: kiểm tra lại giá trị mặc định (IR 2026/1740), giá trị chuẩn (IR 2025/2620) và giá Q4/2026 trên EUR-Lex / trang Ủy ban; số liệu ở đây theo skill đọc ngày 10/11/2026. Mức cộng cho tiền chất mặc định (phương án B): xác nhận với bên thẩm định của người khai.'),
  b('CBAM: transitional rule for declarant applications filed in time (dates).', 'CBAM: quy tắc chuyển tiếp cho hồ sơ xin tư cách người khai nộp đúng hạn (ngày).'),
  b('CBAM: EU CBAM position in NI; UK CBAM HMRC registration opening date; UK CBAM sector list.', 'CBAM: vị trí CBAM EU tại NI; ngày mở đăng ký HMRC cho CBAM Anh; danh mục ngành CBAM Anh.'),
  b('CBAM: Vietnam carbon-pricing status at each declaration (Art. 9).', 'CBAM: tình trạng định giá carbon của Việt Nam tại mỗi kỳ khai (Điều 9).'),
];

const SOURCES = [
  'EUR-Lex — Regulation (EU) 2023/1115, consolidated 18.09.2026 (CELEX 02023R1115-20260918)',
  'EUR-Lex — Commission Delegated Regulation (EU) 2026/2102 of 13 July 2026 (CELEX 32026R2102)',
  'European Commission — COM(2026) 191 final, 4.5.2026, Report on the EUDR simplification review',
  'Council of the EU — press release 18.12.2025, targeted revision of the Deforestation Regulation',
  'EUR-Lex — Regulation (EU) 2025/2083 (OJ L 2025/2083), CBAM simplification',
  'European Commission, DG TAXUD — CBAM Questions & Answers; CBAM communication and news (2026)',
  'Council document WK-1676-2026-INIT (3.2.2026), interinstitutional file 2025/0419 (COD) — COM(2025) 989',
  'HM Government — Finance Act 2026, Part 5 (UK CBAM); HMRC guidance (Aug 2026) — via secondary summaries, VERIFY',
  'EUR-Lex — IR (EU) 2026/1740 (Annex I default values, OJ L 31.7.2026); IR (EU) 2025/2620 (benchmarks); Decision (EU) 2026/1862 (CSCF) — as read by skill cbam-default-value-po-cost on 10.11.2026',
  'European Commission — CBAM certificate price page (2026 quarterly prices)',
  'EU CBAM Communication Template v2.1.1, Parameters_CNCodes (569 codes) — as embedded in this repository',
  'ARENA Rulebook rev. c2 (1 Nov 2026), §2–§4, §10',
];

module.exports = {
  META, PURPOSE, SCOPE, POSITION_HEADLINE, POSITION, ROLE_MATRIX, ROLE_NOTE,
  EUDR_STATUS, EUDR_COMMODITIES, EUDR_OPERATOR_DUTIES, EUDR_ARENA_RULES,
  CBAM_STATUS, CBAM_CN, CBAM_CN_NOTE, CBAM_MARKETS, CBAM_DECLARANT_DUTIES,
  CBAM_WORKFLOW, CBAM_SUPPLIER_DATA, CBAM_ARENA_RULES,
  CBAM_COST_PRINCIPLES, CBAM_COST_FORMULA, CBAM_COST_EXAMPLE_INTRO, CBAM_COST_EXAMPLE, CBAM_COST_EXAMPLE_NOTES, CBAM_COST_PROJECTION,
  SOP_ALIGNMENT, TIMELINE, SKILL_FLAGS, VERIFY, SOURCES,
};
