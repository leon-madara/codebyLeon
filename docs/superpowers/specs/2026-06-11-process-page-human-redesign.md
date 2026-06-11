# Process Page: Confident and Human Redesign

Date: 2026-06-11  
Route: `/process`  
Selected direction: Confident and Human

## Intent Blueprint

**Primary visitor question:**  
What will working with Code by Leon actually feel like?

**Business answer:**  
The work is collaborative without making the client manage the technical details. Decisions are made visibly, direction is approved before production, and launch includes a clear handoff and two weeks of support.

**Primary audience:**  
Founders and business owners who want a distinctive website but are wary of unclear scope, technical black boxes, surprise reveals, and being abandoned after launch.

**Visitor stage:**  
The visitor understands the offer and is deciding whether Code by Leon feels trustworthy enough to contact or request a quote.

**Primary CTA:**  
Build Your Quote -> `/get-started.html`

**Secondary CTA:**  
Meet the Process -> the journey section on the same page

## Subquestion Ladder

1. Is this process understandable if I am not technical?
2. How involved will I need to be?
3. When do I see and approve the work?
4. What happens during each stage?
5. What does Code by Leon handle, and what is expected from me?
6. What will I receive before launch?
7. What happens after the site goes live?
8. What is the next low-pressure step?

## Narrative Structure

### 1. Hero: The Relationship Promise

The hero leads with the feeling of the engagement rather than a generic process claim.

**Eyebrow:**  
A clearer way to build

**Headline:**  
You bring the ambition. I will keep the work clear.

**Body:**  
You stay close to the decisions without having to manage the technical details. Each stage gives you something useful to review, approve, or take forward.

**Actions:**  
- Build Your Quote
- Meet the Process

**Visual treatment:**  
- Asymmetrical two-column composition
- Large editorial headline on the left
- Existing authentic process photograph on the right
- Warm atmospheric brand glow behind the page, not a boxed hero card
- A small overlapping note on the image: "Built with you, not hidden from you."

### 2. The Promise: Three Trust Commitments

This section answers the visitor's biggest concerns before describing individual stages.

1. **You always know what is happening.**  
   Updates stay useful, direct, and tied to the next decision.

2. **You approve before I build.**  
   The direction becomes visible before it becomes expensive.

3. **You leave with a site you can own.**  
   Launch includes access, guidance, and support while the site settles into real use.

**Visual treatment:**  
One continuous editorial row with dividers. These are commitments, not three floating cards.

### 3. Journey: Five Moments in One Working Relationship

The stages should read as a continuous journey rather than five unrelated service cards.

#### 01. Listen Together

**Promise:**  
We turn the initial idea into a specific business problem.

**You bring:**  
Your goals, audience, constraints, rough budget, and what is not working today.

**I bring:**  
Focused questions, technical guidance, and a written direction for the useful first version.

**You leave with:**  
A clearer project, even before production starts.

#### 02. Set the Direction

**Promise:**  
Scope, priorities, and trade-offs become visible before work begins.

**You bring:**  
The priorities and timing that matter most to the business.

**I bring:**  
A quote, roadmap, inclusions, exclusions, and clear decision points.

**You leave with:**  
A project with defined edges rather than an open-ended estimate.

#### 03. Make It Visible

**Promise:**  
The structure and creative direction are agreed before the build gets expensive.

**You bring:**  
References, content context, and focused feedback at planned checkpoints.

**I bring:**  
Wireframes, page intent, visual direction, and recommendations grounded in the business goal.

**You leave with:**  
An approved experience, not a surprise reveal.

#### 04. Build in the Open

**Promise:**  
The website becomes real in visible, reviewable increments.

**You bring:**  
Feedback on working private previews.

**I bring:**  
Responsive development, interactions, content integration, performance work, and core SEO setup.

**You leave with:**  
Confidence in the site before launch day.

#### 05. Launch With Support

**Promise:**  
Launch is a supported handoff, not a cliff edge.

**You bring:**  
Final approval, confirmed access, and launch-day notes.

**I bring:**  
Final checks, analytics basics, launch coordination, handoff guidance, and two weeks of included adjustments.

**You leave with:**  
A live site you can confidently own and use.

**Visual treatment:**  
- A single flowing progress path joins all five stages
- Alternating image and content alignment creates rhythm
- The active stage gains emphasis as it enters the viewport
- Each stage shows the promise first, then the role split and outcome
- No nested cards and no repeated three-column detail grid inside every stage

### 4. Role Clarity: You Do Not Need to Project-Manage the Build

**Section headline:**  
Close to the decisions. Free from the technical overhead.

