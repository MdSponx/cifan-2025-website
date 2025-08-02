import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from './AuthContext';
import { isAdminUser, shouldRedirectToProfileSetup, getPostAuthRedirectPath } from '../../utils/userUtils';

interface AuthFlowContextType {
  currentStep: 'signup' | 'verify-email' | 'profile-setup' | 'complete';
  redirectIntent: string | null;
  setRedirectIntent: (intent: string) => void;
  handlePostSignIn: () => void;
  getNextStep: () => string;
  isFlowComplete: boolean;
}

const AuthFlowContext = createContext<AuthFlowContextType | undefined>(undefined);

export const useAuthFlow = () => {
  const context = useContext(AuthFlowContext);
  if (context === undefined) {
    throw new Error('useAuthFlow must be used within an AuthFlowProvider');
  }
  return context;
};

interface AuthFlowProviderProps {
  children: React.ReactNode;
}

export const AuthFlowProvider: React.FC<AuthFlowProviderProps> = ({ children }) => {
  const { user, userProfile, isEmailVerified } = useAuth();
  const [currentStep, setCurrentStep] = useState<'signup' | 'verify-email' | 'profile-setup' | 'complete'>('signup');
  const [redirectIntent, setRedirectIntentState] = useState<string | null>(null);

  // Load redirect intent from sessionStorage on mount
  useEffect(() => {
    const savedIntent = sessionStorage.getItem('redirectAfterAuth');
    if (savedIntent) {
      setRedirectIntentState(savedIntent);
    }
  }, []);

  // Determine current step based on user state
  useEffect(() => {
    if (!user) {
      setCurrentStep('signup');
    } else if (!isEmailVerified) {
      setCurrentStep('verify-email');
    } else if (shouldRedirectToProfileSetup(userProfile)) {
      setCurrentStep('profile-setup');
    } else {
      setCurrentStep('complete');
    }
  }, [user, isEmailVerified, userProfile]);

  const setRedirectIntent = (intent: string) => {
    setRedirectIntentState(intent);
    sessionStorage.setItem('redirectAfterAuth', intent);
  };

  const clearRedirectIntent = () => {
    setRedirectIntentState(null);
    sessionStorage.removeItem('redirectAfterAuth');
  };

  const handlePostSignIn = () => {
    if (!user) return;

    console.log('AuthFlowProvider: handlePostSignIn called', {
      user: user.email,
      isEmailVerified,
      userProfile: userProfile?.isProfileComplete,
      userRole: userProfile?.role,
      currentHash: window.location.hash
    });

    // Priority 1: Email verification
    if (!isEmailVerified) {
      console.log('AuthFlowProvider: Email not verified, staying on verification page');
      return;
    }

    // Priority 2: Admin users go directly to dashboard
    if (isAdminUser(userProfile)) {
      console.log('AuthFlowProvider: Admin user detected, navigating to admin dashboard');
      // Don't wait for AdminContext, go directly
      window.location.hash = '#admin/dashboard';
      clearRedirectIntent();
      return;
    }
    
    // Priority 3: Regular users follow existing logic
    if (userProfile && userProfile.isProfileComplete === true) {
      const intent = redirectIntent || getPostAuthRedirectPath(userProfile);
      clearRedirectIntent();
      window.location.hash = intent;
      return;
    }
    
    if (shouldRedirectToProfileSetup(userProfile)) {
      console.log('AuthFlowProvider: Regular user profile incomplete, redirecting to profile setup');
      window.location.hash = '#profile/setup';
      return;
    }
    
    const intent = redirectIntent || getPostAuthRedirectPath(userProfile);
    console.log('AuthFlowProvider: Regular user with complete profile, redirecting to:', intent);
    clearRedirectIntent();
    window.location.hash = intent;
  };


  const getNextStep = (): string => {
    switch (currentStep) {
      case 'signup':
        return '#auth/verify-email';
      case 'verify-email':
        // Admin users always go to admin dashboard after email verification
        if (isAdminUser(userProfile)) {
          return getPostAuthRedirectPath(userProfile);
        } else if (!shouldRedirectToProfileSetup(userProfile)) {
          return getPostAuthRedirectPath(userProfile);
        } else {
          return '#profile/setup';
        }
      case 'profile-setup':
        // Admin users should never reach profile setup, but if they do, go to admin dashboard
        if (isAdminUser(userProfile)) {
          return getPostAuthRedirectPath(userProfile);
        }
        return redirectIntent || getPostAuthRedirectPath(userProfile);
      default:
        // Default navigation based on user role
        return getPostAuthRedirectPath(userProfile, redirectIntent || '#profile/edit');
    }
  };

  const isFlowComplete = currentStep === 'complete';

  const value: AuthFlowContextType = {
    currentStep,
    redirectIntent,
    setRedirectIntent,
    handlePostSignIn,
    getNextStep,
    isFlowComplete
  };

  return (
    <AuthFlowContext.Provider value={value}>
      {children}
    </AuthFlowContext.Provider>
  );
};
