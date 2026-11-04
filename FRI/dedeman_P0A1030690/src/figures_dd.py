"""Original A.R.E.N.A. schematics for DEDEMAN P0A1030690 FRI templates (VCE / SPN / LUB).
Not reproduced from any standard, brand or third-party document."""
import sys, math
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, Polygon, FancyArrowPatch, Arc

RED, LINE, GREY = "#C00000", "#151F37", "#555555"


def dim(ax, p1, p2, label, off=(0, 0), fs=11):
    ax.add_patch(FancyArrowPatch(p1, p2, arrowstyle="<->", mutation_scale=9, color=RED, lw=1.2))
    ax.text((p1[0] + p2[0]) / 2 + off[0], (p1[1] + p2[1]) / 2 + off[1], label, color=RED, fontsize=fs,
            fontweight="bold", ha="center", va="center", bbox=dict(boxstyle="round,pad=0.12", fc="white", ec="none"))


def box(ax, x, y, t):
    ax.text(x, y, t, fontsize=7.3, ha="left", va="top", color="#333333",
            bbox=dict(boxstyle="square,pad=0.35", fc="#F4F6FA", ec="#999999", lw=0.6))


def setup(n, w=11.5, h=4.6):
    fig, axs = plt.subplots(1, n, figsize=(w, h), dpi=300)
    for a in np.atleast_1d(axs):
        a.set_aspect("equal"); a.axis("off")
    return fig, np.atleast_1d(axs)


def finish(fig, title, foot, path):
    fig.suptitle(title, fontsize=11, color=LINE, fontweight="bold")
    fig.text(0.5, 0.01, foot, ha="center", fontsize=7.3, color="#666666")
    fig.tight_layout(rect=(0, 0.04, 1, 0.93))
    fig.savefig(path, dpi=300); plt.close(fig)


