import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import ErrorMessage from './ErrorMessage';

interface FormatSelectorProps {
  value: 'live-action' | 'animation' | '';
  onChange: (value: 'live-action' | 'animation') => void;
  error?: string;
  required?: boolean;
  className?: string;
  label?: string;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  value,
  onChange,
  error,
  required = false,
  className = '',
  label
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      title: 'รูปแบบภาพยนตร์',
      liveAction: 'คนแสดง',
      animation: 'แอนิเมชั่น'
    },
    en: {
      title: 'Film Format',
      liveAction: 'Live-Action',
      animation: 'Animation'
    }
  };

  const currentContent = content[currentLanguage];

  const handleChange = (format: 'live-action' | 'animation') => {
    onChange(format);
  };

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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 relative z-10 overflow-visible min-h-fit">
        {/* Live-Action Option */}
        <button
          type="button"
          onClick={() => handleChange('live-action')}
          className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
            value === 'live-action'
              ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] border-[#FCB283] text-white shadow-lg'
              : 'bg-white/5 border-white/20 text-white/80 hover:border-[#FCB283]/50 hover:bg-white/10'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-2xl sm:text-3xl">🎭</span>
            <span className={`text-xs sm:text-sm ${getClass('body')} text-center leading-tight font-medium px-1`}>
              {currentContent.liveAction}
            </span>
          </div>
        </button>

        {/* Animation Option */}
        <button
          type="button"
          onClick={() => handleChange('animation')}
          className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
            value === 'animation'
              ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] border-[#FCB283] text-white shadow-lg'
              : 'bg-white/5 border-white/20 text-white/80 hover:border-[#FCB283]/50 hover:bg-white/10'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-2xl sm:text-3xl">🎨</span>
            <span className={`text-xs sm:text-sm ${getClass('body')} text-center leading-tight font-medium px-1`}>
              {currentContent.animation}
            </span>
          </div>
        </button>
      </div>

      {/* Selected Format Display */}
      {value && (
        <div className="mt-4 relative z-10 overflow-visible">
          <p className={`text-white/70 ${getClass('body')} mb-2 text-sm`}>
            {currentLanguage === 'th' ? 'รูปแบบที่เลือก:' : 'Selected Format:'}
          </p>
          <span className="px-3 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-full text-xs border border-[#FCB283]/30">
            {value === 'live-action' ? currentContent.liveAction : currentContent.animation}
          </span>
        </div>
      )}
    </div>
  );
};

export default FormatSelector;
