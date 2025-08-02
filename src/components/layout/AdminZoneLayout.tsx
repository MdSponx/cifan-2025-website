import React, { useState, useEffect } from 'react';
import AdminZoneSidebar from './AdminZoneSidebar';

interface AdminZoneLayoutProps {
  currentPage: string;
  children: React.ReactNode;
}

const AdminZoneLayout: React.FC<AdminZoneLayoutProps> = ({
  currentPage,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-open sidebar on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#110D16] text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Main Layout Container */}
      <div className="flex min-h-screen pt-24">
        {/* Sidebar Container - Fixed 320px width */}
        <div className={`
          fixed lg:fixed top-24 left-0 w-80 h-[calc(100vh-6rem)] z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="w-full h-full p-4 lg:p-6">
            <AdminZoneSidebar
              currentPage={currentPage}
              isOpen={sidebarOpen}
              onToggle={toggleSidebar}
              onClose={closeSidebar}
            />
          </div>
        </div>

        {/* Main Content Area - Full width with proper offset */}
        <div className={`
          w-full lg:pl-80 min-w-0
          transition-all duration-300 ease-in-out
        `}>
          {/* Content Container with full width utilization */}
          <div className="min-h-[calc(100vh-6rem)]">
            <div className="
              w-full
              px-4 sm:px-6 lg:px-6 xl:px-8 2xl:px-10
              py-6 lg:py-8
              max-w-none
              overflow-x-hidden
            ">
              {/* Content Wrapper for proper vertical alignment */}
              <div className="space-y-6 lg:space-y-8 min-w-0">
                {React.cloneElement(children as React.ReactElement, {
                  onSidebarToggle: toggleSidebar
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminZoneLayout;