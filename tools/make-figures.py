# Sinh các hình cho báo cáo theo mẫu (docs/figures/*.png) từ kết quả thật trong race-tests/results.
import json, re, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "figures")
RES = os.path.join(ROOT, "race-tests", "results")
os.makedirs(OUT, exist_ok=True)

for path in ("/System/Library/Fonts/Supplemental/Times New Roman.ttf", "/Library/Fonts/Times New Roman.ttf"):
    if os.path.exists(path):
        fm.fontManager.addfont(path)
        plt.rcParams["font.family"] = fm.FontProperties(fname=path).get_name()
        break
plt.rcParams["font.size"] = 13

INK, BLUE, ORANGE, GREEN, GREY = "#12202B", "#2F5496", "#C55A11", "#548235", "#7F7F7F"

def box(ax, x, y, w, h, text, fc="#F2F2F2", ec="#404040", fs=12, bold=False):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.08", fc=fc, ec=ec, lw=1.2, zorder=3))
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=fs, fontweight="bold" if bold else "normal", color=INK, zorder=4)

def arrow(ax, x1, y1, x2, y2, style="-|>", ls="-", color="#404040"):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=style, mutation_scale=14, lw=1.3, ls=ls, color=color))

def save(fig, name):
    fig.savefig(os.path.join(OUT, name), dpi=200, bbox_inches="tight", facecolor="white")
    plt.close(fig)

# --- Hình: kiến trúc hệ thống được kiểm thử ---
fig, ax = plt.subplots(figsize=(10.4, 4.6)); ax.set_xlim(0, 10.4); ax.set_ylim(0, 4.6); ax.axis("off")
box(ax, 0.1, 3.2, 2.1, 0.9, "Khách đặt lịch\n(người dùng ảo k6)", "#FFF2CC")
box(ax, 0.1, 0.5, 2.1, 0.9, "Bộ kiểm thử\nNode.js + k6", "#FFF2CC")
box(ax, 2.7, 1.9, 2.3, 1.3, "apps/web\nPOST /api/book/event\nPOST /api/cancel", "#DDEBF7", fs=11.5)
box(ax, 5.4, 1.9, 2.2, 1.3, "RegularBookingService\ncreateBooking\nhandleSeats", "#DDEBF7", fs=10.5)
box(ax, 8.0, 1.9, 2.0, 1.3, "PostgreSQL 16\nUNIQUE(uid)\nUNIQUE(idempotency\nKey)", "#E2EFDA", fs=10)
arrow(ax, 2.2, 3.5, 2.7, 2.8); arrow(ax, 2.2, 0.95, 2.7, 2.2)
arrow(ax, 5.0, 2.55, 5.4, 2.55); arrow(ax, 7.6, 2.55, 8.0, 2.55)
arrow(ax, 9.0, 1.9, 2.2, 0.8, ls="--", color=ORANGE)
ax.text(5.6, 0.45, "kiểm tra invariant bằng SQL trực tiếp", color=ORANGE, ha="center", fontsize=12, style="italic")
ax.text(5.0, 4.35, "Hệ thống được kiểm thử (Cal.com v6.2.0)", ha="center", fontsize=13, fontweight="bold")
save(fig, "hinh-kien-truc.png")

# --- Hình: quy trình test ---
fig, ax = plt.subplots(figsize=(10, 3.4)); ax.set_xlim(0, 10); ax.set_ylim(0, 3.4); ax.axis("off")
steps = ["1. Đọc code", "2. Chọn\ninvariant", "3. Thiết kế\ntest case", "4. Chuẩn bị\ndữ liệu", "5. Chạy đồng thời\nvà tuần tự", "6. Kiểm trong\nCSDL", "7. Nguyên nhân\ngốc, báo cáo"]
w, gap = 1.22, 0.24
for i, s in enumerate(steps):
    x = 0.1 + i * (w + gap)
    box(ax, x, 1.2, w, 1.2, s, fc="#DDEBF7" if i != 4 else "#FCE4D6", fs=11.5)
    if i < 6: arrow(ax, x + w, 1.8, x + w + gap, 1.8)
