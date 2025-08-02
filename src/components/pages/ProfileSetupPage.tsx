import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { profileService } from '../../services/profileService';
import { ProfileFormData } from '../../types/profile.types';
import ProfileForm from '../profile/ProfileForm';
import { CheckCircle, User } from 'lucide-react';
import { isAdminUser } from '../../utils/userUtils';

const ProfileSetupPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getClass } = useTypography();
  const { userProfile, refreshUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect admin users away from profile setup
  React.useEffect(() => {
    if (isAdminUser(userProfile)) {
      console.log('ProfileSetupPage: Admin user detected, redirecting to admin dashboard');
      window.location.hash = '#admin/dashboard';
    }
  }, [userProfile]);

  // Add immediate redirect for users with complete profiles
  React.useEffect(() => {
    // If database says profile is complete, redirect immediately
    if (userProfile && userProfile.isProfileComplete === true && !isAdminUser(userProfile)) {
      console.log('ProfileSetupPage: Database indicates complete profile, redirecting to user zone');
      window.location.hash = '#profile/edit';
    }
  }, [userProfile]);

  // Don't render anything for admin users while redirecting
  if (isAdminUser(userProfile)) {
    return (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center px-4">
        <div className="glass-container rounded-2xl p-8 text-center max-w-md mx-auto">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render for users with complete profiles while redirecting
  if (userProfile && userProfile.isProfileComplete === true && !isAdminUser(userProfile)) {
    return (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center px-4">
        <div className="glass-container rounded-2xl p-8 text-center max-w-md mx-auto">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white">Redirecting to user zone...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: ProfileFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await profileService.createProfileFromForm(formData);
      await refreshUserProfile();
      setIsComplete(true);
      
      // Redirect to user zone profile page after a short delay
      setTimeout(() => {
        window.location.hash = '#profile/edit';
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }, 2000);
    } catch (error: any) {
      console.error('Profile setup error:', error);
      setError(error.message || t('profile.errors.setupFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center px-4">
        <div className="glass-container rounded-2xl p-8 text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className={`text-2xl ${getClass('header')} text-white mb-4`}>
            {t('profile.setupComplete')}
          </h2>
          <p className={`text-white/80 ${getClass('body')} mb-6`}>
            {t('profile.setupCompleteMessage')}
          </p>
          <div className="loading-spinner mx-auto"></div>
          <p className={`text-sm text-white/60 mt-2 ${getClass('menu')}`}>
            {t('profile.redirecting')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110D16] pt-24 pb-12">
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <h1 className={`text-3xl ${getClass('header')} text-white mb-2`}>
          {t('profile.setupTitle')}
        </h1>
        <p className={`text-white/80 text-lg ${getClass('subtitle')}`}>
          {t('profile.setupSubtitle')}
        </p>
      </div>

      {/* Emergency Fix for Stuck Users */}
      {userProfile && userProfile.isProfileComplete === true && (
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg max-w-2xl mx-auto">
          <p className="text-blue-300 text-sm mb-3">
            {t('profile.setupComplete')} - {currentLanguage === 'th' 
              ? 'ระบบตรวจพบว่าข้อมูลของคุณครบถ้วนแล้ว คลิกปุ่มด้านล่างเพื่อไปยัง User Zone'
              : 'System detected your profile is complete. Click below to go to User Zone'
            }
          </p>
          <button
            type="button"
            onClick={() => window.location.hash = '#profile/edit'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            {currentLanguage === 'th' ? 'ไปยัง User Zone' : 'Go to User Zone'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
          <p className={`text-red-400 text-center ${getClass('body')}`}>{error}</p>
        </div>
      )}

      {/* Profile Form - Full Width */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-container rounded-2xl p-6 sm:p-8">
          <ProfileForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 text-center max-w-2xl mx-auto px-4">
        <div className="glass-container rounded-xl p-6">
          <h3 className={`text-lg ${getClass('header')} text-white mb-3`}>
            {t('profile.whyProfileNeeded')}
          </h3>
          <ul className={`text-white/80 text-sm space-y-2 text-left max-w-md mx-auto ${getClass('body')}`}>
            <li className="flex items-start space-x-2">
              <span className="text-[#FCB283] mt-1">•</span>
              <span>{t('profile.reason1')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#FCB283] mt-1">•</span>
              <span>{t('profile.reason2')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#FCB283] mt-1">•</span>
              <span>{t('profile.reason3')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
