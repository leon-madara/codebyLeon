# Article layout and reader QA

final result: passed

Checked locally in C:\Users\Leon Madara\Dev Mode\codebyLeon on codex/codebyleon-alternate, HEAD 25e1242 plus existing uncommitted work and this scoped change. This is an agent review, not independent review.

## Visual truth and evidence

- Source: C:\Users\LEONMA~1\AppData\Local\Temp\codex-clipboard-e36481b7-259f-466e-979a-0027886484cc.png (1981 x 1066).
- Source: C:\Users\LEONMA~1\AppData\Local\Temp\codex-clipboard-6b57b9f7-3494-45f9-a11a-dec9a1eb7522.png (1567 x 870).
- HTML: codebyleon_article_designs_code_lab_studio GOOD.html.
- Evidence folder: C:\Users\Leon Madara\.codex\visualizations\2026\10\20\01a15992-3e60-78b0-8132-d362be6d82bc.
- Full composition comparison: design-comparison.png contains both references and the rendered desktop cards/ledger. Reference two-column widths are intentionally replaced with the user's approved three-area arrangement. Screenshots normalized proportionally for the comparison board; no pixel-for-pixel claim across these different compositions.
- Desktop browser: 1440 x 1000 CSS pixels; viewport capture 1430 x 1000 raster pixels excluding the 10px scrollbar, scale 1. articles-desktop.png and articles-dark.png.
- Mobile browser: 390 x 844 CSS pixels; reader-mobile.png (380px content width excluding scrollbar) and articles-mobile.png (section capture). Source has no mobile reference; stacking follows featured, spotlight, ledger.
- Focused reader evidence: reader-code.png shows sticky rail plus dotted compact code panel. title-checks.json records all six reader title checks at both widths.

## Fidelity review

- Fonts: retained Space Grotesk primary lines and Fraunces italic accent lines. Scoped Inter body text and IBM Plex Mono metadata match the guide. Existing shared handwritten section label retained to fit the surrounding site.
- Layout: featured card left, black spotlight centre and six numbered rows right on desktop. Tablet places both cards above the ledger; mobile stacks all three areas. Both cards intentionally show the first article as specified by the user.
- Colours: existing warm paper, ink and orange tokens match guide; spotlight remains black in both themes as requested. Light/dark checked visually.
- Images: existing real article WebP assets replace placeholder diagrams. Native responsive srcSet selects the 480px mobile derivative; both images loaded. No new illustrative assets or claims introduced.
- Content: titles, descriptions and article bodies preserved from articles.json. No new code examples added to articles that do not have them. Both title colours remain single untruncated lines after font/layout settlement; all 12 reader checks passed with no page overflow. Homepage all eight article headings also fit at 390px and desktop.

## Behaviour and validation

- Featured link opens its matching reader; all six article URLs loaded with matching headings. Spotlight points to the same first article and ledger points to the six existing routes.
- Rail measured at 175px below a 151px header after scrolling; it stays 24px beneath header. Existing mobile bottom sharing bar preserved.
- Dotted code panel: 12px monospace with 17.4px line height, no added line padding. Raw clipboard payload matched 138 characters of source code, excluding visual line numbers. Simulated clipboard denial showed actionable failure feedback. Temporary browser instrumentation was cleared by reload.
- Focused ESLint passed for five changed TSX files. Next Webpack production build passed with approved network access for reference fonts. Build skips TypeScript checks per existing config.
- Separate TypeScript run still reports existing socket.io-client/socket.io missing in websocket examples and configurator.tsx:384 unreachable nullish fallback. None in changed article files.
- git diff --check passed.

## Comparison history and limits

Initial automated samples ran before font hydration; settled checks passed for every reader. Title fitting was hardened to ignore zero-width/detached measurements and run before client paint. A captureBeyondViewport screenshot omitted ledger glyphs; replaced with an ordinary viewport capture and verified the actual visible ledger. Archive hover now underlines the primary line without recolouring it, preserving two colours.

No actionable P0/P1/P2 visual findings remain. No deployment, commit or push performed. Real-device touch, every browser, and assistive technology testing were not performed.

## Added chapter panel (2026-10-20)

final result: passed

Reference: C:\Users\LEONMA~1\AppData\Local\Temp\codex-clipboard-4ef40364-20e6-4612-ba38-c2927358d0e5.png, 1686 x 1002 pixels. Browser comparison: chapter-comparison.png in the evidence folder; source and implementation are proportionally scaled, with intentional preservation of the current reader title/header/real imagery. Focus is the right-hand chapter panel rather than a reader redesign.

