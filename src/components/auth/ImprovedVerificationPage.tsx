import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from './AuthContext';
import { useAuthFlow } from './AuthFlowProvider';
import { useImprovedEmailVerification } from '../../hooks/useImprovedEmailVerification';
import ProgressIndicator from '../ui/ProgressIndicator';
import SuccessAnimation from '../ui/SuccessAnimation';
import AnimatedButton from '../ui/AnimatedButton';
import { RefreshCw, Mail, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';

const ImprovedVerificationPage = () => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user } = useAuth();
  const { currentStep, handlePostSignIn } = useAuthFlow();
  const currentLanguage = i18n.language as 'en' | 'th';

  const {
    isVerified,
    isChecking,
    isResending,
    error,
    success,
    resendAttempts,
    cooldownRemaining,
    canResend,
    autoCheckEnabled,
    sendVerificationEmail,
    checkVerificationStatus,
    toggleAutoCheck,
    clearMessages
  } = useImprovedEmailVerification(user, currentLanguage);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasCheckedInitialStatus, setHasCheckedInitialStatus] = useState(false);

  // Check verification status immediately when component mounts
  // This handles the case when user clicks verification link in email
  useEffect(() => {
    const checkInitialStatus = async () => {
      if (user && !hasCheckedInitialStatus) {
        setHasCheckedInitialStatus(true);
        
        // Small delay to ensure auth state is settled
        setTimeout(async () => {
          const isCurrentlyVerified = await checkVerificationStatus();
          if (isCurrentlyVerified) {
            console.log('Email verification detected on page load, showing success animation');
          }
        }, 500);
      }
    };

    checkInitialStatus();
  }, [user, hasCheckedInitialStatus, checkVerificationStatus]);

  const content = {
    th: {
      pageTitle: "ยืนยันอีเมล",
      subtitle: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ",
      emailSentTo: "เราได้ส่งลิงก์ยืนยันไปยัง:",
      checkInbox: "กรุณาตรวจสอบกล่องจดหมายและคลิกลิงก์ยืนยันในอีเมล",
      checkSpam: "หากไม่พบอีเมล กรุณาตรวจสอบในโฟลเดอร์สแปม",
      resendEmail: "ส่งอีเมลยืนยันใหม่",
      resending: "กำลังส่ง...",
      resendIn: "ส่งใหม่ใน",
      seconds: "วินาที",
      checkStatus: "ตรวจสอบสถานะ",
      checking: "กำลังตรวจสอบ...",
      autoChecking: "ตรวจสอบอัตโนมัติ",
      manualCheck: "ตรวจสอบด้วยตนเอง",
      verified: "ยืนยันเรียบร้อย!",
      verifiedMessage: "อีเมลของคุณได้รับการยืนยันแล้ว กำลังเปลี่ยนหน้า...",
      redirecting: "กำลังเปลี่ยนหน้า...",
      attempts: "ครั้งที่",
      maxAttempts: "คุณได้ส่งอีเมลยืนยันครบจำนวนแล้ว",
      backToSignIn: "กลับไปเข้าสู่ระบบ",
      signOut: "ออกจากระบบ",
      tips: "เคล็ดลับ:",
      tip1: "ตรวจสอบโฟลเดอร์สแปมหรือขยะ",
      tip2: "เพิ่มอีเมลของเราในรายชื่อผู้ส่งที่ปลอดภัย",
      tip3: "ใช้เบราว์เซอร์เดียวกันที่สมัครสมาชิก"
    },
    en: {
      pageTitle: "Verify Your Email",
      subtitle: "Please check your email to verify your account",
      emailSentTo: "We've sent a verification link to:",
      checkInbox: "Please check your inbox and click the verification link in the email",
      checkSpam: "If you don't see the email, please check your spam folder",
      resendEmail: "Resend Verification Email",
      resending: "Sending...",
      resendIn: "Resend in",
      seconds: "seconds",
      checkStatus: "Check Status",
      checking: "Checking...",
      autoChecking: "Auto-checking",
      manualCheck: "Manual check",
      verified: "Verified!",
      verifiedMessage: "Your email has been verified. Redirecting...",
      redirecting: "Redirecting...",
      attempts: "Attempt",
      maxAttempts: "You've reached the maximum number of resend attempts",
      backToSignIn: "Back to Sign In",
      signOut: "Sign Out",
      tips: "Tips:",
      tip1: "Check your spam or junk folder",
      tip2: "Add our email to your safe sender list",
      tip3: "Use the same browser you signed up with"
    }
  };

  const currentContent = content[currentLanguage];

  // Show success animation when verified
  useEffect(() => {
    if (isVerified && !showSuccess && !isRedirecting) {
      setShowSuccess(true);
      setIsRedirecting(true);
    }
  }, [isVerified, showSuccess, isRedirecting]);

  // Clear messages after some time
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  const handleSignOut = async () => {
    try {
      const { authService } = await import('../../services/authService');
      await authService.signOut();
      window.location.hash = '#auth/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatCooldownTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}`;
  };

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

  return (
    <div className="min-h-screen bg-[#110D16] text-white">
      {/* Fixed Header with Progress */}
      <div className="sticky top-0 z-40 bg-[#110D16]/90 backdrop-blur-xl border-b border-white/10 pt-20 pb-4">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ProgressIndicator currentStep={currentStep} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
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

        {/* Main Content */}
        <div className="glass-container rounded-xl p-6 space-y-6">
          
          {/* Email Address Display */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <p className={`text-white/90 ${getClass('body')} mb-2`}>
              {currentContent.emailSentTo}
            </p>
            <p className={`text-[#FCB283] ${getClass('body')} font-medium text-lg break-all`}>
              {user.email}
            </p>
          </div>

          {/* Auto-Check Status */}
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  autoCheckEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className={`${getClass('body')} text-white/90 text-sm`}>
                  {autoCheckEnabled ? currentContent.autoChecking : currentContent.manualCheck}
                </span>
                {isChecking && (
                  <RefreshCw className="w-4 h-4 text-[#FCB283] animate-spin" />
                )}
              </div>
              <button
                onClick={toggleAutoCheck}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {autoCheckEnabled ? (
                  <Eye className="w-4 h-4 text-white/60" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/60" />
                )}
              </button>
            </div>
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
          {success && (
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-center animate-fade-in-up">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className={`text-green-300 ${getClass('body')} text-sm font-medium`}>
                  {success}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-center animate-fade-in-up">
              <p className={`text-red-300 ${getClass('body')} text-sm`}>
                ❌ {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Manual Check Button */}
            <button
              onClick={checkVerificationStatus}
              disabled={isChecking}
              className={`w-full px-6 py-3 glass-button-secondary rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getClass('menu')} flex items-center justify-center gap-2`}
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{currentContent.checking}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>{currentContent.checkStatus}</span>
                </>
              )}
            </button>

            {/* Resend Button */}
            <div className="relative">
              <button
                onClick={sendVerificationEmail}
                disabled={isResending || !canResend}
                className={`w-full px-6 py-3 bg-gradient-to-r from-[#AA4626] to-[#FCB283] text-white rounded-lg hover:from-[#FCB283] hover:to-[#AA4626] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getClass('menu')} flex items-center justify-center gap-2`}
              >
                {isResending ? (
                  <>
                    <div className="loading-spinner w-4 h-4"></div>
                    <span>{currentContent.resending}</span>
                  </>
                ) : cooldownRemaining > 0 ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>{currentContent.resendIn} {formatCooldownTime(cooldownRemaining)}</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>{currentContent.resendEmail}</span>
                  </>
                )}
              </button>
              
              {/* Attempt Counter */}
              {resendAttempts > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FCB283] rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{resendAttempts}</span>
                </div>
              )}
            </div>

            {/* Max Attempts Warning */}
            {resendAttempts >= 5 && (
              <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
                <p className={`text-yellow-300 ${getClass('body')} text-sm`}>
                  ⚠️ {currentContent.maxAttempts}
                </p>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="glass-card p-4 rounded-xl">
            <h3 className={`${getClass('subtitle')} text-white mb-3 text-sm font-medium`}>
              💡 {currentContent.tips}
            </h3>
            <ul className="space-y-2">
              <li className={`text-white/70 ${getClass('body')} text-xs flex items-start`}>
                <span className="text-[#FCB283] mr-2 flex-shrink-0">•</span>
                {currentContent.tip1}
              </li>
              <li className={`text-white/70 ${getClass('body')} text-xs flex items-start`}>
                <span className="text-[#FCB283] mr-2 flex-shrink-0">•</span>
                {currentContent.tip2}
              </li>
              <li className={`text-white/70 ${getClass('body')} text-xs flex items-start`}>
                <span className="text-[#FCB283] mr-2 flex-shrink-0">•</span>
                {currentContent.tip3}
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="text-center pt-4 border-t border-white/20 space-y-3">
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

      {/* Success Animation */}
      <SuccessAnimation
        show={showSuccess}
        title={currentContent.verified}
        message={currentContent.verifiedMessage}
        duration={2000}
        onComplete={() => {
          setShowSuccess(false);
          // For new users after email verification, go directly to profile setup
          console.log('Success animation completed, redirecting to profile setup...');
          window.location.hash = '#profile/setup';
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Redirecting Overlay */}
      {isRedirecting && !showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="glass-container rounded-2xl p-8 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className={`text-white ${getClass('body')}`}>
              {currentContent.redirecting}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedVerificationPage;