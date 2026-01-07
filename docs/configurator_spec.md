# Service Configurator Flow - Code by Leon

Interactive step-by-step form to qualify leads and recommend the right service package.

## Flow Overview (6 Steps)

### Step 1: Business Type
**Question**: "What describes you best?"
**Options**:
- 🏢 Small Business
- 🎨 Creative Professional  
- 🚀 Startup/New Venture
- 🔄 Existing Business

### Step 2: Current Website Status
**Question**: "Where are you now?"
**Options**:
- ❌ No Website
- 🛠️ DIY Site (Wix, WordPress)
- 📉 Outdated Site
- ✅ Modern Site (just need support)

### Step 3: Main Goal
**Question**: "What's your priority?"
**Options**:
- 🎯 Get More Leads
- 💼 Look Professional
- 📱 Sell Online
- 🎨 Showcase Work

### Step 4: Timeline
**Question**: "How soon do you need this?"
**Options**:
- ⚡ Urgent (ASAP)
- 📅 Soon (1 month)
- 🕐 Flexible (2-3 months)

### Step 5: Budget Range
**Question**: "What's your investment range?"
**Options**:
- 💰 KES 30-50K
- 💵 KES 50-100K
- 💎 KES 100K+
- 🤔 Not sure yet

### Step 6: Personalized Result
**Display**: Recommended package based on answers
**Elements**:
- Package name (e.g., "Launch Site in 10 Days")
- Why it fits (matching their inputs)
- What's included (bullet list)
- Pricing
- CTA: "Book Your Free Strategy Call"

---

## UI Patterns

### Progress Indicator
- 6 dots at top of screen
- Current step highlighted in orange (#D9751A)
- Completed steps filled, upcoming steps outlined

### Card Selection
- 2x2 grid on desktop, stacked on mobile
- Hover: Orange border + subtle shadow/glow
- Selected: Orange background with white text
- Icon + Label layout

### Navigation
- "Continue" button (disabled until selection made)
- "Back" link (grey, top-left)
- Auto-advance on selection (optional)

---

## Visual States

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#F3F1F9` | `#111110` |
| Card | `#FFFFFF` | `#1F1001` |
| Card Hover | Orange border + shadow | Orange glow |
| Selected Card | `#D9751A` bg | `#D9751A` with glow |
| Text | `#13100E` | `#D6D7D3` |

---

## Implementation Notes

- Save progress in localStorage
- Analytics: Track drop-off at each step
- Email capture at Step 5 (optional: "Send me results")
- Final screen: Embed Calendly or WhatsApp direct link
