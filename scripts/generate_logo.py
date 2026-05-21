#!/usr/bin/env python3
"""
Lumora Logo Generator
=====================
Generates the Lumora brand identity assets as SVG files.

Brand Identity:
  "Lumora" — luminous + ora (time/now). A dashboard that illuminates
  real-time business insights.

Logo Mark Architecture:
  The mark is a geometric composition of three elements:
  
  1. THE BEAM — A stylized "L" letterform built from two rounded
     rectangles with an indigo→violet gradient. The vertical pillar
     and horizontal base intersect to form the structural foundation.
     
  2. THE PRISM — A faceted crystal diamond in the upper-right quadrant
     representing the refraction of light into insight. Three interior
     facets create a 3D crystalline effect using layered violet tones.
     
  3. THE SPARK — A luminous white circle at the prism's apex with an
     SVG Gaussian blur glow, representing the "spark of insight."
     Subtle light rays radiate outward.
  
  The composition balances structural solidity (the L beam) with
  ethereal luminosity (the prism + spark), reflecting Lumora's
  purpose: grounded analytics illuminated by real-time clarity.

Coordinate System:
  - Icon/reference grid: 40×40
  - Horizontal logo: 200×40 (mark + wordmark)
  - Loading logo: 120×140 (centered stacked)
  - Favicon: 16×16 (simplified)
"""

import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = PROJECT_ROOT / "public"

# ═══════════════════════════════════════════════════════════════════
# Brand Colors
# ═══════════════════════════════════════════════════════════════════

COLORS = {
    "indigo":       "#6366f1",
    "indigo_deep":  "#4f46e5",
    "violet":       "#8b5cf6",
    "violet_mid":   "#7c3aed",
    "violet_light": "#a78bfa",
    "violet_pale":  "#c4b5fd",
    "white":        "#ffffff",
    "slate_900":    "#0f172a",
    "slate_50":     "#f8fafc",
}

# ═══════════════════════════════════════════════════════════════════
# SVG Building Blocks
# ═══════════════════════════════════════════════════════════════════

def _svg_gradient_defs():
    """Return the shared gradient definitions."""
    c = COLORS
    return f"""    <linearGradient id="lumora-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{c['indigo']}" />
      <stop offset="100%" stop-color="{c['violet']}" />
    </linearGradient>
    <linearGradient id="lumora-grad-vertical" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{c['indigo']}" />
      <stop offset="100%" stop-color="{c['indigo_deep']}" />
    </linearGradient>"""


def _svg_glow_filter():
    """Return the shared glow filter definition."""
    return """    <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>"""


def _svg_beam_l(x=0, y=0, fill_ref="url(#lumora-grad)"):
    """Render the 'L' beam structure at offset (x, y).

    Architecture:
      Vertical pillar: 10×24 px, rx=5 — the structural spine
      Horizontal base: 23×9 px, rx=5 — the foundation bar

    These two rounded rectangles overlap at the corner to form
    a continuous L-letterform with a smooth inner junction.
    """
    return f"""      <!-- L Beam: vertical pillar -->
      <rect x="{x+9}" y="{y+5}" width="10" height="24" rx="5" fill="{fill_ref}" />
      <!-- L Beam: horizontal base -->
      <rect x="{x+9}" y="{y+22}" width="23" height="9" rx="5" fill="{fill_ref}" />"""


def _svg_prism_crystal(x=0, y=0):
    """Render the faceted crystal prism at offset (x, y).

    Architecture — a diamond/rhombus split into three facets:
      - Upper facet (bright): absorbs direct light
      - Right facet (mid): catches side light
      - Left facet (dark): in shadow, creates depth

    Coordinates on local grid (before offset):
      Apex:     (29, 3.5)   — top point of the diamond
      Right:    (36.5, 12)  — right point
      Bottom:   (29, 20.5)  — bottom point
      Left:     (21.5, 12)  — left point
      Center:   (29, 12)    — internal vertex where facets meet
    """
    c = COLORS
    lines = []
    # Upper facet — bright, catches the light
    lines.append(
        f'      <polygon points="{x+29},{y+3.5} {x+36.5},{y+12} {x+29},{y+12}" '
        f'fill="{c["violet_light"]}" opacity="0.55" />'
    )
    # Right facet — medium tone
    lines.append(
        f'      <polygon points="{x+29},{y+12} {x+36.5},{y+12} {x+29},{y+20.5}" '
        f'fill="{c["violet_mid"]}" opacity="0.45" />'
    )
    # Left facet — darkest, creates 3D depth
    lines.append(
        f'      <polygon points="{x+21.5},{y+12} {x+29},{y+12} {x+29},{y+20.5}" '
        f'fill="{c["indigo_deep"]}" opacity="0.35" />'
    )
    # Facet edge lines for definition
    lines.append(
        f'      <polyline points="{x+21.5},{y+12} {x+29},{y+3.5} {x+36.5},{y+12} '
        f'{x+29},{y+20.5} {x+21.5},{y+12}" '
        f'fill="none" stroke="{c["violet_pale"]}" stroke-width="0.5" opacity="0.5" />'
    )
    return "\n".join(lines)


