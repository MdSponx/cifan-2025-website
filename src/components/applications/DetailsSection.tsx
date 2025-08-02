import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import AnimatedButton from '../ui/AnimatedButton';
import GenreSelector from '../forms/GenreSelector';

interface ApplicationData {
  genres: string[];
  format: string;
  synopsis: string;
  status: 'draft' | 'submitted';
}

interface DetailsSectionProps {
  application: ApplicationData;
  isEditMode: boolean;
  onSave: (updatedData: Partial<ApplicationData>) => void;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ 
  application, 
  isEditMode, 
  onSave 
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [editedGenres, setEditedGenres] = useState(application.genres);
  const [editedFormat, setEditedFormat] = useState(application.format);
  const [editedSynopsis, setEditedSynopsis] = useState(application.synopsis);

  const handleSave = () => {
    onSave({
      genres: editedGenres,
      format: editedFormat,
      synopsis: editedSynopsis
    });
  };

  const handleCancel = () => {
    setEditedGenres(application.genres);
    setEditedFormat(application.format);
    setEditedSynopsis(application.synopsis);
  };

  const availableGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi',
    'Thriller', 'War', 'Western', 'Musical', 'Biography', 'History'
  ];

  const handleGenreToggle = (genre: string) => {
    setEditedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div className="glass-container rounded-2xl p-6 sm:p-8">
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex justify-between items-center">
          <h3 className={`text-xl ${getClass('header')} text-white`}>
            {currentLanguage === 'th' ? 'รายละเอียดภาพยนตร์' : 'Film Details'}
          </h3>
        </div>

        {isEditMode ? (
          // Edit Mode
          <div className="space-y-6">
            
            {/* Format Selection */}
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-3`}>
                {currentLanguage === 'th' ? 'รูปแบบภาพยนตร์' : 'Film Format'}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setEditedFormat('live-action')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    editedFormat === 'live-action'
                      ? 'border-[#FCB283] bg-[#FCB283]/10 text-[#FCB283]'
                      : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl mb-2">🎬</div>
                  <div className={`font-medium ${getClass('body')}`}>
                    {currentLanguage === 'th' ? 'จริง' : 'Live Action'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setEditedFormat('animation')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    editedFormat === 'animation'
                      ? 'border-[#FCB283] bg-[#FCB283]/10 text-[#FCB283]'
                      : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl mb-2">🎨</div>
                  <div className={`font-medium ${getClass('body')}`}>
                    {currentLanguage === 'th' ? 'แอนิเมชัน' : 'Animation'}
                  </div>
                </button>
              </div>
            </div>

            {/* Genre Selection */}
            <GenreSelector
              value={editedGenres}
              onChange={setEditedGenres}
              label={currentLanguage === 'th' ? 'แนวภาพยนตร์' : 'Genres'}
              required
            />

            {/* Synopsis */}
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentLanguage === 'th' ? 'เรื่องย่อ' : 'Synopsis'}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                value={editedSynopsis}
                onChange={(e) => setEditedSynopsis(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none resize-vertical"
                placeholder={currentLanguage === 'th' ? 'เขียนเรื่องย่อของภาพยนตร์...' : 'Write your film synopsis...'}
              />
              <p className="text-xs text-white/60 mt-1">
                {editedSynopsis.length} {currentLanguage === 'th' ? 'ตัวอักษร' : 'characters'}
              </p>
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
          <div className="space-y-6">
            
            {/* Format and Genres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Format */}
              <div className="glass-card p-4 rounded-xl">
                <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-3`}>
                  {currentLanguage === 'th' ? 'รูปแบบ' : 'Format'}
                </h4>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {application.format === 'live-action' ? '🎬' : '🎨'}
                  </span>
                  <span className={`text-lg ${getClass('body')} text-[#FCB283] capitalize`}>
                    {application.format.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Genres */}
              <div className="glass-card p-4 rounded-xl">
                <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-3`}>
                  {currentLanguage === 'th' ? 'แนว' : 'Genres'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {application.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-lg text-sm border border-[#FCB283]/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="glass-card p-6 rounded-xl">
              <h4 className={`text-lg ${getClass('subtitle')} text-white mb-4`}>
                {currentLanguage === 'th' ? 'เรื่องย่อ' : 'Synopsis'}
              </h4>
              <p className={`${getClass('body')} text-white/90 leading-relaxed whitespace-pre-wrap`}>
                {application.synopsis}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsSection;
