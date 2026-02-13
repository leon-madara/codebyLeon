import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types/blog';
import { BlogCard } from './BlogCard';

interface BlogFooterProps {
  currentPostId: number;
  relatedPosts: BlogPost[];
}

const BlogFooter: React.FC<BlogFooterProps> = ({ currentPostId, relatedPosts }) => {
  // Limit to 3 related posts and exclude current post
  const displayedRelatedPosts = relatedPosts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);

  const handleShare = (platform: string) => {
    const currentUrl = window.location.href;
    const title = document.title;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <footer className="blog-footer">
      {/* Back to Blog Navigation */}
      <div className="blog-footer-navigation">
        <Link to="/blog" className="back-to-blog-link">
          ← Back to Blog
        </Link>
      </div>

      {/* Social Sharing Buttons */}
      <div className="blog-footer-sharing">
        <h4 className="sharing-title">Share this article</h4>
        <div className="sharing-buttons">
          <button
            onClick={() => handleShare('twitter')}
            className="share-button share-twitter"
            aria-label="Share on Twitter"
          >
            <span className="share-icon">🐦</span>
            Twitter
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="share-button share-linkedin"
            aria-label="Share on LinkedIn"
          >
            <span className="share-icon">💼</span>
            LinkedIn
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="share-button share-facebook"
            aria-label="Share on Facebook"
          >
            <span className="share-icon">📘</span>
            Facebook
          </button>
        </div>
      </div>

      {/* Related Posts Section */}
      {displayedRelatedPosts.length > 0 && (
        <div className="blog-footer-related">
          <h4 className="related-posts-title">Related Articles</h4>
          <div className="related-posts-grid">
            {displayedRelatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="preview" />
            ))}
          </div>
        </div>
      )}

      {/* Call to Action Section */}
      <div className="blog-footer-cta">
        <div className="cta-content">
          <h4 className="cta-title">Ready to Transform Your Website?</h4>
          <p className="cta-description">
            Let's discuss how we can help your business grow with a professional website 
            that converts visitors into customers.
          </p>
          <div className="cta-buttons">
            <Link to="/#contact" className="button button--primary">
              Get Started
            </Link>
            <Link to="/#portfolio" className="button button--secondary">
              View Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="blog-footer-newsletter">
        <div className="newsletter-content">
          <h4 className="newsletter-title">Stay Updated</h4>
          <p className="newsletter-description">
            Get the latest web development tips and business insights delivered to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={(e) => {
            e.preventDefault();
            // Newsletter signup logic would go here
            alert('Newsletter signup functionality would be implemented here');
          }}>
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                required
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;