def _svg_spark_and_rays(x=0, y=0):
    """Render the insight spark and radiating light rays at offset (x, y).

    The spark sits at the prism apex. Three subtle light rays
    radiate downward-right, representing data illumination.
    """
    c = COLORS
    lines = []
    # Outer glow halo
    lines.append(
        f'      <circle cx="{x+29}" cy="{y+3.5}" r="5.5" '
        f'fill="{c["violet_light"]}" opacity="0.22" filter="url(#glow)" />'
    )
    # Inner glow
    lines.append(
        f'      <circle cx="{x+29}" cy="{y+3.5}" r="3" '
        f'fill="{c["violet_pale"]}" opacity="0.45" filter="url(#glow)" />'
    )
    # Core spark
    lines.append(
        f'      <circle cx="{x+29}" cy="{y+3.5}" r="2" fill="{c["white"]}" />'
    )
    # Light rays — three subtle beams radiating from the spark
    lines.append(
        f'      <line x1="{x+29}" y1="{y+5.5}" x2="{x+21}" y2="{y+17}" '
        f'stroke="{c["white"]}" stroke-width="0.6" opacity="0.25" />'
    )
    lines.append(
        f'      <line x1="{x+29}" y1="{y+5.5}" x2="{x+37}" y2="{y+13}" '
        f'stroke="{c["white"]}" stroke-width="0.6" opacity="0.2" />'
    )
    lines.append(
        f'      <line x1="{x+29}" y1="{y+5.5}" x2="{x+30}" y2="{y+22}" '
        f'stroke="{c["white"]}" stroke-width="0.5" opacity="0.15" />'
    )
    return "\n".join(lines)


def _svg_data_dots(x=0, y=0):
    """Render three tiny data-point dots suggesting analytics insight."""
    c = COLORS
    dots = [
        (35, 7.5),
        (38, 11),
        (34, 16),
    ]
    lines = []
    for dx, dy in dots:
        lines.append(
            f'      <circle cx="{x+dx}" cy="{y+dy}" r="1" '
            f'fill="{c["violet_light"]}" opacity="0.6" />'
        )
    return "\n".join(lines)


def _render_full_mark(x=0, y=0, beam_fill="url(#lumora-grad)"):
    """Render the complete logo mark: beam + prism + spark + dots."""
    return "\n".join([
        _svg_beam_l(x, y, fill_ref=beam_fill),
        _svg_prism_crystal(x, y),
        _svg_spark_and_rays(x, y),
        _svg_data_dots(x, y),
    ])


# ═══════════════════════════════════════════════════════════════════
# Logo Variant Generators
# ═══════════════════════════════════════════════════════════════════

def generate_icon_svg():
    """Icon mark (40×40) — the full architectural mark on a gradient pill.

    Used for: PWA icons, apple-touch-icon, favicon backing.
    """
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <defs>
{_svg_gradient_defs()}
{_svg_glow_filter()}
  </defs>
  <!-- Background pill -->
  <rect width="40" height="40" rx="8" fill="url(#lumora-grad)" />
  <g>
{_render_full_mark(beam_fill="url(#lumora-grad)")}
  </g>
</svg>"""


def generate_icon_white_svg():
    """Icon mark (40×40) — white beam variant for dark backgrounds.

    The beam is solid white; the prism and spark retain their violet tones
    so the brand identity remains recognizable.
    """
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <defs>
{_svg_glow_filter()}
  </defs>
  <g>
{_render_full_mark(beam_fill="#ffffff")}
  </g>
</svg>"""


def generate_favicon_svg():
    """Simplified favicon (16×16) — a reduced version for browser tabs.

    At this scale, the prism detail is replaced by a single spark dot
    and the L-beam is simplified to its essential geometry.
    """
    c = COLORS
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <defs>
    <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{c['indigo']}" />
      <stop offset="100%" stop-color="{c['violet']}" />
    </linearGradient>
  </defs>
  <rect x="3" y="2" width="4" height="9" rx="1.5" fill="url(#fg)" />
  <rect x="3" y="9" width="9" height="4" rx="1.5" fill="url(#fg)" />
  <circle cx="12.5" cy="3.5" r="1.25" fill="{c['violet_light']}" />
  <circle cx="12.5" cy="3.5" r="0.6" fill="{c['white']}" />
