import React from 'react';
import SafeImage from '../SafeImage';

interface BlogHeaderProps {
  title: string;
  category: string;
  author: string;
  publishedDate: string;
  readTime: number;
  featuredImage?: string;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  title,
  category,
  author,
  publishedDate,
  readTime,
  featuredImage
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="blog-header">
      {/* Category Badge */}
      <div className="blog-category-badge">
        <span className="category-text">{category}</span>
      </div>

      {/* Blog Title */}
      <h1 className="blog-title">{title}</h1>

      {/* Meta Information */}
      <div className="blog-meta">
        <span className="blog-author">By {author}</span>
        <span className="blog-separator">•</span>
        <span className="blog-date">{formatDate(publishedDate)}</span>
        <span className="blog-separator">•</span>
        <span className="blog-read-time">{readTime} min read</span>
      </div>

      {/* Featured Image */}
      {featuredImage && (
        <div className="blog-featured-image">
          <SafeImage
            src={featuredImage}
            alt={title}
            className="featured-image"
            fallbackType="gradient"
            placeholderText="Featured Image"
            onError={(error) => {
              console.warn('Featured image failed to load:', {
                src: featuredImage,
                title,
                error: error.toString()
              });
            }}
          />
        </div>
      )}
    </header>
  );
};

export default BlogHeader;