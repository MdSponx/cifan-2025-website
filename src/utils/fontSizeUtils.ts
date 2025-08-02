import { useTranslation } from 'react-i18next';

// Utility to apply consistent size scaling for Thai text
export const getThaiSizeClass = (baseSize: string): string => {
  const sizeMapping: { [key: string]: string } = {
    // Text sizes - increase by one step for Thai
    'text-xs': 'text-sm',
    'text-sm': 'text-base',
    'text-base': 'text-lg',
    'text-lg': 'text-xl',
    'text-xl': 'text-2xl',
    'text-2xl': 'text-3xl',
    'text-3xl': 'text-4xl',
    'text-4xl': 'text-5xl',
    'text-5xl': 'text-6xl',
    'text-6xl': 'text-7xl',
    'text-7xl': 'text-8xl',
    
    // Responsive combinations
    'text-xs sm:text-sm': 'text-sm sm:text-base',
    'text-sm sm:text-base': 'text-base sm:text-lg',
    'text-base sm:text-lg': 'text-lg sm:text-xl',
    'text-lg sm:text-xl': 'text-xl sm:text-2xl',
    'text-xl sm:text-2xl': 'text-2xl sm:text-3xl',
    'text-2xl sm:text-3xl': 'text-3xl sm:text-4xl',
    'text-3xl sm:text-4xl': 'text-4xl sm:text-5xl',
    'text-4xl sm:text-5xl': 'text-5xl sm:text-6xl',
    'text-5xl sm:text-6xl': 'text-6xl sm:text-7xl',
    'text-6xl sm:text-7xl': 'text-7xl sm:text-8xl',
    
    // Medium responsive combinations
    'text-xs sm:text-sm md:text-base': 'text-sm sm:text-base md:text-lg',
    'text-sm sm:text-base md:text-lg': 'text-base sm:text-lg md:text-xl',
    'text-base sm:text-lg md:text-xl': 'text-lg sm:text-xl md:text-2xl',
    'text-lg sm:text-xl md:text-2xl': 'text-xl sm:text-2xl md:text-3xl',
    'text-xl sm:text-2xl md:text-3xl': 'text-2xl sm:text-3xl md:text-4xl',
    'text-2xl sm:text-3xl md:text-4xl': 'text-3xl sm:text-4xl md:text-5xl',
    'text-3xl sm:text-4xl md:text-5xl': 'text-4xl sm:text-5xl md:text-6xl',
    'text-4xl sm:text-5xl md:text-6xl': 'text-5xl sm:text-6xl md:text-7xl',
    'text-5xl sm:text-6xl md:text-7xl': 'text-6xl sm:text-7xl md:text-8xl',
    
    // Large responsive combinations
    'text-xs sm:text-sm md:text-base lg:text-lg': 'text-sm sm:text-base md:text-lg lg:text-xl',
    'text-sm sm:text-base md:text-lg lg:text-xl': 'text-base sm:text-lg md:text-xl lg:text-2xl',
    'text-base sm:text-lg md:text-xl lg:text-2xl': 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    'text-lg sm:text-xl md:text-2xl lg:text-3xl': 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    'text-xl sm:text-2xl md:text-3xl lg:text-4xl': 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    'text-2xl sm:text-3xl md:text-4xl lg:text-5xl': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    'text-3xl sm:text-4xl md:text-5xl lg:text-6xl': 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    'text-4xl sm:text-5xl md:text-6xl lg:text-7xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
    
    // Extra large responsive combinations
    'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
  };
  
  return sizeMapping[baseSize] || baseSize;
};

// Enhanced typography hook with size scaling
export const useResponsiveTypography = () => {
  const { i18n } = useTranslation();
  
  const getResponsiveClass = (baseClass: string, baseSize: string): string => {
    const typographyClass = i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
    const sizeClass = i18n.language === 'th' ? getThaiSizeClass(baseSize) : baseSize;
    return `${typographyClass} ${sizeClass}`;
  };

  const getThaiAdjustedSize = (baseSize: string): string => {
    return i18n.language === 'th' ? getThaiSizeClass(baseSize) : baseSize;
  };

  return { getResponsiveClass, getThaiAdjustedSize };
};

// Utility function for conditional Thai size classes
export const getConditionalThaiSize = (language: string, baseSize: string, thaiSize?: string): string => {
  if (language === 'th') {
    return thaiSize || getThaiSizeClass(baseSize);
  }
  return baseSize;
};

// Helper function to generate Thai-specific size classes for inline use
export const thaiSize = (baseSize: string): string => {
  return getThaiSizeClass(baseSize);
};
