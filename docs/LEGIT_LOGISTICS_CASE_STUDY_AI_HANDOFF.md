# Legit Logistics Case Study AI Handoff

## Purpose

This file preserves the research, positioning, implementation notes, and improvement opportunities for the new Legit Logistics case-study page in the Code by Leon portfolio site.

The next AI should use this as the source brief before improving the page.

## Primary Goal

Create a project detail page that sells Leon's software and automation skills to potential clients.

The page should make visitors think:

> Leon can look at how my business works, find manual time-wasters, and build software that automates them.

This is not just a portfolio gallery page. It is a sales-oriented case study for custom business software.

## Current Route

- Route: `/work/legit-logistics`
- Local dev URL: `http://localhost:5173/work/legit-logistics`
- Conversion CTA target: `/get-started.html`
- Source project researched: `C:\Users\Leon Madara\Dev Mode\design-compass`
- Portfolio site repo: `C:\Users\Leon Madara\Dev Mode\codebyLeon`

## Current Implementation In codebyLeon

Files added:

- `C:\Users\Leon Madara\Dev Mode\codebyLeon\src\pages\LegitLogisticsCaseStudyPage.tsx`
- `C:\Users\Leon Madara\Dev Mode\codebyLeon\src\pages\LegitLogisticsCaseStudyPage.test.tsx`
- `C:\Users\Leon Madara\Dev Mode\codebyLeon\src\styles\sections\work-case-study.css`

Files modified:

- `C:\Users\Leon Madara\Dev Mode\codebyLeon\src\App.tsx`
- `C:\Users\Leon Madara\Dev Mode\codebyLeon\src\data\projects.ts`
- `C:\Users\Leon Madara\Dev Mode\codebyLeon\src\components\sections\PortfolioCarousel.tsx`
- `C:\Users\Leon Madara\Dev Mode\codebyLeon\src\components\sections\PortfolioCarousel.test.tsx`
- `C:\Users\Leon Madara\Dev Mode\codebyLeon\src\index.css`

## Page Intent

Primary visitor question:

> Can Leon build software that saves my business time?

Business answer:

> Yes. Legit Logistics demonstrates how Leon turns repeated operational work into connected software: an admin dashboard, driver workflow, customer tracking, real-time status updates, and proof collection.

Primary audience:

- Small business owners
- Logistics and delivery companies
- Service businesses with repeated admin or field workflows
- Companies relying on calls, messages, spreadsheets, or manual customer follow-up

Primary CTA:

- `Automate My Workflow`
- Links to `/get-started.html`

Secondary CTA:

- `See The Three Systems`
- Anchors to the three-part system section

## Source Research Summary From design-compass

Confirmed source facts from the Legit Logistics project:

- Stack: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase, PostgreSQL, Supabase Realtime, React Hook Form, Zod, React Query, React Router.
- Admin route in source project: `/admin`
- Driver route in source project: `/driver-demo`
- Public tracking route in source project: `/track/:trackingCode`
- Order lookup route in source project: phone/order lookup flow that routes customers to tracking.
- Database concepts: `deliveries`, `drivers`, `status_history`, and a `delivery-proofs` storage bucket.
- Status workflow: `PENDING -> PICKING -> ON_TRANSIT -> ARRIVED -> DELIVERED`
- Driver workflow includes job selection, status updates, pickup photo proof, and customer signature capture.
- Customer tracking includes public status pages, delivery timeline, driver info when available, tracking code lookup, phone lookup, and a privacy-aware delivered state.
- Admin dashboard includes quote review, job creation, active/pending/completed work queues, status review, mobile admin views, and delivery analytics.
- Security concepts include RLS, authenticated uploads, public read for tracking, and secure tracking codes.

## Three Pages To Sell

### 1. Admin Dashboard

Sales point:

Leon can build internal tools that give owners and dispatchers control over daily operations.

Current case-study copy angle:

- Quote review
- Job creation
- Active delivery management
- Completed order review
- Mobile admin views

What this proves:

- Dashboard design
- Business process mapping
- Database-backed operations
- Real-time work queues
- Manager-facing software

### 2. Driver App

Sales point:

Leon can build mobile workflows for staff in the field, not just static websites.

Current case-study copy angle:

- Job selection
- Guided status progression
- Pickup proof photo
- Customer signature capture

What this proves:

- Mobile-first UX
- Operational workflow automation
- Proof-of-work capture
- Field-service software thinking

### 3. Customer Tracking

Sales point:

Leon can reduce customer support pressure by giving customers self-service visibility.

Current case-study copy angle:

- Public tracking code pages
- Phone/order lookup
- Delivery timeline
- Delivered-state privacy handling

What this proves:

