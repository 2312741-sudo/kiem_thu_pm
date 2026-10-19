// Sinh docs/BAO_CAO_GIUA_KY_THEO_MAU.docx theo mẫu đồ án của Khoa CNTT – ĐH Đà Lạt:
// bìa, nhận xét GVHD, lời cảm ơn, mục lục, danh mục hình/bảng, mở đầu, chương 1–4, kết luận, tài liệu tham khảo, phụ lục.
// Chạy (sau khi chạy tools/make-figures.py): NODE_PATH=<nơi cài docx> node tools/build-docx-theo-mau.cjs
const fs = require("fs");
const path = require("path");
const {
  AlignmentType, BorderStyle, Document, Footer, Header, HeadingLevel, ImageRun, Packer, PageNumber, Paragraph,
  SequentialIdentifier, ShadingType, TabStopType, Table, TableCell, TableOfContents, TableRow, TextRun, WidthType,
  PageBreak, VerticalAlign,
} = require("docx");

const root = path.resolve(__dirname, "..");
const FIG = (n) => path.join(root, "docs", "figures", n);
const FONT = "Times New Roman";
const MONO = "Courier New";
const TEXT_W = 11906 - 1985 - 1134; // A4 trừ lề trái 3,5 cm và lề phải 2,0 cm (DXA)

// ---------- tiện ích định dạng ----------
// Tham chiếu hình/bảng: viết [[fig:khoa]] hoặc [[tbl:khoa]] trong văn bản; số được điền ở lượt dựng thứ hai.
let REF = {};
let COUNT = { Hình: 0, Bảng: 0 };
const resolveRefs = (t) => t.replace(/\[\[(fig|tbl):([\w-]+)\]\]/g, (_, k, id) => REF[`${k}:${id}`] ?? "?");
function runs(text, base = {}) {
  text = resolveRefs(text);
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: FONT, ...base }));
    const t = m[0];
    if (t.startsWith("**")) out.push(new TextRun({ text: t.slice(2, -2), bold: true, font: FONT, ...base }));
    else if (t.startsWith("`")) out.push(new TextRun({ text: t.slice(1, -1), font: MONO, ...base, size: (base.size ?? 26) - 2 }));
    else out.push(new TextRun({ text: t.slice(1, -1), italics: true, font: FONT, ...base }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: FONT, ...base }));
  return out;
}
const P = (text) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 720 }, children: runs(text) });
const PN = (text) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: runs(text) });
const L = (n, text) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { left: 540, hanging: 540 }, children: runs(`${n}\t${text}`), tabStops: [{ type: TabStopType.LEFT, position: 540 }] });
const B = (text) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { left: 540, hanging: 270 }, children: runs(`-\t${text}`), tabStops: [{ type: TabStopType.LEFT, position: 540 }] });
const H1 = (text, pageBreak = true) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: pageBreak, children: [new TextRun({ text, font: FONT })] });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, font: FONT })] });
const H3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, font: FONT })] });
const H4 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_4, children: [new TextRun({ text, font: FONT })] });
const spacer = () => new Paragraph({ spacing: { after: 0, line: 240 }, children: [] });

function caption(label, text, key) {
  COUNT[label] += 1;
  if (key) REF[`${label === "Hình" ? "fig" : "tbl"}:${key}`] = `${label} ${COUNT[label]}`;
  return new Paragraph({
    style: "Caption",
    alignment: AlignmentType.CENTER,
    keepLines: true,
    children: [new TextRun({ text: `${label} `, font: FONT, italics: true }), new SequentialIdentifier(label), new TextRun({ text: `. ${text}`, font: FONT, italics: true })],
  });
}
function fig(file, text, widthCm = 14, key) {
  const data = fs.readFileSync(FIG(file));
  const w = data.readUInt32BE(16), h = data.readUInt32BE(20);
  const px = Math.round((widthCm / 2.54) * 96);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60, line: 240 }, children: [new ImageRun({ type: "png", data, transformation: { width: px, height: Math.round((px * h) / w) }, altText: { title: text, description: text, name: file } })] }),
    caption("Hình", text, key),
  ];
}
const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };
function table(rows, widths, text, opts = {}) {
  const size = opts.size ?? 24;
  const total = widths.reduce((a, b) => a + b, 0);
  const ws = widths.map((w) => Math.floor((w / total) * TEXT_W));
  ws[ws.length - 1] += TEXT_W - ws.reduce((a, b) => a + b, 0);
  const head = opts.header !== false;
  const t = new Table({
    width: { size: TEXT_W, type: WidthType.DXA },
    columnWidths: ws,
    rows: rows.map((r, ri) =>
      new TableRow({
        cantSplit: true,
        tableHeader: head && ri === 0,
        children: r.map((c, ci) =>
          new TableCell({
            borders,
            width: { size: ws[ci], type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 40, bottom: 40, left: 90, right: 90 },
            shading: head && ri === 0 ? { type: ShadingType.CLEAR, fill: "D9D9D9" } : opts.labelCol && ci === 0 ? { type: ShadingType.CLEAR, fill: "F2F2F2" } : undefined,
            children: String(c).split("\n").map((line) =>
              new Paragraph({ spacing: { after: 0, line: 252 }, alignment: opts.center?.includes(ci) ? AlignmentType.CENTER : AlignmentType.LEFT, children: runs(line, { size, bold: (head && ri === 0) || (opts.labelCol && ci === 0) ? true : undefined }) })
            ),
          })
        ),
      })
    ),
  });
  return [t, caption("Bảng", text, opts.key), spacer()];
}
const code = (lines) => lines.map((l, i) => new Paragraph({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, spacing: { after: i === lines.length - 1 ? 120 : 0, line: 252 }, indent: { left: 360 }, children: [new TextRun({ text: l === "" ? " " : l, font: MONO, size: 21 })] }));

// ---------- trang bìa ----------
const center = (text, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: o.after ?? 120, line: 276 }, children: [new TextRun({ text, font: FONT, bold: o.bold, size: o.size ?? 28 })] });
const cover = [
  center("TRƯỜNG ĐẠI HỌC ĐÀ LẠT", { bold: true, size: 30 }),
  center("KHOA CÔNG NGHỆ THÔNG TIN", { bold: true, size: 30, after: 1500 }),
  center("BÁO CÁO GIỮA KỲ", { bold: true, size: 34, after: 200 }),
  center("MÔN KIỂM THỬ PHẦN MỀM", { bold: true, size: 30, after: 600 }),
  center("KIỂM THỬ RACE CONDITION", { bold: true, size: 36, after: 60 }),
  center("CHO HỆ THỐNG ĐẶT LỊCH CAL.COM", { bold: true, size: 36, after: 120 }),
  center("Đề tài R05-K15 · Nhóm 14", { size: 28, after: 1500 }),
  new Paragraph({ indent: { left: 1400 }, spacing: { after: 120 }, children: [new TextRun({ text: "Giảng viên: ", font: FONT, size: 28 }), new TextRun({ text: "Nguyễn Thế Lâm", font: FONT, size: 28, bold: true })] }),
  new Paragraph({ indent: { left: 1400 }, spacing: { after: 60 }, children: [new TextRun({ text: "Sinh viên thực hiện:", font: FONT, size: 28 })] }),
  ...["2312741 – Nguyễn Thanh Tâm", "2312800 – Võ Công Vinh", "2312774 – Nguyễn Đức Tín", "2312796 – Ngô Quốc Trường Vĩ"].map((s) => new Paragraph({ indent: { left: 2000 }, spacing: { after: 60 }, children: [new TextRun({ text: s, font: FONT, size: 28 })] })),
  new Paragraph({ spacing: { before: 1300 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Đà Lạt, tháng 10 năm 2026", font: FONT, size: 28 })] }),
];

const dots = ".".repeat(78);
const comments = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN", font: FONT, bold: true, size: 32 })] }),
  ...Array.from({ length: 22 }, () => new Paragraph({ spacing: { after: 60, line: 360 }, children: [new TextRun({ text: dots, font: FONT })] })),
];
const thanks = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "LỜI CẢM ƠN", font: FONT, bold: true, size: 32 })] }),
  P("Trước hết chúng em xin gửi lời cảm ơn đến thầy Nguyễn Thế Lâm, người đã giao đề tài, hướng dẫn và góp ý cho nhóm trong suốt quá trình tìm hiểu hệ thống, thiết kế và thực hiện kiểm thử. Những yêu cầu của thầy về việc phải kiểm thử thật, lỗi tìm được phải là lỗi thật và có bằng chứng kiểm chứng được đã giúp nhóm hiểu rõ hơn cách làm việc của một đội đảm bảo chất lượng."),
  P("Do thời gian và kiến thức của nhóm còn hạn chế, báo cáo không thể tránh khỏi thiếu sót. Chúng em kính mong nhận được sự chỉ bảo thêm của thầy cũng như góp ý của các bạn để nhóm hoàn thiện đề tài hơn nữa."),
  P("Một lần nữa, nhóm chúng em xin chân thành cảm ơn các thầy cô trong khoa Công nghệ thông tin, Trường Đại học Đà Lạt, đã tận tình giảng dạy và truyền đạt những kiến thức cần thiết trong suốt thời gian chúng em học tập tại trường."),
];

