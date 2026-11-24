// Sinh docs/cuoi-ky/PHAN_CHIA_CONG_VIEC_VA_PEER_REVIEW.docx: bản phân chia công việc, đóng góp và mẫu đánh giá chéo.
// Không điền sẵn điểm đánh giá hay giờ làm: những mục đó do từng thành viên tự ghi.
// Chạy: NODE_PATH=<nơi cài docx> node tools/build-docx-phan-chia.cjs
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { AlignmentType, BorderStyle, Document, Packer, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType, PageBreak } = require("docx");

const root = path.resolve(__dirname, "..");
const FONT = "Times New Roman";
const TEXT_W = 11906 - 1985 - 1134;
const run = (t, o = {}) => new TextRun({ text: t, font: FONT, size: 26, ...o });
const P = (t, o = {}) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 }, ...o, children: Array.isArray(t) ? t : [run(t)] });
const B = (t) => new Paragraph({ indent: { left: 540, hanging: 270 }, spacing: { after: 60 }, alignment: AlignmentType.JUSTIFIED, children: [run("-\t" + t)] });
const H = (t) => new Paragraph({ spacing: { before: 240, after: 120 }, keepNext: true, children: [run(t, { bold: true, size: 28 })] });
const center = (t, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: o.after ?? 80 }, children: [run(t, { bold: o.bold, size: o.size ?? 26 })] });
const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };
function table(rows, widths, { size = 22, minH } = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const ws = widths.map((w) => Math.floor((w / total) * TEXT_W));
  ws[ws.length - 1] += TEXT_W - ws.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: TEXT_W, type: WidthType.DXA },
    columnWidths: ws,
    rows: rows.map((r, ri) => new TableRow({
      cantSplit: true,
      height: ri > 0 && minH ? { value: minH, rule: "atLeast" } : undefined,
      children: r.map((c, ci) => new TableCell({
        borders, width: { size: ws[ci], type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
        margins: { top: 50, bottom: 50, left: 90, right: 90 },
        shading: ri === 0 ? { type: ShadingType.CLEAR, fill: "D9D9D9" } : undefined,
        children: String(c).split("\n").map((l) => new Paragraph({ spacing: { after: 0, line: 252 }, children: [run(l, { size, bold: ri === 0 })] })),
      })),
    })),
  });
}
const gap = () => new Paragraph({ spacing: { after: 60 }, children: [] });

// ----- dữ liệu thật từ Git
const lines = execSync("git log --format=%an%x09%ad --date=short", { cwd: root, encoding: "utf8" }).trim().split("\n");
const by = new Map();
for (const l of lines) {
  const [a, d] = l.split("\t");
  const e = by.get(a) ?? { n: 0, first: d, last: d };
  e.n += 1; if (d < e.first) e.first = d; if (d > e.last) e.last = d;
  by.set(a, e);
}
const gitRows = [["Tài khoản Git", "Số commit", "Tỉ lệ", "Commit đầu", "Commit cuối"]];
for (const [a, e] of [...by.entries()].sort((x, y) => y[1].n - x[1].n)) gitRows.push([a, String(e.n), `${Math.round((100 * e.n) / lines.length)}%`, e.first, e.last]);
const sha = execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf8" }).trim();

const members = [
  ["Nguyễn Thanh Tâm", "2312741"], ["Võ Công Vinh", "2312800"], ["Nguyễn Đức Tín", "2312774"], ["Ngô Quốc Trường Vĩ", "2312796"],
];

const c = [];
c.push(center("TRƯỜNG ĐẠI HỌC ĐÀ LẠT · KHOA CÔNG NGHỆ THÔNG TIN", { bold: true }));
c.push(center("MÔN KIỂM THỬ PHẦN MỀM · GIẢNG VIÊN NGUYỄN THẾ LÂM", { after: 160 }));
c.push(center("BẢN PHÂN CHIA CÔNG VIỆC VÀ ĐÓNG GÓP CỦA TỪNG THÀNH VIÊN", { bold: true, size: 30 }));
c.push(center("(kèm mẫu đánh giá chéo – peer review)", { after: 60 }));
c.push(center("Nhóm 14 · Đề tài R05-K15: kiểm thử race condition cho Cal.com v6.2.0", { bold: true, after: 200 }));

c.push(H("1. Thông tin nhóm"));
c.push(table([["Họ tên", "MSSV", "Vai trò trong nhóm"],
  ["Nguyễn Thanh Tâm", "2312741", "Môi trường và DevOps"],
  ["Võ Công Vinh", "2312800", "Phân tích hệ thống"],
  ["Nguyễn Đức Tín", "2312774", "Tác giả test"],
  ["Ngô Quốc Trường Vĩ", "2312796", "Chạy test và báo cáo"]], [4, 2, 4]));
c.push(gap());
c.push(P("Kho mã nguồn: https://github.com/2312741-sudo/kiem_thu_pm (bản nộp tại commit " + sha + "). Hệ thống được kiểm thử: Cal.com v6.2.0, commit 1c193cca8682b33b9866c792186033f7ef886682. Kỹ thuật: kiểm thử đồng thời (race condition) bằng k6 và kiểm tra dữ liệu trong PostgreSQL."));
c.push(P([run("Lưu ý: ", { bold: true }), run("phân vai dưới đây theo thỏa thuận ban đầu của nhóm. Mỗi thành viên đọc, xác nhận hoặc sửa phần của mình trước khi nộp; chữ ký ở cuối thể hiện sự xác nhận đó.")]));

c.push(H("2. Phân chia công việc và sản phẩm"));
c.push(table([
  ["Thành viên", "Công việc phụ trách", "Sản phẩm (trong kho)", "Phần đề bài"],
  ["Nguyễn Thanh Tâm", "Dựng Cal.com và cơ sở dữ liệu, seed data; ghim phiên bản; chạy bộ test chính thức trên máy macOS", "README.md, docs/evidence/smoke-test.txt, race-tests/results/giua-ky-20-race và giua-ky-20-sequential", "C, H"],
  ["Võ Công Vinh", "Đọc mã, vẽ kiến trúc và luồng dữ liệu; phân tích nguyên nhân gốc D1 đến D11; thí nghiệm khắc phục", "docs/diagrams/kien-truc.md, docs/DEFECTS.md, race-tests/experiments/", "A, B, G (nguyên nhân)"],
  ["Nguyễn Đức Tín", "Thiết kế 12 invariant và 20 test case; viết bộ test (k6, Node.js, SQL)", "race-tests/src, k6/race.js, fixtures/fixtures.sql, repro/", "D, E, F"],
  ["Ngô Quốc Trường Vĩ", "Chạy test trên máy Windows; ghi kết quả; viết báo cáo, slide, hướng dẫn", "race-tests/results/windows-race và windows-20-race, báo cáo, slide, docs/HUONG_DAN_*", "G (kết quả), báo cáo"],
], [2.4, 4.4, 4.6, 1.6], { size: 21 }));
c.push(gap());
c.push(P("Bằng chứng đối chiếu được ngoài Git: kết quả chạy trên máy Windows (ảnh chụp Terminal và REPORT.md) do Ngô Quốc Trường Vĩ thực hiện; bảng công việc GitHub Projects (18 thẻ, chưa gán người phụ trách); các tệp trong kho ghi ở cột sản phẩm."));

c.push(H("3. Lịch sử Git (đo từ git log tại thời điểm lập bản này)"));
c.push(table(gitRows, [4, 1.8, 1.6, 2.6, 2.6], { size: 22 }));
c.push(gap());
c.push(P(`Kho có ${lines.length} commit, ${by.size === 1 ? "tất cả thuộc về một tài khoản" : "thuộc " + by.size + " tài khoản"}. Nhóm ghi nhận rõ điều này: số commit hiện không phản ánh đóng góp của từng người, nên không dùng làm căn cứ đánh giá. Đóng góp của từng thành viên được thể hiện ở mục 2 và ở phần đánh giá chéo bên dưới.`));

c.push(H("4. Thời gian làm việc"));
c.push(P("Nhóm chưa theo dõi giờ làm trong suốt đề tài. Ước lượng chung của cả nhóm là 34 đến 46 giờ (chưa gồm đợt mở rộng lên 20 test case); đây là ước lượng, không phải số đo. Mỗi thành viên tự ghi số giờ thực tế theo trí nhớ vào cột dưới đây."));
c.push(table([["Thành viên", "Giờ tự ghi (tổng)", "Ghi chú"], ...members.map(([n]) => [n, "", ""])], [4, 2.4, 5], { minH: 520 }));

c.push(new Paragraph({ children: [new PageBreak()] }));
c.push(H("5. Đánh giá chéo (peer review)"));
c.push(P("Mỗi thành viên điền một phiếu (mẫu bên dưới, sao ra 4 bản) cho cả ba bạn còn lại và cho chính mình. Điểm theo thang 1 đến 5 (1: rất thấp, 5: rất tốt). Cột “% đóng góp” là phần trăm đóng góp theo đánh giá của người điền, tổng các thành viên bằng 100%."));
c.push(P("Tiêu chí: (a) hoàn thành phần việc được giao; (b) chất lượng sản phẩm; (c) chủ động, đúng hạn; (d) phối hợp với nhóm và hiểu nội dung chung."));
c.push(P([run("Phiếu của: ", { bold: true }), run("……………………………………   MSSV: ……………   Ngày: ……………")]));
c.push(table([
  ["Người được đánh giá", "(a)", "(b)", "(c)", "(d)", "% đóng góp", "Nhận xét ngắn (nêu việc cụ thể)"],
  ...members.map(([n]) => [n, "", "", "", "", "", ""]),
], [3.2, 0.8, 0.8, 0.8, 0.8, 1.4, 4.4], { minH: 640 }));
c.push(gap());
c.push(P("Bảng tổng hợp (người phụ trách điền sau khi thu đủ phiếu; chưa có số liệu tại thời điểm lập bản này):"));
c.push(table([
  ["Thành viên", "Điểm trung bình (a–d)", "% đóng góp trung bình", "Ghi chú"],
  ...members.map(([n]) => [n, "", "", ""]),
], [4, 2.6, 2.6, 3.2], { minH: 520 }));

c.push(H("6. Xác nhận của các thành viên"));
c.push(P("Chúng tôi xác nhận phần phân công ở mục 2 phản ánh đúng công việc mỗi người đã làm (hoặc đã ghi chỉnh sửa bên cạnh)."));
c.push(table([["Thành viên", "Ý kiến chỉnh sửa (nếu có)", "Chữ ký"], ...members.map(([n]) => [n, "", ""])], [3.6, 5.2, 2.4], { minH: 620 }));

const doc = new Document({
  creator: "Nhóm 14 R05-K15", title: "Bản phân chia công việc và đánh giá chéo – R05-K15",
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1985, right: 1134 } } }, children: c }],
});
Packer.toBuffer(doc).then((buf) => {
  const out = path.join(root, "docs", "cuoi-ky", "PHAN_CHIA_CONG_VIEC_VA_PEER_REVIEW.docx");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);
  console.log("wrote", out);
});
