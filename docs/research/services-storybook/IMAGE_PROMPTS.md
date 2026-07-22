# Services Storybook — Image Prompts and Asset Plan

## Generator approach

Two asset classes are proposed:

1. **Exploratory layout mockups** — procedurally rendered with Python/Pillow to test composition, tint, text-safe zones, crop, and motif continuity.
2. **Recommended final research variants** — generated with a capable image model using the prompts below, then reviewed and converted to WebP. Final text must remain live in the frontend and must not appear in generated art.

The connected GitHub contents API used in this research can commit UTF-8 text but not binary image files. Binary variants are therefore delivered separately with exact target filenames.

## Global negative prompt

No final text, no readable words, no logos, no branded artwork, no Viberole-style botanical borders, no celestial ornament, no generic laptop, no handshake, no floating dashboards, no UI collage, no office stock photography, no photoreal people, no watermarks, no illegible pseudo-copy, no excessive props, no fantasy spellbook, no gold filigree overload.

## Shared art direction

Original editorial product visualisation of a tactile modern field guide for a Kenyan digital design studio; dark near-black brown leather; understated edge wear; warm uncoated paper; stitched binding; realistic layered page edges; restrained brass detail; premium but practical; abstract paper-relief illustration; recurring burnt-orange hand-drawn thread; neutral studio surface; soft directional light; generous blank composition area for accessible live interface text; coherent object across desktop and mobile.

---

## Desktop assets

### cover-desktop-field-guide-v01.webp

**Prompt**

Closed landscape field-guide book centred in a quiet studio environment, dark brown-black leather cover with fine grain and softened corners, shallow blind-debossed frame, subtle warm-metal title plate area left intentionally blank, a single burnt-orange thread emerging from the page block, visible layered cream page edges, practical modern craft object rather than antique decoration, slight top-down three-quarter view, soft directional shadow, generous neutral space around the book, no readable text.

- Generator: image model / procedural mockup
- Iteration: v01
- Viewport and crop: desktop 16:10, safe for 16:9
- State: closed cover
- Status: recommended
- Intended repository path: `src/assets/services-storybook/research/cover-desktop-field-guide-v01.webp`

### cover-desktop-field-guide-v02.webp

Same object but lower eye-level angle, stronger page-block depth, orange thread tucked at lower right, wider neutral background, no readable text.

- Iteration: v02
- Viewport: desktop 16:9
- State: closed cover
- Status: exploratory
- Path: `src/assets/services-storybook/research/cover-desktop-field-guide-v02.webp`

### prologue-desktop-three-routes-v01.webp

Open landscape field guide with stitched centre binding and three tactile chapter tabs. Left page contains an original abstract paper-relief map where three routes grow from one small burnt-orange mark; routes differ through peach, muted lilac, and sage paper layers without labels. Right page is mostly quiet warm paper with subtle rules and generous blank zones for live heading, introduction, navigation, and instruction. Realistic page depth, restrained material detail, no readable text.

- Viewport: desktop 16:10
- State: open prologue
- Status: recommended
- Path: `src/assets/services-storybook/research/prologue-desktop-three-routes-v01.webp`

### chapter-01-signal-to-structure-v01.webp

Open field-guide spread, warm cream paper with restrained peach tint. Left page: fragmented paper signals, small punched shapes, and loose route segments gradually align into one clear architectural pathway; burnt-orange line connects entry, information, action, and response; abstract and tactile, no screens. Right page mostly blank with four subtle horizontal content zones for live service copy. Three chapter tabs visible, first selected through shape and material contrast, no readable text.

- Viewport: desktop 16:10
- Chapter: Websites & Systems
- Status: recommended
- Path: `src/assets/services-storybook/research/chapter-01-signal-to-structure-v01.webp`

### chapter-01-signal-to-structure-v02.webp

Variant with the left illustration built from folded paper channels and embossed nodes rather than flat blocks; quieter peach tint; larger right-page text-safe field.

- Status: exploratory
- Path: `src/assets/services-storybook/research/chapter-01-signal-to-structure-v02.webp`

### chapter-02-reframe-reveal-v01.webp

Open field-guide spread, warm cream paper with a muted lilac and dusty-rose influence. Left page: one established abstract form seen through offset crop frames, translucent paper windows, registration marks, and material swatches; burnt-orange measuring thread reveals how the form is realigned rather than replaced. Right page has generous blank area and four subtle content zones. Second chapter tab visibly selected, no readable text, no logo mockups, no stationery collage.

- Viewport: desktop 16:10
- Chapter: Brand Identity
- Status: recommended
- Path: `src/assets/services-storybook/research/chapter-02-reframe-reveal-v01.webp`

### chapter-02-reframe-reveal-v02.webp

Variant using a hinged vellum overlay and one cut-paper silhouette moving from misalignment to alignment; minimal swatches and wider blank right page.

- Status: exploratory
- Path: `src/assets/services-storybook/research/chapter-02-reframe-reveal-v02.webp`

### chapter-03-continuous-rhythm-v01.webp

Open field-guide spread, warm cream paper with subdued sage and blue-green tint. Left page: varied abstract creative outputs—cards, strips, page fragments, campaign panels—move through one coherent stitched rhythm; burnt-orange line loops through request, review, revision, and delivery without icons or labels. Right page remains calm with four subtle live-copy zones. Third tab visibly selected, no clocks, no dashboards, no text.

- Viewport: desktop 16:10
- Chapter: Ongoing Design
- Status: recommended
- Path: `src/assets/services-storybook/research/chapter-03-continuous-rhythm-v01.webp`

### chapter-03-continuous-rhythm-v02.webp

Variant using a continuous folded paper ribbon passing through several output formats; slightly more editorial and less mechanical.

- Status: exploratory
- Path: `src/assets/services-storybook/research/chapter-03-continuous-rhythm-v02.webp`

### final-spread-convergence-v01.webp

Open field-guide final spread. Left page: the route, measuring thread, and continuous rhythm motifs converge into one small burnt-orange starting point shaped like an opening or threshold. Right page is the quietest paper field in the book with generous blank area for live headline, body, primary CTA, and chapter review. Three tabs remain available. No readable text and no closing-book cue.

- Viewport: desktop 16:10
- State: final CTA
- Status: recommended
- Path: `src/assets/services-storybook/research/final-spread-convergence-v01.webp`

---

## Mobile assets

### cover-mobile-field-notebook-v01.webp

Closed portrait field notebook on a quiet neutral studio surface, top-bound dark brown-black leather cover, fine grain and softened corners, blank debossed title field, thin burnt-orange thread bookmark, visible warm page block, coherent with desktop field guide, soft directional shadow, no readable text, no decorative clutter.

- Viewport: mobile 9:16
- State: closed cover
- Status: recommended
- Path: `src/assets/services-storybook/research/cover-mobile-field-notebook-v01.webp`

### chapter-mobile-signal-to-structure-v01.webp

Open portrait top-bound field notebook. Upper 40 percent contains the Websites & Systems abstract paper-relief illustration: fragmented signals aligning through a burnt-orange route on lightly peach-tinted paper. Lower 60 percent is quiet warm paper reserved for live heading, descriptor, four vertical beats, and controls. Compact three-tab selector area remains visually available, no readable text.

- Viewport: mobile 9:16
- State: open chapter page
- Status: recommended
- Path: `src/assets/services-storybook/research/chapter-mobile-signal-to-structure-v01.webp`

### chapter-mobile-reframe-reveal-v01.webp

Same mobile object and layout, muted lilac/dusty-rose paper, upper illustration uses crop frames and orange measuring thread, lower area blank for live copy.

- Status: exploratory
- Path: `src/assets/services-storybook/research/chapter-mobile-reframe-reveal-v01.webp`

### chapter-mobile-continuous-rhythm-v01.webp

Same mobile object and layout, subdued sage/blue-green paper, upper illustration uses varied outputs connected by continuous orange stitch, lower area blank for live copy.

- Status: exploratory
- Path: `src/assets/services-storybook/research/chapter-mobile-continuous-rhythm-v01.webp`

## Review checklist for every generated variant

- Is it recognisably the same book system on desktop and mobile?
- Does it preserve the required live-text area?
- Is the image understandable without copying the body copy literally?
- Are there any accidental readable words or pseudo-text?
- Does the orange motif perform the correct chapter function?
- Is the chapter tint subtle?
- Does it avoid restricted clichés and proprietary visual imitation?
- Can it crop safely at the intended viewport?
- Is material detail visible without making the interface visually noisy?
- Is the selected chapter discernible by more than colour?
