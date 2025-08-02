import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { ChartContainerProps } from '../../types/admin.types';

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  children,
  loading = false,
  error,
  className = ''
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();

  if (loading) {
    return (
      <div className={`glass-container rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-2 w-1/3"></div>
          {subtitle && <div className="h-4 bg-white/10 rounded mb-4 w-1/2"></div>}
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-container rounded-xl p-6 ${className}`}>
        <h3 className={`text-lg ${getClass('header')} text-white mb-2`}>
          {title}
        </h3>
        <div className="flex items-center justify-center h-64 text-red-400">
          <div className="text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p className={`${getClass('body')} text-sm`}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-container rounded-xl p-4 sm:p-6 ${className}`}>
      <div className="mb-6">
        <h3 className={`text-base sm:text-lg ${getClass('header')} text-white mb-1`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`${getClass('body')} text-white/60 text-xs sm:text-sm`}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="chart-content overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;