import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import { UserProfile } from '../../types/profile.types';
import { isAdminUser, shouldRedirectToProfileSetup, getPostAuthRedirectPath } from '../../utils/userUtils';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore (this will auto-fix completion status)
        const profile = await profileService.getProfile(user.uid);
        setUserProfile(profile);
        
        // If email verification status changed, update profile in Firestore
        if (profile && profile.emailVerified !== user.emailVerified) {
          try {
            await profileService.updateProfile({
              emailVerified: user.emailVerified
            });
            // Refresh profile after update
            const updatedProfile = await profileService.getProfile(user.uid);
            setUserProfile(updatedProfile);
          } catch (error) {
            console.error('Error updating email verification status:', error);
          }
        }
      } else {
        setUserProfile(null);
        setHasNavigated(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle automatic navigation after authentication
  useEffect(() => {
    if (user && userProfile && !loading && !hasNavigated) {
      setHasNavigated(true);
      
      // Check if we're on an auth page and need to redirect
      const currentHash = window.location.hash;
      const isOnAuthPage = currentHash.includes('#auth/') || currentHash === '#profile/setup';
      
      if (isOnAuthPage) {
        // Small delay to ensure all state is settled
        setTimeout(() => {
          console.log('=== AuthContext Navigation ===');
          console.log('User:', user.email);
          console.log('UserProfile role:', userProfile.role);
          
          // Check email verification first
          if (!user.emailVerified) {
            console.log('AuthContext: Email not verified, redirecting to verification');
            window.location.hash = '#auth/verify-email';
            return;
          }
          
          // Admin users ALWAYS go to admin dashboard immediately
          if (isAdminUser(userProfile)) {
            console.log('AuthContext: Admin user detected, navigating to admin dashboard');
            window.location.hash = getPostAuthRedirectPath(userProfile);
            return;
          }
          
          // For regular users, prioritize database flag
          if (userProfile.isProfileComplete === true) {
            console.log('AuthContext: Database says profile complete, redirecting to user zone');
            window.location.hash = getPostAuthRedirectPath(userProfile); // '#profile/edit'
            return;
          }
          
          // Check if profile needs completion (only for non-admin users)
          if (shouldRedirectToProfileSetup(userProfile)) {
            console.log('AuthContext: Profile incomplete, redirecting to profile setup');
            window.location.hash = '#profile/setup';
            return;
          }
          
          // Default to user zone
          console.log('AuthContext: Default redirect to user zone');
          window.location.hash = getPostAuthRedirectPath(userProfile);
        }, 150); // Slightly longer delay to allow AdminContext to initialize
      }
    }
  }, [user, userProfile, loading, hasNavigated]);
  const refreshUserProfile = async () => {
    if (user) {
      const profile = await profileService.getProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false,
    signOut,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