# ------------------------------------------------------------------ VCE – vices & anvil
def vce(out):
    fig, ax = setup(3)
    a = ax[0]; a.set_title("A – Bench vice, side | Ê-tô, nhìn bên", fontsize=9.5, color=LINE)
    a.add_patch(Rectangle((0, 0), 70, 8, fc="#DDE3EE", ec=LINE, lw=1.5))          # base
    a.add_patch(Rectangle((40, 8), 14, 30, fc="#C9D1E0", ec=LINE, lw=1.5))         # fixed jaw body
    a.add_patch(Rectangle((8, 8), 14, 30, fc="#C9D1E0", ec=LINE, lw=1.5))          # moving jaw body
    a.add_patch(Rectangle((22, 30), 3, 8, fc="#888888", ec=LINE))                  # jaw plate moving
    a.add_patch(Rectangle((37, 30), 3, 8, fc="#888888", ec=LINE))                  # jaw plate fixed
    a.add_patch(Rectangle((54, 30), 14, 4, fc="#C9D1E0", ec=LINE))                 # anvil
    a.plot([-12, 8], [20, 20], color=LINE, lw=3)                                   # spindle
    a.plot([-12, -12], [8, 32], color=LINE, lw=2.5)                                # handle
    a.add_patch(Circle((-12, 33), 1.6, color=LINE)); a.add_patch(Circle((-12, 7), 1.6, color=LINE))
    dim(a, (25, 42), (37, 42), "a", off=(0, 3))
    dim(a, (40, 38), (40, 22), "c", off=(-3, 0), fs=10)
    a.text(-20, 38, "end stops\nchặn đầu", fontsize=7, color=GREY)
    a.text(52, 40, "anvil\nđe", fontsize=7, color=GREY)
    a.set_xlim(-24, 74); a.set_ylim(-14, 52)
    box(a, -24, -2, "a max. opening, c throat depth –\nper approved drawing")

    a = ax[1]; a.set_title("B – Jaws, top + gap check | Hàm, nhìn trên + khe hở", fontsize=9.5, color=LINE)
    a.add_patch(Rectangle((0, 0), 40, 6, fc="#888888", ec=LINE))
    a.add_patch(Rectangle((0, 6.6), 40, 6, fc="#888888", ec=LINE))
    for x in range(2, 40, 3):
        a.plot([x, x + 1.5], [6, 4.5], color="#555555", lw=0.5); a.plot([x, x + 1.5], [6.6, 8.1], color="#555555", lw=0.5)
    dim(a, (0, 16), (40, 16), "b", off=(0, 3))
    a.annotate("g", xy=(42, 6.3), xytext=(48, 10), color=RED, fontsize=12, fontweight="bold",
               arrowprops=dict(arrowstyle="->", color=RED))
    a.text(30, -6, "feeler gauge at both ends\nthước lá ở hai đầu", fontsize=7, color=GREY)
    a.set_xlim(-4, 56); a.set_ylim(-14, 24)
    box(a, -4, -10, "b jaw width = nominal 80/100/125/150 mm\ng closed-jaw gap ≤ 0.2 mm* (ARENA)")

    a = ax[2]; a.set_title("C – Anvil | Đe", fontsize=9.5, color=LINE)
    a.add_patch(Polygon([(0, 20), (40, 20), (55, 24), (40, 26), (0, 26)], fc="#C9D1E0", ec=LINE, lw=1.5))
    a.add_patch(Polygon([(8, 20), (32, 20), (28, 8), (12, 8)], fc="#DDE3EE", ec=LINE, lw=1.5))
    a.add_patch(Rectangle((6, 4), 28, 4, fc="#DDE3EE", ec=LINE, lw=1.5))
    a.plot([0, 40], [26.6, 26.6], color=RED, lw=1, ls="--")
    a.text(0, 29, "f – face flatness (straightedge)", fontsize=7.5, color=RED)
    a.text(42, 14, "m – mass\n5 kg", fontsize=8, color=RED, fontweight="bold")
    a.set_xlim(-4, 60); a.set_ylim(-6, 34)
    box(a, -4, 2, "m = 5 kg ± 3 %*, f ≤ 0.5 mm* – ARENA proposals")
    finish(fig, "Fig. A1 – Vices & anvil critical points | Hình A1 – Điểm kiểm ê-tô & đe",
           "Original A.R.E.N.A. schematic – not to scale | * ARENA proposal, QS to confirm", f"{out}/fig_vce_points.png")

    fig, ax = setup(2, 10, 4)
    a = ax[0]; a.set_title("T2 – Clamping test, hand force | Thử kẹp, lực tay", fontsize=9.5, color=LINE)
    a.add_patch(Rectangle((0, 0), 60, 6, fc="#DDE3EE", ec=LINE)); a.add_patch(Rectangle((10, 6), 12, 20, fc="#C9D1E0", ec=LINE))
    a.add_patch(Rectangle((32, 6), 12, 20, fc="#C9D1E0", ec=LINE)); a.add_patch(Rectangle((22, 16), 10, 8, fc="#F3D3C9", ec=RED))
    a.text(27, 28, "steel bar", fontsize=7, color=RED, ha="center")
    a.plot([-6, 10], [14, 14], color=LINE, lw=3); a.plot([-6, -6], [4, 24], color=LINE, lw=2)
    a.annotate("", xy=(-6, 26), xytext=(-14, 26), arrowprops=dict(arrowstyle="->", color=RED, lw=1.5))
    a.text(-20, 30, "hand force only\nno extension", fontsize=7, color=RED)
    a.set_xlim(-24, 64); a.set_ylim(-4, 36)
    a = ax[1]; a.set_title("T3 – Swivel base lock | Khóa đế xoay", fontsize=9.5, color=LINE)
    a.add_patch(Circle((20, 15), 14, fill=False, ec=LINE, lw=2)); a.add_patch(Circle((20, 15), 3, color=LINE))
    a.add_patch(Arc((20, 15), 34, 34, theta1=20, theta2=160, color=RED, lw=1.2))
    a.text(20, 35, "360° free when unlocked, no rotation when locked", fontsize=7, ha="center", color=RED)
    a.set_xlim(-2, 42); a.set_ylim(-2, 40)
    finish(fig, "Fig. A2 – On-site test set-ups | Hình A2 – Bố trí thử", "ARENA methods (*)", f"{out}/fig_vce_tests.png")


# ------------------------------------------------------------------ SPN – spanners & wrenches
def spanner_head(a, x, y, s, ang=15, ring=False):
    if ring:
        a.add_patch(Circle((x, y), s * 0.9, fill=False, ec=LINE, lw=2))
        hexp = [(x + s * 0.5 * math.cos(math.radians(30 * k)), y + s * 0.5 * math.sin(math.radians(30 * k))) for k in range(12)]
        a.add_patch(Polygon(hexp, closed=True, fill=False, ec=GREY, lw=0.8))
    else:
        t = math.radians(ang)
        pts = [(x - s * 0.9, y - s * 0.2), (x - s * 0.9, y + s * 0.8), (x - s * 0.5, y + s * 0.8), (x - s * 0.5, y + s * 0.5 * 0.0 + s * 0.3),
               (x + s * 0.5, y + s * 0.3), (x + s * 0.5, y + s * 0.8), (x + s * 0.9, y + s * 0.8), (x + s * 0.9, y - s * 0.2)]
        a.add_patch(Polygon(pts, closed=True, fc="#DDE3EE", ec=LINE, lw=1.5))


