import React from 'react';

interface BlogCardSkeletonProps {
  count?: number;
}

const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="card card--blog card--skeleton">
          <div className="card__skeleton-line card__skeleton-line--title"></div>
          <div className="card__skeleton-line"></div>
          <div className="card__skeleton-line card__skeleton-line--short"></div>
          <div className="card__skeleton-line"></div>
          <div className="card__skeleton-line"></div>
          <div className="card__skeleton-line card__skeleton-line--short"></div>
          <div className="card__skeleton-line card__skeleton-line--meta"></div>
        </div>
      ))}
    </>
  );
};

export default BlogCardSkeleton;
