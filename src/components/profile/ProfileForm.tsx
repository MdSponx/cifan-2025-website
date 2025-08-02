import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { Save, Calendar, Phone, User, Globe } from 'lucide-react';
import { ProfileFormData, ProfileFormErrors } from '../../types/profile.types';
import PhotoUpload from './PhotoUpload';
import ErrorMessage from '../forms/ErrorMessage';

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullNameEN: user?.displayName || '',
    fullNameTH: '',
    birthDate: '',
    phoneNumber: '',
    ...initialData
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    } else if (user?.displayName && !formData.fullNameEN) {
      setFormData(prev => ({ ...prev, fullNameEN: user.displayName || '' }));
    }
  }, [initialData, user?.displayName]);

  const validateForm = (): boolean => {
    const newErrors: ProfileFormErrors = {};

    // Full Name EN (Required)
    if (!formData.fullNameEN.trim()) {
      newErrors.fullNameEN = t('profile.errors.fullNameENRequired');
    } else if (formData.fullNameEN.trim().length < 2) {
      newErrors.fullNameEN = t('profile.errors.fullNameENTooShort');
    }

    // Full Name TH (Optional but validate if provided)
    if (formData.fullNameTH && formData.fullNameTH.trim().length < 2) {
      newErrors.fullNameTH = t('profile.errors.fullNameTHTooShort');
    }

    // Birth Date (Required)
    if (!formData.birthDate) {
      newErrors.birthDate = t('profile.errors.birthDateRequired');
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        newErrors.birthDate = t('profile.errors.birthDateFuture');
      } else if (age < 13) {
        newErrors.birthDate = t('profile.errors.ageTooYoung');
      } else if (age > 120) {
        newErrors.birthDate = t('profile.errors.ageTooOld');
      }
    }

    // Phone Number (Required)
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('profile.errors.phoneRequired');
    } else {
      const phoneRegex = /^[\+]?[0-9\-\(\)\s]{8,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.trim())) {
        newErrors.phoneNumber = t('profile.errors.phoneInvalid');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    if (errors.photoFile) {
      setErrors(prev => ({ ...prev, photoFile: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData: ProfileFormData = {
        ...formData,
        photoFile: photoFile || undefined
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const currentAge = calculateAge(formData.birthDate);

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Profile Photo */}
      <div className="text-center">
        <PhotoUpload
          currentPhotoURL={userProfile?.photoURL}
          onPhotoChange={handlePhotoChange}
          error={errors.photoFile}
          userName={formData.fullNameEN || user?.displayName || undefined}
        />
      </div>

      {/* Full Name EN */}
      <div>
        <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
          <User className="w-4 h-4 inline mr-2" />
          {t('profile.fullNameEN')} *
        </label>
        <input
          type="text"
          value={formData.fullNameEN}
          onChange={(e) => handleInputChange('fullNameEN', e.target.value)}
          className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
          placeholder={t('profile.fullNameENPlaceholder')}
          disabled={isSubmitting}
        />
        <ErrorMessage error={errors.fullNameEN} />
      </div>

      {/* Full Name TH */}
      <div>
        <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
          <Globe className="w-4 h-4 inline mr-2" />
          {t('profile.fullNameTH')} ({t('common.optional')})
        </label>
        <input
          type="text"
          value={formData.fullNameTH || ''}
          onChange={(e) => handleInputChange('fullNameTH', e.target.value)}
          className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
          placeholder={t('profile.fullNameTHPlaceholder')}
          disabled={isSubmitting}
        />
        <ErrorMessage error={errors.fullNameTH} />
      </div>

      {/* Birth Date */}
      <div>
        <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
          <Calendar className="w-4 h-4 inline mr-2" />
          {t('profile.birthDate')} *
        </label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => handleInputChange('birthDate', e.target.value)}
          className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
          disabled={isSubmitting}
          max={new Date().toISOString().split('T')[0]} // Prevent future dates
        />
        {currentAge > 0 && (
          <p className={`text-sm text-white/70 mt-1 ${getClass('menu')}`}>
            {t('profile.currentAge')}: {currentAge} {t('profile.yearsOld')}
          </p>
        )}
        <ErrorMessage error={errors.birthDate} />
      </div>

      {/* Phone Number */}
      <div>
        <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
          <Phone className="w-4 h-4 inline mr-2" />
          {t('profile.phoneNumber')} *
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
          placeholder={t('profile.phoneNumberPlaceholder')}
          disabled={isSubmitting}
        />
        <ErrorMessage error={errors.phoneNumber} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#AA4626] to-[#FCB283] hover:from-[#FCB283] hover:to-[#AA4626] disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed ${getClass('menu')}`}
      >
        {isSubmitting ? (
          <>
            <div className="loading-spinner"></div>
            <span>{t('common.saving')}</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>{t('common.save')}</span>
          </>
        )}
      </button>

      {/* Required Fields Note */}
      <p className={`text-sm text-white/60 text-center ${getClass('menu')}`}>
        * {t('common.requiredFields')}
      </p>
    </form>
  );
};

export default ProfileForm;
