// Sinh docs/BAO_CAO_GIUA_KY_R05-K15.pptx (17 slide, 16:9).
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
  s.addText("Quy trình test, 20 test case, kết quả test thật và 11 lỗi đã tái hiện", { x: M, y: 4.5, w: 10.5, h: 0.9, fontFace: BODY, fontSize: 24, color: MUTED_DARK, margin: 0, valign: "top", isTextBox: true });
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
  s.addText("Sprint 1 hoàn thành, harness 20 test case đã chạy xong", { placeholder: "title" });
  const done = { text: "Xong", bold: true, color: GREEN }, part = { text: "Một phần", bold: true, color: RUST }, todo = { text: "Chưa làm", bold: true, color: MUTED }, fill = { text: "Cần điền", bold: true, color: RUST };
  tbl(s, [
    ["Hạng mục", "Sprint", "Trạng thái", "Bằng chứng"],
    ["Chốt repo, kỹ thuật, pin tag và commit SHA", "Đăng ký", done, "README.md mục 1"],
    ["Dựng Cal.com local, seed data, chạy 3 luồng nghiệp vụ", "1", done, "docs/evidence/smoke-test.txt"],
    ["Đọc code, vẽ kiến trúc và luồng dữ liệu", "1", done, "docs/diagrams/kien-truc.md"],
    ["Tài liệu on-boarding, kế hoạch kiểm thử", "1", done, "README.md, slide 8"],
    ["Harness k6 + SQL, 20 test case, mỗi test case 10 vòng, có đối chứng tuần tự", "2–3", done, "race-tests/results/"],
    ["Phân tích nguyên nhân gốc, thí nghiệm khắc phục", "4", done, "docs/DEFECTS.md"],
    ["Báo cáo cuối (bản nháp A–H) và slide bảo vệ", "4–5", part, "docs/BAO_CAO.md"],
    ["Chạy lại trên máy Windows: 20 test case khớp 20/20", "3", done, "race-tests/results/windows-race"],
    ["Scenario Playwright qua giao diện", "3", todo, "–"],
    ["Board GitHub Projects: 18 thẻ ở 3 cột; còn gán người và commit đều các thành viên", "Đăng ký", part, "docs/evidence/board.png"],
  ], { y: 1.75, colW: [5.9, 1.2, 1.5, W - 8.6], fontSize: 13, rowH: 0.43 });
  s.addNotes("Mọi mục của Sprint 1 đã xong, và nhóm đã làm trước: harness 20 test case đã chạy 10 vòng mỗi scenario kèm nhóm đối chứng tuần tự, đã phân tích nguyên nhân gốc. Giữa kỳ nhóm chỉ trình bày kết quả sơ bộ S1 và S2; kết quả đầy đủ dành cho buổi bảo vệ cuối kỳ. Còn lại: Playwright qua giao diện, hoàn thiện báo cáo, và chuẩn bị bảo vệ. Nói rõ phân vai và board Trello/Jira của nhóm.");
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
    ["3", "Thiết kế test case", "20 test case TC-01 đến TC-20"],
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

