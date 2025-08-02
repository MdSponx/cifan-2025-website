import React from 'react';
import { useState } from 'react';
import AppProviders from './components/providers/AppProviders';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import { Navigation, Footer, UserZoneLayout, AdminZoneLayout } from './components/layout';
import { AnimatedBackground } from './components/ui';
import { UnifiedSubmissionForm } from './components/forms';
import AboutPage from './components/pages/AboutPage';
import CompetitionPage from './components/pages/CompetitionPage';
import OneHeroSection from './components/sections/OneHeroSection';
import OfficialSelectionSection from './components/sections/OfficialSelectionSection';
import QuickInfoSection from './components/sections/QuickInfoSection';
import ProgramsSection from './components/sections/ProgramsSection';
import EntertainmentExpoSection from './components/sections/EntertainmentExpoSection';
import CompetitionHighlight from './components/sections/CompetitionHighlight';
import WorkshopsSection from './components/sections/WorkshopsSection';
import CityRallySection from './components/sections/CityRallySection';
import NewsSection from './components/sections/NewsSection';
import PartnersSection from './components/sections/PartnersSection';
import SignUpPage from './components/auth/SignUpPage';
import SignInPage from './components/auth/SignInPage';
import VerifyEmailPage from './components/auth/VerifyEmailPage';
import SmartSignUpPage from './components/auth/SmartSignUpPage';
import SmartSignInPage from './components/auth/SmartSignInPage';
import ImprovedVerificationPage from './components/auth/ImprovedVerificationPage';
import ProfileSetupPage from './components/pages/ProfileSetupPage';
import ProfileEditPage from './components/pages/ProfileEditPage';
import MyApplicationsPage from './components/pages/MyApplicationsPage';
import ApplicationDetailPage from './components/pages/ApplicationDetailPage';
import ApplicationEditPage from './components/pages/ApplicationEditPage';
import ComingSoonPage from './components/pages/ComingSoonPage';
import ApplicationsDashboardPage from './components/pages/ApplicationsDashboardPage';
import AdminGalleryPage from './components/pages/AdminGalleryPage';
import AdminProfilePage from './components/pages/AdminProfilePage';
import AdminApplicationDetailPage from './components/pages/AdminApplicationDetailPage';
import TermsConditionsPage from './components/pages/TermsConditionsPage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Listen for navigation clicks
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPage(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial page

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'competition':
        return <CompetitionPage />;
      case 'submit-youth':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={true}>
            <UnifiedSubmissionForm category="youth" />
          </ProtectedRoute>
        );
      case 'submit-future':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={true}>
            <UnifiedSubmissionForm category="future" />
          </ProtectedRoute>
        );
      case 'submit-world':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={true}>
            <UnifiedSubmissionForm category="world" />
          </ProtectedRoute>
        );
      case 'auth/signup':
        return <SmartSignUpPage />;
      case 'auth/signin':
        return <SmartSignInPage />;
      case 'auth/verify-email':
        return <ImprovedVerificationPage />;
      case 'profile/setup':
        return (
          <ProtectedRoute requireEmailVerification={true}>
            <ProfileSetupPage />
          </ProtectedRoute>
        );
      case 'profile/edit':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={true}>
            <UserZoneLayout currentPage="profile/edit">
              <ProfileEditPage />
            </UserZoneLayout>
          </ProtectedRoute>
        );
      case 'my-applications':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={true}>
            <UserZoneLayout currentPage="my-applications">
              <MyApplicationsPage />
            </UserZoneLayout>
          </ProtectedRoute>
        );
      case 'application-edit':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={true}>
            <UserZoneLayout currentPage="application-edit">
              <ApplicationEditPage applicationId="legacy" />
            </UserZoneLayout>
          </ProtectedRoute>
        );
      case 'terms-conditions':
        return <TermsConditionsPage />;
      case 'privacy-policy':
        return <PrivacyPolicyPage />;
      case 'coming-soon':
        return <ComingSoonPage />;
      case 'admin/dashboard':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={false}>
            <AdminProtectedRoute>
              <AdminZoneLayout currentPage="admin/dashboard">
                <ApplicationsDashboardPage />
              </AdminZoneLayout>
            </AdminProtectedRoute>
          </ProtectedRoute>
        );
      case 'admin/gallery':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={false}>
            <AdminProtectedRoute>
              <AdminZoneLayout currentPage="admin/gallery">
                <AdminGalleryPage />
              </AdminZoneLayout>
            </AdminProtectedRoute>
          </ProtectedRoute>
        );
      case 'admin/profile':
        return (
          <ProtectedRoute requireEmailVerification={true} requireProfileComplete={false}>
            <AdminProtectedRoute>
              <AdminZoneLayout currentPage="admin/profile">
                <AdminProfilePage />
              </AdminZoneLayout>
            </AdminProtectedRoute>
          </ProtectedRoute>
        );
      default:
        // Handle application detail page with dynamic ID
        if (currentPage.startsWith('application-detail/')) {
          const applicationId = currentPage.replace('application-detail/', '');
          return (
            <ProtectedRoute requireEmailVerification={true} requireProfileComplete={true}>
              <UserZoneLayout currentPage="application-detail">
                <ApplicationDetailPage applicationId={applicationId} />
              </UserZoneLayout>
            </ProtectedRoute>
          );
        }
        // Handle application edit page with dynamic ID
        if (currentPage.startsWith('application-edit/')) {
          const applicationId = currentPage.replace('application-edit/', '');
          return (
            <ProtectedRoute requireEmailVerification={true} requireProfileComplete={true}>
              <UserZoneLayout currentPage="application-edit">
                <ApplicationEditPage applicationId={applicationId} />
              </UserZoneLayout>
            </ProtectedRoute>
          );
        }
        // Handle admin application detail page with dynamic ID
        if (currentPage.startsWith('admin/application/')) {
          const applicationId = currentPage.replace('admin/application/', '');
          return (
            <ProtectedRoute requireEmailVerification={true} requireProfileComplete={false}>
              <AdminProtectedRoute>
                <AdminZoneLayout currentPage="admin/application">
                  <AdminApplicationDetailPage applicationId={applicationId} />
                </AdminZoneLayout>
              </AdminProtectedRoute>
            </ProtectedRoute>
          );
        }
        // Handle admin application detail page with dynamic ID (new route pattern)
        if (currentPage.startsWith('admin/application-detail/')) {
          const applicationId = currentPage.replace('admin/application-detail/', '');
          return (
            <ProtectedRoute requireEmailVerification={true} requireProfileComplete={false}>
              <AdminProtectedRoute>
                <AdminZoneLayout currentPage="admin/application-detail">
                  <AdminApplicationDetailPage applicationId={applicationId} />
                </AdminZoneLayout>
              </AdminProtectedRoute>
            </ProtectedRoute>
          );
        }
        return (
          <>
            <OneHeroSection />
            <ProgramsSection />
            <OfficialSelectionSection />
            <CompetitionHighlight />
            <WorkshopsSection />
            <EntertainmentExpoSection />
            <NewsSection />
            <PartnersSection />
          </>
        );
    }
  };

  return (
    <AppProviders>
      <div className="min-h-screen bg-[#110D16] text-white overflow-x-hidden relative">
        <Navigation />
        {renderPage()}
        <Footer />
        
        {/* Animated Background Elements */}
        <AnimatedBackground />
      </div>
    </AppProviders>
  );
}

export default App;
