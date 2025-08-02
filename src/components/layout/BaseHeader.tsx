import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { Menu, ArrowLeft, Shield } from 'lucide-react';

interface BaseHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
  onSidebarToggle: () => void;
  children?: React.ReactNode;
  isAdminZone?: boolean;
  sidebarToggleId?: string;
}

const BaseHeader: React.FC<BaseHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  backButtonText,
  onBackClick,
  onSidebarToggle,
  children,
  isAdminZone = false,
  sidebarToggleId
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { userProfile } = useAuth();
  const currentLanguage = i18n.language as 'en' | 'th';

  const defaultBackText = currentLanguage === 'th' ? 'กลับ' : 'Back';
  const toggleId = sidebarToggleId || (isAdminZone ? 'admin-sidebar-toggle' : 'sidebar-toggle');

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="glass-container rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        
        {/* Left Side: Back Button + Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
          
          {/* Mobile Sidebar Toggle */}
          <button
            id={toggleId}
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <Menu size={20} className="text-white/80" />
          </button>

          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className={`flex items-center space-x-1 sm:space-x-2 text-white/80 hover:text-white transition-colors flex-shrink-0 ${getClass('menu')} text-sm sm:text-base`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{backButtonText || defaultBackText}</span>
            </button>
          )}

          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {isAdminZone && <Shield className="w-5 h-5 text-[#FCB283] flex-shrink-0" />}
              <h1 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl ${getClass('header')} text-white truncate`}>
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className={`${getClass('subtitle')} text-white/80 text-xs sm:text-sm md:text-base truncate`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Custom Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseHeader;