def spn(out):
    fig, ax = setup(3)
    a = ax[0]; a.set_title("A – Open-end / combination | Cờ lê dẹt / vòng miệng", fontsize=9.5, color=LINE)
    a.add_patch(Rectangle((-3, 6), 6, 70, fc="#DDE3EE", ec=LINE, lw=1.5))
    spanner_head(a, 0, 78, 10)
    a.add_patch(Circle((0, 2), 8, fill=False, ec=LINE, lw=2))
    dim(a, (-5, 87), (5, 87), "s", off=(0, 4))
    dim(a, (16, -6), (16, 86), "l", off=(3, 0))
    a.text(-20, 2, "ring end\n(combination)", fontsize=7, color=GREY)
    a.set_xlim(-26, 26); a.set_ylim(-12, 98)
    box(a, -26, -14, "s opening – tolerance per DIN ISO 691 (QS to fill)\nl length – per drawing")

    a = ax[1]; a.set_title("B – Elliptical section + head angle | Tiết diện + góc đầu", fontsize=9.5, color=LINE)
    th = np.linspace(0, 2 * np.pi, 80)
    a.plot(10 + 9 * np.cos(th), 60 + 4 * np.sin(th), color=LINE, lw=2)
    a.text(10, 70, "elliptical shank", fontsize=7, ha="center", color=GREY)
    a.plot([0, 30], [20, 20], color=GREY, lw=0.8, ls="--")
    a.plot([0, 30 * math.cos(math.radians(15))], [20, 20 + 30 * math.sin(math.radians(15))], color=LINE, lw=3)
    a.add_patch(Arc((0, 20), 30, 30, theta1=0, theta2=15, color=RED, lw=1.2))
    a.text(18, 22.5, "β 15°", color=RED, fontsize=10, fontweight="bold")
    a.set_xlim(-6, 36); a.set_ylim(8, 76)
    box(a, -6, 10, "β head angle – per drawing / DIN 3110-3113 (QS)")

    a = ax[2]; a.set_title("C – L-socket wrench | Cờ lê ống chữ L", fontsize=9.5, color=LINE)
    a.add_patch(Rectangle((0, 0), 8, 60, fc="#DDE3EE", ec=LINE, lw=1.5))
    a.add_patch(Rectangle((0, 52), 28, 8, fc="#DDE3EE", ec=LINE, lw=1.5))
    a.add_patch(Circle((4, 4), 2.6, fill=False, ec=RED, lw=1.2)); a.add_patch(Circle((24, 56), 2.6, fill=False, ec=RED, lw=1.2))
    dim(a, (-4, 0), (-4, 60), "l1", off=(-4, 0), fs=9); dim(a, (0, 66), (28, 66), "l2", off=(0, 3), fs=9)
    a.text(10, 8, "s – 6/12-point socket\nthrough hole on short elbow", fontsize=7, color=RED)
    a.set_xlim(-14, 40); a.set_ylim(-8, 74)
    finish(fig, "Fig. B1 – Spanners & wrenches critical points | Hình B1 – Điểm kiểm cờ lê",
           "Original A.R.E.N.A. schematic – not to scale", f"{out}/fig_spn_points.png")

    fig, ax = setup(2, 10, 4)
    a = ax[0]; a.set_title("T1 – Opening GO / NO-GO | Calip lọt / không lọt", fontsize=9.5, color=LINE)
    spanner_head(a, 20, 20, 12)
    a.add_patch(Rectangle((14.2, 22), 11.6, 8, fc="#E5F4E4", ec="#2E7D32")); a.text(20, 33, "GO", ha="center", fontsize=8, color="#2E7D32")
    a.add_patch(Rectangle((40, 22), 13, 8, fc="#FBEBEB", ec=RED)); a.text(46.5, 33, "NO-GO", ha="center", fontsize=8, color=RED)
    a.set_xlim(0, 58); a.set_ylim(8, 38)
    a = ax[1]; a.set_title("T2 – Fit on hex gauge | Lắp vừa lục giác chuẩn", fontsize=9.5, color=LINE)
    hexp = [(20 + 8 * math.cos(math.radians(60 * k)), 20 + 8 * math.sin(math.radians(60 * k))) for k in range(6)]
    a.add_patch(Polygon(hexp, closed=True, fc="#C9D1E0", ec=LINE, lw=1.5))
    a.add_patch(Circle((20, 20), 10.5, fill=False, ec=RED, lw=1.5))
    a.text(20, 34, "full engagement, no rocking / slipping", fontsize=7, ha="center", color=RED)
    a.set_xlim(0, 40); a.set_ylim(4, 38)
    finish(fig, "Fig. B2 – On-site checks | Hình B2 – Kiểm tra tại xưởng", "ARENA methods (*); proof-torque test = lab report only", f"{out}/fig_spn_tests.png")


