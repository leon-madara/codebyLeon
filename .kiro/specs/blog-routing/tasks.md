# Implementation Plan: Blog Routing System

## Overview

This implementation plan breaks down the blog routing feature into discrete, manageable tasks. Each task builds incrementally on previous work, ensuring the system remains functional at each step. The plan follows a phased approach: infrastructure setup, core components, routing integration, content implementation, and testing.

## Tasks

- [x] 1. Install dependencies and create type definitions
  - Install react-router-dom, react-markdown, remark-gfm, rehype-highlight
  - Install dev dependencies: @testing-library/react, @testing-library/user-event, vitest, fast-check
  - Create `src/types/blog.ts` with BlogPost and BlogMetadata interfaces
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Create blog data store and utility functions
  - [x] 2.1 Create `src/data/blogPosts.ts` with initial blog post data
    - Define blogPosts array with 3 existing posts
    - Add full content (markdown format) for each post
    - Include all required fields: id, slug, category, title, description, content, author, publishedDate, tags, readTime
    - Add optional featuredImage URLs
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 8.1, 8.2_

  - [x] 2.2 Create `src/utils/blogUtils.ts` with utility functions
    - Implement `generateSlug(title: string): string` function
    - Implement `getBlogPostBySlug(slug: string): BlogPost | undefined`
    - Implement `getAllBlogPosts(): BlogPost[]`
    - Implement `getBlogPostsByCategory(category: string): BlogPost[]`
    - Implement `validateBlogPost(post: any): boolean` for data validation
    - Implement `getRelatedPosts(currentPost: BlogPost, limit: number): BlogPost[]`
    - _Requirements: 7.1, 7.2, 7.5, 8.4_

  - [x] 2.3 Write unit tests for slug generation

    - Test slug generation from various titles
    - Test special character handling and sanitization
    - Test edge cases (empty strings, very long titles, special characters)
    - _Requirements: 7.1, 7.5_

  - [x] 2.4 Write property test for unique slug generation

    - **Property 1: Unique Slug Generation**
    - **Validates: Requirements 1.2, 7.2**
    - Generate random blog post titles
    - Verify all generated slugs are unique across the collection
    - _Requirements: 1.2, 7.2_

  - [x] 2.5 Write property test for slug URL safety

    - **Property 2: Slug URL Safety**
    - **Validates: Requirements 7.1, 7.5**
    - Generate random strings with special characters
    - Verify slugs only contain lowercase letters, numbers, and hyphens
    - Verify no consecutive, leading, or trailing hyphens
    - _Requirements: 7.1, 7.5_

  - [x] 2.6 Write unit tests for blog data utilities

    - Test `getBlogPostBySlug` with valid and invalid slugs
    - Test `getAllBlogPosts` returns all posts
    - Test `getBlogPostsByCategory` filters correctly
    - Test `validateBlogPost` catches missing required fields
    - Test `getRelatedPosts` returns relevant posts excluding current post
    - _Requirements: 8.4_

  - [x] 2.7 Write property test for blog data validation

    - **Property 9: Blog Data Validation**
    - **Validates: Requirements 8.4**
    - Generate random blog post objects with missing fields
    - Verify validation catches all missing required fields
    - _Requirements: 8.4_

- [x] 3. Create BlogCard component
  - [x] 3.1 Create `src/components/Blog/BlogCard.tsx`
    - Accept BlogPost as prop
    - Render category badge, title, description
    - Display read time and publication date
    - Make entire card clickable using React Router's useNavigate
    - Add hover and focus states with CSS transitions
    - Implement keyboard navigation (Enter and Space keys)
    - Add proper ARIA labels for accessibility
    - Maintain existing visual design (card styling)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 3.2 Write unit tests for BlogCard component
    - Test component renders all required information
    - Test click handler navigates to correct URL
    - Test keyboard navigation (Enter and Space keys)
    - Test ARIA labels are present
    - Test hover and focus states
    - _Requirements: 3.2, 3.4, 3.5, 3.6_

  - [ ]* 3.3 Write property test for card click navigation
    - **Property 4: Card Click Navigation**
    - **Validates: Requirements 3.2, 3.6**
    - Generate random blog posts
    - Verify clicking card navigates to `/blog/:slug`
    - Verify keyboard activation (Enter/Space) navigates correctly
    - _Requirements: 3.2, 3.6_

