// Sinh docs/THUYET_TRINH_R05-K15.pptx (15 slide, 16:9).
// Chạy: NODE_PATH=<nơi cài pptxgenjs> node tools/build-pptx.cjs
const path = require("path");
const pptxgen = require("pptxgenjs");

const OUT = path.resolve(__dirname, "..", "docs", "THUYET_TRINH_R05-K15.pptx");

const INK = "12202B", INK2 = "1D3142", PAPER = "F4F2EC", CARD = "FBFAF6", LINE = "DAD6CC";
const ORANGE = "E07B39", RUST = "B4531A", BLUE = "2558B8", SKY = "7FB0FF";
const MUTED = "4A5866", MUTED_DARK = "B8C6D2", FOOT = "7A8592";
const BODY = "Calibri", HEAD = "Calibri", MONO = "Consolas";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.title = "R05-K15 – Kiểm thử Race Condition cho Cal.com";
pres.author = "Nhóm R05-K15";
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

const M = 0.7; // lề
const W = 13.33 - 2 * M;

pres.defineSlideMaster({
  title: "LIGHT",
  background: { color: PAPER },
  slideNumber: { x: 12.2, y: 6.95, w: 0.5, h: 0.3, fontFace: BODY, fontSize: 12, color: FOOT, align: "right" },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: M, y: 0.7, w: W, h: 0.95, fontFace: HEAD, fontSize: 34, bold: true, color: INK, valign: "top", margin: 0 }, text: "" } }],
});
pres.defineSlideMaster({
  title: "DARK",
  background: { color: INK },
  slideNumber: { x: 12.2, y: 6.95, w: 0.5, h: 0.3, fontFace: BODY, fontSize: 12, color: "8C9AA8", align: "right" },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: M, y: 0.7, w: W, h: 0.95, fontFace: HEAD, fontSize: 34, bold: true, color: "F4F2EC", valign: "top", margin: 0 }, text: "" } }],
});
pres.defineSlideMaster({ title: "DARK_BLANK", background: { color: INK } });
pres.defineSlideMaster({ title: "ORANGE_BLANK", background: { color: ORANGE } });

function eyebrow(slide, text, dark) {
  slide.addText(text, { x: M, y: 0.32, w: W, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: dark ? ORANGE : RUST, charSpacing: 2, margin: 0, isTextBox: true, objectName: "Eyebrow" });
}
function footer(slide, text, dark) {
  slide.addText(text, { x: M, y: 6.95, w: 11.3, h: 0.3, fontFace: BODY, fontSize: 12, color: dark ? "8C9AA8" : FOOT, margin: 0, isTextBox: true, objectName: "Footer note" });
}
function card(slide, x, y, w, h, { dark = false, name = "Card" } = {}) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: dark ? INK : CARD }, line: { color: dark ? INK : LINE, width: 1 }, objectName: name });
}
function tbl(slide, rows, { x = M, y, w = W, colW, fontSize = 14, rowH = 0.45, fills = {}, header = true, color = INK, headFill = "E6E2D6" }) {
  const data = rows.map((r, ri) =>
    r.map((c) => {
      const isHead = header && ri === 0;
      const o = typeof c === "object" ? c : { text: c };
      return {
        text: o.text,
        options: {
          bold: isHead || o.bold,
          color: o.color || color,
          fill: { color: isHead ? headFill : fills[ri] || "FFFFFF" },
          fontFace: o.mono ? MONO : BODY,
          fontSize,
          valign: "middle",
          border: [{ type: "solid", pt: 0.75, color: LINE }, { type: "solid", pt: 0.75, color: LINE }, { type: "solid", pt: 0.75, color: LINE }, { type: "solid", pt: 0.75, color: LINE }],
          margin: [0.04, 0.1, 0.04, 0.1],
        },
      };
    })
  );
  slide.addTable(data, { x, y, w, colW, rowH, autoPage: false, objectName: "Table" });
}

let section = "";
function newSlide(master, sec) {
  if (sec && sec !== section) {
    pres.addSection({ title: sec });
    section = sec;
  }
  return pres.addSlide({ masterName: master, sectionTitle: section });
}

// 1 · Bìa
{
  const s = newSlide("DARK_BLANK", "Đề tài và hệ thống");
  s.addText("R05 · CAL.COM  ×  K15 · CONCURRENCY / RACE", { x: M, y: 0.7, w: W, h: 0.4, fontFace: MONO, fontSize: 16, bold: true, color: ORANGE, charSpacing: 3, margin: 0, isTextBox: true });
  s.addText('Hai người cùng bấm "Đặt lịch".\nAi thắng?', { x: M, y: 1.9, w: 11.5, h: 2.4, fontFace: HEAD, fontSize: 54, bold: true, color: "F4F2EC", margin: 0, valign: "top", isTextBox: true });
  s.addText("Kiểm thử race condition cho hệ thống đặt lịch mã nguồn mở Cal.com v6.2.0", { x: M, y: 4.5, w: 10.5, h: 0.9, fontFace: BODY, fontSize: 24, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  s.addText("Môn Kiểm thử phần mềm · GV Nguyễn Thế Lâm\nKhoa CNTT – Trường Đại học Đà Lạt", { x: M, y: 6.1, w: 7, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED_DARK, margin: 0, isTextBox: true });
  s.addText("Nhóm: [Tên thành viên 1 – 4]", { x: 8.2, y: 6.1, w: 4.4, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED_DARK, align: "right", margin: 0, isTextBox: true });
  s.addNotes("Giới thiệu nhóm và đề tài: hệ thống R05 là Cal.com, kỹ thuật K15 là kiểm thử concurrency/race. Câu hỏi mở đầu: khi hai người cùng đặt một khung giờ, hệ thống có đảm bảo chỉ một người thắng không?");
}

// 2 · Đề tài
{
  const s = newSlide("LIGHT");
  eyebrow(s, "01 · ĐỀ TÀI");
  s.addText("Một hệ thống thật, một kỹ thuật, một phạm vi hẹp", { placeholder: "title" });
  const cols = [
    ["R05 · HỆ THỐNG", "Cal.com v6.2.0", "Nền tảng đặt lịch mã nguồn mở. TypeScript, Next.js 16, PostgreSQL + Prisma. Monorepo khoảng 7 950 file TS."],
    ["K15 · KỸ THUẬT", "Concurrency / Race", "Bắn nhiều request cùng một mili-giây bằng k6, rồi kiểm tra tính nhất quán trực tiếp trong CSDL."],
    ["PHẠM VI", "Luồng booking", "Đặt lịch 1-1, event có ghế, event cần xác nhận, đổi lịch, hủy lịch, giới hạn số booking mỗi ngày."],
  ];
  const cw = (W - 2 * 0.35) / 3;
  cols.forEach(([tag, head, body], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 1.95, cw, 3.4);
    s.addText(tag, { x: x + 0.3, y: 2.15, w: cw - 0.6, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: BLUE, margin: 0, isTextBox: true });
    s.addText(head, { x: x + 0.3, y: 2.6, w: cw - 0.6, h: 0.6, fontFace: HEAD, fontSize: 24, bold: true, color: INK, margin: 0, isTextBox: true });
    s.addText(body, { x: x + 0.3, y: 3.35, w: cw - 0.6, h: 1.8, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  s.addText("Ngoài phạm vi: đồng bộ Google/Outlook, thanh toán, team round-robin, API v2, hiệu năng quy mô lớn.", { x: M, y: 5.75, w: W, h: 0.5, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Cal.com được đề bài gợi ý là đặc biệt phù hợp với kiểm thử stateful và concurrency. Nhóm khoanh phạm vi vào luồng booking vì đó là nơi nhiều khách lạ cùng tranh một tài nguyên chung: lịch của host. Endpoint đặt lịch là công khai, không cần đăng nhập.");
}

// 3 · Kiến trúc
{
  const s = newSlide("LIGHT", "Kiến trúc và giả thuyết");
  eyebrow(s, "02 · KIẾN TRÚC");
  s.addText("Một request đặt lịch đi qua 5 module", { placeholder: "title" });
  const boxes = [
    ["apps/web", "POST /api/book/event\nPOST /api/cancel", true],
    ["RegularBookingService", "Điều phối: kiểm tra giới hạn, lịch trống, booking gốc", false],
    ["createBooking / handleSeats", "Ghi Booking, Attendee, BookingSeat", false],
    ["PostgreSQL", "UNIQUE(uid)\nUNIQUE(idempotencyKey)", true],
  ];
  const bw = 2.55, gap = (W - 4 * bw) / 3;
  boxes.forEach(([h, b, dark], i) => {
    const x = M + i * (bw + gap);
    card(s, x, 1.85, bw, 1.75, { dark });
    s.addText(h, { x: x + 0.15, y: 1.95, w: bw - 0.3, h: 0.5, fontFace: MONO, fontSize: 13, bold: true, color: dark ? ORANGE : BLUE, margin: 0, isTextBox: true, valign: "top" });
    s.addText(b, { x: x + 0.15, y: 2.5, w: bw - 0.3, h: 1.0, fontFace: BODY, fontSize: 14, color: dark ? "F4F2EC" : MUTED, margin: 0, isTextBox: true, valign: "top" });
    if (i < 3) s.addShape(pres.ShapeType.line, { x: x + bw + 0.04, y: 2.72, w: gap - 0.08, h: 0, line: { color: FOOT, width: 2, endArrowType: "triangle" } });
  });
  tbl(s, [
    ["Module", "Điều cần chú ý khi kiểm thử race"],
    ["checkBookingLimits · ensureAvailableUsers", "Chỉ ĐỌC rồi quyết định, không giữ khóa nào"],
    ["booking-idempotency-key (Prisma extension)", "Key = f(start, end, host), chỉ gán khi ACCEPTED"],
    ["handleSeats → addSeatToBooking", "Có SELECT … FOR UPDATE khi slot đã có booking"],
    ["getOriginalRescheduledBooking", "Kiểm trạng thái booking gốc ở đầu luồng đổi lịch"],
  ], { y: 3.95, colW: [5.2, W - 5.2], fontSize: 14, rowH: 0.5 });
  footer(s, "Sơ đồ container đầy đủ: docs/diagrams/kien-truc.md");
  s.addNotes("Luồng đặt lịch: route Next.js gọi RegularBookingService. Service đọc giới hạn số booking và lịch trống, sau đó mới gọi createBooking hoặc handleSeats để ghi. Lớp bảo vệ ở CSDL chỉ có hai ràng buộc UNIQUE: uid và idempotencyKey.");
}

// 4 · TOCTOU
{
  const s = newSlide("DARK");
  eyebrow(s, "03 · GIẢ THUYẾT", true);
  s.addText("Kiểm tra rồi mới ghi: khe hở TOCTOU", { placeholder: "title" });
  const colX = [M + 1.7, M + 1.7 + 5.2];
  const colW = 4.9;
  s.addText("Request A · 09:00–09:30", { x: colX[0], y: 1.8, w: colW, h: 0.4, fontFace: MONO, fontSize: 15, bold: true, color: ORANGE, margin: 0, isTextBox: true });
  s.addText("Request B · 09:15–09:45", { x: colX[1], y: 1.8, w: colW, h: 0.4, fontFace: MONO, fontSize: 15, bold: true, color: SKY, margin: 0, isTextBox: true });
  const rowsT = [
    ["t = 0 ms", "Đọc lịch host → trống", "Đọc lịch host → trống", false],
    ["t ≈ 50 ms", "INSERT, key = f(09:00, 09:30)", "INSERT, key = f(09:15, 09:45)", false],
    ["kết quả", "200 OK", "200 OK → host bị đặt chồng", true],
  ];
  rowsT.forEach(([lab, a, b, hot], i) => {
    const y = 2.4 + i * 1.0;
    s.addText(lab, { x: M, y, w: 1.5, h: 0.75, fontFace: BODY, fontSize: 16, color: MUTED_DARK, margin: 0, valign: "middle", isTextBox: true });
    [a, b].forEach((t, j) => {
      s.addShape(pres.ShapeType.roundRect, { x: colX[j], y, w: colW, h: 0.75, rectRadius: 0.1, fill: { color: hot ? ORANGE : INK2 }, line: { color: hot ? ORANGE : INK2, width: 0 } });
      s.addText(t, { x: colX[j] + 0.2, y, w: colW - 0.4, h: 0.75, fontFace: BODY, fontSize: 16, bold: hot, color: hot ? INK : "F4F2EC", margin: 0, valign: "middle", isTextBox: true });
    });
  });
  s.addText([{ text: "Hai key khác nhau nên UNIQUE không chặn. Khóa idempotency chỉ bảo vệ trường hợp " }, { text: "trùng khít", options: { bold: true, color: "F4F2EC" } }, { text: " start, end và host." }], { x: M, y: 5.6, w: W, h: 0.8, fontFace: BODY, fontSize: 18, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  footer(s, "RegularBookingService.ts: ensureAvailableUsers (~dòng 1029) → createBooking (~dòng 1939)", true);
  s.addNotes("Đây là giả thuyết nhóm rút ra khi đọc code, trước khi viết test: giữa bước đọc lịch trống và bước INSERT không có transaction hay khóa nào. Lớp chặn duy nhất là idempotencyKey, tính từ start, end và userId. Hai slot chồng nhau nhưng không trùng khít sẽ lọt qua.");
}

// 5 · Môi trường
{
  const s = newSlide("LIGHT", "Môi trường, phương pháp, harness");
  eyebrow(s, "04 · MÔI TRƯỜNG");
  s.addText("Cố định phiên bản, chạy được 3 luồng nghiệp vụ", { placeholder: "title" });
  const half = (W - 0.5) / 2;
  tbl(s, [
    ["Thành phần", "Phiên bản"],
    ["Cal.com", "v6.2.0 · 1c193cca"],
    ["Node / Yarn", "22.23 / 4.12.0"],
    ["PostgreSQL", "16 (300 kết nối)"],
    ["k6", "2.3.0"],
    ["Dữ liệu test", "host k15host, 5 event type"],
  ], { y: 1.95, w: half, colW: [2.2, half - 2.2], fontSize: 15, rowH: 0.5 });
  tbl(s, [
    ["Smoke test", "HTTP", "Trong DB"],
    ["1. Đặt lịch", "200", "accepted"],
    ["2. Đổi lịch", "200", "bản cũ cancelled"],
    ["3. Hủy lịch", "200", "cancelled"],
    ["4. Đặt lại slot", "200", "đã giải phóng"],
  ], { x: M + half + 0.5, y: 1.95, w: half, colW: [2.4, 1.0, half - 3.4], fontSize: 15, rowH: 0.5 });
  s.addText([{ text: "Không có Docker: dùng Postgres.app với cluster riêng. Hai bẫy đã gỡ: cột " }, { text: "timestamp", options: { bold: true } }, { text: " lưu UTC (driver tự lệch +7 giờ) và CSRF 64 ký tự của " }, { text: "/api/cancel", options: { bold: true } }, { text: "." }], { x: M, y: 5.3, w: W, h: 0.9, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Hướng dẫn từ máy sạch: README.md · bằng chứng: docs/evidence/smoke-test.txt");
  s.addNotes("Hệ thống được khóa ở tag v6.2.0 để test không vỡ khi nhánh main thay đổi. Smoke test chạy ba luồng bắt buộc của đề: đặt, đổi, hủy lịch; mọi luồng trả 200 và trạng thái trong DB đúng. Ở lần chạy thử, các truy vấn kiểm tra bị lệch 7 giờ do driver pg dùng múi giờ máy; nhóm đã ép UTC.");
}

// 6 · Phương pháp
{
  const s = newSlide("LIGHT");
  eyebrow(s, "05 · PHƯƠNG PHÁP");
  s.addText("Ba nguyên tắc của kiểm thử race", { placeholder: "title" });
  const items = [
    ["1", "Oracle là invariant trên CSDL", 'Không tin mã HTTP. Sau mỗi vòng, truy vấn SQL kiểm "host không có 2 booking chồng giờ".'],
    ["2", "Đồng thời thật sự", "Mỗi VU của k6 chờ cùng mốc START_AT rồi mới gửi. Độ lệch đo được: 0–1 ms."],
    ["3", "Có nhóm đối chứng", "Gửi đúng tập request đó nhưng tuần tự. Chỉ gọi là lỗi race khi tuần tự PASS mà đồng thời FAIL."],
  ];
  const cw = (W - 2 * 0.35) / 3;
  items.forEach(([n, h, b], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 1.95, cw, 3.7);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: 2.2, w: 0.7, h: 0.7, fill: { color: BLUE }, line: { color: BLUE, width: 0 } });
    s.addText(n, { x: x + 0.3, y: 2.2, w: 0.7, h: 0.7, fontFace: HEAD, fontSize: 22, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: x + 0.3, y: 3.1, w: cw - 0.6, h: 0.9, fontFace: HEAD, fontSize: 20, bold: true, color: INK, margin: 0, valign: "top", isTextBox: true });
    s.addText(b, { x: x + 0.3, y: 4.0, w: cw - 0.6, h: 1.5, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  s.addText([{ text: "Mỗi scenario chạy 10 vòng; báo " }, { text: "tỉ lệ vòng vi phạm", options: { bold: true, color: INK } }, { text: ", vì race mang tính xác suất." }], { x: M, y: 5.95, w: W, h: 0.5, fontFace: BODY, fontSize: 18, color: MUTED, margin: 0, isTextBox: true });
  footer(s, "Tiêu chí: 1 vòng vi phạm là scenario FAIL");
  s.addNotes("Ba nguyên tắc này phân biệt kiểm thử race với kiểm thử chức năng. Thứ nhất, API có thể trả 200 cho mọi request mà dữ liệu vẫn sai, nên oracle phải là invariant trên DB. Thứ hai, request phải cùng rơi vào cửa sổ race, nên dùng rào chắn thời gian. Thứ ba, nhóm đối chứng tuần tự giúp tách lỗi race khỏi lỗi logic; nhờ nó mà nhóm phân loại đúng lỗi D4.");
}

// 7 · Scenario
{
  const s = newSlide("LIGHT");
  eyebrow(s, "06 · TEST MODEL");
  s.addText("8 scenario, mỗi cái thử một cơ chế bảo vệ", { placeholder: "title" });
  tbl(s, [
    ["ID", "Xung đột (gửi đồng thời)", "Cơ chế được thử", "Invariant"],
    ["S1", "10 người, cùng một slot 09:00", "UNIQUE idempotencyKey", "I1 không chồng giờ"],
    ["S2", "10 slot lệch 3 phút, 30 và 60 phút", "Không có ràng buộc", "I1"],
    ["S3", "6 người, event 3 ghế, slot trống", "Nhánh tạo booking mới", "I2 ghế, I2b"],
    ["S4", "6 người tranh 2 ghế còn lại", "SELECT … FOR UPDATE", "I2, I2b"],
    ["S5", "10 người, event cần xác nhận", "PENDING không có key", "I3"],
    ["S6", "5 lệnh đổi lịch cùng một booking", "Kiểm trạng thái gốc", "I4"],
    ["S7", "Hủy và đổi lịch cùng lúc", "Kiểm trạng thái gốc", "I5"],
    ["S8", "8 giờ khác nhau, giới hạn 1/ngày", "Đếm rồi mới ghi", "I6"],
  ], { y: 1.8, colW: [0.8, 5.0, 3.4, W - 9.2], fontSize: 14, rowH: 0.46 });
  s.addText("Mọi scenario còn kiểm thêm I7: không có 5xx, timeout hay lỗi kết nối.", { x: M, y: 6.1, w: W, h: 0.4, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, isTextBox: true });
  footer(s, "Input, tiền điều kiện, kết quả mong đợi: BAO_CAO.md phần E");
  s.addNotes("Các scenario được chọn theo loại cơ chế bảo vệ. S1 và S4 là nhóm đã có bảo vệ, để kiểm chứng harness không báo lỗi giả. Sáu scenario còn lại thử những chỗ đọc code cho thấy chưa có bảo vệ ở tầng CSDL.");
}

// 8 · Harness
{
  const s = newSlide("LIGHT");
  eyebrow(s, "07 · HARNESS");
  s.addText("Mỗi vòng là một vòng lặp bốn bước", { placeholder: "title" });
  const steps = [
    ["1 · prepare()", "Tạo tiền điều kiện (booking gốc, ghế đầu) và sinh N request", false],
    ["2 · k6/race.js", "N VU, mỗi VU 1 request, cùng gửi tại START_AT", true],
    ["3 · verify()", "SQL trực tiếp trên PostgreSQL kiểm từng invariant", false],
    ["4 · report", "summary.json, REPORT.md, log k6 thô của từng vòng", false],
  ];
  const bw = 2.6, gap = (W - 4 * bw) / 3;
  steps.forEach(([h, b, dark], i) => {
    const x = M + i * (bw + gap);
    card(s, x, 1.9, bw, 2.1, { dark });
    s.addText(h, { x: x + 0.2, y: 2.05, w: bw - 0.4, h: 0.5, fontFace: MONO, fontSize: 15, bold: true, color: dark ? ORANGE : BLUE, margin: 0, isTextBox: true });
    s.addText(b, { x: x + 0.2, y: 2.6, w: bw - 0.4, h: 1.3, fontFace: BODY, fontSize: 15, color: dark ? "F4F2EC" : MUTED, margin: 0, valign: "top", isTextBox: true });
    if (i < 3) s.addShape(pres.ShapeType.line, { x: x + bw + 0.04, y: 2.95, w: gap - 0.08, h: 0, line: { color: FOOT, width: 2, endArrowType: "triangle" } });
  });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 4.4, w: W, h: 1.7, rectRadius: 0.12, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("npm run fixtures && npm run race\nnpm run race -- --mode sequential --rounds 10\nnode src/window.mjs --scenario S2 --deltas 0,30,60", { x: M + 0.35, y: 4.5, w: W - 0.7, h: 1.5, fontFace: MONO, fontSize: 15, color: "F4F2EC", margin: 0, valign: "middle", isTextBox: true });
  footer(s, "race-tests/ · Node.js + k6 · mã thoát 0 = PASS, 1 = có FAIL → gắn được vào CI");
  s.addNotes("Harness viết bằng Node.js cho phần điều phối và kiểm DB, k6 cho phần bắn tải. Mỗi vòng dùng một ngày riêng trong tương lai nên các vòng độc lập nhau. Ngoài chế độ race còn có chế độ tuần tự và công cụ đo cửa sổ race.");
}

// 9 · Kết quả
{
  const s = newSlide("LIGHT", "Kết quả và lỗi");
  eyebrow(s, "08 · KẾT QUẢ");
  s.addText("Tuần tự thì đúng, đồng thời thì vỡ", { placeholder: "title" });
  const race = "F6E2D3", logic = "DCE5F4";
  tbl(s, [
    ["Scenario", "Đồng thời", "Tuần tự", "Trong CSDL sau mỗi vòng"],
    ["S1 cùng slot", "0/10", "0/10", "1 booking: PASS"],
    ["S2 slot chồng lấn", { text: "10/10", bold: true }, "0/10", "10 booking chồng nhau"],
    ["S3 ghế đầu tiên", { text: "10/10", bold: true }, "0/10", "chỉ bán 1–2 / 3 ghế"],
    ["S4 ghế còn lại", "0/10", "0/10", "đúng 3 ghế: PASS"],
    ["S5 PENDING trùng", { text: "10/10", bold: true }, "0/10", "7–10 PENDING / slot"],
    ["S6 đổi lịch lặp", { text: "10/10", bold: true }, { text: "10/10", bold: true }, "5 booking mới từ 1 gốc"],
    ["S7 hủy và đổi", { text: "10/10", bold: true }, "0/10", "đã hủy vẫn còn booking"],
    ["S8 giới hạn 1/ngày", { text: "10/10", bold: true }, "0/10", "8 booking / ngày"],
  ], { y: 1.75, colW: [3.4, 2.0, 2.0, W - 7.4], fontSize: 14, rowH: 0.46, fills: { 2: race, 3: race, 5: race, 6: logic, 7: race, 8: race } });
  s.addShape(pres.ShapeType.rect, { x: M, y: 6.1, w: 0.22, h: 0.22, fill: { color: race }, line: { color: LINE, width: 1 } });
  s.addText("Lỗi race (5 lỗi)", { x: M + 0.35, y: 6.02, w: 3.2, h: 0.38, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "middle", isTextBox: true });
  s.addShape(pres.ShapeType.rect, { x: M + 3.7, y: 6.1, w: 0.22, h: 0.22, fill: { color: logic }, line: { color: LINE, width: 1 } });
  s.addText("Lỗi logic, sai cả khi tuần tự (1 lỗi)", { x: M + 4.05, y: 6.02, w: 5, h: 0.38, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "middle", isTextBox: true });
  footer(s, "Số vòng vi phạm / 10 · results/latest-race, results/latest-sequential");
  s.addNotes("Đây là bảng kết quả chính. S1 và S4 PASS ở cả hai chế độ, chứng tỏ harness không báo lỗi giả và hai cơ chế idempotencyKey, FOR UPDATE hoạt động. Năm scenario chỉ vỡ khi đồng thời là lỗi race. S6 vỡ cả khi tuần tự nên được phân loại riêng là lỗi logic.");
}

// 10 · Số liệu nổi bật
{
  const s = newSlide("ORANGE_BLANK");
  s.addText("LỖI D1 · MỨC ĐỘ CAO", { x: M, y: 1.2, w: W, h: 0.4, fontFace: MONO, fontSize: 18, bold: true, color: INK, charSpacing: 3, margin: 0, isTextBox: true });
  s.addText("2 khách · 20/20", { x: M, y: 2.0, w: W, h: 2.2, fontFace: HEAD, fontSize: 96, bold: true, color: INK, margin: 0, valign: "middle", isTextBox: true });
  s.addText('Chỉ cần hai người bấm "Đặt" gần như cùng lúc vào hai slot chồng nhau là host bị đặt chồng lịch, ở mọi vòng thử.', { x: M, y: 4.5, w: 10.5, h: 1.4, fontFace: BODY, fontSize: 26, color: INK, margin: 0, valign: "top", isTextBox: true });
  s.addNotes("Thí nghiệm độ nhạy: giảm xuống chỉ 2 request đồng thời, chạy 20 vòng. S2 vi phạm 20 trên 20 vòng. Nghĩa là lỗi không cần tải lớn; hai khách thật bấm đặt cùng lúc là đủ.");
}

// 11 · Cửa sổ race (biểu đồ native)
{
  const s = newSlide("LIGHT");
  eyebrow(s, "09 · CỬA SỔ RACE");
  s.addText("Cửa sổ race rộng khoảng 30–60 ms", { placeholder: "title" });
  const labels = ["0", "10", "20", "30", "35", "40", "45", "50", "60", "100"];
  const values = [100, 100, 100, 100, 40, 20, 20, 40, 0, 0];
  s.addChart(pres.charts.BAR, [{ name: "Tỉ lệ vòng vi phạm (%)", labels, values }], {
    x: M, y: 1.75, w: W, h: 4.7, barDir: "col", chartColors: [ORANGE],
    showTitle: true, title: "Tỉ lệ vòng vi phạm (%) theo độ trễ Δ của request thứ hai (ms)", titleFontSize: 16, titleColor: INK, titleFontFace: BODY,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 14, dataLabelColor: INK, dataLabelFontFace: BODY, dataLabelFormatCode: '0"%"',
    catAxisLabelColor: INK, catAxisLabelFontSize: 14, catAxisLabelFontFace: BODY,
    valAxisLabelColor: MUTED, valAxisLabelFontSize: 12, valAxisLabelFontFace: BODY, valAxisMaxVal: 110, valAxisMinVal: 0,
    valGridLine: { color: "E1DDD2", size: 0.75 }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 40,
  });
  footer(s, "10 vòng mỗi mốc · 2 request xung đột · results/window-S2");
  s.addNotes("Thí nghiệm đo cửa sổ race: hai request xung đột, request thứ hai gửi trễ Δ mili-giây. Từ 0 đến 30 ms luôn vi phạm, 35 đến 50 ms vi phạm thỉnh thoảng, từ 60 ms trở đi không còn. Cửa sổ xấp xỉ thời gian xử lý một request trên máy test. Trên production có thêm lời gọi Google/Outlook Calendar ở bước đọc nên cửa sổ còn rộng hơn.");
}

// 12 · Defect
{
  const s = newSlide("LIGHT");
  eyebrow(s, "10 · DEFECT");
  s.addText("6 lỗi và 2 quan sát phụ", { placeholder: "title" });
  tbl(s, [
    ["ID", "Lỗi", "Loại", "Mức độ"],
    ["D1", "Host bị đặt chồng khi slot lệch giờ hoặc khác event type", "Race", { text: "Cao", bold: true }],
    ["D2", 'Event có ghế: còn ghế vẫn bị từ chối "xung đột"', "Race", "Trung bình"],
    ["D3", "Nhiều booking PENDING cho cùng một slot", "Race", "Trung bình"],
    ["D4", "Link đổi lịch cũ dùng lại được, 1 gốc sinh nhiều booking", "Logic", { text: "Cao", bold: true }],
    ["D5", "Hủy và đổi lịch cùng báo thành công", "Race", "Trung bình"],
    ["D6", "Vượt giới hạn 1 booking/ngày", "Race", "Trung bình"],
    ["O1", "Vượt giới hạn trả 401 Unauthorized thay vì 403", "Mã lỗi", "Thấp"],
    ["O2", "uid sinh từ Date.now(): trùng trong cùng mili-giây", "Thiết kế", "Thấp"],
  ], { y: 1.75, colW: [0.8, 7.2, 1.9, W - 9.9], fontSize: 14, rowH: 0.5 });
  footer(s, "Cách tái hiện, input, file/dòng gây lỗi, đề xuất sửa: docs/DEFECTS.md");
  s.addNotes("Tổng cộng 6 lỗi chính và 2 quan sát phụ. D1 và D4 mức cao: D1 vì gây double booking thật, D4 vì một link đổi lịch cũ có thể tạo ra số booking không giới hạn. O1 và O2 là những điều nhóm phát hiện khi phân tích log và code trong lúc tìm nguyên nhân.");
}

// 13 · Nguyên nhân gốc
{
  const s = newSlide("DARK");
  eyebrow(s, "11 · NGUYÊN NHÂN GỐC", true);
  s.addText("Ba nguyên nhân sinh ra sáu lỗi", { placeholder: "title" });
  const items = [
    ["D1 · D3 · D5 · D6", ORANGE, "Kiểm tra rồi ghi, không khóa", "Đếm giới hạn, đọc lịch trống, đọc trạng thái booking gốc đều xảy ra trước INSERT/UPDATE, không có transaction hay lock bao trùm."],
    ["D1 · D2 · D3", ORANGE, "Khóa idempotency quá hẹp", "uuidv5(start.end.userId), chỉ khi ACCEPTED: không bắt slot chồng lấn, bỏ qua PENDING. Khi va chạm, nhánh seated trả 409 thay vì thêm ghế."],
    ["D4", SKY, "Một trạng thái, hai nghĩa", 'CANCELLED + rescheduled vừa là "host yêu cầu đổi lịch" (được phép) vừa là "đã đổi xong" (phải chặn). Code không phân biệt.'],
  ];
  const cw = (W - 2 * 0.35) / 3;
  items.forEach(([tag, tc, h, b], i) => {
    const x = M + i * (cw + 0.35);
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.85, w: cw, h: 4.4, rectRadius: 0.12, fill: { color: INK2 }, line: { color: INK2, width: 0 } });
    s.addText(tag, { x: x + 0.3, y: 2.05, w: cw - 0.6, h: 0.35, fontFace: MONO, fontSize: 14, bold: true, color: tc, margin: 0, isTextBox: true });
    s.addText(h, { x: x + 0.3, y: 2.55, w: cw - 0.6, h: 0.9, fontFace: HEAD, fontSize: 21, bold: true, color: "F4F2EC", margin: 0, valign: "top", isTextBox: true });
    s.addText(b, { x: x + 0.3, y: 3.55, w: cw - 0.6, h: 2.5, fontFace: BODY, fontSize: 15, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "RegularBookingService.ts · createBooking.ts · booking-idempotency-key.ts · originalRescheduledBookingUtils.ts", true);
  s.addNotes("Sáu lỗi quy về ba nguyên nhân. Thứ nhất, mẫu TOCTOU: mọi bước kiểm tra là đọc, rồi mới ghi, không khóa. Thứ hai, ràng buộc duy nhất ở CSDL là idempotencyKey, quá hẹp. Thứ ba, D4 là lỗi mô hình trạng thái: cùng một cặp giá trị mang hai nghĩa nên hàm kiểm tra không thể đúng cho cả hai.");
}

// 14 · Thí nghiệm khắc phục
{
  const s = newSlide("LIGHT", "Khắc phục và kết luận");
  eyebrow(s, "12 · KIỂM CHỨNG BẰNG THÍ NGHIỆM");
  s.addText("Thêm ràng buộc CSDL: dữ liệu đúng, lộ lỗi mới", { placeholder: "title" });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 1.75, w: W, h: 1.1, rectRadius: 0.1, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("EXCLUDE USING gist (\"userId\" WITH =, tsrange(\"startTime\",\"endTime\") WITH &&)\nWHERE status IN ('accepted','pending')", { x: M + 0.3, y: 1.8, w: W - 0.6, h: 1.0, fontFace: MONO, fontSize: 14, color: "F4F2EC", margin: 0, valign: "middle", isTextBox: true });
  tbl(s, [
    ["Scenario", "Trước", "Sau", "Ghi chú"],
    ["S2 · D1", "10 booking chồng", { text: "1 booking", bold: true }, "9 request thua nhận 500"],
    ["S5 · D3", "7–10 PENDING", { text: "1 PENDING", bold: true }, "9 request thua nhận 500"],
    ["S8 · D6", "8 booking/ngày", "8 booking/ngày", "Cần advisory lock"],
  ], { y: 3.15, colW: [2.2, 3.0, 3.0, W - 8.2], fontSize: 15, rowH: 0.5 });
  s.addText([{ text: "Code chỉ ánh xạ lỗi Prisma P2002 thành 409. Lỗi exclusion (23P01) rơi xuống 500. Cần sửa ở " }, { text: "cả hai tầng", options: { bold: true, color: INK } }, { text: ": ràng buộc CSDL và ánh xạ lỗi." }], { x: M, y: 5.5, w: W, h: 0.9, fontFace: BODY, fontSize: 17, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "race-tests/experiments/exclusion-constraint.sql · results/fix-exclusion");
  s.addNotes("Để kiểm chứng nguyên nhân gốc, nhóm thêm một exclusion constraint cho host test rồi chạy lại. S2 và S5 chỉ còn đúng 1 booking, xác nhận nguyên nhân là thiếu ràng buộc ở CSDL. Nhưng các request thua nhận 500 thay vì 409, vì code chưa xử lý mã lỗi này. S8 không sửa được vì các booking không chồng giờ; invariant dạng đếm cần advisory lock hoặc SERIALIZABLE.");
}

// 15 · Kết luận
{
  const s = newSlide("DARK");
  eyebrow(s, "13 · KẾT LUẬN", true);
  s.addText("Đúng khi tuần tự chưa phải là đúng", { placeholder: "title" });
  const half = (W - 0.6) / 2;
  const col = (x, head, color, items) => {
    s.addText(head, { x, y: 1.85, w: half, h: 0.5, fontFace: HEAD, fontSize: 22, bold: true, color, margin: 0, isTextBox: true });
    s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 8 } })), { x, y: 2.5, w: half, h: 3.0, fontFace: BODY, fontSize: 16, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  };
  col(M, "Đã làm được", ORANGE, [
    "Dựng Cal.com v6.2.0 từ máy sạch, chạy 3 luồng nghiệp vụ",
    "Harness k6 + SQL tự động, 8 scenario, có đối chứng tuần tự",
    "6 lỗi có reproducer và nguyên nhân gốc theo file/dòng",
    "Đo cửa sổ race 30–60 ms, thí nghiệm khắc phục",
  ]);
  col(M + half + 0.6, "Hạn chế, hướng tiếp", SKY, [
    "Mới chạy yarn dev, một instance",
    "Chưa thử API v2, team round-robin, reserveSlot",
    "Thêm Playwright song song để minh họa D1 qua giao diện",
    "Báo cáo D1, D4 cho Cal.com kèm reproducer",
  ]);
  s.addText("Cảm ơn thầy và các bạn. Mời đặt câu hỏi.", { x: M, y: 5.75, w: W, h: 0.6, fontFace: HEAD, fontSize: 26, bold: true, color: "F4F2EC", margin: 0, isTextBox: true });
  footer(s, "Demo: cd race-tests && npm run race -- --scenarios S1,S2 --rounds 3 --out results/demo", true);
  s.addNotes("Thông điệp chính: một hệ thống chạy đúng khi tuần tự chưa chắc đúng khi đồng thời, và chỉ kiểm thử race với oracle trên CSDL mới lộ được điều đó. Demo đề xuất: chạy S1 và S2 với 3 vòng; S1 PASS, S2 FAIL, mỗi lần chạy khoảng 12 giây.");
}

pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
