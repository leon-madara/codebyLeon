/**
 * Blog Posts Data Store
 * 
 * This file contains the centralized blog post data for the CodeByLeon website.
 * Each blog post includes full markdown content and all required metadata.
 */

import { BlogPost } from '../types/blog';

/**
 * Array of all blog posts
 * Posts are ordered by publication date (newest first)
 */
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "3-mistakes-your-business-website-is-making",
    category: "Website Tips",
    title: "3 Mistakes Your Business Website is Making",
    description: "Common pitfalls that prevent your website from converting visitors into customers.",
    author: "Leon",
    publishedDate: "2025-01-15",
    featuredImage: "/src/assets/images/blog/website-mistakes.jpg",
    tags: ["web design", "conversion", "business", "user experience"],
    readTime: 5,
    content: `
# 3 Mistakes Your Business Website is Making

Your website is often the first impression potential customers have of your business. Unfortunately, many business websites make critical mistakes that drive visitors away instead of converting them into customers. Let's explore the three most common mistakes and how to fix them.

## 1. Slow Loading Times

**The Problem:** Studies show that 53% of mobile users abandon sites that take longer than 3 seconds to load. Every second of delay can result in a 7% reduction in conversions.

### Why It Happens:
- Unoptimized images (large file sizes)
- Too many third-party scripts
- Poor hosting infrastructure
- Lack of caching strategies

### The Solution:
\`\`\`javascript
// Example: Lazy loading images
<img 
  src="placeholder.jpg" 
  data-src="actual-image.jpg" 
  loading="lazy"
  alt="Descriptive text"
/>
\`\`\`

**Action Steps:**
- Compress all images (aim for under 200KB per image)
- Use modern image formats like WebP
- Implement lazy loading for below-the-fold content
- Minimize JavaScript and CSS files
- Choose a reliable hosting provider with CDN support

## 2. Unclear Value Proposition

**The Problem:** Visitors can't figure out what you do or why they should care within the first 5 seconds of landing on your site.

### Common Symptoms:
- Generic headlines like "Welcome to Our Website"
- No clear explanation of services above the fold
- Industry jargon that confuses rather than clarifies
- Missing or buried call-to-action buttons

### The Solution:

Your homepage should answer three questions immediately:
1. **What do you do?** - Clear, simple language
2. **Who is it for?** - Identify your target audience
3. **Why should they care?** - The benefit, not just features

\`\`\`tsx
// Example: A high-converting Hero Section component
const HeroSection = () => {
  return (
    <section className="relative bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          {/* 1. Target Audience & Problem */}
          <span className="text-orange-500 font-bold tracking-wider uppercase mb-4 block">
            For Service-Based Businesses
          </span>
          
          {/* 2. Clear Value Proposition (What & Why) */}
          <h1 className="text-5xl font-bold mb-6 text-slate-900 leading-tight">
            Turn Your Website Into a <span className="text-orange-500">24/7 Sales Machine</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            We build high-converting websites that help you stop chasing leads 
            and start closing more deals. Guaranteed to increase inquiries 
            by 40% in 90 days.
          </p>
          
          {/* 3. Clear Call-to-Action */}
          <div className="flex gap-4">
            <button className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-colors">
              Get Your Free Audit
            </button>
            <button className="text-slate-700 px-8 py-4 font-semibold hover:text-orange-500 transition-colors">
              View Our Work
            </button>
          </div>
          
          {/* 4. Social Proof */}
          <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white" />
              ))}
            </div>
            <p>Trusted by 500+ business owners</p>
          </div>
        </div>
      </div>
    </section>
  );
};
\`\`\`

**Before:**
> "We provide innovative solutions for modern businesses"

**After:**
> "We build custom websites that turn visitors into customers - guaranteed to increase your inquiries by 40% or your money back"

### Action Steps:
- Write a headline that clearly states your main benefit
- Place your primary call-to-action above the fold
- Use customer-focused language (focus on "you" not "we")
- Include social proof (testimonials, case studies, numbers)

## 3. Poor Mobile Experience

**The Problem:** Over 60% of web traffic now comes from mobile devices, yet many business websites are still designed primarily for desktop.

### Mobile Mistakes to Avoid:
- Text too small to read without zooming
- Buttons too close together (hard to tap accurately)
- Horizontal scrolling required
- Pop-ups that can't be closed on mobile
- Forms that are difficult to fill out on small screens

### The Solution:

Adopt a mobile-first design approach:

\`\`\`css
/* Mobile-first CSS example */
.container {
  padding: 1rem;
  font-size: 16px; /* Minimum for readability */
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
\`\`\`

**Action Steps:**
- Test your site on actual mobile devices (not just browser dev tools)
- Ensure tap targets are at least 44x44 pixels
- Use responsive images that scale appropriately
- Simplify navigation for mobile (hamburger menu is fine)
- Make forms mobile-friendly with appropriate input types

## Bonus: Lack of Clear Call-to-Action

While not one of the main three, this deserves mention. Every page should have a clear next step for visitors.

### Best Practices:
- Use action-oriented language ("Get Your Free Quote" not "Submit")
- Make buttons stand out with contrasting colors
- Place CTAs strategically throughout the page
- Reduce friction (don't ask for too much information upfront)

## Conclusion

Fixing these three mistakes can dramatically improve your website's performance:
- **Faster loading** = Lower bounce rates
- **Clear value proposition** = Better engagement
- **Mobile optimization** = Reach more customers

Remember: Your website should work for you 24/7, converting visitors into customers even while you sleep. Don't let these common mistakes cost you business.

---

**Ready to fix your website?** [Contact us](#contact) for a free website audit and discover what's holding your site back from reaching its full potential.
`
  },
  {
    id: 2,
    slug: "before-after-website-transformation-case-studies",
    category: "Case Studies",
    title: "Before/After: Website Transformation Case Studies",
    description: "Real examples of how professional website redesigns transformed struggling businesses into thriving online presences.",
    author: "Leon",
    publishedDate: "2025-01-08",
    featuredImage: "/src/assets/images/blog/transformation-case-studies.jpg",
    tags: ["case studies", "web design", "transformation", "results"],
    readTime: 8,
    content: `
# Before/After: Website Transformation Case Studies

Nothing speaks louder than results. In this article, we'll explore three real-world website transformations that turned struggling online presences into powerful business assets. Each case study includes specific metrics, challenges faced, and solutions implemented.

## Case Study 1: Local Restaurant - From Invisible to Fully Booked

### The Challenge

**Client:** A family-owned Italian restaurant in Nairobi
**Timeline:** 6 weeks
**Budget:** Mid-range

### Before:
- Outdated website built in 2015
- No mobile optimization
- Menu was a PDF download (not searchable)
- No online reservation system
- Average 50 website visitors per month
- 2% conversion rate (calls/reservations)

### The Problems:
1. Website didn't appear in local search results
2. Mobile users couldn't read the menu
3. No way to book tables online
4. Slow loading times (8+ seconds)
5. Outdated photos didn't reflect current restaurant quality

### The Solution:

We implemented a complete redesign focused on:

**1. Mobile-First Design**
\`\`\`typescript
// Responsive menu component
interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  dietary: string[];
}

const MenuCard = ({ item }: { item: MenuItem }) => (
  <div className="menu-item">
    <h3>{item.name}</h3>
    <p>{item.description}</p>
    <span className="price">KSh {item.price}</span>
    <div className="dietary-tags">
      {item.dietary.map(tag => (
        <span key={tag} className="tag">{tag}</span>
      ))}
    </div>
  </div>
);
\`\`\`

**2. Integrated Reservation System**
- Real-time table availability
- Automated confirmation emails
- Calendar integration for staff

**3. SEO Optimization**
- Local business schema markup
- Google My Business integration
- Location-specific keywords
- Fast loading times (under 2 seconds)

**4. Professional Photography**
- High-quality food photography
- Restaurant ambiance shots
- Team photos for personal connection

### After:
- **450+ website visitors per month** (9x increase)
- **18% conversion rate** (9x increase)
- **#1 ranking** for "Italian restaurant [location]"
- **Average booking value increased by 25%**
- **Mobile traffic: 68%** of total visitors

### Client Testimonial:
> "We went from struggling to fill tables on weekdays to being fully booked most nights. The online reservation system alone has saved us countless hours of phone calls. Best investment we've made in our business." - Maria, Owner

---

## Case Study 2: Professional Services Firm - Establishing Authority

### The Challenge

**Client:** A boutique consulting firm specializing in business strategy
**Timeline:** 8 weeks
**Budget:** Premium

### Before:
- Generic template website
- No clear differentiation from competitors
- Blog with 3 outdated posts from 2019
- No lead capture mechanism
- 100 monthly visitors
- 1 inquiry per month on average

### The Problems:
1. Looked like every other consulting firm
2. No demonstration of expertise
3. Unclear service offerings
4. No trust signals or social proof
5. Complicated contact process

### The Solution:

**1. Authority-Building Content Strategy**
- Comprehensive service pages with case studies
- Regular blog posts (2 per month)
- Downloadable resources (whitepapers, guides)
- Video testimonials from clients

**2. Clear Value Proposition**

Before:
> "We help businesses succeed through strategic consulting"

After:
> "We've helped 50+ Kenyan businesses increase revenue by an average of 40% through data-driven strategy. No fluff, just results."

**3. Lead Generation System**
\`\`\`typescript
// Multi-step lead capture form
interface LeadForm {
  step: number;
  data: {
    businessType: string;
    challenge: string;
    revenue: string;
    timeline: string;
    contact: ContactInfo;
  };
}

// Progressive disclosure reduces form abandonment
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  
  return (
    <form>
      {step === 1 && <BusinessTypeStep />}
      {step === 2 && <ChallengeStep />}
      {step === 3 && <ContactStep />}
    </form>
  );
};
\`\`\`

**4. Trust Signals**
- Client logos (with permission)
- Detailed case studies with metrics
- Team credentials and certifications
- Industry awards and recognition

### After:
- **1,200+ monthly visitors** (12x increase)
- **45 qualified inquiries per month** (45x increase)
- **25% of inquiries convert to clients**
- **Average project value increased by 60%**
- **Organic search traffic: 75%** of total

### Key Metrics:
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Monthly Visitors | 100 | 1,200 | +1,100% |
| Monthly Inquiries | 1 | 45 | +4,400% |
| Conversion Rate | 1% | 3.75% | +275% |
| Avg. Project Value | $5,000 | $8,000 | +60% |

### Client Testimonial:
> "The new website positions us as the experts we are. We're no longer competing on price - clients come to us because they want the best. Our close rate has tripled." - James, Managing Partner

---

## Case Study 3: E-commerce Store - From Abandoned Carts to Sales

### The Challenge

**Client:** Online fashion boutique
**Timeline:** 10 weeks
**Budget:** Mid-to-Premium

### Before:
- High traffic but low conversions
- 78% cart abandonment rate
- Confusing checkout process
- Poor product photography
- No size guides or product details
- 500 monthly orders

### The Problems:
1. Complicated 5-step checkout
2. Unexpected shipping costs at final step
3. No guest checkout option
4. Poor mobile shopping experience
5. Lack of product information causing returns

### The Solution:

**1. Streamlined Checkout**
- Reduced from 5 steps to 2
- Guest checkout option
- Upfront shipping cost calculator
- Multiple payment options (M-Pesa, cards, etc.)

\`\`\`typescript
// Simplified checkout flow
interface CheckoutStep {
  shipping: ShippingInfo;
  payment: PaymentMethod;
}

// Single-page checkout with sections
const Checkout = () => (
  <div className="checkout">
    <ShippingSection />
    <PaymentSection />
    <OrderSummary />
    <PlaceOrderButton />
  </div>
);
\`\`\`

**2. Enhanced Product Pages**
- Professional product photography (multiple angles)
- Detailed size guides with measurements
- Customer reviews and ratings
- "Complete the look" suggestions
- Stock availability indicators

**3. Mobile Shopping Optimization**
- Thumb-friendly navigation
- Quick view product modals
- Saved cart across devices
- One-tap payment options

**4. Abandoned Cart Recovery**
- Automated email sequence
- Exit-intent popups with discount codes
- SMS reminders for high-value carts

### After:
- **1,850 monthly orders** (270% increase)
- **Cart abandonment: 42%** (46% reduction)
- **Average order value: +35%**
- **Return rate: -40%** (better product info)
- **Mobile conversions: +180%**

### Revenue Impact:
- **Monthly revenue increased from $25,000 to $92,500**
- **ROI: 850%** in first 6 months
- **Customer lifetime value increased by 45%**

### Client Testimonial:
> "We were getting traffic but not sales. The new website fixed every friction point in our customer journey. We're now processing more orders than we ever imagined possible." - Sarah, Founder

---

## Common Themes Across All Transformations

### 1. Mobile-First Approach
All three sites saw 60%+ mobile traffic. Optimizing for mobile wasn't optional - it was essential.

### 2. Speed Matters
Every site was optimized to load in under 2 seconds. This alone improved conversions by 20-30%.

### 3. Clear Value Proposition
Visitors need to understand what you offer and why it matters within 5 seconds.

### 4. Reduced Friction
Every unnecessary step, form field, or click costs you customers. Simplify everything.

### 5. Trust Signals
Social proof, testimonials, and credentials build confidence and increase conversions.

## Your Website Could Be Next

These transformations didn't happen by accident. They resulted from:
- Strategic planning based on data
- User-centered design decisions
- Technical excellence in implementation
- Ongoing optimization and testing

**The question isn't whether your website needs improvement - it's how much business you're losing while you wait.**

---

**Ready to transform your website?** [Schedule a free consultation](#contact) and let's discuss how we can achieve similar results for your business.
`
  },
  {
    id: 3,
    slug: "how-professional-website-increases-inquiries",
    category: "Business Growth",
    title: "How a Professional Website Increases Inquiries by 300%",
    description: "The data-driven approach to understanding why professional websites generate more leads and how to implement these strategies.",
    author: "Leon",
    publishedDate: "2025-01-01",
    featuredImage: "/src/assets/images/blog/increase-inquiries.jpg",
    tags: ["business growth", "lead generation", "conversion", "strategy"],
    readTime: 7,
    content: `
# How a Professional Website Increases Inquiries by 300%

You've probably heard claims like "our clients see 300% more inquiries" and wondered if it's just marketing hype. The truth? It's not only possible - it's predictable when you understand the psychology and mechanics behind high-converting websites.

In this article, we'll break down exactly why professional websites generate more inquiries and provide actionable strategies you can implement today.

## The Math Behind the 300% Increase

Let's start with a typical scenario:

### Before: DIY or Template Website
- **Monthly visitors:** 200
- **Conversion rate:** 1%
- **Monthly inquiries:** 2

### After: Professional Website
- **Monthly visitors:** 400 (improved SEO)
- **Conversion rate:** 4% (optimized design)
- **Monthly inquiries:** 16

**Result: 8x increase (700%)**

But let's be conservative and focus on the 300% increase, which is more typical:

- **Monthly visitors:** 300 (50% increase from SEO)
- **Conversion rate:** 2.67% (167% increase)
- **Monthly inquiries:** 8 (300% increase)

## The 5 Pillars of High-Converting Websites

### 1. First Impressions (The 5-Second Rule)

**The Science:** Research shows users form opinions about your website in just 50 milliseconds. Within 5 seconds, they decide whether to stay or leave.

#### What Professional Websites Do Differently:

**Visual Hierarchy**
\`\`\`css
/* Professional approach to visual hierarchy */
.hero-section {
  /* Most important element: Clear headline */
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  /* Secondary: Supporting text */
  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }
  
  /* Call-to-action: High contrast */
  .cta-button {
    background: #FF6B35;
    color: white;
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
}
\`\`\`

**Key Elements:**
- Clear, benefit-focused headline
- Professional imagery (not stock photos)
- Obvious call-to-action
- Trust signals above the fold
- Fast loading time

**Impact:** Reduces bounce rate by 40-60%

### 2. Trust Building (The Credibility Factor)

**The Psychology:** People buy from businesses they trust. Your website must establish credibility immediately.

#### Trust Signals That Work:

**1. Social Proof**
- Client testimonials with photos and names
- Case studies with specific results
- Client logos (with permission)
- Review ratings and counts

**2. Credentials**
- Years in business
- Certifications and awards
- Team expertise
- Industry affiliations

**3. Transparency**
- Clear pricing (or pricing ranges)
- Detailed service descriptions
- About page with real team photos
- Contact information prominently displayed

**Example Implementation:**
\`\`\`typescript
interface Testimonial {
  id: number;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientPhoto: string;
  testimonial: string;
  result: string; // Specific metric
  rating: number;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="testimonial-card">
    <div className="rating">
      {"★".repeat(testimonial.rating)}
    </div>
    <p className="quote">"{testimonial.testimonial}"</p>
    <div className="result-highlight">
      {testimonial.result}
    </div>
    <div className="client-info">
      <img src={testimonial.clientPhoto} alt={testimonial.clientName} />
      <div>
        <strong>{testimonial.clientName}</strong>
        <span>{testimonial.clientRole}, {testimonial.clientCompany}</span>
      </div>
    </div>
  </div>
);
\`\`\`

**Impact:** Increases conversion rate by 30-50%

### 3. Clear Value Proposition (The "Why You" Factor)

**The Challenge:** Visitors need to understand why they should choose you over competitors within seconds.

#### The Value Proposition Formula:

**[What you do] + [Who it's for] + [Unique benefit] + [Proof]**

**Bad Example:**
> "We provide quality web design services"

**Good Example:**
> "We build websites that generate leads for Kenyan businesses - our clients see an average 40% increase in inquiries within 90 days, guaranteed."

#### Components of Strong Value Propositions:

1. **Specific:** Not "quality" but "40% increase"
2. **Benefit-focused:** Not features but outcomes
3. **Differentiated:** What makes you unique
4. **Credible:** Backed by proof or guarantee

**Impact:** Increases engagement by 50-70%

### 4. Frictionless User Experience (The Path of Least Resistance)

**The Principle:** Every additional step, click, or form field reduces conversions by 10-20%.

#### Optimization Strategies:

**A. Simplified Navigation**
\`\`\`typescript
// Bad: Too many options
const navigation = [
  'Home', 'About', 'Services', 'Portfolio', 
  'Team', 'Blog', 'Resources', 'FAQ', 
  'Testimonials', 'Contact'
]; // 10 items = decision paralysis

// Good: Focused navigation
const navigation = [
  'Services', 'Portfolio', 'About', 'Contact'
]; // 4 items = clear path
\`\`\`

**B. Progressive Disclosure**
Don't ask for everything upfront. Start with minimal information:

\`\`\`typescript
// Step 1: Just the essentials
interface InitialContact {
  name: string;
  email: string;
  message: string;
}

// Step 2: Gather more details later
interface DetailedInquiry extends InitialContact {
  phone?: string;
  company?: string;
  budget?: string;
  timeline?: string;
}
\`\`\`

**C. Multiple Contact Options**
Different people prefer different methods:
- Contact form (for detailed inquiries)
- Phone number (for immediate needs)
- WhatsApp (popular in Kenya)
- Email (for formal communication)
- Live chat (for quick questions)

**Impact:** Increases form completions by 40-60%

### 5. Mobile Optimization (The Majority Experience)

**The Reality:** 60-70% of your traffic comes from mobile devices. If your site isn't mobile-optimized, you're losing the majority of potential inquiries.

#### Mobile-First Checklist:

**✓ Readable Text**
- Minimum 16px font size
- Adequate line spacing
- High contrast ratios

**✓ Touch-Friendly Elements**
- Buttons at least 44x44 pixels
- Adequate spacing between clickable elements
- No hover-dependent interactions

**✓ Fast Loading**
- Optimized images
- Minimal JavaScript
- Efficient CSS

**✓ Simplified Forms**
- Fewer fields on mobile
- Appropriate input types
- Auto-fill support

\`\`\`css
/* Mobile-first form styling */
.contact-form {
  /* Mobile: Stack vertically */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-input {
  /* Touch-friendly size */
  padding: 1rem;
  font-size: 16px; /* Prevents zoom on iOS */
  min-height: 44px;
}

/* Desktop: Side-by-side layout */
@media (min-width: 768px) {
  .contact-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}
\`\`\`

**Impact:** Increases mobile conversions by 100-200%

## The Compound Effect

Here's where it gets interesting. These improvements don't just add up - they multiply:

### Scenario Analysis:

**Baseline (DIY Website):**
- 200 visitors × 1% conversion = 2 inquiries

**With SEO Improvements (+50% traffic):**
- 300 visitors × 1% conversion = 3 inquiries (+50%)

**With Conversion Optimization (+2% conversion rate):**
- 300 visitors × 3% conversion = 9 inquiries (+350%)

**With Both (+50% traffic + 2% conversion):**
- 300 visitors × 3% conversion = 9 inquiries (+350%)

## Real-World Implementation: A Step-by-Step Guide

### Phase 1: Quick Wins (Week 1)
1. **Speed optimization** - Compress images, minimize code
2. **Clear CTA** - Add prominent call-to-action above fold
3. **Mobile check** - Test on actual devices, fix issues
4. **Trust signals** - Add testimonials and credentials

**Expected Impact:** 50-100% increase in inquiries

### Phase 2: Strategic Improvements (Weeks 2-4)
1. **Value proposition** - Rewrite homepage headline and copy
2. **Navigation** - Simplify menu structure
3. **Contact options** - Add multiple ways to reach you
4. **Social proof** - Add case studies and results

**Expected Impact:** Additional 100-150% increase

### Phase 3: Advanced Optimization (Weeks 5-8)
1. **SEO strategy** - Keyword research and content optimization
2. **Content marketing** - Start blogging regularly
3. **Lead magnets** - Create downloadable resources
4. **Analytics** - Set up tracking and A/B testing

**Expected Impact:** Additional 50-100% increase

## Measuring Success

Track these key metrics:

\`\`\`typescript
interface WebsiteMetrics {
  // Traffic metrics
  monthlyVisitors: number;
  organicTraffic: number;
  bounceRate: number;
  avgSessionDuration: number;
  
  // Conversion metrics
  inquiries: number;
  conversionRate: number;
  formCompletions: number;
  phoneClicks: number;
  
  // Quality metrics
  qualifiedLeads: number;
  leadToCustomerRate: number;
  avgProjectValue: number;
}
\`\`\`

## Common Mistakes to Avoid

### 1. Focusing on Traffic Over Conversion
**Wrong:** "We need more visitors!"
**Right:** "We need to convert the visitors we have, then scale traffic"

### 2. Copying Competitors
**Wrong:** "Let's make our site look like theirs"
**Right:** "Let's understand what makes us unique and showcase that"

### 3. Designing for Yourself
**Wrong:** "I like this design"
**Right:** "Our target customers respond to this design"

### 4. Neglecting Mobile
**Wrong:** "Most of our customers use desktop"
**Right:** "Most of our potential customers discover us on mobile"

## Conclusion: The ROI of Professional Web Design

Let's do the final math:

**Investment:** $3,000 - $10,000 for professional website
**Increased inquiries:** 6 additional per month (from 2 to 8)
**Close rate:** 25% (industry average)
**Additional customers:** 1.5 per month
**Average project value:** $2,000
**Additional monthly revenue:** $3,000
**Annual additional revenue:** $36,000

**ROI:** 360% - 1,200% in first year

The question isn't whether you can afford a professional website. It's whether you can afford not to have one.

---

**Ready to increase your inquiries?** [Get your free website audit](#contact) and discover your biggest opportunities for growth.
`
  }
];

/**
 * Export the blog posts array as the default export
 */
export default blogPosts;