- [x] 4. Modify Blog section component for home page
  - [x] 4.1 Update `src/components/sections/Blog.tsx`
    - Import blog data from `src/data/blogPosts.ts`
    - Replace hardcoded posts with data from store
    - Use BlogCard component instead of inline card markup
    - Limit to 3 posts for home page preview
    - Update "Read More Articles" link to navigate to `/blog` (prepare for routing)
    - Maintain existing orbs and frosted overlay design
    - _Requirements: 5.2, 5.3_

  - [ ]* 4.2 Write unit tests for Blog section component
    - Test component renders correct number of posts (3)
    - Test "View All" link points to `/blog`
    - Test BlogCard components are rendered
    - _Requirements: 5.2_

- [x] 5. Create blog page components
  - [x] 5.1 Create `src/components/Blog/BlogHeader.tsx`
    - Accept title, category, author, publishedDate, readTime, featuredImage as props
    - Display blog post title as h1
    - Show category badge with styling
    - Display author and publication date
    - Show estimated read time
    - Render featured image if provided with proper aspect ratio
    - Implement responsive layout
    - _Requirements: 4.1, 4.3_

  - [x] 5.2 Create `src/components/Blog/BlogContent.tsx`
    - Accept content and format ('markdown' | 'html') as props
    - Integrate react-markdown for markdown rendering
    - Configure remark-gfm for GitHub Flavored Markdown
    - Configure rehype-highlight for code syntax highlighting
    - Apply consistent typography styles
    - Render images responsively
    - Handle rendering errors with error boundary
    - _Requirements: 4.2, 8.3_

  - [x] 5.3 Create `src/components/Blog/BlogFooter.tsx`
    - Accept currentPostId and relatedPosts as props
    - Display "Back to Blog" link using React Router Link
    - Show 3 related post cards using BlogCard component
    - Add social sharing buttons (optional)
    - Include CTA for contact or newsletter
    - _Requirements: 4.4, 4.7_

  - [ ]* 5.4 Write unit tests for blog sub-components
    - Test BlogHeader renders all metadata correctly
    - Test BlogHeader conditionally renders featured image
    - Test BlogContent renders markdown correctly
    - Test BlogContent handles rendering errors
    - Test BlogFooter displays related posts
    - Test BlogFooter "Back to Blog" link
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.7_

  - [ ]* 5.5 Write property test for related posts relevance
    - **Property 10: Related Posts Relevance**
    - **Validates: Requirements 4.7**
    - Generate random blog posts with tags and categories
    - Verify related posts share at least one tag or category
    - Verify related posts never include the current post
    - _Requirements: 4.7_

- [x] 6. Create BlogPostPage
  - [x] 6.1 Create `src/pages/BlogPostPage.tsx`
    - Use useParams to get slug from URL
    - Fetch blog post using getBlogPostBySlug utility
    - Implement loading state while fetching
    - Handle invalid slug (404) - redirect to /blog with toast notification
    - Set document title using post title
    - Add meta tags for SEO (Open Graph tags)
    - Render BlogHeader, BlogContent, and BlogFooter components
    - Get related posts using getRelatedPosts utility
    - Maintain theme consistency
    - Implement responsive layout
    - _Requirements: 2.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 7.3, 7.4_

  - [ ]* 6.2 Write unit tests for BlogPostPage
    - Test page renders with valid slug
    - Test page handles invalid slug (redirects or shows 404)
    - Test loading state is displayed
    - Test document title is set correctly
    - Test all sub-components are rendered
    - _Requirements: 2.5, 4.1, 4.2, 4.3, 4.4, 7.3_

  - [ ]* 6.3 Write property test for 404 handling
    - **Property 7: 404 Handling for Invalid Slugs**
    - **Validates: Requirements 2.5**
    - Generate random non-existent slugs
    - Verify navigation to `/blog/:slug` doesn't crash
    - Verify redirect to `/blog` or 404 page is shown
    - _Requirements: 2.5_

