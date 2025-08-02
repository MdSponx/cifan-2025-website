import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { User, FileText, Settings, LogOut, X } from 'lucide-react';

interface UserZoneSidebarProps {
  currentPage: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const UserZoneSidebar: React.FC<UserZoneSidebarProps> = ({
  currentPage,
  isOpen,
  onToggle,
  onClose
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user, userProfile, signOut } = useAuth();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      userZone: "พื้นที่ผู้ใช้",
      profile: "โปรไฟล์",
      myApplications: "ใบสมัครของฉัน",
      settings: "ตั้งค่า",
      signOut: "ออกจากระบบ",
      welcome: "ยินดีต้อนรับ"
    },
    en: {
      userZone: "User Zone",
      profile: "Profile",
      myApplications: "My Applications",
      settings: "Settings",
      signOut: "Sign Out",
      welcome: "Welcome"
    }
  };

  const currentContent = content[currentLanguage];

  const menuItems = [
    {
      id: 'profile/edit',
      icon: <User size={20} />,
      label: currentContent.profile,
      href: '#profile/edit'
    },
    {
      id: 'my-applications',
      icon: <FileText size={20} />,
      label: currentContent.myApplications,
      href: '#my-applications'
    },
    {
      id: 'settings',
      icon: <Settings size={20} />,
      label: currentContent.settings,
      href: '#coming-soon'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      window.location.hash = '#home';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuItemClick = (href: string) => {
    window.location.hash = href;
    onClose();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('user-zone-sidebar');
      const toggle = document.getElementById('sidebar-toggle');
      
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
      id="user-zone-sidebar"
      className="w-full h-full glass-container rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 ease-in-out"
    >
      <div className="flex flex-col h-full">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/20 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl ${getClass('header')} text-white`}>
              {currentContent.userZone}
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white/80" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FCB283] flex items-center justify-center">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${getClass('body')} text-white font-medium truncate`}>
                {currentContent.welcome}
              </p>
              <p className={`${getClass('body')} text-white/60 text-sm truncate`}>
                {user?.displayName || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={currentPage === item.id ? 'text-white' : 'text-white/60'}>
                    {item.icon}
                  </span>
                  <span className={`${getClass('body')} font-medium`}>
                    {item.label}
                  </span>
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

export default UserZoneSidebar;