ax.text(5.0, 0.55, "Bước 5 chạy cả hai chế độ: đồng thời (k6) và tuần tự (nhóm đối chứng)", ha="center", fontsize=12, style="italic")
save(fig, "hinh-quy-trinh.png")

# --- Hình: khe hở TOCTOU ---
fig, ax = plt.subplots(figsize=(10, 4.6)); ax.set_xlim(0, 10); ax.set_ylim(0, 4.6); ax.axis("off")
ax.text(2.4, 4.3, "Request A (09:00–09:30)", ha="center", fontsize=13, fontweight="bold", color=BLUE)
ax.text(7.4, 4.3, "Request B (09:15–09:45)", ha="center", fontsize=13, fontweight="bold", color=ORANGE)
for x in (2.4, 7.4): ax.plot([x, x], [0.4, 4.1], color=GREY, lw=1, ls=":", zorder=0)
rows = [(3.5, "Đọc lịch host: trống"), (2.5, "INSERT booking\nkey = f(09:00, 09:30)")]
rowsB = [(3.5, "Đọc lịch host: trống"), (2.5, "INSERT booking\nkey = f(09:15, 09:45)")]
for (y, t), (_, tb) in zip(rows, rowsB):
    box(ax, 0.9, y - 0.35, 3.0, 0.7, t, "#DDEBF7"); box(ax, 5.9, y - 0.35, 3.0, 0.7, tb, "#FCE4D6")
box(ax, 0.9, 1.15, 3.0, 0.6, "HTTP 200", "#E2EFDA"); box(ax, 5.9, 1.15, 3.0, 0.6, "HTTP 200", "#E2EFDA")
ax.add_patch(FancyBboxPatch((0.5, 2.1), 8.8, 1.8, boxstyle="round,pad=0.02,rounding_size=0.1", fc="none", ec=ORANGE, lw=1.5, ls="--"))
ax.text(9.3, 3.95, "cửa sổ race", ha="right", fontsize=12, color=ORANGE, style="italic")
ax.text(5.0, 0.55, "Hai khóa khác nhau nên UNIQUE không chặn: host bị đặt chồng giờ", ha="center", fontsize=12.5, fontweight="bold")
save(fig, "hinh-toctou.png")

# --- Hình: cấu trúc thư mục ---
tree = """race-tests/
├── fixtures/fixtures.sql        tạo host k15host và 5 loại cuộc hẹn
├── k6/race.js                   gửi request đồng thời (mỗi VU 1 request)
├── src/
│   ├── config.mjs               địa chỉ Cal.com, chuỗi kết nối CSDL
│   ├── api.mjs                  dựng request đặt, đổi, hủy lịch
│   ├── db.mjs                   truy vấn SQL kiểm invariant
│   ├── scenarios.mjs            8 test case: chuẩn bị và kiểm tra
│   ├── run.mjs                  điều phối: chuẩn bị, k6, kiểm CSDL, ghi kết quả
│   ├── report.mjs               sinh REPORT.md
│   ├── window.mjs               đo độ rộng cửa sổ race
│   ├── smoke.mjs                kiểm tra 3 luồng nghiệp vụ
│   └── demo-midterm.mjs         demo giữa kỳ
├── repro/repro-curl.sh          tái hiện độc lập bằng curl
├── experiments/                 thí nghiệm khắc phục
└── results/                     kết quả các lần chạy"""
fig, ax = plt.subplots(figsize=(10, 5.2)); ax.axis("off")
mono = "/System/Library/Fonts/Supplemental/Courier New.ttf"
fm.fontManager.addfont(mono)
ax.text(0, 1, tree, family=fm.FontProperties(fname=mono).get_name(), fontsize=11.5, va="top", ha="left", linespacing=1.45)
save(fig, "hinh-cau-truc-thu-muc.png")