// ---------- nội dung chính ----------
function buildBody() {
  const body = [];

  // Danh mục (trường tự cập nhật khi mở bằng Word)
  body.push(new Paragraph({ alignment: AlignmentType.CENTER, pageBreakBefore: true, spacing: { after: 300 }, children: [new TextRun({ text: "MỤC LỤC", font: FONT, bold: true, size: 32 })] }));
  body.push(new TableOfContents("Mục lục", { hyperlink: true, headingStyleRange: "1-3" }));
  body.push(H1("DANH MỤC HÌNH ẢNH"));
  body.push(new TableOfContents("Danh mục hình ảnh", { hyperlink: true, captionLabelIncludingNumbers: "Hình" }));
  body.push(H1("DANH MỤC BẢNG BIỂU"));
  body.push(new TableOfContents("Danh mục bảng biểu", { hyperlink: true, captionLabelIncludingNumbers: "Bảng" }));

  // ===== MỞ ĐẦU =====
  body.push(H1("MỞ ĐẦU"));
  body.push(
    P("Trong thời đại số, việc đặt lịch hẹn trực tuyến đã trở thành nhu cầu phổ biến: khám bệnh, tư vấn, học thêm, họp công việc. Các hệ thống đặt lịch cho phép người sở hữu lịch công bố những khung giờ còn trống và để khách tự chọn giờ mà không cần trao đổi qua lại. Điều quan trọng nhất mà người dùng kỳ vọng ở loại hệ thống này rất đơn giản: một khung giờ chỉ được giữ cho một người."),
    P("Tuy nhiên, kỳ vọng đó chỉ dễ đạt được khi các yêu cầu đến lần lượt. Khi nhiều khách cùng bấm “Đặt lịch” trong một phần giây, hệ thống phải xử lý đồng thời nhiều yêu cầu cùng tranh một tài nguyên chung là lịch của chủ lịch. Nếu cách xử lý không an toàn trước tình huống này, hệ thống có thể nhận cả hai yêu cầu và chủ lịch bị đặt trùng giờ. Loại lỗi này rất khó gặp khi kiểm thử bằng tay hoặc bằng các kịch bản chạy tuần tự."),
    P("Xuất phát từ thực tế đó, nhóm thực hiện đề tài R05-K15 của môn Kiểm thử phần mềm: kiểm thử race condition cho Cal.com, một hệ thống đặt lịch mã nguồn mở. Nhóm dựng hệ thống trên máy cá nhân, phân tích luồng đặt lịch, thiết kế 8 test case xoay quanh các tính chất dữ liệu phải luôn đúng, viết bộ test tự động gửi request đồng thời bằng k6 và kiểm tra trực tiếp cơ sở dữ liệu PostgreSQL. Kết quả là 6 lỗi, mỗi lỗi đều được tái hiện lại bằng lệnh `curl` thuần và được xác nhận trên hai máy khác nhau."),
    P("Mục đích của báo cáo giữa kỳ này là **thuyết phục tính khả thi của kế hoạch kiểm thử** để được duyệt: kế hoạch có phạm vi hợp lý, tiêu chí đánh giá rõ ràng, chi phí thấp, và đã được chứng minh chạy thật bằng bộ test và các lỗi thật tìm được. Báo cáo cũng ghi rõ nhiệm vụ và đóng góp của từng thành viên.")
  );

  // ===== CHƯƠNG 1 =====
  body.push(H1("CHƯƠNG 1. TỔNG QUAN VỀ ĐỀ TÀI"));
  body.push(H2("1.1. Giới thiệu đề tài"));
  body.push(
    P("Cal.com là phần mềm đặt lịch hẹn mã nguồn mở, có chức năng tương tự dịch vụ Calendly. Chủ lịch (host) tạo các loại cuộc hẹn, chẳng hạn “Tư vấn 30 phút”, và khai báo khung giờ mình rảnh. Hệ thống cung cấp một đường dẫn công khai cho từng loại cuộc hẹn. Khách mở đường dẫn, xem các giờ còn trống, chọn một giờ, điền họ tên và email rồi đặt lịch mà không cần tài khoản. Sau đó hệ thống ghi nhận cuộc hẹn, đánh dấu giờ đó đã kín và gửi thông báo cho hai bên. Khách cũng có thể đổi lịch hoặc hủy lịch bằng đường dẫn trong thông báo."),
    P("Đề tài R05-K15 chọn Cal.com làm hệ thống cần kiểm thử (mã R05 trong danh sách của giảng viên) và áp dụng kỹ thuật kiểm thử đồng thời, hay kiểm thử race condition (mã K15): tạo nhiều yêu cầu đồng thời để tìm các lỗi như đặt trùng giờ (double booking) hoặc ghi đè dữ liệu (lost update)."),
    P("Phiên bản được kiểm thử là Cal.com `v6.2.0`, commit `1c193cca8682b33b9866c792186033f7ef886682`. Việc cố định phiên bản giúp kết quả kiểm thử không bị thay đổi khi mã nguồn trên nhánh chính được cập nhật trong học kỳ.")
  );
  body.push(H2("1.2. Lý do chọn đề tài"));
  body.push(
    P("Thứ nhất, đặt lịch là bài toán điển hình của tranh chấp tài nguyên: nhiều người không quen biết nhau cùng giành một khung giờ của một chủ lịch. Hậu quả của lỗi đặt trùng giờ rất rõ ràng với người dùng: hai khách cùng nhận xác nhận cho một giờ, chủ lịch phải từ chối một người sau khi đã hứa."),
    P("Thứ hai, điểm vào đặt lịch của Cal.com là công khai, không cần đăng nhập, nên bất kỳ ai cũng gửi được nhiều yêu cầu cùng lúc, và hai khách thật hoàn toàn có thể đặt cùng một thời điểm. Theo đề bài của giảng viên, Cal.com đặc biệt phù hợp với kiểm thử trạng thái và kiểm thử đồng thời."),
    P("Thứ ba, các kịch bản kiểm thử chạy tuần tự thông thường không phát hiện được loại lỗi này, trong khi mã nguồn mở cho phép nhóm đọc trực tiếp luồng xử lý, xác định chỗ thiếu bảo vệ và giải thích nguyên nhân gốc của lỗi. Đây là cơ hội để nhóm thực hành đầy đủ chu trình: phân tích, thiết kế kiểm thử, tự động hóa, phát hiện lỗi và phân tích nguyên nhân.")
  );
  body.push(H2("1.3. Mục tiêu đề tài"));
  body.push(PN("Mục tiêu chính của đề tài là áp dụng kỹ thuật kiểm thử đồng thời lên luồng đặt lịch của Cal.com, tìm ra các lỗi thật và chứng minh được chúng bằng dữ liệu kiểm chứng lại được. Cụ thể:"));
  body.push(
    L("1)", "Dựng được Cal.com trên máy cá nhân, chạy thành công ba luồng nghiệp vụ (đặt lịch, đổi lịch, hủy lịch) và lập tài liệu cài đặt cho người khác làm lại."),
    L("2)", "Đọc hiểu mã nguồn, vẽ lại kiến trúc và luồng dữ liệu của nghiệp vụ trọng tâm, xác định các điểm có nguy cơ xảy ra tranh chấp."),
    L("3)", "Xác định các tính chất dữ liệu bất biến (invariant) và thiết kế danh sách test case để kiểm tra chúng."),
    L("4)", "Viết bộ test tự động, chạy lại được: gửi request đồng thời, kiểm tra dữ liệu trong cơ sở dữ liệu, có nhóm đối chứng gửi tuần tự."),
    L("5)", "Chạy test, thu thập kết quả, phát hiện lỗi, tái hiện lỗi độc lập và phân tích nguyên nhân gốc."),
    L("6)", "Làm việc nhóm theo quy trình chuẩn: dùng Git, bảng công việc, phân vai rõ ràng và báo cáo kỹ thuật.")
  );
  body.push(H2("1.4. Phạm vi nghiên cứu"));
  body.push(P("Do hệ thống Cal.com rất lớn, đề tài giới hạn phạm vi vào luồng đặt lịch như trình bày ở [[tbl:pham-vi]], thay vì kiểm thử toàn bộ hệ thống."));
  body.push(...table([
    ["Trong phạm vi", "Ngoài phạm vi"],
    ["Đặt lịch cuộc hẹn 1-1", "Đồng bộ lịch ngoài (Google Calendar, Outlook)"],
    ["Cuộc hẹn có ghế (nhiều người cùng một giờ, có giới hạn chỗ)", "Thanh toán trực tuyến"],
    ["Cuộc hẹn cần xác nhận của chủ lịch", "Cuộc hẹn của nhóm, phân công vòng tròn (round-robin)"],
    ["Đổi lịch và hủy lịch", "API phiên bản 2 (NestJS)"],
    ["Giới hạn số booking trong một ngày", "Kiểm thử hiệu năng quy mô lớn"],
  ], [1, 1], "Phạm vi kiểm thử của đề tài", { key: "pham-vi" }));
  body.push(P("Mọi lần chạy kiểm thử đều thực hiện trên máy cá nhân của nhóm, với một bản Cal.com và một cơ sở dữ liệu cục bộ. Nhóm không gửi tải vào bất kỳ máy chủ công khai nào."));
  body.push(H2("1.5. Cấu trúc báo cáo và đối chiếu với yêu cầu của đề bài"));
  body.push(P("Theo bản phân công đề tài, báo cáo phải có tám phần A đến H. Báo cáo này trình bày theo cấu trúc đồ án của khoa (mở đầu, bốn chương, kết luận) và đối chiếu các phần của đề bài với các mục tương ứng ở [[tbl:doi-chieu]]."));
  body.push(...table([
    ["Phần", "Yêu cầu của đề bài", "Mục trong báo cáo"],
    ["A", "Mục tiêu hệ thống, tác nhân và use case chính, cây thư mục và module, phụ thuộc, luồng dữ liệu", "3.2.1 đến 3.2.4"],
    ["B", "Ít nhất một sơ đồ kiến trúc mức component/container, giải thích 3 đến 5 module liên quan đến kiểm thử", "3.2.5"],
    ["C", "Môi trường, phiên bản, lệnh chạy, dữ liệu mẫu; bằng chứng hệ thống chạy và ít nhất 3 luồng nghiệp vụ", "4.2"],
    ["D", "Nguyên lý kỹ thuật, lý do chọn phạm vi, giả định, rủi ro, tiêu chí pass/fail", "2.1, 1.2, 3.3.1 đến 3.3.3, 3.3.5"],
    ["E", "Thiết kế test case: input, tiền điều kiện, kết quả mong đợi, dữ liệu test", "3.3.4 đến 3.3.7"],
    ["F", "Mã nguồn test chạy lại tự động, tệp README chứa lệnh chạy và phụ thuộc", "4.1, 4.3"],
    ["G", "Log, báo cáo, số đo, danh sách lỗi và nguyên nhân gốc", "4.4, 4.5"],
    ["H", "Ghim phiên bản, lưu cấu hình test, cách chạy lại trên máy mới", "4.7"],
  ], [1, 8, 3.4], "Đối chiếu các phần A đến H của đề bài với các mục của báo cáo", { center: [0, 2], key: "doi-chieu" }));
  body.push(P("Ngoài các phần A đến H, giảng viên yêu cầu báo cáo giữa kỳ nêu rõ sáu nội dung dưới đây. [[tbl:yeu-cau-gk]] chỉ ra vị trí của từng nội dung trong báo cáo."));
  body.push(...table([
    ["Yêu cầu của giảng viên", "Mục trong báo cáo", "Tóm tắt"],
    ["Đưa ra quy trình test", "3.3.4, 3.3.5", "Quy trình 7 bước, tiêu chí pass/fail, nhóm đối chứng tuần tự"],
    ["Danh sách test case là gì", "3.3.6", "8 test case TC-01 đến TC-08, mỗi test case có đặc tả đầy đủ tiền điều kiện, input, kết quả mong đợi, dữ liệu"],
    ["Chi phí cho việc test", "4.4.4", "0 đồng; 1 140 request, 176 giây máy cho lượt chính thức; ước lượng nhân lực 34 đến 46 giờ"],
    ["Nêu kế hoạch test (giữa kỳ)", "3.3.2, 3.3.3, 3.4", "Phạm vi, giả định, rủi ro, lịch, tính khả thi và đề nghị duyệt"],
    ["Test như thế nào", "4.3, 4.4", "Gửi đồng thời bằng k6, kiểm tra dữ liệu trong cơ sở dữ liệu, chạy 10 vòng, đối chứng tuần tự, chạy lại trên máy thứ hai"],
    ["Kỹ thuật test", "2.1, 3.3.1", "Kiểm thử đồng thời (race condition): nguyên lý, lý do chọn, giới hạn"],
  ], [3.6, 2.4, 7], "Đối chiếu các yêu cầu của giảng viên cho báo cáo giữa kỳ", { center: [1], key: "yeu-cau-gk", size: 22 }));

  // ===== CHƯƠNG 2 =====
  body.push(H1("CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ"));
  body.push(H2("2.1. Race condition và kiểm thử đồng thời"));
  body.push(
    P("Race condition (tranh chấp dữ liệu) xảy ra khi kết quả của chương trình phụ thuộc vào thứ tự xen kẽ của các thao tác đồng thời trên cùng một dữ liệu dùng chung. Dạng phổ biến nhất trong ứng dụng web là TOCTOU (time-of-check to time-of-use) [6]: yêu cầu đọc trạng thái, ra quyết định dựa trên trạng thái đó, rồi mới ghi. Nếu một yêu cầu khác ghi vào giữa hai bước đọc và ghi, quyết định ban đầu đã dựa trên dữ liệu cũ."),
    P("Ví dụ với hệ thống đặt lịch: yêu cầu A đọc lịch của chủ lịch và thấy khung 09:00 còn trống; yêu cầu B cũng đọc và thấy trống; sau đó cả hai cùng ghi booking. Kết quả là hai booking trùng giờ dù mỗi yêu cầu, xét riêng, đều “đúng”."),
    P("Kiểm thử đồng thời khác kiểm thử chức năng thông thường ở ba điểm. Thứ nhất, kết quả đúng sai không thể chỉ nhìn vào mã phản hồi HTTP: một API có thể trả 200 cho mọi yêu cầu mà dữ liệu vẫn sai. Vì vậy người kiểm thử phải xác định các **invariant**, tức tính chất luôn phải đúng của dữ liệu (ví dụ “một chủ lịch không có hai booking còn hiệu lực chồng giờ”) và kiểm tra trực tiếp trong cơ sở dữ liệu sau khi chạy. Thứ hai, các yêu cầu phải thực sự rơi vào cùng cửa sổ race, nên cần cơ chế đồng bộ thời điểm gửi. Thứ ba, kết quả mang tính xác suất, nên phải lặp nhiều vòng và báo tỉ lệ vòng vi phạm."),
    P("Để phân biệt lỗi race với lỗi logic thông thường, nhóm dùng **nhóm đối chứng**: gửi đúng các yêu cầu đó nhưng lần lượt. Nếu chạy tuần tự đúng mà chạy đồng thời sai thì đó là lỗi race; nếu cả hai đều sai thì đó là lỗi logic.")
  );
  body.push(H2("2.2. Hệ thống đặt lịch và các cơ chế bảo vệ"));
  body.push(
    P("Một hệ thống đặt lịch có hai nhóm tác nhân: chủ lịch, người tạo loại cuộc hẹn và khai báo giờ rảnh; và khách, người chọn giờ và đặt lịch. Tài nguyên dùng chung là các khung giờ của chủ lịch. Để bảo vệ tài nguyên này khỏi tranh chấp, phần mềm thường kết hợp nhiều cơ chế ở các tầng khác nhau:"),
    L("1)", "**Ràng buộc duy nhất (UNIQUE)** trong cơ sở dữ liệu: từ chối bản ghi thứ hai có cùng giá trị khóa. Hiệu quả khi hai yêu cầu trùng khít, nhưng không bắt được trường hợp chồng lấn một phần."),
    L("2)", "**Khóa dòng (`SELECT … FOR UPDATE`)** [4]: một giao dịch giữ khóa trên dòng dữ liệu, các giao dịch khác phải chờ. Dùng để tránh hai yêu cầu cùng đọc rồi cùng cập nhật một dòng."),
    L("3)", "**Ràng buộc loại trừ (exclusion constraint)** [3]: cho phép khai báo trong PostgreSQL rằng hai bản ghi không được có khoảng thời gian giao nhau với cùng một chủ lịch."),
    L("4)", "**Kiểm tra ở tầng ứng dụng**: đọc dữ liệu hiện có và từ chối nếu vi phạm quy tắc. Đây là cơ chế yếu nhất trước tranh chấp nếu không đi kèm khóa hoặc ràng buộc ở cơ sở dữ liệu.")
  );
  body.push(H2("2.3. Công nghệ sử dụng"));
  body.push(H3("2.3.1. Cal.com"));
  body.push(P("Cal.com là monorepo quản lý bằng Yarn 4 và Turborepo [1]. Ứng dụng web viết bằng TypeScript, chạy trên Next.js 16; lớp dữ liệu dùng Prisma 6.16.1 kết nối PostgreSQL; giao tiếp giữa giao diện và máy chủ dùng thêm tRPC. Điểm vào đặt lịch công khai là `POST /api/book/event`, điểm vào hủy lịch là `POST /api/cancel` (có cơ chế CSRF kiểu double-submit cookie). Phần xử lý nghiệp vụ nằm trong gói `packages/features/bookings`."));
  body.push(H3("2.3.2. PostgreSQL"));
  body.push(P("PostgreSQL 16 là hệ quản trị cơ sở dữ liệu quan hệ lưu toàn bộ dữ liệu của Cal.com và cũng là nơi nhóm kiểm tra các invariant. PostgreSQL hỗ trợ ràng buộc duy nhất, khóa dòng và ràng buộc loại trừ [3][4]. Cơ sở dữ liệu được cấu hình tối đa 300 kết nối đồng thời, vì mỗi yêu cầu gửi đồng thời giữ một kết nối."));
  body.push(H3("2.3.3. k6"));
  body.push(P("k6 là công cụ kiểm thử tải mã nguồn mở của Grafana Labs, viết kịch bản bằng JavaScript [2]. Nhóm dùng bộ thực thi `per-vu-iterations`: mỗi người dùng ảo (VU) gửi đúng một yêu cầu, và tất cả cùng chờ một mốc thời gian chung rồi mới gửi để các yêu cầu thực sự chồng lên nhau. Phiên bản dùng là k6 2.3.0 trên máy macOS và 2.2.0 trên máy Windows."));
  body.push(H3("2.3.4. Node.js và thư viện pg"));
  body.push(P("Phần điều phối của bộ test viết bằng Node.js 22, gồm chuẩn bị dữ liệu, gọi k6, truy vấn cơ sở dữ liệu bằng thư viện `pg` để kiểm invariant và sinh báo cáo. Node.js 22.23.2 trên máy macOS và 22.18.0 trên máy Windows."));
  body.push(H3("2.3.5. Git và GitHub Projects"));
  body.push(P("Mã nguồn bộ test, tài liệu và kết quả được quản lý bằng Git và lưu trên GitHub. Công việc của nhóm được theo dõi bằng bảng công việc GitHub Projects. Chương 4 trình bày kết quả sử dụng."));

  // ===== CHƯƠNG 3 =====
  body.push(H1("CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ KIỂM THỬ"));
  body.push(H2("3.1. Phân tích yêu cầu kiểm thử"));
  body.push(P("Quá trình phân tích chia thành hai nhóm: các nghiệp vụ của hệ thống cần được kiểm thử (yêu cầu chức năng) và các yêu cầu đối với chính bộ kiểm thử (yêu cầu phi chức năng)."));
  body.push(H3("3.1.1. Yêu cầu chức năng"));
  body.push(PN("Các nghiệp vụ trong phạm vi kiểm thử gồm:"));
  body.push(
    L("1)", "Đặt lịch cuộc hẹn 1-1: khách chọn một giờ trống và đặt; hệ thống phải bảo đảm một giờ chỉ thuộc về một khách."),
    L("2)", "Đặt chỗ cuộc hẹn có ghế: nhiều người có thể cùng đặt một giờ cho đến khi hết số ghế quy định."),
    L("3)", "Đặt lịch cuộc hẹn cần xác nhận: booking ở trạng thái chờ xác nhận vẫn giữ chỗ cho đến khi chủ lịch xử lý."),
    L("4)", "Đổi lịch: chuyển một booking sang giờ mới, booking cũ chuyển sang trạng thái đã hủy."),
    L("5)", "Hủy lịch: khách hủy booking bằng đường dẫn hủy."),
    L("6)", "Giới hạn số booking: loại cuộc hẹn có thể quy định tối đa một số booking trong một ngày.")
  );
  body.push(H3("3.1.2. Yêu cầu phi chức năng của bộ test"));
  body.push(
    L("1)", "Đồng thời thật: các yêu cầu phải được gửi trong cùng một khoảng thời gian rất ngắn để chạm vào cửa sổ race."),
    L("2)", "Oracle là dữ liệu: kết luận đúng sai dựa trên kiểm tra trực tiếp cơ sở dữ liệu, không dựa vào mã HTTP."),
    L("3)", "Chạy lại được: một lệnh chạy toàn bộ bộ test, có tài liệu cài đặt từ máy sạch và cố định phiên bản."),
    L("4)", "Cô lập: mỗi vòng dùng một ngày riêng trong tương lai để các vòng không ảnh hưởng nhau."),
    L("5)", "An toàn: chỉ chạy trên máy cục bộ, không tạo tải vào máy chủ công khai."),
    L("6)", "Có đối chứng: mỗi test case chạy cả chế độ đồng thời và tuần tự để phân loại lỗi.")
  );

  body.push(H2("3.2. Phân tích hệ thống được kiểm thử"));
  body.push(H3("3.2.1. Mục tiêu, tác nhân và use case chính"));
  body.push(P("Mục tiêu của Cal.com là cho phép người sở hữu lịch công bố giờ rảnh và để khách tự đặt, đổi, hủy cuộc hẹn mà không cần trao đổi qua lại. Hệ thống có hai tác nhân chính: **khách** (không cần tài khoản) và **chủ lịch** (có tài khoản). [[fig:usecase]] và [[tbl:use-case]] trình bày các use case chính; đề tài tập trung vào nhóm use case của khách (UC01 đến UC03) vì đó là nơi nhiều người cùng tranh một tài nguyên."));
  body.push(...fig("hinh-usecase.png", "Sơ đồ use case chính của Cal.com", 14, "usecase"));
  body.push(...table([
    ["Mã", "Use case", "Tác nhân", "Mô tả"],
    ["UC01", "Đặt lịch", "Khách", "Chọn giờ trống của một loại cuộc hẹn, điền họ tên, email và đặt"],
    ["UC02", "Đổi lịch", "Khách", "Chuyển cuộc hẹn đã đặt sang giờ khác bằng đường dẫn đổi lịch"],
    ["UC03", "Hủy lịch", "Khách", "Hủy cuộc hẹn đã đặt bằng đường dẫn hủy"],
    ["UC04", "Tạo loại cuộc hẹn, khai báo giờ rảnh", "Chủ lịch", "Cấu hình thời lượng, số ghế, giới hạn, giờ làm việc"],
    ["UC05", "Xác nhận hoặc từ chối booking", "Chủ lịch", "Xử lý các booking ở trạng thái chờ xác nhận"],
  ], [1, 4, 1.8, 6], "Các use case chính của Cal.com", { center: [0], key: "use-case" }));

  body.push(H3("3.2.2. Cây thư mục và module"));
  body.push(P("Cal.com là monorepo với khoảng 7 950 tệp TypeScript. [[tbl:thu-muc-calcom]] liệt kê các thư mục chính liên quan đến luồng đặt lịch."));
  body.push(...table([
    ["Thư mục", "Vai trò"],
    ["`apps/web`", "Ứng dụng Next.js: giao diện và các API route (`/api/book/event`, `/api/cancel`)"],
    ["`apps/api/v1`, `apps/api/v2`", "REST API phiên bản 1 và phiên bản 2 (NestJS)"],
    ["`packages/features`", "Nghiệp vụ theo miền: bookings, availability, slots, schedules, eventtypes…"],
    ["`packages/trpc`", "Các router tRPC cho giao diện (ví dụ lấy giờ trống, giữ chỗ tạm)"],
    ["`packages/prisma`", "Lược đồ cơ sở dữ liệu, migration và các phần mở rộng (extension)"],
    ["`packages/lib`", "Tiện ích dùng chung (lỗi HTTP, kiểm soát tần suất…)"],
    ["`packages/app-store`", "Các tích hợp: lịch ngoài, video, thanh toán"],
    ["`packages/emails`, `packages/ui`", "Thông báo và các thành phần giao diện"],
  ], [3.6, 8.4], "Các thư mục chính của Cal.com", { key: "thu-muc-calcom" }));

  body.push(H3("3.2.3. Phụ thuộc chính"));
  body.push(...table([
    ["Thành phần", "Phiên bản", "Vai trò"],
    ["Node.js", "22", "Môi trường chạy"],
    ["Yarn", "4.12.0", "Quản lý gói, khai báo trong `packageManager`"],
    ["Next.js", "16.1.5", "Khung ứng dụng web"],
    ["React", "18.2.0", "Thư viện giao diện"],
    ["Prisma", "6.16.1", "ORM, kết nối PostgreSQL"],
    ["PostgreSQL", "16", "Cơ sở dữ liệu"],
    ["tRPC, NestJS, Turborepo", "–", "Giao tiếp giao diện – máy chủ, API v2, điều phối build"],
  ], [3.4, 2, 6.6], "Các phụ thuộc chính của Cal.com v6.2.0"));

  body.push(H3("3.2.4. Luồng dữ liệu của nghiệp vụ đặt lịch"));
  body.push(
    L("1)", "Khách mở trang của loại cuộc hẹn; giao diện gọi tRPC `slots.getSchedule` để tính các giờ trống từ giờ làm việc trừ đi các booking hiện có."),
    L("2)", "Khách chọn giờ; giao diện có thể gọi `slots.reserveSlot` để giữ chỗ tạm trên giao diện."),
    L("3)", "Khách điền thông tin và gửi `POST /api/book/event`, vào `RegularBookingService.createBooking()`: (a) tải loại cuộc hẹn, chủ lịch và booking gốc nếu đổi lịch; (b) kiểm tra giới hạn số booking; (c) kiểm tra chủ lịch còn trống; (d) nếu cuộc hẹn có ghế thì thêm ghế vào booking của giờ đó; (e) ngược lại mở giao dịch, hủy booking gốc nếu đổi lịch rồi ghi `Booking` và `Attendee`."),
    L("4)", "Sau khi ghi, hệ thống gửi email, kích hoạt webhook và đồng bộ lịch ngoài."),
    L("5)", "Hủy lịch: `POST /api/cancel` (kèm mã CSRF) chuyển trạng thái booking sang đã hủy và xóa khóa chống trùng.")
  );
  body.push(P("Các bước (b), (c) chỉ **đọc**, bước (e) mới **ghi**, và giữa chúng không có khóa nào được giữ. Đây là nơi nhóm kỳ vọng tìm thấy race."));

  body.push(H3("3.2.5. Kiến trúc và các module liên quan đến kiểm thử"));
  body.push(P("[[fig:container]] là sơ đồ mức container của Cal.com, và [[fig:kt-test]] mô tả vị trí của bộ test: bộ test đóng vai khách gửi yêu cầu vào `apps/web`, đồng thời đọc trực tiếp PostgreSQL để kiểm invariant."));
  body.push(...fig("hinh-container.png", "Sơ đồ container của Cal.com", 14.5, "container"));
  body.push(...fig("hinh-kien-truc.png", "Hệ thống được kiểm thử và vị trí của bộ test", 14.5, "kt-test"));
  body.push(PN("Năm module liên quan trực tiếp đến kiểm thử:"));
  body.push(
    L("1)", "`RegularBookingService.createBooking()`: điều phối toàn bộ luồng tạo và đổi lịch. Nó đọc giới hạn số booking, đọc lịch trống rồi mới ghi."),
    L("2)", "`createBooking.ts`: ghi `Booking` trong một giao dịch; khi đổi lịch, đồng thời chuyển booking gốc sang đã hủy bằng lệnh cập nhật theo mã (`id`), không kèm điều kiện trạng thái."),
    L("3)", "Phần mở rộng Prisma `booking-idempotency-key`: gán `idempotencyKey` là giá trị băm từ giờ bắt đầu, giờ kết thúc và chủ lịch, chỉ khi booking ở trạng thái đã chấp nhận (ACCEPTED). Cột này có ràng buộc duy nhất."),
    L("4)", "`handleSeats` và `addSeatToBooking`: xử lý cuộc hẹn có ghế; hàm thêm ghế dùng `SELECT … FOR UPDATE` khi booking của giờ đó đã tồn tại."),
    L("5)", "`checkBookingLimits`, `ensureAvailableUsers`, `getOriginalRescheduledBooking`: các bước kiểm tra trước khi ghi (giới hạn, lịch trống, booking gốc hợp lệ).")
  );
  body.push(P("Khi đọc mã, nhóm nhận thấy giữa các bước kiểm tra (đọc) và bước ghi không có khóa hay giao dịch bao trùm. [[fig:toctou]] minh họa tình huống hai khách đặt hai giờ chồng nhau: cả hai cùng thấy lịch trống, mỗi bên ghi một booking với khóa `idempotencyKey` khác nhau, nên ràng buộc duy nhất không chặn được. Đây là giả thuyết ban đầu của nhóm, được kiểm chứng ở Chương 4."));
  body.push(...fig("hinh-toctou.png", "Khe hở kiểm tra rồi mới ghi khi hai khách đặt hai giờ chồng nhau", 14, "toctou"));

  body.push(H2("3.3. Thiết kế kiểm thử"));
  body.push(H3("3.3.1. Nguyên lý và lý do chọn phạm vi"));
  body.push(P("Nguyên lý của kỹ thuật được trình bày ở mục 2.1: gửi đồng thời thật, dùng invariant trong cơ sở dữ liệu làm oracle, có nhóm đối chứng tuần tự và lặp nhiều vòng. Nhóm chọn phạm vi luồng đặt lịch vì ba lý do ở mục 1.2: tranh chấp tài nguyên là bản chất của bài toán, điểm vào công khai nên dễ bị khai thác đồng thời, và có thể đọc mã để giải thích nguyên nhân. Phạm vi gồm năm biến thể có cơ chế bảo vệ khác nhau (cuộc hẹn 1-1, có ghế, cần xác nhận, đổi hoặc hủy lịch, giới hạn số lượng), giúp so sánh chỗ nào đã được bảo vệ và chỗ nào chưa."));
  body.push(H3("3.3.2. Giả định"));
  body.push(
    L("1)", "Một bản Cal.com, một PostgreSQL, chạy trên máy cục bộ; không có bộ nhớ đệm hay hàng đợi phân tán."),
    L("2)", "Chạy bằng `yarn dev`. Logic nghiệp vụ giống bản dựng chính thức; độ trễ có thể khác. Trên hệ thống thật, cửa sổ race có thể rộng hơn do có thêm lời gọi tới lịch ngoài."),
    L("3)", "Chủ lịch test không kết nối lịch ngoài nên lịch bận chỉ đến từ bảng `Booking`."),
    L("4)", "Kiểm soát tần suất yêu cầu (rate limit) tắt, vì không đặt biến `UNKEY_ROOT_KEY`."),
    L("5)", "Mỗi vòng dùng một ngày riêng trong tương lai (2027 đến 2029) nên các vòng độc lập nhau.")
  );
  body.push(H3("3.3.3. Rủi ro và cách xử lý"));
  body.push(...table([
    ["Rủi ro", "Cách xử lý"],
    ["Race không tái hiện ổn định", "Chạy 10 vòng mỗi test case, báo tỉ lệ vòng vi phạm"],
    ["Nhầm lỗi logic với lỗi race", "Nhóm đối chứng gửi tuần tự cùng các yêu cầu"],
    ["Request không thực sự đồng thời", "Mốc thời gian gửi chung `START_AT`, đo độ lệch thời điểm gửi (0 đến 1 ms)"],
    ["Oracle sai (ví dụ lệch múi giờ)", "Kiểm invariant bằng SQL; phát hiện và sửa lỗi lệch 7 giờ của trình điều khiển"],
    ["Kết quả khác trên máy khác", "Ghim phiên bản, chạy lại trên máy thứ hai"],
    ["Hai lượt test chạy chồng nhau làm hỏng kết quả", "Quy tắc: tại một thời điểm chỉ một lượt chạy; kiểm tra tiến trình trước khi chạy"],
    ["Máy yếu khi chạy cả hệ thống", "Giảm số yêu cầu đồng thời; khởi động nóng Cal.com"],
  ], [5, 7], "Rủi ro của kế hoạch kiểm thử và cách xử lý"));

  body.push(H3("3.3.4. Quy trình test"));
  body.push(P("Quy trình gồm bảy bước như [[fig:quy-trinh]]. Điểm khác biệt so với quy trình kiểm thử chức năng nằm ở bước 5 và 6: chạy cả hai chế độ đồng thời và tuần tự, rồi kiểm tra dữ liệu trong cơ sở dữ liệu."));
  body.push(...fig("hinh-quy-trinh.png", "Quy trình test gồm bảy bước", 15, "quy-trinh"));
  body.push(...table([
    ["Bước", "Việc làm", "Sản phẩm"],
    ["1", "Đọc mã luồng đặt lịch, tìm chỗ kiểm tra rồi mới ghi", "Sơ đồ kiến trúc, giả thuyết"],
    ["2", "Chọn 7 invariant I1 đến I7", "[[tbl:invariant]]"],
    ["3", "Thiết kế 8 test case TC-01 đến TC-08", "Mục 3.3.6"],
    ["4", "Tạo host test, loại cuộc hẹn; mỗi vòng dùng ngày riêng", "`fixtures.sql`"],
    ["5", "Chạy đồng thời bằng k6, rồi chạy lại đúng các yêu cầu đó tuần tự", "`run.mjs`, `race.js`"],
    ["6", "Truy vấn SQL kiểm invariant sau mỗi vòng", "`scenarios.mjs`, `db.mjs`"],
    ["7", "Đọc mã tìm nguyên nhân, thử khắc phục trên dữ liệu test", "Chương 4"],
  ], [1, 7, 4], "Các bước của quy trình test", { center: [0] }));
  body.push(H3("3.3.5. Invariant và tiêu chí pass/fail"));
  body.push(...table([
    ["ID", "Tính chất luôn phải đúng", "Cách kiểm trong CSDL"],
    ["I1", "Một chủ lịch không có hai booking hiệu lực chồng giờ", "Ghép bảng `Booking` với chính nó theo `userId`, hai khoảng giờ giao nhau"],
    ["I2", "Không vượt số ghế của cuộc hẹn", "Đếm `BookingSeat` theo giờ"],
    ["I2b", "Còn ghế thì người đặt không bị từ chối", "So số người thành công với số ghế trống"],
    ["I3", "Một giờ có tối đa một booking chờ xác nhận", "Như I1, gồm cả trạng thái `pending`"],
    ["I4", "Một booking gốc sinh tối đa một booking mới hiệu lực", "Đếm booking có `fromReschedule` bằng mã gốc"],
    ["I5", "Hủy báo thành công thì không còn booking hiệu lực của cuộc hẹn đó", "Kết hợp mã HTTP lệnh hủy và trạng thái các booking con"],
    ["I6", "Số booking trong ngày không vượt giới hạn", "Đếm booking hiệu lực theo ngày"],
    ["I7", "Không có phản hồi 5xx, quá thời gian hay lỗi kết nối", "Log của k6"],
  ], [1, 6, 6], "Các invariant dùng làm tiêu chí đúng sai", { center: [0], key: "invariant" }));
  body.push(PN("**Tiêu chí pass/fail:**"));
  body.push(
    L("1)", "Một vòng đạt khi mọi invariant của test case đúng và không có phản hồi 5xx hay lỗi kết nối."),
    L("2)", "Một test case đạt khi cả 10 vòng đạt. Chỉ cần một vòng vi phạm là test case không đạt."),
    L("3)", "Là lỗi race khi chạy đồng thời không đạt nhưng chạy tuần tự đạt. Nếu chạy tuần tự cũng không đạt thì là lỗi logic.")
  );
  body.push(H3("3.3.6. Danh sách và đặc tả test case"));
  body.push(P("Dữ liệu chung của mọi test case: chủ lịch `k15host` (múi giờ UTC, rảnh cả ngày mọi ngày) và năm loại cuộc hẹn ở [[tbl:loai]]. Mỗi yêu cầu dùng một email người đặt khác nhau."));
  body.push(...table([
    ["Loại cuộc hẹn", "Thời lượng", "Cấu hình đặc biệt"],
    ["`k15-30`", "30 phút", "Không"],
    ["`k15-60`", "60 phút", "Không"],
    ["`k15-seated`", "30 phút", "3 ghế mỗi giờ"],
    ["`k15-confirm`", "30 phút", "Cần xác nhận, booking chờ vẫn giữ chỗ"],
    ["`k15-limit`", "30 phút", "Tối đa 1 booking mỗi ngày"],
  ], [3, 2, 6], "Các loại cuộc hẹn dùng cho kiểm thử", { key: "loai" }));
  body.push(P("[[tbl:ds-tc]] tổng hợp danh sách test case. Từ [[tbl:spec1]] đến [[tbl:spec8]] là đặc tả từng test case theo mẫu: mô tả, tác nhân, tiền điều kiện, input, kết quả mong đợi, invariant."));
  body.push(...table([
    ["TC", "Test case", "Input (gửi đồng thời)", "Kết quả mong đợi", "Invariant"],
    ["TC-01", "Nhiều người đặt cùng một giờ", "10 người đặt `k15-30` lúc 09:00", "1 người 200, 9 người 409", "I1"],
    ["TC-02", "Các giờ chồng lấn", "10 người, giờ lệch 3 phút, độ dài 30 và 60 phút", "Chỉ 1 booking hiệu lực", "I1"],
    ["TC-03", "Tranh ghế đầu tiên", "6 người đặt `k15-seated`, giờ trống", "3 người 200, 3 người 409; 3 ghế", "I2, I2b"],
    ["TC-04", "Tranh 2 ghế còn lại", "6 người, giờ đã có 1 người", "2 người 200, 4 người 409", "I2, I2b"],
    ["TC-05", "Cuộc hẹn cần xác nhận", "10 người đặt `k15-confirm`", "Chỉ 1 booking chờ xác nhận", "I3"],
    ["TC-06", "Đổi lịch nhiều lần", "5 lệnh đổi lịch cùng một booking", "1 lệnh thành công", "I4"],
    ["TC-07", "Hủy và đổi lịch cùng lúc", "1 lệnh hủy + 1 lệnh đổi lịch", "Không thể cả hai cùng thành công", "I5"],
    ["TC-08", "Vượt giới hạn 1 booking mỗi ngày", "8 người đặt 8 giờ khác nhau", "Chỉ 1 người thành công", "I6"],
  ], [1.3, 3.2, 4.2, 3.6, 1.4], "Danh sách test case", { center: [0, 4], size: 22, key: "ds-tc" }));
  let specN = 0;
  const spec = (tc, name, desc, pre, input, expected, inv) => {
    specN += 1;
    return table([
      ["Mô tả", desc], ["Tác nhân chính", "Khách đặt lịch (người dùng ảo k6)"], ["Tiền điều kiện", pre], ["Input", input], ["Kết quả mong đợi", expected], ["Invariant", inv],
    ], [3, 9], `Bảng đặc tả ${tc}: ${name}`, { header: false, labelCol: true, key: `spec${specN}` });
  };
  body.push(...spec("TC-01", "nhiều người đặt cùng một giờ", "Kiểm tra ràng buộc duy nhất của hệ thống khi nhiều yêu cầu trùng khít cùng giờ.", "Giờ 09:00 của chủ lịch còn trống.", "10 người cùng đặt `k15-30` lúc 09:00.", "Đúng 1 yêu cầu thành công (200); 9 yêu cầu bị từ chối (409); cơ sở dữ liệu có 1 booking.", "I1, I7"));
  body.push(...spec("TC-02", "các giờ chồng lấn", "Kiểm tra hệ thống có chặn các booking chồng giờ nhưng không trùng khít (lệch giờ bắt đầu, khác độ dài).", "Khung 08:00 đến 11:00 còn trống.", "10 người: 7 người đặt `k15-30` bắt đầu 09:00 + 3i phút, 3 người đặt `k15-60` bắt đầu 08:30 + 3i phút; mọi khoảng chứa mốc 09:29.", "Chỉ 1 booking hiệu lực trong khung; các yêu cầu còn lại bị từ chối.", "I1, I7"));
  body.push(...spec("TC-03", "tranh ghế đầu tiên", "Kiểm tra cuộc hẹn có ghế khi nhiều người cùng đặt vào giờ chưa có ai.", "Giờ trống, cuộc hẹn có 3 ghế.", "6 người cùng đặt `k15-seated`.", "3 người thành công, 3 người bị từ chối vì hết ghế; một booking duy nhất với 3 ghế.", "I2, I2b, I7"));
  body.push(...spec("TC-04", "tranh 2 ghế còn lại", "Kiểm tra cơ chế khóa dòng khi giờ đã có booking và còn 2 ghế.", "Giờ đã có 1 người đặt (đặt tuần tự trước).", "6 người cùng đặt `k15-seated`.", "Đúng 2 người thành công, 4 người bị từ chối; tổng 3 ghế.", "I2, I2b, I7"));
  body.push(...spec("TC-05", "cuộc hẹn cần xác nhận", "Kiểm tra booking chờ xác nhận có giữ chỗ khi nhiều người đặt cùng giờ.", "Giờ trống, cuộc hẹn cần xác nhận và bật giữ chỗ cho booking chờ.", "10 người cùng đặt `k15-confirm`.", "Chỉ 1 booking chờ xác nhận cho giờ đó.", "I3, I7"));
  body.push(...spec("TC-06", "đổi lịch nhiều lần", "Kiểm tra một booking đã đổi lịch có thể bị đổi tiếp bằng cùng mã gốc hay không.", "Booking B lúc 09:00 ở trạng thái đã chấp nhận.", "5 lệnh đổi lịch B sang 10:00, 11:00, 12:00, 13:00, 14:00.", "Một lệnh thành công; B bị hủy; chỉ 1 booking mới hiệu lực.", "I4, I7"));
  body.push(...spec("TC-07", "hủy và đổi lịch cùng lúc", "Kiểm tra tính nhất quán khi hai thao tác trái ngược tác động lên cùng một booking.", "Booking B lúc 09:00.", "1 lệnh hủy B và 1 lệnh đổi lịch B sang 11:00 gửi đồng thời.", "Không thể cả hai cùng thành công; nếu hủy thành công thì không còn booking hiệu lực.", "I5, I7"));
  body.push(...spec("TC-08", "vượt giới hạn 1 booking mỗi ngày", "Kiểm tra giới hạn số booking khi nhiều yêu cầu cùng đếm trước khi ghi.", "Ngày trống, cuộc hẹn giới hạn 1 booking mỗi ngày.", "8 người cùng đặt 8 giờ khác nhau (09:00 đến 16:00) trong cùng một ngày.", "Chỉ 1 người thành công, 7 người bị từ chối vì vượt giới hạn.", "I6, I7"));
  body.push(H3("3.3.7. Cơ sở dữ liệu liên quan"));
  body.push(P("Các bảng của Cal.com mà bộ test đọc để kiểm invariant gồm `Booking`, `Attendee` và `BookingSeat`; [[tbl:booking]] đến [[tbl:bookingseat]] liệt kê các cột được sử dụng. Hai ràng buộc duy nhất đáng chú ý nằm ở bảng `Booking`: `uid` và `idempotencyKey`."));
  body.push(...table([
    ["Trường", "Kiểu dữ liệu", "Mô tả"],
    ["id", "integer", "Khóa chính"],
    ["uid", "text", "Mã công khai của booking (duy nhất)"],
    ["userId", "integer", "Chủ lịch sở hữu booking"],
    ["eventTypeId", "integer", "Loại cuộc hẹn"],
    ["startTime, endTime", "timestamp", "Giờ bắt đầu và kết thúc, lưu theo UTC"],
    ["status", "enum", "Trạng thái: accepted, pending, cancelled, rejected"],
    ["fromReschedule", "text", "Mã booking gốc nếu được tạo do đổi lịch"],
    ["rescheduled", "boolean", "Đánh dấu booking đã được đổi lịch"],
    ["idempotencyKey", "text", "Khóa chống trùng (duy nhất), chỉ gán khi booking đã chấp nhận"],
  ], [3, 2.2, 6.2], "Bảng Booking", { key: "booking" }));
  body.push(...table([
    ["Trường", "Kiểu dữ liệu", "Mô tả"],
    ["id", "integer", "Khóa chính"],
    ["bookingId", "integer", "Booking mà người tham dự thuộc về"],
    ["email, name", "text", "Email và họ tên người đặt"],
    ["timeZone", "text", "Múi giờ của người tham dự"],
  ], [3, 2.2, 6.2], "Bảng Attendee"));
  body.push(...table([
    ["Trường", "Kiểu dữ liệu", "Mô tả"],
    ["id", "integer", "Khóa chính"],
    ["referenceUid", "text", "Mã tham chiếu của ghế"],
    ["bookingId", "integer", "Booking chứa ghế"],
    ["attendeeId", "integer", "Người tham dự giữ ghế"],
  ], [3, 2.2, 6.2], "Bảng BookingSeat", { key: "bookingseat" }));

  body.push(H2("3.4. Kế hoạch kiểm thử và tính khả thi"));
  body.push(H3("3.4.1. Kế hoạch và lịch thực hiện"));
  body.push(...table([
    ["Giai đoạn", "Việc", "Trạng thái"],
    ["Đăng ký", "Chốt thành viên, repo, kỹ thuật, phiên bản; lập bảng công việc", "Xong"],
    ["Sprint 1 (đến 20/10)", "Dựng hệ thống, vẽ kiến trúc, viết tài liệu cài đặt, kế hoạch test, thử nghiệm đầu tiên", "Xong"],
    ["Sprint 2 và 3", "Bộ test 8 test case, chạy 10 vòng, đối chứng tuần tự, đo cửa sổ race, chạy lại trên máy Windows", "Xong"],
    ["Sprint 2 và 3 (còn lại)", "Kiểm thử qua giao diện bằng Playwright", "Chưa làm"],
    ["Sprint 4", "Rà soát nguyên nhân gốc, đề xuất sửa, hoàn thiện báo cáo cuối", "Đang làm"],
    ["Tháng 12", "Slide bảo vệ, tập dượt, đánh giá chéo giữa các thành viên", "Chưa làm"],
  ], [3.2, 7, 2], "Lịch thực hiện kế hoạch kiểm thử", { center: [2] }));
  body.push(H3("3.4.2. Tính khả thi và đề nghị duyệt"));
  body.push(P("Nhóm đề nghị được duyệt kế hoạch kiểm thử trên cơ sở các bằng chứng sau, đều đã thực hiện thật:"));
  body.push(
    L("1)", "**Hệ thống dựng được và chạy được:** Cal.com v6.2.0 chạy trên hai máy (macOS và Windows 11), ba luồng đặt, đổi, hủy lịch đều thành công."),
    L("2)", "**Kỹ thuật phát hiện được lỗi thật:** 6 trên 8 test case phát hiện lỗi; cả 6 lỗi tái hiện độc lập bằng `curl`, có dữ liệu sai trong cơ sở dữ liệu."),
    L("3)", "**Kết quả không phụ thuộc máy:** máy Windows cho cùng kết luận 8/8 với máy macOS."),
    L("4)", "**Chi phí thấp:** 0 đồng, lượt chạy chính thức dưới 3 phút máy, bộ test khoảng 970 dòng mã."),
    L("5)", "**Rủi ro đã được kiểm soát:** nhóm đối chứng tuần tự, lặp 10 vòng, kiểm dữ liệu trong cơ sở dữ liệu, ghim phiên bản."),
    L("6)", "**Phạm vi và việc còn lại rõ ràng:** phần chưa làm (Playwright, báo lỗi cho Cal.com) đã được liệt kê cùng lịch thực hiện.")
  );

  // ===== CHƯƠNG 4 =====
  body.push(H1("CHƯƠNG 4. XÂY DỰNG VÀ THỰC HIỆN KIỂM THỬ"));
  body.push(H2("4.1. Cấu trúc thư mục và tổ chức mã nguồn"));
  body.push(P("Mã nguồn bộ test nằm trong thư mục `race-tests` của kho `kiem_thu_pm`. Mã của Cal.com được tải riêng theo tag `v6.2.0` và không đưa vào kho. [[fig:thu-muc]] mô tả cấu trúc thư mục."));
  body.push(...fig("hinh-cau-truc-thu-muc.png", "Cấu trúc thư mục bộ test", 14.5, "thu-muc"));
  body.push(H2("4.2. Môi trường, triển khai và bằng chứng hệ thống chạy"));
  body.push(...table([
    ["Thành phần", "Máy 1 (macOS)", "Máy 2 (Windows)"],
    ["Máy", "MacBook Apple Silicon, 10 nhân, 32 GB RAM", "MSI, Intel Core i7-13620H 2,40 GHz, 16 GB RAM (15,7 GB dùng được)"],
    ["Hệ điều hành", "macOS", "Windows 11, 64-bit"],
    ["Cal.com", "v6.2.0 (`1c193cca`)", "v6.2.0 (`1c193cca`)"],
    ["Node.js", "22.23.2", "22.18.0"],
    ["k6", "2.3.0", "2.2.0 (windows/amd64)"],
    ["PostgreSQL", "16 (cổng 5432, 300 kết nối)", "Cài đặt riêng"],
    ["Người chạy", "Nhóm", "Ngô Quốc Trường Vĩ"],
  ], [2.2, 4.8, 5], "Cấu hình hai máy thực hiện kiểm thử", { key: "cau-hinh" }));
  body.push(PN("Các bước dựng hệ thống từ máy sạch được ghi trong tệp `README.md` của kho: tải mã Cal.com đúng tag, tạo cơ sở dữ liệu `calendso`, cấu hình biến môi trường (`DATABASE_URL`, `NEXTAUTH_SECRET`, `CALENDSO_ENCRYPTION_KEY`), cài thư viện, chạy `yarn workspace @calcom/prisma db-deploy` và `db-seed`, rồi chạy `yarn dev`. Nhóm gặp và xử lý bốn khó khăn:"));
  body.push(
    L("1)", "Máy macOS không có Docker, nên nhóm dùng Postgres.app và khởi tạo cụm cơ sở dữ liệu riêng."),
    L("2)", "Các cột thời gian của Cal.com là `timestamp without time zone` lưu giờ UTC. Trình điều khiển `pg` mặc định đổi theo múi giờ máy (+07:00) làm các truy vấn kiểm invariant bị lệch 7 giờ. Nhóm ép UTC trong `db.mjs`."),
    L("3)", "API hủy lịch yêu cầu mã CSRF dài 64 ký tự theo kiểu double-submit cookie; bộ test gửi cùng một mã ở cả cookie và nội dung yêu cầu."),
    L("4)", "Ở chế độ phát triển, Cal.com biên dịch route lần đầu được gọi nên yêu cầu đầu tiên rất chậm. Bộ test thêm bước khởi động nóng: đặt rồi hủy một booking thử trước khi chạy.")
  );
  body.push(P("Để chứng minh ba luồng nghiệp vụ chạy được, nhóm viết lệnh `npm run smoke` chạy lần lượt đặt lịch, đổi lịch, hủy lịch rồi đặt lại giờ vừa hủy. Kết quả ở [[tbl:smoke]]: cả bốn bước đều trả HTTP 200 và trạng thái trong cơ sở dữ liệu đúng."));
  body.push(...table([
    ["Luồng", "HTTP", "Thời gian", "Trạng thái trong cơ sở dữ liệu"],
    ["1. Đặt lịch", "200", "104 ms", "accepted"],
    ["2. Đổi lịch", "200", "92 ms", "booking gốc cancelled, booking mới accepted"],
    ["3. Hủy lịch", "200", "65 ms", "cancelled"],
    ["4. Đặt lại giờ vừa hủy", "200", "69 ms", "giờ được giải phóng, đặt được"],
  ], [3.4, 1.4, 2, 5.6], "Kết quả kiểm tra ba luồng nghiệp vụ (`npm run smoke`)", { center: [1, 2], key: "smoke" }));

  body.push(H2("4.3. Xây dựng bộ test"));
  body.push(H3("4.3.1. Dữ liệu test"));
  body.push(P("Tệp `fixtures.sql` tạo lại chủ lịch `k15host` và năm loại cuộc hẹn ở [[tbl:loai]]; có thể chạy nhiều lần mà không để lại dữ liệu cũ. Lệnh `npm run fixtures` nạp tệp này. Cuộc hẹn `k15-confirm` bật cờ giữ chỗ cho booking chờ xác nhận để có một invariant rõ ràng cho TC-05."));
  body.push(H3("4.3.2. Gửi yêu cầu đồng thời bằng k6"));
  body.push(P("Tập yêu cầu của mỗi vòng do `run.mjs` sinh ra rồi truyền cho `race.js`. Mỗi người dùng ảo lấy đúng một yêu cầu theo số thứ tự của mình, chờ tới mốc thời gian `START_AT` chung, gửi rồi ghi kết quả. Độ lệch thời điểm gửi giữa các yêu cầu của một vòng đo được từ 0 đến 1 mili-giây."));
  body.push(...code([
    "// rào chắn thời gian: mọi VU chờ tới cùng một mốc rồi mới gửi",
    "const waitMs = startAt + (req.delayMs || 0) - Date.now();",
    "if (waitMs > 0) sleep(waitMs / 1000);",
    "const res = http.request(req.method, req.url, JSON.stringify(req.body), { headers: req.headers });",
  ]));
  body.push(H3("4.3.3. Kiểm tra invariant và nhóm đối chứng"));
  body.push(P("Sau mỗi vòng, `scenarios.mjs` truy vấn trực tiếp PostgreSQL để kiểm invariant. Ví dụ I1 được kiểm bằng cách ghép bảng `Booking` với chính nó để tìm các cặp booking hiệu lực của cùng một chủ lịch có khoảng giờ giao nhau:"));
  body.push(...code([
    "SELECT a.uid, b.uid FROM \"Booking\" a JOIN \"Booking\" b",
    "  ON a.\"userId\" = b.\"userId\" AND a.id < b.id",
    " AND a.\"startTime\" < b.\"endTime\" AND b.\"startTime\" < a.\"endTime\"",
    "WHERE a.status IN ('accepted','pending') AND b.status IN ('accepted','pending');",
  ]));
  body.push(P("Chế độ `--mode sequential` gửi đúng tập yêu cầu đó lần lượt thay vì đồng thời; kết quả chạy tuần tự là nhóm đối chứng để phân loại lỗi."));
  body.push(H3("4.3.4. Báo cáo và lệnh chạy"));
  body.push(...table([
    ["Lệnh", "Tác dụng"],
    ["`npm run fixtures`", "Tạo lại chủ lịch và loại cuộc hẹn test"],
    ["`npm run smoke`", "Kiểm tra ba luồng nghiệp vụ"],
    ["`npm run race`", "Chạy 8 test case đồng thời, 10 vòng mỗi test case"],
    ["`npm run race -- --mode sequential`", "Chạy đối chứng tuần tự"],
    ["`node src/window.mjs`", "Đo độ rộng cửa sổ race"],
    ["`npm run demo:midterm`", "Demo giữa kỳ: kiểm hệ thống, ba luồng và thử nghiệm race (khoảng 20 giây)"],
    ["`bash repro/repro-curl.sh`", "Tái hiện độc lập D2, D3, D5, D6 bằng `curl`"],
  ], [5.2, 7], "Các lệnh chính của bộ test"));
  body.push(P("Mỗi lần chạy sinh thư mục kết quả gồm `REPORT.md` (bảng tổng hợp và chi tiết từng vòng), `summary.json` và thư mục `raw/` chứa yêu cầu đã gửi, phản hồi từng yêu cầu và tóm tắt của k6. Mã thoát bằng 0 khi mọi test case đạt, 1 khi có test case không đạt, 2 khi bộ test lỗi."));

  body.push(H2("4.4. Thực hiện kiểm thử và kết quả"));
  body.push(H3("4.4.1. Kết quả chạy đồng thời và tuần tự"));
  body.push(P("Lượt chạy chính thức ngày 18/10/2026 trên máy macOS: 8 test case, mỗi test case 10 vòng ở mỗi chế độ. [[tbl:kq-mac]] tổng hợp kết quả; [[fig:ket-qua]] so sánh với máy Windows."));
  body.push(...table([
    ["TC", "Đồng thời (vòng vi phạm)", "Tuần tự (vòng vi phạm)", "Kết luận", "Lỗi"],
    ["TC-01", "0/10", "0/10", "Đúng", "–"],
    ["TC-02", "10/10", "0/10", "Lỗi race", "D1"],
    ["TC-03", "10/10", "0/10", "Lỗi race", "D2"],
    ["TC-04", "0/10", "0/10", "Đúng", "–"],
    ["TC-05", "10/10", "0/10", "Lỗi race", "D3"],
    ["TC-06", "10/10", "10/10", "Lỗi logic", "D4"],
    ["TC-07", "10/10", "0/10", "Lỗi race", "D5"],
    ["TC-08", "10/10", "0/10", "Lỗi race", "D6"],
  ], [1.4, 3.2, 3.2, 2.6, 1.2], "Kết quả chạy chính thức trên máy macOS", { center: [0, 1, 2, 4], key: "kq-mac" }));
  body.push(PN("**Nhận xét:**"));
  body.push(
    L("1)", "TC-01 và TC-04 đạt ở cả hai chế độ: ràng buộc duy nhất ở TC-01 và khóa dòng ở TC-04 hoạt động đúng. Kết quả này cũng cho thấy bộ test không báo lỗi giả."),
    L("2)", "Năm test case TC-02, 03, 05, 07, 08 chỉ không đạt khi chạy đồng thời: đây là lỗi race."),
    L("3)", "TC-06 không đạt ở cả hai chế độ nên là lỗi logic, không phải race."),
    L("4)", "Ở TC-02, mã HTTP của cả 10 yêu cầu đều là 200 nhưng cơ sở dữ liệu có 10 booking chồng giờ, tạo ra 45 cặp chồng nhau trong mỗi vòng. Đây là lý do nhóm kiểm tra dữ liệu thay vì tin mã HTTP.")
  );
  body.push(H3("4.4.2. Chạy lại trên máy Windows"));
  body.push(P("Thành viên Ngô Quốc Trường Vĩ chạy lại toàn bộ trên máy Windows 11 ([[tbl:cau-hinh]]) với cùng phiên bản mã. Kết quả khớp 8/8 với máy macOS: số vòng vi phạm và dữ liệu trong cơ sở dữ liệu ở vòng 1 giống nhau, trừ TC-05, nơi máy macOS nhận 9 booking chờ xác nhận và máy Windows nhận 10; cả hai đều vi phạm 10/10 vòng."));
  body.push(...fig("hinh-ket-qua.png", "Số vòng vi phạm của từng test case trên hai máy, hai chế độ", 15, "ket-qua"));
  body.push(P("Máy Windows chạy chậm hơn: lượt đồng thời mất 210 giây so với 154 giây trên máy macOS, lượt tuần tự 43 giây so với 23 giây. Độ trễ p95 của TC-01 là 9 703 ms trên Windows so với 417 ms trên macOS; nhiều khả năng do Cal.com biên dịch lần đầu ở vòng đầu, nhóm chưa kiểm chứng. [[fig:win-race]] và [[fig:win-seq]] là ảnh chụp Terminal của hai lượt chạy trên máy Windows."));
  body.push(...fig("windows-race.png", "Kết quả chạy đồng thời trên máy Windows", 9, "win-race"));
  body.push(...fig("windows-sequential.png", "Kết quả chạy tuần tự trên máy Windows", 11, "win-seq"));
  body.push(P("Hai lượt chạy đầu trên máy Windows không hợp lệ và đã bị loại: lượt thứ nhất do máy chưa cài k6, lượt thứ hai do Cal.com dừng giữa chừng và test case TC-01 báo không đạt bất thường. Kết quả ở trên là lượt chạy sạch sau khi khắc phục. Từ đó bộ test được bổ sung bước khởi động nóng và thông báo rõ ràng khi Cal.com dừng giữa lúc chạy."));
  body.push(H3("4.4.3. Độ nhạy và cửa sổ race"));
  body.push(P("Để xem lỗi có cần tải lớn hay không, nhóm giảm xuống chỉ 2 yêu cầu đồng thời và chạy 20 vòng. TC-02 (các giờ chồng lấn) vi phạm ở 20/20 vòng và TC-08 (giới hạn mỗi ngày) vi phạm ở 20/20 vòng. Như vậy hai khách đặt gần cùng lúc là đủ gây lỗi."));
  body.push(P("Để đo độ rộng cửa sổ race, nhóm cho hai yêu cầu xung đột, yêu cầu thứ hai gửi trễ Δ mili-giây. [[fig:cua-so]] cho thấy với Δ từ 0 đến 30 ms vòng nào cũng vi phạm; từ 35 đến 50 ms vi phạm một phần; từ 60 ms trở đi không còn. Vậy cửa sổ race khoảng 30 đến 60 ms, xấp xỉ thời gian xử lý một yêu cầu trên máy test. Trên hệ thống thật, thời gian này dài hơn vì có thêm lời gọi tới lịch ngoài, nên cửa sổ có thể rộng hơn."));
  body.push(...fig("hinh-cua-so-race.png", "Tỉ lệ vòng vi phạm theo độ trễ của yêu cầu thứ hai", 14, "cua-so"));
  body.push(H3("4.4.4. Chi phí kiểm thử"));
  body.push(P("Chi phí tiền là 0 đồng, vì toàn bộ công cụ miễn phí hoặc mã nguồn mở và chạy trên máy cá nhân. Chi phí chạy test được đo từ thời điểm bắt đầu và kết thúc ghi trong `summary.json` của từng lần chạy ([[tbl:chi-phi]])."));
  body.push(...table([
    ["Lần chạy", "Vòng", "Request", "Thời gian máy"],
    ["Đồng thời chính (macOS)", "80", "570", "154 giây"],
    ["Tuần tự đối chứng (macOS)", "80", "570", "23 giây"],
    ["Độ nhạy: 2 request, 20 vòng", "100", "200", "164 giây"],
    ["Thí nghiệm khắc phục", "40", "380", "85 giây"],
    ["Đo cửa sổ race (18 mốc độ trễ)", "180", "360", "300 giây"],
    ["**Tổng**", "", "**1 710**", "**khoảng 12 phút**"],
  ], [5.6, 1.6, 2, 2.8], "Chi phí chạy kiểm thử đo được", { center: [1, 2, 3], key: "chi-phi" }));
  body.push(P("Chạy lại bộ test chính (cả đồng thời và tuần tự) tốn dưới 3 phút. Chi phí xây dựng bộ test khoảng 970 dòng mã (Node.js, k6, SQL). Về nhân lực, nhóm chưa theo dõi giờ làm của từng người; [[tbl:nhan-luc]] là ước lượng khối lượng công việc, không phải số giờ đo thực tế."));
  body.push(...table([
    ["Hạng mục", "Người phụ trách", "Ước lượng (giờ)"],
    ["Dựng Cal.com, seed data, chạy 3 luồng nghiệp vụ", "Nguyễn Thanh Tâm", "6 đến 8"],
    ["Đọc mã, vẽ kiến trúc, phân tích nguyên nhân gốc", "Võ Công Vinh", "6 đến 8"],
    ["Thiết kế test case, viết bộ test", "Nguyễn Đức Tín", "10 đến 14"],
    ["Chạy test, ghi kết quả, báo cáo, slide", "Ngô Quốc Trường Vĩ", "12 đến 16"],
    ["**Tổng**", "", "**34 đến 46 (khoảng 9 đến 12 giờ mỗi người)**"],
  ], [6, 3.4, 3], "Ước lượng nhân lực (chưa phải số giờ thực tế)", { center: [2], key: "nhan-luc" }));

  body.push(H2("4.5. Phân tích lỗi"));
  body.push(H3("4.5.1. Danh sách lỗi"));
  body.push(...table([
    ["Lỗi", "Hiện tượng", "Loại", "Mức độ"],
    ["D1", "Chủ lịch bị đặt chồng giờ khi các giờ lệch nhau hoặc khác loại cuộc hẹn", "Race", "Cao"],
    ["D2", "Cuộc hẹn có ghế: còn ghế nhưng người đặt sau bị từ chối với thông báo xung đột", "Race", "Trung bình"],
    ["D3", "Nhiều booking chờ xác nhận cho cùng một giờ", "Race", "Trung bình"],
    ["D4", "Một booking gốc đã đổi lịch vẫn đổi lịch tiếp được, sinh nhiều booking mới", "Logic", "Cao"],
    ["D5", "Hủy và đổi lịch cùng lúc đều báo thành công, vẫn còn booking hiệu lực", "Race", "Trung bình"],
    ["D6", "Vượt giới hạn 1 booking mỗi ngày khi đặt đồng thời", "Race", "Trung bình"],
    ["O1", "Vượt giới hạn booking trả mã 401 (chưa xác thực) thay vì 403", "Mã lỗi", "Thấp"],
    ["O2", "Mã booking `uid` sinh từ tên chủ lịch, giờ và thời điểm hiện tại, có thể trùng nếu hai yêu cầu xử lý cùng một mili-giây", "Thiết kế", "Thấp"],
  ], [1, 8, 1.6, 1.8], "Danh sách lỗi và quan sát phụ", { center: [0, 2, 3] }));
  body.push(H3("4.5.2. Tái hiện độc lập bằng curl"));
  body.push(P("Để chắc rằng lỗi không do bộ test, nhóm tái hiện từng lỗi bằng lệnh `curl` thuần trên Cal.com đang chạy, rồi đối chiếu dữ liệu trong cơ sở dữ liệu ([[tbl:tai-hien]]). Ví dụ với D1, hai khách đặt hai giờ chồng nhau cùng lúc:"));
  body.push(...code([
    "curl -X POST localhost:3000/api/book/event -d '{... khách A, 09:00–09:30 ...}' &",
    "curl -X POST localhost:3000/api/book/event -d '{... khách B, 09:15–09:45 ...}' &",
    "wait",
  ]));
  body.push(P("Cả hai yêu cầu đều trả HTTP 200 và cơ sở dữ liệu có hai booking đã chấp nhận chồng giờ của cùng một chủ lịch (09:00 đến 09:30 và 09:15 đến 09:45). Khi gửi tuần tự hai yêu cầu chồng giờ tương tự, yêu cầu thứ hai bị từ chối với HTTP 409. Hệ thống có kiểm tra chồng giờ, nhưng chỉ đúng khi các yêu cầu đến lần lượt."));
  body.push(...table([
    ["Lỗi", "Tái hiện bằng curl", "Dữ liệu trong CSDL"],
    ["D1", "2 khách đặt 2 giờ chồng nhau cùng lúc: cả hai 200", "2 booking đã chấp nhận chồng giờ"],
    ["D2", "6 người đặt cuộc hẹn 3 ghế: 1 trả 200, 5 trả 409", "Chỉ bán 1 trên 3 ghế"],
    ["D3", "10 người đặt cuộc hẹn cần xác nhận: 8 trả 200", "8 booking chờ xác nhận cùng một giờ"],
    ["D4", "Đổi lịch liên tiếp một booking gốc 3 lần: cả 3 trả 200", "3 booking đã chấp nhận từ cùng một gốc (cả khi gửi tuần tự)"],
    ["D5", "Hủy và đổi lịch cùng lúc: cả hai 200", "Booking 09:00 đã hủy nhưng vẫn còn booking 11:00 hiệu lực"],
    ["D6", "8 người đặt 8 giờ, giới hạn 1 mỗi ngày: cả 8 trả 200", "8 booking hiệu lực trong một ngày"],
  ], [1, 6, 5.4], "Kết quả tái hiện độc lập từng lỗi", { center: [0], key: "tai-hien" }));
  body.push(H3("4.5.3. Nguyên nhân gốc"));
  body.push(
    P("**Nhóm lỗi race D1, D3, D5, D6** có chung nguyên nhân là mẫu kiểm tra rồi mới ghi không có khóa. Trong `RegularBookingService`, các bước đọc lịch trống (`ensureAvailableUsers`), đọc giới hạn số booking và đọc trạng thái booking gốc đều thực hiện trước, rồi `createBooking` mới ghi, giữa hai bước không có giao dịch hay khóa bao trùm."),
    P("Lớp bảo vệ duy nhất trong cơ sở dữ liệu là ràng buộc duy nhất trên `idempotencyKey`. Khóa này tính từ giờ bắt đầu, giờ kết thúc và chủ lịch nên chỉ bắt được hai yêu cầu trùng khít (TC-01). Hai khoảng 09:00–09:30 và 09:15–09:45 cho ra hai khóa khác nhau nên không bị chặn (D1). Thêm vào đó, phần mở rộng chỉ gán khóa cho booking ở trạng thái đã chấp nhận; booking chờ xác nhận có khóa rỗng, và cơ sở dữ liệu cho phép nhiều giá trị rỗng trong cột duy nhất, nên D3 không có lớp bảo vệ nào ở tầng dữ liệu. Với D6, phép đếm số booking trong ngày và lệnh ghi là hai bước tách rời."),
    P("**D2** (cuộc hẹn có ghế): `handleSeats` tìm booking của giờ đó; nếu đã có thì gọi `addSeatToBooking` có khóa dòng (TC-04 đạt). Nếu chưa có, mọi yêu cầu cùng thấy “chưa có booking” và cùng cố tạo mới; yêu cầu đầu thắng, các yêu cầu sau trùng khóa và bị ánh xạ thành lỗi 409 mà không thử lại theo nhánh thêm ghế."),
    P("**D4** là lỗi logic: hàm `getOriginalRescheduledBooking` chỉ từ chối khi booking gốc đã hủy mà chưa được đánh dấu đổi lịch. Trạng thái “đã hủy và đã đánh dấu đổi lịch” vừa dùng cho trường hợp chủ lịch yêu cầu khách đổi giờ (cần cho phép đổi), vừa là trạng thái của booking đã được đổi xong (cần chặn). Hàm không phân biệt hai trường hợp nên booking đã đổi vẫn đổi tiếp được. Câu lệnh cập nhật booking gốc trong giao dịch cũng chỉ theo `id`, không kèm điều kiện trạng thái."),
    P("**O1:** ở `checkBookingLimits.ts` lỗi vượt giới hạn (mã 403) bị bọc lại thành 401. **O2:** mã booking `uid` được sinh từ tên chủ lịch, giờ bắt đầu và thời điểm hiện tại; hai yêu cầu cùng giờ trong cùng một mili-giây sinh cùng `uid` và một yêu cầu bị từ chối ngẫu nhiên. Nhóm đếm được 45 lần lỗi trùng `uid` trong nhật ký máy chủ trong quá trình chạy test.")
  );
  body.push(H3("4.5.4. Thí nghiệm khắc phục"));
  body.push(P("Để kiểm chứng nguyên nhân, nhóm thêm vào cơ sở dữ liệu test một ràng buộc loại trừ không cho hai booking hiệu lực (accepted hoặc pending) của cùng chủ lịch có khoảng giờ giao nhau [3], rồi chạy lại các test case. Kết quả ở [[tbl:khac-phuc]]."));
  body.push(...table([
    ["Test case", "Trước", "Sau khi thêm ràng buộc", "Nhận xét"],
    ["TC-02 (D1)", "10 booking chồng", "1 booking", "9 yêu cầu thua nhận HTTP 500"],
    ["TC-05 (D3)", "7 đến 10 booking chờ", "1 booking chờ", "9 yêu cầu thua nhận HTTP 500"],
    ["TC-08 (D6)", "8 booking mỗi ngày", "8 booking mỗi ngày", "Không đổi, cần khóa theo chủ lịch và ngày"],
  ], [2.4, 3, 3.4, 4], "Kết quả thí nghiệm thêm ràng buộc loại trừ", { key: "khac-phuc" }));
  body.push(P("Dữ liệu trở nên toàn vẹn ở D1 và D3, xác nhận nguyên nhân là thiếu ràng buộc ở cơ sở dữ liệu. Tuy nhiên người thua nhận lỗi 500 thay vì 409, vì mã Cal.com chỉ ánh xạ lỗi vi phạm ràng buộc duy nhất sang 409, chưa xử lý mã lỗi của ràng buộc loại trừ. Vì vậy cần sửa ở cả hai tầng: ràng buộc ở cơ sở dữ liệu và ánh xạ lỗi ở ứng dụng. D6 là bài toán đếm nên cần cơ chế khác như khóa theo chủ lịch và ngày (advisory lock) hoặc giao dịch mức serializable có thử lại. Đây là hướng đề xuất; nhóm chưa sửa mã Cal.com."));

  body.push(H2("4.6. Quản lý dự án, nhiệm vụ và đóng góp của từng thành viên"));
  body.push(P("Nhóm làm việc theo mô hình Scrum rút gọn, họp ngắn đầu và cuối tuần. Mã nguồn bộ test và tài liệu được quản lý trên GitHub (kho `2312741-sudo/kiem_thu_pm`). Công việc được theo dõi trên bảng GitHub Projects “R05-K15 – Kế hoạch” với ba cột Todo, In Progress, Done và 18 thẻ ([[fig:board]]). Các thẻ hiện chưa gán người phụ trách và lịch sử commit chủ yếu thuộc một thành viên; nhóm sẽ bổ sung trước buổi bảo vệ."));
  body.push(...fig("board.png", "Bảng công việc GitHub Projects của nhóm", 14.5, "board"));
  body.push(P("[[tbl:dong-gop]] ghi nhiệm vụ và đóng góp của từng thành viên theo phân vai của nhóm."));
  body.push(...table([
    ["Họ tên", "Vai trò", "Nhiệm vụ đã thực hiện", "Sản phẩm"],
    ["Nguyễn Thanh Tâm\n2312741", "Môi trường và DevOps", "Dựng Cal.com, cơ sở dữ liệu, seed data; ghim phiên bản; chạy test trên máy macOS", "README, tài liệu cài đặt, kết quả chạy chính thức"],
    ["Võ Công Vinh\n2312800", "Phân tích hệ thống", "Đọc mã, vẽ kiến trúc và luồng dữ liệu; phân tích nguyên nhân gốc; đề xuất sửa", "Sơ đồ, `DEFECTS.md`, thí nghiệm khắc phục"],
    ["Nguyễn Đức Tín\n2312774", "Tác giả test", "Thiết kế invariant và test case; viết bộ test (k6, Node.js, SQL)", "`race-tests/`, đặc tả test case"],
    ["Ngô Quốc Trường Vĩ\n2312796", "Chạy test và báo cáo", "Chạy test, ghi kết quả; chạy lại trên máy Windows; viết báo cáo, slide, hướng dẫn", "`windows-race`, báo cáo, slide"],
  ], [2.8, 2.2, 5, 3.4], "Nhiệm vụ và đóng góp của từng thành viên", { key: "dong-gop", size: 22 }));

  body.push(H2("4.7. Khả năng tái lập"));
  body.push(P("Để người khác chạy lại được trên máy mới, nhóm ghim và lưu các thông tin sau:"));
  body.push(...table([
    ["Hạng mục", "Cách cố định"],
    ["Phiên bản Cal.com", "Tag `v6.2.0`, commit `1c193cca8682b33b9866c792186033f7ef886682`"],
    ["Môi trường", "Node.js 22, Yarn 4.12.0 (khai báo `packageManager`), PostgreSQL 16, k6 2.x"],
    ["Phụ thuộc của bộ test", "`race-tests/package.json` và `package-lock.json` (thư viện `pg` 8.x)"],
    ["Dữ liệu test", "`fixtures.sql` tạo lại từ đầu; mỗi lần chạy xóa booking của chủ lịch test; mỗi vòng dùng ngày riêng"],
    ["Cấu hình test", "Tham số dòng lệnh `--scenarios --rounds --n --stagger --mode --out`, ghi lại trong `summary.json`"],
    ["Kết quả", "`summary.json`, `REPORT.md`, yêu cầu đã gửi và log k6 thô của từng vòng"],
  ], [3.4, 8.6], "Các thông tin dùng để chạy lại"));
  body.push(P("Chạy lại trên máy mới gồm các bước: dựng Cal.com theo `README.md` (khoảng 15 phút, phần lớn là `yarn install`); cài k6; chạy `npm install`, `npm run fixtures`, `npm run race` và `npm run race -- --mode sequential` trong thư mục `race-tests`; so sánh kết quả với [[tbl:kq-mac]]. Hướng dẫn riêng cho máy Windows nằm ở `docs/HUONG_DAN_CHAY_LAI_WINDOWS.md`. Vì race mang tính xác suất, tỉ lệ có thể lệch đôi chút giữa các máy; với các lỗi đã báo cáo, cửa sổ race (30 đến 60 ms) rộng hơn nhiều so với độ lệch thời điểm gửi (nhỏ hơn 1 ms) nên kết luận ổn định."));

  // ===== KẾT LUẬN =====
  body.push(H1("KẾT LUẬN"));
  body.push(H2("1. Kết quả đạt được"));
  body.push(
    P("Nhóm đã dựng thành công Cal.com v6.2.0 trên hai máy (macOS và Windows 11), chạy được ba luồng nghiệp vụ đặt lịch, đổi lịch, hủy lịch và lập tài liệu cài đặt từ máy sạch. Nhóm đã phân tích kiến trúc và luồng xử lý của nghiệp vụ trọng tâm, xác định bảy tính chất dữ liệu bất biến và thiết kế 8 test case với đặc tả đầy đủ tiền điều kiện, dữ liệu, kết quả mong đợi."),
    P("Bộ test tự động gồm khoảng 970 dòng mã, gửi yêu cầu đồng thời bằng k6, kiểm tra trực tiếp cơ sở dữ liệu và có nhóm đối chứng gửi tuần tự. Kết quả lượt chạy chính thức: 6 trên 8 test case phát hiện lỗi, gồm 5 lỗi race (D1, D2, D3, D5, D6) và 1 lỗi logic (D4), cùng hai quan sát phụ. Cả 6 lỗi đều được tái hiện độc lập bằng `curl` thuần với dữ liệu sai nhìn thấy được trong cơ sở dữ liệu, và kết quả trên máy Windows khớp 8/8 với máy macOS."),
    P("Nhóm cũng xác định được nguyên nhân gốc: mẫu kiểm tra rồi mới ghi không có khóa, ràng buộc chống trùng quá hẹp và một trạng thái mang hai nghĩa. Thí nghiệm thêm ràng buộc loại trừ trên dữ liệu test chứng minh nguyên nhân cho D1 và D3, đồng thời chỉ ra hệ thống còn thiếu xử lý mã lỗi tương ứng."),
    P("Với các bằng chứng trên, nhóm đề nghị được duyệt kế hoạch kiểm thử đã trình bày ở mục 3.4: hệ thống chạy được, kỹ thuật phát hiện được lỗi thật, kết quả không phụ thuộc máy, chi phí thấp và phần việc còn lại đã rõ ràng.")
  );
  body.push(H2("2. Hạn chế và hướng phát triển"));
  body.push(
    P("Đề tài còn một số hạn chế. Thứ nhất, nhóm chưa báo các lỗi tìm được cho nhóm phát triển Cal.com, chưa kiểm tra trên phiên bản mới hơn và chưa sửa mã Cal.com, nên chưa thể khẳng định phía Cal.com xếp tất cả là lỗi (ví dụ D2 có thể được xem là hành vi chấp nhận được). Thứ hai, bộ test chạy ở chế độ phát triển (`yarn dev`) trên một bản Cal.com và một cơ sở dữ liệu cục bộ, chưa thử trên bản dựng chính thức hay nhiều máy chủ sau bộ cân bằng tải. Thứ ba, nhóm chưa kiểm thử qua giao diện bằng Playwright, chưa kiểm thử API phiên bản 2, luồng nhóm và điểm giữ chỗ tạm. Thứ tư, nhân lực chỉ là ước lượng vì nhóm chưa theo dõi giờ làm."),
    P("Hướng phát triển gồm: bổ sung kịch bản Playwright chạy song song qua giao diện để minh họa lỗi D1 trên giao diện thật; rà soát và đề xuất bản sửa cho D1 và D4 (ràng buộc loại trừ, ánh xạ lỗi, kiểm tra lại trạng thái trong giao dịch khi đổi và hủy lịch, khóa theo chủ lịch cho giới hạn số booking); báo lỗi cho nhóm phát triển Cal.com kèm bộ tái hiện; và đưa bộ test vào quy trình tích hợp liên tục nhờ mã thoát của lệnh chạy.")
  );

  // ===== TÀI LIỆU THAM KHẢO =====
  body.push(H1("TÀI LIỆU THAM KHẢO"));
  for (const r of [
    "[1] Cal.com. (n.d.). cal.com [Mã nguồn]. GitHub. https://github.com/calcom/cal.com",
    "[2] Grafana Labs. (n.d.). Grafana k6 documentation. https://grafana.com/docs/k6/latest/",
    "[3] The PostgreSQL Global Development Group. (n.d.). PostgreSQL 16 Documentation: Constraints. https://www.postgresql.org/docs/16/ddl-constraints.html",
    "[4] The PostgreSQL Global Development Group. (n.d.). PostgreSQL 16 Documentation: Explicit Locking. https://www.postgresql.org/docs/16/explicit-locking.html",
    "[5] Prisma. (n.d.). Transactions and batch queries. https://www.prisma.io/docs/orm/prisma-client/queries/transactions",
    "[6] MITRE. (n.d.). CWE-367: Time-of-check Time-of-use (TOCTOU) Race Condition. https://cwe.mitre.org/data/definitions/367.html",
    "[7] Nguyễn Thế Lâm. (2026). Hướng dẫn thực hiện đề tài môn Kiểm thử phần mềm [Tài liệu môn học]. Trường Đại học Đà Lạt.",
  ]) body.push(new Paragraph({ indent: { left: 540, hanging: 540 }, children: runs(r) }));

  // ===== PHỤ LỤC =====
  body.push(H1("PHỤ LỤC"));
  body.push(new Paragraph({ keepNext: true, children: runs("**Phân công công việc**") }));
  body.push(...table([
    ["Họ tên", "Công việc"],
    ["Nguyễn Thanh Tâm", "- Dựng Cal.com, cơ sở dữ liệu, seed data, tài liệu cài đặt\n- Ghim phiên bản, môi trường chạy test trên máy macOS"],
    ["Võ Công Vinh", "- Đọc mã, vẽ kiến trúc và luồng dữ liệu\n- Phân tích nguyên nhân gốc, đề xuất sửa lỗi"],
    ["Nguyễn Đức Tín", "- Thiết kế invariant và test case\n- Viết bộ test (k6, Node.js, SQL)"],
    ["Ngô Quốc Trường Vĩ", "- Chạy test, ghi kết quả, chạy lại trên máy Windows\n- Viết báo cáo, slide, tài liệu hướng dẫn"],
  ], [3, 9], "Bảng phân công công việc"));
  body.push(new Paragraph({ keepNext: true, children: runs("**Tài liệu và bằng chứng đi kèm** (trong kho https://github.com/2312741-sudo/kiem_thu_pm)") }));
  body.push(...table([
    ["Nội dung", "Đường dẫn"],
    ["Hướng dẫn cài đặt và chạy lại", "`README.md`, `docs/HUONG_DAN_CHAY_LAI_WINDOWS.md`"],
    ["Quy trình test đầy đủ", "`docs/QUY_TRINH_TEST.md`"],
    ["Hướng dẫn người test, phiếu ghi kết quả", "`docs/HUONG_DAN_NGUOI_TEST.md`"],
    ["Kết quả test giữa kỳ (sinh tự động)", "`docs/KET_QUA_TEST_GIUA_KY.md`"],
    ["Mô tả chi tiết từng lỗi", "`docs/DEFECTS.md`, `docs/MINH_CHUNG_LOI.md`"],
    ["Kết quả thô lượt chạy chính thức", "`race-tests/results/giua-ky-race/`, `giua-ky-sequential/`"],
    ["Kết quả máy Windows", "`race-tests/results/windows-race/`, `windows-sequential/`"],
    ["Tái hiện độc lập bằng curl", "`race-tests/repro/repro-curl.sh`, `docs/evidence/repro-curl.txt`"],
    ["Bảng công việc", "https://github.com/users/2312741-sudo/projects/1"],
  ], [4.2, 7.8], "Tài liệu và bằng chứng đi kèm"));

  return body;
}

