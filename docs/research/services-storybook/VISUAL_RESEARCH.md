# Services Storybook — Visual Research and Direction

## Recommended direction: The Working Field Guide

The strongest direction is an original **working field guide for a modern Kenyan creative studio**: tactile enough to feel collected and useful, but controlled enough to hold accessible live interface text.

It should not resemble a fantasy storybook, antique scrapbook, or luxury stationery advert. The object is a serious working book with evidence of use: dark leather, compressed page edges, stitched binding, restrained brass details, cloth bookmarks, pencil-like diagrams, and a single orange line that changes purpose from chapter to chapter.

## Core visual idea

The book records how a business becomes clearer.

- In **Websites & Systems**, the orange line behaves like a route or wiring diagram. Fragmented signals align into a usable structure.
- In **Brand Identity**, the line behaves like a measuring thread or crop mark. It reveals, reframes, and reconnects an established form.
- In **Ongoing Design**, the line behaves like a continuous production path. Different outputs move through one rhythm.
- In the **final spread**, the three line behaviours meet at one simple starting point.

The motif connects the chapters without repeating the same illustration.

## Material system

### Cover

- Deep brown-black leather, closer to well-used field equipment than decorative vintage leather.
- Fine grain, softened corners, subtle edge wear, and a shallow blind-debossed rectangular frame.
- Title treatment: `OUR SERVICES`, centred, with restrained warm-metal foil or blind embossing.
- Small CodeByLeon orange thread mark or line symbol, not a large logo lockup.
- No imitation clasps, celestial diagrams, botanical corners, or Viberole-like tabs.

### Paper

- Warm uncoated stock with visible but quiet fibre.
- Slightly uneven page edges and compressed page depth.
- Paper remains clean enough for interface contrast.
- Chapter tint should affect approximately 5–10% of the perceived page colour, not become a coloured background panel.

### Binding and depth

- Desktop: stitched centre binding, narrow gutter shadow, visible layered page block, cover extending slightly beyond paper.
- Mobile: top-bound field notebook logic, with the same leather, thread, page stock, and edge treatment.
- Page depth should be conveyed by layered edges and shadows, not exaggerated 3D thickness.

### Bookmarks and navigation

- Three durable fabric or leather tabs.
- Tabs display direct labels or short labels with visible selected state.
- Recommended desktop position: outside the right page edge.
- Recommended mobile pattern: compact horizontal chapter selector above or below the top image, plus explicit previous/next buttons.
- Tabs should look attached to the object but behave like standard accessible controls.

## Typography and live-text space

- Use CodeByLeon display typography selectively for the cover and chapter numeral.
- Use Inter or the production body font for descriptors, beats, controls, and CTAs.
- Generated images must contain **no final page copy**.
- Preserve a quiet text field on the right desktop page and the lower mobile page.
- Illustration must not cross the central gutter or sit behind body copy.
- Do not bake chapter numbers, button labels, or service titles into images.

## Composition by state

### 1. Closed desktop cover

- Landscape viewport, book centred with breathing room.
- Slight top-down angle, but not so steep that the cover becomes a flat rectangle.
- Cover occupies roughly 58–68% of viewport width.
- A narrow ribbon or orange thread may emerge from the lower page edge.
- Background should be a neutral CodeByLeon studio surface, not a styled desk full of props.
- Recommended asset crop: 16:10 or 16:9.

### 2. Open desktop prologue

- Left page: abstract map of three routes beginning from one mark, rendered through paper relief, cut shapes, or drawn line—not text labels.
- Right page: largely blank, with subtle rules or page furniture for live heading, introduction, chapter choices, and instruction.
- Three chapter tabs visible.
- Spine and page depth must remain legible.

### 3. Websites & Systems spread

- Tint: cream with restrained peach.
- Left-page visual: scattered marks, paths, and blocks resolving into an orderly public-facing structure. Think architectural plan meets service journey, not a dashboard.
- The orange line becomes a route connecting entry, information, action, and response.
- Right page remains text-safe with four clear beat zones.
- Avoid screens, browser chrome, laptop mockups, code snippets, and floating UI cards.

