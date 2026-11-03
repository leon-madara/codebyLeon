> Deployment completed later on 22 October 2026. See [DEPLOYMENT.md](DEPLOYMENT.md) for the active release, verified live results and remaining gaps. The readiness findings below are historical.

# CodeByLeon migration readiness — 22 October 2026

## Decision and release boundary

The intended outcome is the current Next.js design as the default at codebyleon.com, with the old React/Vite design retained locally for comparison. This turn reviewed readiness and started local previews. No source design changes, commit, push, deployment, domain change or main-branch update was performed.

Recommendation: prepare a separate Cloudflare preview of the full current design, verify it, then cut over the existing domain while retaining the old deployment for rollback. Do not simply point Cloudflare at the current remote alternate branch.

## Verified source state

- Active checkout: C:\Users\Leon Madara\Dev Mode\codebyLeon; codex/codebyleon-alternate; HEAD b7c771d.
- GitHub API reports remote alternate 9624ca0d9d18ac47c21b4994a8025803cfd999e5; local has eleven additional commits plus substantial tracked and untracked design work. Release preparation must explicitly include the intended application files and assets, excluding scratch output and tools.
- GitHub API reports remote main a064ba6a767c0b31ac7250a6ae8d53e03b376b55. Local origin/main is stale; local main worktree is also older. Do not use either as proof of current production source.
- New app is Next.js 16.4.2 / React 19. Config output is standalone. No Cloudflare adapter, Wrangler config or deployment scripts were found in the current release setup.
- npm lockfile contains the patched tree; inherited bun.lock is stale according to current project guidance. Build script has Unix cp commands, start script assumes Bun and tee; these need replacement by the chosen host's build/preview/deploy path. Vite+ is globally available (1.3.0), not adopted locally; toolchain inspection fails on its missing global manifest. No toolchain migration was made.

## Local and live observations

- https://codebyleon.com/ returns 200 through Cloudflare and visually renders the old React/Vite design. Authenticated Cloudflare inspection now confirms Pages project codebyleon, GitHub leon-madara/codebyLeon, production branch main, automatic deployments enabled, npm run build, output dist, and blank root-directory field (repository root). Current successful production deployment is 7e4d0b97-cd2c-4d5d-a93c-aa12cc87b510 at revision a064ba6a767c0b31ac7250a6ae8d53e03b376b55. Both codebyleon.com and www.codebyleon.com are Active with SSL enabled.
- New latest-source development preview: http://127.0.0.1:3105/ — Next dev with Webpack, verified HTTP 200 and desktop browser rendering.
- Old built development snapshot: http://127.0.0.1:3106/ — Python static server serving existing dist. Verified HTTP 200 and browser rendering. This snapshot differs from today's production (including Services/About and Work navigation). It is not an exact production archive, an editable development server, or a verified source revision. Static server does not provide React Router deep-link fallback. Restore an isolated source checkout pinned to confirmed production revision for the final comparison setup.
- New /blog and /get-started.html return 200. /process and /sitemap.xml return 404. /robots.txt returns 200 text/plain. Existing live links include /process and homepage anchors #hero, #portfolio, #about; new equivalents use #top, #work, #founder. Plan legacy route and hash compatibility explicitly; URL fragments are handled client-side.
- Fresh TypeScript check fails: missing socket.io-client in examples/websocket/frontend.tsx; missing socket.io in examples/websocket/server.ts; unreachable nullish fallback in src/components/home/configurator.tsx:384. Next config ignores build type errors. Earlier production-build and security evidence is documented in SECURITY_SCROLL_REVIEW.md, not rerun as current release proof here.
- Root metadata has no homepage canonical or metadataBase; article metadata includes canonical URLs. Complete sitemap and relevant social metadata before cutover.

## Functional launch decisions

Current ProjectIntake collects details in session storage, generates a downloadable text brief, and links to Calendly. It does not submit the brief to Leon. This is a launch decision: retain that explicit flow or implement delivery as separately scoped work. Do not represent it as a successful enquiry.

Public inquiry and newsletter route handlers exist. Footer newsletter is visible. Those routes use Prisma's default client with a SQLite datasource, and no Cloudflare database adapter/binding is configured. Durable production storage and successful end-to-end persistence need implementation and verification before enabling these flows on Workers. Review origin handling through the actual production proxy and add proportionate durable spam/rate controls. Do not copy a local database to Workers as the persistence solution.

