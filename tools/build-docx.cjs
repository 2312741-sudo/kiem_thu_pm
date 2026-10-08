// Sinh docs/BAO_CAO_R05-K15.docx từ docs/BAO_CAO.md + docs/DEFECTS.md.
// Chạy: NODE_PATH=<nơi cài docx> node tools/build-docx.cjs
const fs = require("fs");
const path = require("path");
const {
  AlignmentType, BorderStyle, Document, Footer, HeadingLevel, LevelFormat, Packer, PageNumber,
  Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType, PageBreak,
} = require("docx");

const root = path.resolve(__dirname, "..");
const FONT = "Calibri";
const CONTENT_W = 9026; // A4, lề 1"

function inline(text, base = {}) {
  text = text.replace(/_\(([^)]*)\)_/g, "($1)");
  const runs = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) runs.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    const tok = m[0];
    if (tok.startsWith("**")) runs.push(new TextRun({ text: tok.slice(2, -2), bold: true, ...base }));
    else if (tok.startsWith("`")) runs.push(new TextRun({ text: tok.slice(1, -1), font: "Consolas", size: 20, shading: { type: ShadingType.CLEAR, fill: "F0F0F0" }, ...base }));
    else runs.push(new TextRun({ text: tok.match(/\[([^\]]+)\]/)[1], ...base }));
    last = m.index + tok.length;
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last), ...base }));
  return runs;
}

const border = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
const borders = { top: border, bottom: border, left: border, right: border };