### 4. Brand Identity spread

- Tint: cream with muted lilac or dusty rose.
- Left-page visual: one established shape seen through movable frames, material swatches, registration marks, and a reveal layer. The idea is alignment, not decoration.
- The orange line becomes a measuring thread, crop line, or hinge connecting the earlier and current form.
- Avoid moodboard collages, logo grids, generic stationery mockups, and cosmetic before/after splits.

### 5. Ongoing Design spread

- Tint: cream with subdued sage or blue-green.
- Left-page visual: varied physical outputs—cards, strips, tickets, page fragments, campaign panels—moving through one continuous path or binding rhythm.
- The orange line becomes a conveyor-like stitch or recurring pulse.
- Avoid clocks, lightning bolts, productivity dashboards, and piles of sticky notes.

### 6. Final CTA spread

- Left page: the three chapter motifs converge into a single small orange starting point or doorway.
- Right page: the quietest spread in the book, preserving generous room for headline, body, primary CTA, and chapter review.
- Keep the book open; do not visually cue a compulsory closing animation.

### 7. Closed mobile cover

- Portrait field notebook, top hinge visible.
- Same leather, embossing logic, orange thread, and page block as desktop.
- Object fills most of the width but leaves enough background to communicate its physical shape.
- Recommended crop: 9:16.

### 8. Open mobile chapter page

- Page turns bottom-to-top.
- Chapter image occupies the upper 35–42% of the page.
- Lower area is calm paper reserved for heading, descriptor, four beats, and controls.
- Chapter selector stays compact and conventional enough to understand immediately.
- Preserve the same visual motif and tint as desktop.

## Desktop motion direction

- The cover opens once through a controlled left-to-right hinge.
- Major states only: cover, prologue, three chapters, final spread.
- Pages turn sideways with visible paper thickness and a restrained curl.
- A direct chapter selection turns to the selected spread without simulating every skipped page.
- A fast wheel event advances no more than one major state.
- Reduced motion swaps 3D turns for direct state changes or a short fade.

## Mobile motion direction

- The cover lifts upward on a top hinge.
- Pages turn from bottom to top as in a field notebook.
- The physical materials and motif remain the same, even though the layout changes.
- The image sits above the words; the page is not a scaled desktop spread.
- Tap, scroll, and swipe may enhance movement, but visible chapter, previous, and next controls remain the primary interaction contract.

## Optional beat focus behaviour

Recommended: selecting or focusing a beat subtly changes one local detail in the left-page illustration—such as which segment of the orange line is emphasised—while all four beat titles and bodies remain visible.

Do not replace the entire image for each beat. That would recreate twelve hidden states, increase asset cost, and weaken the “one spread per service” decision.

## Visual alternatives considered

### A. Premium heritage ledger

Dark leather, brass corners, deckled paper, engraved ornament.

**Rejected as the lead:** too ceremonial and luxury-coded; risks visual similarity to existing book references and can overpower clear service content.

### B. Bright cut-paper studio book

Bold coloured paper, oversized shapes, collage energy.

**Rejected as the lead:** strong personality but colour competes with text, chapter tints become less meaningful, and the object can feel like a campaign rather than a durable service interface.

### C. Photographic documentary notebook

Real Kenyan business environments photographed and mounted into the book.

**Rejected as the lead:** sourcing and releases are heavier; one photograph can over-specify sector, location, or client identity; stock photography risks cliché.

### D. Working Field Guide — recommended

Material realism plus original abstract editorial illustration.

**Why it wins:** coherent across desktop and mobile, easy to generate without proprietary imitation, leaves room for live text, expresses process without generic technology imagery, and can carry CodeByLeon’s orange motif.

## Accessibility and production notes

- Maintain a text contrast target consistent with WCAG AA.
- Generated paper texture must not reduce body-copy legibility.
- Images are decorative/supporting; meaningful service information remains live text.
- Provide deliberate neutral-paper fallback art.
- Keep selected tab state visible by more than colour alone.
- Preserve focus indication above the physical-book decoration.
- Test the object at 320px width and at short desktop viewports.
- Do not make page-edge dragging the only navigation method.
