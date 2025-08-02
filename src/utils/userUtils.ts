import { UserProfile } from '../types/profile.types';

/**
 * Utility functions for user-related operations
 */

/**
 * Check if a user is an admin (admin or super-admin)
 */
export const isAdminUser = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;
  return userProfile.role === 'admin' || userProfile.role === 'super-admin';
};

/**
 * Check if a user profile is complete based on actual field values
 * Admin users are always considered to have complete profiles
 */
export const isProfileComplete = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;
  
  // Admin users always have complete profiles
  if (isAdminUser(userProfile)) {
    return true;
  }
  
  // Check basic required fields
  const hasBasicFields = !!(
    userProfile.fullNameEN && 
    userProfile.fullNameEN.trim().length > 0 &&
    userProfile.email && 
    userProfile.email.trim().length > 0 &&
    userProfile.phoneNumber && 
    userProfile.phoneNumber.trim().length > 0
  );

  // Handle birthDate - support both Date and Firestore Timestamp
  let hasBirthDate = false;
  if (userProfile.birthDate) {
    if (userProfile.birthDate instanceof Date) {
      const year = userProfile.birthDate.getFullYear();
      hasBirthDate = year >= 1900 && year <= new Date().getFullYear();
    } else if (userProfile.birthDate.toDate && typeof userProfile.birthDate.toDate === 'function') {
      // Handle Firestore Timestamp
      const date = (userProfile.birthDate as any).toDate();
      const year = date.getFullYear();
      hasBirthDate = year >= 1900 && year <= new Date().getFullYear();
    }
  }

  return hasBasicFields && hasBirthDate;
};

/**
 * Get the appropriate redirect path after authentication based on user role
 */
export const getPostAuthRedirectPath = (userProfile: UserProfile | null, fallback: string = '#profile/edit'): string => {
  if (!userProfile) return fallback;
  
  if (isAdminUser(userProfile)) {
    return '#admin/dashboard';
  }
  
  return fallback;
};

/**
 * Check if a user should be redirected to profile setup
 */
export const shouldRedirectToProfileSetup = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;
  
  // Admin users NEVER need profile setup (double protection)
  if (isAdminUser(userProfile)) {
    console.log('shouldRedirectToProfileSetup: Admin user, never redirect to setup');
    return false;
  }
  
  // For regular users, trust database flag first
  if (userProfile.isProfileComplete === true) {
    const actuallyComplete = isProfileComplete(userProfile);
    console.log('shouldRedirectToProfileSetup: Database says complete, but field check result:', actuallyComplete);
    console.log('shouldRedirectToProfileSetup: Field validation result:', actuallyComplete);
    return !actuallyComplete;
  }
};

/**
 * Check if a user can access a protected route that requires profile completion
 */
export const canAccessProfileProtectedRoute = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;
  
  // Admin users can always access protected routes
  if (isAdminUser(userProfile)) {
    return true;
  }
  
  // Regular users need complete profiles (check actual fields)
  return isProfileComplete(userProfile);
};

/**
 * Check if user should be automatically redirected to admin zone
 */
export const shouldRedirectToAdminZone = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;
  
  // Only redirect verified admin users
  return isAdminUser(userProfile) && userProfile.emailVerified;
};
