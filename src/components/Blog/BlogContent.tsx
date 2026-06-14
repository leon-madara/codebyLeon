import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import SafeImage from '../SafeImage';

interface BlogContentProps {
  content: string;
  format: 'markdown' | 'html';
}

interface ContentErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

// Enhanced Error Boundary for content rendering
class ContentErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; content: string },
  ContentErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: ReactNode; content: string }) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): ContentErrorBoundaryState {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced logging for content rendering errors
    console.error('Blog content rendering error:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      contentLength: this.props.content?.length || 0,
      contentPreview: this.props.content?.substring(0, 100) || 'No content',
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount
    });

    // In a real application, you might want to send this to an error reporting service
    // Example: errorReportingService.captureException(error, { 
    //   extra: { ...errorInfo, contentLength: this.props.content?.length }
    // });
  }

  componentDidUpdate(prevProps: { children: ReactNode; fallback: ReactNode; content: string }) {
    // Reset error state if content changes (allows for retry)
    if (prevProps.content !== this.props.content && this.state.hasError) {
      this.setState({ hasError: false, error: undefined, retryCount: 0 });
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState({ 
        hasError: false, 
        // eslint-disable-next-line react/no-unused-state
        error: undefined, 
        retryCount: this.state.retryCount + 1 
      });
    }
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Recursive helper to extract text content from a react node tree
const getPlainText = (node: React.ReactNode): string => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getPlainText).join('');
  if (React.isValidElement(node)) {
    return getPlainText((node.props as any).children);
  }
  return '';
};

// Premium wrapper for block code with window controls and copy button
const BlogCodeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copied, setCopied] = useState(false);
  
  let lang = '';
  let codeText = '';
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const className = (child.props as any).className || '';
      const match = /language-(\w+)/.exec(className);
      if (match) {
        lang = match[1];
      }
      
      codeText = getPlainText((child.props as any).children);
    }
  });

  if (!codeText) {
    codeText = getPlainText(children);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText.replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="blog-code-container">
      <div className="blog-code-header">
        <div className="blog-code-dots">
          <span className="blog-code-dot dot-red" />
          <span className="blog-code-dot dot-yellow" />
          <span className="blog-code-dot dot-green" />
        </div>
        {lang && <span className="blog-code-lang">{lang.toUpperCase()}</span>}
        <button 
          className="blog-code-copy" 
          onClick={handleCopy}
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? (
            <>
              <svg className="blog-copy-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="blog-copy-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="blog-code-pre">
        {children}
      </pre>
    </div>
  );
};

const BlogContent: React.FC<BlogContentProps> = ({ content, format }) => {
  const renderContent = () => {
    if (format === 'html') {
      return (
        <div 
          className="blog-content-html"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Markdown rendering with plugins
    return (
      <div className="blog-content-markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom pre wrapper for code blocks
            pre: ({ node, children, ...props }) => (
              <BlogCodeWrapper>{children}</BlogCodeWrapper>
            ),
            // Custom image component for responsive images with error handling
            img: ({ node, ...props }) => (
              <SafeImage
                {...props}
                className="blog-content-image"
                loading="lazy"
                fallbackType="placeholder"
                placeholderText="Image could not be loaded"
                onError={(error) => {
                  console.warn('Blog content image failed to load:', {
                    src: props.src,
                    alt: props.alt,
                    error: error.toString()
                  });
                }}
              />
            ),
            // Custom code block styling
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              return isInline ? (
                <code className="blog-inline-code" {...props}>
                  {children}
                </code>
              ) : (
                <code className={`blog-code-block ${className || ''}`} {...props}>
                  {children}
                </code>
              );
            },
          // Custom heading components with proper hierarchy
          h1: ({ children }) => <h2 className="blog-content-h1">{children}</h2>,
          h2: ({ children }) => <h3 className="blog-content-h2">{children}</h3>,
          h3: ({ children }) => <h4 className="blog-content-h3">{children}</h4>,
          h4: ({ children }) => <h5 className="blog-content-h4">{children}</h5>,
          h5: ({ children }) => <h6 className="blog-content-h5">{children}</h6>,
          h6: ({ children }) => <h6 className="blog-content-h6">{children}</h6>,
          // Custom paragraph styling
          p: ({ children }) => <p className="blog-content-paragraph">{children}</p>,
          // Custom list styling
          ul: ({ children }) => <ul className="blog-content-list">{children}</ul>,
          ol: ({ children }) => <ol className="blog-content-ordered-list">{children}</ol>,
          li: ({ children }) => <li className="blog-content-list-item">{children}</li>,
          // Custom blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="blog-content-blockquote">{children}</blockquote>
          ),
          // Custom link styling
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="blog-content-link"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
        }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const fallbackContent = (
    <div className="blog-content-error">
      <div className="blog-content-error-icon">⚠️</div>
      <h3>Content Unavailable</h3>
      <p>Sorry, we're having trouble displaying this content. This might be due to formatting issues or corrupted data.</p>
      <div className="blog-content-error-actions">
        <button 
          onClick={() => window.location.reload()}
          className="blog-content-retry-button"
        >
          Refresh Page
        </button>
      </div>
      <details className="blog-content-raw">
        <summary>View raw content</summary>
        <pre className="blog-content-raw-text">{content}</pre>
      </details>
    </div>
  );

  return (
    <article className="blog-content">
      <ContentErrorBoundary fallback={fallbackContent} content={content}>
        {renderContent()}
      </ContentErrorBoundary>
    </article>
  );
};

export default BlogContent;