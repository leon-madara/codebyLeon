import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import { getBlogPostBySlug, getRelatedPosts } from '../utils/blogUtils';
import BlogHeader from '../components/Blog/BlogHeader';
import BlogContent from '../components/Blog/BlogContent';
import BlogFooter from '../components/Blog/BlogFooter';
import BlogPostErrorBoundary from '../components/Blog/BlogPostErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../hooks/use-toast';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) {
        setError('No blog post slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Simulate async operation (in a real app, this might be an API call)
        await new Promise(resolve => setTimeout(resolve, 100));

        const blogPost = getBlogPostBySlug(slug);
        
        if (!blogPost) {
          // Handle invalid slug - show toast and redirect to blog listing
          toast({
            title: "Blog post not found",
            description: "The requested blog post could not be found. Redirecting to blog listing.",
            variant: "destructive",
          });
          
          // Redirect to blog listing after a short delay
          setTimeout(() => {
            navigate('/blog', { replace: true });
          }, 2000);
          
          setError('Blog post not found');
          setLoading(false);
          return;
        }

        setPost(blogPost);
        
        // Get related posts
        const related = getRelatedPosts(blogPost, 3);
        setRelatedPosts(related);
        
        // Set document title
        document.title = `${blogPost.title} | CodeByLeon Blog`;
        
        // Set meta tags for SEO
        updateMetaTags(blogPost);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
        setLoading(false);
        
        toast({
          title: "Error loading blog post",
          description: "There was an error loading the blog post. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchBlogPost();
  }, [slug, navigate, toast]);

  // Function to update meta tags for SEO
  const updateMetaTags = (blogPost: BlogPost) => {
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', blogPost.description);

    // Update or create Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: blogPost.title },
      { property: 'og:description', content: blogPost.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:site_name', content: 'CodeByLeon' },
      { property: 'article:author', content: blogPost.author },
      { property: 'article:published_time', content: blogPost.publishedDate },
      { property: 'article:section', content: blogPost.category },
    ];

    // Add featured image if available
    if (blogPost.featuredImage) {
      ogTags.push({ property: 'og:image', content: blogPost.featuredImage });
      ogTags.push({ property: 'og:image:alt', content: blogPost.title });
    }

    // Add tags as keywords
    ogTags.push({ property: 'article:tag', content: blogPost.tags.join(', ') });

    ogTags.forEach(({ property, content }) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Update or create Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: blogPost.title },
      { name: 'twitter:description', content: blogPost.description },
    ];

    if (blogPost.featuredImage) {
      twitterTags.push({ name: 'twitter:image', content: blogPost.featuredImage });
    }

    twitterTags.forEach(({ name, content }) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Add canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);

    // Add JSON-LD structured data for BlogPosting
    addJsonLdStructuredData(blogPost);
  };

  // Function to add JSON-LD structured data
  const addJsonLdStructuredData = (blogPost: BlogPost) => {
    // Remove existing JSON-LD script if it exists
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create JSON-LD structured data for BlogPosting
    const structuredData: any = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blogPost.title,
      "description": blogPost.description,
      "author": {
        "@type": "Person",
        "name": blogPost.author,
        "url": "https://codebyleon.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "CodeByLeon",
        "url": "https://codebyleon.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://codebyleon.com/logo.png"
        }
      },
      "datePublished": blogPost.publishedDate,
      "dateModified": blogPost.publishedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "url": window.location.href,
      "articleSection": blogPost.category,
      "keywords": blogPost.tags,
      "wordCount": Math.ceil(blogPost.content.length / 5), // Rough estimate
      "timeRequired": `PT${blogPost.readTime}M`, // ISO 8601 duration format
      "inLanguage": "en-US"
    };

    // Add image if available
    if (blogPost.featuredImage) {
      structuredData.image = {
        "@type": "ImageObject",
        "url": blogPost.featuredImage,
        "caption": blogPost.title
      };
    }

    // Create and append the script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  };

  // Cleanup meta tags when component unmounts
  useEffect(() => {
    return () => {
      // Reset document title
      document.title = 'CodeByLeon - Professional Web Development Services';
      
      // Remove blog-specific meta tags
      const metaTagsToRemove = [
        'meta[name="description"]',
        'meta[property^="og:"]',
        'meta[property^="article:"]',
        'meta[name^="twitter:"]',
        'link[rel="canonical"]'
      ];
      
      metaTagsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element.getAttribute('content') !== 'CodeByLeon - Professional Web Development Services') {
            element.remove();
          }
        });
      });

      // Remove JSON-LD structured data
      const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      if (jsonLdScript) {
        jsonLdScript.remove();
      }
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="blog-post-page">
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

  // Error state
  if (error || !post) {
    return (
      <div className="blog-post-page">
        <div className="blog-post-error">
          <h1>Blog Post Not Found</h1>
          <p>
            {error === 'Blog post not found' 
              ? 'The requested blog post could not be found.' 
              : 'There was an error loading the blog post.'}
          </p>
          <p>You will be redirected to the blog listing shortly.</p>
          <button 
            onClick={() => navigate('/blog')}
            className="back-to-blog-button"
          >
            Go to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <BlogPostErrorBoundary>
      <div className="blog-post-page">
        <main className="blog-post-main">
          <article className="blog-post-article">
            <BlogHeader
              title={post.title}
              category={post.category}
              author={post.author}
              publishedDate={post.publishedDate}
              readTime={post.readTime}
              featuredImage={post.featuredImage}
            />
            
            <BlogContent
              content={post.content}
              format="markdown"
            />
          </article>
          
          <BlogFooter
            currentPostId={post.id}
            relatedPosts={relatedPosts}
          />
        </main>
      </div>
    </BlogPostErrorBoundary>
  );
};

export default BlogPostPage;