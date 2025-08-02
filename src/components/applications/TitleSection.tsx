import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import AnimatedButton from '../ui/AnimatedButton';

interface ApplicationData {
  filmTitle: string;
  filmTitleTh?: string;
  status: 'draft' | 'submitted';
}

interface TitleSectionProps {
  application: ApplicationData;
  isEditMode: boolean;
  onSave: (updatedData: Partial<ApplicationData>) => void;
}

const TitleSection: React.FC<TitleSectionProps> = ({ 
  application, 
  isEditMode, 
  onSave 
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [editedTitle, setEditedTitle] = useState(application.filmTitle);
  const [editedTitleTh, setEditedTitleTh] = useState(application.filmTitleTh || '');

  const handleSave = () => {
    onSave({
      filmTitle: editedTitle,
      filmTitleTh: editedTitleTh
    });
  };

  const handleCancel = () => {
    setEditedTitle(application.filmTitle);
    setEditedTitleTh(application.filmTitleTh || '');
  };

  const displayTitle = currentLanguage === 'th' && application.filmTitleTh 
    ? application.filmTitleTh 
    : application.filmTitle;

  const displaySubtitle = currentLanguage === 'th' && application.filmTitleTh 
    ? application.filmTitle 
    : application.filmTitleTh;

  return (
    <div className="glass-container rounded-2xl p-6 sm:p-8">
      {isEditMode ? (
        // Edit Mode
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Title */}
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentLanguage === 'th' ? 'ชื่อภาพยนตร์ (ภาษาอังกฤษ)' : 'Film Title (English)'}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none"
                placeholder="Enter film title in English"
              />
            </div>

            {/* Thai Title */}
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentLanguage === 'th' ? 'ชื่อภาพยนตร์ (ภาษาไทย)' : 'Film Title (Thai)'}
              </label>
              <input
                type="text"
                value={editedTitleTh}
                onChange={(e) => setEditedTitleTh(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none"
                placeholder={currentLanguage === 'th' ? 'ใส่ชื่อภาพยนตร์ภาษาไทย' : 'Enter film title in Thai'}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <AnimatedButton
              variant="outline"
              size="medium"
              onClick={handleCancel}
            >
              {currentLanguage === 'th' ? 'ยกเลิก' : 'Cancel'}
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              size="medium"
              icon="💾"
              onClick={handleSave}
            >
              {currentLanguage === 'th' ? 'บันทึก' : 'Save'}
            </AnimatedButton>
          </div>
        </div>
      ) : (
        // Display Mode
        <div className="text-center">
          {/* Main Title */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${getClass('header')} mb-4 text-white leading-tight`}>
            {displayTitle}
          </h1>

          {/* Subtitle (other language) */}
          {displaySubtitle && (
            <h2 className={`text-xl sm:text-2xl md:text-3xl ${getClass('subtitle')} text-[#FCB283] opacity-80`}>
              {displaySubtitle}
            </h2>
          )}

          {/* Edit Indicator for Draft Status */}
          {application.status === 'draft' && !isEditMode && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                {currentLanguage === 'th' ? 'สามารถแก้ไขได้' : 'Editable'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TitleSection;
