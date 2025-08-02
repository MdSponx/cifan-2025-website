import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingStates: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  message,
  size = 'medium',
  className = ''
}) => {
  const { getClass } = useTypography();

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const renderSpinner = () => (
    <div className={`animate-spin rounded-full border-2 border-[#FCB283] border-t-transparent ${sizeClasses[size]} ${className}`}></div>
  );

  const renderSkeleton = () => (
    <div className={`animate-pulse bg-white/20 rounded ${className}`} style={{ height: '1rem', width: '100%' }}></div>
  );

  const renderPulse = () => (
    <div className={`animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded ${className}`} style={{ height: '1rem', width: '100%' }}></div>
  );

  const renderDots = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-[#FCB283] rounded-full animate-bounce ${size === 'small' ? 'w-2 h-2' : size === 'large' ? 'w-4 h-4' : 'w-3 h-3'}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        ></div>
      ))}
    </div>
  );

  const renderLoading = () => {
    switch (type) {
      case 'skeleton':
        return renderSkeleton();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoading()}
      {message && (
        <p className={`text-white/80 ${getClass('body')} text-sm text-center`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingStates;

// Skeleton components for specific use cases
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-white/20 rounded w-1/4 animate-pulse"></div>
        <div className="h-12 bg-white/10 rounded animate-pulse"></div>
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass-container rounded-xl p-6 animate-pulse">
        <div className="aspect-[4/5] bg-white/20 rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="glass-container rounded-xl overflow-hidden">
    <div className="bg-gradient-to-r from-[#AA4626] to-[#FCB283] p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-white/30 rounded"></div>
        ))}
      </div>
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4 animate-pulse" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-white/10 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);