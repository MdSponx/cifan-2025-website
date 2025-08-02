import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { useAdmin } from '../admin/AdminContext';
import { 
  User, 
  BarChart3, 
  Grid, 
  Building2, 
  Calendar, 
  FileText, 
  LogOut, 
  X,
  Shield
} from 'lucide-react';

interface AdminZoneSidebarProps {
  currentPage: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

interface AdminMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: {
    text: string;
    color: 'orange' | 'blue' | 'green' | 'red';
  };
}

const AdminZoneSidebar: React.FC<AdminZoneSidebarProps> = ({
  currentPage,
  isOpen,
  onToggle,
  onClose
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user, userProfile, signOut } = useAuth();
  const { adminProfile, permissions, checkPermission } = useAdmin();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      adminZone: "พื้นที่ผู้ดูแลระบบ",
      adminProfile: "โปรไฟล์ผู้ดูแล",
      applicationsDashboard: "แดชบอร์ดใบสมัคร",
      applicationsGallery: "แกลเลอรี่ใบสมัคร",
      partnersManagement: "จัดการพาร์ทเนอร์",
      activitiesEvents: "กิจกรรมและอีเวนต์",
      articlesNews: "บทความและข่าวสาร",
      signOut: "ออกจากระบบ",
      welcome: "ยินดีต้อนรับ",
      administrator: "ผู้ดูแลระบบ",
      comingSoon: "เร็วๆ นี้"
    },
    en: {
      adminZone: "Admin Zone",
      adminProfile: "Admin Profile",
      applicationsDashboard: "Applications Dashboard",
      applicationsGallery: "Applications Gallery",
      partnersManagement: "Partners Management",
      activitiesEvents: "Activities & Events",
      articlesNews: "Articles & News",
      signOut: "Sign Out",
      welcome: "Welcome",
      administrator: "Administrator",
      comingSoon: "Coming Soon"
    }
  };

  const currentContent = content[currentLanguage];

  const menuItems: AdminMenuItem[] = [
    {
      id: 'admin/profile',
      icon: <User size={20} />,
      label: currentContent.adminProfile,
      href: '#admin/profile'
    },
    ...(checkPermission('canViewDashboard') ? [{
      id: 'admin/dashboard',
      icon: <BarChart3 size={20} />,
      label: currentContent.applicationsDashboard,
      href: '#admin/dashboard'
    }] : []),
    ...(checkPermission('canViewApplications') ? [{
      id: 'admin/gallery',
      icon: <Grid size={20} />,
      label: currentContent.applicationsGallery,
      href: '#admin/gallery'
    }] : []),
    ...(checkPermission('canManageUsers') ? [{
      id: 'admin/partners',
      icon: <Building2 size={20} />,
      label: currentContent.partnersManagement,
      href: '#admin/partners',
      badge: {
        text: currentContent.comingSoon,
        color: 'orange'
      }
    }] : []),
    {
      id: 'admin/activities',
      icon: <Calendar size={20} />,
      label: currentContent.activitiesEvents,
      href: '#admin/activities',
      badge: {
        text: currentContent.comingSoon,
        color: 'orange'
      }
    },
    {
      id: 'admin/articles',
      icon: <FileText size={20} />,
      label: currentContent.articlesNews,
      href: '#admin/articles',
      badge: {
        text: currentContent.comingSoon,
        color: 'orange'
      }
    }
  ].filter(Boolean);

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      window.location.hash = '#home';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuItemClick = (href: string, hasComingSoon: boolean = false) => {
    if (hasComingSoon) {
      // Navigate to coming soon page for items with badges
      window.location.hash = '#coming-soon';
    } else {
      window.location.hash = href;
    }
    onClose();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const getBadgeStyles = (color: string) => {
    const styles = {
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return styles[color as keyof typeof styles] || styles.orange;
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('admin-zone-sidebar');
      const toggle = document.getElementById('admin-sidebar-toggle');
      
      if (isOpen && sidebar && !sidebar.contains(event.target as Node) && 
          toggle && !toggle.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="admin-zone-sidebar"
      className="w-full h-full glass-container rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 ease-in-out"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.15)'
      }}
    >
      <div className="flex flex-col h-full">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/20 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl ${getClass('header')} text-white flex items-center space-x-2`}>
              <Shield className="w-5 h-5 text-[#FCB283]" />
              <span>{currentContent.adminZone}</span>
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white/80" />
            </button>
          </div>
          
          {/* Admin User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-[#FCB283] to-[#AA4626] flex items-center justify-center relative">
              {(adminProfile?.photoURL || userProfile?.photoURL) ? (
                <img
                  src={adminProfile?.photoURL || userProfile?.photoURL}
                  alt="Admin Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </span>
              )}
              {/* Admin Badge */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FCB283] rounded-full flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${getClass('body')} text-white font-medium truncate`}>
                {currentContent.welcome}
              </p>
              <div className="flex items-center space-x-2">
                <p className={`${getClass('body')} text-white/60 text-sm truncate`}>
                  {adminProfile?.fullNameEN || user?.displayName || user?.email}
                </p>
                <span className="px-2 py-0.5 bg-[#FCB283]/20 text-[#FCB283] rounded-full text-xs border border-[#FCB283]/30">
                  {currentContent.administrator}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.href, !!item.badge)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 text-left">
                    <span className={currentPage === item.id ? 'text-white' : 'text-white/60 group-hover:text-white'}>
                      {item.icon}
                    </span>
                    <span className={`${getClass('body')} font-medium text-left`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeStyles(item.badge.color)}`}>
                      {item.badge.text}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/20 rounded-b-2xl">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-200 ${getClass('body')}`}
          >
            <LogOut size={20} />
            <span className="font-medium">{currentContent.signOut}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminZoneSidebar;