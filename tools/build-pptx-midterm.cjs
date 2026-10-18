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
  s.addText("Quy trình test, 8 test case, kết quả test thật và 6 lỗi đã tái hiện", { x: M, y: 4.5, w: 10.5, h: 0.9, fontFace: BODY, fontSize: 24, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  s.addText("Môn Kiểm thử phần mềm · GV Nguyễn Thế Lâm\nKhoa CNTT – Trường Đại học Đà Lạt", { x: M, y: 6.1, w: 7, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED_DARK, margin: 0, isTextBox: true });
  s.addText("Nhóm 14\n2312741 - Nguyễn Thanh Tâm\n2312800 - Võ Công Vinh\n2312774 - Nguyễn Đức Tín\n2312796 - Ngô Quốc Trường Vĩ", { x: 7.6, y: 5.5, w: 5.03, h: 1.45, fontFace: BODY, fontSize: 16, color: MUTED_DARK, align: "right", valign: "bottom", margin: 0, isTextBox: true });
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
  s.addText("Sprint 1 hoàn thành, harness 8 scenario đã chạy xong", { placeholder: "title" });
  const done = { text: "Xong", bold: true, color: GREEN }, part = { text: "Một phần", bold: true, color: RUST }, todo = { text: "Chưa làm", bold: true, color: MUTED }, fill = { text: "Cần điền", bold: true, color: RUST };
  tbl(s, [
    ["Hạng mục", "Sprint", "Trạng thái", "Bằng chứng"],
    ["Chốt repo, kỹ thuật, pin tag và commit SHA", "Đăng ký", done, "README.md mục 1"],
    ["Dựng Cal.com local, seed data, chạy 3 luồng nghiệp vụ", "1", done, "docs/evidence/smoke-test.txt"],
    ["Đọc code, vẽ kiến trúc và luồng dữ liệu", "1", done, "docs/diagrams/kien-truc.md"],
    ["Tài liệu on-boarding, kế hoạch kiểm thử", "1", done, "README.md, slide 8"],
    ["Harness k6 + SQL, 8 scenario, mỗi scenario 10 vòng, có đối chứng tuần tự", "2–3", done, "race-tests/results/"],
    ["Phân tích nguyên nhân gốc, thí nghiệm khắc phục", "4", done, "docs/DEFECTS.md"],
    ["Báo cáo cuối (bản nháp A–H) và slide bảo vệ", "4–5", part, "docs/BAO_CAO.md"],
    ["Chạy lại trên máy Windows khác: kết quả khớp 8/8", "3", done, "race-tests/results/windows-race"],
    ["Scenario Playwright qua giao diện", "3", todo, "–"],
    ["Board GitHub Projects: 18 thẻ ở 3 cột; còn gán người và commit đều các thành viên", "Đăng ký", part, "docs/evidence/board.png"],
  ], { y: 1.75, colW: [5.9, 1.2, 1.5, W - 8.6], fontSize: 13, rowH: 0.43 });
  s.addNotes("Mọi mục của Sprint 1 đã xong, và nhóm đã làm trước: harness 8 scenario đã chạy 10 vòng mỗi scenario kèm nhóm đối chứng tuần tự, đã phân tích nguyên nhân gốc. Giữa kỳ nhóm chỉ trình bày kết quả sơ bộ S1 và S2; kết quả đầy đủ dành cho buổi bảo vệ cuối kỳ. Còn lại: Playwright qua giao diện, hoàn thiện báo cáo, và chuẩn bị bảo vệ. Nói rõ phân vai và board Trello/Jira của nhóm.");
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

// 1 · Quy trình test
{
  const s = add("LIGHT");
  eyebrow(s, "05 · QUY TRÌNH TEST");
  s.addText("Từ đọc code đến báo cáo: 7 bước, có nhóm đối chứng", { placeholder: "title" });
  const steps = [
    ["1", "Đọc code", "Tìm chỗ kiểm tra rồi mới ghi"],
    ["2", "Chọn invariant", "7 tính chất dữ liệu phải đúng"],
    ["3", "Thiết kế test case", "8 test case TC-01 đến TC-08"],
    ["4", "Chuẩn bị dữ liệu", "Host test, 5 loại cuộc hẹn"],
    ["5", "Chạy", "Đồng thời (k6) và tuần tự"],
    ["6", "Kiểm trong CSDL", "SQL kiểm từng invariant"],
    ["7", "Nguyên nhân gốc", "Đọc code, thử khắc phục"],
  ];
  const bw = 1.55, gap = (W - 7 * bw) / 6;
  steps.forEach(([n, h, b], i) => {
    const x = M + i * (bw + gap), dark = i === 4;
    card(s, x, 1.95, bw, 2.3, dark);
    s.addText(n, { x: x + 0.15, y: 2.05, w: 0.5, h: 0.5, fontFace: BODY, fontSize: 24, bold: true, color: dark ? ORANGE : BLUE, margin: 0, isTextBox: true });
    s.addText(h, { x: x + 0.15, y: 2.6, w: bw - 0.3, h: 0.6, fontFace: BODY, fontSize: 15, bold: true, color: dark ? "F4F2EC" : INK, margin: 0, valign: "top", isTextBox: true });
    s.addText(b, { x: x + 0.15, y: 3.25, w: bw - 0.3, h: 0.9, fontFace: BODY, fontSize: 13, color: dark ? MUTED_DARK : MUTED, margin: 0, valign: "top", isTextBox: true });
    if (i < 6) s.addShape(pres.ShapeType.line, { x: x + bw + 0.02, y: 3.1, w: gap - 0.04, h: 0, line: { color: FOOT, width: 1.5, endArrowType: "triangle" } });
  });
  s.addText("Tiêu chí pass / fail", { x: M, y: 4.6, w: W, h: 0.4, fontFace: BODY, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText([
    { text: "Một vòng PASS khi mọi invariant đúng và không có phản hồi 5xx hay lỗi kết nối.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Test case PASS khi cả 10 vòng PASS; một vòng vi phạm là FAIL.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Là lỗi race khi gửi đồng thời FAIL nhưng gửi tuần tự PASS; nếu tuần tự cũng FAIL thì là lỗi logic.", options: { bullet: true } },
  ], { x: M, y: 5.05, w: W, h: 1.7, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Chi tiết: docs/QUY_TRINH_TEST.md mục 1");
  s.addNotes("Quy trình gồm bảy bước. Điểm khác của kiểm thử race là bước 6: oracle là dữ liệu trong cơ sở dữ liệu, không phải mã HTTP. Bước 5 chạy cả đồng thời và tuần tự để tách lỗi race khỏi lỗi logic thông thường.");
}

// 2 · Danh sách test case
{
  const s = add("LIGHT");
  eyebrow(s, "06 · DANH SÁCH TEST CASE");
  s.addText("8 test case, mỗi cái chạy 10 vòng", { placeholder: "title" });
  tbl(s, [
    ["TC", "Input (gửi đồng thời)", "Kết quả mong đợi", "Invariant"],
    ["TC-01", "10 người đặt cùng một giờ 09:00", "1 người 200, 9 người 409", "I1"],
    ["TC-02", "10 giờ lệch 3 phút, event 30 và 60 phút, chồng lấn", "Chỉ 1 booking hiệu lực", "I1"],
    ["TC-03", "6 người đặt event 3 ghế, giờ trống", "3 người 200, 3 người 409; 3 ghế", "I2, I2b"],
    ["TC-04", "6 người tranh 2 ghế còn lại", "2 người 200, 4 người 409", "I2, I2b"],
    ["TC-05", "10 người đặt event cần xác nhận", "Chỉ 1 booking chờ xác nhận", "I3"],
    ["TC-06", "5 lệnh đổi lịch cùng một booking", "1 lệnh thành công, booking gốc bị hủy", "I4"],
    ["TC-07", "1 lệnh hủy + 1 lệnh đổi lịch cùng booking", "Không thể cả hai cùng thành công", "I5"],
    ["TC-08", "8 người đặt 8 giờ khác nhau, giới hạn 1/ngày", "Chỉ 1 người thành công", "I6"],
  ], { y: 1.75, colW: [1.0, 5.2, 4.3, W - 10.5], fontSize: 14, rowH: 0.47 });
  s.addText("Dữ liệu: host k15host (UTC, rảnh 24/7); 5 loại cuộc hẹn; mỗi request dùng một email người đặt khác nhau. I7 (không có 5xx) áp dụng cho mọi test case.", { x: M, y: 6.0, w: W, h: 0.7, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Đầy đủ tiền điều kiện và invariant: docs/QUY_TRINH_TEST.md mục 2");
  s.addNotes("Mỗi test case chọn một cơ chế bảo vệ khác nhau để thử. TC-01 và TC-04 là hai trường hợp hệ thống đã có bảo vệ, dùng để kiểm chứng harness không báo lỗi giả. Sáu test case còn lại thử những chỗ đọc code cho thấy chưa có bảo vệ ở tầng cơ sở dữ liệu.");
}

// 6 · Kế hoạch kỹ thuật
{
  const s = add("DARK", "Kế hoạch kiểm thử");
  eyebrow(s, "07 · KẾ HOẠCH ÁP DỤNG K15", true);
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

// 3 · Chi phí test
{
  const s = add("LIGHT");
  eyebrow(s, "08 · CHI PHÍ TEST");
  s.addText("Chi phí đo thật: 0 đồng, khoảng 12 phút máy", { placeholder: "title" });
  const stats = [["0 đồng", "Công cụ miễn phí, chạy trên máy cá nhân"], ["2 080", "Request đã gửi trong mọi lần chạy"], ["≈ 12 phút", "Tổng thời gian máy chạy test"], ["≈ 970", "Dòng mã bộ test (Node.js, k6, SQL)"]];
  const cw = (W - 3 * 0.3) / 4;
  stats.forEach(([n, l], i) => {
    const x = M + i * (cw + 0.3);
    card(s, x, 1.85, cw, 1.7);
    s.addText(n, { x: x + 0.2, y: 1.95, w: cw - 0.4, h: 0.8, fontFace: BODY, fontSize: 32, bold: true, color: BLUE, margin: 0, valign: "middle", isTextBox: true });
    s.addText(l, { x: x + 0.2, y: 2.8, w: cw - 0.4, h: 0.7, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  tbl(s, [
    ["Lần chạy", "Request", "Thời gian máy"],
    ["Đồng thời chính (8 test case × 10 vòng)", "570", "150 giây"],
    ["Tuần tự đối chứng", "570", "22 giây"],
    ["Độ nhạy: chỉ 2 request, 20 vòng", "200", "164 giây"],
    ["Thí nghiệm khắc phục", "380", "85 giây"],
    ["Đo cửa sổ race (18 mốc độ trễ)", "360", "300 giây"],
  ], { y: 3.85, colW: [7.2, 2.2, W - 9.4], fontSize: 14, rowH: 0.42 });
  s.addText("Công sức nhóm (người-giờ): [nhóm điền số giờ thực tế của từng thành viên]. Máy: MacBook Apple Silicon 10 nhân, 32 GB RAM.", { x: M, y: 6.5, w: W, h: 0.4, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, isTextBox: true });
  footer(s, "Số liệu lấy từ summary.json của từng lần chạy: docs/QUY_TRINH_TEST.md mục 3");
  s.addNotes("Số liệu chi phí máy đo thật từ thời điểm bắt đầu và kết thúc trong file summary.json của mỗi lần chạy. Chạy lại bộ test chính cả đồng thời và tuần tự mất dưới ba phút. Phần công sức người-giờ nhóm tự điền theo thực tế.");
}

// Kết quả test
{
  const s = add("LIGHT", "Kết quả sơ bộ");
  eyebrow(s, "09 · KẾT QUẢ TEST");
  s.addText("6 trên 8 test case phát hiện lỗi", { placeholder: "title" });
  const race = "F6E2D3", logic = "DCE5F4";
  tbl(s, [
    ["Test case", "Đồng thời", "Tuần tự", "Kết luận", "Lỗi"],
    ["TC-01 cùng một giờ", "0/10", "0/10", "Đúng", "–"],
    [{ text: "TC-02 giờ chồng lấn", bold: true }, { text: "10/10", bold: true }, "0/10", "Lỗi race", "D1"],
    [{ text: "TC-03 ghế đầu tiên", bold: true }, { text: "10/10", bold: true }, "0/10", "Lỗi race", "D2"],
    ["TC-04 ghế còn lại", "0/10", "0/10", "Đúng", "–"],
    [{ text: "TC-05 chờ xác nhận", bold: true }, { text: "10/10", bold: true }, "0/10", "Lỗi race", "D3"],
    [{ text: "TC-06 đổi lịch lặp", bold: true }, { text: "10/10", bold: true }, { text: "10/10", bold: true }, "Lỗi logic", "D4"],
    [{ text: "TC-07 hủy và đổi lịch", bold: true }, { text: "10/10", bold: true }, "0/10", "Lỗi race", "D5"],
    [{ text: "TC-08 giới hạn 1/ngày", bold: true }, { text: "10/10", bold: true }, "0/10", "Lỗi race", "D6"],
  ], { y: 1.75, colW: [4.4, 2.0, 2.0, 2.4, W - 10.8], fontSize: 14, rowH: 0.46, fills: { 2: race, 3: race, 5: race, 6: logic, 7: race, 8: race } });
  s.addText("Vòng vi phạm trên 10 vòng. Mã HTTP đều là 200 nhưng dữ liệu trong CSDL sai. Chỉ cần 2 request đồng thời, TC-02 vi phạm ở 20/20 vòng.", { x: M, y: 6.1, w: W, h: 0.7, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Lượt chạy chính thức 18/10/2026 · docs/KET_QUA_TEST_GIUA_KY.md · race-tests/results/giua-ky-race");
  s.addNotes("Kết quả thật của lượt chạy chính thức: mỗi test case chạy 10 vòng, ở hai chế độ đồng thời và tuần tự. TC-01 và TC-04 đúng, hai cơ chế bảo vệ của hệ thống hoạt động. Năm test case chỉ sai khi đồng thời là lỗi race. TC-06 sai cả khi tuần tự nên là lỗi logic, không phải race. Mã HTTP đều thành công, chỉ truy vấn trực tiếp cơ sở dữ liệu mới thấy dữ liệu sai.");
}

// Chạy lại trên máy thứ hai
{
  const s = add("LIGHT");
  eyebrow(s, "10 · CHẠY LẠI TRÊN MÁY THỨ HAI");
  s.addText("Máy Windows cho cùng kết quả: khớp 8/8", { placeholder: "title" });
  tbl(s, [
    ["Test case", "Mac: đồng thời", "Windows: đồng thời", "Windows: tuần tự", "Khớp"],
    ["TC-01, TC-04", "0/10", "0/10", "0/10", "Có"],
    ["TC-02, 03, 05, 07, 08", "10/10", "10/10", "0/10", "Có"],
    ["TC-06", "10/10", "10/10", "10/10", "Có"],
  ], { y: 1.75, colW: [3.6, 2.3, 2.6, 2.4, W - 10.9], fontSize: 15, rowH: 0.55 });
  const cw = (W - 0.7) / 3;
  [["Thời gian", "Đồng thời 210 giây (Mac 154 giây); tuần tự 43 giây (Mac 23 giây)."], ["Hai lượt đầu bị loại", "Thiếu k6 và Cal.com dừng giữa chừng. Chỉ dùng lượt chạy sạch."], ["Còn thiếu", "Cấu hình máy Windows và tên người test cần ghi vào báo cáo."]].forEach(([h, b], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 4.0, cw, 2.2);
    s.addText(h, { x: x + 0.3, y: 4.2, w: cw - 0.6, h: 0.5, fontFace: BODY, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true });
    s.addText(b, { x: x + 0.3, y: 4.8, w: cw - 0.6, h: 1.3, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "race-tests/results/windows-race · race-tests/results/windows-sequential");
  s.addNotes("Một thành viên chạy lại bộ test trên máy Windows của mình với cùng phiên bản mã. Kết luận tám test case giống hệt máy Mac: năm lỗi race chỉ sai khi đồng thời, một lỗi logic sai cả khi tuần tự, hai test case đúng. Hai lượt chạy đầu trên máy Windows không hợp lệ vì thiếu công cụ k6 và vì Cal.com dừng giữa chừng; nhóm đã loại và chỉ dùng lượt chạy sạch. Cấu hình máy và tên người test cần ghi vào báo cáo.");
}

// 4 · Lỗi thật
{
  const s = add("LIGHT");
  eyebrow(s, "11 · LỖI THẬT, TÁI HIỆN ĐỘC LẬP");
  s.addText("6 lỗi, đều tái hiện được bằng curl thuần", { placeholder: "title" });
  tbl(s, [
    ["Lỗi", "Tái hiện bằng curl (không dùng harness)", "Dữ liệu trong CSDL"],
    ["D1", "2 khách đặt 2 giờ chồng nhau cùng lúc: cả hai 200", "2 booking accepted chồng giờ 09:00–09:30 và 09:15–09:45"],
    ["D2", "6 người đặt event 3 ghế: 1×200, 5×409", "Chỉ bán 1/3 ghế dù còn ghế"],
    ["D3", "10 người đặt event cần xác nhận: 8×200", "8 booking chờ xác nhận cùng một giờ"],
    ["D4", "Đổi lịch liên tiếp một booking gốc 3 lần: cả 3 đều 200", "3 booking accepted từ cùng một gốc (cả khi tuần tự)"],
    ["D5", "Hủy và đổi lịch cùng lúc: cả hai 200", "Booking 09:00 đã hủy nhưng vẫn còn booking 11:00"],
    ["D6", "8 người đặt 8 giờ, giới hạn 1/ngày: 8×200", "8 booking hiệu lực trong một ngày"],
  ], { y: 1.75, colW: [0.9, 5.9, W - 6.8], fontSize: 14, rowH: 0.55 });
  s.addText("Đối chứng: gửi tuần tự hai request chồng giờ thì request thứ hai bị 409. Nhóm chưa báo lỗi cho Cal.com và chưa sửa mã Cal.com.", { x: M, y: 5.9, w: W, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "race-tests/repro/repro-curl.sh · docs/evidence/repro-curl.txt · docs/MINH_CHUNG_LOI.md");
  s.addNotes("Để chứng minh đây là lỗi thật, nhóm tái hiện lại từng lỗi bằng lệnh curl thuần, không dùng bộ test, rồi xem trực tiếp dữ liệu trong cơ sở dữ liệu. D4 là lỗi logic xảy ra cả khi gửi tuần tự; năm lỗi còn lại chỉ xảy ra khi đồng thời. Nhóm chưa báo lỗi cho nhóm phát triển Cal.com và chưa sửa mã Cal.com, nên nói là lỗi nhóm tìm được trên bản v6.2.0 chạy local.");
}

// 8 · Kế hoạch tiếp theo
{
  const s = add("DARK", "Tiếp theo");
  eyebrow(s, "12 · KẾ HOẠCH TIẾP THEO", true);
  s.addText("Từ giữa kỳ đến bảo vệ", { placeholder: "title" });
  const rows = [
    ["21/10 – 3/11", "Thêm scenario Playwright qua giao diện, bổ sung cấu hình máy Windows và tên người test vào báo cáo", ORANGE],
    ["4/11 – 17/11", "Rà soát nguyên nhân gốc và đề xuất sửa; chuẩn bị báo cáo lỗi D1, D4 cho Cal.com", ORANGE],
    ["18/11 – 30/11", "Hoàn thiện báo cáo A–H, nộp trước bảo vệ 1 tuần", ORANGE],
    ["Tháng 12", "Slide bảo vệ, tập dượt, đánh giá chéo giữa các thành viên", ORANGE],
  ];
  rows.forEach(([when, what], i) => {
    const y = 1.85 + i * 0.95;
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: 2.4, h: 0.75, rectRadius: 0.1, fill: { color: ORANGE }, line: { color: ORANGE, width: 0 } });
    s.addText(when, { x: M, y, w: 2.4, h: 0.75, fontFace: BODY, fontSize: 17, bold: true, color: INK, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addShape(pres.ShapeType.roundRect, { x: M + 2.6, y, w: W - 2.6, h: 0.75, rectRadius: 0.1, fill: { color: INK2 }, line: { color: INK2, width: 0 } });
    s.addText(what, { x: M + 2.85, y, w: W - 3.1, h: 0.75, fontFace: BODY, fontSize: 16, color: "F4F2EC", valign: "middle", margin: 0, isTextBox: true });
  });
  s.addText("Rủi ro: kết quả race có thể khác trên máy khác (báo tỉ lệ, không báo một lần chạy) · máy yếu khi chạy Cal.com + PostgreSQL + k6 (giảm số VU) · thành viên đóng góp không đều (board có người phụ trách, đánh giá chéo hằng tuần).", { x: M, y: 5.8, w: W, h: 0.9, fontFace: BODY, fontSize: 15, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Cảm ơn thầy và các bạn. Mời đặt câu hỏi.", true);
  s.addNotes("Kế hoạch bốn giai đoạn đến bảo vệ; phần kiểm thử chính đã chạy xong nên thời gian còn lại dành cho kiểm chứng lại, hoàn thiện báo cáo và chuẩn bị bảo vệ. Rủi ro chính là race không tái hiện ổn định nên nhóm chạy nhiều vòng và báo tỉ lệ. Kết thúc phần báo cáo, mời thầy đặt câu hỏi.");
}

pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
