"""Original A.R.E.N.A. schematics for the sack-truck FRI template (TRO).
Not reproduced from any standard, brand or third-party report."""
import sys
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle, FancyArrowPatch, Polygon

RED = "#C00000"
LINE = "#151F37"


def dim(ax, p1, p2, label, off=(0, 0), fs=11):
    a = FancyArrowPatch(p1, p2, arrowstyle="<->", mutation_scale=10, color=RED, lw=1.2)
    ax.add_patch(a)
    mx, my = (p1[0] + p2[0]) / 2 + off[0], (p1[1] + p2[1]) / 2 + off[1]
    ax.text(mx, my, label, color=RED, fontsize=fs, fontweight="bold", ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.15", fc="white", ec="none"))


def ref_box(ax, x, y, text):
    ax.text(x, y, text, fontsize=7.5, ha="left", va="top", color="#333333",
            bbox=dict(boxstyle="square,pad=0.35", fc="#F4F6FA", ec="#999999", lw=0.6))


def side_view(ax):
    ax.set_title("A – Side view | Nhìn bên", fontsize=10, color=LINE)
    # frame (handle loop top at y=115), tilted slightly
    ax.plot([20, 20], [12, 105], color=LINE, lw=4)
    ax.plot([20, 26, 30], [105, 112, 115], color=LINE, lw=4)
    ax.plot([20, 34], [12, 12], color=LINE, lw=1)  # base line ref
    # toe plate
    ax.add_patch(Rectangle((20, 6), 22, 2.2, color=LINE))
    # wheel
    ax.add_patch(Circle((14, 12), 12, fill=False, ec=LINE, lw=3))
    ax.add_patch(Circle((14, 12), 3, color=LINE))
    ax.plot([14, 20], [12, 20], color=LINE, lw=2)  # axle bracket
    # grips
    ax.add_patch(Rectangle((27, 111), 6, 5, color="#555555"))
    # ground
    ax.plot([-5, 60], [0, 0], color="#888888", lw=1)
    ax.fill_between([-5, 60], -2, 0, color="#DDDDDD")
    # dims
    dim(ax, (50, 0), (50, 116), "H", off=(3, 0))
    dim(ax, (20, 3), (42, 3), "L", off=(0, -3))
    dim(ax, (2, -5), (26, -5), "D", off=(0, -3))
    dim(ax, (44, 6), (44, 8.2), "t", off=(3, 0), fs=9)
    ax.text(36, 60, "frame\nkhung", fontsize=8, color="#555555")
    ax.text(30, 18, "toe plate\nbàn xúc", fontsize=8, color="#555555")
    ax.set_xlim(-8, 62)
    ax.set_ylim(-12, 122)


def front_view(ax):
    ax.set_title("B – Front view | Nhìn trước", fontsize=10, color=LINE)
    # uprights
    ax.plot([10, 10], [12, 112], color=LINE, lw=4)
    ax.plot([40, 40], [12, 112], color=LINE, lw=4)
    ax.plot([10, 40], [112, 112], color=LINE, lw=4)
    for y in (35, 60, 85):
        ax.plot([10, 40], [y, y], color=LINE, lw=2.5)
    # toe plate
    ax.add_patch(Rectangle((6, 6), 38, 3, color=LINE))
    # wheels seen edge-on
    ax.add_patch(Rectangle((-2, 0), 6, 24, fill=False, ec=LINE, lw=2.5))
    ax.add_patch(Rectangle((46, 0), 6, 24, fill=False, ec=LINE, lw=2.5))
    ax.plot([4, 46], [12, 12], color=LINE, lw=2)  # axle
    ax.plot([-8, 58], [0, 0], color="#888888", lw=1)
    ax.fill_between([-8, 58], -2, 0, color="#DDDDDD")
    dim(ax, (6, -5), (44, -5), "W", off=(0, -3))
    dim(ax, (-2, 125), (52, 125), "B", off=(0, 3))
    dim(ax, (10, 105), (40, 105), "Wf", off=(0, 3), fs=9)
    ax.set_xlim(-10, 60)
    ax.set_ylim(-12, 132)


def balance_view(ax):
    ax.set_title("C – Tilted (travel) position | Tư thế nghiêng (di chuyển)",
                 fontsize=10, color=LINE)
    import math
    a = math.radians(35)  # from vertical
    ox, oy = 14, 12
    L = 100
    top = (ox + L * math.sin(a), oy + L * math.cos(a))
    ax.plot([ox, top[0]], [oy, top[1]], color=LINE, lw=4)
    tp_end = (ox + 22 * math.cos(a), oy - 22 * math.sin(a) + 4)
    ax.plot([ox, tp_end[0]], [oy - 2, tp_end[1]], color=LINE, lw=3)
    ax.add_patch(Circle((ox - 2, 12), 12, fill=False, ec=LINE, lw=3))
    ax.add_patch(Circle((ox - 2, 12), 3, color=LINE))
    # load box
    lb = Polygon([(ox + 3, oy + 2), (ox + 3 + 20 * math.cos(a), oy + 2 - 20 * math.sin(a) + 4),
                  (ox + 3 + 20 * math.cos(a) + 30 * math.sin(a), oy - 20 * math.sin(a) + 6 + 30 * math.cos(a)),
                  (ox + 3 + 30 * math.sin(a), oy + 2 + 30 * math.cos(a))],
                 closed=True, fc="#F3D3C9", ec=RED, lw=1)
    ax.add_patch(lb)
    ax.text(ox + 52, oy + 10, "rated load\ntải định mức", fontsize=7.5, color=RED, ha="left")
    ax.plot([-8, 80], [0, 0], color="#888888", lw=1)
    ax.fill_between([-8, 80], -2, 0, color="#DDDDDD")
    # angle arc
    ax.plot([ox, ox], [oy, oy + 45], color="#888888", lw=0.8, ls="--")
    import numpy as np
    th = np.linspace(math.pi / 2 - a, math.pi / 2, 30)
    ax.plot(ox + 35 * np.cos(th), oy + 35 * np.sin(th), color=RED, lw=1.2)
    ax.text(ox + 9, oy + 40, "α", color=RED, fontsize=12, fontweight="bold")
    ax.annotate("F", xy=top, xytext=(top[0] + 4, top[1] + 14), color=RED, fontsize=12, fontweight="bold",
                arrowprops=dict(arrowstyle="<-", color=RED, lw=1.4))
    ax.set_xlim(-10, 85)
    ax.set_ylim(-12, 125)


def main(out_dir):
    fig, axs = plt.subplots(1, 3, figsize=(11.5, 5.2), dpi=300)
    for ax in axs:
        ax.set_aspect("equal")
        ax.axis("off")
    side_view(axs[0])
    front_view(axs[1])
    balance_view(axs[2])
    ref_box(axs[0], -8, -14, "H, L, D, t – per approved drawing\n(no OJ-cited EN for sack trucks – SoA)")
    ref_box(axs[1], -10, -14, "W, B, Wf – per approved drawing")
    ref_box(axs[2], -10, -14, "α, F – recorded for information (ARENA *)")
    fig.suptitle("Fig. 1 – Sack truck critical points | Hình 1 – Điểm kiểm tra quan trọng xe đẩy tay 2 bánh",
                 fontsize=11, color=LINE, fontweight="bold")
    fig.text(0.5, 0.005, "Original A.R.E.N.A. schematic – not to scale | Sơ đồ gốc A.R.E.N.A. – không theo tỉ lệ",
             ha="center", fontsize=7.5, color="#666666")
    fig.tight_layout(rect=(0, 0.03, 1, 0.95))
    fig.savefig(f"{out_dir}/fig1_tro_points.png", dpi=300)
    plt.close(fig)

    # Fig. 2 – test set-ups
    fig, axs = plt.subplots(1, 3, figsize=(11.5, 4.2), dpi=300)
    for ax in axs:
        ax.set_aspect("equal")
        ax.axis("off")
    # T2 static load upright
    ax = axs[0]
    ax.set_title("T2 – Static rated load, upright | Tải tĩnh, đứng", fontsize=9.5, color=LINE)
    ax.plot([20, 20], [12, 100], color=LINE, lw=4)
    ax.add_patch(Rectangle((20, 6), 22, 2.2, color=LINE))
    ax.add_patch(Circle((14, 12), 12, fill=False, ec=LINE, lw=3))
    ax.add_patch(Rectangle((21, 8.5), 20, 26, fc="#F3D3C9", ec=RED))
    ax.text(31, 21, "rated load\nsandbags", fontsize=7, ha="center", color=RED)
    ax.annotate("", xy=(31, 35), xytext=(31, 55), arrowprops=dict(arrowstyle="->", color=RED, lw=1.5))
    ax.text(33, 50, "m = marked\nrated load", fontsize=7.5, color=RED)
    dim(ax, (44, 6), (44, 1), "δ", off=(3, 0), fs=10)
    ax.plot([-5, 55], [0, 0], color="#888888")
    ax.set_xlim(-6, 60); ax.set_ylim(-4, 105)
    # T3 roll test with step
    ax = axs[1]
    ax.set_title("T3 – Roll test 50 m + step | Thử lăn 50 m + bậc", fontsize=9.5, color=LINE)
    ax.plot([0, 40], [0, 0], color="#888888"); ax.plot([40, 40], [0, 4], color="#888888"); ax.plot([40, 80], [4, 4], color="#888888")
    ax.add_patch(Circle((25, 12), 12, fill=False, ec=LINE, lw=3))
    ax.plot([25, 55], [12, 70], color=LINE, lw=4)
    ax.annotate("", xy=(50, 12), xytext=(30, 12), arrowprops=dict(arrowstyle="->", color=RED, lw=1.5))
    dim(ax, (44, 0), (44, 4), "s", off=(3, 0), fs=10)
    ax.text(2, 75, "loaded at rated load\nchất tải định mức", fontsize=7.5, color=RED)
    ax.set_xlim(-2, 82); ax.set_ylim(-4, 85)
    # T5 wheel run-out
    ax = axs[2]
    ax.set_title("T5 – Wheel play & run-out | Độ rơ & đảo bánh", fontsize=9.5, color=LINE)
    ax.add_patch(Circle((30, 30), 22, fill=False, ec=LINE, lw=3))
    ax.add_patch(Circle((30, 30), 3, color=LINE))
    ax.add_patch(Rectangle((52, 26), 10, 8, fc="white", ec=RED))
    ax.text(57, 38, "dial\ngauge", fontsize=7, ha="center", color=RED)
    ax.annotate("", xy=(30, 56), xytext=(30, 62), arrowprops=dict(arrowstyle="<->", color=RED))
    ax.text(32, 62, "radial", fontsize=7.5, color=RED)
    ax.text(0, 2, "1 slow turn, record max − min", fontsize=7.5, color="#333333")
    ax.set_xlim(-2, 66); ax.set_ylim(0, 68)
    fig.suptitle("Fig. 2 – On-site test set-ups | Hình 2 – Bố trí thử nghiệm tại xưởng",
                 fontsize=11, color=LINE, fontweight="bold")
    fig.text(0.5, 0.01, "ARENA methods (*) – factory rig only for T2; otherwise N/A, covered by test report",
             ha="center", fontsize=7.5, color="#666666")
    fig.tight_layout(rect=(0, 0.04, 1, 0.93))
    fig.savefig(f"{out_dir}/fig2_tro_tests.png", dpi=300)
    plt.close(fig)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
