# Design Document: Blog Routing System

## Overview

This design document outlines the technical architecture for implementing a clickable blog card system with individual blog post pages in the CodeByLeon portfolio website. The solution will integrate React Router for client-side routing, maintain the existing design aesthetic, and provide a seamless user experience for browsing and reading blog content.

The implementation will transform the current static blog section into a dynamic, navigable blog system while preserving the site's visual identity, theme switching capabilities, and responsive design patterns.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App Component                         │
│                     (Router Provider)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── ThemeProvider
                              ├─── MouseTrail
                              ├─── Navigation
                              │
                              └─── Routes
                                    │
                                    ├─── "/" (Home Page)
                                    │     ├─── Hero
                                    │     ├─── Portfolio
                                    │     ├─── About
                                    │     ├─── MultiCardScrollSection
                                    │     ├─── Blog (Preview)
                                    │     └─── FinalCTA
                                    │
                                    ├─── "/blog" (Blog Listing)
                                    │     └─── BlogListingPage
                                    │           └─── BlogCard[]
                                    │
                                    └─── "/blog/:slug" (Blog Post)
                                          └─── BlogPostPage
                                                ├─── BlogHeader
                                                ├─── BlogContent
                                                └─── BlogFooter
```

### Routing Strategy

**Client-Side Routing with React Router v6:**
- Use `BrowserRouter` for clean URLs without hash fragments
- Implement route-based code splitting for performance
- Maintain scroll position management between routes
- Support browser back/forward navigation

**Route Structure:**
- `/` - Home page with all sections including blog preview
- `/blog` - Full blog listing page
- `/blog/:slug` - Individual blog post page
- `/blog/*` - 404 fallback for invalid slugs

## Components and Interfaces

### 1. Router Configuration

**File:** `src/App.tsx` (modified)

```typescript
interface AppRoutes {
  path: string;
  element: ReactElement;
  children?: AppRoutes[];
}
```

**Responsibilities:**
- Configure React Router with BrowserRouter
- Define route hierarchy
- Implement ScrollToTop component for route changes
- Wrap routes with ThemeProvider and global components

### 2. Blog Data Types

**File:** `src/types/blog.ts` (new)

```typescript
interface BlogPost {
  id: number;
  slug: string;
  category: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedDate: string;
  featuredImage?: string;
  tags: string[];
  readTime: number; // in minutes
}

interface BlogMetadata {
  totalPosts: number;
  categories: string[];
  tags: string[];
}
```

### 3. Blog Data Store

**File:** `src/data/blogPosts.ts` (new)

```typescript
const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "3-mistakes-your-business-website-is-making",
    category: "Website Tips",
    title: "3 Mistakes Your Business Website is Making",
    description: "Common pitfalls that prevent your website from converting visitors into customers.",
    content: "...", // Full markdown or HTML content
    author: "Leon",
    publishedDate: "2025-01-01",
    featuredImage: "/images/blog/website-mistakes.jpg",
    tags: ["web design", "conversion", "business"],
    readTime: 5
  },
  // ... more posts
];

// Utility functions
function getBlogPostBySlug(slug: string): BlogPost | undefined;
function getAllBlogPosts(): BlogPost[];
function getBlogPostsByCategory(category: string): BlogPost[];
function generateSlug(title: string): string;
```

### 4. BlogCard Component (Enhanced)

**File:** `src/components/sections/BlogCard.tsx` (new)

```typescript
interface BlogCardProps {
  post: BlogPost;
  variant?: 'preview' | 'full';
}
```

**Responsibilities:**
- Render blog post preview information
- Handle click navigation using React Router's `useNavigate`
- Provide hover and focus states
- Support keyboard navigation
- Display read time and publication date
- Maintain existing visual design with orbs and frosted overlay

**Key Features:**
- Entire card is clickable (not just "Read More" link)
- Accessible with proper ARIA labels
- Smooth hover transitions
- Responsive layout

### 5. Blog Section Component (Modified)

**File:** `src/components/sections/Blog.tsx` (modified)

```typescript
interface BlogSectionProps {
  limit?: number; // Number of posts to display (for home page preview)
  showViewAll?: boolean; // Show "View All" button
}
```

**Responsibilities:**
- Display blog cards in grid layout
- Fetch blog posts from data store
- Support limiting posts for home page preview
- Provide "View All Articles" link to `/blog`
- Maintain existing orbs and frosted overlay design

### 6. BlogListingPage Component

**File:** `src/pages/BlogListingPage.tsx` (new)

```typescript
interface BlogListingPageProps {
  // No props needed initially
}

interface BlogListingState {
  posts: BlogPost[];
  selectedCategory: string | null;
  sortBy: 'date' | 'title';
}
```

**Responsibilities:**
- Display all blog posts in grid layout
- Implement category filtering
- Implement sorting (by date or title)
- Maintain consistent design with home page blog section
- Include page header with title and description
- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)

### 7. BlogPostPage Component

**File:** `src/pages/BlogPostPage.tsx` (new)

```typescript
interface BlogPostPageProps {
  // Uses useParams() to get slug from URL
}

interface BlogPostPageState {
  post: BlogPost | null;
  loading: boolean;
  error: string | null;
  relatedPosts: BlogPost[];
}
```

**Responsibilities:**
- Fetch blog post by slug from URL parameter
- Display full blog post content
- Render featured image if available
- Show post metadata (author, date, read time, category)
- Display "Back to Blog" navigation
- Show related posts at bottom
- Handle 404 for invalid slugs
- Set document title and meta tags
- Maintain theme consistency
- Responsive typography and layout

### 8. BlogContent Component

**File:** `src/components/Blog/BlogContent.tsx` (new)

```typescript
interface BlogContentProps {
  content: string;
  format: 'markdown' | 'html';
}
```

**Responsibilities:**
- Render blog post content with proper formatting
- Support markdown rendering (using react-markdown)
- Apply consistent typography styles
- Handle code blocks with syntax highlighting
- Render images responsively
- Support embedded media

### 9. BlogHeader Component

**File:** `src/components/Blog/BlogHeader.tsx` (new)

```typescript
interface BlogHeaderProps {
  title: string;
  category: string;
  author: string;
  publishedDate: string;
  readTime: number;
  featuredImage?: string;
}
```

**Responsibilities:**
- Display blog post title with proper heading hierarchy
- Show category badge
- Display author and publication date
- Show estimated read time
- Render featured image with proper aspect ratio
- Responsive layout

### 10. BlogFooter Component

**File:** `src/components/Blog/BlogFooter.tsx` (new)

```typescript
interface BlogFooterProps {
  currentPostId: number;
  relatedPosts: BlogPost[];
}
```

**Responsibilities:**
- Display "Back to Blog" link
- Show related posts (3 cards)
- Include social sharing buttons
- Provide navigation to next/previous posts
- CTA for newsletter or contact

### 11. Navigation Component (Modified)

**File:** `src/components/Layout/Navigation.tsx` (modified)

**Changes:**
- Update Blog link from `#blog` to `/blog`
- Use React Router's `Link` component instead of anchor tags
- Highlight active route using `useLocation`
- Maintain existing theme toggle functionality

### 12. ScrollToTop Component

**File:** `src/components/ScrollToTop.tsx` (new)

```typescript
// Utility component to scroll to top on route change
```

**Responsibilities:**
- Listen to route changes
- Scroll window to top when route changes
- Preserve scroll position for browser back/forward

## Data Models

### BlogPost Data Model

```typescript
interface BlogPost {
  // Unique identifier
  id: number;
  
  // URL-friendly slug (kebab-case)
  slug: string;
  
  // Post metadata
  category: string;
  title: string;
  description: string; // Short preview text
  
  // Full content (markdown or HTML)
  content: string;
  
  // Author information
  author: string;
  
  // Publication date (ISO 8601 format)
  publishedDate: string;
  
  // Optional featured image URL
  featuredImage?: string;
  
  // Tags for categorization
  tags: string[];
  
  // Estimated read time in minutes
  readTime: number;
}
```

### Slug Generation Rules

```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Replace multiple hyphens with single
}
```

**Examples:**
- "3 Mistakes Your Business Website is Making" → "3-mistakes-your-business-website-is-making"
- "Before/After: Website Transformation" → "beforeafter-website-transformation"

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Unique Slug Generation

*For any* set of blog posts, all generated slugs must be unique across the entire blog post collection.

**Validates: Requirements 1.2, 7.2**

### Property 2: Slug URL Safety

*For any* blog post title, the generated slug must contain only lowercase letters, numbers, and hyphens, with no consecutive hyphens or leading/trailing hyphens.

**Validates: Requirements 7.1, 7.5**

### Property 3: Route Navigation Consistency

*For any* valid blog post slug, navigating to `/blog/:slug` and then clicking "Back to Blog" should return the user to `/blog` with the same scroll position and filter state.

**Validates: Requirements 2.6, 4.4**

### Property 4: Card Click Navigation

*For any* blog card rendered on any page, clicking anywhere within the card boundaries (except interactive child elements) should navigate to the corresponding blog post page.

**Validates: Requirements 3.2, 3.6**

### Property 5: Theme Persistence Across Routes

*For any* theme setting (light or dark), navigating between routes should maintain the same theme without flickering or resetting.

**Validates: Requirements 4.5**

### Property 6: Responsive Layout Integrity

*For any* viewport width, all blog components should render without horizontal scrolling and maintain readable text sizes (minimum 16px for body text).

**Validates: Requirements 10.1, 10.2, 10.5**

### Property 7: 404 Handling for Invalid Slugs

*For any* non-existent blog post slug, navigating to `/blog/:slug` should either display a 404 page or redirect to `/blog` without crashing the application.

**Validates: Requirements 2.5**

### Property 8: Keyboard Navigation Accessibility

*For any* blog card, pressing Tab should focus the card, and pressing Enter or Space should navigate to the blog post page.

**Validates: Requirements 3.5, 3.6**

### Property 9: Blog Data Validation

*For any* blog post in the data store, all required fields (id, slug, title, description, content, author, publishedDate, category, tags, readTime) must be present and non-empty.

**Validates: Requirements 8.4**

### Property 10: Related Posts Relevance

*For any* blog post, the related posts should share at least one tag or category with the current post and should not include the current post itself.

**Validates: Requirements 4.7**

## Error Handling

### 1. Invalid Slug Handling

**Scenario:** User navigates to `/blog/non-existent-post`

**Handling:**
- Check if slug exists in blog data
- If not found, redirect to `/blog` with toast notification: "Blog post not found"
- Log error for analytics
- Maintain navigation history

### 2. Missing Blog Data

**Scenario:** Blog post data is malformed or missing required fields

**Handling:**
- Validate blog data on application load
- Filter out invalid posts with console warnings
- Display error boundary if all posts are invalid
- Show user-friendly message: "Unable to load blog posts"

### 3. Route Not Found

**Scenario:** User navigates to undefined route like `/blog/category/invalid`

**Handling:**
- Implement catch-all route (`/blog/*`)
- Redirect to `/blog` listing page
- Optionally show 404 page with navigation options

### 4. Navigation Errors

**Scenario:** React Router navigation fails

**Handling:**
- Wrap router in error boundary
- Catch navigation errors and log them
- Provide fallback UI with manual navigation links
- Prevent white screen of death

### 5. Content Rendering Errors

**Scenario:** Markdown or HTML content fails to render

**Handling:**
- Wrap BlogContent component in error boundary
- Display fallback message: "Content unavailable"
- Log error details for debugging
- Show raw content as fallback

### 6. Image Loading Failures

**Scenario:** Featured image fails to load

**Handling:**
- Use `onError` handler on img elements
- Display placeholder image or gradient background
- Maintain layout integrity (no layout shift)
- Log failed image URLs

## Testing Strategy

### Unit Tests

**Framework:** Vitest with React Testing Library

**Test Coverage:**

1. **Slug Generation Tests**
   - Test slug generation from various titles
   - Test special character handling
   - Test uniqueness validation
   - Test edge cases (empty strings, very long titles)

2. **Blog Data Utilities Tests**
   - Test `getBlogPostBySlug` with valid and invalid slugs
   - Test `getAllBlogPosts` returns all posts
   - Test `getBlogPostsByCategory` filters correctly
   - Test data validation functions

3. **Component Rendering Tests**
   - Test BlogCard renders all required information
   - Test BlogCard click handler calls navigate
   - Test BlogPostPage renders with valid slug
   - Test BlogPostPage handles invalid slug
   - Test BlogListingPage renders all posts
   - Test category filtering in BlogListingPage

4. **Navigation Tests**
   - Test Navigation component highlights active route
   - Test Navigation links use correct paths
   - Test ScrollToTop scrolls on route change

5. **Accessibility Tests**
   - Test keyboard navigation on BlogCard
   - Test ARIA labels on interactive elements
   - Test focus management on route changes
   - Test screen reader announcements

### Property-Based Tests

**Framework:** fast-check (JavaScript property-based testing library)

**Configuration:** Minimum 100 iterations per property test

**Property Tests:**

1. **Property 1: Unique Slug Generation**
   - Generate random blog post titles
   - Verify all generated slugs are unique
   - **Feature: blog-routing, Property 1: For any set of blog posts, all generated slugs must be unique**

2. **Property 2: Slug URL Safety**
   - Generate random strings with special characters
   - Verify slugs only contain valid characters
   - Verify no consecutive, leading, or trailing hyphens
   - **Feature: blog-routing, Property 2: For any blog post title, the generated slug must be URL-safe**

3. **Property 3: Theme Persistence**
   - Generate random route sequences
   - Verify theme remains consistent across navigation
   - **Feature: blog-routing, Property 3: For any theme setting, navigating between routes maintains the theme**

4. **Property 4: Blog Data Validation**
   - Generate random blog post objects
   - Verify validation catches missing required fields
   - **Feature: blog-routing, Property 4: For any blog post, all required fields must be present**

5. **Property 5: Related Posts Exclusion**
   - Generate random blog posts with tags
   - Verify related posts never include current post
   - **Feature: blog-routing, Property 5: For any blog post, related posts should not include itself**

### Integration Tests

1. **Full Navigation Flow**
   - Test home page → blog listing → blog post → back to listing
   - Verify scroll positions and state preservation
   - Test browser back/forward buttons

2. **Category Filtering Flow**
   - Test selecting different categories
   - Verify filtered results are correct
   - Test clearing filters

3. **Theme Switching Across Routes**
   - Navigate to different routes
   - Toggle theme on each route
   - Verify consistency

### End-to-End Tests (Optional)

**Framework:** Playwright or Cypress

1. Test complete user journey from home to blog post
2. Test responsive behavior on different viewports
3. Test keyboard-only navigation
4. Test screen reader compatibility

## Implementation Notes

### Dependencies to Install

```json
{
  "dependencies": {
    "react-router-dom": "^6.21.0",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "vitest": "^1.1.0",
    "fast-check": "^3.15.0"
  }
}
```

### File Structure

```
src/
├── components/
│   ├── Blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogContent.tsx
│   │   ├── BlogHeader.tsx
│   │   └── BlogFooter.tsx
│   ├── Layout/
│   │   └── Navigation.tsx (modified)
│   ├── sections/
│   │   └── Blog.tsx (modified)
│   └── ScrollToTop.tsx (new)
├── pages/
│   ├── HomePage.tsx (new - extracted from App.tsx)
│   ├── BlogListingPage.tsx (new)
│   └── BlogPostPage.tsx (new)
├── data/
│   └── blogPosts.ts (new)
├── types/
│   └── blog.ts (new)
├── utils/
│   └── blogUtils.ts (new)
└── App.tsx (modified for routing)
```

### Styling Approach

- Maintain existing CSS class naming conventions
- Reuse existing orbs and frosted overlay patterns
- Use existing color variables from theme
- Ensure responsive breakpoints match existing components
- Add new classes for blog-specific layouts in `index.css`

### Performance Considerations

1. **Code Splitting:**
   - Use React.lazy() for BlogPostPage and BlogListingPage
   - Implement Suspense with loading states

2. **Image Optimization:**
   - Use responsive images with srcset
   - Implement lazy loading for images below fold
   - Compress featured images

3. **Route Prefetching:**
   - Prefetch blog post data on card hover
   - Cache blog data in memory

4. **Bundle Size:**
   - Tree-shake unused React Router features
   - Use lightweight markdown renderer
   - Minimize dependencies

### SEO Considerations

1. **Meta Tags:**
   - Set document title for each blog post
   - Add Open Graph tags for social sharing
   - Include meta description from post description

2. **Structured Data:**
   - Add JSON-LD schema for BlogPosting
   - Include author, date, and article metadata

3. **Sitemap:**
   - Generate sitemap.xml including all blog posts
   - Update on new post additions

### Accessibility Requirements

1. **Semantic HTML:**
   - Use `<article>` for blog posts
   - Use proper heading hierarchy (h1 → h2 → h3)
   - Use `<nav>` for navigation elements

2. **ARIA Labels:**
   - Add aria-label to blog cards
   - Use aria-current for active navigation
   - Add role="button" to clickable cards

3. **Keyboard Navigation:**
   - Ensure all interactive elements are focusable
   - Provide visible focus indicators
   - Support Tab, Enter, and Space keys

4. **Screen Reader Support:**
   - Add skip links for main content
   - Announce route changes
   - Provide descriptive link text

## Migration Strategy

### Phase 1: Setup and Infrastructure
1. Install React Router and dependencies
2. Create type definitions
3. Set up blog data structure
4. Create utility functions

### Phase 2: Component Development
1. Create BlogCard component
2. Modify Blog section component
3. Create BlogListingPage
4. Create BlogPostPage and sub-components

### Phase 3: Routing Integration
1. Modify App.tsx for routing
2. Update Navigation component
3. Implement ScrollToTop
4. Test navigation flows

### Phase 4: Content and Polish
1. Add full blog post content
2. Implement markdown rendering
3. Add featured images
4. Style and responsive adjustments

### Phase 5: Testing and Optimization
1. Write unit tests
2. Write property-based tests
3. Implement code splitting
4. Performance optimization
5. Accessibility audit

## Future Enhancements

1. **Search Functionality:** Add search bar to filter posts by keywords
2. **Pagination:** Implement pagination for blog listing when posts exceed 12
3. **Comments System:** Add comment section to blog posts
4. **RSS Feed:** Generate RSS feed for blog subscribers
5. **Draft System:** Support draft posts not visible to public
6. **Admin Panel:** Create CMS for managing blog posts
7. **Analytics:** Track post views and engagement
8. **Newsletter Integration:** Add email subscription for new posts