# --- Hình: kết quả theo test case ---
def load(name): return json.load(open(os.path.join(RES, name, "summary.json")))
def from_report(name):
    d = {}
    for line in open(os.path.join(RES, name, "REPORT.md"), encoding="utf8"):
        m = re.match(r"^\| (S\d) \|.*\| (\d+)/(\d+) \| \d+% \| \*\*(PASS|FAIL)\*\*", line)
        if m: d[m.group(1)] = int(m.group(2))
    return d
mr = {s["id"]: s["failedRounds"] for s in load("giua-ky-race")["scenarios"]}
ms = {s["id"]: s["failedRounds"] for s in load("giua-ky-sequential")["scenarios"]}
wr, ws = from_report("windows-race"), from_report("windows-sequential")
ids = [f"S{i}" for i in range(1, 9)]
fig, ax = plt.subplots(figsize=(10, 4.6))
import numpy as np
x = np.arange(8); bw = 0.2
series = [("Mac, đồng thời", mr, ORANGE), ("Mac, tuần tự", ms, BLUE), ("Windows, đồng thời", wr, "#F4B183"), ("Windows, tuần tự", ws, "#9DC3E6")]
for k, (lab, d, c) in enumerate(series):
    ax.bar(x + (k - 1.5) * bw, [d[i] for i in ids], bw, label=lab, color=c, edgecolor="#404040", lw=0.6)
ax.set_xticks(x); ax.set_xticklabels([f"TC-0{i}" for i in range(1, 9)])
ax.set_ylabel("Số vòng vi phạm (trên 10 vòng)"); ax.set_ylim(0, 13.5); ax.set_yticks(range(0, 11, 2))
ax.legend(ncol=2, fontsize=11, loc="upper center", frameon=False); ax.grid(axis="y", alpha=0.3)
for s_ in ("top", "right"): ax.spines[s_].set_visible(False)
save(fig, "hinh-ket-qua.png")

# --- Hình: cửa sổ race ---
rows = []
for line in open(os.path.join(RES, "window-S2", "WINDOW.md"), encoding="utf8"):
    m = re.match(r"^\| (\d+) \| (\d+)/(\d+) \|", line)
    if m: rows.append((int(m.group(1)), 100 * int(m.group(2)) / int(m.group(3))))
fig, ax = plt.subplots(figsize=(10, 4.2))
ax.bar([str(d) for d, _ in rows], [v for _, v in rows], color=ORANGE, edgecolor="#404040", lw=0.6)
for i, (_, v) in enumerate(rows): ax.text(i, v + 2, f"{v:.0f}%", ha="center", fontsize=11)
ax.set_xlabel("Độ trễ Δ của request thứ hai (ms)"); ax.set_ylabel("Tỉ lệ vòng vi phạm (%)"); ax.set_ylim(0, 115)
ax.grid(axis="y", alpha=0.3)
for s_ in ("top", "right"): ax.spines[s_].set_visible(False)
save(fig, "hinh-cua-so-race.png")

