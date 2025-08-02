import React from 'react';
import { useTranslation } from 'react-i18next';

const OneHeroSection = () => {
  const { i18n } = useTranslation();
  const [isRevealed, setIsRevealed] = React.useState(false);
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  // Wheel event effect for reveal (desktop only)
  React.useEffect(() => {
    if (isRevealed) return;

    // Auto-reveal on mobile/tablet, wheel reveal on desktop
    const isMobile = window.innerWidth < 1024;
    
    if (isMobile) {
      // Auto-reveal on mobile after a short delay
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setIsRevealed(true);
      
      // Re-enable scrolling after animation completes
      setTimeout(() => {
        document.body.style.overflow = 'auto';
      }, 1000);
    };

    // Prevent initial scrolling on desktop
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'auto';
    };
  }, [isRevealed]);

  const content = {
    th: {
      title: "CIFAN 2025",
      subtitle: "เทศกาลภาพยนตร์แฟนตาสติกนานาชาติเชียงใหม่",
      date: "วันที่ 20-27 กันยายน 2568",
      location: "สวนสาธารณะสถานีรถไฟเชียงใหม่",
      description: "มาร่วมสัมผัสประสบการณ์ภาพยนตร์แนวแฟนตาสติกระดับนานาชาติ พร้อมชมผลงานภาพยนตร์สั้นจากเยาวชนไทยและต่างประเทศ ชิงเงินรางวัลรวมกว่า 1 ล้านบาท",
      viewSchedule: "ดูตารางกิจกรรม",
      submitFilm: "ส่งผลงานภาพยนตร์"
    },
    en: {
      title: "CIFAN 2025",
      subtitle: "Chiang Mai International Fantastic Film Festival",
      date: "September 20-27, 2025",
      location: "Chiang Mai Railway Station Park",
      description: "Experience world-class fantastic cinema alongside outstanding short films from Thai and international youth filmmakers. Compete for prizes worth over 1 million baht.",
      viewSchedule: "View Schedule",
      submitFilm: "Submit Your Film"
    }
  };

  const currentContent = content[i18n.language as keyof typeof content] || content.en;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-6 sm:pb-10 px-4">
      
      {/* Transform Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex items-center">
        <div className={`w-full transition-all duration-1000 ease-in-out ${
          isRevealed 
            ? 'lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 lg:items-center flex flex-col space-y-6 sm:space-y-8 lg:space-y-0' 
            : 'flex justify-center items-center'
        }`}>
          
          {/* Main Logo */}
          <div className={`flex items-center justify-center transition-all duration-1000 ease-in-out ${
            isRevealed ? 'lg:justify-start justify-center order-1 lg:order-1 mb-4 sm:mb-6 lg:mb-0' : 'justify-center'
          }`}>
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%201.png?alt=media&token=1cd67edc-cb19-4ad3-880c-28667a3d4f08"
              alt="CIFAN 2025 - Chiang Mai Fantastic International Film Festival"
              className={`object-contain animate-fade-in-up transition-all duration-1000 ease-in-out ${
                isRevealed 
                  ? 'w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto' 
                  : 'max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl h-auto'
              }`}
              style={{ 
                maxHeight: isRevealed 
                  ? window.innerWidth < 640 ? '30vh' : window.innerWidth < 1024 ? '40vh' : '60vh'
                  : window.innerWidth < 640 ? '40vh' : window.innerWidth < 1024 ? '50vh' : '60vh'
              }}
            />
          </div>

          {/* Content Container */}
          <div className={`w-full transition-all duration-1000 ease-in-out order-2 lg:order-2 ${
            isRevealed 
              ? 'opacity-100 transform translate-x-0 visible' 
              : 'opacity-0 lg:transform lg:translate-x-full lg:invisible lg:absolute lg:right-0 visible transform translate-x-0'
          }`}>
            <div className="glass-container p-4 sm:p-6 md:p-8 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl space-y-4 sm:space-y-6 lg:space-y-8 w-full">
            
              {/* Festival Title */}
              <div className="text-center lg:text-left">
                <h1 className={`${
                  i18n.language === 'th' 
                    ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl' 
                    : 'text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl'
                } ${getTypographyClass('header')} text-white mb-2 sm:mb-3 leading-tight`}>
                  {currentContent.title}
                </h1>
                <p className={`${
                  i18n.language === 'th' 
                    ? 'text-xs sm:text-sm md:text-base lg:text-base xl:text-lg' 
                    : 'text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl'
                } ${getTypographyClass('subtitle')} text-white/80 leading-tight`}>
                  {currentContent.subtitle}
                </p>
              </div>

              {/* Description Section */}
              <div className="text-center lg:text-left">
                <p className={`${
                  i18n.language === 'th' 
                    ? 'text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base' 
                    : 'text-sm sm:text-sm md:text-base lg:text-base xl:text-lg'
                } ${getTypographyClass('body')} text-white/90 leading-relaxed`}>
                  {currentContent.description}
                </p>
              </div>

              {/* Date & Location Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 justify-center sm:justify-start">
                  <span className="text-xl sm:text-2xl flex-shrink-0">📅</span>
                  <div className="min-w-0">
                    <p className={`${
                      i18n.language === 'th' ? 'text-xs' : 'text-xs'
                    } ${getTypographyClass('body')} text-white/70 mb-1`}>
                      {i18n.language === 'th' ? 'วันที่' : 'Date'}
                    </p>
                    <p className={`${
                      i18n.language === 'th' 
                        ? 'text-xs sm:text-sm' 
                        : 'text-sm'
                    } ${getTypographyClass('subtitle')} text-white font-medium leading-tight`}>
                      {currentContent.date}
                    </p>
                  </div>
                </div>
              
                <div className="flex items-center space-x-3 justify-center sm:justify-start">
                  <span className="text-xl sm:text-2xl flex-shrink-0">📍</span>
                  <div className="min-w-0">
                    <p className={`${
                      i18n.language === 'th' ? 'text-xs' : 'text-xs'
                    } ${getTypographyClass('body')} text-white/70 mb-1`}>
                      {i18n.language === 'th' ? 'สถานที่' : 'Venue'}
                    </p>
                    <p className={`${
                      i18n.language === 'th' 
                        ? 'text-xs sm:text-sm' 
                        : 'text-sm'
                    } ${getTypographyClass('subtitle')} text-white font-medium leading-tight`}>
                      {currentContent.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons Section */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <button className={`w-full liquid-glass-button text-sm sm:text-base py-3 sm:py-4 font-medium ${
                  i18n.language === 'th' ? 'font-anuphan' : 'font-oswald'
                } min-h-[44px] sm:min-h-[48px]`}
                onClick={() => {
                  window.location.hash = '#coming-soon';
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}>
                  {currentContent.viewSchedule}
                </button>
                <button 
                  onClick={() => {
                    window.location.hash = '#competition';
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                  className={`w-full liquid-glass-button text-sm sm:text-base py-3 sm:py-4 font-medium ${
                  i18n.language === 'th' ? 'font-anuphan' : 'font-oswald'
                } min-h-[44px] sm:min-h-[48px]`}>
                  {currentContent.submitFilm}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default OneHeroSection;