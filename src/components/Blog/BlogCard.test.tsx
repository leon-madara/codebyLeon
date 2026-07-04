/**
 * Unit Tests for BlogCard Component
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
      
      // Check author info
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument();
      
      // Check read time
      expect(screen.getByText('5 min read')).toBeInTheDocument();
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

    it('should render with expected card classes', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      expect(article).toHaveClass('card');
      expect(article).toHaveClass('card--blog');
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
  });

  describe('Accessibility', () => {
    it('should be focusable with keyboard', () => {
      renderBlogCard();
      
      const article = screen.getByRole('button');
      article.focus();
      
      expect(document.activeElement).toBe(article);
    });
  });
});