function makeTable(rows) {
  const cells = rows.map((r) => r.map((c) => c.trim()));
  const cols = cells[0].length;
  const weights = Array.from({ length: cols }, (_, i) =>
    Math.min(40, Math.max(8, ...cells.map((r) => (r[i] ?? "").replace(/[*`]/g, "").length)))
  );
  const total = weights.reduce((a, b) => a + b, 0);
  let widths = weights.map((w) => Math.floor((w / total) * CONTENT_W));
  widths[cols - 1] += CONTENT_W - widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: cells.map((r, ri) =>
      new TableRow({
        tableHeader: ri === 0,
        children: r.map((c, ci) =>
          new TableCell({
            borders,
            width: { size: widths[ci], type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            shading: ri === 0 ? { type: ShadingType.CLEAR, fill: "DCE6F1" } : undefined,
            children: [new Paragraph({ children: inline(c, { size: 20, bold: ri === 0 ? true : undefined }) })],
          })
        ),
      })
    ),
    margins: { top: 0, bottom: 0 },
  });
}

const numberingConfigs = [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }];
let numCounter = 0;

function convert(md, { demoteHeadings = 0 } = {}) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      for (const c of code) {
        out.push(new Paragraph({
          shading: { type: ShadingType.CLEAR, fill: "F3F3F3" },
          spacing: { after: 0, line: 260 },
          indent: { left: 200 },
          children: [new TextRun({ text: c === "" ? " " : c, font: "Consolas", size: 18 })],
        }));
      }
      out.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      continue;
    }
    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        if (!/^\|[\s:|-]+\|$/.test(lines[i])) rows.push(lines[i].trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/));
        i++;
      }
      out.push(makeTable(rows));
      out.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
      continue;
    }
    const h = line.match(/^(#{1,4}) (.*)/);
    if (h) {
      const level = Math.min(4, h[1].length + demoteHeadings);
      const hl = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4][level - 1];
      out.push(new Paragraph({ heading: hl, children: [new TextRun({ text: h[2].replace(/\*\*/g, "") })] }));
      i++;
      continue;
    }
    if (/^---+$/.test(line.trim())) { i++; continue; }
    if (/^\s*[-*] /.test(line)) {
      const indent = line.match(/^\s*/)[0].length >= 2 ? 1 : 0;
      out.push(new Paragraph({ numbering: { reference: "bullets", level: 0 }, indent: indent ? { left: 1080, hanging: 360 } : undefined, spacing: { after: 60 }, children: inline(line.replace(/^\s*[-*] /, "")) }));
      i++;
      continue;
    }
    if (/^\s*\d+\. /.test(line)) {
      const ref = `num${numCounter++}`;
      numberingConfigs.push({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] });
      while (i < lines.length && /^\s*\d+\. /.test(lines[i])) {
        out.push(new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: inline(lines[i].replace(/^\s*\d+\. /, "")) }));
        i++;
        while (i < lines.length && /^\s{3,}\S/.test(lines[i]) && !/^\s*\d+\. /.test(lines[i])) {
          const sub = lines[i].trim();
          if (/^[-*] /.test(sub)) out.push(new Paragraph({ numbering: { reference: "bullets", level: 0 }, indent: { left: 1080, hanging: 360 }, spacing: { after: 40 }, children: inline(sub.replace(/^[-*] /, "")) }));
          else if (/^\d+\. /.test(sub)) out.push(new Paragraph({ indent: { left: 1080 }, spacing: { after: 40 }, children: inline(sub) }));
          i++;
        }
      }
      continue;
    }
    if (/^>/.test(line)) { out.push(new Paragraph({ indent: { left: 360 }, spacing: { after: 120 }, children: inline(line.replace(/^>\s?/, ""), { italics: true }) })); i++; continue; }
    if (line.trim() === "") { i++; continue; }
    const para = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#|```|\||\s*[-*] |\s*\d+\. |>|---)/.test(lines[i])) para.push(lines[i++]);
    out.push(new Paragraph({ spacing: { after: 120, line: 300 }, children: inline(para.join(" ")) }));
  }
  return out;
}

const report = fs.readFileSync(path.join(root, "docs/BAO_CAO.md"), "utf8");
const defects = fs.readFileSync(path.join(root, "docs/DEFECTS.md"), "utf8");

// Phần đầu báo cáo (tiêu đề + bảng thành viên) được dựng riêng thành trang bìa.
const afterTitle = report.slice(report.indexOf("## Tóm tắt"));
const body = convert(afterTitle);
const members = convert(report.slice(report.indexOf("| Thành viên"), report.indexOf("\n---\n")));

const cover = [
  new Paragraph({ spacing: { before: 1800 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TRƯỜNG ĐẠI HỌC ĐÀ LẠT", bold: true, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "KHOA CÔNG NGHỆ THÔNG TIN", bold: true, size: 28 })] }),
  new Paragraph({ spacing: { before: 1200, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "BÁO CÁO ĐỀ TÀI CUỐI KỲ", size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "MÔN KIỂM THỬ PHẦN MỀM", size: 28 })] }),
  new Paragraph({ spacing: { before: 600, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Đề tài R05-K15", bold: true, size: 40, color: "1F3864" })] }),
  new Paragraph({ spacing: { after: 800 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Kiểm thử Concurrency / Race Condition cho hệ thống đặt lịch Cal.com", bold: true, size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 120 }, children: [new TextRun({ text: "Giảng viên: Nguyễn Thế Lâm", size: 24 })] }),
  new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Phiên bản kiểm thử: Cal.com v6.2.0 (commit 1c193cca8682b33b9866c792186033f7ef886682)", size: 24 })] }),
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "Mã nguồn: https://github.com/2312741-sudo/kiem_thu_pm", size: 24 })] }),
  ...members,
  new Paragraph({ children: [new PageBreak()] }),
];

const appendix = [
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Phụ lục A. Danh sách lỗi và phân tích nguyên nhân gốc")] }),
  ...convert(defects.slice(defects.indexOf("Hệ thống: Cal.com")), { demoteHeadings: 0 }),
];

const doc = new Document({
  creator: "Nhóm R05-K15",
  title: "Báo cáo R05-K15 – Kiểm thử Race Condition cho Cal.com",
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, font: FONT, color: "1F3864" }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, font: FONT, color: "2F5496" }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, font: FONT, color: "2F5496" }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
      { id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 22, bold: true, italics: true, font: FONT }, paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 3 } },
    ],
  },
  numbering: { config: numberingConfigs },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "R05-K15 · Cal.com race testing · trang ", size: 18, color: "7F7F7F" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "7F7F7F" })] })] }) },
    children: [...cover, ...body, ...appendix],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(root, "docs", "BAO_CAO_R05-K15.docx");
  fs.writeFileSync(out, buf);
  console.log("wrote", out, buf.length);
});
