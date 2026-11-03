# CodeByLeon deployment — 22 October 2026

## SEO release — 3 November 2026

### Main source integration

The approved production Next.js source and SEO fixes are integrated onto GitHub main through an isolated release snapshot and GitHub API commit/ref update. The new commit retains the prior main revision `a064ba6a767c0b31ac7250a6ae8d53e03b376b55` as its parent; the Vite site remains in history. The original local alternate checkout, its unfinished files and checkpoint references are preserved. Earlier Git-blocker notes below describe the initial local-fetch failure, which this separate upload path avoids.

The release snapshot uses the same runtime source/assets as the verified Worker, with only trailing-whitespace normalization in three TSX files. TypeScript, focused ESLint, Next static generation and OpenNext packaging are checked in the isolated source tree. Font license files are preserved byte-for-byte, including their inherited whitespace. No credentials, local previews, editor settings or experimental design files are part of the release.

The Worker release below remains the active deployment; recording the source on main does not change its routes, D1 database or release pipeline. Deploy future changes explicitly using the documented Worker commands. The old Pages integration is retained and is not evidence of a successful Worker release.

The user authorized integrating the current Next.js production site onto main and deploying the Worker. Worker deployment completed independently; Git integration remains blocked by a corrupt local checkpoint reference during `git fetch origin`. No commit, merge or push was made. See `MAIN_INTEGRATION_HANDOFF_2026-11-03.md` for the exact error and preserved release scope.

- Current Worker version: `b4b3098b-866b-4657-87b5-91b812eb1ec7`, replacing `4c9feb1d-515a-4ecb-912b-0d5c913271ca`.
- Command: `npm run deploy:cloudflare`, using the previously verified OpenNext build, Next build ID `_pDT3bxVPeUbY73GK3S9L`. Upload compressed size 1387.04 KiB; startup 23 ms.
- Source: alternate checkout HEAD `b7c771d` plus approved existing production/design work and SEO changes. This is a working-tree deployment, not a committed main revision.
- PASS LIVE on both apex and www: `scripts/verify-seo.mjs` checked all 13 public pages, 12 image assets, unique metadata, canonicals, OG/Twitter images, schema, crawl files, crawler head metadata and four 404 paths. Evidence: ignored `.preview-seo/live-apex-seo-checks.json` and `.preview-seo/live-www-seo-checks.json`.
- PASS LIVE browser: homepage rendered with no console errors. Actual WhatsApp preview rendering, Search Console recrawl and field Core Web Vitals remain unverified; do not infer exceptional performance from this release.
- Prior release details below are historical; the version above is current as verified during this release.

The current Next.js design is deployed and verified live at https://codebyleon.com/ and https://www.codebyleon.com/.

## Release identity

