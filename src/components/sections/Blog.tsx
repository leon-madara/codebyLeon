import { BlogCard } from '../Blog/BlogCard';
import { getAllBlogPosts } from '../../utils/blogUtils';

export function Blog() {
  // Get the first 3 blog posts for home page preview
  const blogPosts = getAllBlogPosts().slice(0, 3);

  return (
    <section id="blog" className="blog">
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
        <h2 className="blog__headline">Insights for Growing Your Business Online</h2>
        <p className="blog__subheadline">
          Practical tips, case studies, and design insights for Kenyan businesses.
        </p>

        <div className="blog__grid">
          {blogPosts.map(post => (
            <BlogCard key={post.id} post={post} variant="preview" />
          ))}
        </div>

        <div className="blog__cta">
          <a href="/blog" className="btn-secondary">Read More Articles</a>
        </div>
      </div>
    </section>
  );
}