- [x] 7. Create BlogListingPage
  - [x] 7.1 Create `src/pages/BlogListingPage.tsx`
    - Fetch all blog posts using getAllBlogPosts utility
    - Display page header with title "Blog" and description
    - Render all blog posts in grid layout using BlogCard components
    - Implement category filtering with filter buttons
    - Implement sorting by date or title
    - Maintain consistent design with home page blog section (orbs, frosted overlay)
    - Implement responsive grid (1 column mobile, 2 tablet, 3 desktop)
    - Handle empty state when no posts match filters
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 7.2 Write unit tests for BlogListingPage
    - Test page renders all blog posts
    - Test category filtering works correctly
    - Test sorting by date and title
    - Test empty state when no posts
    - Test responsive grid layout
    - _Requirements: 5.2, 5.4, 5.5_

- [x] 8. Checkpoint - Ensure all components work in isolation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Set up routing infrastructure
  - [x] 9.1 Create `src/components/ScrollToTop.tsx`
    - Use useEffect and useLocation from react-router-dom
    - Scroll window to top on route change
    - Preserve scroll position for browser back/forward
    - _Requirements: 2.6_

  - [x] 9.2 Create `src/pages/HomePage.tsx`
    - Extract existing home page content from App.tsx
    - Include Hero, Portfolio, About, MultiCardScrollSection, Blog, FinalCTA
    - This becomes the component for the "/" route
    - _Requirements: 2.1_

  - [ ]* 9.3 Write unit tests for ScrollToTop
    - Test component scrolls to top on route change
    - Test scroll position is preserved for back/forward navigation
    - _Requirements: 2.6_

- [x] 10. Integrate React Router into App.tsx
  - [x] 10.1 Modify `src/App.tsx` for routing
    - Import BrowserRouter, Routes, Route from react-router-dom
    - Wrap app in BrowserRouter
    - Keep ThemeProvider, MouseTrail, Navigation outside Routes
    - Add ScrollToTop component inside BrowserRouter
    - Define route for "/" using HomePage component
    - Define route for "/blog" using BlogListingPage (with lazy loading)
    - Define route for "/blog/:slug" using BlogPostPage (with lazy loading)
    - Add catch-all route for "/blog/*" that redirects to "/blog"
    - Implement Suspense with loading fallback for lazy-loaded routes
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 9.1, 9.2_

  - [ ]* 10.2 Write integration tests for routing
    - Test navigation from home to blog listing
    - Test navigation from blog listing to blog post
    - Test "Back to Blog" navigation
    - Test browser back/forward buttons
    - Test invalid route redirects to blog listing
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 10.3 Write property test for route navigation consistency
    - **Property 3: Route Navigation Consistency**
    - **Validates: Requirements 2.6, 4.4**
    - Generate random valid blog post slugs
    - Navigate to `/blog/:slug` then click "Back to Blog"
    - Verify user returns to `/blog`
    - _Requirements: 2.6, 4.4_

- [-] 11. Update Navigation component for routing
  - [x] 11.1 Modify `src/components/Layout/Navigation.tsx`
    - Import Link and useLocation from react-router-dom
    - Replace anchor tags with Link components for internal navigation
    - Update Blog link from "#blog" to "/blog"
    - Update other links to use Link component where appropriate
    - Use useLocation to highlight active route
    - Add active class to current route link
    - Maintain existing theme toggle functionality
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 11.2 Write unit tests for Navigation component
    - Test Blog link navigates to "/blog"
    - Test active route is highlighted
    - Test navigation is present on all pages
    - Test theme toggle still works
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 11.3 Write property test for navigation accessibility
    - **Property 8: Keyboard Navigation Accessibility**
    - **Validates: Requirements 3.5, 3.6**
    - Test Tab key focuses navigation links
    - Test Enter key activates navigation
    - Verify focus indicators are visible
    - _Requirements: 3.5, 3.6, 6.4_

- [-] 12. Add full blog post content
  - [x] 12.1 Expand blog post content in `src/data/blogPosts.ts`
    - Write full markdown content for "3 Mistakes Your Business Website is Making"
    - Write full markdown content for "Before/After: Website Transformation Case Studies"
    - Write full markdown content for "How a Professional Website Increases Inquiries"
    - Add featured images for each post (create or use placeholders)
    - Ensure content includes headings, paragraphs, lists, and code examples
    - _Requirements: 1.4, 4.2, 8.2_

