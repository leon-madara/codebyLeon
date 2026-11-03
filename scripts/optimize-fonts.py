"""Create full WOFF2 fonts and small subsets for two fixed display headings.

Requires fonttools[woff] and Brotli. An existing project-local installation in
.preview-speed-tools is supported without changing application dependencies.
Run from any directory: python scripts/optimize-fonts.py
"""

from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
LOCAL_TOOLS = ROOT / ".preview-speed-tools"
if LOCAL_TOOLS.is_dir():
    sys.path.insert(0, str(LOCAL_TOOLS))

from fontTools.ttLib import TTFont
from fontTools.ttLib.woff2 import WOFF2FlavorData
from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen


FONT_PATHS = (
    "original-hero/quikhand.ttf",
    "original-hero/candy.ttf",
    "original-hero/handwritten.otf",
    "original-hero/gladolia.otf",
    "nexa-rust-slab-black-shadow-01.otf",
    "take-cover-regular.ttf",
    "overload-regular.otf",
    "overload-burn-regular.otf",
    "bold-doodle-regular.otf",
    "edo-regular.ttf",
)

# These are the only strings rendered in these two faces. Full WOFF2 faces
# remain available in CSS for future characters outside these exact ranges.
# Keep source locations documented so changing copy is an explicit choice.
REALITY_TITLE = "Your Business Is Established."  # reality-check.tsx: introTitle
FOUNDER_FILM_OPENING = "First impressions happen in seconds."  # founder.tsx: founder-film-opening
STATIC_HEADINGS = (
    ("nexa-rust-slab-black-shadow-01.otf", REALITY_TITLE, "reality-check.tsx"),
    ("take-cover-regular.ttf", FOUNDER_FILM_OPENING, "founder.tsx"),
)

# Use the font engine already bundled with Next to independently verify the
# shaped glyph paths and positions for current text, with every available
# OpenType feature enabled separately as well as the default feature set.
SHAPING_CHECK = r"""
const fs = require('fs');
const create = require('next/dist/compiled/@next/font/dist/fontkit').default;
const [source, output, text] = process.argv.slice(1);
const original = create(fs.readFileSync(source));
const subset = create(fs.readFileSync(output));
for (const features of [undefined, ...original.availableFeatures.map(tag => [tag])]) {
  const snapshot = font => {
    const run = font.layout(text, features);
    return JSON.stringify({
      paths: run.glyphs.map(glyph => glyph.path.toSVG()),
      positions: run.positions,
      direction: run.direction,
    });
  };
  if (snapshot(original) !== snapshot(subset)) {
    throw Error(`Shaping changed: ${source}; features=${features}`);
  }
}
"""


def table_bytes(font, tag):
    data = font.getTableData(tag)
    if tag == "head":
        # WOFF2 updates checkSumAdjustment and the compression marker (flag
        # bit 11). Neither changes glyphs, layout or font shaping semantics.
        data = bytearray(data)
        data[8:12] = bytes(4)
        data[16] &= ~0x08
        data = bytes(data)
    return data


def validate(source_path, output_path):
    with TTFont(source_path, recalcBBoxes=False, recalcTimestamp=False) as original:
        with TTFont(output_path, recalcBBoxes=False, recalcTimestamp=False) as converted:
            original_tags = set(original.reader.keys())
            converted_tags = set(converted.reader.keys())
            # FontTools drops DSIG when changing containers. Permit only an
            # empty signature placeholder; reject removal of a real signature.
            if "DSIG" in original_tags and "DSIG" not in converted_tags:
                if original.getTableData("DSIG") != bytes.fromhex("0000000100000000"):
                    raise ValueError(f"Cannot preserve digital signature: {source_path.name}")
                original_tags.remove("DSIG")
            if original_tags != converted_tags:
                raise ValueError(f"Font tables changed: {source_path.name}")
            # Compare every table, including outlines, metrics, kerning and
            # shaping. No subsetting or outline/WOFF2 transforms are enabled.
            for tag in original_tags:
                if table_bytes(original, tag) != table_bytes(converted, tag):
                    raise ValueError(f"Font table {tag} changed: {source_path.name}")
            if original.getGlyphOrder() != converted.getGlyphOrder():
                raise ValueError(f"Glyph order changed: {source_path.name}")
            if original["cmap"].getBestCmap() != converted["cmap"].getBestCmap():
                raise ValueError(f"Character mapping changed: {source_path.name}")