- Customer-facing portals
- Secure public data access
- Self-service UX
- Support workload reduction by design

## Current Page Structure

The page currently uses this structure:

1. Hero
   - Project label
   - Title: `Delivery Operations Automation Platform`
   - Main value proposition
   - Primary CTA to `/get-started.html`
   - Secondary CTA to the three-system section
   - Hero image from `/portfolio-legit.png`

2. Business problem
   - Explains calls, texts, spreadsheets, and manual updates as the operational pain.

3. Three connected pages
   - Admin Dashboard
   - Driver App
   - Customer Tracking

4. What the software automates
   - Manual pattern versus software replacement.

5. Skills demonstrated
   - Realtime backend
   - Mobile workflow UX
   - Secure public access
   - Operational dashboards
   - Tech stack tags

6. Final CTA
   - Positioned around workflows that waste time every week.

## Copy Strategy

Tone:

- Calm
- Practical
- Business-results focused
- Professional, but not corporate-heavy

Avoid:

- "World-class"
- "Best"
- "Guaranteed"
- "Saved X hours"
- "Reduced calls by X%"
- Any claim that implies measured business impact unless Leon provides actual metrics.

Safer phrases:

- "Built to reduce manual coordination"
- "Designed to reduce follow-up"
- "Helps replace calls, messages, and spreadsheets"
- "Gives customers self-service visibility"
- "Turns repeated operational steps into trackable workflows"

## Current Verification Evidence

The following checks passed after implementation:

- `npm run test`
  - 13 test files passed
  - 194 tests passed
- `npm run build`
  - TypeScript and Vite production build passed
- `npm run css:gates`
  - CSS architecture gates passed
- Browser QA
  - Direct route loaded at `http://localhost:5173/work/legit-logistics`
  - H1 rendered as `Delivery Operations Automation Platform`
  - Page contained Admin Dashboard, Driver App, and Customer Tracking sections
  - Home carousel `View Details` link navigated to `/work/legit-logistics`
  - Hero leaves the next section visible on desktop after the site reveal completes

Known non-blocking warnings:

- Build reports existing large chunk warnings.
- Build reports Browserslist/caniuse-lite is outdated.
- Full unit test run logs jsdom canvas `getContext()` warnings from existing canvas-related tests, but tests pass.

## Improvement Opportunities For The Next AI

### Highest value

Replace or supplement the current truck hero image with actual product screenshots from the Legit Logistics app:

- Admin dashboard screenshot
- Driver app screenshot
- Customer tracking screenshot

Reason:

The current image communicates logistics, but the page is selling software skill. Product UI evidence would sell the automation capability more directly.

### Stronger proof section

Add a compact "Before / After" or "Manual / Automated" section with clearer client-facing framing:

- Before: quote requests, dispatch, driver updates, customer follow-up scattered across calls/messages.
- After: one connected system with dashboard, field actions, proof, and tracking.

### More resume/client alignment

Add a small section titled:

> What this proves I can build for your business

Possible bullets:

- Internal dashboards
- Staff workflow apps
- Customer portals
- Realtime status systems
- Proof and audit trails
- Business process automation

### Better CTAs

Consider making the CTAs more specific to software automation:

- `Automate My Workflow`
- `Build A Custom Dashboard`
- `Turn My Process Into Software`

Keep `/get-started.html` as the CTA destination unless the conversion architecture changes.

### Future routes

This page is the first of three independent project detail routes. The likely future routes are:

- `/work/legit-logistics`
- `/work/kossy-langat`
- `/work/delivah-dispatch-hub` or another selected software project

The same case-study pattern should be reused, but each page should answer a different visitor question.

## Constraints For The Next AI

- Do not overclaim measurable impact without data.
- Do not remove the existing route unless replacing it with a better registered route.
- Keep conversion CTAs pointed to `/get-started.html` unless the live quote/configurator flow changes.
- Follow the CSS ownership pattern:
  - Page-specific styles belong in `src/styles/sections/work-case-study.css`.
  - Import order is managed from `src/index.css`.
  - Avoid `!important`.
  - Keep selectors namespaced under `.case-study`.
- Preserve the existing Code by Leon visual language unless the user explicitly asks for a redesign.
- If changing the UI, verify in browser after the site reveal animation completes or use `?no-burn=1` for QA where appropriate.

## Recommended Next Prompt For Another AI

Use this prompt:

> Read `docs/LEGIT_LOGISTICS_CASE_STUDY_AI_HANDOFF.md`, inspect the current `/work/legit-logistics` route, and improve the page so it sells Leon's software automation skills more strongly. Keep claims fact-safe, keep CTAs wired to `/get-started.html`, and use actual UI evidence from `C:\Users\Leon Madara\Dev Mode\design-compass` where possible.
