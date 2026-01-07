import React, { useState, useRef } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackType?: 'hide' | 'placeholder' | 'gradient';
  placeholderText?: string;
  onError?: (error: Event) => void;
  onLoad?: (event: Event) => void;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'placeholder',
  placeholderText,
  onError,
  onLoad,
  style,
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setIsLoading(false);
    
    // Call custom error handler if provided
    if (onError) {
      onError(event.nativeEvent);
    }

    // Log error for debugging
    console.warn(`Failed to load image: ${src}`, {
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

  // Don't render anything if no src provided and fallbackType is 'hide'
  if (!src && fallbackType === 'hide') {
    return null;
  }

  // Show error fallback if image failed to load
  if (hasError || !src) {
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

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`safe-image ${className} ${isLoading ? 'loading' : 'loaded'}`}
      style={style}
      loading={loading}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default SafeImage;