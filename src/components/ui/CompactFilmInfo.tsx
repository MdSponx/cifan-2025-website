import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { 
  Clock, 
  Globe, 
  User, 
  Video
} from 'lucide-react';

interface CompactFilmInfoProps {
  filmTitle: string;
  filmTitleTh?: string;
  filmLanguages?: string[];
  genres: string[];
  format: string;
  duration: number;
  synopsis: string;
  nationality: string;
  competitionCategory: string;
  posterUrl: string;
  submitterName: string;
  submitterNameTh?: string;
  submitterRole: string;
  customRole?: string;
  chiangmaiConnection?: string;
  directorName?: string;
  directorNameTh?: string;
  directorRole?: string;
  directorCustomRole?: string;
}

const CompactFilmInfo: React.FC<CompactFilmInfoProps> = ({
  filmTitle,
  filmTitleTh,
  filmLanguages,
  genres,
  format,
  duration,
  synopsis,
  nationality,
  competitionCategory,
  posterUrl,
  submitterName,
  submitterNameTh,
  submitterRole,
  customRole,
  chiangmaiConnection,
  directorName,
  directorNameTh,
  directorRole,
  directorCustomRole
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  // Helper functions
  const getCountryFlag = (nationality: string) => {
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
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Australia': '🇦🇺',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'France': '🇫🇷'
    };
    return flags[nationality] || '🌍';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      youth: 'from-blue-500 to-cyan-500',
      future: 'from-purple-500 to-pink-500',
      world: 'from-green-500 to-emerald-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const formatDuration = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTitle = currentLanguage === 'th' && filmTitleTh ? filmTitleTh : filmTitle;
  const alternativeTitle = currentLanguage === 'th' ? filmTitle : filmTitleTh;
  
  // Display Director's name if available, otherwise show "Unknown"
  const displayDirectorName = (() => {
    if (directorName || directorNameTh) {
      return currentLanguage === 'th' && directorNameTh ? directorNameTh : directorName;
    }
    return currentLanguage === 'th' ? 'ไม่ทราบ' : 'Unknown';
  })();
  
  const displayRole = (() => {
    if (directorRole) {
      return directorRole === 'Other' ? directorCustomRole : directorRole;
    }
    // Only show role if we have director info, otherwise don't show role for "Unknown"
    if (directorName || directorNameTh) {
      return null;
    }
    return null;
  })();

  return (
    <div className="glass-container rounded-2xl p-6 space-y-6">
      {/* Main Film Info Row */}
      <div className="flex gap-8">
        {/* Enlarged Poster - 300px width */}
        <div className="flex-shrink-0">
          <div className="w-[300px] aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${displayTitle} Poster`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex flex-col items-center justify-center text-white/60">
                        <div class="text-4xl mb-3">🖼️</div>
                        <div class="text-sm text-center px-3">
                          ${currentLanguage === 'th' ? 'ไม่สามารถโหลดโปสเตอร์ได้' : 'Poster not available'}
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                <div className="text-4xl mb-3">🖼️</div>
                <div className="text-sm text-center px-3">
                  {currentLanguage === 'th' ? 'ไม่มีโปสเตอร์' : 'No poster available'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title, Metadata, and Badges - Right Side */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Title Section with Competition Badge */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className={`text-3xl sm:text-4xl ${getClass('header')} text-white leading-tight mb-2`}>
                {displayTitle}
              </h1>
              {alternativeTitle && (
                <p className={`text-lg ${getClass('body')} text-white/70 mb-3`}>
                  {alternativeTitle}
                </p>
              )}
              
              {/* Director Info - Inline */}
              <div className="flex items-center space-x-2 text-white/80 mb-4">
                <User className="w-4 h-4 text-[#FCB283]" />
                <span className={`text-sm ${getClass('body')}`}>
                  {displayDirectorName}
                </span>
                {displayRole && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className={`text-sm ${getClass('body')} text-white/60`}>
                      {displayRole}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Competition Category Badge - Replace Logo */}
            <div className="flex-shrink-0 ml-4">
              <div className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(competitionCategory)} rounded-xl`}>
                <span className={`text-sm ${getClass('body')} text-white font-medium capitalize`}>
                  {competitionCategory === 'youth' 
                    ? (currentLanguage === 'th' ? 'เยาวชน' : 'Youth Competition')
                    : competitionCategory === 'future'
                    ? (currentLanguage === 'th' ? 'อนาคต' : 'Future Competition') 
                    : (currentLanguage === 'th' ? 'นานาชาติ' : 'World Competition')
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Inline Badges Row - Moved to Right Side */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Duration Badge */}
            <div className="flex items-center space-x-2 px-3 py-2 glass-card rounded-lg">
              <Clock className="w-4 h-4 text-[#FCB283]" />
              <span className={`text-sm ${getClass('body')} text-white font-medium`}>
                {formatDuration(duration)} {currentLanguage === 'th' ? 'นาที' : 'min'}
              </span>
            </div>

            {/* Country Badge */}
            <div className="flex items-center space-x-2 px-3 py-2 glass-card rounded-lg">
              <span className="text-lg">{getCountryFlag(nationality)}</span>
              <span className={`text-sm ${getClass('body')} text-white font-medium`}>
                {nationality}
              </span>
            </div>

            {/* Format Badge */}
            <div className="flex items-center space-x-2 px-3 py-2 glass-card rounded-lg">
              <Video className="w-4 h-4 text-[#FCB283]" />
              <span className={`text-sm ${getClass('body')} text-white font-medium capitalize`}>
                {format.replace('-', ' ')}
              </span>
            </div>
          </div>
            {/* Film Language Badge */}
            {filmLanguages && filmLanguages.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-2 glass-card rounded-lg">
                <span className="text-lg">🗣️</span>
                <span className={`text-sm ${getClass('body')} text-white font-medium`}>
                  {filmLanguages.join(', ')}
                </span>
              </div>
            )}

          {/* Genre Pills - Moved to Right Side */}
          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-[#AA4626] to-[#FCB283] text-white rounded-full text-sm font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Chiang Mai Connection - Under Genre Badges, No Glass Container */}
          {chiangmaiConnection && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏔️</span>
                <h4 className={`${getClass('subtitle')} text-white`}>
                  {currentLanguage === 'th' ? 'ความเกี่ยวข้องกับเชียงใหม่' : 'Connection to Chiang Mai'}
                </h4>
              </div>
              <p className={`${getClass('body')} text-white/90 leading-relaxed`}>
                {chiangmaiConnection}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full Synopsis - No Read More Button */}
      {synopsis && (
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">📖</span>
            <h4 className={`${getClass('subtitle')} text-white`}>
              {currentLanguage === 'th' ? 'เรื่องย่อ' : 'Synopsis'}
            </h4>
          </div>
          <p className={`${getClass('body')} text-white/90 leading-relaxed`}>
            {synopsis}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompactFilmInfo;
