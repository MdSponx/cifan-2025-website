import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsiveTypography } from '../../utils/fontSizeUtils';
import AnimatedButton from '../ui/AnimatedButton';

const WorkshopsSection = () => {
  const { i18n } = useTranslation();
  const { getThaiAdjustedSize } = useResponsiveTypography();
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      title: "เวิร์กช็อปและสัมมนา",
      subtitle: "สร้างทักษะและเชื่อมโยงอุตสาหกรรมภาพยนตร์ในภาคเหนือของไทย",
      learnMore: "เรียนรู้เพิ่มเติม"
    },
    en: {
      title: "Workshops & Seminars",
      subtitle: "Building Skills and Connecting the Film Industry in Northern Thailand",
      learnMore: "Learn More"
    }
  };

  const activities = [
    {
      id: 1,
      icon: "🏭",
      title: {
        en: "Industrial Activities",
        th: "กิจกรรมอุตสาหกรรม"
      },
      description: {
        en: "Connect local businesses with the film industry to create a sustainable creative ecosystem. These collaborative sessions bring together Chamber of Commerce members, content creators, and investors to develop standardized practices, share market insights, and establish long-term partnerships that strengthen Northern Thailand's position in the film production landscape.",
        th: "เชื่อมโยงธุรกิจท้องถิ่นกับอุตสาหกรรมภาพยนตร์ เพื่อสร้างระบบนิเวศเศรษฐกิจสร้างสรรคที่ยั่งยืน การสัมนาเชิงปฏิบัติการนี้นำสมาชิกสภาหอการค้า ผู้ผลิตคอนเทนต์ และนักลงทุนมาร่วมพัฒนากระบวนการที่เป็นมาตรฐาน แบ่งปันข้อมูลเชิงลึกของตลาด และสร้างความร่วมมือระยะยาวที่เสริมสร้างความแข็งแกร่งให้ภาคเหนือในแวดวงการผลิตภาพยนตร์"
      },
      gradient: "from-[#3B6891] to-[#00305A]",
      features: {
        en: ["Chamber of Commerce Partnership", "Market Insights Sharing", "Standardized Practices Development"],
        th: ["ความร่วมมือสภาหอการค้า", "แบ่งปันข้อมูลตลาด", "พัฒนากระบวนการมาตรฐาน"]
      }
    },
    {
      id: 2,
      icon: "🎓",
      title: {
        en: "Education Activities",
        th: "กิจกรรมการศึกษา"
      },
      description: {
        en: "Develop specialized technical skills essential for modern film production. Professional training programs focus on building expertise in location management, lighting and grip work, audition preparation, and acting techniques to create a skilled workforce ready to support both local and international productions in the region.",
        th: "พัฒนาทักษะเทคนิคเฉพาะทางที่จำเป็นสำหรับการผลิตภาพยนตร์สมัยใหม่ โปรแกรมการอบรมเชิงวิชาชีพเน้นการสร้างความเชี่ยวชาญในด้านการจัดการสถานที่ถ่ายทำ งานแสงและกริป การเตรียมตัวออดิชั่น และเทคนิคการแสดง เพื่อสร้างแรงงานที่มีทักษะพร้อมรองรับการผลิตทั้งในประเทศและต่างประเทศในภูมิภาค"
      },
      gradient: "from-[#AA4626] to-[#FCB283]",
      features: {
        en: ["Location Management Training", "Lighting & Grip Techniques", "Acting & Audition Preparation"],
        th: ["อบรมการจัดการสถานที่", "เทคนิคแสงและกริป", "การเตรียมตัวแสดงและออดิชั่น"]
      }
    }
  ];

  const currentContent = content[currentLanguage];

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-4 text-white`}>
            {currentContent.title}
          </h2>
          <p className={`text-base sm:text-lg md:text-xl text-white/80 max-w-4xl mx-auto ${getTypographyClass('body')} leading-relaxed px-4`}>
            {currentContent.subtitle}
          </p>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {activities.map((activity) => (
            <div key={activity.id} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-500 border border-white/10 flex flex-col h-full">
              
              {/* Card Header with Icon */}
              <div className={`h-32 sm:h-40 md:h-48 bg-gradient-to-br ${activity.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
                  {activity.icon}
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
                
                {/* Activity Title */}
                <h3 className={`text-lg sm:text-xl md:text-2xl ${getTypographyClass('header')} mb-3 sm:mb-4 text-white group-hover:text-[#FCB283] transition-colors`}>
                  {activity.title[currentLanguage]}
                </h3>
                
                {/* Activity Description */}
                <p className={`text-white/70 mb-4 sm:mb-6 leading-relaxed ${getTypographyClass('body')} ${getThaiAdjustedSize('text-sm sm:text-base')} flex-grow`}>
                  {activity.description[currentLanguage]}
                </p>

                {/* Features List */}
                <ul className="space-y-1 sm:space-y-2 mb-6 sm:mb-8">
                  {activity.features[currentLanguage].map((feature, idx) => (
                    <li key={idx} className={`flex items-start text-white/80 ${getTypographyClass('body')} ${getThaiAdjustedSize('text-xs sm:text-sm')}`}>
                      <span className="text-[#FCB283] mr-3 mt-0.5 flex-shrink-0">✨</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-auto">
                  <AnimatedButton 
                    variant="secondary" 
                    size="small" 
                    icon="📚"
                    className={`w-full ${getTypographyClass('menu')}`}
                    onClick={() => {
                      window.location.hash = '#coming-soon';
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    {currentContent.learnMore}
                  </AnimatedButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="glass-container p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl max-w-4xl mx-auto">
            <h3 className={`text-lg sm:text-xl md:text-2xl ${getTypographyClass('header')} mb-3 sm:mb-4 text-white`}>
              {currentLanguage === 'th' ? 'เข้าร่วมกับเรา' : 'Join Us'}
            </h3>
            <p className={`text-white/80 mb-4 sm:mb-6 ${getTypographyClass('body')} leading-relaxed ${getThaiAdjustedSize('text-sm sm:text-base')}`}>
              {currentLanguage === 'th' 
                ? 'ร่วมเป็นส่วนหนึ่งในการพัฒนาอุตสาหกรรมภาพยนตร์ภาคเหนือ พบกับผู้เชี่ยวชาญ เรียนรู้เทคนิคใหม่ๆ และสร้างเครือข่ายที่แข็งแกร่ง'
                : 'Be part of developing Northern Thailand\'s film industry. Meet experts, learn new techniques, and build strong professional networks.'
              }
            </p>
            <AnimatedButton 
              variant="primary" 
              size="medium" 
              icon="🎬"
              className={getTypographyClass('menu')}
              onClick={() => {
                window.location.hash = '#coming-soon';
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
            >
              {currentLanguage === 'th' ? 'ลงทะเบียนเลย' : 'Register Now'}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopsSection;
