// Sinh docs/BAO_CAO_GIUA_KY_R05-K15.pptx (8 slide, 16:9).
// Chạy: NODE_PATH=<nơi cài pptxgenjs> node tools/build-pptx-midterm.cjs
const path = require("path");
const pptxgen = require("pptxgenjs");

const OUT = path.resolve(__dirname, "..", "docs", "BAO_CAO_GIUA_KY_R05-K15.pptx");
const INK = "12202B", INK2 = "1D3142", PAPER = "F4F2EC", CARD = "FBFAF6", LINE = "DAD6CC";
const ORANGE = "E07B39", RUST = "B4531A", BLUE = "2558B8", SKY = "7FB0FF", GREEN = "2E7D4F";
const MUTED = "4A5866", MUTED_DARK = "B8C6D2", FOOT = "7A8592";
const BODY = "Calibri", MONO = "Consolas";
const M = 0.7, W = 13.33 - 2 * M;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "R05-K15 – Báo cáo giữa kỳ";
pres.author = "Nhóm R05-K15";
pres.theme = { headFontFace: BODY, bodyFontFace: BODY };

const num = (color) => ({ x: 12.2, y: 6.95, w: 0.5, h: 0.3, fontFace: BODY, fontSize: 12, color, align: "right" });
const titlePh = (color) => ({ placeholder: { options: { name: "title", type: "title", x: M, y: 0.7, w: W, h: 0.95, fontFace: BODY, fontSize: 34, bold: true, color, valign: "top", margin: 0 }, text: "" } });
pres.defineSlideMaster({ title: "LIGHT", background: { color: PAPER }, slideNumber: num(FOOT), objects: [titlePh(INK)] });
pres.defineSlideMaster({ title: "DARK", background: { color: INK }, slideNumber: num("8C9AA8"), objects: [titlePh("F4F2EC")] });
pres.defineSlideMaster({ title: "DARK_BLANK", background: { color: INK } });

const eyebrow = (s, t, dark) => s.addText(t, { x: M, y: 0.32, w: W, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: dark ? ORANGE : RUST, charSpacing: 2, margin: 0, isTextBox: true });
const footer = (s, t, dark) => s.addText(t, { x: M, y: 6.95, w: 11.3, h: 0.3, fontFace: BODY, fontSize: 12, color: dark ? "8C9AA8" : FOOT, margin: 0, isTextBox: true });
const card = (s, x, y, w, h, dark) => s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: dark ? INK : CARD }, line: { color: dark ? INK : LINE, width: 1 } });
function tbl(s, rows, { x = M, y, w = W, colW, fontSize = 14, rowH = 0.46, fills = {} }) {
  const b = { type: "solid", pt: 0.75, color: LINE };
  s.addTable(rows.map((r, ri) => r.map((c) => {
    const o = typeof c === "object" ? c : { text: c };
    return { text: o.text, options: { bold: ri === 0 || o.bold, color: o.color || INK, fill: { color: ri === 0 ? "E6E2D6" : fills[ri] || "FFFFFF" }, fontFace: BODY, fontSize, valign: "middle", border: [b, b, b, b], margin: [0.04, 0.1, 0.04, 0.1] } };
  })), { x, y, w, colW, rowH, autoPage: false });
}

let sec = "";
const add = (master, section) => {
  if (section && section !== sec) { pres.addSection({ title: section }); sec = section; }
  return pres.addSlide({ masterName: master, sectionTitle: sec });
};

// 1 · Bìa
{
  const s = add("DARK_BLANK", "Mở đầu");
  s.addText("BÁO CÁO GIỮA KỲ · MILESTONE 2 · 20/10", { x: M, y: 0.7, w: W, h: 0.4, fontFace: MONO, fontSize: 16, bold: true, color: ORANGE, charSpacing: 3, margin: 0, isTextBox: true });
  s.addText("R05-K15\nKiểm thử race condition cho Cal.com", { x: M, y: 1.9, w: 11.5, h: 2.4, fontFace: BODY, fontSize: 54, bold: true, color: "F4F2EC", margin: 0, valign: "top", isTextBox: true });
  s.addText("Đã dựng hệ thống, đã vẽ kiến trúc, đã có kế hoạch kiểm thử và kết quả thử nghiệm đầu tiên", { x: M, y: 4.5, w: 10.5, h: 0.9, fontFace: BODY, fontSize: 24, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  s.addText("Môn Kiểm thử phần mềm · GV Nguyễn Thế Lâm\nKhoa CNTT – Trường Đại học Đà Lạt", { x: M, y: 6.1, w: 7, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED_DARK, margin: 0, isTextBox: true });
  s.addText("Nhóm: [Tên thành viên 1 – 4]", { x: 8.2, y: 6.1, w: 4.4, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED_DARK, align: "right", margin: 0, isTextBox: true });
  s.addNotes("Giữa kỳ cần trình bày bốn thứ: demo hệ thống chạy, sơ đồ kiến trúc và tài liệu on-boarding, kế hoạch áp dụng kỹ thuật kiểm thử. Nhóm có thêm một kết quả thử nghiệm đầu tiên.");
}

// 2 · Chốt đề tài
{
  const s = add("LIGHT");
  eyebrow(s, "01 · ĐỀ TÀI ĐÃ CHỐT");
  s.addText("Một tổ hợp Repo + Kỹ thuật, đã cố định phiên bản", { placeholder: "title" });
  const cols = [
    ["REPO · R05", "Cal.com", "Nền tảng đặt lịch mã nguồn mở. TypeScript, Next.js 16, PostgreSQL + Prisma, monorepo."],
    ["KỸ THUẬT · K15", "Concurrency / Race", "Gửi nhiều request đồng thời, kiểm invariant trực tiếp trong CSDL."],
    ["PHIÊN BẢN ĐÃ PIN", "v6.2.0", "Commit 1c193cca8682b33b9866c792186033f7ef886682, tránh nhánh main thay đổi giữa kỳ."],
  ];
  const cw = (W - 0.7) / 3;
  cols.forEach(([tag, head, body], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 1.95, cw, 3.3);
    s.addText(tag, { x: x + 0.3, y: 2.15, w: cw - 0.6, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: BLUE, margin: 0, isTextBox: true });
    s.addText(head, { x: x + 0.3, y: 2.6, w: cw - 0.6, h: 0.6, fontFace: BODY, fontSize: 26, bold: true, color: INK, margin: 0, isTextBox: true });
    s.addText(body, { x: x + 0.3, y: 3.35, w: cw - 0.6, h: 1.7, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  s.addText("Phạm vi: chỉ luồng đặt lịch, đổi lịch, hủy lịch (booking). Không ôm toàn bộ monorepo.", { x: M, y: 5.65, w: W, h: 0.5, fontFace: BODY, fontSize: 18, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Đề tài đã đăng ký là R05-K15. Nhóm khóa phiên bản ở tag v6.2.0 để test chạy lại được. Phạm vi hẹp vào luồng booking theo lưu ý của giảng viên.");
}

// 3 · Tiến độ
{
  const s = add("LIGHT", "Tiến độ");
  eyebrow(s, "02 · TIẾN ĐỘ SO VỚI KẾ HOẠCH");
  s.addText("Sprint 1 hoàn thành, đã làm trước một phần Sprint 2", { placeholder: "title" });
  const done = { text: "Xong", bold: true, color: GREEN }, part = { text: "Đang làm", bold: true, color: RUST }, todo = { text: "Chưa làm", bold: true, color: MUTED };
  tbl(s, [
    ["Hạng mục", "Sprint", "Trạng thái", "Bằng chứng"],
    ["Chốt repo, kỹ thuật, pin tag và commit SHA", "Đăng ký", done, "README.md mục 1"],
    ["Dựng Cal.com local, seed data, chạy 3 luồng nghiệp vụ", "1", done, "docs/evidence/smoke-test.txt"],
    ["Đọc code, vẽ kiến trúc và luồng dữ liệu", "1", done, "docs/diagrams/kien-truc.md"],
    ["Tài liệu on-boarding, cài đặt từ máy sạch", "1", done, "README.md mục 2–3"],
    ["Kế hoạch kiểm thử: phạm vi, giả định, tiêu chí", "1", done, "Slide 6"],
    ["PoC race đầu tiên (đặt trùng slot)", "1", done, "Slide 7"],
    ["Mở rộng scenario S3–S8, chạy nhiều vòng", "2–3", part, "Đã có bản nháp harness"],
    ["Phân tích nguyên nhân gốc, viết báo cáo cuối", "4", todo, "–"],
  ], { y: 1.75, colW: [5.6, 1.4, 1.6, W - 8.6], fontSize: 14, rowH: 0.5 });
  s.addNotes("Mọi mục của Sprint 1 đã xong. Nhóm đã bắt đầu sang Sprint 2: harness cho nhiều scenario đã có bản nháp, đang chạy thử nhiều vòng. Phần phân tích nguyên nhân gốc và báo cáo cuối còn lại.");
}

// 4 · Kiến trúc
{
  const s = add("LIGHT", "Hệ thống và kiểm thử");
  eyebrow(s, "03 · KIẾN TRÚC");
  s.addText("Một request đặt lịch đi qua 4 lớp", { placeholder: "title" });
  const boxes = [
    ["apps/web", "POST /api/book/event\nPOST /api/cancel", true],
    ["RegularBookingService", "Kiểm tra giới hạn, lịch trống, booking gốc", false],
    ["createBooking / handleSeats", "Ghi Booking, Attendee, BookingSeat", false],
    ["PostgreSQL", "UNIQUE(uid)\nUNIQUE(idempotencyKey)", true],
  ];
  const bw = 2.55, gap = (W - 4 * bw) / 3;
  boxes.forEach(([h, b, dark], i) => {
    const x = M + i * (bw + gap);
    card(s, x, 1.9, bw, 1.8, dark);
    s.addText(h, { x: x + 0.15, y: 2.0, w: bw - 0.3, h: 0.5, fontFace: MONO, fontSize: 13, bold: true, color: dark ? ORANGE : BLUE, margin: 0, valign: "top", isTextBox: true });
    s.addText(b, { x: x + 0.15, y: 2.55, w: bw - 0.3, h: 1.0, fontFace: BODY, fontSize: 14, color: dark ? "F4F2EC" : MUTED, margin: 0, valign: "top", isTextBox: true });
    if (i < 3) s.addShape(pres.ShapeType.line, { x: x + bw + 0.04, y: 2.8, w: gap - 0.08, h: 0, line: { color: FOOT, width: 2, endArrowType: "triangle" } });
  });
  s.addText("Điểm cần chú ý cho kiểm thử race", { x: M, y: 4.1, w: W, h: 0.4, fontFace: BODY, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText([
    { text: "Các bước kiểm tra (giới hạn, lịch trống, trạng thái booking gốc) chỉ đọc rồi quyết định; không giữ khóa tới lúc ghi.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Chỉ có hai ràng buộc ở CSDL: UNIQUE uid và UNIQUE idempotencyKey (tính từ start, end, host).", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Event có ghế dùng SELECT … FOR UPDATE khi thêm ghế vào booking đã có.", options: { bullet: true } },
  ], { x: M, y: 4.6, w: W, h: 1.9, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Sơ đồ container và luồng tuần tự đầy đủ: docs/diagrams/kien-truc.md");
  s.addNotes("Đây là phần kiến trúc rút gọn. Sơ đồ đầy đủ ở docs/diagrams/kien-truc.md. Điểm mấu chốt rút ra khi đọc code: các bước kiểm tra chỉ đọc, giữa kiểm tra và ghi không có khóa, nên đây là nơi nhóm kỳ vọng tìm ra race.");
}

// 5 · Môi trường
{
  const s = add("LIGHT");
  eyebrow(s, "04 · MÔI TRƯỜNG VÀ ON-BOARDING");
  s.addText("Hệ thống chạy trên máy, 3 luồng nghiệp vụ đạt", { placeholder: "title" });
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
  s.addText([{ text: "Khó khăn đã xử lý: " , options: { bold: true, color: INK } }, { text: "không có Docker (dùng Postgres.app); cột timestamp lưu UTC nên driver bị lệch +7 giờ; /api/cancel cần CSRF 64 ký tự." }], { x: M, y: 5.4, w: W, h: 0.9, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Cài đặt từ máy sạch: README.md · demo: npm run demo:midterm");
  s.addNotes("Tài liệu on-boarding gồm phiên bản, lệnh cài đặt, biến môi trường, seed data. Smoke test chạy ba luồng: đặt, đổi, hủy lịch. Trong demo, nhóm chạy lệnh npm run demo:midterm để chứng minh.");
}

// 6 · Kế hoạch kỹ thuật
{
  const s = add("DARK", "Kế hoạch kiểm thử");
  eyebrow(s, "05 · KẾ HOẠCH ÁP DỤNG K15", true);
  s.addText("Phạm vi, giả định và tiêu chí đánh giá", { placeholder: "title" });
  const cw = (W - 0.7) / 3;
  const cols = [
    ["PHẠM VI", ORANGE, ["Đặt lịch 1-1 và event có ghế", "Event cần xác nhận (PENDING)", "Đổi lịch, hủy lịch", "Giới hạn số booking/ngày", "Ngoài phạm vi: lịch ngoài, thanh toán, team, API v2"]],
    ["GIẢ ĐỊNH", SKY, ["Một instance, một PostgreSQL, chạy local", "Chạy yarn dev; production có thể rộng cửa sổ hơn", "Host không nối lịch ngoài", "Rate limit tắt", "Mỗi vòng dùng một ngày riêng"]],
    ["TIÊU CHÍ PASS / FAIL", ORANGE, ["Oracle là invariant trong CSDL, không phải mã HTTP", "I1: host không có 2 booking chồng giờ", "I2: không vượt số ghế", "I4–I6: đổi lịch, hủy, giới hạn", "FAIL khi 1 vòng vi phạm; so với nhóm đối chứng tuần tự"]],
  ];
  cols.forEach(([h, color, items], i) => {
    const x = M + i * (cw + 0.35);
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.85, w: cw, h: 4.7, rectRadius: 0.12, fill: { color: INK2 }, line: { color: INK2, width: 0 } });
    s.addText(h, { x: x + 0.3, y: 2.05, w: cw - 0.6, h: 0.4, fontFace: MONO, fontSize: 14, bold: true, color, margin: 0, isTextBox: true });
    s.addText(items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < items.length - 1, paraSpaceAfter: 8 } })), { x: x + 0.3, y: 2.6, w: cw - 0.6, h: 3.8, fontFace: BODY, fontSize: 15, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "Chi tiết: BAO_CAO.md phần D, E", true);
  s.addNotes("Đây là phần đề bài yêu cầu cho giữa kỳ: kế hoạch áp dụng kỹ thuật với phạm vi test, giả định và tiêu chí đánh giá. Oracle là điểm khác biệt của kiểm thử race: không tin mã HTTP mà kiểm dữ liệu thật trong CSDL.");
}

// 7 · Kết quả PoC
{
  const s = add("LIGHT", "Kết quả sơ bộ");
  eyebrow(s, "06 · KẾT QUẢ THỬ NGHIỆM ĐẦU TIÊN");
  s.addText("Một cơ chế bảo vệ hoạt động, một cơ chế thì không", { placeholder: "title" });
  const race = "F6E2D3";
  tbl(s, [
    ["Thử nghiệm", "10 request đồng thời", "Gửi tuần tự", "Trong CSDL"],
    ["S1 · cùng một slot", "PASS (0/10 vòng sai)", "PASS", "1 booking"],
    [{ text: "S2 · slot lệch giờ, chồng lấn", bold: true }, { text: "FAIL (10/10 vòng sai)", bold: true }, "PASS", { text: "10 booking chồng nhau", bold: true }],
  ], { y: 1.85, colW: [3.7, 3.2, 2.0, W - 8.9], fontSize: 15, rowH: 0.62, fills: { 2: race } });
  const cw = (W - 0.7) / 3;
  [["Mã HTTP vẫn 200", "Cả 10 request đều trả thành công. Chỉ truy vấn CSDL mới thấy dữ liệu sai."], ["Chỉ cần 2 người", "Với 2 request đồng thời, S2 vi phạm ở 20/20 vòng."], ["Do khóa quá hẹp", "idempotencyKey chỉ bắt slot trùng khít start, end và host."]].forEach(([h, b], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 4.1, cw, 2.3);
    s.addText(h, { x: x + 0.3, y: 4.3, w: cw - 0.6, h: 0.5, fontFace: BODY, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true });
    s.addText(b, { x: x + 0.3, y: 4.9, w: cw - 0.6, h: 1.4, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "Chạy lại: npm run demo:midterm · kết quả đầy đủ 8 scenario sẽ trình bày ở bảo vệ cuối kỳ");
  s.addNotes("Kết quả sơ bộ: S1 đặt cùng slot PASS nhờ khóa idempotency. S2 đặt hai slot chồng lấn thì FAIL ở mọi vòng: host bị đặt chồng. Đây là lý do nhóm chọn kỹ thuật này. Kết quả đầy đủ 8 scenario, nguyên nhân gốc và thí nghiệm khắc phục sẽ trình bày ở cuối kỳ.");
}

// 8 · Kế hoạch tiếp theo
{
  const s = add("DARK", "Tiếp theo");
  eyebrow(s, "07 · KẾ HOẠCH TIẾP THEO", true);
  s.addText("Từ giữa kỳ đến bảo vệ", { placeholder: "title" });
  const rows = [
    ["21/10 – 3/11", "Hoàn thiện test model, viết scenario seated, PENDING, đổi lịch, hủy lịch", ORANGE],
    ["4/11 – 17/11", "Chạy nhiều vòng, đo cửa sổ race, thêm một scenario Playwright qua giao diện", ORANGE],
    ["18/11 – 30/11", "Phân tích nguyên nhân gốc, thí nghiệm khắc phục, viết báo cáo, nộp trước bảo vệ 1 tuần", ORANGE],
    ["Tháng 12", "Slide, tập dượt, chạy lại trên máy sạch, đánh giá chéo", ORANGE],
  ];
  rows.forEach(([when, what], i) => {
    const y = 1.85 + i * 0.95;
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: 2.4, h: 0.75, rectRadius: 0.1, fill: { color: ORANGE }, line: { color: ORANGE, width: 0 } });
    s.addText(when, { x: M, y, w: 2.4, h: 0.75, fontFace: BODY, fontSize: 17, bold: true, color: INK, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addShape(pres.ShapeType.roundRect, { x: M + 2.6, y, w: W - 2.6, h: 0.75, rectRadius: 0.1, fill: { color: INK2 }, line: { color: INK2, width: 0 } });
    s.addText(what, { x: M + 2.85, y, w: W - 3.1, h: 0.75, fontFace: BODY, fontSize: 16, color: "F4F2EC", valign: "middle", margin: 0, isTextBox: true });
  });
  s.addText("Rủi ro: race không tái hiện ổn định (chạy nhiều vòng, báo tỉ lệ) · máy yếu khi chạy Cal.com + PostgreSQL + k6 (giảm số VU) · cần chứng minh coverage nếu không tìm được lỗi.", { x: M, y: 5.8, w: W, h: 0.9, fontFace: BODY, fontSize: 15, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Cảm ơn thầy và các bạn. Mời đặt câu hỏi.", true);
  s.addNotes("Kế hoạch bốn giai đoạn đến bảo vệ. Rủi ro chính là race không tái hiện ổn định nên nhóm chạy nhiều vòng và báo tỉ lệ. Kết thúc phần báo cáo, mời thầy đặt câu hỏi.");
}

pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
