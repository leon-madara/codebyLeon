# Alternate security and scrolling review - 2026-10-22

Scope: `C:\Users\Leon Madara\Dev Mode\codebyLeon`, branch `codex/codebyleon-alternate`, HEAD `0b64d32` plus the existing uncommitted work and this sweep. Local only; no commit, push or deployment. Existing design, content, reading holds, intake overlay and pending illustration work were preserved.

## Implemented

- Public inquiry/newsletter endpoints accept bounded JSON only (16 KiB, counted while streaming) and reject mismatched browser Origin/cross-site Fetch Metadata. Field validation remains in place.
- Removed the unused unauthenticated inquiry-count endpoint. Newsletter upsert returns the same response for new and existing subscribers.
- Added browser headers against framing, MIME sniffing, embedded objects, unwanted base URLs and browser capability access. CSP is baseline protection; it does not enforce script nonces.
- Updated Next.js and matching ESLint config from installed 16.4.0 to 16.4.2 through the existing npm lockfile. Official advisory: https://nextjs.org/blog/nextjs-security-update-october-14-2026 . Next's nested sharp is 0.35.5. The newly enforced parallel-slot check required a main-slot `default.tsx`; it uses `notFound()` rather than weakening route validation.
- Explicit homepage anchor navigation uses `power2.inOut`, remeasures destinations during travel, and cancels on wheel, touch, pointer or scroll-key input. Founder and Services retain their section-specific destinations. Back-to-top scrolls before lowering the curtain.
- Reality Check's remaining linear transitions now use gentle in/out easing. Existing numeric scrub and reading holds are retained. Shared entrance reveals ease in/out and appear immediately for reduced motion. Native wheel/touch scrolling remains under browser control.

## Verification

| Check | Observed result |
| --- | --- |
| Next 16.4.2 Webpack production build | Passed, including static generation and standalone output. Existing config skips type validation. |
| Focused ESLint on changed security/motion code and new fallback | Passed. |
| `git diff --check` | Passed; existing CRLF notices only. |
| Standalone production HTTP sweep | Homepage, Work index, all 3 case studies, Blog index, all 6 articles and direct intake returned 200; unknown URL returned 404. |
| API rejection and headers | Passed local HTTP checks; both endpoints still reject cross-origin requests after patch/build. See SECURITY_HTTP_CHECKS.md for the full matrix. No real successful form writes were made. |
| Scroll helper simulation | Passed eased-curve selection, moving destination, exact endpoint, cleanup, wheel interruption, replacement, Escape and immediate reduced-motion completion. |
| Desktop browser, 1280x720 | Services settled at 72px, Founder at 72px, Articles at about 100px. Forward/reverse section scrolling and article chapter navigation were exercised. |
| Mobile browser, 390x844 | Menu opened/closed; Founder navigation and forward/reverse sequence scrolling exercised. Back-to-top reached y=0 before curtain return. Work index -> case study -> All Work returned correctly; direct intake rendered. |
| Reduced motion, 390x844 | Browser emulation confirmed reduced-motion query true, unlocked document scrolling, no horizontal page overflow and static hero. Emulation and viewport overrides reset afterward. |
| Fresh production page console | No errors in fresh tab. The long-running tab retained errors from replacing dependencies under the old development process; restarting resolved those. A hydration warning during preference-emulation/reload was not reproduced on the fresh normal-load tab. |

Browser observations are agent-reviewed, not independent review. Dark theme received the main visual pass. Every theme/input-device combination, every reader chapter and physical touch/trackpad feel were not exhaustively tested. Browser route checks cover representative reading interactions; HTTP checks cover all listed pages.

## Remaining gaps

- Production npm audit still reports 9 entries: 5 high and 4 moderate, with no critical entries. Affected trees: Prisma CLI/config/deepmerge-ts, root sharp, unused MDX editor/js-yaml and syntax-highlighter/refractor/prismjs. Audit counts include transitive parent packages, not nine independently proven public exploits. No MDX-editor or syntax-highlighter imports were found in `src`; database code imports Prisma client. Reachability needs review before cleanup/major upgrades.
- Root sharp remains 0.34.5, distinct from Next's patched nested 0.35.5. Do not treat the whole dependency audit as resolved.
- Hosting-level durable rate limits/spam protection and production proxy/origin behaviour are not verified. Origin headers are browser protection, not authentication for custom clients.
- Inherited `bun.lock` is stale; npm lockfile is the checked patched tree. No Bun migration or frozen-lock release was performed.
- Explicit type-check still fails in the websocket examples (missing socket.io packages) and existing configurator line 384 (unreachable nullish fallback). The initial generated intake-slot diagnostic disappeared after production regeneration. No clean type-check claim.
- Existing article examples include percentage/guarantee language; these were not validated as commercial claims or edited during this technical sweep.

Next priority: review/remove unused dependency trees, apply supported dependency fixes with regression checks, and configure durable form rate limits on the intended host before release. This review is not a complete security sign-off or live-site verification.

## Scoped commit verification

The authorized commit contains only this sweep, applied to HEAD `0b64d32`. Earlier typography, reading-hold/pacing, redesign and intake-overlay edits remain outside the commit. A separate snapshot of HEAD plus the staged changes passed the Next.js 16.4.2 Webpack production build and focused ESLint. It reused the installed dependency tree; Next reported the parent workspace as its tracing root. Browser observations above describe the combined working tree, not an independent browser pass of the smaller staged snapshot. Existing type-check and dependency findings remain open. Final staged whitespace checks passed. No release is included.
