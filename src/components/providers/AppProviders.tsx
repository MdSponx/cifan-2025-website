import React from 'react';
import { AuthProvider } from '../auth/AuthContext';
import { AuthFlowProvider } from '../auth/AuthFlowProvider';
import { AdminProvider } from '../admin/AdminContext';
import { NotificationProvider } from '../ui/NotificationSystem';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthFlowProvider>
        <NotificationProvider>
          <AdminProvider>
            {children}
          </AdminProvider>
        </NotificationProvider>
      </AuthFlowProvider>
    </AuthProvider>
  );
};

export default AppProviders;
