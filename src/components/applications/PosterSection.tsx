import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import AnimatedButton from '../ui/AnimatedButton';
import FileReplacer from './FileReplacer';

interface ApplicationData {
  id: string;
  competitionCategory: 'youth' | 'future' | 'world';
  status: 'draft' | 'submitted';
  filmTitle: string;
  filmTitleTh?: string;
  files: {
    posterFile: {
      url: string;
      name: string;
      size: number;
    };
  };
}

interface PosterSectionProps {
  application: ApplicationData;
  isEditMode: boolean;
  canEdit: boolean;
}

const PosterSection: React.FC<PosterSectionProps> = ({ 
  application, 
  isEditMode, 
  canEdit 
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [isHovered, setIsHovered] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    return status === 'submitted' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const getStatusText = (status: string) => {
    return status === 'submitted' 
      ? (currentLanguage === 'th' ? 'ส่งแล้ว' : 'Submitted')
      : (currentLanguage === 'th' ? 'ร่าง' : 'Draft');
  };

  const getCategoryLogo = (category: string) => {
    const logos = {
      youth: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
      future: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
      world: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67"
    };
    return logos[category as keyof typeof logos];
  };

  const handlePosterReplace = () => {
    // TODO: Implement poster replacement functionality
    console.log('Replace poster clicked');
  };

  return (
    <div className="glass-container rounded-2xl p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Large Poster Display */}
        <div className="lg:col-span-2">
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Poster Image */}
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <img
                src={application.files.posterFile.url}
                alt={`${application.filmTitle} Poster`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Edit Overlay */}
            {canEdit && isEditMode && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <AnimatedButton
                  variant="primary"
                  size="medium"
                  icon="🖼️"
                  onClick={handlePosterReplace}
                >
                  {currentLanguage === 'th' ? 'เปลี่ยนโปสเตอร์' : 'Replace Poster'}
                </AnimatedButton>
              </div>
            )}

            {/* Hover Info */}
            {isHovered && !isEditMode && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className={`text-white text-sm ${getClass('body')}`}>
                  {application.files.posterFile.name}
                </p>
                <p className="text-white/60 text-xs">
                  {(application.files.posterFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status and Category Info */}
        <div className="space-y-6">
          
          {/* Competition Category Logo */}
          <div className="text-center">
            <img
              src={getCategoryLogo(application.competitionCategory)}
              alt={`${application.competitionCategory} competition logo`}
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
            <h3 className={`text-lg ${getClass('subtitle')} text-[#FCB283]`}>
              {application.competitionCategory === 'youth' && (currentLanguage === 'th' ? 'รางวัลหนังสั้นแฟนตาสติกเยาวชน' : 'Youth Fantastic Short Film Award')}
              {application.competitionCategory === 'future' && (currentLanguage === 'th' ? 'รางวัลหนังสั้นแฟนตาสติกอนาคต' : 'Future Fantastic Short Film Award')}
              {application.competitionCategory === 'world' && (currentLanguage === 'th' ? 'รางวัลหนังสั้นแฟนตาสติกโลก' : 'World Fantastic Short Film Award')}
            </h3>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeColor(application.status)}`}>
              <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
              {getStatusText(application.status)}
            </span>
          </div>

          {/* Application ID */}
          <div className="glass-card p-4 rounded-xl">
            <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-2`}>
              {currentLanguage === 'th' ? 'รหัสใบสมัคร' : 'Application ID'}
            </h4>
            <p className={`text-xs ${getClass('body')} text-[#FCB283] font-mono break-all`}>
              {application.id}
            </p>
          </div>

          {/* Submission Stats */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${getClass('body')} text-white/60`}>
                {currentLanguage === 'th' ? 'ขนาดโปสเตอร์:' : 'Poster Size:'}
              </span>
              <span className={`text-sm ${getClass('body')} text-white`}>
                {(application.files.posterFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterSection;
