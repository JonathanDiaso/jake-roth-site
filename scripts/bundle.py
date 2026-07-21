#!/usr/bin/env python3
"""
Bundle src/ into ONE self-contained HTML file.

The published preview runs under a strict CSP that blocks every external
host — no font CDN, no image requests, nothing. So everything the page
needs has to travel inside the file:

  * fonts   downloaded from Google Fonts, latin subset only, inlined as
            @font-face data URIs. Linking the CDN would silently fall
            back to Times and quietly destroy the typography.
  * images  base64, one resolution each. srcset is collapsed because
            shipping four widths of the same photo as data URIs would
            multiply the payload for no benefit in a preview.
  * js      the ES modules are concatenated in dependency order with
            their import/export keywords stripped, since a bundled
            inline script cannot resolve relative module specifiers.

Output: dist/jake-roth.html — also drag-and-droppable onto any static host.

Run:  python3 scripts/bundle.py
"""

import base64
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
DIST = ROOT / 'dist'
FONTS = Path('/private/tmp/claude-501/-Users-jonathandiaso-Jake/'
             'a42fbb22-1526-45aa-b5fc-ac8270b9369c/scratchpad/fonts')

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36')

MIME = {'.webp': 'image/webp', '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg', '.png': 'image/png'}

# One resolution per image. Chosen for a good balance of fidelity and weight.
PICKS = {
    'hero':           'hero-1280.webp',
    'hero-portrait':  'hero-portrait-560.webp',
    'portrait':       'portrait-600.webp',
    'logo':           'logo-480.png',
    'ramsey-network': 'ramsey-network-560.webp',
    'ramsey-shield':  'ramsey-shield-300.webp',
}


def data_uri(path: Path) -> str:
    b64 = base64.b64encode(path.read_bytes()).decode()
    return f'data:{MIME[path.suffix.lower()]};base64,{b64}'


def build_fonts() -> str:
    """Latin-subset @font-face rules with the woff2 inlined."""
    css_path = FONTS / 'gf.css'
    if not css_path.exists():
        raise SystemExit('Run the Google Fonts fetch first (fonts/gf.css missing)')
    css = css_path.read_text()

    # Google's CSS labels each block with a /* subset */ comment. Keep latin
    # only — latin-ext, cyrillic and greek would triple the payload for
    # glyphs this page never renders.
    blocks = re.findall(r'/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})', css)
    out, seen = [], set()

    for subset, block in blocks:
        if subset != 'latin':
            continue
        m = re.search(r'url\((https://fonts\.gstatic\.com[^)]+\.woff2)\)', block)
        if not m:
            continue
        url = m.group(1)
        local = FONTS / (url.rsplit('/', 1)[-1])
        if not local.exists():
            subprocess.run(['curl', '-sfL', '-A', UA, url, '-o', str(local)], check=True)
        if url in seen:
            continue
        seen.add(url)
        b64 = base64.b64encode(local.read_bytes()).decode()
        out.append(block.replace(url, f'data:font/woff2;base64,{b64}'))

    kb = sum(len(b) for b in out) / 1024
    print(f'  fonts    {len(out)} latin faces inlined (~{kb:.0f} KB base64)')
    return '\n'.join(out)


def build_css() -> str:
    parts = []
    for name in ('tokens.css', 'base.css', 'sections.css', 'engine.css'):
        parts.append(f'/* ---- {name} ---- */\n' + (SRC / 'styles' / name).read_text())
    return '\n'.join(parts)


def build_js(assets: dict) -> str:
    """Concatenate modules in dependency order, stripping module syntax."""
    order = ['content.js', 'terrain.js', 'motion.js', 'engine.js', 'main.js']
    parts = []
    for name in order:
        code = (SRC / 'js' / name).read_text()
        code = re.sub(r'^\s*import\s+[^;]+;\s*$', '', code, flags=re.M)   # drop imports
        code = re.sub(r'^export\s+', '', code, flags=re.M)                # drop export kw
        parts.append(f'/* ---- {name} ---- */\n{code}')
    js = '\n'.join(parts)

    # Asset paths referenced from JS string literals
    js = js.replace("'assets/portrait-600.jpg'", f"'{assets['portrait']}'")
    js = js.replace("'assets/portrait-600.webp'", f"'{assets['portrait']}'")
    return js


def build_html() -> str:
    html = (SRC / 'index.html').read_text()
    assets = {k: data_uri(SRC / 'assets' / v) for k, v in PICKS.items()}

    # --- strip everything that would reach for the network ---
    html = re.sub(r'<link rel="preload".*?>', '', html, flags=re.S)
    html = re.sub(r'<link rel="preconnect".*?>', '', html, flags=re.S)
    html = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis[^>]*>', '', html)
    html = re.sub(r'<link rel="stylesheet" href="styles/[^>]*>', '', html)

    # --- hero <picture>: collapse four widths to one landscape + one portrait ---
    html = re.sub(
        r'<picture class="hero__media">.*?</picture>',
        (
            '<picture class="hero__media">\n'
            f'      <source media="(max-width: 47.999rem)" srcset="{assets["hero-portrait"]}">\n'
            f'      <img src="{assets["hero"]}" '
            'alt="Four Air Force Thunderbirds flying in tight formation above a snow-covered '
            'Pikes Peak, seen across the foothills from Colorado Springs." '
            'fetchpriority="high" decoding="async" width="3896" height="2173">\n'
            '    </picture>'
        ),
        html, flags=re.S)

    # --- ramsey network <picture>: drop the <source>, keep the img ---
    html = re.sub(r'<source type="image/webp"\s+srcset="assets/ramsey-network[^>]*>', '', html, flags=re.S)

    # --- remaining images: swap src, drop srcset/sizes ---
    for key, filename in PICKS.items():
        stem = filename.rsplit('-', 1)[0] if key != 'logo' else 'logo'
        html = re.sub(rf'src="assets/{re.escape(stem)}-\d+\.(?:webp|jpg|png)"',
                      f'src="{assets[key]}"', html)
    html = re.sub(r'\s+srcset="assets/[^"]*"', '', html)
    html = re.sub(r'\s+sizes="[^"]*"(?=[^>]*>)', '', html)

    # --- inline css + js ---
    css = f'/* ---- fonts ---- */\n{build_fonts()}\n{build_css()}'
    js = build_js(assets)

    body = re.search(r'<body>(.*)</body>', html, flags=re.S).group(1)
    body = re.sub(r'<script type="module" src="js/main\.js"></script>', '', body)
    title = re.search(r'<title>(.*?)</title>', html, flags=re.S).group(1)

    return (
        f'<title>{title}</title>\n'
        f'<style>\n{css}\n</style>\n'
        f'{body}\n'
        f'<script type="module">\n{js}\n</script>\n'
    )


if __name__ == '__main__':
    DIST.mkdir(exist_ok=True)
    out = DIST / 'jake-roth.html'
    print('Bundling ->', out)
    html = build_html()
    out.write_text(html)

    leaks = re.findall(r'(?:src|href)="(?!data:|#)([^"]+)"', html)
    leaks = [l for l in leaks if not l.startswith(('tel:', 'sms:', 'mailto:'))]
    print(f'  size     {len(html)/1024:.0f} KB single file')
    print(f'  external references remaining: {leaks if leaks else "none"}')
