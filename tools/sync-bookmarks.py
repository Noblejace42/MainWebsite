"""Rebuild the root bookmark pages after editing a relocated project.

With scripting enabled they forward the complete URL. Without it, the same
static content renders at the original address, including fragment targets.
"""
from html import escape
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
projects = root / "projects"
pages = [*projects.glob("*.html"), *(projects / "astral-axial").glob("*.html")]
for page in sorted(pages):
    if page.name in {"index.html", "nav.html"}:
        continue
    target = page.relative_to(root).as_posix()
    content = page.read_text()
    # All project scripts use ordinary HTML script elements. Native noscript
    # content, anchors, styles, and form labels stay in the static rendition.
    static = re.sub(r"<script\b[^>]*>.*?</script\s*>", "", content, flags=re.I | re.S)
    head = f'''<head>
  <!-- Generated from {target} by tools/sync-bookmarks.py. -->
  <script>location.replace(new URL("{target}" + location.search + location.hash, location.href));</script>
  <base href="{escape(target)}">
  <link rel="canonical" href="{page.name}">'''
    static = static.replace("<head>", head, 1)
    static = static.replace("</head>", "<style>html { scroll-behavior: auto }</style>\n</head>", 1)
    (root / page.name).write_text("\n".join(line.rstrip() for line in static.splitlines()) + "\n")
