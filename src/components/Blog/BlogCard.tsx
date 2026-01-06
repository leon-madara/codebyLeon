import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '../../types/blog';
import SafeImage from '../SafeImage';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'preview' | 'full';
}

export function BlogCard({ post, variant = 'full' }: BlogCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article
      className="blog-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Read blog post: ${post.title}`}
      style={{ cursor: 'pointer' }}
    >
      {/* Featured Image (if available) */}
      {post.featuredImage && (
        <div className="blog-card-image">
          <SafeImage
            src={post.featuredImage}
            alt={post.title}
            className="card-featured-image"
            fallbackType="gradient"
            placeholderText={post.category}
            onError={(error) => {
              console.warn('Blog card image failed to load:', {
                src: post.featuredImage,
                title: post.title,
                error: error.toString()
              });
            }}
          />
        </div>
      )}
      
      <div className="blog-card-content">
        <span className="blog-category">{post.category}</span>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        
        <div className="blog-meta">
          <span className="blog-date">{formatDate(post.publishedDate)}</span>
          <span className="blog-read-time">{post.readTime} min read</span>
        </div>
        
        <div className="card-link">Read More →</div>
      </div>
    </article>
  );
}