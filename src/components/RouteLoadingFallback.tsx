import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface RouteLoadingFallbackProps {
  message?: string;
}

const RouteLoadingFallback: React.FC<RouteLoadingFallbackProps> = ({ 
  message = 'Loading page...' 
}) => {
  return (
    <div className="route-loading-fallback">
      <div className="route-loading-content">
        <LoadingSpinner size="large" message={message} />
      </div>
    </div>
  );
};

export default RouteLoadingFallback;