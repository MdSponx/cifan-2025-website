import { ActionCodeSettings } from 'firebase/auth';

/**
 * Email verification configuration for Firebase Auth
 */
export const emailVerificationConfig = {
  // Action code settings for email verification
  actionCodeSettings: {
    // URL to redirect to after email verification
    url: `${window.location.origin}/auth/verify-email`,
    // Handle the verification in the app
    handleCodeInApp: true,
  } as ActionCodeSettings,

  // Email verification settings
  settings: {
    // Resend cooldown period (in milliseconds)
    resendCooldown: 60000, // 1 minute
    
    // Maximum number of resend attempts per session
    maxResendAttempts: 5,
    
    // Auto-check verification status interval (in milliseconds)
    autoCheckInterval: 30000, // 30 seconds
    
    // Email verification timeout (in milliseconds)
    verificationTimeout: 300000, // 5 minutes
    
    // Debug mode for troubleshooting
    debugMode: true,
  },

  // Email templates and content
  templates: {
    en: {
      subject: 'Verify your email for CIFAN 2025',
      greeting: 'Welcome to CIFAN 2025!',
      instruction: 'Please click the link below to verify your email address:',
      footer: 'If you did not create an account, please ignore this email.',
      buttonText: 'Verify Email'
    },
    th: {
      subject: 'ยืนยันอีเมลสำหรับ CIFAN 2025',
      greeting: 'ยินดีต้อนรับสู่ CIFAN 2025!',
      instruction: 'กรุณาคลิกลิงก์ด้านล่างเพื่อยืนยันที่อยู่อีเมลของคุณ:',
      footer: 'หากคุณไม่ได้สร้างบัญชี กรุณาเพิกเฉยต่ออีเมลนี้',
      buttonText: 'ยืนยันอีเมล'
    }
  },

  // Error messages
  errorMessages: {
    en: {
      'auth/invalid-action-code': 'The verification link is invalid or has expired. Please request a new one.',
      'auth/expired-action-code': 'The verification link has expired. Please request a new one.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/too-many-requests': 'Too many verification attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection and try again.',
      'verification-timeout': 'Email verification timed out. Please try again.',
      'max-attempts-reached': 'Maximum verification attempts reached. Please try again later.',
      'cooldown-active': 'Please wait before requesting another verification email.',
      'email-send-failed': 'Failed to send verification email. Please check your email address and try again.',
      'domain-not-authorized': 'Email domain not authorized. Please contact support.',
      'quota-exceeded': 'Email sending quota exceeded. Please try again later.'
    },
    th: {
      'auth/invalid-action-code': 'ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่',
      'auth/expired-action-code': 'ลิงก์ยืนยันหมดอายุแล้ว กรุณาขอลิงก์ใหม่',
      'auth/user-disabled': 'บัญชีนี้ถูกปิดใช้งาน กรุณาติดต่อฝ่ายสนับสนุน',
      'auth/user-not-found': 'ไม่พบบัญชีที่ใช้อีเมลนี้',
      'auth/too-many-requests': 'ความพยายามยืนยันมากเกินไป กรุณาลองใหม่ภายหลัง',
      'auth/network-request-failed': 'ข้อผิดพลาดเครือข่าย กรุณาตรวจสอบการเชื่อมต่อและลองใหม่',
      'verification-timeout': 'การยืนยันอีเมลหมดเวลา กรุณาลองใหม่',
      'max-attempts-reached': 'ความพยายามยืนยันถึงขีดจำกัดแล้ว กรุณาลองใหม่ภายหลัง',
      'cooldown-active': 'กรุณารอก่อนขออีเมลยืนยันใหม่',
      'email-send-failed': 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาตรวจสอบที่อยู่อีเมลและลองใหม่',
      'domain-not-authorized': 'โดเมนอีเมลไม่ได้รับอนุญาต กรุณาติดต่อฝ่ายสนับสนุน',
      'quota-exceeded': 'เกินขีดจำกัดการส่งอีเมล กรุณาลองใหม่ภายหลัง'
    }
  }
};

/**
 * Get action code settings for email verification
 */
export const getEmailVerificationSettings = (continueUrl?: string): ActionCodeSettings => {
  // Ensure we use the correct domain for production
  const baseUrl = window.location.hostname === 'localhost' 
    ? `${window.location.origin}`
    : 'https://cifan-c41c6.web.app';
    
  const redirectUrl = continueUrl || `${baseUrl}/auth/verify-email`;
  
  console.log('Email verification settings:', {
    url: redirectUrl,
    handleCodeInApp: true,
    domain: window.location.hostname
  });
  
  return {
    url: redirectUrl,
    handleCodeInApp: emailVerificationConfig.actionCodeSettings.handleCodeInApp,
  };
};

/**
 * Get localized error message
 */
export const getLocalizedErrorMessage = (
  errorCode: string, 
  language: 'en' | 'th' = 'en'
): string => {
  const messages = emailVerificationConfig.errorMessages[language];
  return messages[errorCode as keyof typeof messages] || 
         (language === 'th' ? 'เกิดข้อผิดพลาดที่ไม่คาดคิด' : 'An unexpected error occurred');
};

/**
 * Check if resend is allowed based on cooldown
 */
export const isResendAllowed = (lastResendTime: number): boolean => {
  const now = Date.now();
  return (now - lastResendTime) >= emailVerificationConfig.settings.resendCooldown;
};

/**
 * Get remaining cooldown time in seconds
 */
export const getRemainingCooldown = (lastResendTime: number): number => {
  const now = Date.now();
  const elapsed = now - lastResendTime;
  const remaining = emailVerificationConfig.settings.resendCooldown - elapsed;
  return Math.max(0, Math.ceil(remaining / 1000));
};
