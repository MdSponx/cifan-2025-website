import { useTranslation } from 'react-i18next';

// Typography utility function
export const getTypographyClass = (baseClass: string, language?: string): string => {
  const lang = language || 'en';
  return lang === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
};

// Custom hook for typography
export const useTypography = () => {
  const { i18n } = useTranslation();
  
  const getClass = (baseClass: string): string => {
    return getTypographyClass(baseClass, i18n.language);
  };

  return { getClass };
};
