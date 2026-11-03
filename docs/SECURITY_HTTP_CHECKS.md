# Alternate security HTTP checks

Checked 2026-10-22 against the local development preview at `http://127.0.0.1:3105` in `C:\Users\Leon Madara\Dev Mode\codebyLeon`, including current uncommitted security changes. These checks do not establish production or live deployment security.

## Observed HTTP results

Node fetch assertions passed against the running Next.js server:

| Request | Observed result |
| --- | --- |
| GET `/` | `X-Content-Type-Options: nosniff`; `X-Frame-Options: DENY`; `Referrer-Policy: strict-origin-when-cross-origin` |
| GET `/` | `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| GET `/` | `Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'` |
| GET `/` | No `X-Powered-By` header |
| POST each of `/api/newsletter`, `/api/inquiries`, external Origin | 403 |
| POST each endpoint, text/plain body | 415 |
| POST each endpoint, malformed JSON | 400 |
| POST each endpoint, 16,385-byte JSON-content-type body | 413 |
| GET `/api/inquiries` | 405 |

Only rejected submissions reached the real HTTP endpoints; no valid submission or database write was requested. Initial sandbox socket access failed with `EACCES`; the same assertions passed with approved local socket access.

## Source and focused simulation checks

- Both POST routes bound streamed request bodies to 16 KiB before JSON parsing and retain Zod field validation.
- The shared reader rejects cross-site Fetch Metadata and mismatched Origin. This protects browser submissions; custom clients can forge these headers, so this is not bot authentication or rate limiting.
- Newsletter persistence uses atomic upsert and returns the same status and payload for new and existing addresses. Mocked database simulations verified rejection before writes, email normalization, identical subscriber responses, and inquiry reference generation. Real database persistence was not exercised.
- Reader simulations passed same-origin JSON, cross-origin rejection, cross-site Fetch Metadata, content-type rejection, malformed JSON, oversized bodies and oversized streamed bodies without Content-Length.
- Raw work HTML comes from the checked-in `work-reference.json`; chart styles come from developer-provided component configuration. No submitted-user-content path to these HTML sinks was found in this review.
- Scoped ESLint on `next.config.ts` and `src/app/api` passed; scoped `git diff --check` passed.

## Limits and follow-up

This CSP is baseline hardening, not a strict script policy. A nonce policy would require coordinated rendering and style verification. Hosting-level rate limiting for the public forms remains unverified.

The root installed `sharp` was observed as `0.34.5`, while Next's nested copy was `0.35.5`; dependency paths must be distinguished when assessing image advisories. Dependency updates and the full npm audit are tracked by the main task, rather than claimed complete by these HTTP checks.
