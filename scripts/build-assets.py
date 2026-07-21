#!/usr/bin/env python3
"""
Asset pipeline for the Jake Roth site.

Source photography lives in docs/ at full camera resolution (3-5 MB each).
Shipping those directly would blow the 02_MOTION.md hero budget by 4x.
This produces responsive WebP + JPEG derivatives at the exact widths the
CSS asks for, plus two treatments that have to happen at the pixel level:

  1. BLACK-POINT LIFT on the portrait. The headshot was shot on #000004 —
     pure black, darker than the page ground (#0A090C). Dropped in as-is
     it reads as a visible dark rectangle. Lifting its black point to the
     page base makes it dissolve into the page with no edge at all.

  2. WHITE KEY on the logo. It ships as a JPEG on white. On a dark page
     that is a white box. We key the white to alpha and rebuild the mark
     at constant brand pink so the anti-aliased edges stay clean.

Run:  python3 scripts/build-assets.py
"""

from PIL import Image, ImageFilter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'docs'
OUT = ROOT / 'src' / 'assets'
OUT.mkdir(parents=True, exist_ok=True)

PAGE_BASE = (10, 9, 12)      # --color-surface-base
BRAND_PINK = (224, 19, 132)  # --color-brand-pink

WEBP_Q = 82
JPEG_Q = 84


def emit(img, stem, widths, *, jpeg=True):
    """Write WebP (+ optional JPEG fallback) at each width."""
    results = []
    for w in widths:
        if w > img.width:
            continue
        h = round(img.height * w / img.width)
        r = img.resize((w, h), Image.LANCZOS)
        wp = OUT / f'{stem}-{w}.webp'
        r.save(wp, 'WEBP', quality=WEBP_Q, method=6)
        results.append(wp)
        if jpeg:
            jp = OUT / f'{stem}-{w}.jpg'
            r.convert('RGB').save(jp, 'JPEG', quality=JPEG_Q,
                                  optimize=True, progressive=True)
            results.append(jp)
    return results


def lift_black_point(img, base):
    """Remap 0..255 -> base..255 per channel.

    A plain brightness increase would wash out the midtones and kill the
    rim light. Remapping only the black point preserves the whole tonal
    curve above it — the subject is untouched, the ground now matches."""
    out = img.convert('RGB')
    tables = []
    for c in range(3):
        b = base[c]
        tables.extend([round(b + (i / 255) * (255 - b)) for i in range(256)])
    return out.point(tables)


