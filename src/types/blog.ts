/**
 * Blog Post Type Definitions
 * 
 * These types define the structure for blog posts and related metadata
 * used throughout the blog routing system.
 */

/**
 * Represents a complete blog post with all metadata and content
 */
export interface BlogPost {
  /** Unique identifier for the blog post */
  id: number;
  
  /** URL-friendly slug (kebab-case) used for routing */
  slug: string;
  
  /** Category of the blog post (e.g., "Website Tips", "Case Studies") */
  category: string;
  
  /** Title of the blog post */
  title: string;
  
  /** Short preview text/description for the blog post */
  description: string;
  
  /** Full content of the blog post (markdown or HTML format) */
  content: string;
  
  /** Author name */
  author: string;
  
  /** Publication date in ISO 8601 format (YYYY-MM-DD) */
  publishedDate: string;
  
  /** Optional featured image URL */
  featuredImage?: string;
  
  /** Array of tags for categorization and filtering */
  tags: string[];
  
  /** Estimated read time in minutes */
  readTime: number;
}

/**
 * Metadata about the blog collection
 */
export interface BlogMetadata {
  /** Total number of blog posts */
  totalPosts: number;
  
  /** Array of all unique categories */
  categories: string[];
  
  /** Array of all unique tags */
  tags: string[];
}