- Source: C:\Users\Leon Madara\Dev Mode\codebyLeon, branch codex/codebyleon-alternate, HEAD b7c771d plus the complete existing design/asset changes and deployment adaptations. No Git commit or push was made; main remains unchanged.
- Worker: codebyleon-next; OpenNext 1.20.13, Wrangler 4.151.3, Next.js 16.4.2.
- Active version: 4c9feb1d-515a-4ecb-912b-0d5c913271ca.
- Preview-only version: 0cca813b-9dd0-4731-8036-13463f96416c.
- Routes: codebyleon.com/* and www.codebyleon.com/* in zone codebyleon.com. Existing Pages custom domains and DNS were retained; Worker routes take precedence.
- Old Pages deployment is preserved at https://7e4d0b97.codebyleon.pages.dev/ (production source a064ba6a767c0b31ac7250a6ae8d53e03b376b55), verified HTTP 200 after cutover.
- D1: codebyleon-submissions, binding DB, ID f4575801-f182-4972-b4a6-2e028d32c1db. Migration migrations/0001_submissions.sql applied locally and remotely.

## Deployment adaptations

- OpenNext builds the existing Next app for Workers. No design/framework rewrite or static-export feature removal.
- Production inquiry/newsletter handlers now use D1 with bound SQL parameters instead of local Prisma/SQLite. Edge rate limiter allows ten valid submissions per endpoint/IP per 60 seconds. This is per-location Cloudflare rate limiting, not a guaranteed global quota.
- Existing JSON/body-size/origin/validation protections retained. Synthetic local and remote rows verified; remote test rows removed afterward.
- Current intake remains a downloadable project brief and Calendly link. It does not send the brief to Leon, and no email-notification integration or marketing campaign delivery was added. Existing encrypted email secrets on Pages were not revealed or transferred.
- Build/start scripts are cross-platform Next commands. Application type checking is enforced; non-application websocket examples are excluded. Fixed the configurator's unreachable nullish expression.
- npm is the release installation path, with legacy-peer-deps recorded in .npmrc. Stale supplied bun.lock retained as docs/legacy-lockfiles/bun.import.lock so host detection cannot select that outdated tree.
- Added homepage canonical, sitemap, robots sitemap link, /process -> /#services permanent redirect and legacy fragment aliases. Pending Figma illustration was preserved.
- Wrangler keep_names:false fixes the next-themes inline-script __name failure observed in local Worker testing, following OpenNext guidance.

## Verification

- PASS: application TypeScript, focused ESLint covering deployment/API/route code, git diff --check, Next Webpack production build with type checking, OpenNext bundle and Wrangler dry-run. Final upload compressed size 1359.20 KiB; startup 17ms.
- PASS: local Worker homepage, work archive, all three case studies, blog archive, all six articles, direct intake, sitemap and robots 200; unknown route 404.
- PASS: local valid newsletter 200, inquiry 201; D1 count verified one of each. Wrong origin 403, content type 415, invalid email 422, oversized body 413. Repeated newsletter request sequence reached 429 after ten requests.
- PASS: hosted Worker intake overlay opened, with no console errors; local intake option/continue/save-exit exercised. Local mobile homepage and case study rendered without horizontal overflow.
- PASS LIVE: apex and www both return the new design, 200. All three case studies and six article URLs, archives, direct intake, sitemap, robots and founder video returned 200; unknown path 404. /process returns 308 Location: /#services on apex and www.
- PASS LIVE: newsletter same-origin POST 200 and cross-origin POST 403. Live browser newsletter showed success feedback. Remote synthetic subscriber/inquiry persistence verified via D1 query, then test rows removed.
- PASS LIVE: desktop screenshot and fresh console without errors; mobile 390x844 screenshot, no horizontal overflow, menu open/close exercised. Temporary viewport restored. Screenshots are agent-reviewed, not independent review.
- WARN: full npm run lint reports two inherited set-state-in-effect errors in src/components/ui/carousel.tsx:98 and src/hooks/use-mobile.ts:14. Generated build/snapshot folders now excluded from lint; neither source helper is used in the published homepage flow. No global lint rule was disabled.
- WARN: refreshed npm audit --omit=dev reports nine inherited entries (five high/four moderate, no critical), involving root sharp, unused Prisma CLI/config, MDX editor and syntax-highlighter trees. No src imports for MDX editor/syntax highlighter; API no longer imports Prisma. This is not a full dependency-security sign-off.
- INFO: Search Console submission and physical touch-device testing were not performed. Broad performance benchmarking, every theme/state combination and actual Calendly booking completion were not claimed.

## Local comparison

- Existing old built development snapshot: http://127.0.0.1:3106/ . It differs from exact old production and is served statically, not an editable Vite server.
- Latest new design source preview was started at http://127.0.0.1:3105/; Worker production preview at http://127.0.0.1:3108/.
- Attempt to restore exact old editable source in the isolated visualization folder stalled while fetching GitHub blobs. Exact commit metadata was obtained; no runnable checkout claimed. This does not affect the retained old Pages deployment.

## Reproduction and rollback

Use npm ci (project .npmrc), npm run typecheck, the applicable lint checks, npm run build:cloudflare, then npm run preview:cloudflare or npm run deploy:cloudflare. Initialize local D1 with npx wrangler d1 migrations apply codebyleon-submissions --local. Remote database migrations are separate, intentional operations.

On Windows, OpenNext works in this tested environment but its documented support is limited. Recheck on each release; use Linux CI if a Windows-specific adapter failure occurs. Do not reinstate the archived Bun lockfile at root or bypass the application type check.

For rollback to the old design, remove ONLY the two codebyleon-next Worker routes from the zone (or remove routes from wrangler.jsonc and deploy that configuration). Keep the old Pages project/custom-domain/DNS association intact. Verify both domains and deep links after rollback. Keep D1 and the Worker for diagnosis; do not delete customer submissions. A rollback is a production change and needs authorization.

The current deployment was a direct upload of the local working tree. Future Git pushes alone will still build the old Pages main branch. Git integration for the new Worker and a reviewed source commit/push are separate follow-up work; no automatic release pipeline for this Worker is claimed.

Sources: https://opennext.js.org/cloudflare/get-started ; https://opennext.js.org/cloudflare/howtos/keep_names ; https://developers.cloudflare.com/workers/configuration/routing/routes/ .
