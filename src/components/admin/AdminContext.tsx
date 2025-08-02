import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../auth/AuthContext';
import { AdminContextType, AdminPermissions, AdminProfile } from '../../types/admin.types';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [permissions, setPermissions] = useState<AdminPermissions>({
    canViewDashboard: false,
    canViewApplications: false,
    canScoreApplications: false,
    canApproveApplications: false,
    canExportData: false,
    canManageUsers: false,
    canManageContent: false,
    canAccessSystemSettings: false,
    canGenerateReports: false,
    canFlagApplications: false,
    canDeleteApplications: false,
    canEditApplications: false
  });

  // Check admin status and load admin profile
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user || !isAuthenticated) {
        console.log('No user or not authenticated, setting admin to false');
        setIsAdmin(false);
        setAdminProfile(null);
        setPermissions({
          canViewDashboard: false,
          canViewApplications: false,
          canScoreApplications: false,
          canApproveApplications: false,
          canExportData: false,
          canManageUsers: false,
          canManageContent: false,
          canAccessSystemSettings: false,
          canGenerateReports: false,
          canFlagApplications: false,
          canDeleteApplications: false,
          canEditApplications: false
        });
        setIsLoading(false);
        return;
      }


      try {
        console.log('Checking admin status for user:', {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        });
        
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          console.log('Profile document found:', {
            role: profileData.role,
            fullNameEN: profileData.fullNameEN,
            isAdmin: profileData.role === 'admin' || profileData.role === 'super-admin'
          });
          
          if (profileData.role === 'admin' || profileData.role === 'super-admin') {
            console.log('User has admin role, setting up admin access');
            
            // CRITICAL: Set admin status IMMEDIATELY to prevent access denied
            setIsAdmin(true);
            setIsLoading(false); // Stop loading immediately
            
            const isProfileComplete = !!(profileData.fullNameEN && profileData.email);
            
            try {
              const adminDoc = await getDoc(doc(db, 'admins', user.uid));
              
              if (adminDoc.exists()) {
                const adminData = adminDoc.data() as AdminProfile;
                adminData.isProfileComplete = isProfileComplete;
                setAdminProfile(adminData);
                setPermissions(calculatePermissions(adminData));
              } else {
                // Create basic admin profile
                const basicAdminProfile: AdminProfile = {
                  uid: user.uid,
                  email: user.email!,
                  emailVerified: user.emailVerified,
                  photoURL: user.photoURL,
                  fullNameEN: profileData.fullNameEN || user.displayName || 'Admin User',
                  fullNameTH: profileData.fullNameTH,
                  birthDate: profileData.birthDate?.toDate() || new Date(),
                  age: profileData.age || 30,
                  phoneNumber: profileData.phoneNumber || '',
                  adminRole: profileData.role,
                  adminLevel: 'senior',
                  department: 'Festival Management',
                  responsibility: 'General Administration',
                  adminSince: new Date(),
                  permissions: [],
                  lastActiveAt: new Date(),
                  isProfileComplete: isProfileComplete,
                  createdAt: new Date(),
                  updatedAt: new Date()
                };
                
                setAdminProfile(basicAdminProfile);
                setPermissions(calculatePermissions(basicAdminProfile));
              }
            } catch (adminError) {
              console.log('Could not read detailed admin profile, creating fallback:', adminError);
              // Create fallback profile with full permissions
              const fallbackProfile: AdminProfile = {
                uid: user.uid,
                email: user.email!,
                emailVerified: user.emailVerified,
                photoURL: user.photoURL,
                fullNameEN: profileData.fullNameEN || 'Admin User',
                fullNameTH: profileData.fullNameTH,
                birthDate: profileData.birthDate?.toDate() || new Date(),
                age: profileData.age || 30,
                phoneNumber: profileData.phoneNumber || '',
                adminRole: profileData.role,
                adminLevel: 'senior',
                department: 'Festival Management',
                responsibility: 'General Administration',
                adminSince: new Date(),
                permissions: [],
                lastActiveAt: new Date(),
                isProfileComplete: isProfileComplete,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              
              setAdminProfile(fallbackProfile);
              setPermissions(calculatePermissions(fallbackProfile));
            }
          } else {
            setIsAdmin(false);
            setAdminProfile(null);
            setIsLoading(false);
          }
        } else {
          setIsAdmin(false);
          setAdminProfile(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setAdminProfile(null);
        setIsLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Admin check timeout, stopping loading');
      setIsLoading(false);
    }, 5000);

    checkAdminStatus().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, isAuthenticated]); // Remove user?.emailVerified dependency to prevent infinite loop

  // Calculate permissions based on admin role and level
  const calculatePermissions = (profile: AdminProfile): AdminPermissions => {
    const { adminRole, adminLevel } = profile;
    
    // Base permissions for all admins
    let perms: AdminPermissions = {
      canViewDashboard: true,
      canViewApplications: true,
      canScoreApplications: false,
      canApproveApplications: false,
      canExportData: false,
      canManageUsers: false,
      canManageContent: false,
      canAccessSystemSettings: false,
      canGenerateReports: false,
      canFlagApplications: false,
      canDeleteApplications: false,
      canEditApplications: false
    };

    // Role-based permissions
    switch (adminRole) {
      case 'super-admin':
        perms = {
          canViewDashboard: true,
          canViewApplications: true,
          canScoreApplications: true,
          canApproveApplications: true,
          canExportData: true,
          canManageUsers: true,
          canManageContent: true,
          canAccessSystemSettings: true,
          canGenerateReports: true,
          canFlagApplications: true,
          canDeleteApplications: true,
          canEditApplications: true
        };
        break;
        
      case 'admin':
        perms = {
          canViewDashboard: true,
          canViewApplications: true,
          canScoreApplications: true,
          canApproveApplications: adminLevel === 'director' || adminLevel === 'lead',
          canExportData: true,
          canManageUsers: adminLevel === 'director' || adminLevel === 'lead',
          canManageContent: adminLevel !== 'junior',
          canAccessSystemSettings: false,
          canGenerateReports: true,
          canFlagApplications: true,
          canDeleteApplications: adminLevel === 'director' || adminLevel === 'lead',
          canEditApplications: adminLevel !== 'junior'
        };
        break;
        
      case 'moderator':
        perms = {
          canViewDashboard: true,
          canViewApplications: true,
          canScoreApplications: adminLevel !== 'junior',
          canApproveApplications: false,
          canExportData: adminLevel !== 'junior',
          canManageUsers: false,
          canManageContent: false,
          canAccessSystemSettings: false,
          canGenerateReports: adminLevel !== 'junior',
          canFlagApplications: true,
          canDeleteApplications: false,
          canEditApplications: false
        };
        break;
    }

    return perms;
  };

  // Get admin level based on role and level
  const getAdminLevel = (): 'viewer' | 'scorer' | 'manager' | 'super' => {
    if (!adminProfile) return 'viewer';
    
    if (adminProfile.adminRole === 'super-admin') return 'super';
    if (adminProfile.adminRole === 'admin' && (adminProfile.adminLevel === 'director' || adminProfile.adminLevel === 'lead')) return 'manager';
    if (permissions.canScoreApplications) return 'scorer';
    return 'viewer';
  };

  // Check single permission
  const checkPermission = (permission: keyof AdminPermissions): boolean => {
    return permissions[permission] || false;
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (requiredPermissions: (keyof AdminPermissions)[]): boolean => {
    return requiredPermissions.some(permission => permissions[permission]);
  };

  // Refresh admin data
  const refreshAdminData = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data() as AdminProfile;
        setAdminProfile(adminData);
        setPermissions(calculatePermissions(adminData));
      }
    } catch (error) {
      console.error('Error refreshing admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AdminContextType = {
    isAdmin,
    isLoading,
    adminLevel: getAdminLevel(),
    permissions,
    adminProfile,
    checkPermission,
    hasAnyPermission,
    refreshAdminData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};