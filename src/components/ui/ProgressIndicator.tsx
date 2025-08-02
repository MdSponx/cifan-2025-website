import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: string;
  status: 'completed' | 'active' | 'pending';
}

interface ProgressIndicatorProps {
  currentStep: 'signup' | 'verify-email' | 'profile-setup' | 'complete';
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  className = ''
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      signUp: "สมัครสมาชิก",
      verifyEmail: "ยืนยันอีเมล",
      completeProfile: "กรอกข้อมูล",
      complete: "เสร็จสิ้น"
    },
    en: {
      signUp: "Sign Up",
      verifyEmail: "Verify Email",
      completeProfile: "Complete Profile",
      complete: "Complete"
    }
  };

  const currentContent = content[currentLanguage];

  const getStepStatus = (stepId: string): 'completed' | 'active' | 'pending' => {
    const stepOrder = ['signup', 'verify-email', 'profile-setup', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const steps: Step[] = [
    {
      id: 'signup',
      label: currentContent.signUp,
      icon: '📝',
      status: getStepStatus('signup')
    },
    {
      id: 'verify-email',
      label: currentContent.verifyEmail,
      icon: '📧',
      status: getStepStatus('verify-email')
    },
    {
      id: 'profile-setup',
      label: currentContent.completeProfile,
      icon: '👤',
      status: getStepStatus('profile-setup')
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'active':
        return <Clock className="w-5 h-5 text-[#FCB283]" />;
      default:
        return <Circle className="w-5 h-5 text-white/40" />;
    }
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'active':
        return 'bg-[#FCB283]/20 border-[#FCB283]/50 text-[#FCB283]';
      default:
        return 'bg-white/5 border-white/20 text-white/60';
    }
  };

  const getConnectorClasses = (index: number) => {
    const nextStep = steps[index + 1];
    if (!nextStep) return '';
    
    if (nextStep.status === 'completed' || (nextStep.status === 'active' && steps[index].status === 'completed')) {
      return 'bg-green-400';
    }
    if (nextStep.status === 'active') {
      return 'bg-gradient-to-r from-green-400 to-[#FCB283]';
    }
    return 'bg-white/20';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Layout - Vertical */}
      <div className="block sm:hidden">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-300 ${getStepClasses(step.status)}`}>
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{step.icon}</span>
                    <span className={`${getClass('body')} font-medium truncate`}>
                      {step.label}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Vertical Connector */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className={`w-1 h-6 rounded-full transition-all duration-500 ${getConnectorClasses(index)}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2 flex-1">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepClasses(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>
                <div className="text-center">
                  <div className="text-xl mb-1">{step.icon}</div>
                  <span className={`${getClass('body')} text-sm font-medium`}>
                    {step.label}
                  </span>
                </div>
              </div>
              
              {/* Horizontal Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-1 rounded-full transition-all duration-500 ${getConnectorClasses(index)}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;