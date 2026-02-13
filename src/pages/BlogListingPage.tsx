import React, { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '../components/Blog/BlogCard';
import { getAllBlogPosts, getAllCategories } from '../utils/blogUtils';
import { BlogPost } from '../types/blog';
import BlogCardSkeleton from '../components/Blog/BlogCardSkeleton';

type SortOption = 'date' | 'title';

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
        return a.title.localeCompare(b.title);
      }
    });

    return posts;
  }, [allPosts, selectedCategory, sortBy]);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
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

        {/* Filters and Sorting */}
        <div className="blog__controls">
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

        {/* Results Summary */}
        {!loading && (
          <div className="blog__results">
            <p className="blog__results-text">
              Showing {filteredAndSortedPosts.length} of {allPosts.length} posts
              {selectedCategory && ` in "${selectedCategory}"`}
            </p>
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
