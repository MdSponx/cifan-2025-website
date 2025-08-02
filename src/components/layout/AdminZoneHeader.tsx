import React from 'react';
import BaseHeader from './BaseHeader';

interface AdminZoneHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
  onSidebarToggle: () => void;
  children?: React.ReactNode;
}

const AdminZoneHeader: React.FC<AdminZoneHeaderProps> = (props) => {
  return (
    <BaseHeader
      {...props}
      isAdminZone={true}
      sidebarToggleId="admin-sidebar-toggle"
    />
  );
};

export default AdminZoneHeader;