- Compact paper card, thin border, small orange mono label/numbers and muted 12px chapter links match the reference. Current reader fonts and colour tokens retained. No image assets changed.
- Desktop evidence chapters-desktop.png captured at 1440 x 1000 CSS pixels. Panel appears beside the current article header and remains visible while scrolling; chapters-sticky.png shows the scrolled state. Article retains its maximum 760px width.
- Below 1200px the same panel appears after the cover and before the article body. Mobile evidence chapters-mobile.png captured at 390 x 844 CSS pixels; no horizontal overflow.
- All six articles checked: 4 headings in the first article, 3 in each remaining article. Every chapter link resolves to an H2 with exactly matching text; repeated heading labels would have distinct source-line IDs. Article content was not changed.
- Desktop jump settled at 174.8px beneath a 151px sticky header; both sidebars measured at 175px. Mobile jump settled at 151.7px beneath a 127px header. Keyboard-accessible native fragment links and focusable target headings used.
- Focused ESLint and final Next Webpack build passed. Build continues to skip TypeScript checking by existing configuration. Whitespace diff check passed; no new browser console errors observed.
- No actionable visual findings; no new dependencies, commit, push or deployment.

## Restored original Studio strip (2026-10-20)

Source identified directly in main:src/pages/BlogPostPage.tsx, Subnav Strip, and main:src/styles/sections/blog-post.css. Original includes THE STUDIO. centre badge with pulsing dot, category/issue left, Archive 2026 right, height 58px. Restored beneath the current article switcher using current theme tokens. Issue/category now reflect the selected article rather than the old hardcoded Strategy / Issue 04. Original centre-only mobile arrangement preserved. Pulsing dot respects reduced motion.

Visually checked studio-desktop.png at 1440 x 1000 and studio-mobile.png at 390 x 844, in the existing evidence folder. Titles still fit one line per colour once the page fonts/layout settle. Desktop header now measures 209px, with sidebars at 233px and chapter target at 234.8px. Mobile header measures 185px and target 209.7px. Both clear the header by about 24px. Existing header measurement drives offsets automatically; no new fixed scroll offsets introduced.

Scoped ESLint and Next Webpack production build passed; git diff --check passed. No commit, push or deployment. Live website fetch was unavailable, so provenance was verified in the original repository branch rather than claimed as live inspection.

final result: passed

## Share-control brand colours (2026-10-20)

Guide source: codebyleon_article_designs_code_lab_studio GOOD.html, rail-icon-x/linkedin/github/copy hover and focus rules. Added matching classes to existing share controls without changing destinations or copy behaviour.

Verified all four hover states in both themes: X #000 light / #fff dark with inverse icon; LinkedIn #0a66c2; GitHub #24292f light / #6e5494 dark with #8957e5 border; Copy Link uses signal foreground/background. Real Tab navigation verified focus-visible on all four controls in both themes with the correct colour token. Copy success retained its check icon/message and green background. Existing focus outline retained, and hover lift is disabled with reduced motion.

Evidence: share-brand-checks.json (16 hover/focus checks), share-brand-hover.png in the session evidence folder. Focused ESLint for article-controls.tsx and git diff --check passed. This cosmetic change was checked in the running Next dev server; a production build was not repeated for this scoped styling change.

final result: passed

## Article three blue-heading trial (2026-10-20)

Only how-professional-website-increases-inquiries receives the blueChapters body class. Three H2 chapter headings use #176bb6 on light paper and #56aff0 on dark ink. H3/H4, body text, main title, chapter navigation and other articles retain existing colours. Scope is deliberately a one-article trial.

Browser verified all three computed heading colours in both themes; neighbouring article one remained neutral. Screenshots article-three-blue-light.png and article-three-blue-dark.png saved in session evidence folder. Contrast ratios calculated with sRGB relative luminance; both exceed 4.5:1, including the stricter normal-text threshold, while headings are 30px desktop / 26px mobile. Focused page ESLint and diff whitespace check passed. No production build repeated for this two-rule styling trial.

final result: passed

## Cube selector, routed article turns and all-article blue headings (2026-10-20)

final result: passed

Approved direction: the user's numbered-square sketch and discussion: Article selector, previous/next arrows, square current number, X of 6 count, swipe left/right for sequential movement, tap for a title list, synchronized article and number cube faces. Existing navbar cube motion is the local style reference. This is functional UI motion, not a new image asset.

