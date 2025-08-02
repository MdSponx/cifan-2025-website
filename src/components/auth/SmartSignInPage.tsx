import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuthFlow } from './AuthFlowProvider';
import { authService, AuthError } from '../../services/authService';
import { validateEmail } from '../../utils/formValidation';
import AnimatedButton from '../ui/AnimatedButton';
import ErrorMessage from '../forms/ErrorMessage';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const SmartSignInPage = () => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { handlePostSignIn, redirectIntent } = useAuthFlow();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Show redirect intent if available
  const [showRedirectIntent, setShowRedirectIntent] = useState(false);

  useEffect(() => {
    if (redirectIntent) {
      setShowRedirectIntent(true);
      const timer = setTimeout(() => setShowRedirectIntent(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [redirectIntent]);

  const content = {
    th: {
      pageTitle: "เข้าสู่ระบบ CIFAN 2025",
      subtitle: "เข้าสู่ระบบเพื่อจัดการผลงานและเข้าร่วมกิจกรรม",
      email: "อีเมล",
      password: "รหัสผ่าน",
      rememberMe: "จดจำการเข้าสู่ระบบ",
      signInButton: "เข้าสู่ระบบ",
      signingIn: "กำลังเข้าสู่ระบบ...",
      forgotPassword: "ลืมรหัสผ่าน?",
      noAccount: "ยังไม่มีบัญชี?",
      signUpLink: "สมัครสมาชิก",
      backToHome: "กลับหน้าหลัก",
      redirectNotice: "หลังจากเข้าสู่ระบบ คุณจะถูกนำไปยัง:",
      showPassword: "แสดงรหัสผ่าน",
      hidePassword: "ซ่อนรหัสผ่าน"
    },
    en: {
      pageTitle: "Sign In to CIFAN 2025",
      subtitle: "Access your account to manage submissions and participate in events",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      signInButton: "Sign In",
      signingIn: "Signing In...",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      signUpLink: "Sign Up",
      backToHome: "Back to Home",
      redirectNotice: "After signing in, you'll be taken to:",
      showPassword: "Show password",
      hidePassword: "Hide password"
    }
  };

  const currentContent = content[currentLanguage];

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.email.trim()) {
      errors.email = currentLanguage === 'th' ? 'กรุณากรอกอีเมล' : 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = currentLanguage === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = currentLanguage === 'th' ? 'กรุณากรอกรหัสผ่าน' : 'Password is required';
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      await authService.signIn(formData.email, formData.password);
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        // Use AuthFlowProvider to handle post-sign-in navigation
        // This ensures proper role-based redirection and profile completion checks
        handlePostSignIn();
      }, 500);
    } catch (error) {
      const authError = error as AuthError;
      setFormErrors({ submit: authError.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRedirectLabel = (intent: string) => {
    const labels: { [key: string]: { th: string; en: string } } = {
      '#submit-youth': { th: 'ส่งผลงานเยาวชน', en: 'Youth Submission' },
      '#submit-future': { th: 'ส่งผลงานอนาคต', en: 'Future Submission' },
      '#submit-world': { th: 'ส่งผลงานโลก', en: 'World Submission' },
      '#competition': { th: 'หน้าการประกวด', en: 'Competition Page' },
      '#my-applications': { th: 'ใบสมัครของฉัน', en: 'My Applications' }
    };
    return labels[intent]?.[currentLanguage] || intent;
  };

  return (
    <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Redirect Intent Notice */}
        {showRedirectIntent && redirectIntent && (
          <div className="mb-6 p-4 glass-card rounded-xl border-l-4 border-[#FCB283] animate-fade-in-up">
            <div className="flex items-start space-x-3">
              <span className="text-[#FCB283] text-lg flex-shrink-0">🎯</span>
              <div className="min-w-0">
                <h4 className={`${getClass('subtitle')} text-[#FCB283] mb-1 text-sm`}>
                  {currentContent.redirectNotice}
                </h4>
                <p className={`${getClass('body')} text-white/80 text-sm break-words`}>
                  {getRedirectLabel(redirectIntent)}
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="glass-container rounded-xl p-6 space-y-6">
          
          {/* Submit Error */}
          {formErrors.submit && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg animate-fade-in-up">
              <ErrorMessage error={formErrors.submit} />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className={`block text-white/90 ${getClass('body')} mb-2`}>
              {currentContent.email} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${formErrors.email ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none transition-colors ${getClass('body')}`}
                placeholder="your@email.com"
                required
              />
            </div>
            <ErrorMessage error={formErrors.email} />
          </div>

          {/* Password Field */}
          <div>
            <label className={`block text-white/90 ${getClass('body')} mb-2`}>
              {currentContent.password} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border ${formErrors.password ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none transition-colors ${getClass('body')}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                title={showPassword ? currentContent.hidePassword : currentContent.showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" />
                )}
              </button>
            </div>
            <ErrorMessage error={formErrors.password} />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#FCB283] bg-white/10 border-white/20 rounded focus:ring-[#FCB283] focus:ring-2"
              />
              <span className={`text-white/90 ${getClass('body')} text-sm`}>
                {currentContent.rememberMe}
              </span>
            </label>
            
            <button
              type="button"
              onClick={() => window.location.hash = '#auth/forgot-password'}
              className={`text-[#FCB283] hover:text-white transition-colors text-sm ${getClass('menu')}`}
            >
              {currentContent.forgotPassword}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-4 bg-gradient-to-r from-[#AA4626] to-[#FCB283] text-white rounded-lg hover:from-[#FCB283] hover:to-[#AA4626] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getClass('menu')} flex items-center justify-center gap-2 min-h-[48px]`}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner w-5 h-5"></div>
                <span>{currentContent.signingIn}</span>
              </>
            ) : (
              <>
                <span>🔑</span>
                <span>{currentContent.signInButton}</span>
              </>
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-white/20">
            <p className={`text-white/70 ${getClass('menu')} text-sm`}>
              {currentContent.noAccount}{' '}
              <button
                type="button"
                onClick={() => window.location.hash = '#auth/signup'}
                className="text-[#FCB283] hover:text-white transition-colors underline"
              >
                {currentContent.signUpLink}
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => window.location.hash = '#home'}
              className={`text-white/60 hover:text-white transition-colors text-sm ${getClass('menu')}`}
            >
              ← {currentContent.backToHome}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmartSignInPage;
