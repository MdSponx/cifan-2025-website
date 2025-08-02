import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { useAuthFlow } from '../components/auth/AuthFlowProvider';

interface EmailVerificationState {
  isVerified: boolean;
  isChecking: boolean;
  isResending: boolean;
  error: string | null;
  success: string | null;
  resendAttempts: number;
  lastResendTime: number;
  cooldownRemaining: number;
  canResend: boolean;
  autoCheckEnabled: boolean;
}

interface EmailVerificationActions {
  sendVerificationEmail: () => Promise<void>;
  checkVerificationStatus: () => Promise<boolean>;
  toggleAutoCheck: () => void;
  clearMessages: () => void;
}

export const useImprovedEmailVerification = (
  user: User | null,
  language: 'en' | 'th' = 'en'
): EmailVerificationState & EmailVerificationActions => {
  const { handlePostSignIn } = useAuthFlow();
  const autoCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<EmailVerificationState>({
    isVerified: user?.emailVerified || false,
    isChecking: false,
    isResending: false,
    error: null,
    success: null,
    resendAttempts: 0,
    lastResendTime: 0,
    cooldownRemaining: 0,
    canResend: true,
    autoCheckEnabled: true
  });

  // Update verification status when user changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isVerified: user?.emailVerified || false
    }));
  }, [user?.emailVerified]);

  // Auto-check verification status every 3 seconds
  useEffect(() => {
    if (state.autoCheckEnabled && user && !state.isVerified && !state.isChecking) {
      autoCheckIntervalRef.current = setInterval(() => {
        checkVerificationStatus();
      }, 3000);
    } else {
      if (autoCheckIntervalRef.current) {
        clearInterval(autoCheckIntervalRef.current);
        autoCheckIntervalRef.current = null;
      }
    }

    return () => {
      if (autoCheckIntervalRef.current) {
        clearInterval(autoCheckIntervalRef.current);
      }
    };
  }, [state.autoCheckEnabled, user, state.isVerified, state.isChecking]);

  // Cooldown timer
  useEffect(() => {
    if (state.lastResendTime > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - state.lastResendTime;
        const cooldownDuration = 60000; // 60 seconds
        const remaining = Math.max(0, Math.ceil((cooldownDuration - elapsed) / 1000));
        
        setState(prev => ({
          ...prev,
          cooldownRemaining: remaining,
          canResend: remaining === 0 && prev.resendAttempts < 5
        }));

        if (remaining === 0) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
        }
      }, 1000);
    }

    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [state.lastResendTime]);

  // Auto-redirect when verified
  useEffect(() => {
    if (state.isVerified && user) {
      // Stop auto-checking immediately when verified
      setState(prev => ({ ...prev, autoCheckEnabled: false }));
      
      // Redirect will be handled by SuccessAnimation onComplete
      console.log('Email verified, success animation will handle redirect');
    }
  }, [state.isVerified, user, handlePostSignIn]);

  const sendVerificationEmail = useCallback(async () => {
    if (!user || state.isResending || !state.canResend) return;

    setState(prev => ({
      ...prev,
      isResending: true,
      error: null,
      success: null
    }));

    try {
      await authService.sendEmailVerification();
      
      const now = Date.now();
      setState(prev => ({
        ...prev,
        isResending: false,
        success: language === 'th' 
          ? 'ส่งอีเมลยืนยันสำเร็จแล้ว กรุณาตรวจสอบกล่องจดหมาย'
          : 'Verification email sent successfully. Please check your inbox.',
        resendAttempts: prev.resendAttempts + 1,
        lastResendTime: now,
        canResend: false,
        cooldownRemaining: 60
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isResending: false,
        error: error.message || (language === 'th' 
          ? 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองใหม่อีกครั้ง'
          : 'Failed to send verification email. Please try again.')
      }));
    }
  }, [user, state.isResending, state.canResend, language]);

  const checkVerificationStatus = useCallback(async (): Promise<boolean> => {
    if (!user || state.isChecking) return false;

    setState(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      await authService.reloadUser();
      await user.reload();
      
      const isVerified = user.emailVerified;
      
      console.log('Email verification check result:', {
        email: user.email,
        isVerified,
        previousState: state.isVerified
      });
      
      setState(prev => ({
        ...prev,
        isChecking: false,
        isVerified,
        success: isVerified && !prev.isVerified && isVerified // Show success when newly verified
          ? (language === 'th' ? 'อีเมลได้รับการยืนยันเรียบร้อยแล้ว!' : 'Email verified successfully!')
          : prev.success, // Keep existing success message if already set
        autoCheckEnabled: !isVerified // Stop auto-checking when verified
      }));

      return isVerified;
    } catch (error: any) {
      console.error('Email verification check error:', error);
      setState(prev => ({
        ...prev,
        isChecking: false,
        error: language === 'th' 
          ? 'เกิดข้อผิดพลาดในการตรวจสอบ กรุณาลองใหม่อีกครั้ง'
          : 'Error checking verification status. Please try again.'
      }));
      return false;
    }
  }, [user, state.isChecking, language]);

  const toggleAutoCheck = useCallback(() => {
    setState(prev => ({
      ...prev,
      autoCheckEnabled: !prev.autoCheckEnabled
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      success: null
    }));
  }, []);

  return {
    ...state,
    sendVerificationEmail,
    checkVerificationStatus,
    toggleAutoCheck,
    clearMessages
  };
};