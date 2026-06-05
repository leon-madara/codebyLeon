import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { BlogPost } from '../types/blog';
import { getAllBlogPosts } from '../utils/blogUtils';
import BlogContent from '../components/Blog/BlogContent';
import BlogPostErrorBoundary from '../components/Blog/BlogPostErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../hooks/use-toast';
import {
  SITE_NAME,
  SITE_URL,
  getAbsoluteUrl,
  usePageSeo,
} from '../utils/seo';
import '../styles/sections/blog-post.css';

// Structured data for SEO
const createBlogPostStructuredData = (blogPost: BlogPost): Record<string, unknown> => {
  const canonicalUrl = getAbsoluteUrl(`/blog/${blogPost.slug}`);
  const combinedTitle = blogPost.titleItalic ? `${blogPost.title} ${blogPost.titleItalic}` : blogPost.title;
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: combinedTitle,
    description: blogPost.description,
    author: {
      '@type': 'Person',
      name: blogPost.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/main-logo.svg`,
      },
    },
    datePublished: blogPost.publishedDate,
    dateModified: blogPost.publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    url: canonicalUrl,
    articleSection: blogPost.category,
    keywords: blogPost.tags,
    wordCount: Math.ceil(blogPost.content.trim().split(/\s+/).length),
    timeRequired: `PT${blogPost.readTime}M`,
    inLanguage: 'en-KE',
  };

  if (blogPost.featuredImage) {
    structuredData.image = {
      '@type': 'ImageObject',
      url: getAbsoluteUrl(blogPost.featuredImage),
      caption: combinedTitle,
    };
  }

  return structuredData;
};

// Background Orb Colors corresponding to each article (v1, v2, v3)
const ORB_PALETTES = [
  // Article 1 (Business Strategy): Blues, Purples, Cyan
  ['#2563eb', '#8b5cf6', '#06b6d4'],
  // Article 2 (Tech & Reliability): Greens, Deep Teals
  ['#10b981', '#0d9488', '#115e59'],
  // Article 3 (User Experience): Pinks, Oranges, Purples
  ['#ec4899', '#f97316', '#a855f7']
];

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const allPosts = getAllBlogPosts();
  
  // Identify the active article index based on the slug in the URL
  const slugIndex = allPosts.findIndex(p => p.slug === slug);
  const activeIndex = slugIndex !== -1 ? slugIndex : 0;
  const post = allPosts[activeIndex];
  const postTitle = post ? (post.titleItalic ? `${post.title} ${post.titleItalic}` : post.title) : '';

  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  // References for GSAP background orb animations
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  // Redirect to the first post if the slug is invalid or missing
  useEffect(() => {
    if (!slug || slugIndex === -1) {
      if (slug) {
        toast({
          title: "Blog post not found",
          description: "The requested blog post could not be found. Showing latest articles.",
          variant: "destructive",
        });
      }
      if (allPosts.length > 0) {
        navigate(`/blog/${allPosts[0].slug}`, { replace: true });
      } else {
        navigate('/blog', { replace: true });
      }
    }
  }, [slug, slugIndex, navigate, toast, allPosts]);

  // Hide design switcher when scrolling down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;
          if (currentScrollY <= 8 || delta < -4) {
            setIsScrollHidden(false);
          } else if (delta > 4) {
            setIsScrollHidden(true);
          }
          lastScrollY = currentScrollY;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  // Ensure the active post is always in the visible viewport (which shows 3 pills)
  useEffect(() => {
    if (activeIndex < visibleStartIndex) {
      if (activeIndex === 2) {
        setVisibleStartIndex(2);
      } else if (activeIndex === 4) {
        setVisibleStartIndex(4);
      } else {
        setVisibleStartIndex(Math.max(0, activeIndex - 1));
      }
    } else if (activeIndex > visibleStartIndex + 2) {
      if (activeIndex === 3) {
        setVisibleStartIndex(2);
      } else {
        setVisibleStartIndex(Math.min(allPosts.length - 2, activeIndex));
      }
    }
  }, [activeIndex, visibleStartIndex, allPosts.length]);

  // GSAP Background orb color-morphing animation
  useGSAP(() => {
    if (allPosts.length === 0) return;
    
    const palette = ORB_PALETTES[activeIndex % ORB_PALETTES.length];
    
    gsap.to(orb1Ref.current, {
      backgroundColor: palette[0],
      duration: 0.75,
      ease: 'power2.out'
    });
    
    gsap.to(orb2Ref.current, {
      backgroundColor: palette[1],
      duration: 0.75,
      ease: 'power2.out'
    });
    
    gsap.to(orb3Ref.current, {
      backgroundColor: palette[2],
      duration: 0.75,
      ease: 'power2.out'
    });
  }, [activeIndex, allPosts.length]);

  // Set Page SEO
  usePageSeo(post ? {
    title: `${postTitle} | ${SITE_NAME} Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
    image: post.featuredImage,
    imageAlt: postTitle,
    author: post.author,
    publishedTime: post.publishedDate,
    modifiedTime: post.publishedDate,
    section: post.category,
    tags: post.tags,
    structuredData: createBlogPostStructuredData(post),
  } : {
    title: slugIndex === -1 ? `Blog Post Not Found | ${SITE_NAME}` : `Loading Blog Post | ${SITE_NAME}`,
    description: 'Read practical website, SEO, and conversion articles from Code by Leon.',
    path: slug ? `/blog/${slug}` : '/blog',
  });

  if (allPosts.length === 0 || !post) {
    return (
      <div className="blog-post-page-wrapper">
        <div className="blog-post-loading">
          <LoadingSpinner 
            size="large" 
            message="Loading blog post..." 
            className="blog-post-spinner"
          />
        </div>
      </div>
    );
  }

  const currentUrl = SITE_URL + `/blog/${post.slug}`;

  return (
    <BlogPostErrorBoundary>
      <div className="blog-post-page-wrapper">
        {/* Background Orbs */}
        <div className="blog__orbs">
          <div ref={orb1Ref} className="blog__orb blog__orb--1" />
          <div ref={orb2Ref} className="blog__orb blog__orb--2" />
          <div ref={orb3Ref} className="blog__orb blog__orb--3" />
        </div>
        <div className="blog__overlay" />

        {/* Global Design Switcher (Floating pills) */}
        <div 
          className={`v2-pills global-v2-switcher ${isScrollHidden ? 'is-scroll-hidden' : ''}`} 
          role="tablist" 
          aria-label="Design directions"
          style={{ 
            '--indicator-pos': activeIndex - visibleStartIndex 
          } as React.CSSProperties}
        >
          <div className="v2-pill-indicator" />
          {allPosts.slice(visibleStartIndex, visibleStartIndex + 3).map((p, index) => {
            const globalIndex = visibleStartIndex + index;
            const isActive = activeIndex === globalIndex;
            
            // Render left arrow if we are at the first visible pill (index === 0) AND there are posts to the left
            const showLeftArrow = index === 0 && visibleStartIndex > 0;
            
            // Render right arrow if we are at the last visible pill (index === 2) AND there are posts to the right
            const showRightArrow = index === 2 && (visibleStartIndex + 2 < allPosts.length - 1);
            
            return (
              <button
                key={p.slug}
                className={`v2-pill ${isActive ? 'is-active' : ''}`}
                data-design={`v${globalIndex + 1}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate(`/blog/${p.slug}`, { replace: true });
                  
                  // Viewport shift logic:
                  if (index === 2) {
                    // Clicked rightmost boundary -> make it the new first pill
                    setVisibleStartIndex(globalIndex);
                  } else if (index === 0 && visibleStartIndex > 0) {
                    // Clicked leftmost boundary -> shift back by 2 positions
                    setVisibleStartIndex(Math.max(0, visibleStartIndex - 2));
                  }
                }}
                role="tab"
                aria-selected={isActive}
              >
                {showLeftArrow && (
                  <span className="v2-pill-arrow v2-pill-arrow--left" aria-hidden="true">&larr;</span>
                )}
                Article {globalIndex + 1}
                {showRightArrow && (
                  <span className="v2-pill-arrow v2-pill-arrow--right" aria-hidden="true">&rarr;</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Subnav Strip */}
        <div className="v1-subnav-strip">
          <span className="v1-subnav-edge">Strategy / Issue 04</span>
          <span className="v1-subnav-brand">THE STUDIO.</span>
          <span className="v1-subnav-edge">Archive 2026</span>
        </div>

        {/* Fixed Gutter Sidebar Controls (Stays persistent and static during article slides) */}
        <aside className="v1-gutter-sticky">
          <button 
            onClick={() => navigate('/blog')} 
            className="v1-back"
            aria-label="Back to Blog"
          >
            <span className="v1-back-circle" aria-hidden="true">
              <span className="v1-back-icon">&larr;</span>
            </span>
            <span className="v1-back-label">Back to Blog</span>
          </button>
          
          <div className="v1-share">
            <div className="v1-share-label">Share</div>
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(postTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="v1-share-btn btn-x"
              title="Share on X"
            >
              X
            </a>
            <a 
              href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(postTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="v1-share-btn btn-linkedin"
              title="Share on LinkedIn"
            >
              in
            </a>
            <a 
              href="https://github.com/leon-madara"
              target="_blank"
              rel="noopener noreferrer"
              className="v1-share-btn btn-github"
              title="Developer GitHub"
            >
              GH
            </a>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(currentUrl);
                toast({
                  title: "Link Copied",
                  description: "Blog post link copied to clipboard.",
                });
              }}
              className="v1-share-btn btn-more"
              title="Copy Link"
            >
              ···
            </button>
          </div>
        </aside>

        {/* Slider Stage */}
        <div className="stage">
          <div 
            className="stage-track" 
            style={{ 
              transform: `translateX(-${activeIndex * 100}vw)`,
              width: `${allPosts.length * 100}vw`
            }}
          >
            {allPosts.map((p) => {
              const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              };

              return (
                <section key={p.slug} className={`design design-v${p.id}`} data-design={`v${p.id}`}>
                  <main className="v1-main">
                    <div className="v1-gutter" /> {/* spacing column */}
                    
                    <article className="v1-article">
                      <div className="v1-meta">
                        <span className="v1-tag">{p.category}</span>
                        <span className="v1-dot" />
                        <span className="v1-read">{p.readTime} min read</span>
                      </div>

                      <h1 className="v1-title">
                        <span className="v1-title-main">{p.title}</span>
                        {p.titleItalic && <em>{p.titleItalic}</em>}
                      </h1>

                      <div className="v1-author">
                        <div className="v1-avatar-lg">
                          {p.author.charAt(0)}
                        </div>
                        <div>
                          <div className="v1-author-name">By {p.author}</div>
                          <div className="v1-author-date">{formatDate(p.publishedDate)}</div>
                        </div>
                      </div>

                      <BlogContent
                        content={p.content}
                        format="markdown"
                      />
                    </article>
                    
                    <div className="v1-gutter" /> {/* spacing column */}
                  </main>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </BlogPostErrorBoundary>
  );
};

export default BlogPostPage;
