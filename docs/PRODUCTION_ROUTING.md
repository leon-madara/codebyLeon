# Production route handling

The original React/Vite website uses Cloudflare Pages and React Router. Keep
Cloudflare Pages' default single-page application fallback: do not add a
top-level `public/404.html` or redundant rewrites to `/index.html`.

On 2026-10-20, a direct request to `https://codebyleon.com/blog` returned
`308 Location: /`, while `/process`, project case studies, and an individual
article loaded at their original URLs. The explicit `/blog /index.html 200`
rule was removed together with its redundant `/blog/*` rule. No route components
or design assets changed.

Cloudflare serves the root application for unmatched paths when no top-level
`404.html` exists. React Router then selects the requested page. Static assets
and the separate `get-started.html` build entry retain normal file handling.

After deployment, check direct navigation and refresh for `/blog`, an article,
`/process`, all three `/work/` routes, and `/get-started`. Confirm the blog
listing stays at `/blog` and its article links work. Check asset requests too;
an HTTP 200 alone does not establish that a page rendered.

References:
- https://developers.cloudflare.com/pages/configuration/serving-pages/
- https://developers.cloudflare.com/pages/configuration/redirects/