// Lượt 1 điền số hình/bảng; lượt 2 dựng lại với các tham chiếu đã biết.
buildBody();
COUNT = { Hình: 0, Bảng: 0 };
const body = buildBody();

// ---------- tập hợp tài liệu ----------
const pageProps = (extra = {}) => ({ page: { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1134, left: 1985, right: 1134, header: 700, footer: 500 }, ...extra } });
const doc = new Document({
  creator: "Nhóm 14 – R05-K15",
  title: "Báo cáo giữa kỳ R05-K15 – Kiểm thử race condition cho Cal.com",
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: 26 }, paragraph: { spacing: { line: 360, after: 120 } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 32, bold: true, color: "000000" }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 300, line: 360 }, outlineLevel: 0, keepNext: true } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 26, bold: true, color: "000000" }, paragraph: { spacing: { before: 240, after: 120, line: 360 }, outlineLevel: 1, keepNext: true } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 26, bold: true, italics: true, color: "000000" }, paragraph: { spacing: { before: 200, after: 100, line: 360 }, outlineLevel: 2, keepNext: true } },
      { id: "Caption", name: "caption", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 24, italics: true }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 60, after: 200, line: 276 } } },
    ],
  },
  sections: [
    { properties: pageProps(), children: cover },
    {
      properties: pageProps(),
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 26 })] })] }) },
      children: [...comments, new Paragraph({ children: [new PageBreak()] }), ...thanks, ...body],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(root, "docs", "BAO_CAO_GIUA_KY_THEO_MAU.docx");
  fs.writeFileSync(out, buf);
  console.log("wrote", out, buf.length);
});
