import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { 
  emailVerificationConfig, 
  getLocalizedErrorMessage, 
  isResendAllowed, 
  getRemainingCooldown 
} from '../config/emailVerification';

interface EmailVerificationState {
  isVerified: boolean;
  isLoading: boolean;
  isResending: boolean;
  isChecking: boolean;
  error: string | null;
  success: string | null;
  resendAttempts: number;
  lastResendTime: number;
  cooldownRemaining: number;
  canResend: boolean;
}

interface EmailVerificationActions {
  sendVerificationEmail: () => Promise<void>;
  checkVerificationStatus: () => Promise<boolean>;
  clearMessages: () => void;
  resetState: () => void;
}

export const useEmailVerification = (
  user: User | null,
  language: 'en' | 'th' = 'en'
): EmailVerificationState & EmailVerificationActions => {
  const [state, setState] = useState<EmailVerificationState>({
    isVerified: user?.emailVerified || false,
    isLoading: false,
    isResending: false,
    isChecking: false,
    error: null,
    success: null,
    resendAttempts: 0,
    lastResendTime: 0,
    cooldownRemaining: 0,
    canResend: true
  });

  // Update verification status when user changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isVerified: user?.emailVerified || false
    }));
  }, [user?.emailVerified]);

  // Cooldown timer
  useEffect(() => {
    if (state.lastResendTime > 0) {
      const interval = setInterval(() => {
        const remaining = getRemainingCooldown(state.lastResendTime);
        const canResend = isResendAllowed(state.lastResendTime);
        
        setState(prev => ({
          ...prev,
          cooldownRemaining: remaining,
          canResend: canResend && prev.resendAttempts < emailVerificationConfig.settings.maxResendAttempts
        }));

        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.lastResendTime]);

  // Send verification email
  const sendVerificationEmail = useCallback(async () => {
    if (!user || state.isResending) return;

    // Check if resend is allowed
    if (!state.canResend) {
      const errorCode = state.resendAttempts >= emailVerificationConfig.settings.maxResendAttempts 
        ? 'max-attempts-reached' 
        : 'cooldown-active';
      
      setState(prev => ({
        ...prev,
        error: getLocalizedErrorMessage(errorCode, language),
        success: null
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isResending: true,
      error: null,
      success: null
    }));

    console.log('Sending verification email to:', user.email);
    console.log('User domain:', user.email?.split('@')[1]);
    console.log('Attempt number:', state.resendAttempts + 1);
    try {
      await authService.sendEmailVerification();
      
      const now = Date.now();
      
      console.log('Email verification request completed successfully');
      
      setState(prev => ({
        ...prev,
        isResending: false,
        success: language === 'th' 
          ? 'ส่งอีเมลยืนยันสำเร็จแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ'
          : 'Verification email sent successfully. Please check your inbox.',
        resendAttempts: prev.resendAttempts + 1,
        lastResendTime: now,
        canResend: false,
        cooldownRemaining: emailVerificationConfig.settings.resendCooldown / 1000
      }));
    } catch (error: any) {
      console.error('Email verification failed:', {
        error: error.message,
        code: error.code,
        email: user.email,
        domain: user.email?.split('@')[1]
      });
      
      setState(prev => ({
        ...prev,
        isResending: false,
        error: getLocalizedErrorMessage(error.code, language)
      }));
    }
  }, [user, state.isResending, state.canResend, state.resendAttempts, language]);

  // Check verification status
  const checkVerificationStatus = useCallback(async (): Promise<boolean> => {
    if (!user || state.isChecking) return false;

    setState(prev => ({
      ...prev,
      isChecking: true,
      error: null
    }));

    try {
      await authService.reloadUser();
      await user.reload();
      
      const isVerified = user.emailVerified;
      
      setState(prev => ({
        ...prev,
        isChecking: false,
        isVerified,
        success: isVerified 
          ? (language === 'th' ? 'อีเมลได้รับการยืนยันเรียบร้อยแล้ว!' : 'Email verified successfully!')
          : null,
        error: !isVerified 
          ? (language === 'th' 
              ? 'อีเมลยังไม่ได้รับการยืนยัน กรุณาตรวจสอบอีเมลอีกครั้ง'
              : 'Email not yet verified. Please check your email again.')
          : null
      }));

      return isVerified;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isChecking: false,
        error: getLocalizedErrorMessage(error.code, language)
      }));
      return false;
    }
  }, [user, state.isChecking, language]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      success: null
    }));
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setState({
      isVerified: user?.emailVerified || false,
      isLoading: false,
      isResending: false,
      isChecking: false,
      error: null,
      success: null,
      resendAttempts: 0,
      lastResendTime: 0,
      cooldownRemaining: 0,
      canResend: true
    });
  }, [user?.emailVerified]);

  return {
    ...state,
    sendVerificationEmail,
    checkVerificationStatus,
    clearMessages,
    resetState
  };
};
