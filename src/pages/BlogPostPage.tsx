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
import {
  SITE_NAME,
  SITE_URL,
  getAbsoluteUrl,
  usePageSeo,
} from '../utils/seo';

const createBlogPostStructuredData = (blogPost: BlogPost): Record<string, unknown> => {
  const canonicalUrl = getAbsoluteUrl(`/blog/${blogPost.slug}`);
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blogPost.title,
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
      caption: blogPost.title,
    };
  }

  return structuredData;
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  usePageSeo(post ? {
    title: `${post.title} | ${SITE_NAME} Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
    image: post.featuredImage,
    imageAlt: post.title,
    author: post.author,
    publishedTime: post.publishedDate,
    modifiedTime: post.publishedDate,
    section: post.category,
    tags: post.tags,
    structuredData: createBlogPostStructuredData(post),
  } : {
    title: error ? `Blog Post Not Found | ${SITE_NAME}` : `Loading Blog Post | ${SITE_NAME}`,
    description: 'Read practical website, SEO, and conversion articles from Code by Leon.',
    path: slug ? `/blog/${slug}` : '/blog',
  });

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
