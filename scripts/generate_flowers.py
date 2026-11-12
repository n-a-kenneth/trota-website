#!/usr/bin/env python3
"""Generate scribbled flower heads (petals only, open centre).

    python scripts/generate_flowers.py --count 14 --seed 7

Writes src/lib/flowers.json (path data used by the site) and src/app/icon.svg.
"""
import argparse
import json
import math
import pathlib
import random

S = 200
C = S / 2
TAU = 2 * math.pi
ROOT = pathlib.Path(__file__).resolve().parent.parent


def wobble(rng, amp):
    w = [(rng.uniform(1, 3), rng.uniform(0, TAU)), (rng.uniform(4, 7), rng.uniform(0, TAU))]
    return lambda t: amp * (math.sin(w[0][0] * t + w[0][1]) + 0.5 * math.sin(w[1][0] * t + w[1][1]))


def to_path(pts):
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)


def loop_petals(rng, R, double):
    """One continuous line: out to each petal tip and back, never through the middle."""
    k = rng.randint(5, 9)
    r0 = R * rng.uniform(0.18, 0.3)
    width = rng.uniform(0.75, 1.0) * TAU / k * 1.25
    a0 = rng.uniform(0, TAU)
    jx, jy = wobble(rng, R * 0.025), wobble(rng, R * 0.025)
    passes = []
    for p in range(2 if double else 1):
        off = p * rng.uniform(0.04, 0.09)
        pts = []
        for i in range(k):
            a = a0 + i * TAU / k + rng.uniform(-0.06, 0.06) + off
            L = R * rng.uniform(0.8, 1.05)
            for s in range(41):
                u = s / 40
                lift = math.sin(math.pi * u)
                r = r0 + (L - r0) * lift ** 0.7
                ang = a + (u - 0.5) * width * (0.25 + 0.75 * lift ** 0.6)
                t = i + u
                pts.append((C + r * math.cos(ang) + jx(t), C + r * math.sin(ang) + jy(t)))
        pts.append(pts[0])
        passes.append(to_path(pts))
    return passes


def rounded_ring(rng, R, double):
    """Rounded petals as a lobed ring with a hole in the middle."""
    k = rng.randint(4, 8)
    inner = rng.uniform(0.32, 0.45)
    jx, jy = wobble(rng, R * 0.03), wobble(rng, R * 0.03)
    out = []
    for p in range(2 if double else 1):
        ph = rng.uniform(0, TAU)
        sc = 1 - p * rng.uniform(0.05, 0.1)
        turns = rng.uniform(1.02, 1.12)
        n = int(260 * turns)
        pts = []
        for i in range(n + 1):
            t = i / n * turns * TAU
            r = R * sc * (inner + (1 - inner) * abs(math.cos(k * t / 2)) ** 0.8)
            pts.append((C + r * math.cos(t + ph) + jx(t), C + r * math.sin(t + ph) + jy(t)))
        out.append(to_path(pts))
    return out


def separate_petals(rng, R, double):
    """Each petal its own quick stroke, like a pen sketch."""
    k = rng.randint(5, 8)
    a0, out = rng.uniform(0, TAU), []
    for i in range(k):
        a = a0 + i * TAU / k + rng.uniform(-0.1, 0.1)
        r0, L, w = R * rng.uniform(0.22, 0.32), R * rng.uniform(0.8, 1.05), rng.uniform(0.32, 0.5)
        x0, y0 = C + r0 * math.cos(a - 0.08), C + r0 * math.sin(a - 0.08)
        x3, y3 = C + r0 * math.cos(a + 0.08), C + r0 * math.sin(a + 0.08)
        c1 = (C + L * 1.15 * math.cos(a - w), C + L * 1.15 * math.sin(a - w))
        c2 = (C + L * 1.15 * math.cos(a + w), C + L * 1.15 * math.sin(a + w))
        out.append(f'M{x0:.1f} {y0:.1f} C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {x3:.1f} {y3:.1f}')
        if double and rng.random() < 0.5:
            out.append(f'M{x0:.1f} {y0:.1f} C{c1[0] * 0.97 + C * 0.03:.1f} {c1[1] * 0.97 + C * 0.03:.1f} {c2[0] * 0.92 + C * 0.08:.1f} {c2[1] * 0.92 + C * 0.08:.1f} {x3:.1f} {y3:.1f}')
    return out


def flower(seed):
    rng = random.Random(seed)
    R = rng.uniform(78, 92)
    style = rng.choice([loop_petals, loop_petals, rounded_ring, separate_petals])
    return ' '.join(style(rng, R, rng.random() < 0.35))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--count', type=int, default=14)
    ap.add_argument('--seed', type=int, default=7)
    a = ap.parse_args()
    paths = [flower(a.seed * 1000 + i) for i in range(a.count)]
    lib = ROOT / 'src' / 'lib'
    lib.mkdir(parents=True, exist_ok=True)
    (lib / 'flowers.json').write_text(json.dumps({'size': S, 'paths': paths}))
    (ROOT / 'src' / 'app' / 'icon.svg').write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}"><rect width="{S}" height="{S}" rx="44" fill="#F5F1E9"/>'
        f'<path d="{paths[0]}" fill="none" stroke="#211E1A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(20 20) scale(.8)"/></svg>\n')
    print(f'wrote {a.count} flower heads')


if __name__ == '__main__':
    main()
