import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuthFlow } from './AuthFlowProvider';
import { authService, AuthError } from '../../services/authService';
import { validateEmail } from '../../utils/formValidation';
import AnimatedButton from '../ui/AnimatedButton';
import ErrorMessage from '../forms/ErrorMessage';
import ProgressIndicator from '../ui/ProgressIndicator';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const SmartSignUpPage = () => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { currentStep, redirectIntent } = useAuthFlow();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const content = {
    th: {
      pageTitle: "สมัครสมาชิก CIFAN 2025",
      subtitle: "สร้างบัญชีเพื่อส่งผลงานและเข้าร่วมกิจกรรม",
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      email: "อีเมล",
      password: "รหัสผ่าน",
      confirmPassword: "ยืนยันรหัสผ่าน",
      agreeToTerms: `ฉันยอมรับ <a href="#terms-conditions" target="_blank" class="text-[#FCB283] hover:underline">เงื่อนไขการใช้งาน</a> และ <a href="#privacy-policy" target="_blank" class="text-[#FCB283] hover:underline">นโยบายความเป็นส่วนตัว</a>`,
      signUpButton: "สมัครสมาชิก",
      signingUp: "กำลังสมัครสมาชิก...",
      alreadyHaveAccount: "มีบัญชีอยู่แล้ว?",
      signInLink: "เข้าสู่ระบบ",
      successTitle: "สมัครสมาชิกสำเร็จ!",
      successMessage: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ",
      backToHome: "กลับหน้าหลัก",
      passwordRequirements: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      showPassword: "แสดงรหัสผ่าน",
      hidePassword: "ซ่อนรหัสผ่าน",
      nextStep: "ขั้นตอนต่อไป: ยืนยันอีเมล"
    },
    en: {
      pageTitle: "Join CIFAN 2025",
      subtitle: "Create an account to submit films and participate in events",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      agreeToTerms: `I agree to the <a href="#terms-conditions" target="_blank" class="text-[#FCB283] hover:underline">Terms & Conditions</a> and <a href="#privacy-policy" target="_blank" class="text-[#FCB283] hover:underline">Privacy Policy</a>`,
      signUpButton: "Create Account",
      signingUp: "Creating Account...",
      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign In",
      successTitle: "Registration Successful!",
      successMessage: "Please check your email to verify your account",
      backToHome: "Back to Home",
      passwordRequirements: "Password must be at least 6 characters",
      showPassword: "Show password",
      hidePassword: "Hide password",
      nextStep: "Next step: Verify Email"
    }
  };

  const currentContent = content[currentLanguage];

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = currentLanguage === 'th' ? 'กรุณากรอกชื่อ' : 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = currentLanguage === 'th' ? 'กรุณากรอกนามสกุล' : 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = currentLanguage === 'th' ? 'กรุณากรอกอีเมล' : 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = currentLanguage === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = currentLanguage === 'th' ? 'กรุณากรอกรหัสผ่าน' : 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = currentLanguage === 'th' ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' : 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = currentLanguage === 'th' ? 'กรุณายืนยันรหัสผ่าน' : 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = currentLanguage === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = currentLanguage === 'th' ? 'กรุณายอมรับเงื่อนไขการใช้งาน' : 'Please agree to the terms and conditions';
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
      const displayName = `${formData.firstName} ${formData.lastName}`;
      await authService.signUp(formData.email, formData.password, displayName);
      setSubmitSuccess(true);
      
      // Scroll to top when showing success page
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      const authError = error as AuthError;
      setFormErrors({ submit: authError.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success page
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#110D16] text-white">
        {/* Progress Header */}
        <div className="sticky top-0 z-40 bg-[#110D16]/90 backdrop-blur-xl border-b border-white/10 pt-20 pb-4">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <ProgressIndicator currentStep="verify-email" />
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
          <div className="glass-container rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto animate-fade-in-up">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className={`text-2xl sm:text-3xl ${getClass('header')} mb-4 text-white`}>
              {currentContent.successTitle}
            </h2>
            <p className={`text-white/80 ${getClass('body')} mb-6`}>
              {currentContent.successMessage}
            </p>
            
            {/* Next Step Indicator */}
            <div className="glass-card p-4 rounded-xl mb-6">
              <p className={`text-[#FCB283] ${getClass('subtitle')} text-sm mb-2`}>
                {currentContent.nextStep}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className={`text-white/80 ${getClass('body')} text-sm`}>
                  {formData.email}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton 
                variant="primary" 
                size="medium" 
                icon="📧"
                onClick={() => {
                  window.location.hash = '#auth/verify-email';
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                {currentLanguage === 'th' ? 'ยืนยันอีเมล' : 'Verify Email'}
              </AnimatedButton>
              <AnimatedButton 
                variant="outline" 
                size="medium" 
                icon="🏠"
                onClick={() => window.location.hash = '#home'}
              >
                {currentContent.backToHome}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110D16] text-white">
      {/* Progress Header */}
      <div className="sticky top-0 z-40 bg-[#110D16]/90 backdrop-blur-xl border-b border-white/10 pt-20 pb-4">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ProgressIndicator currentStep={currentStep} />
        </div>
      </div>

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

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="glass-container rounded-xl p-6 space-y-6">
          
          {/* Submit Error */}
          {formErrors.submit && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg animate-fade-in-up">
              <ErrorMessage error={formErrors.submit} />
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentContent.firstName} <span className="text-red-400">*</span>
                <span className="text-white/60 text-xs block mt-1">
                  {currentLanguage === 'th' ? 'เป็นภาษาอังกฤษ' : 'In English'}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${formErrors.firstName ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none transition-colors ${getClass('body')}`}
                  required
                  placeholder="John"
                />
              </div>
              <ErrorMessage error={formErrors.firstName} />
            </div>
            
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentContent.lastName} <span className="text-red-400">*</span>
                <span className="text-white/60 text-xs block mt-1">
                  {currentLanguage === 'th' ? 'เป็นภาษาอังกฤษ' : 'In English'}
                </span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${formErrors.lastName ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none transition-colors ${getClass('body')}`}
                required
                placeholder="Smith"
              />
              <ErrorMessage error={formErrors.lastName} />
            </div>
          </div>

          {/* Name Suggestion */}
          <div className="glass-card p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
            <div className="flex items-start space-x-2">
              <div className="text-blue-400 text-sm mt-0.5">💡</div>
              <p className={`text-blue-300 ${getClass('menu')} text-sm leading-relaxed`}>
                {currentLanguage === 'th' 
                  ? 'แนะนำ: กรุณากรอกชื่อและนามสกุลเป็นภาษาอังกฤษ เพื่อความสะดวกในการออกใบประกาศนียบัตรและเอกสารทางการ'
                  : 'Suggestion: Please fill in your first name and last name in English for certificate and official document purposes'
                }
              </p>
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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
            <small className={`text-white/60 text-xs mt-1 block ${getClass('menu')}`}>
              {currentContent.passwordRequirements}
            </small>
            <ErrorMessage error={formErrors.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-white/90 ${getClass('body')} mb-2`}>
              {currentContent.confirmPassword} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border ${formErrors.confirmPassword ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none transition-colors ${getClass('body')}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                title={showConfirmPassword ? currentContent.hidePassword : currentContent.showPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" />
                )}
              </button>
            </div>
            <ErrorMessage error={formErrors.confirmPassword} />
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-[#FCB283] bg-white/10 border-white/20 rounded focus:ring-[#FCB283] focus:ring-2"
                required
              />
              <span 
                className={`text-white/90 ${getClass('menu')} text-sm leading-relaxed`}
                dangerouslySetInnerHTML={{ 
                  __html: `${currentContent.agreeToTerms} <span class="text-red-400">*</span>` 
                }}
              />
            </label>
            <ErrorMessage error={formErrors.agreeToTerms} />
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
                <span>{currentContent.signingUp}</span>
              </>
            ) : (
              <>
                <span>👤</span>
                <span>{currentContent.signUpButton}</span>
              </>
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-white/20">
            <p className={`text-white/70 ${getClass('menu')} text-sm`}>
              {currentContent.alreadyHaveAccount}{' '}
              <button
                type="button"
                onClick={() => window.location.hash = '#auth/signin'}
                className="text-[#FCB283] hover:text-white transition-colors underline"
              >
                {currentContent.signInLink}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmartSignUpPage;