# ------------------------------------------------------------------ LUB – oil can & grease gun
def lub(out):
    fig, ax = setup(2, 10.5, 4.4)
    a = ax[0]; a.set_title("A – Oil can 500 ml | Bình dầu 500 ml", fontsize=9.5, color=LINE)
    a.add_patch(Polygon([(0, 0), (30, 0), (30, 6), (22, 14), (8, 14), (0, 6)], fc="#DDE3EE", ec=LINE, lw=1.5))
    a.add_patch(Rectangle((12, 14), 6, 4, fc="#C9D1E0", ec=LINE))
    xs = np.linspace(15, 60, 60); a.plot(xs, 18 + 6 * np.sin((xs - 15) / 14), color=LINE, lw=2)
    a.add_patch(Rectangle((22, 6), 10, 3, fc="#888888", ec=LINE)); a.text(34, 7, "pump", fontsize=7, color=GREY)
    dim(a, (15, 28), (60, 28), "ls", off=(0, 3), fs=9)
    a.text(2, -6, "V capacity – fill with water to brim, measure", fontsize=7, color=RED)
    for p, l in [((30, 6), "L1 seam"), ((15, 18), "L2 cap/spout"), ((27, 8), "L3 pump")]:
        a.add_patch(Circle(p, 0.8, color=RED)); a.text(p[0] + 1.5, p[1] - 4, l, fontsize=6.5, color=RED)
    a.set_xlim(-4, 66); a.set_ylim(-10, 36)

    a = ax[1]; a.set_title("B – Grease gun 15 oz | Súng bơm mỡ 15 oz", fontsize=9.5, color=LINE)
    a.add_patch(Rectangle((0, 8), 50, 10, fc="#DDE3EE", ec=LINE, lw=1.5))
    a.add_patch(Rectangle((50, 6), 10, 14, fc="#C9D1E0", ec=LINE, lw=1.5))
    a.plot([-10, 0], [13, 13], color=LINE, lw=2); a.add_patch(Circle((-11, 13), 2, fill=False, ec=LINE, lw=1.5))
    a.plot([56, 70], [20, 30], color=LINE, lw=3)
    xs = np.linspace(60, 90, 40); a.plot(xs, 12 - 4 * np.sin((xs - 60) / 9), color=LINE, lw=2)
    a.add_patch(Rectangle((90, 6), 5, 8, fc="#888888", ec=LINE)); a.text(87, 1, "coupler M10×1*", fontsize=7, color=RED)
    dim(a, (0, 24), (50, 24), "lb", off=(0, 3), fs=9); dim(a, (60, -4), (90, -4), "lh", off=(0, -3), fs=9)
    for p, l in [((50, 13), "L1 head thread"), ((60, 12), "L2 hose crimp"), ((93, 14), "L3 coupler")]:
        a.add_patch(Circle(p, 0.9, color=RED)); a.text(p[0] - 6, p[1] + 3, l, fontsize=6.5, color=RED)
    a.text(66, 33, "lever", fontsize=7, color=GREY); a.text(-16, 18, "T-handle", fontsize=7, color=GREY)
    a.set_xlim(-18, 100); a.set_ylim(-12, 38)
    finish(fig, "Fig. C1 – Lubrication tools critical points & leak points | Hình C1 – Điểm kiểm & điểm rò",
           "Original A.R.E.N.A. schematic – not to scale | * thread size per approved drawing", f"{out}/fig_lub_points.png")


if __name__ == "__main__":
    o = sys.argv[1] if len(sys.argv) > 1 else "."
    vce(o); spn(o); lub(o)
