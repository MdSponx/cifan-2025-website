import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GENRE_OPTIONS } from '../../utils/formConstants';
import { useTypography } from '../../utils/typography';
import ErrorMessage from './ErrorMessage';

interface GenreSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  required?: boolean;
  className?: string;
  label?: string;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  value = [],
  onChange,
  error,
  required = false,
  className = '',
  label
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';
  
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customGenre, setCustomGenre] = useState('');

  const defaultLabel = currentLanguage === 'th' ? 'แนวภาพยนตร์' : 'Genre';

  // Check if "other" is selected and show input accordingly
  useEffect(() => {
    const hasOther = value.some(genre => !GENRE_OPTIONS.find(option => option.value === genre));
    setShowOtherInput(hasOther);
    if (hasOther) {
      const otherGenre = value.find(genre => !GENRE_OPTIONS.find(option => option.value === genre));
      setCustomGenre(otherGenre || '');
    }
  }, [value]);

  const handleGenreToggle = (genreValue: string) => {
    const newValue = [...value];
    const index = newValue.indexOf(genreValue);
    
    if (index > -1) {
      // Remove genre
      newValue.splice(index, 1);
    } else {
      // Add genre
      newValue.push(genreValue);
    }
    
    onChange(newValue);
  };

  const handleOtherToggle = () => {
    if (showOtherInput) {
      // Remove custom genre and hide input
      const newValue = value.filter(genre => GENRE_OPTIONS.find(option => option.value === genre));
      onChange(newValue);
      setShowOtherInput(false);
      setCustomGenre('');
    } else {
      // Show input
      setShowOtherInput(true);
    }
  };

  const handleCustomGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customValue = e.target.value;
    setCustomGenre(customValue);
    
    // Update the value array
    const newValue = value.filter(genre => GENRE_OPTIONS.find(option => option.value === genre));
    if (customValue.trim()) {
      newValue.push(customValue.trim());
    }
    onChange(newValue);
  };

  const isSelected = (genreValue: string) => value.includes(genreValue);
  const isOtherSelected = value.some(genre => !GENRE_OPTIONS.find(option => option.value === genre));

  return (
    <div className={`${className} overflow-visible`}>
      {label && (
        <label className={`block text-white/90 ${getClass('body')} mb-2 relative z-10`}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      
      {error && (
        <div className="mb-4 relative z-10">
          <ErrorMessage error={error} />
        </div>
      )}
      
      {/* Genre Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 overflow-visible relative z-10 min-h-fit">
        {GENRE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleGenreToggle(option.value)}
            className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 min-h-[60px] sm:min-h-[80px] ${
              isSelected(option.value)
                ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] border-[#FCB283] text-white shadow-lg'
                : 'bg-white/5 border-white/20 text-white/80 hover:border-[#FCB283]/50 hover:bg-white/10'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-1 h-full">
              <span className="text-base sm:text-lg md:text-xl">
                {getGenreEmoji(option.value)}
              </span>
              <span className={`text-xs sm:text-sm ${getClass('body')} text-center leading-tight px-1`}>
                {option.label[currentLanguage]}
              </span>
            </div>
          </button>
        ))}
        
        {/* Other Genre Button */}
        <button
          type="button"
          onClick={handleOtherToggle}
          className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 min-h-[60px] sm:min-h-[80px] ${
            isOtherSelected
              ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] border-[#FCB283] text-white shadow-lg'
              : 'bg-white/5 border-white/20 text-white/80 hover:border-[#FCB283]/50 hover:bg-white/10'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-1 h-full">
            <span className="text-base sm:text-lg md:text-xl">✨</span>
            <span className={`text-xs sm:text-sm ${getClass('body')} text-center leading-tight px-1`}>
              {currentLanguage === 'th' ? 'อื่นๆ' : 'Other'}
            </span>
          </div>
        </button>
      </div>

      {/* Custom Genre Input */}
      {showOtherInput && (
        <div className="mb-4 relative z-10 overflow-visible">
          <label className={`block text-white/90 ${getClass('body')} mb-2`}>
            {currentLanguage === 'th' ? 'ระบุแนวภาพยนตร์' : 'Specify Genre'} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={customGenre}
            onChange={handleCustomGenreChange}
            placeholder={currentLanguage === 'th' ? 'กรอกแนวภาพยนตร์ที่ต้องการ' : 'Enter your genre'}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none"
          />
        </div>
      )}

      {/* Selected Genres Display */}
      {value.length > 0 && (
        <div className="mt-4 relative z-10 overflow-visible">
          <p className={`text-white/70 ${getClass('body')} mb-2 text-sm`}>
            {currentLanguage === 'th' ? 'แนวที่เลือก:' : 'Selected Genres:'}
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {value.map((genre, index) => {
              const option = GENRE_OPTIONS.find(opt => opt.value === genre);
              const displayName = option ? option.label[currentLanguage] : genre;
              
              return (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-full text-xs border border-[#FCB283]/30"
                >
                  {displayName}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get emoji for each genre
const getGenreEmoji = (genre: string): string => {
  const emojiMap: { [key: string]: string } = {
    'horror': '👻',
    'scifi': '🚀',
    'fantasy': '🧙‍♂️',
    'dark-comedy': '😈',
    'folklore': '🏮',
    'action': '💥',
    'surreal': '🌀',
    'monster': '👹',
    'magic': '🪄',
    'musical': '🎶',
    'thriller': '🔪'
  };
  
  return emojiMap[genre] || '🎭';
};

export default GenreSelector;