Existing security review records remaining dependency audit findings; these were not re-audited here. Resolve reachability and relevant fixes before release. Successful form writes and actual notification/booking outcomes were not tested in this review.

## Hosting direction

Cloudflare's current Next.js guide recommends vinext for Workers but identifies it as beta and requires compatibility review for existing applications. OpenNext remains a documented alternate path, while Pages is documented for static Next exports. This application has server-rendered routes, intercepted/parallel intake routing and database APIs, so keeping the existing Pages/dist settings unchanged is not a compatible release plan. Test exact Next.js 16.4.2 and route behavior with the selected adapter before selecting the production build path. Do not silently convert the framework or remove features to obtain static output.

Source: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ (checked this turn).

## Proposed execution order

1. Completed authenticated read-only Cloudflare inspection. Preserve the current Pages project as the old production/rollback target while preparing a separate compatible Next.js deployment.
2. Preserve an isolated exact old production source and rollback target. Run old editable source locally alongside port 3105; keep clear labels for production versus development snapshots.
3. Assemble and review the complete new-design release scope, preserving all latest assets and intended changes.
4. Validate the Cloudflare adapter in isolation; settle production database/form delivery; fix the relevant type errors and verify clean installation/build.
5. Add legacy route/hash handling, sitemap and metadata. Verify all six articles, three case studies, intake, newsletter, video/media, mobile/desktop, themes and reduced motion in the production-like preview.
6. Present the concrete verified release candidate, then perform the authorized cutover with explicit release confirmation as needed; verify codebyleon.com and www, HTTPS/canonical behavior, deep-link refresh, forms and assets. Keep rollback available.

## Comparison scope

The old live site and new desktop homepage were visually inspected. No broad visual critique or mobile comparison was completed. Compare the old process explanation, navigation clarity, case-study proof and service presentation one at a time, preserving the approved new identity. No design transfers were implemented.

## Status

Readiness review completed with explicit gaps. Authenticated hosting verification is complete. Migration is not deployment-ready; a compatible deployment build, form/storage decisions, route/SEO fixes, release checks and exact old editable preview remain pending. The Task Observer panel opening was queued; chat checklist is the confirmed display fallback.

## Authenticated Cloudflare build findings

- Successful production build on 20 October 2026: Node.js 22.16.0, npm 10.9.2; automatic install was npm clean-install --progress=false; build ran npm run build -> tsc && vite build; deployment status success. Saved Pages build system is Version 3. Pages Functions compatibility date is 2026-01-09. No database/storage bindings were listed.
- Existing encrypted production email configuration is present (sender, lead recipient and Resend API key). Values were not revealed or copied. This is configuration evidence, not proof of working current form delivery, and it does not automatically transfer to a separate Worker.
- Alternate preview attempt 369de81e-781f-4dbb-9e60-c45239526fbf, source 9624ca0, failed on 12 October 2026 before application compilation. The log detected Node.js 22.16.0 / npm 10.9.2 / Bun 1.2.15 and automatically selected bun install --frozen-lockfile. It failed with 'lockfile had changes, but lockfile is frozen'. This is direct evidence that lockfile/package-manager ambiguity must be resolved for release; updating only npm dependencies or retrying the existing deployment does not resolve it.
- The failed attempt does not establish whether the new app can compile or run on Workers. The adapter and actual Workers runtime must still be tested separately.
- No retry, build-setting edit, deployment, custom-domain change, secret reveal or production mutation was performed in this review.

Authenticated source pages:
- https://dash.cloudflare.com/7d64b25d15301858b14679a666334278/pages/view/codebyleon/settings/production
- https://dash.cloudflare.com/7d64b25d15301858b14679a666334278/pages/view/codebyleon/domains
- https://dash.cloudflare.com/7d64b25d15301858b14679a666334278/pages/view/codebyleon/7e4d0b97-cd2c-4d5d-a93c-aa12cc87b510
- https://dash.cloudflare.com/7d64b25d15301858b14679a666334278/pages/view/codebyleon/369de81e-781f-4dbb-9e60-c45239526fbf