**Your role:**  
- Share business context
- Choose priorities
- Approve direction
- Give focused feedback
- Confirm launch

**My role:**  
- Turn context into a plan
- Guide technical decisions
- Make progress visible
- Build and test the experience
- Handle launch and handoff

**Supporting line:**  
You stay involved where your judgment matters. The implementation stays with Code by Leon.

### 5. Questions Before Commitment

Use an accessible accordion so the page remains easy to scan.

**What if I do not know exactly what I need?**  
That is normal. The first stage sorts the idea, business goal, and useful first version before you commit to detailed build decisions.

**How much time will you need from me?**  
Your involvement is concentrated around context, approvals, and planned feedback. You will not be asked to manage the technical work.

**Will I see the website before launch?**  
Yes. Private previews make progress visible and give you clear points to review the working site.

**What happens after launch?**  
The first two weeks cover real-world adjustments, small fixes, and handoff support. Longer-term care can continue separately when needed.

### 6. Closing CTA

**Headline:**  
Start with a clearer first conversation.

**Body:**  
The quote builder gives us useful project context without asking you to write a perfect brief.

**CTA:**  
Build Your Quote

## Visual System

- Preserve the current Code by Leon lavender canvas, ember orange, coral, navy, and atmospheric glow.
- Use the existing display type for major emotional statements and the body font for clarity.
- Use the existing process photograph as the main human anchor.
- Favor large editorial type, dividers, whitespace, and continuous layouts over floating glass cards.
- Use rounded forms selectively: CTA pills, the image note, and FAQ controls.
- Avoid generic agency icon grids, fake dashboards, invented statistics, testimonials, awards, and logos.
- Support both light and dark themes through existing custom properties.

## Motion and Interaction

- Use `useGSAP` and `ScrollTrigger` only.
- Respect `prefers-reduced-motion`.
- Hero copy reveals in a short stagger.
- The journey path draws as the visitor moves through the stages.
- Each stage shifts from muted to active emphasis on entry.
- FAQ accordions work with mouse, keyboard, and screen readers.
- Motion must clarify sequence and current stage; it must not delay reading.

## Responsive Behavior

- Desktop: asymmetrical hero, horizontal trust commitments, alternating journey stages.
- Tablet: reduced asymmetry, two-column role clarity, vertical journey path.
- Mobile: image follows the hero copy, commitments become divided rows, journey becomes one vertical story, and CTAs remain visible without horizontal overflow.
- The first primary CTA should remain visible within the opening mobile viewport at 390px width.

## Copy Audit

**Tone:** Confident, human, calm, and trustworthy  
**Domain:** Creative technology studio

### Confirmed Claims Retained

- The process includes private previews.
- Scope and direction are established before production.
- The build includes responsive implementation, performance work, and core SEO setup.
- Launch includes analytics basics and a handoff.
- Two weeks of post-launch adjustments are included.

### Claims Avoided

- No unverified performance metrics
- No client counts
- No awards or rankings
- No guaranteed business outcomes
- No named client endorsements

### Key Copy Changes

| Section | Current | Revised |
| --- | --- | --- |
| Hero | What happens after you choose Code by Leon? | You bring the ambition. I will keep the work clear. |
| Hero support | A web project should not feel like handing your business to a stranger and hoping for the best. | You stay close to the decisions without having to manage the technical details. |
| Process framing | Five steps that keep the project understandable. | Five moments in one working relationship. |
| Detail framing | You do / You get / This removes | You bring / I bring / You leave with |
| Closing | Start with a quote that matches the work. | Start with a clearer first conversation. |

## Component and File Scope

**Production files to update:**
- `src/pages/ProcessPage.tsx`
- `src/styles/sections/process.css`
- `src/App.test.tsx`
- A focused Process page test file if interaction coverage is clearer outside the route test

**Files out of scope:**
- Homepage sections
- Navigation structure
- Global theme tokens
- Quote configurator behavior
- Other routes

## Acceptance Criteria

1. The opening screen communicates collaboration and clarity before listing steps.
2. The page distinguishes client responsibilities from Code by Leon responsibilities.
3. The five stages read as one continuous relationship.
4. The page contains one primary conversion path to `/get-started.html`.
5. The quote CTA remains visible in the first mobile viewport.
6. The FAQ is keyboard accessible and exposes state correctly.
7. Reduced-motion users receive the complete content without reveal dependencies.
8. There is no horizontal overflow at desktop, tablet, or 390px mobile widths.
9. `npm run test`, `npm run build`, and `npm run css:gates` pass.
10. Browser review confirms visual hierarchy, readable line lengths, working anchors, and responsive behavior.
