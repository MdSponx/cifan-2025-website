import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { AdminApplicationCard as AdminApplicationCardType } from '../../types/admin.types';
import { Eye, Edit, Star, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AdminApplicationCardProps {
  application: AdminApplicationCardType;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  showBulkSelect?: boolean;
}

const AdminApplicationCard: React.FC<AdminApplicationCardProps> = ({
  application,
  onView,
  onEdit,
  isSelected = false,
  onSelect,
  showBulkSelect = false
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryLogo = (category: string) => {
    const logos = {
      youth: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
      future: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
      world: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67"
    };
    return logos[category as keyof typeof logos];
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <Edit className="w-3 h-3" /> },
      submitted: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <Clock className="w-3 h-3" /> },
      'under-review': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <AlertCircle className="w-3 h-3" /> },
      accepted: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <XCircle className="w-3 h-3" /> }
    };
    return badges[status as keyof typeof badges] || badges.submitted;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Thailand': '🇹🇭',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Malaysia': '🇲🇾',
      'Philippines': '🇵🇭',
      'Vietnam': '🇻🇳',
      'Indonesia': '🇮🇩',
      'Taiwan': '🇹🇼',
      'India': '🇮🇳',
      'Australia': '🇦🇺',
      'United States': '🇺🇸'
    };
    return flags[country] || '🌍';
  };

  const statusBadge = getStatusBadge(application.status);
  const displayTitle = currentLanguage === 'th' && application.filmTitleTh 
    ? application.filmTitleTh 
    : application.filmTitle;
  const displayDirector = currentLanguage === 'th' && application.directorNameTh 
    ? application.directorNameTh 
    : application.directorName;

  // Handle card click to navigate to detail page
  const handleCardClick = () => {
    onView(application.id);
  };
  return (
    <div 
      className={`group cursor-pointer relative ${isSelected ? 'ring-2 ring-[#FCB283]' : ''}`}
      onClick={handleCardClick}
    >
      {/* Bulk Selection Checkbox */}
      {showBulkSelect && (
        <div className="absolute top-2 left-2 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(application.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 text-[#FCB283] bg-white/10 border-white/20 rounded focus:ring-[#FCB283] focus:ring-2"
          />
        </div>
      )}

      {/* Application Card */}
      <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-[#FCB283]/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        
        {/* Poster Image */}
        <div className="aspect-[4/5] relative overflow-hidden bg-white/5">
          {!imageError ? (
            <img
              src={application.posterUrl}
              alt={`${application.filmTitle} Poster`}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/10">
              <div className="text-center">
                <div className="text-4xl mb-2">🎬</div>
                <p className={`text-white/60 text-sm ${getClass('body')}`}>
                  {currentLanguage === 'th' ? 'ไม่พบรูปภาพ' : 'No Image'}
                </p>
              </div>
            </div>
          )}
          
          {/* Loading Skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          )}
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Status Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
              {statusBadge.icon}
              <span className="capitalize">
                {application.status.replace('-', ' ')}
              </span>
            </span>
          </div>

          {/* Category Logo - Top Left */}
          <div className="absolute top-3 left-3">
            <img
              src={getCategoryLogo(application.competitionCategory)}
              alt={`${application.competitionCategory} logo`}
              className="h-8 w-auto object-contain opacity-90"
            />
          </div>

          {/* Score Badge - Top Center (if available) */}
          {application.hasScores && application.averageScore && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
              <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-[#FCB283]/20 text-[#FCB283] border border-[#FCB283]/30">
                <Star className="w-3 h-3 fill-current" />
                <span>{application.averageScore.toFixed(1)}</span>
              </span>
            </div>
          )}

          {/* Content Overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Film Title */}
            <h3 className={`text-lg sm:text-xl ${getClass('header')} text-white mb-2 leading-tight line-clamp-2`}>
              {displayTitle}
            </h3>
            
            {/* Director Name */}
            <p className={`text-sm ${getClass('subtitle')} text-white/90 mb-1`}>
              {currentLanguage === 'th' ? 'ผู้กำกับ: ' : 'Director: '}{displayDirector}
            </p>
            
            {/* Category and Country */}
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${getClass('subtitle')} text-[#FCB283] capitalize`}>
                {application.competitionCategory}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-sm">{getCountryFlag(application.country)}</span>
                <span className={`text-xs ${getClass('body')} text-white/70`}>
                  {application.country}
                </span>
              </div>
            </div>
            
            {/* Submission Date */}
            <p className={`text-xs ${getClass('body')} text-white/80 mb-3`}>
              {application.status === 'submitted' && application.submittedAt
                ? `${currentLanguage === 'th' ? 'ส่งเมื่อ' : 'Submitted'}: ${formatDate(application.submittedAt)}`
                : `${currentLanguage === 'th' ? 'สร้างเมื่อ' : 'Created'}: ${formatDate(application.createdAt)}`
              }
            </p>

            {/* Admin Action Buttons */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(application.id);
                }}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-lg text-white transition-colors text-xs"
                title={currentLanguage === 'th' ? 'ดูรายละเอียด' : 'View Details'}
              >
                <Eye className="w-4 h-4" />
                <span>{currentLanguage === 'th' ? 'ดู' : 'View'}</span>
              </button>
              
              {onEdit && application.status === 'draft' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(application.id);
                  }}
                  className="flex items-center justify-center px-3 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg text-white transition-colors"
                  title={currentLanguage === 'th' ? 'แก้ไข' : 'Edit'}
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationCard;