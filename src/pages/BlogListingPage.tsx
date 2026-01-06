import React, { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '../components/Blog/BlogCard';
import { getAllBlogPosts, getAllCategories } from '../utils/blogUtils';
import { BlogPost } from '../types/blog';
import BlogCardSkeleton from '../components/Blog/BlogCardSkeleton';

type SortOption = 'date' | 'title';

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
    <section id="blog-listing" className="content-section">
      {/* LAYER 2: Abstract Orbs */}
      <div className="orbs-container">
        <div className="orb orb-purple"></div>
        <div className="orb orb-orange"></div>
        <div className="orb orb-blue"></div>
      </div>

      {/* LAYER 3: Frosted Overlay */}
      <div className="frosted-overlay"></div>

      {/* LAYER 4: Content */}
      <div className="section-content">
        {/* Page Header */}
        <div className="blog-listing-header">
          <h1 className="section-headline">Blog</h1>
          <p className="section-subheadline">
            Practical insights, case studies, and strategies to help your business thrive online.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="blog-controls">
          {/* Category Filters */}
          <div className="category-filters">
            <button
              className={`filter-button ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(null)}
            >
              All Posts
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="sort-controls">
            <label htmlFor="sort-select" className="sort-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="date">Newest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="blog-grid">
            <BlogCardSkeleton count={6} />
          </div>
        ) : filteredAndSortedPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredAndSortedPosts.map(post => (
              <BlogCard key={post.id} post={post} variant="full" />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="empty-state">
            <h3>No posts found</h3>
            <p>
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
          <div className="results-summary">
            <p>
              Showing {filteredAndSortedPosts.length} of {allPosts.length} posts
              {selectedCategory && ` in "${selectedCategory}"`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}