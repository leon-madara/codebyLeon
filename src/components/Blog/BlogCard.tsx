import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '../../types/blog';
import SafeImage from '../SafeImage';
import { Clock } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'preview' | 'full';
}

const getCategoryClass = (name: string) => {
  const lowerName = name.toLowerCase();
  if (
    lowerName.includes('web development') ||
    lowerName.includes('technology') ||
    lowerName.includes('tech') ||
    lowerName.includes('code')
  ) {
    return 'card__category-pill--indigo';
  }
  if (lowerName.includes('design') || lowerName.includes('tips')) {
    return 'card__category-pill--orange';
  }
  if (lowerName.includes('growth') || lowerName.includes('strategy') || lowerName.includes('business')) {
    return 'card__category-pill--blue';
  }
  if (
    lowerName.includes('accessibility') ||
    lowerName.includes('ux') ||
    lowerName.includes('experience')
  ) {
    return 'card__category-pill--pink';
  }
  return '';
};

const formatTag = (tag: string) => {
  return tag
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function BlogCard({ post, variant = 'full' }: BlogCardProps) {
  const navigate = useNavigate();
  const combinedTitle = post.titleItalic ? `${post.title} ${post.titleItalic}` : post.title;

  const handleCardClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className="card card--blog"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Read blog post: ${combinedTitle}`}
    >
      {/* Featured Image (if available) */}
      {post.featuredImage && (
        <div className="card__media">
          <SafeImage
            src={post.featuredImage}
            alt={combinedTitle}
            className="card__image"
            fallbackType="gradient"
            placeholderText={post.category}
            onError={(error) => {
              console.warn('Blog card image failed to load:', {
                src: post.featuredImage,
                title: combinedTitle,
                error: error.toString()
              });
            }}
          />
        </div>
      )}
      
      <div className="card__content">
        <div className="card__categories">
          <span className={`card__category-pill ${getCategoryClass(post.category)}`}>
            {post.category}
          </span>
          {post.tags && post.tags.length > 0 && (
            <span className={`card__category-pill ${getCategoryClass(post.tags[0])}`}>
              {formatTag(post.tags[0])}
            </span>
          )}
        </div>
        
        <h3 className="card__title">{combinedTitle}</h3>
        <p className="card__description">{post.description}</p>
        
        <div className="card__meta">
          <div className="card__author-info">
            <div className="card__author-avatar">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <span className="card__author-name">{post.author}</span>
          </div>
          
          <div className="card__read-time-row">
            <Clock size={14} className="card__clock-icon" />
            <span className="card__read-time">{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}
