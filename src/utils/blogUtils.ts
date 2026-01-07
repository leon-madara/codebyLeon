/**
 * Blog Utility Functions
 * 
 * This file contains utility functions for managing and querying blog post data.
 * These functions handle slug generation, data retrieval, validation, and related post logic.
 */

import { BlogPost } from '../types/blog';
import blogPosts from '../data/blogPosts';

/**
 * Generates a URL-friendly slug from a blog post title
 * 
 * Rules:
 * - Converts to lowercase
 * - Replaces underscores and spaces with hyphens
 * - Removes special characters (only keeps letters, numbers, and hyphens)
 * - Removes consecutive hyphens
 * - Removes leading/trailing hyphens
 * 
 * @param title - The blog post title
 * @returns A URL-safe slug in kebab-case format (only lowercase letters, numbers, and hyphens)
 * 
 * @example
 * generateSlug("3 Mistakes Your Business Website is Making")
 * // Returns: "3-mistakes-your-business-website-is-making"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')      // Replace spaces and underscores with hyphens FIRST
    .replace(/[^a-z0-9-]/g, '')   // Then remove special characters, keep only letters, numbers, and hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

/**
 * Retrieves a blog post by its slug
 * 
 * @param slug - The URL slug of the blog post
 * @returns The blog post if found, undefined otherwise
 * 
 * @example
 * const post = getBlogPostBySlug("3-mistakes-your-business-website-is-making");
 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

/**
 * Retrieves all blog posts
 * 
 * @returns Array of all blog posts, ordered by publication date (newest first)
 * 
 * @example
 * const allPosts = getAllBlogPosts();
 */
export function getAllBlogPosts(): BlogPost[] {
  // Return a copy to prevent external modifications
  return [...blogPosts].sort((a, b) => {
    // Sort by publication date, newest first
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });
}

/**
 * Retrieves blog posts filtered by category
 * 
 * @param category - The category to filter by (case-insensitive)
 * @returns Array of blog posts in the specified category
 * 
 * @example
 * const tipsPosts = getBlogPostsByCategory("Website Tips");
 */
export function getBlogPostsByCategory(category: string): BlogPost[] {
  const normalizedCategory = category.toLowerCase();
  return blogPosts
    .filter(post => post.category.toLowerCase() === normalizedCategory)
    .sort((a, b) => {
      // Sort by publication date, newest first
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });
}

/**
 * Validates that a blog post object contains all required fields
 * 
 * Required fields:
 * - id (number)
 * - slug (non-empty string)
 * - category (non-empty string)
 * - title (non-empty string)
 * - description (non-empty string)
 * - content (non-empty string)
 * - author (non-empty string)
 * - publishedDate (non-empty string)
 * - tags (non-empty array)
 * - readTime (positive number)
 * 
 * @param post - The blog post object to validate
 * @returns true if valid, false otherwise
 * 
 * @example
 * const isValid = validateBlogPost(myPost);
 */
export function validateBlogPost(post: any): boolean {
  // Check if post exists
  if (!post || typeof post !== 'object') {
    return false;
  }

  // Validate required fields
  const hasValidId = typeof post.id === 'number' && post.id > 0;
  const hasValidSlug = typeof post.slug === 'string' && post.slug.trim().length > 0;
  const hasValidCategory = typeof post.category === 'string' && post.category.trim().length > 0;
  const hasValidTitle = typeof post.title === 'string' && post.title.trim().length > 0;
  const hasValidDescription = typeof post.description === 'string' && post.description.trim().length > 0;
  const hasValidContent = typeof post.content === 'string' && post.content.trim().length > 0;
  const hasValidAuthor = typeof post.author === 'string' && post.author.trim().length > 0;
  const hasValidPublishedDate = typeof post.publishedDate === 'string' && post.publishedDate.trim().length > 0;
  const hasValidTags = Array.isArray(post.tags) && post.tags.length > 0;
  const hasValidReadTime = typeof post.readTime === 'number' && post.readTime > 0;

  return (
    hasValidId &&
    hasValidSlug &&
    hasValidCategory &&
    hasValidTitle &&
    hasValidDescription &&
    hasValidContent &&
    hasValidAuthor &&
    hasValidPublishedDate &&
    hasValidTags &&
    hasValidReadTime
  );
}

/**
 * Retrieves related blog posts based on shared tags and category
 * 
 * Algorithm:
 * 1. Excludes the current post
 * 2. Prioritizes posts with matching tags
 * 3. Falls back to posts in the same category
 * 4. Limits results to the specified number
 * 
 * @param currentPost - The current blog post
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related blog posts
 * 
 * @example
 * const related = getRelatedPosts(currentPost, 3);
 */
export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  // Filter out the current post
  const otherPosts = blogPosts.filter(post => post.id !== currentPost.id);

  // Score each post based on relevance
  const scoredPosts = otherPosts.map(post => {
    let score = 0;

    // Add points for matching category
    if (post.category === currentPost.category) {
      score += 10;
    }

    // Add points for each matching tag
    const matchingTags = post.tags.filter(tag => 
      currentPost.tags.includes(tag)
    );
    score += matchingTags.length * 5;

    return { post, score };
  });

  // Sort by score (highest first) and return limited results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Gets all unique categories from blog posts
 * 
 * @returns Array of unique category names
 * 
 * @example
 * const categories = getAllCategories();
 * // Returns: ["Website Tips", "Case Studies", "Business Growth"]
 */
export function getAllCategories(): string[] {
  const categories = new Set(blogPosts.map(post => post.category));
  return Array.from(categories).sort();
}

/**
 * Gets all unique tags from blog posts
 * 
 * @returns Array of unique tag names
 * 
 * @example
 * const tags = getAllTags();
 */
export function getAllTags(): string[] {
  const tags = new Set(blogPosts.flatMap(post => post.tags));
  return Array.from(tags).sort();
}

/**
 * Searches blog posts by keyword in title, description, or tags
 * 
 * @param keyword - The search keyword (case-insensitive)
 * @returns Array of matching blog posts
 * 
 * @example
 * const results = searchBlogPosts("website");
 */
export function searchBlogPosts(keyword: string): BlogPost[] {
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  if (!normalizedKeyword) {
    return [];
  }

  return blogPosts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(normalizedKeyword);
    const descriptionMatch = post.description.toLowerCase().includes(normalizedKeyword);
    const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(normalizedKeyword));
    const categoryMatch = post.category.toLowerCase().includes(normalizedKeyword);

    return titleMatch || descriptionMatch || tagMatch || categoryMatch;
  });
}
