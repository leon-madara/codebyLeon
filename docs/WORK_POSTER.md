# Work poster page

The `/work` route now renders a standalone project picker using the supplied `codebyleon_kinetic_swiss_poster_case_studies.html`. The homepage navigation, footer Work link, project links and command palette lead to this route rather than opening the former case-study dialog. Homepage project previews remain intact.

`src/components/home/work-reference.json` contains the supplied overview and three article templates, without their scripts or comments. This is trusted, checked-in static presentation content, not an HTML input pipeline. Edit the imported content here; the original reference remains unchanged. Its business claims, quotations and example code were preserved from the supplied file, not independently verified against client systems.

`work-poster.tsx` supplies routing, chapter selection, keyboard chapter navigation and clipboard feedback. The index uses the full shared `Navbar` and command palette; `sectionPage` maps its section links back to homepage anchors and marks Work active. Selected articles retain the minimal logo/theme header and project links. Unknown project slugs return 404. `work-poster.css` scopes reference styling to `.work-poster`. Each heading colour occupies one line; narrow screens use the site's narrower display face for readability. Desktop display uses Syne; supporting fonts reuse the site's existing fonts.

The picker uses the site's cream/ink backgrounds and orange action tokens, with logo blue for numbers and supporting labels. Lime picker buttons were replaced with orange. A larger two-line desktop heading and buttons beside compact rows allow all three case studies to fit without scrolling at verified 1200 x 680 and 1024 x 640 viewports. Mobile keeps a readable scrolling list and the shared expandable menu.

## Local verification — 21 October 2026

Checked in the active `codex/codebyleon-alternate` checkout, based on `d36acca` with existing unrelated uncommitted work preserved. Browser preview: `http://localhost:3000/work`.

- Homepage Work navigation opens the standalone picker, without homepage content or a dialog behind it.
- All three projects open; All Work returns to the picker; project navigation switches cases.
- Chapter selection works with clicks and arrow keys; selected state, panel and keyboard focus agree. Copy Code reports success.
- Picker inspected in desktop light/dark and 390px mobile light/dark; headings fit without horizontal overflow. Also measured at 1440px. The project reader was inspected at mobile width.
- Focused ESLint passes. Next webpack production build passes; configured type validation is skipped by that build.
- Separate TypeScript check reports existing errors in websocket examples (missing socket.io packages) and `configurator.tsx:384` (unreachable nullish fallback), with no diagnostics in new Work files.

Release boundary: local implementation and browser verification only; no push or deployment.


Latest title refinement: larger responsive desktop heading and 44px top padding (40px on mobile). This supersedes the earlier single-screen fit: at 1200 x 680 the third row ends at 706px and needs a short scroll. Mobile title remains sized to fit its available width.

The case-study reader now reuses the article selector and cube-turn provider through the persistent Work layout. Optional route/label props preserve the blog defaults. The header has previous/next controls, a keyboard/touch title picker and an article-style studio strip in the Work palette. The live page is hidden while its styled snapshots rotate; reduced motion switches directly. The rail measures the taller sticky header. Local browser checks covered all three cases, forward/reverse turns, keyboard selection, title picker, reduced motion, cleanup, mobile light/dark and article navigation regression.
