import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface BlogPostErrorBoundaryProps {
  children: ReactNode;
}

interface BlogPostErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Wrapper component to use hooks in class component
const BlogPostErrorFallback: React.FC<{ error?: Error; onRetry: () => void }> = ({ error, onRetry }) => {
  const navigate = useNavigate();

  return (
    <div className="blog-post-error-boundary">
      <div className="blog-post-error-content">
        <h1>Unable to Load Blog Post</h1>
        <p>
          We encountered an error while trying to display this blog post. 
          This might be due to a temporary issue or corrupted content.
        </p>
        
        <div className="blog-post-error-actions">
          <button 
            onClick={onRetry}
            className="blog-error-retry-button"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/blog')}
            className="blog-error-back-button"
          >
            Back to Blog
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="blog-error-details">
            <summary>Error Details (Development Only)</summary>
            <pre className="blog-error-stack">
              {error.toString()}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

class BlogPostErrorBoundary extends Component<BlogPostErrorBoundaryProps, BlogPostErrorBoundaryState> {
  constructor(props: BlogPostErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): BlogPostErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging with blog-specific context
    console.error('Blog Post Error Boundary caught an error:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      errorBoundary: 'BlogPostErrorBoundary',
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    // In a real application, you might want to send this to an error reporting service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <BlogPostErrorFallback 
          error={this.state.error} 
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default BlogPostErrorBoundary;