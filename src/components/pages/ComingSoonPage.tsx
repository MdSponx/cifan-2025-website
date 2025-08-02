import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useResponsiveTypography } from '../../utils/fontSizeUtils';
import AnimatedButton from '../ui/AnimatedButton';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const ComingSoonPage = () => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { getThaiAdjustedSize } = useResponsiveTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      comingSoon: "เร็วๆ นี้",
      subtitle: "กำลังเตรียมความพิเศษสำหรับคุณ",
      description: "เราอยู่ระหว่างการพัฒนาฟีเจอร์นี้ให้สมบูรณ์แบบ กรุณารอติดตามในเร็วๆ นี้",
      backToHome: "กลับหน้าหลัก",
      stayTuned: "ติดตามข่าวสารได้ที่",
      followUs: "ติดตามเรา"
    },
    en: {
      comingSoon: "Coming Soon",
      subtitle: "We're preparing something special for you",
      description: "We're currently developing this feature to perfection. Please stay tuned for updates.",
      backToHome: "Back to Home",
      stayTuned: "Stay tuned for updates",
      followUs: "Follow Us"
    }
  };

  const currentContent = content[currentLanguage];

  return (
    <div className="min-h-screen relative overflow-hidden pt-16 sm:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Fcat%2Fa807142ab209ecf0a1d6296ae10304197a0f5691c6a98f421eb8fb4ee0b9892b.jpg?alt=media&token=62da39c8-80d0-4e64-93b8-817024b6a3cb')`
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* CIFAN Logo */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2Flogo%20cifan%20full%404x.png?alt=media&token=9087f171-7499-40c5-a849-b09106f84a98"
              alt="CIFAN 2025 Logo"
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain filter brightness-0 invert animate-fade-in-up"
            />
          </div>

          {/* Coming Soon Text with Animation */}
          <div className="mb-8 sm:mb-12">
            <h1 className={`${getThaiAdjustedSize('text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl')} ${getClass('header')} text-white mb-4 sm:mb-6 animate-coming-soon-pulse`}>
              {currentContent.comingSoon}
            </h1>
            <h2 className={`${getThaiAdjustedSize('text-lg sm:text-xl md:text-2xl lg:text-3xl')} ${getClass('subtitle')} text-white/90 mb-6 sm:mb-8 animate-fade-in-up`} style={{ animationDelay: '0.5s' }}>
              {currentContent.subtitle}
            </h2>
            <p className={`${getThaiAdjustedSize('text-base sm:text-lg md:text-xl')} ${getClass('body')} text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up`} style={{ animationDelay: '1s' }}>
              {currentContent.description}
            </p>
          </div>

          {/* Glass Container with Actions */}
          <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
            
            {/* Back to Home Button */}
            <div className="mb-8">
              <AnimatedButton 
                variant="primary" 
                size="large" 
                icon="🏠"
                onClick={() => {
                  window.location.hash = '#home';
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
                className={`${getClass('menu')} w-full sm:w-auto`}
              >
                {currentContent.backToHome}
              </AnimatedButton>
            </div>

            {/* Stay Tuned Section */}
            <div className="border-t border-white/20 pt-6 sm:pt-8">
              <p className={`text-white/70 ${getClass('body')} mb-4 ${getThaiAdjustedSize('text-sm sm:text-base')}`}>
                {currentContent.stayTuned}
              </p>
              
              {/* Social Media Links */}
              <div className="flex justify-center space-x-4">
                <SocialButton icon={<Facebook size={20} />} href="https://www.facebook.com/cifan.official/" label="Facebook" />
                <SocialButton icon={<Instagram size={20} />} href="https://www.instagram.com/cifanofficial/" label="Instagram" />
                <SocialButton icon={<Youtube size={20} />} href="https://www.youtube.com/@CIFANofficial" label="YouTube" />
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#FCB283] rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#AA4626] rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-bounce opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

const SocialButton = ({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 sm:w-12 h-10 sm:h-12 glass-card rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
    aria-label={label}
  >
    <span className="text-white">{icon}</span>
  </a>
);

export default ComingSoonPage;