def build_hero():
    """Garden of the Gods. Kissing Camels formation with Pikes Peak behind —
    the most recognisable frame in Colorado Springs, and the source of the
    rock/pink colour bridge. Chosen over the wider Thunderbirds frame for the
    hero because its upper-left sky is genuinely empty, which is where the
    name has to live. The Thunderbirds frame moves to the closing section."""
    im = Image.open(SRC / 'IMG_1683.jpeg').convert('RGB')
    emit(im, 'gog', [2400, 1800, 1280, 900])
    tr = 3 / 4
    w = round(im.height * tr)
    left = max(0, min(im.width - w, round(im.width * 0.52) - w // 2))
    emit(im.crop((left, 0, left + w, im.height)), 'gog-portrait', [1000, 750, 560])
    print(f'  gog         {im.size} -> landscape + {w}x{im.height} portrait crop')

    im = Image.open(SRC / 'IMG_2276.JPG').convert('RGB')
    # Landscape: the full frame. Sky occupies the top ~55%, which is the
    # typography zone; we do not crop into it.
    emit(im, 'hero', [2400, 1800, 1280, 900])

    # Portrait crop for phones: keep the jets AND the summit in frame.
    # Jets sit near x=2050, summit near x=1750 in the 3896px original.
    target_ratio = 3 / 4
    h = im.height
    w = round(h * target_ratio)
    cx = 1830
    left = max(0, min(im.width - w, cx - w // 2))
    emit(im.crop((left, 0, left + w, h)), 'hero-portrait', [1000, 750, 560])
    print(f'  hero        {im.width}x{im.height} -> landscape + {w}x{h} portrait crop')


def build_portrait():
    im = Image.open(SRC / 'Headshot.jpg').convert('RGB')
    # Head-and-torso 4:5 crop. Full-body at small sizes makes the face
    # too small to read as a portrait.
    box = (90, 150, 690, 900)
    crop = im.crop(box)
    lifted = lift_black_point(crop, PAGE_BASE)
    emit(lifted, 'portrait', [600, 450])
    print(f'  portrait    crop {box} -> {crop.width}x{crop.height}, '
          f'black point lifted to rgb{PAGE_BASE}')


def build_avatar():
    """Tight face crop for the persistent corner/rail avatar. Small render
    size means the full torso portrait is unreadable here — this needs to be
    face-only to register at 48px."""
    im = Image.open(SRC / 'Headshot.jpg').convert('RGB')
    box = (285, 205, 495, 415)          # square, centred on the face
    face = lift_black_point(im.crop(box), PAGE_BASE)
    for w in (160, 96):
        face.resize((w, w), Image.LANCZOS).save(OUT / f'avatar-{w}.webp',
                                                'WEBP', quality=86, method=6)
    print(f'  avatar      face crop {box} -> 160/96 square')


def build_scenery():
    # Garden of the Gods — the source of the rock/pink colour bridge.
    rock = Image.open(SRC / 'IMG_1794.jpeg').convert('RGB')
    w = rock.width
    h = round(w * 9 / 16)
    top = round((rock.height - h) * 0.42)   # keep the formations, drop foreground scrub
    emit(rock.crop((0, top, w, top + h)), 'rock', [1600, 1100, 760])

    vista = Image.open(SRC / 'IMG_1683.jpeg').convert('RGB')
    h2 = round(vista.width * 9 / 16)
    top2 = round((vista.height - h2) * 0.38)
    emit(vista.crop((0, top2, vista.width, top2 + h2)), 'vista', [1600, 1100, 760])
    print('  rock/vista  16:9 crops emitted')


def build_logo():
    """Key white to transparent; rebuild at constant brand pink.

    alpha = 255 - min(r,g,b): pure white -> 0, saturated pink -> ~236,
    and anti-aliased edge pixels land proportionally in between, which is
    exactly the coverage mask we want. Letter counters (the holes in P
    and R) correctly become transparent and show the page behind."""
    im = Image.open(SRC / 'Logo.jpg').convert('RGB')
    px = im.load()
    out = Image.new('RGBA', im.size)
    op = out.load()

    # The raw mask tops out around 224 because the printed ink is not a
    # pure primary. Left alone the mark renders visibly muted against the
    # page. Normalise so the solid core reaches full opacity while the
    # anti-aliased edges keep their proportional falloff.
    peak = max(255 - min(px[x, y]) for y in range(im.height) for x in range(im.width))
    gain = 255 / peak

    for y in range(im.height):
        for x in range(im.width):
            r, g, b = px[x, y]
            a = min(255, round((255 - min(r, g, b)) * gain))
            op[x, y] = (*BRAND_PINK, a)
    # Trim to the mark's true bounding box so CSS sizing is predictable.
    bbox = out.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    out = out.crop(bbox)
    out.save(OUT / 'logo.png', 'PNG', optimize=True)

    for w in (720, 480):
        h = round(out.height * w / out.width)
        out.resize((w, h), Image.LANCZOS).save(OUT / f'logo-{w}.png', 'PNG', optimize=True)
    print(f'  logo        white keyed -> transparent, trimmed to {out.width}x{out.height}')


def build_ramsey():
    """Official Ramsey assets. 04_COMPLIANCE.md §1 is explicit:
    'Don't resize the graphics. Don't crop out, rearrange, or recolor the
    elements.' So these are emitted at their EXACT native aspect ratio,
    never cropped, never recoloured. Only resolution variants are made,
    which is required for responsive delivery and does not alter the mark.

    The shield already ships with an alpha channel, so it needs no keying
    to sit on a dark field — nothing about it is touched."""
    shield = Image.open(SRC / 'graphic-ramsey-trusted-stars.webp')
    assert shield.mode == 'RGBA', 'shield must retain its alpha'
    for w in (440, 300, 200):
        h = round(shield.height * w / shield.width)   # aspect locked
        shield.resize((w, h), Image.LANCZOS).save(OUT / f'ramsey-shield-{w}.webp',
                                                  'WEBP', quality=90, method=6, lossless=False)
    shield.save(OUT / 'ramsey-shield.png', 'PNG', optimize=True)

    net = Image.open(SRC / 'DaveRamsey.jpg').convert('RGB')
    assert net.width == net.height, 'network graphic must stay square'
    emit(net, 'ramsey-network', [800, 560, 380])
    print(f'  ramsey      shield {shield.size} (alpha kept), network {net.size} (square, uncropped)')


if __name__ == '__main__':
    print('Building assets ->', OUT)
    build_ramsey()
    build_hero()
    build_portrait()
    build_avatar()
    build_scenery()
    build_logo()

    total = sum(f.stat().st_size for f in OUT.iterdir() if f.is_file())
    print(f'\n{len(list(OUT.iterdir()))} files, {total/1024:.0f} KB total')
    for f in sorted(OUT.iterdir()):
        print(f'  {f.stat().st_size/1024:8.1f} KB  {f.name}')
