# Portfolio Case Study Intent Brief

Phase: 1 - Portfolio Intent Reset  
Status: Draft for review  
Date: 2026-06-07

## Portfolio Case Study Goal

The portfolio case-study system should prove that CodeByLeon can solve different business problems, not just make visually polished websites. Each flagship project needs a distinct visitor question, proof model, layout direction, and CTA angle.

The three flagship case studies should be:

- Legit Logistics: custom software automation and business workflow systems.
- Kossy Langat: personal-brand storytelling and identity architecture.
- Delivah Dispatch: customer acquisition plus operational web systems for a service business.

This phase does not require app code changes. It defines the strategic brief that later phases should implement.

## Phase 1 Portfolio State

Current `Our Work` data includes:

- Legit Logistics: has `caseStudyPath: "/work/legit-logistics"` and is the only registered work case-study route.
- Kossy Langat: present in portfolio data, but has no `caseStudyPath` yet.
- Reverie Reveal: present as a luxury commerce experience, but not part of the immediate flagship three.
- Leon Madara Portfolio: present as a case-study-system project, but it is meta proof rather than an immediate flagship client story.
- CodeByLeon: present as the studio website, useful secondary proof but not a priority case-study route.

Delivah Dispatch is not yet in the `codebyLeon` portfolio data, but the source project exists locally at `C:\Users\Leon Madara\Dev Mode\delivah-dispatch-hub`.

Phase 2 updates this state: the active `Our Work` carousel becomes exactly three exhibit projects: Legit Logistics, Kossy Langat, and Delivah Dispatch.

## Project Intent Matrix

| Project | Primary visitor question | Business answer | CodeByLeon skill sold | Primary audience | Proof assets needed | CTA angle | Layout direction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Legit Logistics | Can Leon build software that saves my business time? | Yes. He can turn repeated operational work into a connected software system with dashboards, field workflows, tracking, realtime data, and proof collection. | Custom software, workflow automation, dashboards, realtime backend, mobile operational UX. | Business owners, logistics teams, service businesses with manual admin or field work. | Admin dashboard screenshot, driver workflow screenshot, customer tracking screenshot, manual-to-automated flow map, tech stack proof. | Automate My Workflow / Build A Custom Dashboard / Turn My Process Into Software. | System/product case study. Use operational diagrams, before-after workflows, dashboard evidence, and feature modules. |
| Kossy Langat | Can Leon understand the full person behind a professional brand and make the site sell them to the world? | Yes. He can translate personality, role, values, work, mentorship, leadership, and credibility into a distinctive web presence. | Personal-brand strategy, identity architecture, editorial storytelling, visual direction, motion-led portfolio design. | Consultants, professionals, leaders, founders, experts, creators, and public-facing specialists. | Hero/personality screenshots, About identity sections, Mentorship page, Work/project proof, values/discipline sections, portrait/brand imagery. | Build My Personal Brand / Shape My Professional Story / Make My Website Feel Like Me. | Editorial identity case study. Avoid dashboard grids. Use portrait-led storytelling, character pillars, narrative sections, and proof moments. |
| Delivah Dispatch | Can Leon build a service-business website that acquires customers and helps manage operations behind the scenes? | Yes. He can build a market-facing site plus onboarding, lead capture, document upload, backend storage, and admin review flows. | Conversion-focused web development, customer acquisition funnels, operational backend, form workflows, Supabase/EmailJS integration, deployment readiness. | American service businesses, freight/logistics operators, dispatch firms, operations-heavy small businesses. | Homepage hero, service pages, carrier registration flow, document upload, contact form, Supabase schema, admin dashboard, filters/export proof. | Get More Carrier Leads / Build My Service Funnel / Turn My Website Into An Intake System. | Funnel-and-ops case study. Use journey mapping from visitor to registered carrier to admin review, plus backend architecture callouts. |

## Evidence Reviewed

### Legit Logistics

- Current case-study route: `/work/legit-logistics`.
- Current conversion CTA target: `/get-started.html`.
- Existing handoff defines the page as a sales-oriented custom software case study, not a simple gallery.
- Confirmed proof areas: admin dashboard, driver app, customer tracking, Supabase/PostgreSQL, realtime data, delivery status workflow, proof collection, public tracking, and RLS/security concepts.
- Current opportunity: replace or supplement the general truck image with actual UI evidence from the source product.

### Kossy Langat

- Source project: `C:\Users\Leon Madara\Dev Mode\kossy-langat-website`.
- Positioning: structural engineer and general manager, presented as "The Orchestrator."
- Core identity themes: engineering excellence, business pragmatism, worker welfare, alignment, integrity, mentorship, discipline, and structural leadership.
- Site proof includes Home, Work, About, Insights, and Mentorship routes.
- Work proof includes Kaputei Residence, Tassis Residential Development, BBS Mall, and Private Hostel Development.
- Strongest case-study angle: CodeByLeon did not just build pages; the work translated a complete professional identity into a public-facing brand system.

### Delivah Dispatch

