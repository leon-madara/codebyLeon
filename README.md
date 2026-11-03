# Code by Leon

The Next.js website deployed at https://codebyleon.com, built for Cloudflare Workers with OpenNext. The previous Vite site remains in Git history before this production-source integration.

Use npm and the committed package-lock.json; .npmrc records the existing peer-dependency installation option.

```sh
npm ci
npm run typecheck
npm run build:cloudflare
npm run preview:cloudflare
```

Development: `npm run dev`. Deployment is an intentional operation: `npm run deploy:cloudflare`. Pushing Git does not automatically deploy the active Worker. The legacy Pages integration is retained for rollback; it is not the current application build path.

Read docs/DEPLOYMENT.md for bindings, routes, migrations, release evidence and rollback. Read docs/SEO_AUDIT_2026-11-03.md for the branded social previews, favicon, indexing and performance checks and their limits.

The current release was verified on both public hostnames as Worker version b4b3098b-866b-4657-87b5-91b812eb1ec7. This main integration records that working-tree implementation as reproducible source; it does not alter customer data or hosting settings.
