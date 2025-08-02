import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { useAdmin } from './AdminContext';
import { AdminProtectedRouteProps } from '../../types/admin.types';
import { Shield, AlertTriangle, Lock } from 'lucide-react';

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  fallback,
  onUnauthorized
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user, userProfile } = useAuth();
  const { isAdmin, isLoading, permissions, checkPermission, hasAnyPermission } = useAdmin();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      loading: "กำลังตรวจสอบสิทธิ์...",
      accessDenied: "ไม่มีสิทธิ์เข้าถึง",
      adminRequired: "จำเป็นต้องมีสิทธิ์ผู้ดูแลระบบ",
      insufficientPermissions: "สิทธิ์ไม่เพียงพอ",
      contactAdmin: "กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์เข้าถึง",
      backToHome: "กลับหน้าหลัก",
      requestAccess: "ขอสิทธิ์เข้าถึง"
    },
    en: {
      loading: "Checking permissions...",
      accessDenied: "Access Denied",
      adminRequired: "Admin privileges required",
      insufficientPermissions: "Insufficient permissions",
      contactAdmin: "Please contact an administrator to request access",
      backToHome: "Back to Home",
      requestAccess: "Request Access"
    }
  };

  const currentContent = content[currentLanguage];

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center">
        <div className="glass-container rounded-2xl p-8 text-center max-w-md mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCB283] mx-auto mb-4"></div>
          <h2 className={`text-xl ${getClass('header')} text-white mb-2`}>
            {currentContent.loading}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <Shield className="w-4 h-4" />
            <span className={`text-sm ${getClass('body')}`}>
              Admin System
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!isAdmin) {
    // Fallback check from userProfile in AuthContext
    const isAdminFromProfile = userProfile && (userProfile.role === 'admin' || userProfile.role === 'super-admin');
    
    if (isAdminFromProfile) {
      console.log('AdminProtectedRoute: Fallback admin check passed, allowing access');
      // If AuthContext says user is admin but AdminContext isn't ready, allow access
      return <>{children}</>;
    }
    
    console.log('AdminProtectedRoute: User is not admin, blocking access');
    console.log('AdminProtectedRoute: Current admin state:', { 
      isAdmin, 
      isLoading, 
      user: user?.email,
      userProfileRole: userProfile?.role 
    });
    if (onUnauthorized) {
      onUnauthorized();
    }

    return fallback || (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center">
        <div className="glass-container rounded-2xl p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          
          <h2 className={`text-2xl ${getClass('header')} text-white mb-4`}>
            {currentContent.accessDenied}
          </h2>
          
          <p className={`${getClass('body')} text-white/80 mb-6 leading-relaxed`}>
            {currentContent.adminRequired}
          </p>
          
          <p className={`${getClass('body')} text-white/60 mb-8 text-sm`}>
            {currentContent.contactAdmin}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.hash = '#home'}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            >
              {currentContent.backToHome}
            </button>
            <button
              onClick={() => window.location.hash = '#coming-soon'}
              className="px-6 py-3 bg-gradient-to-r from-[#AA4626] to-[#FCB283] hover:from-[#FCB283] hover:to-[#AA4626] rounded-lg text-white transition-all"
            >
              {currentContent.requestAccess}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check specific permission if required
  if (requiredPermission && !checkPermission(requiredPermission)) {
    console.log('AdminProtectedRoute: User lacks required permission:', requiredPermission);
    if (onUnauthorized) {
      onUnauthorized();
    }

    return fallback || (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center">
        <div className="glass-container rounded-2xl p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
          
          <h2 className={`text-2xl ${getClass('header')} text-white mb-4`}>
            {currentContent.insufficientPermissions}
          </h2>
          
          <p className={`${getClass('body')} text-white/80 mb-6 leading-relaxed`}>
            {currentLanguage === 'th' 
              ? `คุณไม่มีสิทธิ์ ${requiredPermission} ที่จำเป็นสำหรับหน้านี้`
              : `You don't have the required ${requiredPermission} permission for this page`
            }
          </p>
          
          <p className={`${getClass('body')} text-white/60 mb-8 text-sm`}>
            {currentContent.contactAdmin}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.hash = '#admin/dashboard'}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            >
              {currentLanguage === 'th' ? 'กลับแดชบอร์ด' : 'Back to Dashboard'}
            </button>
            <button
              onClick={() => window.location.hash = '#coming-soon'}
              className="px-6 py-3 bg-gradient-to-r from-[#AA4626] to-[#FCB283] hover:from-[#FCB283] hover:to-[#AA4626] rounded-lg text-white transition-all"
            >
              {currentContent.requestAccess}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check multiple permissions if required (user must have at least one)
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    console.log('AdminProtectedRoute: User lacks required permissions:', requiredPermissions);
    if (onUnauthorized) {
      onUnauthorized();
    }

    return fallback || (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center">
        <div className="glass-container rounded-2xl p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
          
          <h2 className={`text-2xl ${getClass('header')} text-white mb-4`}>
            {currentContent.insufficientPermissions}
          </h2>
          
          <p className={`${getClass('body')} text-white/80 mb-6 leading-relaxed`}>
            {currentLanguage === 'th' 
              ? 'คุณไม่มีสิทธิ์ที่จำเป็นสำหรับหน้านี้'
              : 'You don\'t have the required permissions for this page'
            }
          </p>
          
          <div className="mb-6">
            <p className={`${getClass('body')} text-white/60 text-sm mb-2`}>
              {currentLanguage === 'th' ? 'สิทธิ์ที่ต้องการ:' : 'Required permissions:'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {requiredPermissions.map((permission, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/10 rounded text-xs text-white/70"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
          
          <p className={`${getClass('body')} text-white/60 mb-8 text-sm`}>
            {currentContent.contactAdmin}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.hash = '#admin/dashboard'}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            >
              {currentLanguage === 'th' ? 'กลับแดชบอร์ด' : 'Back to Dashboard'}
            </button>
            <button
              onClick={() => window.location.hash = '#coming-soon'}
              className="px-6 py-3 bg-gradient-to-r from-[#AA4626] to-[#FCB283] hover:from-[#FCB283] hover:to-[#AA4626] rounded-lg text-white transition-all"
            >
              {currentContent.requestAccess}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User has required permissions, render children
  console.log('AdminProtectedRoute: Access granted for admin user');
  return <>{children}</>;
};

export default AdminProtectedRoute;