# Quote Email Integration Plan and Handoff

## Goal

Send the configured recommendation to the visitor and the full lead details to Leon when the service configurator finishes.

## Implemented Scope

1. `functions/api/quote.js` is a Cloudflare Pages Function at `POST /api/quote`.
2. The endpoint validates required contact and recommendation data, uses a honeypot field for basic bot resistance, and sends two transactional emails through Resend.
3. `src/scripts/configurator.js` submits the existing recommendation and form data after it renders the result screen.
4. The configurator displays an accessible pending, success, or failure delivery status.

## Cloudflare Production Setup

In **Workers & Pages → codebyleon → Settings → Variables and Secrets**, set these production secrets:

- `RESEND_API_KEY`: the restricted Sending access key created in Resend; never commit or expose it to the browser.
- `LEAD_RECIPIENT_EMAIL`: Leon's inbox for new quote leads.
- `EMAIL_FROM`: `Code by Leon <hello@codebyleon.com>`.

Redeploy after setting the secrets. Configure the same values for Preview only if preview deployments should be able to send email; otherwise leave Preview unconfigured.

## Verification Checklist

1. Complete `/get-started.html` with a real test inbox.
2. Confirm the visitor receives the recommendation and Leon receives the lead email with Reply-To set to the visitor.
3. Confirm Resend shows two successful sends in **Emails**.
4. Confirm a malformed email returns a client error and no email is sent.
5. Before promotion, add a Cloudflare rate-limiting rule for `POST /api/quote` if public traffic or spam increases.

## Local Validation Completed

- `npm run test -- functions/api/quote.test.ts` — 2 endpoint tests passed.
- `npm run build` — passed.
- `npm run css:gates` — passed.
- `npm run test` — 24 test files and 235 tests passed.

## Handoff

The code is ready for a Git-backed Cloudflare Pages deployment. Add the production secrets before deployment, then complete the verification checklist with a real inbox. The existing local worktree contains unrelated user changes; this feature's files should be reviewed and committed separately after approval.

## Explicitly Out of Scope

- Newsletter subscriptions and marketing consent.
- Lead storage, CRM integration, and analytics.
- Calendly and WhatsApp placeholder links already present in the result screen.