# --- Hình: sơ đồ container của Cal.com ---
fig, ax = plt.subplots(figsize=(10, 5.4)); ax.set_xlim(0, 10); ax.set_ylim(0, 5.4); ax.axis("off")
box(ax, 0.1, 4.2, 2.2, 0.8, "Khách đặt lịch\n(không cần tài khoản)", "#FFF2CC", fs=11)
box(ax, 0.1, 2.9, 2.2, 0.8, "Chủ lịch (host)\n(có tài khoản)", "#FFF2CC", fs=11)
ax.add_patch(FancyBboxPatch((2.9, 0.5), 5.0, 4.7, boxstyle="round,pad=0.02,rounding_size=0.1", fc="#FAFAFA", ec=GREY, lw=1.2, ls="--"))
ax.text(5.4, 5.0, "Cal.com (monorepo Yarn + Turborepo)", ha="center", fontsize=12, fontweight="bold")
box(ax, 3.1, 3.8, 2.2, 0.8, "apps/web\nNext.js: giao diện, API route", "#DDEBF7", fs=10.5)
box(ax, 5.5, 3.8, 2.2, 0.8, "apps/api v1, v2\nREST API", "#DDEBF7", fs=10.5)
box(ax, 3.1, 2.6, 2.2, 0.8, "packages/trpc\nrouter tRPC", "#DDEBF7", fs=10.5)
box(ax, 5.5, 2.6, 2.2, 0.8, "packages/app-store\ntích hợp lịch, video, thanh toán", "#DDEBF7", fs=9.5)
box(ax, 3.1, 1.4, 4.6, 0.8, "packages/features\nbookings, availability, slots, schedules, eventtypes", "#FCE4D6", fs=10.5)
box(ax, 3.1, 0.65, 4.6, 0.55, "packages/prisma: schema và phần mở rộng", "#FCE4D6", fs=10.5)
box(ax, 8.3, 1.0, 1.6, 1.2, "PostgreSQL 16", "#E2EFDA", fs=11)
box(ax, 8.3, 3.2, 1.6, 1.2, "Dịch vụ ngoài\nlịch, video,\nSMTP, Stripe", "#EDEDED", fs=9.5)
arrow(ax, 2.3, 4.6, 3.1, 4.3); arrow(ax, 2.3, 3.3, 3.1, 3.9)
arrow(ax, 4.2, 3.8, 4.2, 3.4); arrow(ax, 4.2, 2.6, 4.2, 2.2); arrow(ax, 6.6, 2.6, 6.6, 2.2)
ax.plot([7.7, 7.85, 7.85], [4.2, 4.2, 1.95], color="#404040", lw=1.3); arrow(ax, 7.85, 1.95, 7.7, 1.9)
arrow(ax, 5.4, 1.4, 5.4, 1.2); arrow(ax, 7.7, 1.6, 8.3, 1.6); arrow(ax, 7.7, 3.0, 8.3, 3.5)
save(fig, "hinh-container.png")

# --- Hình: sơ đồ use case ---
from matplotlib.patches import Ellipse
fig, ax = plt.subplots(figsize=(10, 5.2)); ax.set_xlim(0, 10); ax.set_ylim(0, 5.2); ax.axis("off")
ax.add_patch(FancyBboxPatch((2.4, 0.2), 5.2, 4.8, boxstyle="round,pad=0.02,rounding_size=0.1", fc="none", ec=GREY, lw=1.2))
ax.text(5.0, 4.75, "Hệ thống Cal.com", ha="center", fontsize=12.5, fontweight="bold")
uc = [(5.0, 4.05, "UC01 Đặt lịch"), (5.0, 3.2, "UC02 Đổi lịch"), (5.0, 2.35, "UC03 Hủy lịch"), (5.0, 1.5, "UC04 Tạo loại cuộc hẹn,\nkhai báo giờ rảnh"), (5.0, 0.7, "UC05 Xác nhận hoặc từ chối booking")]
for x, y, t in uc:
    ax.add_patch(Ellipse((x, y), 3.6, 0.7, fc="#DDEBF7", ec="#404040", lw=1.1)); ax.text(x, y, t, ha="center", va="center", fontsize=11)
for y in (4.05, 3.2, 2.35): ax.plot([1.2, 3.2], [3.2, y], color="#404040", lw=1)
for y in (1.5, 0.7): ax.plot([8.8, 6.8], [1.6, y], color="#404040", lw=1)
ax.plot([6.8, 8.8], [4.05, 1.9], color="#404040", lw=1, alpha=0.0)
for (x, y, t) in ((0.9, 3.2, "Khách"), (9.1, 1.6, "Chủ lịch")):
    ax.add_patch(plt.Circle((x, y + 0.45), 0.2, fc="white", ec="#404040")); ax.plot([x, x], [y + 0.25, y - 0.2], color="#404040"); ax.plot([x - 0.3, x + 0.3], [y + 0.1, y + 0.1], color="#404040")
    ax.plot([x, x - 0.25], [y - 0.2, y - 0.6], color="#404040"); ax.plot([x, x + 0.25], [y - 0.2, y - 0.6], color="#404040"); ax.text(x, y - 0.95, t, ha="center", fontsize=12)
save(fig, "hinh-usecase.png")

print("ok", sorted(os.listdir(OUT)))
