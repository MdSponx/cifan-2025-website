import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { TrendingUp, TrendingDown, Users, Award } from 'lucide-react';
import { CategoryBannerCardProps } from '../../types/admin.types';

const CategoryBannerCard: React.FC<CategoryBannerCardProps> = ({
  category,
  title,
  subtitle,
  count,
  percentage,
  trend,
  logo,
  onClick
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const getCategoryColors = (cat: string) => {
    const colors = {
      youth: {
        gradient: 'from-blue-500 via-blue-600 to-blue-700',
        accent: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30'
      },
      future: {
        gradient: 'from-green-500 via-green-600 to-green-700',
        accent: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30'
      },
      world: {
        gradient: 'from-purple-500 via-purple-600 to-purple-700',
        accent: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30'
      }
    };
    return colors[cat as keyof typeof colors] || colors.youth;
  };

  const colors = getCategoryColors(category);

  return (
    <div 
      className="glass-container rounded-2xl p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-500 cursor-pointer group relative overflow-hidden"
      onClick={onClick}
    >
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt={`${category} competition logo`}
              className="h-12 sm:h-16 lg:h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          {/* Trend Indicator */}
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${
            trend.isPositive 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <h3 className={`text-lg sm:text-xl lg:text-2xl ${getClass('header')} text-white mb-2 leading-tight group-hover:${colors.accent} transition-colors duration-300`}>
            {title}
          </h3>
          <p className={`${getClass('subtitle')} text-white/70 text-xs sm:text-sm`}>
            {subtitle}
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          {/* Applications Count */}
          <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Users className={`w-5 h-5 ${colors.accent}`} />
              <span className={`text-xs ${getClass('body')} text-white/60 truncate`}>
                {currentLanguage === 'th' ? 'ใบสมัคร' : 'Applications'}
              </span>
            </div>
            <p className={`text-xl sm:text-2xl lg:text-3xl ${getClass('header')} text-white font-bold`}>
              {count.toLocaleString()}
            </p>
          </div>

          {/* Percentage Share */}
          <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Award className={`w-5 h-5 ${colors.accent}`} />
              <span className={`text-xs ${getClass('body')} text-white/60 truncate`}>
                {currentLanguage === 'th' ? 'สัดส่วน' : 'Share'}
              </span>
            </div>
            <p className={`text-xl sm:text-2xl lg:text-3xl ${getClass('header')} text-white font-bold`}>
              {percentage}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs ${getClass('body')} text-white/60`}>
              {currentLanguage === 'th' ? 'ความคืบหน้า' : 'Progress'}
            </span>
            <span className={`text-xs ${getClass('body')} ${colors.accent} font-medium`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${colors.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Hint */}
        <div className="text-center">
          <p className={`text-xs ${getClass('menu')} text-white/50 group-hover:text-white/70 transition-colors duration-300`}>
            {currentLanguage === 'th' ? 'คลิกเพื่อดูรายละเอียด' : 'Click to view details'}
          </p>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default CategoryBannerCard;