- [x] 13. Add blog-specific styles
  - [x] 13.1 Add CSS classes to `src/index.css`
    - Add styles for blog post page layout
    - Add styles for blog content typography (headings, paragraphs, lists)
    - Add styles for code blocks with syntax highlighting
    - Add styles for featured images
    - Add styles for category badges
    - Add styles for related posts section
    - Ensure responsive breakpoints match existing components
    - Maintain theme consistency (light/dark mode variables)
    - _Requirements: 4.5, 4.8, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 13.2 Write property test for responsive layout integrity
    - **Property 6: Responsive Layout Integrity**
    - **Validates: Requirements 10.1, 10.2, 10.5**
    - Test at various viewport widths (320px, 768px, 1024px, 1920px)
    - Verify no horizontal scrolling
    - Verify minimum text size of 16px for body text
    - _Requirements: 10.1, 10.2, 10.5_

- [x] 14. Implement theme persistence testing
  - [x]* 14.1 Write property test for theme persistence across routes
    - **Property 5: Theme Persistence Across Routes**
    - **Validates: Requirements 4.5**
    - Generate random route sequences
    - Set theme to light or dark
    - Navigate between routes
    - Verify theme remains consistent without flickering
    - _Requirements: 4.5_

- [x] 15. Add error handling and loading states
  - [x] 15.1 Implement error boundaries
    - Create error boundary component for BlogContent
    - Create error boundary component for BlogPostPage
    - Add fallback UI for rendering errors
    - Log errors for debugging
    - _Requirements: 8.5_

  - [x] 15.2 Add loading states
    - Add loading spinner for BlogPostPage while fetching
    - Add loading fallback for lazy-loaded routes (Suspense)
    - Add skeleton loaders for blog cards (optional)
    - _Requirements: 9.5_

  - [x] 15.3 Implement image error handling
    - Add onError handler to featured images
    - Display placeholder image or gradient on error
    - Maintain layout integrity (prevent layout shift)
    - _Requirements: 4.3_

  - [ ]* 15.4 Write unit tests for error handling
    - Test error boundary catches rendering errors
    - Test invalid slug shows error message or redirects
    - Test malformed blog data is handled gracefully
    - Test image loading failures show placeholder
    - _Requirements: 2.5, 8.5_

- [x] 16. Implement SEO and meta tags
  - [x] 16.1 Add meta tags to BlogPostPage
    - Set document title to post title
    - Add Open Graph meta tags (og:title, og:description, og:image)
    - Add Twitter Card meta tags
    - Add meta description from post description
    - Add canonical URL
    - _Requirements: 7.3, 7.4_

  - [x] 16.2 Add JSON-LD structured data
    - Add BlogPosting schema to BlogPostPage
    - Include author, datePublished, headline, image
    - _Requirements: 7.4_

  - [ ]* 16.3 Write unit tests for SEO implementation
    - Test document title is set correctly
    - Test Open Graph tags are present
    - Test JSON-LD schema is valid
    - _Requirements: 7.3, 7.4_

- [x] 17. Final checkpoint - End-to-end testing
  - [ ]* 17.1 Write integration tests for complete user flows
    - Test home page → blog listing → blog post → back to listing
    - Test category filtering on blog listing page
    - Test theme switching across all routes
    - Test keyboard-only navigation through entire flow
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 5.4, 6.3_

  - [ ]* 17.2 Perform accessibility audit
    - Test with screen reader (NVDA or JAWS)
    - Verify all interactive elements are keyboard accessible
    - Verify focus indicators are visible
    - Verify ARIA labels are descriptive
    - Test color contrast ratios
    - _Requirements: 3.4, 3.5, 3.6, 6.4_

  - [x] 17.3 Performance optimization
    - Verify code splitting is working (check network tab)
    - Verify lazy loading of routes
    - Optimize images (compress, use appropriate formats)
    - Test bundle size and load times
    - _Requirements: 9.1, 9.2, 9.4_

  - [x] 17.4 Final manual testing
    - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
    - Test on multiple devices (mobile, tablet, desktop)
    - Test all navigation flows
    - Test theme switching
    - Test responsive design at various breakpoints
    - Verify all links work correctly
    - _Requirements: 2.7, 4.8, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- The implementation follows a phased approach: setup → components → routing → content → testing
- Code splitting and lazy loading are implemented for performance
- Accessibility is a priority throughout implementation
- Theme consistency is maintained across all routes
