import React from 'react';

interface BlogCardSkeletonProps {
  count?: number;
}

const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="blog-card-skeleton">
          <div className="skeleton-category"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-title-short"></div>
          <div className="skeleton-description"></div>
          <div className="skeleton-description"></div>
          <div className="skeleton-description-short"></div>
          <div className="skeleton-meta">
            <div className="skeleton-meta-item"></div>
            <div className="skeleton-meta-item"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogCardSkeleton;