import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { authService, AuthError } from '../../services/authService';
import { User } from 'firebase/auth';
import AnimatedButton from '../ui/AnimatedButton';

const VerifyEmailPage = () => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [user, setUser] = useState<User | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string>('');
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  const content = {
    th: {
      pageTitle: "ยืนยันอีเมล",
      subtitle: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ",
      emailSentTo: "เราได้ส่งลิงก์ยืนยันไปยัง:",
      checkInbox: "กรุณาตรวจสอบกล่องจดหมายและคลิกลิงก์ยืนยันในอีเมล",
      checkSpam: "หากไม่พบอีเมล กรุณาตรวจสอบในโฟลเดอร์สแปม",
      resendEmail: "ส่งอีเมลยืนยันใหม่",
      resending: "กำลังส่ง...",
      resendSuccess: "ส่งอีเมลยืนยันใหม่แล้ว",
      checkVerification: "ตรวจสอบสถานะการยืนยัน",
      checking: "กำลังตรวจสอบ...",
      alreadyVerified: "อีเมลได้รับการยืนยันแล้ว",
      continueToApp: "เข้าสู่แอปพลิเคชัน",
      backToSignIn: "กลับไปเข้าสู่ระบบ",
      signOut: "ออกจากระบบ"
    },
    en: {
      pageTitle: "Verify Your Email",
      subtitle: "Please check your email to verify your account",
      emailSentTo: "We've sent a verification link to:",
      checkInbox: "Please check your inbox and click the verification link in the email",
      checkSpam: "If you don't see the email, please check your spam folder",
      resendEmail: "Resend Verification Email",
      resending: "Sending...",
      resendSuccess: "Verification email sent successfully",
      checkVerification: "Check Verification Status",
      checking: "Checking...",
      alreadyVerified: "Email is already verified",
      continueToApp: "Continue to App",
      backToSignIn: "Back to Sign In",
      signOut: "Sign Out"
    }
  };

  const currentContent = content[currentLanguage];

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleResendEmail = async () => {
    if (!user) return;

    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    console.log('Manual resend attempt for:', user.email);
    try {
      await authService.sendEmailVerification();
      setResendSuccess(true);
      console.log('Manual resend successful');
    } catch (error) {
      const authError = error as AuthError;
      console.error('Manual resend failed:', authError);
      setResendError(authError.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;

    setIsCheckingVerification(true);
    setResendError('');

    console.log('Checking verification status for:', user.email);
    try {
      // Reload user to get latest verification status
      await authService.reloadUser();
      await user.reload();
      
      console.log('Current verification status:', user.emailVerified);
      
      if (user.emailVerified) {
        // Update user profile in Firestore to reflect verification status
        await authService.getCurrentUserProfile();
        
        // Show success message briefly before redirect
        setResendSuccess(false);
        setResendError('');
        
        // Redirect to profile setup or home
        const hasProfile = await authService.getCurrentUserProfile();
        if (hasProfile?.profile) {
          window.location.hash = '#home';
        } else {
          window.location.hash = '#profile/setup';
        }
        
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        console.log('Email still not verified');
        setResendError(currentLanguage === 'th' 
          ? 'อีเมลยังไม่ได้รับการยืนยัน กรุณาตรวจสอบอีเมลอีกครั้ง หรือส่งอีเมลยืนยันใหม่'
          : 'Email not yet verified. Please check your email again or request a new verification email.'
        );
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      setResendError(currentLanguage === 'th' 
        ? 'เกิดข้อผิดพลาดในการตรวจสอบ กรุณาลองใหม่อีกครั้ง'
        : 'Error checking verification status. Please try again.'
      );
    } finally {
      setIsCheckingVerification(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      window.location.hash = '#auth/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center">
        <div className="glass-container rounded-2xl p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show already verified message
  if (user.emailVerified) {
    return (
      <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20 flex items-center justify-center">
        <div className="glass-container rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-4">
          <div className="text-6xl mb-6">✅</div>
          <h2 className={`text-2xl sm:text-3xl ${getClass('header')} mb-4 text-white`}>
            {currentContent.alreadyVerified}
          </h2>
          <p className={`text-white/80 ${getClass('body')} mb-6`}>
            {user.email}
          </p>
          <AnimatedButton 
            variant="primary" 
            size="medium" 
            icon="🚀"
            onClick={() => {
              window.location.hash = '#home';
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            className={`w-full px-6 py-3 bg-gradient-to-r from-[#AA4626] to-[#FCB283] text-white rounded-lg hover:from-[#FCB283] hover:to-[#AA4626] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getClass('menu')} flex items-center justify-center gap-2`}
          >
            {currentContent.continueToApp}
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2Flogoooo%404x.png?alt=media&token=fc82d494-6be2-4218-a7d9-3b63213180b9"
              alt="CIFAN Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className={`text-2xl sm:text-3xl ${getClass('header')} mb-2 text-white`}>
            {currentContent.pageTitle}
          </h1>
          <p className={`text-white/80 ${getClass('subtitle')}`}>
            {currentContent.subtitle}
          </p>
        </div>

        {/* Verification Instructions */}
        <div className="glass-container rounded-xl p-6 space-y-6">
          
          {/* Email Address */}
          <div className="text-center">
            <div className="text-4xl mb-4">📧</div>
            <p className={`text-white/90 ${getClass('body')} mb-2`}>
              {currentContent.emailSentTo}
            </p>
            <p className={`text-cifan-peach ${getClass('body')} font-medium`}>
              {user.email}
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <p className={`text-white/80 ${getClass('body')} text-sm text-center`}>
              {currentContent.checkInbox}
            </p>
            <p className={`text-white/60 ${getClass('menu')} text-xs text-center`}>
              {currentContent.checkSpam}
            </p>
          </div>

          {/* Success/Error Messages */}
          {resendSuccess && (
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
              <p className={`text-green-300 ${getClass('body')} text-sm`}>
                ✅ {currentContent.resendSuccess}
              </p>
            </div>
          )}

          {resendError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
              <p className={`text-red-300 ${getClass('body')} text-sm`}>
                ❌ {resendError}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className={`w-full px-6 py-3 bg-gradient-to-r from-cifan-orange to-cifan-peach text-white rounded-lg hover:from-cifan-peach hover:to-cifan-orange transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getClass('menu')} flex items-center justify-center gap-2`}
            >
              <span>📧</span>
              {isResending ? currentContent.resending : currentContent.resendEmail}
            </button>

            <button
              onClick={handleCheckVerification}
              disabled={isCheckingVerification}
              className={`w-full px-6 py-3 glass-button-secondary rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getClass('menu')} flex items-center justify-center gap-2`}
            >
              <span>🔍</span>
              {isCheckingVerification ? currentContent.checking : currentContent.checkVerification}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="text-center pt-4 border-t border-white/20 space-y-2">
            <button
              onClick={() => window.location.hash = '#auth/signin'}
              className={`block w-full text-[#FCB283] hover:text-white transition-colors text-sm ${getClass('menu')}`}
            >
              ← {currentContent.backToSignIn}
            </button>
            
            <button
              onClick={handleSignOut}
              className={`block w-full text-white/60 hover:text-white transition-colors text-sm ${getClass('menu')}`}
            >
              {currentContent.signOut}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
