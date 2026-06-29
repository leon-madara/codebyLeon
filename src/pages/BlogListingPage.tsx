import React, { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '../components/Blog/BlogCard';
import { getAllBlogPosts, getAllCategories } from '../utils/blogUtils';
import { BlogPost } from '../types/blog';
import BlogCardSkeleton from '../components/Blog/BlogCardSkeleton';
import { SITE_NAME, SITE_URL, getAbsoluteUrl, usePageSeo } from '../utils/seo';
import { Filter, X, LayoutGrid, TrendingUp, Compass, BookOpen, Cpu, Eye, Lightbulb, ChevronRight } from 'lucide-react';

type SortOption = 'date' | 'title';

const categoryDetails: Record<string, {
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  colorClass: string;
}> = {
  "Business Growth": {
    desc: "Actionable ideas on scaling your client base.",
    icon: TrendingUp,
    colorClass: "blog__category-icon--growth"
  },
  "Business Strategy": {
    desc: "High-level positioning and planning tips.",
    icon: Compass,
    colorClass: "blog__category-icon--strategy"
  },
  "Case Studies": {
    desc: "Deep dives into how we helped businesses grow.",
    icon: BookOpen,
    colorClass: "blog__category-icon--cases"
  },
  "Technology & Reliability": {
    desc: "Web tools, speed, hosting, and clean code.",
    icon: Cpu,
    colorClass: "blog__category-icon--tech"
  },
  "User Experience": {
    desc: "Designing intuitive interfaces that convert.",
    icon: Eye,
    colorClass: "blog__category-icon--ux"
  },
  "Website Tips": {
    desc: "Practical adjustments to improve your site today.",
    icon: Lightbulb,
    colorClass: "blog__category-icon--tips"
  }
};

const readMoreHighlights = [
  {
    id: 'image',
    title: 'Visual stories that stick',
    description:
      'Each post is paired with the photography, mood boards, or UI mockups that inspired the experience so you can borrow the same visual language.',
    bullets: [
      'Curated imagery that explains decision-making',
      'Photo + layout notes aligned to conversion goals',
      'Tips for compressing and serving hero visuals fast',
    ],
    cta: 'Explore the visual playbook',
  },
  {
    id: 'code',
    title: 'Code snippets you can ship',
    description:
      'Every strategy is backed by real markup, CSS, or React patterns so you can adopt the same guardrails in your next site overhaul.',
    bullets: [
      'Copy-ready component patterns (accessibility first)',
      'CSS/JS performance tricks that cut load time',
      'Mini-systems for gradients, typography, and CTA polish',
    ],
    cta: 'Open the code lab',
  },
];

export function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterOpen]);

  // Simulate loading state for better UX (in real app, this would be actual async data loading)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Get all blog posts and categories
  const allPosts = getAllBlogPosts();
  const categories = getAllCategories();

  usePageSeo({
    title: `Blog | ${SITE_NAME}`,
    description:
      'Practical web design, SEO, conversion, and business growth articles for Kenyan founders, teams, and service businesses.',
    path: '/blog',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${SITE_NAME} Blog`,
      description:
        'Practical web design, SEO, conversion, and business growth articles for Kenyan founders, teams, and service businesses.',
      url: getAbsoluteUrl('/blog'),
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      blogPost: allPosts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.titleItalic ? `${post.title} ${post.titleItalic}` : post.title,
        description: post.description,
        url: getAbsoluteUrl(`/blog/${post.slug}`),
        datePublished: post.publishedDate,
        author: {
          '@type': 'Person',
          name: post.author,
        },
      })),
    },
  });

  // Filter and sort posts based on current selections
  const filteredAndSortedPosts = useMemo(() => {
    let posts = allPosts;

    // Filter by category if selected
    if (selectedCategory) {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    posts = [...posts].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      } else {
        const titleA = a.titleItalic ? `${a.title} ${a.titleItalic}` : a.title;
        const titleB = b.titleItalic ? `${b.title} ${b.titleItalic}` : b.title;
        return titleA.localeCompare(titleB);
      }
    });

    return posts;
  }, [allPosts, selectedCategory, sortBy]);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
  };

  return (
    <section id="blog-listing" className="blog">
      {/* LAYER 2: Abstract Orbs */}
      <div className="blog__orbs">
        <div className="blog__orb blog__orb--purple"></div>
        <div className="blog__orb blog__orb--orange"></div>
        <div className="blog__orb blog__orb--blue"></div>
      </div>

      {/* LAYER 3: Frosted Overlay */}
      <div className="blog__overlay"></div>

      {/* LAYER 4: Content */}
      <div className="blog__content">
        {/* Page Header */}
        <div className="blog__listing-header">
          <h1 className="blog__listing-title">Blog</h1>
          <p className="blog__listing-subtitle">
            Practical insights, case studies, and strategies to help your business thrive online.
          </p>
        </div>

        {/* Floating Mobile Trigger Handle */}
        <button
          type="button"
          className={`blog__drawer-trigger ${selectedCategory !== null ? 'is-filtering' : ''}`}
          onClick={() => setIsFilterOpen(true)}
          aria-label="Open filters"
        >
          <Filter size={16} />
          <span>Filters</span>
          {selectedCategory !== null && <span className="blog__drawer-trigger-badge" />}
        </button>

        {/* Backdrop Overlay for Mobile Drawer */}
        {isFilterOpen && (
          <div
            className="blog__controls-overlay"
            onClick={() => setIsFilterOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Desktop Controls (Tablet & Up) */}
        <div className="blog__controls blog__controls--desktop">
          {/* Category Filters */}
          <div className="blog__filters">
            <button
              className={`blog__filter-button ${selectedCategory === null ? 'is-active' : ''}`}
              onClick={() => handleCategoryFilter(null)}
            >
              All Posts
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`blog__filter-button ${selectedCategory === category ? 'is-active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="blog__sort">
            <label htmlFor="sort-select" className="blog__sort-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="blog__sort-select"
            >
              <option value="date">Newest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Mobile Drawer (Mobile Only) */}
        <div className={`blog__controls blog__controls--mobile ${isFilterOpen ? 'is-open' : ''}`}>
          {/* Drawer Header */}
          <div className="blog__controls-header">
            <span className="blog__controls-title">Filter By</span>
            <button
              type="button"
              className="blog__controls-close"
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>

          {/* Inner rectangle container wrapping scrollable categories */}
          <div className="blog__drawer-inner-box">
            <div className="blog__filters-vertical">
              <button
                type="button"
                className={`blog__filter-button-vertical ${selectedCategory === null ? 'is-active' : ''}`}
                onClick={() => handleCategoryFilter(null)}
              >
                <div className="blog__filter-icon-container blog__category-icon--all">
                  <LayoutGrid className="blog__filter-icon" size={18} />
                </div>
                <div className="blog__filter-info">
                  <span className="blog__filter-name">All Posts</span>
                  <span className="blog__filter-desc">Show all articles across all topics.</span>
                </div>
                <ChevronRight className="blog__filter-chevron" size={14} />
              </button>
              {categories.map(category => {
                const detail = categoryDetails[category] || {
                  desc: "Explore articles in this category.",
                  icon: BookOpen,
                  colorClass: "blog__category-icon--all"
                };
                const IconComp = detail.icon;
                return (
                  <button
                    key={category}
                    type="button"
                    className={`blog__filter-button-vertical ${selectedCategory === category ? 'is-active' : ''}`}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    <div className={`blog__filter-icon-container ${detail.colorClass}`}>
                      <IconComp className="blog__filter-icon" size={18} />
                    </div>
                    <div className="blog__filter-info">
                      <span className="blog__filter-name">{category}</span>
                      <span className="blog__filter-desc">{detail.desc}</span>
                    </div>
                    <ChevronRight className="blog__filter-chevron" size={14} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom active tag capsules row */}
          <div className="blog__drawer-tags-footer">
            <button
              type="button"
              className={`blog__drawer-footer-tag ${selectedCategory === null ? 'is-active' : ''}`}
              onClick={() => handleCategoryFilter(null)}
            >
              Latest
            </button>
            {selectedCategory && (
              <button
                type="button"
                className="blog__drawer-footer-tag blog__drawer-footer-tag--dismissible"
                onClick={() => handleCategoryFilter(null)}
                aria-label={`Clear filter: ${selectedCategory}`}
              >
                <span>{selectedCategory}</span>
                <X size={10} className="blog__drawer-footer-tag-close" />
              </button>
            )}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="blog__grid">
            <BlogCardSkeleton count={6} />
          </div>
        ) : filteredAndSortedPosts.length > 0 ? (
          <div className="blog__grid">
            {filteredAndSortedPosts.map(post => (
              <BlogCard key={post.id} post={post} variant="full" />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="blog__empty">
            <h3 className="blog__empty-title">No posts found</h3>
            <p className="blog__empty-description">
              {selectedCategory 
                ? `No posts found in the "${selectedCategory}" category.`
                : 'No blog posts available at the moment.'
              }
            </p>
            {selectedCategory && (
              <button
                className="btn-secondary"
                onClick={() => handleCategoryFilter(null)}
              >
                View All Posts
              </button>
            )}
          </div>
        )}

        {/* Results Summary & Active Filters */}
        {!loading && (
          <div className="blog__results">
            <p className="blog__results-text">
              Showing {filteredAndSortedPosts.length} of {allPosts.length} posts
            </p>
            {selectedCategory && (
              <div className="blog__active-tags">
                <button
                  type="button"
                  className="blog__active-tag"
                  onClick={() => handleCategoryFilter(null)}
                  aria-label={`Clear filter: ${selectedCategory}`}
                >
                  <span>{selectedCategory}</span>
                  <X size={12} className="blog__active-tag-icon" />
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && (
          <div className="blog__read-more">
            <div className="blog__read-more-heading">
              <h3>Read more everywhere you want to grow</h3>
              <p>
                Dive deeper into the visuals and code that power every story. These
                micro-features give you ready-to-apply tactics alongside the posts you just read.
              </p>
            </div>
            <div className="blog__feature-grid">
              {readMoreHighlights.map(feature => (
                <article
                  key={feature.id}
                  className={`blog__feature-card blog__feature-card--${feature.id}`}
                >
                  <span className="blog__feature-icon" aria-hidden="true">
                    {feature.id === 'image' ? '🖼️' : '💻'}
                  </span>
                  <div className="blog__feature-body">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                    <ul className="blog__feature-list">
                      {feature.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <span className="blog__feature-cta">{feature.cta}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