</svg>"""


def generate_horizontal_logo_svg():
    """Horizontal logo (200×40) — mark + wordmark for sidebar/header.

    The mark sits at the left; the wordmark "Lumora" follows at right
    in Geist Bold with adjusted letter-spacing for a polished logotype.
    """
    c = COLORS
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="200" height="40">
  <defs>
{_svg_gradient_defs()}
{_svg_glow_filter()}
  </defs>
  <!-- Logo mark -->
{_render_full_mark()}
  <!-- Wordmark -->
  <text x="49" y="27" font-family="Geist, system-ui, sans-serif" font-weight="700"
        font-size="22" fill="{c['slate_900']}" letter-spacing="0.5">
    Lumora
  </text>
</svg>"""


def generate_horizontal_logo_white_svg():
    """Horizontal logo (200×40) — white variant for dark sidebars.

    Same layout as the standard horizontal logo, but with white beam
    and white wordmark for dark backgrounds.
    """
    c = COLORS
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="200" height="40">
  <defs>
{_svg_glow_filter()}
  </defs>
  <!-- Logo mark -->
{_render_full_mark(beam_fill="#ffffff")}
  <!-- Wordmark -->
  <text x="49" y="27" font-family="Geist, system-ui, sans-serif" font-weight="700"
        font-size="22" fill="{c['white']}" letter-spacing="0.5">
    Lumora
  </text>
</svg>"""


def generate_loading_logo_svg():
    """Vertical loading logo (120×140) — centered stacked layout.

    Used on the dashboard loading screen. The mark is scaled up and
    centered above the wordmark with the tagline below.
    """
    c = COLORS
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
  <defs>
{_svg_gradient_defs()}
{_svg_glow_filter()}
  </defs>
  <!-- Logo mark — centered and scaled -->
  <g transform="translate(38, 8) scale(1.1)">
{_svg_beam_l(fill_ref="url(#lumora-grad)")}
{_svg_prism_crystal()}
{_svg_spark_and_rays()}
{_svg_data_dots()}
  </g>
  <!-- Wordmark -->
  <text x="60" y="78" text-anchor="middle" font-family="Geist, system-ui, sans-serif"
        font-weight="700" font-size="28" fill="{c['slate_900']}" letter-spacing="2">
    Lumora
  </text>
  <!-- Tagline -->
  <text x="60" y="98" text-anchor="middle" font-family="Geist, system-ui, sans-serif"
        font-weight="500" font-size="10" fill="{c['slate_900']}" opacity="0.35"
        letter-spacing="6">
    BUSINESS DASHBOARD
  </text>
</svg>"""


def generate_loading_logo_white_svg():
    """Vertical loading logo (120×140) — white variant for dark mode."""
    c = COLORS
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
  <defs>
{_svg_gradient_defs()}
{_svg_glow_filter()}
  </defs>
  <!-- Logo mark — centered and scaled -->
  <g transform="translate(38, 8) scale(1.1)">
{_svg_beam_l(fill_ref="url(#lumora-grad)")}
{_svg_prism_crystal()}
{_svg_spark_and_rays()}
{_svg_data_dots()}
  </g>
  <!-- Wordmark -->
  <text x="60" y="78" text-anchor="middle" font-family="Geist, system-ui, sans-serif"
        font-weight="700" font-size="28" fill="{c['white']}" letter-spacing="2">
    Lumora
  </text>
  <!-- Tagline -->
  <text x="60" y="98" text-anchor="middle" font-family="Geist, system-ui, sans-serif"
        font-weight="500" font-size="10" fill="{c['white']}" opacity="0.35"
        letter-spacing="6">
    BUSINESS DASHBOARD
  </text>
</svg>"""


# ═══════════════════════════════════════════════════════════════════
# Main Generator
# ═══════════════════════════════════════════════════════════════════

ASSETS = {
    "lumora-icon.svg":           generate_icon_svg,
    "lumora-icon-white.svg":     generate_icon_white_svg,
    "favicon.svg":               generate_favicon_svg,
    "apple-touch-icon.svg":      generate_icon_svg,  # same as icon
    "lumora-logo.svg":           generate_horizontal_logo_svg,
    "lumora-logo-white.svg":     generate_horizontal_logo_white_svg,
    "lumora-loading.svg":        generate_loading_logo_svg,
    "lumora-loading-white.svg":  generate_loading_logo_white_svg,
}

def generate_all():
    """Generate all Lumora logo SVG variants."""
    print("🎨  Generating Lumora brand assets...\n")

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    for filename, generator_fn in ASSETS.items():
        svg_content = generator_fn()
        path = PUBLIC_DIR / filename
        with open(path, "w") as f:
            f.write(svg_content)
        size_kb = os.path.getsize(path) / 1024
        print(f"  ✅  {filename:30s}  ({size_kb:5.1f} KB)")

    print(f"\n📁  All assets saved to: {PUBLIC_DIR}")
    print("✨  Done! Lumora logo generated.\n")


if __name__ == "__main__":
    generate_all()
