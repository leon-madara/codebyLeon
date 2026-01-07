/**
 * Unit Tests for BlogCard Component
 * 
 * Tests the BlogCard component rendering, click navigation, keyboard navigation,
 * and accessibility features.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BlogCard } from './BlogCard';
import { BlogPost } from '../../types/blog';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockBlogPost: BlogPost = {
  id: 1,
  slug: 'test-blog-post',
  category: 'Website Tips',
  title: 'Test Blog Post Title',
  description: 'This is a test blog post description for testing purposes.',
  content: 'Full content of the test blog post...',
  author: 'Test Author',
  publishedDate: '2025-01-15',
  tags: ['test', 'blog'],
  readTime: 5
};

// Helper function to render BlogCard with Router
const renderBlogCard = (post: BlogPost = mockBlogPost) => {
  return render(
    <BrowserRouter>
      <BlogCard post={post} />
    </BrowserRouter>
  );
};

describe('BlogCard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    it('should render all required blog post information', () => {
      renderBlogCard();
      
      // Check category badge
      expect(screen.getByText('Website Tips')).toBeInTheDocument();
      
      // Check title
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
      
      // Check description
      expect(screen.getByText('This is a test blog post description for testing purposes.')).toBeInTheDocument();
      
      // Check formatted date
      expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
      
      // Check read time
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      
      // Check "Read More" link
      expect(screen.getByText('Read More →')).toBeInTheDocument();
    });

    it('should render with proper semantic HTML structure', () => {
      renderBlogCard();
      
      // Should use article element
      const article = screen.getByRole('button');
      expect(article.tagName).toBe('ARTICLE');
      
      // Should have proper ARIA label
      expect(article).toHaveAttribute('aria-label', 'Read blog post: Test Blog Post Title');
      
      // Should have role="button"
      expect(article).toHaveAttribute('role', 'button');
      
      // Should be focusable
      expect(article).toHaveAttribute('tabIndex', '0');
    });

    it('should have pointer cursor style', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      expect(article).toHaveStyle('cursor: pointer');
    });
  });

  describe('Click Navigation', () => {
    it('should navigate to correct blog post URL when clicked', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      fireEvent.click(article);
      
      expect(mockNavigate).toHaveBeenCalledWith('/blog/test-blog-post');
    });

    it('should navigate with different slug', () => {
      const differentPost = {
        ...mockBlogPost,
        slug: 'different-slug',
        title: 'Different Title'
      };
      
      renderBlogCard(differentPost);
      
      const article = screen.getByRole('button');
      fireEvent.click(article);
      
      expect(mockNavigate).toHaveBeenCalledWith('/blog/different-slug');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate when Enter key is pressed', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      article.focus();
      fireEvent.keyDown(article, { key: 'Enter' });
      
      expect(mockNavigate).toHaveBeenCalledWith('/blog/test-blog-post');
    });

    it('should navigate when Space key is pressed', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      article.focus();
      fireEvent.keyDown(article, { key: ' ' });
      
      expect(mockNavigate).toHaveBeenCalledWith('/blog/test-blog-post');
    });

    it('should not navigate on other key presses', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      article.focus();
      fireEvent.keyDown(article, { key: 'Tab' });
      fireEvent.keyDown(article, { key: 'Escape' });
      fireEvent.keyDown(article, { key: 'a' });
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle Space key properly', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      article.focus();
      fireEvent.keyDown(article, { key: ' ' });
      
      // The important thing is that navigation happens
      expect(mockNavigate).toHaveBeenCalledWith('/blog/test-blog-post');
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const postWithDifferentDate = {
        ...mockBlogPost,
        publishedDate: '2024-12-25'
      };
      
      renderBlogCard(postWithDifferentDate);
      
      expect(screen.getByText('December 25, 2024')).toBeInTheDocument();
    });

    it('should handle different date formats', () => {
      const postWithDifferentDate = {
        ...mockBlogPost,
        publishedDate: '2025-03-01'
      };
      
      renderBlogCard(postWithDifferentDate);
      
      expect(screen.getByText('March 1, 2025')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be focusable with keyboard', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      article.focus();
      
      expect(document.activeElement).toBe(article);
    });

    it('should have descriptive ARIA label', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      expect(article).toHaveAttribute('aria-label', 'Read blog post: Test Blog Post Title');
    });

    it('should update ARIA label with different title', () => {
      const differentPost = {
        ...mockBlogPost,
        title: 'Different Blog Post Title'
      };
      
      renderBlogCard(differentPost);
      
      const article = screen.getByRole('button');
      expect(article).toHaveAttribute('aria-label', 'Read blog post: Different Blog Post Title');
    });
  });

  describe('Variants', () => {
    it('should render with default variant', () => {
      renderBlogCard();
      
      // Component should render normally (we're testing the default behavior)
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with preview variant', () => {
      render(
        <BrowserRouter>
          <BlogCard post={mockBlogPost} variant="preview" />
        </BrowserRouter>
      );
      
      // Component should render normally (variant doesn't change rendering in current implementation)
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with full variant', () => {
      render(
        <BrowserRouter>
          <BlogCard post={mockBlogPost} variant="full" />
        </BrowserRouter>
      );
      
      // Component should render normally
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});