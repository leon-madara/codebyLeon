# Service Configurator - Refined Specification
## Code by Leon | "Get In Touch" Interactive Experience

---

## Page Context
**URL**: `/get-started.html` or `/configure.html`  
**Purpose**: Replace traditional contact forms with a concierge-style intake that qualifies leads and delivers personalized recommendations.  
**Entry Points**: "GET IN TOUCH" CTA button, "START YOUR PROJECT" hero CTA

---

## Page Structure

### Hero Section (Above the Fold)
**Headline**: "Let's Build Your Perfect Solution"  
**Subheadline**: "Answer a few quick questions and we'll recommend the right package for your business."  
**Visual**: Subtle abstract orbs (same as homepage) with frosted overlay

---

## Flow: 6-Step Configurator

### Step 1: Business Identity
**Headline**: "First, tell us about yourself"  
**Subheadline**: "This helps us understand your needs"

**Options** (2x2 Grid):
1. **🏢 Small Business Owner**  
   *"I run a local shop or service business"*

2. **🎨 Creative Professional**  
   *"I'm a photographer, designer, or artist"*

3. **🚀 Startup Founder**  
   *"I'm launching something new"*

4. **🔄 Growing Brand**  
   *"I have an established business that's scaling"*

---

### Step 2: Current Digital Presence
**Headline**: "Where are you starting from?"  
**Subheadline**: "We'll build on what you have—or start fresh"

**Options**:
1. **❌ No Website Yet**  
   *"I'm starting from scratch"*

2. **🛠️ DIY Website**  
   *"I built it on Wix, WordPress, or Squarespace"*

3. **📉 Outdated Website**  
   *"I have a site, but it looks old or doesn't work well"*

4. **✅ Modern Site**  
   *"My site looks good—I just need support or features"*

---

### Step 3: Primary Business Goal
**Headline**: "What's most important to you?"  
**Subheadline**: "Choose your top priority"

**Options**:
1. **🎯 Generate More Leads**  
   *"I want people to contact me or sign up"*

2. **💼 Establish Credibility**  
   *"I need to look professional and trustworthy"*

3. **📱 Sell Products/Services Online**  
   *"I want an online store or booking system"*

4. **🎨 Showcase My Portfolio**  
   *"I need a beautiful gallery for my work"*

---

### Step 4: Project Timeline
**Headline**: "How soon do you need this live?"  
**Subheadline**: "We offer rush options for urgent launches"

**Options**:
1. **⚡ ASAP (1-2 Weeks)**  
   *"I need it yesterday—rush pricing applies"*

2. **📅 Within a Month**  
   *"Next 2-4 weeks is ideal"*

3. **🕐 Flexible (2-3 Months)**  
   *"I'm planning ahead—no rush"*

---

### Step 5: Investment Range
**Headline**: "What's your budget for this project?"  
**Subheadline**: "Be honest—we have options for every stage"

**Options**:
1. **💰 KES 30,000 - 50,000**  
   *"Launch Site Package"*

2. **💵 KES 50,000 - 100,000**  
   *"Brand Refresh or Custom Build"*

3. **💎 KES 100,000+**  
   *"Premium or E-Commerce Solution"*

4. **🤔 Not Sure Yet**  
   *"Let's discuss what makes sense"*

---

### Step 6: Personalized Recommendation
**Dynamic Content Based on Answers**

#### Example Result Layout:
```
┌─────────────────────────────────────────┐
│  ✨ Your Perfect Fit:                   │
│                                         │
│  🚀 10-Day Launch Site                  │
│  KES 35,000 - KES 45,000                │
│                                         │
│  Why This Works for You:                │
│  • Starting fresh (no old code to fix)  │
│  • Fast timeline (ASAP launch)          │
│  • Budget-friendly starter package      │
│                                         │
│  What's Included:                       │
│  ✓ 3-5 Page Custom Site                 │
│  ✓ Mobile-Responsive Design             │
│  ✓ Contact Forms & WhatsApp Integration │
│  ✓ Google Maps & Social Links           │
│  ✓ 1 Month Free Support                 │
│                                         │
│  [📞 Book Your Free Strategy Call]     │
│  [💬 WhatsApp Leon Directly]           │
└─────────────────────────────────────────┘
```

**Logic Mapping Examples**:
- **No Website + ASAP + 30-50K Budget** → *10-Day Launch Site*
- **Outdated Site + Credibility + Flexible** → *Brand Refresh Package*
- **Modern Site + More Features + 100K+** → *Ongoing Support Tier*

---

## UI/UX Design Patterns

### Progress Indicator
- **Position**: Top center, fixed
- **Style**: 6 circular dots
  - **Active**: Filled orange (`#D9751A`)
  - **Completed**: Filled with checkmark
  - **Upcoming**: Outlined grey

### Card Selection
- **Layout**: 2x2 grid (desktop), vertical stack (mobile)
- **Default State**: White card, grey border, 12px radius
- **Hover**: Orange border (`#D9751A`), subtle shadow lift
- **Selected**: Solid orange background, white text, scale(1.02)

### Navigation
- **Continue Button**: Bottom-right, orange, disabled until selection
- **Back Link**: Top-left, grey text, "← Back"
- **Skip Option**: (Optional) "I'll explain on the call" for Step 5

### Animations
- **Card Entry**: Stagger fade-in (0.1s delay each)
- **Step Transition**: Slide left-to-right
- **Progress Update**: Smooth fill animation

---

## Theme Adaptations

### Light Mode
- Background: `#F2EFFD` (Pearl White)
- Cards: `#FFFFFF`
- Selected: `#D9751A`
- Text: `#1a1a2e`

### Dark Mode
- Background: `#021127` (Midnight Blue)
- Cards: `rgba(255, 255, 255, 0.08)`
- Selected: `#D9751A` with glow
- Text: `#f0f0f5`

---

## Technical Implementation Notes

1. **State Management**: Save progress in `localStorage` (resume if user refreshes)
2. **Analytics**: Track drop-off at each step via Google Analytics events
3. **Email Fallback**: At Step 6, offer "Email me my recommendation"
4. **Booking Integration**: Final CTA links to Calendly or WhatsApp
5. **Validation**: Require selection before "Continue" activates
6. **Accessibility**: Full keyboard navigation, ARIA labels

---

## Conversion Optimization Features

- **Social Proof**: "Join 47+ Kenyan businesses we've helped" (below hero)
- **Trust Badges**: Payment icons, "No Credit Card Required" badge
- **Exit Intent**: If user tries to leave, offer "Save Your Progress" modal
- **Mobile UX**: Swipe gestures for step navigation

---

## Next Steps for Implementation
1. Build HTML structure with step components
2. Create CSS for card grid, animations, progress bar
3. Add JavaScript for state management and step transitions
4. Integrate recommendation logic (if/else rules or scoring system)
5. Connect final CTAs to Calendly and WhatsApp
