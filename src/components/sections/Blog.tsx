import { BlogCard } from '../Blog/BlogCard';
import { getAllBlogPosts } from '../../utils/blogUtils';

export function Blog() {
  // Get the first 3 blog posts for home page preview
  const blogPosts = getAllBlogPosts().slice(0, 3);

  return (
    <section id="blog" className="content-section">
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
        <h2 className="section-headline">Insights for Growing Your Business Online</h2>
        <p className="section-subheadline">
          Practical tips, case studies, and design insights for Kenyan businesses.
        </p>

        <div className="blog-grid">
          {blogPosts.map(post => (
            <BlogCard key={post.id} post={post} variant="preview" />
          ))}
        </div>

        <div className="section-cta">
          <a href="/blog" className="btn-secondary">Read More Articles</a>
        </div>
      </div>
    </section>
  );
}