### Implementation and constraints

- Blog-only layout keeps ArticleTurnProvider mounted across existing Next routes. Server-rendered article content, metadata, canonical URLs and direct links remain routed normally. No dependency or lockfile changes.
- ArticleSelector replaces three repeated numbered pills with a square number and bounded arrows. A shared Radix dialog lists all six real article titles, marks the current one and supports Escape/focus restoration. First/last arrows disable; the last article no longer wraps its Keep reading link to the first.
- For a turn, the provider makes inert, aria-hidden visual copies of the outgoing/incoming article and number faces; copied IDs are removed. Real article nodes remain the canonical content. One GSAP timeline turns both rotors through the same 90-degree angle in 0.7s; previous reverses direction. Only the visible article area turns; header, share rail and chapter rail stay steady. The mobile bottom share bar stays outside the article overlay.
- Route readiness waits for fonts and cover decoding, bounded to 1.5s. A 10s pending-navigation timeout and 4s committed-render timeout remove overlays and unlock controls. Rapid inputs are ignored while pending. Route cancellation, resize and unmount clear the overlays; GSAP contexts revert on route changes. Keyboard focus returns to the number after a completed change.
- Native pointer capture handles horizontal swipes on the number only, preserving touch-action: pan-y. Minimum horizontal movement 40px and horizontal/vertical ratio 1.3 prevent ordinary vertical movement being treated as a chapter change. Cancelled gestures suppress accidental picker clicks. A subsequent keyboard action clears swipe suppression.
- Reduced motion changes routes without creating cube overlays. Title selection uses the same turn after the dialog closes. Keep reading uses the same handler; modified-click links retain native browser behaviour.
- Latest user correction supersedes the one-article colour trial above: all six article bodies now use #176bb6 H2 headings in light mode and #56aff0 in dark mode. Existing measured contrast is 4.92:1 and 7.76:1. H3/H4, paragraphs, main two-colour titles and share colours are unchanged.

### Current verification

- article-selector-checks.json records selector/motion/recovery checks; all-article-blue-checks.json records six articles in both themes.
- Forward rotation sampled over 55 frames: article and number angles matched within 0.1 degree; reverse mid-turn both measured -27.50 degrees. Final URL, number, article content and counter matched; overlays were removed and real content was interactive.
- Rapid triple previous clicks advanced exactly one article. Direct title choice to six, last next-disabled and first previous-disabled checked. Enter opens the title list; Escape closes it and restores focus. Keyboard-after-swipe also passed.
- Swipe recognition exercised with actual browser pen-pointer input in both directions. Synthetic pointer cancellation did not navigate or open the picker. Reduced-motion next and direct selection passed. The in-app browser cannot dispatch native touch events, so physical finger scrolling/swiping remains unverified.
- A separate tab stalled only the article-five Fetch request. After the timeout the selector unlocked and overlays cleared; choosing article three recovered successfully. The isolated tab was then closed, removing its request interception.
- Viewports 320, 390, 768 and 1440px showed no page/selector overflow. All six main titles fit in both themes. All H2 colours matched expected values in twelve article/theme combinations.
- Keep reading navigated through the turn. Chapter navigation after switching landed at 237.4px beneath a 211px header; share rail stayed at 235px. No browser console errors in the final main preview.
- Focused ESLint across five changed TSX files passed; final Next Webpack production build passed; whitespace diff check passed. The build still skips TypeScript checks by existing configuration. Separate full TypeScript checks report the existing websocket socket.io/socket.io-client dependencies and configurator.tsx:384 error, outside these files. A transient generated-route-type mismatch after adding the layout cleared after Next regenerated route types.

### Evidence and review boundaries

Evidence folder: C:\Users\Leon Madara\.codex\visualizations\2026\10\20\01a15992-3e60-78b0-8132-d362be6d82bc.

- article-selector-desktop.png: stable selector and reader, 1440 x 1000 CSS viewport.
- article-selector-mobile.png: mobile selector and reader, 390 x 844 CSS viewport.
- article-title-picker.png: title-list dialog and current marker.
- article-cube-midturn.png: synchronized article/number faces during a reverse turn.

Agent review of layout, typography, existing colours, real imagery, content, keyboard focus and motion found no remaining actionable P0/P1/P2 findings. The portrait/mobile arrangement is intentionally responsive rather than a literal desktop sketch copy. This is self-review plus browser evidence, not independent review. No commit, push, merge or deployment performed.
