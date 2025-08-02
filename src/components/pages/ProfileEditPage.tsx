import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { profileService } from '../../services/profileService';
import { ProfileFormData } from '../../types/profile.types';
import ProfileForm from '../profile/ProfileForm';
import UserZoneHeader from '../layout/UserZoneHeader';
import { CheckCircle } from 'lucide-react';

interface ProfileEditPageProps {
  onSidebarToggle?: () => void;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ onSidebarToggle }) => {
  const { t } = useTranslation();
  const { getClass } = useTypography();
  const { userProfile, refreshUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (formData: ProfileFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await profileService.updateProfileFromForm(formData);
      await refreshUserProfile();
      setIsComplete(true);
      
      // Reset success state after a delay
      setTimeout(() => {
        setIsComplete(false);
      }, 3000);
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || t('profile.errors.updateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitialData = (): Partial<ProfileFormData> => {
    if (!userProfile) return {};
    
    return {
      fullNameEN: userProfile.fullNameEN || '',
      fullNameTH: userProfile.fullNameTH || '',
      birthDate: userProfile.birthDate ? userProfile.birthDate.toISOString().split('T')[0] : '',
      phoneNumber: userProfile.phoneNumber || ''
    };
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* User Zone Header */}
      <UserZoneHeader
        title={t('profile.editTitle')}
        subtitle={t('profile.editSubtitle')}
        onSidebarToggle={onSidebarToggle || (() => {})}
      />

      {/* Success Message */}
      {isComplete && (
        <div className="glass-container rounded-xl p-6 border-l-4 border-green-400 w-full">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h3 className={`${getClass('subtitle')} text-green-400 mb-1`}>
                {t('profile.updateComplete')}
              </h3>
              <p className={`text-sm ${getClass('body')} text-white/80`}>
                {t('profile.updateCompleteMessage')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="glass-container rounded-xl p-6 border-l-4 border-red-400 w-full">
          <div className="flex items-center space-x-3">
            <span className="text-red-400 text-xl">❌</span>
            <div>
              <h3 className={`${getClass('subtitle')} text-red-400 mb-1`}>
                Update Error
              </h3>
              <p className={`text-sm ${getClass('body')} text-white/80`}>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Profile Info */}
      {userProfile && (
        <div className="glass-container rounded-xl p-6 w-full">
          <h3 className={`text-lg ${getClass('header')} text-white mb-4`}>
            {t('profile.currentInfo')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className={`${getClass('body')} text-white/60`}>
                {t('profile.fullNameEN')}:
              </span>
              <p className={`${getClass('body')} text-white`}>
                {userProfile.fullNameEN}
              </p>
            </div>
            {userProfile.fullNameTH && (
              <div>
                <span className={`${getClass('body')} text-white/60`}>
                  {t('profile.fullNameTH')}:
                </span>
                <p className={`${getClass('body')} text-white`}>
                  {userProfile.fullNameTH}
                </p>
              </div>
            )}
            <div>
              <span className={`${getClass('body')} text-white/60`}>
                {t('profile.age')}:
              </span>
              <p className={`${getClass('body')} text-white`}>
                {userProfile.age} {t('profile.yearsOld')}
              </p>
            </div>
            <div>
              <span className={`${getClass('body')} text-white/60`}>
                {t('profile.phoneNumber')}:
              </span>
              <p className={`${getClass('body')} text-white`}>
                {userProfile.phoneNumber}
              </p>
            </div>
            <div>
              <span className={`${getClass('body')} text-white/60`}>
                {t('profile.email')}:
              </span>
              <p className={`${getClass('body')} text-white`}>
                {userProfile.email}
              </p>
            </div>
            <div>
              <span className={`${getClass('body')} text-white/60`}>
                {t('profile.lastUpdated')}:
              </span>
              <p className={`${getClass('body')} text-white`}>
                {userProfile.updatedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="glass-container rounded-xl p-6 sm:p-8 w-full">
        <ProfileForm
          initialData={getInitialData()}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ProfileEditPage;
