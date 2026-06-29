import React, { useState, useRef, useEffect, useMemo } from 'react';
import { isCloudflareEnabled, getCloudflareImageId, cloudflareBlurUpUrls } from '../lib/cloudflareImages';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  fallbackType?: 'hide' | 'placeholder' | 'gradient';
  placeholderText?: string;
  onError?: (error: Event) => void;
  onLoad?: (event: Event) => void;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  imageId?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

const SafeImage = React.forwardRef<HTMLImageElement, SafeImageProps>(({
  src,
  alt,
  className = '',
  fallbackType = 'placeholder',
  placeholderText,
  onError,
  onLoad,
  style,
  loading = 'lazy',
  imageId,
  fetchPriority,
  ...props
}, ref) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [srcToRender, setSrcToRender] = useState<string | undefined>(undefined);

  // Check if Cloudflare is enabled and the image should be delivered via Cloudflare
  const cfImageId = useMemo(() => {
    if (!isCloudflareEnabled()) return null;
    if (imageId) return imageId;
    if (src) return getCloudflareImageId(src);
    return null;
  }, [src, imageId]);

  // Generate Cloudflare URLs if applicable
  const cfUrls = useMemo(() => {
    if (!cfImageId) return null;
    const accountHash = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_HASH || '';
    return cloudflareBlurUpUrls(
      accountHash,
      cfImageId,
      'public',
      fetchPriority === 'high' || loading === 'eager'
    );
  }, [cfImageId, fetchPriority, loading]);

  // Set initial source and manage preloading transition
  useEffect(() => {
    if (cfUrls) {
      setSrcToRender(cfUrls.preview);
      setIsPreloaded(false);
      setIsLoading(true);

      const preloader = new Image();
      preloader.src = cfUrls.final;
      preloader.onload = () => {
        setSrcToRender(cfUrls.final);
        setIsPreloaded(true);
        setIsLoading(false);
      };
      preloader.onerror = () => {
        // Fall back to preview or local src if preload fails
        setSrcToRender(src);
        setIsLoading(false);
      };
    } else {
      setSrcToRender(src);
      setIsPreloaded(false);
      setIsLoading(true);
    }
  }, [cfUrls, src]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setIsLoading(false);
    
    // Call custom error handler if provided
    if (onError) {
      onError(event.nativeEvent);
    }

    // Log error for debugging
    console.warn(`Failed to load image: ${src || imageId}`, {
      alt,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    
    if (onLoad) {
      onLoad(event.nativeEvent);
    }
  };

  // Don't render anything if no src/imageId provided and fallbackType is 'hide'
  if (!srcToRender && fallbackType === 'hide') {
    return null;
  }

  // Show error fallback if image failed to load
  if (hasError || !srcToRender) {
    if (fallbackType === 'hide') {
      return null;
    }

    if (fallbackType === 'gradient') {
      return (
        <div 
          className={`safe-image-gradient ${className}`}
          style={style}
          role="img"
          aria-label={alt}
        >
          <div className="gradient-overlay"></div>
          {placeholderText && (
            <div className="gradient-text">{placeholderText}</div>
          )}
        </div>
      );
    }

    // Default placeholder
    return (
      <div 
        className={`safe-image-placeholder ${className}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <div className="placeholder-icon">🖼️</div>
        <div className="placeholder-text">
          {placeholderText || 'Image unavailable'}
        </div>
      </div>
    );
  }

  // Determine transition classes for blur-up loading
  const transitionClass = cfUrls
    ? `transition-all duration-700 ease-in-out ${isPreloaded ? 'blur-0 scale-100' : 'blur-md scale-[1.02]'}`
    : '';

  return (
    <img
      ref={ref}
      src={srcToRender}
      alt={alt}
      className={`safe-image ${transitionClass} ${className} ${isLoading ? 'loading' : 'loaded'}`}
      style={style}
      loading={loading}
      {...({ fetchpriority: fetchPriority } as any)}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
});

SafeImage.displayName = 'SafeImage';

export default SafeImage;