// 2 · Danh sách test case (1/2)
{
  const s = add("LIGHT");
  eyebrow(s, "06 · DANH SÁCH TEST CASE (1/2)");
  s.addText("20 test case, mỗi cái chạy 10 vòng", { placeholder: "title" });
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
    ["TC-09", "2 booking khác nhau cùng đổi lịch sang một giờ trống", "1 thành công, 1 bị 409", "I1"],
    ["TC-10", "1 lệnh đổi lịch + 1 người đặt mới cùng nhắm một giờ", "Chỉ 1 trong 2 giữ được giờ", "I1"],
  ], { y: 1.75, colW: [1.0, 5.4, 4.1, W - 10.5], fontSize: 13, rowH: 0.39 });
  s.addText("Dữ liệu: host k15host (UTC, rảnh 24/7); 9 loại cuộc hẹn; mỗi request dùng một email người đặt khác nhau (trừ TC-14, 15, 16). I7 (không có 5xx) áp dụng cho mọi test case.", { x: M, y: 6.4, w: W, h: 0.5, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Đặc tả đầy đủ (tiền điều kiện, input, kết quả mong đợi): báo cáo mục 3.3.6 · docs/QUY_TRINH_TEST.md");
  s.addNotes("Nhóm đã tăng từ 8 lên 20 test case theo góp ý của thầy. Mười test case đầu: TC-01 và TC-04 là hai trường hợp hệ thống đã có bảo vệ, dùng để kiểm chứng bộ test không báo lỗi giả. TC-02, 03, 05, 06, 07, 08 thử những chỗ đọc mã cho thấy chưa có khóa. TC-09 và TC-10 mới: kiểm tra đường đổi lịch có được bảo vệ chống trùng giờ giống đường đặt mới hay không. Mỗi test case có đặc tả đầy đủ trong báo cáo mục 3.3.6.");
}

// 2 · Danh sách test case (2/2)
{
  const s = add("LIGHT");
  eyebrow(s, "07 · DANH SÁCH TEST CASE (2/2)");
  s.addText("12 test case bổ sung: giới hạn, buffer, hủy, ghế, tải", { placeholder: "title" });
  tbl(s, [
    ["TC", "Input (gửi đồng thời)", "Kết quả mong đợi", "Invariant"],
    ["TC-11", "6 người đặt 6 giờ sát nhau, buffer 30 phút", "Tối đa 3 booking, cách nhau ≥ 30 phút", "I8"],
    ["TC-12", "6 người đặt 6 giờ, giới hạn 30 phút/ngày", "Chỉ 1 người thành công", "I9"],
    ["TC-13", "6 người đặt 6 ngày trong tuần, giới hạn 1/tuần", "Chỉ 1 người thành công", "I6"],
    ["TC-14", "1 người (cùng email) đặt 6 giờ, giới hạn 1 booking/người", "Chỉ 1 booking thành công", "I10"],
    ["TC-15", "6 lệnh hủy cùng một booking", "Đúng 1 lệnh 200, 5 lệnh bị từ chối", "I5"],
    ["TC-16", "1 email đặt 6 lần vào event 3 ghế đã có 1 người", "Email đó chiếm đúng 1 ghế", "I11"],
    ["TC-17", "5 người đặt event 30 phút + 5 người đặt event 60 phút, đều 09:00", "Chỉ 1 booking hiệu lực", "I1"],
    ["TC-18", "Tải cao: 30 người đặt cùng một giờ", "1 người 200, 29 người 409, không 5xx", "I1, I7"],
    ["TC-19", "20 người đặt 20 giờ liền kề, không chồng nhau", "Cả 20 người thành công", "I12"],
    ["TC-20", "1 lệnh hủy + 1 người đặt mới đúng giờ vừa hủy", "Không có 2 booking hiệu lực cùng giờ", "I1"],
  ], { y: 1.75, colW: [1.0, 5.6, 3.9, W - 10.5], fontSize: 13, rowH: 0.39 });
  s.addText("TC-09, 10, 18, 19, 20 là test case đối chứng: cơ chế đang bảo vệ tốt, dùng để chứng minh bộ test không báo lỗi giả. TC-11 đến TC-17 là các chỗ nhóm nghi có lỗi sau khi đọc mã.", { x: M, y: 6.4, w: W, h: 0.5, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Đặc tả đầy đủ: báo cáo mục 3.3.6 · mã: race-tests/src/scenarios.mjs");
  s.addNotes("Mười hai test case bổ sung đi vào những tính năng mà thầy nhắc là khó thấy: các loại giới hạn đặt lịch (ngày, tuần, thời lượng, số booking của mỗi người), thời gian đệm, hủy nhiều lần, một người chiếm nhiều ghế, hai loại cuộc hẹn cùng giờ bắt đầu, và hai kiểm tra độ ổn định là tải 30 người và 20 giờ độc lập. Năm test case TC-09, 10, 18, 19, 20 cuối cùng đều đạt, nên cho thấy bộ test không báo lỗi giả.");
}

// 6 · Kế hoạch kỹ thuật
{
  const s = add("DARK", "Kế hoạch kiểm thử");
  eyebrow(s, "08 · KẾ HOẠCH ÁP DỤNG K15", true);
  s.addText("Phạm vi, giả định và tiêu chí đánh giá", { placeholder: "title" });
  const cw = (W - 0.7) / 3;
  const cols = [
    ["PHẠM VI", ORANGE, ["Đặt lịch 1-1 và event có ghế", "Event cần xác nhận (PENDING)", "Đổi lịch, hủy lịch", "Giới hạn: ngày, tuần, thời lượng, người đặt; thời gian đệm", "Ngoài phạm vi: lịch ngoài, thanh toán, team, API v2"]],
    ["GIẢ ĐỊNH", SKY, ["Một instance, một PostgreSQL, chạy local", "Chạy yarn dev; production có thể rộng cửa sổ hơn", "Host không nối lịch ngoài", "Rate limit tắt", "Mỗi vòng dùng một ngày riêng"]],
    ["TIÊU CHÍ PASS / FAIL", ORANGE, ["Oracle là invariant trong CSDL, không phải mã HTTP", "I1: host không có 2 booking chồng giờ", "I2, I11: không vượt số ghế, một người một ghế", "I4–I6, I8–I10: đổi lịch, hủy, giới hạn, đệm", "FAIL khi 1 vòng vi phạm; so với nhóm đối chứng tuần tự"]],
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
  eyebrow(s, "09 · CHI PHÍ TEST");
  s.addText("Chi phí đo thật: 0 đồng, khoảng 33 phút máy", { placeholder: "title" });
  const stats = [["0 đồng", "Công cụ miễn phí, chạy trên máy cá nhân"], ["8 940", "Request đã gửi trong mọi lần chạy"], ["≈ 8 phút", "Chạy lại 20 test case, cả hai chế độ"], ["≈ 1 600", "Dòng mã bộ test (Node.js, k6, SQL, bash)"]];
  const cw = (W - 3 * 0.3) / 4;
  stats.forEach(([n, l], i) => {
    const x = M + i * (cw + 0.3);
    card(s, x, 1.85, cw, 1.7);
    s.addText(n, { x: x + 0.2, y: 1.95, w: cw - 0.4, h: 0.8, fontFace: BODY, fontSize: 32, bold: true, color: BLUE, margin: 0, valign: "middle", isTextBox: true });
    s.addText(l, { x: x + 0.2, y: 2.8, w: cw - 0.4, h: 0.7, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  tbl(s, [
    ["Lần chạy", "Request", "Thời gian máy"],
    ["Đợt 1: 8 test case, đồng thời + tuần tự", "1 140", "177 giây"],
    ["Đợt 2: 20 test case, đồng thời (chính thức)", "1 590", "383 giây"],
    ["Đợt 2: 20 test case, tuần tự (đối chứng)", "1 590", "76 giây"],
    ["Đợt 2 trên máy Windows (đồng thời + tuần tự)", "3 180", "561 giây"],
    ["Thí nghiệm phụ: độ nhạy 2 request, khắc phục, cửa sổ race", "1 440", "755 giây"],
  ], { y: 3.85, colW: [7.2, 2.2, W - 9.4], fontSize: 14, rowH: 0.42 });
  s.addText("Công sức nhóm: ước lượng 34–46 người-giờ (chưa theo dõi giờ thực tế, chưa gồm đợt mở rộng lên 20 test case). Máy: MacBook Apple Silicon 10 nhân, 32 GB RAM.", { x: M, y: 6.5, w: W, h: 0.4, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, isTextBox: true });
  footer(s, "Số liệu lấy từ summary.json của từng lần chạy: báo cáo bảng 'Chi phí chạy kiểm thử đo được' · docs/QUY_TRINH_TEST.md mục 3");
  s.addNotes("Số liệu chi phí máy đo thật từ thời điểm bắt đầu và kết thúc trong file summary.json của mỗi lần chạy. Chạy lại bộ test chính 20 test case, cả đồng thời và tuần tự, mất khoảng tám phút. Tổng cộng mọi lần chạy, cả hai máy, khoảng 33 phút và 8 940 request. Công sức nhân lực là ước lượng 34 đến 46 người-giờ, nhóm chưa theo dõi giờ thực tế từng người và ước lượng này chưa gồm đợt mở rộng.");
}

// Kết quả test
{
  const s = add("LIGHT", "Kết quả");
  eyebrow(s, "10 · KẾT QUẢ TEST");
  s.addText("13 trên 20 test case phát hiện lỗi", { placeholder: "title" });
  s.addImage({ path: path.resolve(__dirname, "..", "docs", "figures", "hinh-ket-qua-20.png"), x: M, y: 1.7, w: 8.3, h: 8.3 * 850 / 1850 });
  const stats = [["13 / 20", "test case phát hiện lỗi: 12 lỗi race, 1 lỗi logic (TC-06)"], ["7 / 20", "đạt ở cả hai chế độ: bộ test không báo lỗi giả"], ["19 / 20", "đạt khi chạy tuần tự: kiểm thử thường không thấy lỗi"]];
  stats.forEach(([n, l], i) => {
    const y = 1.7 + i * 1.3;
    card(s, 9.3, y, W - 8.6, 1.15);
    s.addText(n, { x: 9.5, y: y + 0.05, w: 1.9, h: 1.05, fontFace: BODY, fontSize: 28, bold: true, color: i === 0 ? RUST : BLUE, margin: 0, valign: "middle", isTextBox: true });
    s.addText(l, { x: 11.35, y: y + 0.05, w: W - 10.75 + 0.05, h: 1.05, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("Cột là số vòng vi phạm trên 10 vòng. TC-02: mã HTTP của cả 10 request đều là 200 nhưng CSDL có 10 booking chồng giờ. TC-15: một booking bị hủy 6 lần, Cal.com gửi 12 email thay vì 2. Chỉ cần 2 request đồng thời, 7 test case mới vẫn vi phạm 10/10 vòng.", { x: M, y: 5.75, w: W, h: 1.0, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Lượt chạy chính thức 20/10/2026 · docs/KET_QUA_TEST_GIUA_KY.md · race-tests/results/giua-ky-20-race và giua-ky-20-sequential");
  s.addNotes("Kết quả thật của lượt chạy chính thức: 20 test case, mỗi test case 10 vòng ở hai chế độ đồng thời và tuần tự, tổng 3 180 request. Mười ba test case phát hiện lỗi: mười hai lỗi race chỉ sai khi đồng thời, một lỗi logic TC-06 sai cả khi tuần tự. Bảy test case đạt ở cả hai chế độ, cho thấy các cơ chế bảo vệ hiện có hoạt động và bộ test không báo lỗi giả. Điểm quan trọng: khi chạy tuần tự thì mười chín trên hai mươi test case đạt, nghĩa là kiểm thử chức năng thông thường sẽ kết luận hệ thống đúng; lỗi chỉ lộ ra khi gửi đồng thời và đối chiếu cơ sở dữ liệu.");
}

// Chạy lại trên máy thứ hai
{
  const s = add("LIGHT");
  eyebrow(s, "11 · CHẠY LẠI TRÊN MÁY THỨ HAI");
  s.addText("Máy Windows: cả 20 test case khớp 20/20", { placeholder: "title" });
  tbl(s, [
    ["Test case", "Mac: đồng thời", "Windows: đồng thời", "Windows: tuần tự", "Khớp"],
    ["TC-01, 04, 09, 10, 18, 19, 20", "0/10", "0/10", "0/10", "Có"],
    ["TC-02, 03, 05, 08, 11–17", "10/10", "10/10", "0/10", "Có"],
    ["TC-06", "10/10", "10/10", "10/10", "Có"],
    ["TC-07", "10/10", "9/10", "0/10", "Có (lệch 1 vòng)"],
  ], { y: 1.75, colW: [4.2, 2.1, 2.4, 2.3, W - 11.0], fontSize: 14, rowH: 0.45 });
  const cw = (W - 0.7) / 3;
  [["Thời gian", "20 test case: đồng thời 448 giây (Mac 383 giây); tuần tự 113 giây (Mac 76 giây)."], ["Hai lượt đầu bị loại", "Thiếu k6 và Cal.com dừng giữa chừng. Chỉ dùng lượt chạy sạch."], ["Máy Windows", "Người test: Ngô Quốc Trường Vĩ. Máy MSI, Core i7-13620H, RAM 16 GB. TC-07 lệch 1 vòng (9/10): bình thường với 2 request."]].forEach(([h, b], i) => {
    const x = M + i * (cw + 0.35);
    card(s, x, 4.4, cw, 2.0);
    s.addText(h, { x: x + 0.3, y: 4.6, w: cw - 0.6, h: 0.5, fontFace: BODY, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true });
    s.addText(b, { x: x + 0.3, y: 5.2, w: cw - 0.6, h: 1.1, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  });
  footer(s, "race-tests/results/windows-20-race · race-tests/results/windows-20-sequential");
  s.addNotes("Bạn Vĩ chạy lại bộ test trên máy Windows với cùng phiên bản mã. Ngày 18/10 là tám test case đầu, khớp tám trên tám. Ngày 21/10 chạy đủ hai mươi test case: kết luận khớp hai mươi trên hai mươi với máy Mac. Chỗ khác duy nhất là TC-07 vi phạm chín trên mười vòng thay vì mười: ở vòng một, yêu cầu đổi lịch đến trước nên lệnh hủy bị từ chối, dữ liệu nhất quán, không phải lỗi. Điều này bình thường với bài toán chỉ có hai yêu cầu. Máy Windows chậm hơn: bốn trăm bốn mươi tám giây so với ba trăm tám mươi ba giây. Hai lượt chạy đầu trên máy Windows lần trước bị loại vì thiếu k6 và Cal.com dừng giữa chừng; nhóm chỉ dùng lượt chạy sạch.");
}

// Chứng minh tính khả thi
{
  const s = add("LIGHT");
  eyebrow(s, "12 · CHỨNG MINH TEST CASE KHẢ THI");
  s.addText("Bảy bằng chứng test case chạy được và đúng", { placeholder: "title" });
  tbl(s, [
    ["Tiêu chí", "Bằng chứng đã thực hiện"],
    ["1. Chạy được, đo được", "20/20 test case chạy tự động, 3 180 request, mỗi vòng kiểm dữ liệu trong CSDL"],
    ["2. Không báo lỗi giả", "7 test case đạt ở cả hai chế độ; khi tuần tự, cơ chế bảo vệ từ chối đúng bằng mã lỗi riêng"],
    ["3. Lặp lại được", "13 test case vi phạm 10/10 vòng, vẫn 10/10 khi chỉ 2 request đồng thời"],
    ["4. Công cụ khác cho cùng kết quả", "curl thuần tái hiện cả 11 lỗi; D7–D11 chạy 2 lần liên tiếp, giống hệt"],
    ["5. Sửa lỗi thì test đạt", "Chỉ mục duy nhất theo người tham dự: TC-16 từ FAIL 10/10 sang PASS 10/10; ràng buộc loại trừ: TC-02, 05, 17 hết chồng giờ"],
    ["6. Chi phí chấp nhận được", "20 test case, 10 vòng, hai chế độ: ≈ 8 phút máy, 0 đồng"],
    ["7. Nhiều máy", "Cả 20 test case khớp 20/20 giữa macOS và Windows (TC-07 lệch 1 vòng, 9/10)"],
  ], { y: 1.75, colW: [3.5, W - 3.5], fontSize: 14, rowH: 0.56 });
  s.addText("Nếu bỏ một test case thì mất một lỗi mà kiểm thử tuần tự không thấy, hoặc mất một mốc đối chứng: bảng 'Vai trò của từng test case' trong báo cáo mục 4.4.4.", { x: M, y: 6.35, w: W, h: 0.5, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Báo cáo mục 4.4.4 · docs/DANH_GIA_RUI_RO.md · results/fix-unique-attendee, fix-exclusion-20, sensitivity-n2-new");
  s.addNotes("Đây là phần chứng minh tính khả thi của test case. Một: tất cả chạy tự động. Hai: bảy test case đạt ở cả hai chế độ và khi chạy tuần tự các cơ chế bảo vệ từ chối bằng mã lỗi riêng như duration_limit_reached hay booker_limit_exceeded_error, nghĩa là test case thật sự kiểm tra chứ không đạt rỗng. Ba: lặp lại mười trên mười vòng và vẫn như vậy khi chỉ có hai request. Bốn: curl thuần cho cùng kết quả. Năm là bằng chứng mạnh nhất: khi nhóm thêm chỉ mục duy nhất theo người tham dự trên cơ sở dữ liệu test thì TC-16 chuyển từ không đạt sang đạt, tức test case đúng là phát hiện lỗi đó. Với ràng buộc loại trừ thì dữ liệu hết chồng giờ nhưng người thua nhận lỗi 500, nên sửa phải làm ở cả hai tầng. Bảy: hai máy khớp hai mươi trên hai mươi test case; TC-07 lệch một vòng vì chỉ có hai request nên thứ tự đến thay đổi.");
}

// 4 · Lỗi thật
{
  const s = add("LIGHT");
  eyebrow(s, "13 · LỖI THẬT, TÁI HIỆN ĐỘC LẬP");
  s.addText("11 lỗi, đều tái hiện được bằng curl thuần", { placeholder: "title" });
  tbl(s, [
    ["Lỗi", "Tái hiện bằng curl (không dùng harness)", "Dữ liệu trong CSDL"],
    ["D1", "2 khách đặt 2 giờ chồng nhau cùng lúc: cả hai 200", "2 booking accepted chồng giờ"],
    ["D2", "6 người đặt event 3 ghế: 1×200, 5×409", "Chỉ bán 1/3 ghế dù còn ghế"],
    ["D3", "10 người đặt event cần xác nhận: 8×200", "8 booking chờ xác nhận cùng giờ"],
    ["D4", "Đổi lịch một booking gốc 3 lần liên tiếp: 3×200", "3 booking accepted từ một gốc (cả khi tuần tự)"],
    ["D5", "Hủy và đổi lịch cùng lúc: cả hai 200", "Booking 09:00 đã hủy nhưng còn booking 11:00"],
    ["D6", "8 người đặt 8 giờ, giới hạn 1/ngày: 8×200", "8 booking hiệu lực trong một ngày"],
    ["D7", "6 người đặt 6 giờ sát nhau, buffer 30 phút: 6×200", "6 booking cách nhau 0 phút"],
    ["D8", "6 người đặt 6 giờ, giới hạn 30 phút/ngày: 6×200", "Tổng 180 phút trong ngày"],
    ["D9", "1 người đặt 6 giờ, giới hạn 1 booking/người: 6×200", "6 booking hiệu lực của cùng một email"],
    ["D10", "Hủy 1 booking 6 lần cùng lúc: 6×200", "12 email hủy được gửi (kỳ vọng 2)"],
    ["D11", "1 email đặt 6 lần vào event 3 ghế: 2×200, 4×409", "Email đó chiếm 2 ghế"],
  ], { y: 1.7, colW: [0.8, 6.2, W - 7.0], fontSize: 13, rowH: 0.36 });
  s.addText("Đối chứng: gửi tuần tự thì cơ chế bảo vệ từ chối đúng (trừ D4). Nhóm chưa báo lỗi cho Cal.com và chưa sửa mã Cal.com.", { x: M, y: 6.45, w: W, h: 0.55, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "race-tests/repro/repro-curl.sh, repro-curl-2.sh · docs/evidence/repro-curl*.txt · docs/MINH_CHUNG_LOI.md");
  s.addNotes("Để chứng minh đây là lỗi thật, nhóm tái hiện lại từng lỗi bằng lệnh curl thuần, không dùng bộ test, rồi xem trực tiếp dữ liệu trong cơ sở dữ liệu. Năm lỗi đầu D1 đến D6 đã có từ đợt một, năm lỗi D7 đến D11 là phát hiện của đợt mở rộng. D4 là lỗi logic xảy ra cả khi gửi tuần tự; mười lỗi còn lại chỉ xảy ra khi đồng thời. D10 đáng chú ý: mọi lệnh hủy đều thành công nên nhìn bề ngoài không có gì sai, chỉ khi đếm email mới thấy 12 thay vì 2. Nhóm chưa báo lỗi cho nhóm phát triển Cal.com và chưa sửa mã Cal.com, nên nói là lỗi theo tính chất dữ liệu bất biến, chưa phải được nhóm phát triển xác nhận.");
}

// Lỗi khó tìm và rủi ro
{
  const s = add("LIGHT");
  eyebrow(s, "14 · LỖI KHÓ TÌM VÀ ĐÁNH GIÁ RỦI RO");
  s.addText("Vì sao khó tìm, và lỗi nào nguy hiểm nhất", { placeholder: "title" });
  s.addImage({ path: path.resolve(__dirname, "..", "docs", "figures", "hinh-ma-tran-rui-ro.png"), x: M, y: 1.65, w: 4.9, h: 4.9 * 960 / 1300 });
  s.addText("Rủi ro = khả năng × ảnh hưởng (thang 1–5). Đỏ: nghiêm trọng (D1: 25, D6: 20).", { x: M, y: 5.35, w: 4.9, h: 0.7, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  const cx = M + 5.3, cw2 = W - 5.3;
  card(s, cx, 1.65, cw2, 2.35);
  s.addText("VÌ SAO KHÓ PHÁT HIỆN", { x: cx + 0.25, y: 1.75, w: cw2 - 0.5, h: 0.35, fontFace: MONO, fontSize: 13, bold: true, color: BLUE, margin: 0, isTextBox: true });
  s.addText([
    { text: "Cửa sổ chỉ 30–60 ms: thử tay gần như không gặp", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Mọi request trả 200, giao diện báo thành công", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Chạy tuần tự thì đúng: 19/20 test case đạt", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Chỉ lộ ra khi đối chiếu CSDL hoặc đếm tác dụng phụ", options: { bullet: true } },
  ], { x: cx + 0.25, y: 2.15, w: cw2 - 0.5, h: 1.75, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  card(s, cx, 4.15, cw2, 2.4);
  s.addText("MẤU CHỐT: NẾU KHÔNG KIỂM TRA THÌ SAO", { x: cx + 0.25, y: 4.25, w: cw2 - 0.5, h: 0.35, fontFace: MONO, fontSize: 13, bold: true, color: RUST, margin: 0, isTextBox: true });
  s.addText([
    { text: "Không có lỗi nào làm sập hệ thống (30 request: không 5xx)", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Nguy hiểm hơn: dữ liệu sai âm thầm, hai khách cùng đến một giờ", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "D10: 1 lần hủy gửi 12 email; D11: 1 người chiếm 2/3 ghế", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Sửa thiếu cũng nguy hiểm: ràng buộc CSDL mà không ánh xạ lỗi thì thua nhận 500", options: { bullet: true } },
  ], { x: cx + 0.25, y: 4.65, w: cw2 - 0.5, h: 1.85, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Báo cáo mục 3.4.3, 4.5.5, 4.5.6 · docs/DANH_GIA_RUI_RO.md");
  s.addNotes("Phần này trả lời hai yêu cầu của thầy: tìm ra lỗi quan trọng mà khó thấy, và đánh giá rủi ro. Khó thấy vì bốn lý do trên slide. Nổi bật là D10 và D11: D10 mọi lệnh hủy đều thành công, chỉ khi đếm email gửi đi mới thấy mỗi lệnh chạy lại toàn bộ tác dụng phụ; D11 nằm đúng trong cơ chế chống đăng ký trùng mà Cal.com đã viết, và cơ chế đó chạy tốt khi test tuần tự. Về rủi ro, nhóm chấm điểm bằng khả năng nhân ảnh hưởng. D1, tức chủ lịch bị đặt trùng giờ, và D6, tức vượt giới hạn đặt lịch, ở mức nghiêm trọng. Điểm mấu chốt: không có lỗi nào làm hệ thống sập, mà dữ liệu sai một cách âm thầm. Điểm khả năng là đánh giá dựa trên số liệu đã đo (tái hiện 10 trên 10 vòng, chỉ cần 2 request), điểm ảnh hưởng là đánh giá của nhóm.");
}

// Nhiệm vụ và đóng góp
{
  const s = add("LIGHT");
  eyebrow(s, "15 · NHIỆM VỤ VÀ ĐÓNG GÓP");
  s.addText("Nhiệm vụ và đóng góp của từng thành viên", { placeholder: "title" });
  tbl(s, [
    ["Thành viên", "Vai trò", "Nhiệm vụ đã thực hiện", "Sản phẩm"],
    ["Nguyễn Thanh Tâm · 2312741", "Môi trường, DevOps", "Dựng Cal.com, CSDL, seed data; ghim phiên bản; chạy test trên macOS", "README, kết quả chạy chính thức"],
    ["Võ Công Vinh · 2312800", "Phân tích hệ thống", "Đọc mã, vẽ kiến trúc, luồng dữ liệu; phân tích nguyên nhân gốc", "Sơ đồ, DEFECTS.md, thí nghiệm khắc phục"],
    ["Nguyễn Đức Tín · 2312774", "Tác giả test", "Thiết kế invariant và test case; viết bộ test (k6, Node.js, SQL)", "race-tests/, đặc tả test case"],
    ["Ngô Quốc Trường Vĩ · 2312796", "Chạy test, báo cáo", "Chạy test, ghi kết quả; chạy lại trên Windows; báo cáo, slide", "windows-race, báo cáo, slide"],
  ], { y: 1.85, colW: [3.1, 2.1, 4.6, W - 9.8], fontSize: 14, rowH: 0.75 });
  s.addText("Quản lý công việc: bảng GitHub Projects (18 thẻ, 3 cột), mã nguồn trên GitHub. Việc gán người cho từng thẻ và commit đều các thành viên sẽ hoàn thiện trước buổi bảo vệ.", { x: M, y: 5.9, w: W, h: 0.8, fontFace: BODY, fontSize: 15, color: MUTED, margin: 0, valign: "top", isTextBox: true });
  footer(s, "Chi tiết: báo cáo mục 4.6 · github.com/users/2312741-sudo/projects/1");
  s.addNotes("Mỗi thành viên có vai trò và nhiệm vụ riêng, theo phân công của nhóm. Công việc được theo dõi trên bảng GitHub Projects; việc gán người cho từng thẻ và lịch sử commit đều các thành viên sẽ được hoàn thiện trước buổi bảo vệ.");
}

// 8 · Kế hoạch tiếp theo
{
  const s = add("DARK", "Tiếp theo");
  eyebrow(s, "16 · KẾ HOẠCH TIẾP THEO", true);
  s.addText("Từ giữa kỳ đến bảo vệ", { placeholder: "title" });
  const rows = [
    ["21/10 – 3/11", "Thêm scenario Playwright qua giao diện, hoàn thiện báo cáo", ORANGE],
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
