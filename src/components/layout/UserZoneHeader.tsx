import React from 'react';
import BaseHeader from './BaseHeader';

interface UserZoneHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
  onSidebarToggle: () => void;
  children?: React.ReactNode;
}

const UserZoneHeader: React.FC<UserZoneHeaderProps> = (props) => {
  return (
    <BaseHeader
      {...props}
      isAdminZone={false}
      sidebarToggleId="sidebar-toggle"
    />
  );
};

export default UserZoneHeader;
