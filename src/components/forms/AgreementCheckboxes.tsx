import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { AGREEMENT_CONTENT } from '../../utils/formConstants';
import ErrorMessage from './ErrorMessage';

interface AgreementCheckboxesProps {
  agreements: {
    agreement1: boolean;
    agreement2: boolean;
    agreement3: boolean;
    agreement4: boolean;
  };
  onChange: (name: string, checked: boolean) => void;
  error?: string;
  className?: string;
}

const AgreementCheckboxes: React.FC<AgreementCheckboxesProps> = ({
  agreements,
  onChange,
  error,
  className = ''
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const title = currentLanguage === 'th' ? 'ข้อตกลงและเงื่อนไข' : 'Terms & Conditions';
  const agreementTexts = AGREEMENT_CONTENT[currentLanguage];

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.checked);
  };

  return (
    <div className={`glass-container rounded-xl sm:rounded-2xl p-6 sm:p-8 ${className}`}>
      <h3 className={`text-lg sm:text-xl ${getClass('subtitle')} text-white mb-6`}>
        📋 {title}
      </h3>
      
      {error && (
        <div className="mb-4">
          <ErrorMessage error={error} />
        </div>
      )}
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map(num => {
          const agreementKey = `agreement${num}` as keyof typeof agreements;
          const textKey = `agreement${num}` as keyof typeof agreementTexts;
          
          return (
            <label key={num} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name={agreementKey}
                checked={agreements[agreementKey]}
                onChange={handleChange(agreementKey)}
                className="mt-1 w-4 h-4 text-[#FCB283] bg-white/10 border-white/20 rounded focus:ring-[#FCB283] focus:ring-2"
              />
              <span className={`text-white/90 ${getClass('body')} text-sm leading-relaxed`}>
                {agreementTexts[textKey]} <span className="text-red-400">*</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AgreementCheckboxes;