- Source project: `C:\Users\Leon Madara\Dev Mode\delivah-dispatch-hub`.
- Market positioning: professional truck dispatch and freight management services for American carriers.
- Routes include home, register, about, services, contact, admin, and storage test.
- Conversion proof includes a carrier registration flow with company info, DOT/MC info, fleet info, operational info, and document upload.
- Backend proof includes Supabase setup for `carriers` and `contact_messages`.
- Admin proof includes carrier records, contact messages, search, state filtering, stats cards, and CSV export.
- Strongest case-study angle: a website that both attracts carriers and gives the business a way to manage intake.

## Recommended Flagship Project Set

Use these as the first three full case-study routes:

1. Legit Logistics - custom software automation.
2. Kossy Langat - personal-brand identity storytelling.
3. Delivah Dispatch - service-business acquisition and operations.

Hold these outside the active `Our Work` carousel for now:

- Reverie Reveal: useful as luxury commerce/product storytelling proof, but not part of this immediate three-exhibit system.
- Leon Madara Portfolio: useful as internal/meta proof of case-study systems, but less direct than the client-facing proof set.
- CodeByLeon: useful studio proof, but should not compete with client project case studies inside the primary `Our Work` section.

If a future Phase 1.5 expands the portfolio beyond three flagship stories, Reverie Reveal is the strongest next candidate because it sells a fourth capability: premium commerce and product storytelling.

## Layout Differentiation Notes

Do not build one generic case-study template and swap the text.

- Legit Logistics should feel like a software system breakdown: modules, workflows, screenshots, before-after operational maps, and capability cards.
- Kossy Langat should feel like an editorial identity profile: portrait-led hero, character pillars, values, role complexity, mentorship, and proof from real structural work.
- Delivah Dispatch should feel like a conversion and operations funnel: market promise, service pages, intake journey, document upload, admin dashboard, and backend infrastructure.

Shared elements can exist only where they do not flatten the projects:

- Back to Work control.
- SEO wrapper.
- Share/copy controls.
- Final conversion CTA.
- Consistent route naming and basic page shell.

## Route And CTA Implications For Later Phases

Recommended work routes:

- `/work/legit-logistics`
- `/work/kossy-langat`
- `/work/delivah-dispatch-hub`

Recommended portfolio data changes for later phases:

- Add `caseStudyPath: "/work/kossy-langat"` to Kossy Langat.
- Add Delivah Dispatch as a portfolio project with `caseStudyPath: "/work/delivah-dispatch-hub"`.
- Keep every `View Details` action as a real route or change the button label for secondary items that do not yet have routes.

Recommended CTA defaults:

- Legit Logistics: `Automate My Workflow`.
- Kossy Langat: `Build My Personal Brand`.
- Delivah Dispatch: `Build My Service Funnel`.

Default destination remains `/get-started.html` until the conversion architecture changes.

## Phase 2 Open Questions

Resolved in Phase 2:

- Delivah replaces the non-flagship carousel items instead of expanding the carousel.
- The active `Our Work` carousel contains only Legit Logistics, Kossy Langat, and Delivah Dispatch.
- All active `Our Work` items have real `View Details` routes.

Still open before Phase 3:

- Should Kossy's route use project screenshots from the live/source site only, or should it also include original portrait and construction images copied from the source project?
- Should Delivah's case study mention live American business details such as phone number, address, and carrier claims, or keep the proof focused on platform capability to avoid business-claim risk?
- Should all three case-study pages share one CSS file namespace, or should Phase 2 define a shared case-study shell plus project-specific sections inside the same CSS ownership boundary?

## Review Criteria

Phase 1 is ready for review if these answers are clear:

- Each project sells a different CodeByLeon capability.
- Each project deserves its own page because it answers a different visitor question.
- The three layouts should not be identical.
- Each CTA angle matches the project's sales argument.
- The available source evidence is enough to build without unsupported claims.

Current assessment: Phase 1 meets these criteria. Phase 2 resolves carousel composition and active CTA behavior; asset/screenshot policy remains for later implementation phases.

## Phase 2 Decisions

Status: Approved for implementation

- The active `Our Work` carousel now contains only three exhibit projects: Legit Logistics, Kossy Langat, and Delivah Dispatch.
- Delivah Dispatch replaces CodeByLeon in the active `Our Work` carousel so the flagship set sells three distinct capabilities: automation, personal-brand identity, and freight/service funnel operations.
- Reverie Reveal and Leon Madara Portfolio are removed from the active `Our Work` carousel for Phase 2 so the section stays focused on what the business does or can do.
- Kossy Langat gets the public route stub `/work/kossy-langat`.
- Delivah Dispatch gets the public route stub `/work/delivah-dispatch-hub`.
- Projects with a real `caseStudyPath` use `View Details`.
- Secondary projects without a `caseStudyPath` use `Start Similar Project` and link to `/get-started.html`.
- `/get-started.html` remains the default conversion destination for Phase 2.
- Phase 2 stubs intentionally stay lightweight. Full project-specific layouts, screenshots, copy systems, and CSS refinements belong to later phases.