def create_heading_subset(relative, text, source_component):
    component = ROOT / "src" / "components" / "home" / source_component
    if text not in component.read_text(encoding="utf-8"):
        raise ValueError(f"Heading copy changed in {source_component}; update STATIC_HEADINGS")
    source = ROOT / "public" / "fonts" / relative
    output = source.with_name(source.stem + "-heading.woff2")
    options = subset.Options()
    options.layout_features = ["*"]
    options.layout_scripts = ["*"]
    options.layout_closure = True
    options.glyph_names = True
    options.hinting = True
    options.legacy_kern = True
    options.notdef_outline = True
    options.recommended_glyphs = True
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.name_legacy = True
    with TTFont(source, recalcBBoxes=False, recalcTimestamp=False) as font:
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(text=text)
        subsetter.subset(font)
        retained = subsetter.glyphs_retained
        font.flavor = "woff2"
        font.flavorData = WOFF2FlavorData(transformedTables=set())
        font.save(output, reorderTables=False)
    with TTFont(source) as original, TTFont(output) as converted:
        expected = {code: name for code, name in original.getBestCmap().items() if chr(code) in text}
        if converted.getBestCmap() != expected:
            raise ValueError(f"Subset cmap changed: {relative}")
        for tag, fields in (("head", ("unitsPerEm",)),
                            ("hhea", ("ascent", "descent", "lineGap")),
                            ("OS/2", ("sTypoAscender", "sTypoDescender", "sTypoLineGap", "usWinAscent", "usWinDescent"))):
            for field in fields:
                if getattr(original[tag], field) != getattr(converted[tag], field):
                    raise ValueError(f"Subset line metrics changed: {relative}")
        original_glyphs = original.getGlyphSet()
        converted_glyphs = converted.getGlyphSet()
        for name in retained:
            if original["hmtx"][name] != converted["hmtx"][name]:
                raise ValueError(f"Subset advance metrics changed: {relative}, {name}")
            before = DecomposingRecordingPen(original_glyphs)
            after = DecomposingRecordingPen(converted_glyphs)
            original_glyphs[name].draw(before)
            converted_glyphs[name].draw(after)
            if before.value != after.value:
                raise ValueError(f"Subset glyph outline changed: {relative}, {name}")
    subprocess.run(["node", "-e", SHAPING_CHECK, str(source), str(output), text], cwd=ROOT, check=True)
    unicode_range = ", ".join(f"U+{code:04X}" for code in sorted(expected))
    print(f"HEADING {output.name}: {output.stat().st_size:,} bytes; "
          "cmap, retained outlines/metrics, default and individual feature shaping validated")
    print(f"  unicode-range: {unicode_range};")
    return source.with_suffix(".woff2").stat().st_size, output.stat().st_size


def main():
    source_total = 0
    output_total = 0
    for relative in FONT_PATHS:
        source = ROOT / "public" / "fonts" / relative
        output = source.with_suffix(".woff2")
        with TTFont(source, recalcBBoxes=False, recalcTimestamp=False) as font:
            font.flavor = "woff2"
            # Brotli compression alone keeps original outline and shaping
            # table bytes intact and makes validation straightforward.
            font.flavorData = WOFF2FlavorData(transformedTables=set())
            font.save(output, reorderTables=False)
        validate(source, output)
        before = source.stat().st_size
        after = output.stat().st_size
        source_total += before
        output_total += after
        print(f"{relative}: {before:,} -> {after:,} bytes; font semantics validated")
    saving = source_total - output_total
    print(f"TOTAL: {source_total:,} -> {output_total:,} bytes; "
          f"saved {saving:,} ({saving / source_total:.1%})")
    full_total = 0
    heading_total = 0
    for relative, text, component in STATIC_HEADINGS:
        before, after = create_heading_subset(relative, text, component)
        full_total += before
        heading_total += after
    print(f"HEADINGS: {full_total:,} -> {heading_total:,} bytes; "
          f"additional saving {full_total - heading_total:,} bytes")


if __name__ == "__main__":
    main()
