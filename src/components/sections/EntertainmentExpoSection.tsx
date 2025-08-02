import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedButton from '../ui/AnimatedButton';

const EntertainmentExpoSection = () => {
  const { i18n } = useTranslation();
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      mainTitle: "Entertainment EXPO: พลังสร้างสรรค์แห่งเชียงใหม่",
      subtitle: "มหกรรมแสดงศักยภาพอุตสาหกรรมสร้างสรรค์และนวัตกรรมการศึกษาแห่งเมืองเชียงใหม่",
      mainDescription: "เปิดประตูสู่ใจกลางอุตสาหกรรมบันเทิงภาคเหนือที่เปี่ยมด้วยพลังและความคิดสร้างสรรค์! Entertainment EXPO คือมหกรรมครั้งสำคัญที่รวบรวมเหล่าผู้สร้างสรรค์ผลงาน (Content Creators) สถาบันการศึกษาชั้นนำ บริษัทเอกชน และหน่วยงานภาครัฐ เพื่อร่วมกันฉายภาพความพร้อมของเชียงใหม่ในการเป็นศูนย์กลางการผลิตภาพยนตร์และคอนเทนต์ (Film Production Hub) ระดับแนวหน้า",
      features: [
        {
          icon: "🎬",
          text: "โปรดักชันเฮาส์ชั้นนำ ที่จะมาจัดแสดงผลงานล่าสุด"
        },
        {
          icon: "🎓",
          text: "หลักสูตรสุดล้ำด้านภาพยนตร์และสื่อดิจิทัล จากมหาวิทยาลัยชื่อดัง"
        },
        {
          icon: "🏢",
          text: "ครีเอทีฟเอเจนซี่และผู้ให้บริการเฉพาะทาง ที่พร้อมตอบโจทย์ทุกการสร้างสรรค์"
        },
        {
          icon: "🏛️",
          text: "นโยบายและโครงการสนับสนุน จากภาครัฐที่ช่วยขับเคลื่อนวงการให้เติบโต"
        }
      ],
      closingStatement: "ตั้งแต่การสาธิตเทคโนโลยีและอุปกรณ์ใหม่ล่าสุด ไปจนถึงการพูดคุยเพื่อแนะแนวเส้นทางอาชีพ งาน EXPO ครั้งนี้เป็นเวทีที่สมบูรณ์แบบสำหรับมืออาชีพในวงการ นักศึกษา และผู้ที่สนใจ ได้มาพบปะ แลกเปลี่ยนความรู้ และค้นหาโอกาสใหม่ๆ เพื่อเติบโตไปพร้อมกับอุตสาหกรรมสร้างสรรค์ของไทยที่กำลังก้าวไปข้างหน้าอย่างไม่หยุดยั้ง",
      exploreExpo: "สำรวจงาน EXPO",
    },
    en: {
      mainTitle: "Entertainment EXPO: The Creative Power of Chiang Mai",
      subtitle: "A Landmark Event for Chiang Mai's Creative Industry and Educational Innovation",
      mainDescription: "Step into the heart of Northern Thailand's dynamic entertainment industry! Entertainment EXPO is a major event that brings together content creators, leading educational institutions, private companies, and government agencies to spotlight Chiang Mai's readiness to become a premier film and content production hub.",
      features: [
        {
          icon: "🎬",
          text: "Meet leading production houses showcasing their latest work"
        },
        {
          icon: "🎓",
          text: "Explore cutting-edge film and digital media programs from renowned universities"
        },
        {
          icon: "🏢",
          text: "Connect with creative agencies and specialized service providers for every production need"
        },
        {
          icon: "🏛️",
          text: "Learn about government policies and support initiatives that are driving the industry forward"
        }
      ],
      closingStatement: "From new technology demonstrations to career-focused talks, the EXPO is the ultimate platform for industry professionals, students, and enthusiasts to connect, learn, and discover new opportunities—growing together with Thailand's ever-advancing creative industry.",
      exploreExpo: "Explore EXPO",
    }
  };

  const currentContent = content[currentLanguage];

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 relative mb-8 sm:mb-12 md:mb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Main Content Container */}
        <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 xl:p-18 space-y-8 sm:space-y-10 md:space-y-14 mb-8 sm:mb-12 md:mb-16">
          
          {/* Main Title (H1) */}
          <div className="text-center">
            <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl ${getTypographyClass('header')} mb-4 sm:mb-6 leading-tight`}>
              <span className="bg-gradient-to-r from-[#FCB283] via-[#AA4626] to-[#FCB283] bg-clip-text text-transparent animate-gradient-shift">
                {currentContent.mainTitle}
              </span>
            </h1>
            
            {/* Subtitle (H2) */}
            <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl ${getTypographyClass('subtitle')} text-white/90 max-w-5xl mx-auto leading-relaxed px-4`}>
              {currentContent.subtitle}
            </h2>
          </div>

          {/* Main Description */}
          <div className="max-w-6xl mx-auto">
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${getTypographyClass('body')} text-white/80 leading-relaxed text-center px-4 ${
              currentLanguage === 'th' ? 'text-sm sm:text-base md:text-lg' : 'text-base sm:text-lg md:text-xl'
            }`}>
              {currentContent.mainDescription}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {currentContent.features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl hover:scale-105 transition-all duration-300 group border border-white/10"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <p className={`text-white/90 ${getTypographyClass('body')} leading-relaxed ${
                    currentLanguage === 'th' ? 'text-xs sm:text-sm md:text-base' : 'text-sm sm:text-base md:text-lg'
                  }`}>
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Single CTA Button */}
          <div className="text-center">
            <AnimatedButton 
              variant="primary" 
              size="medium" 
              icon="🎪"
              className={`${getTypographyClass('menu')}`}
              onClick={() => {
                window.location.hash = '#coming-soon';
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
            >
              {currentContent.exploreExpo}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntertainmentExpoSection;
