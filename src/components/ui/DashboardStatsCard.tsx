import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardStatsCardProps } from '../../types/admin.types';

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  colorScheme,
  className = '',
  onClick
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();

  const getColorScheme = (scheme: string) => {
    const schemes = {
      youth: {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30'
      },
      future: {
        gradient: 'from-green-500 to-green-600',
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30'
      },
      world: {
        gradient: 'from-purple-500 to-purple-600',
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/30'
      },
      primary: {
        gradient: 'from-[#AA4626] to-[#FCB283]',
        bg: 'bg-[#FCB283]/20',
        text: 'text-[#FCB283]',
        border: 'border-[#FCB283]/30'
      },
      success: {
        gradient: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30'
      },
      warning: {
        gradient: 'from-amber-500 to-amber-600',
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        border: 'border-amber-500/30'
      },
      info: {
        gradient: 'from-cyan-500 to-cyan-600',
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30'
      }
    };
    return schemes[scheme as keyof typeof schemes] || schemes.primary;
  };

  const colors = getColorScheme(colorScheme);

  return (
    <div 
      className={`glass-container rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        {/* Icon */}
        <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${colors.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${
            trend.isPositive 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-2">
        <h3 className={`text-2xl sm:text-3xl lg:text-4xl ${getClass('header')} text-white mb-1 group-hover:${colors.text} transition-colors duration-300`}>
          {value.toLocaleString()}
        </h3>
        <p className={`${getClass('body')} text-white/70 text-xs sm:text-sm font-medium`}>
          {title}
        </p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className={`${getClass('body')} text-white/60 text-xs leading-relaxed line-clamp-2`}>
          {subtitle}
        </p>
      )}

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.bg} pointer-events-none`}></div>
    </div>
  );
};

export default DashboardStatsCard;