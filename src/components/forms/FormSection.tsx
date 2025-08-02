import React from 'react';
import { useTypography } from '../../utils/typography';

interface FormSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  children,
  className = ''
}) => {
  const { getClass } = useTypography();

  return (
    <div className={`glass-container form-section-container rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 min-h-fit overflow-visible relative ${className}`}>
      <h3 className={`text-lg sm:text-xl ${getClass('subtitle')} text-white mb-4 sm:mb-6 relative z-10`}>
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      <div className="relative z-10 overflow-visible min-h-fit">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
