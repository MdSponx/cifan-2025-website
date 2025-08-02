import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsiveTypography } from '../../utils/fontSizeUtils';

const ProgramsSection = () => {
  const { i18n } = useTranslation();
  const { getThaiAdjustedSize } = useResponsiveTypography();

  const programs = [
    {
      id: 1,
      icon: "🎬",
      title: {
        en: "Official Selection Feature Films",
        th: "ภาพยนตร์เรื่องยาวคัดสรร"
      },
      description: {
        en: "Watch carefully curated fantastic films from around the world. Meet directors and actors, join panel discussions exploring the world of fantastic cinema.",
        th: "ชมภาพยนตร์แฟนตาสติกคัดสรรพิเศษจากทั่วโลก พร้อมพบปะผู้กำกับและนักแสดงในงาน เสวนาแลกเปลี่ยนมุมมองด้านภาพยนตร์แฟนตาสติก"
      },
      features: {
        en: ["International Premieres", "Director Q&A Sessions", "Panel Discussions"],
        th: ["รอบปฐมทัศน์นานาชาติ", "เสวนากับผู้กำกับ", "การอภิปรายแลกเปลี่ยน"]
      },
      gradient: "from-[#00305A] to-[#3B6891]",
      buttonText: {
        en: "View Films",
        th: "ดูภาพยนตร์"
      }
    },
    {
      id: 2,
      icon: "🏆",
      title: {
        en: "Short Film Competition",
        th: "การประกวดภาพยนตร์สั้น"
      },
      description: {
        en: "Fantastic short film competition themed \"Chiang Mai Future\" with prizes over 1 million baht. Open to all age groups and skill levels.",
        th: "ประกวดภาพยนตร์สั้นแนวแฟนตาสติก หัวข้อ \"เชียงใหม่ในอนาคต\" ชิงเงินรางวัลรวมกว่า 1 ล้านบาท เปิดรับสมัครทุกระดับอายุ"
      },
      features: {
        en: ["High School Category", "University Category", "General Public Category"],
        th: ["ระดับมัธยมศึกษา", "ระดับอุดมศึกษา", "ประชาชนทั่วไป"]
      },
      gradient: "from-[#AA4626] to-[#FCB283]",
      buttonText: {
        en: "Submit Film",
        th: "ส่งผลงาน"
      }
    },
    {
      id: 3,
      icon: "🎭",
      title: {
        en: "Entertainment Expo",
        th: "งานแสดงอุตสาหกรรมบันเทิง"
      },
      description: {
        en: "Showcase of Chiang Mai's entertainment industry. Meet educational institutions, content creators, and discover career opportunities. Join panel discussions and workshops by film industry experts and academics.",
        th: "งานแสดงผลงานภาคอุตสาหกรรมบันเทิงเชียงใหม่ พบกับสถานศึกษา เครือข่ายผู้ผลิตคอนเทนต์ โอกาสการงานในวงการ พร้อมเสวนาและอบรมจากผู้เชี่ยวชาญด้านอุตสาหกรรมภาพยนตร์และวิชาการ"
      },
      features: {
        en: ["Industry Showcase", "Career Opportunities", "Expert Workshops"],
        th: ["แสดงผลงานอุตสาหกรรม", "โอกาสการงาน", "อบรมจากผู้เชี่ยวชาญ"]
      },
      gradient: "from-[#A78BFA] to-[#F472B6]",
      buttonText: {
        en: "Explore Expo",
        th: "สำรวจงานแสดง"
      }
    },
    {
      id: 4,
      icon: "🎵",
      title: {
        en: "Concert and Fair",
        th: "คอนเสิร์ตและงานแฟร์"
      },
      description: {
        en: "Enjoy concerts by renowned and local artists, along with food markets and souvenir stalls in a special festival atmosphere.",
        th: "เพลิดเพลินกับคอนเสิร์ตจากศิลปินดังและท้องถิ่น ร่วมกับตลาดอาหารและของที่ระลึก ในบรรยากาศเทศกาลสุดพิเศษ"
      },
      features: {
        en: ["Live Concerts", "Food Markets", "Souvenir Stalls"],
        th: ["คอนเสิร์ตสด", "ตลาดอาหาร", "ร้านของที่ระลึก"]
      },
      gradient: "from-[#6EE7B7] to-[#3B82F6]",
      buttonText: {
        en: "Join Festival",
        th: "ร่วมงานเทศกาล"
      }
    },
    {
      id: 5,
      icon: "🎪",
      title: {
        en: "City Rally",
        th: "กิจกรรมเที่ยวเมือง"
      },
      description: {
        en: "Collect points by exploring Chiang Mai and participating in activities. Redeem rewards and discounts from participating local businesses.",
        th: "เก็บแต้มสะสมจากการเที่ยวชมเชียงใหม่และร่วมกิจกรรม แลกรางวัลและส่วนลดจากร้านค้าที่ร่วมโครงการ"
      },
      features: {
        en: ["5 Rally Locations", "Partner Discounts", "Exclusive Rewards"],
        th: ["5 จุดเก็บแต้ม", "ส่วนลดพาร์ทเนอร์", "รางวัลพิเศษ"]
      },
      gradient: "from-[#FCB283] to-[#AA4626]",
      buttonText: {
        en: "Start Rally",
        th: "เริ่มเก็บแต้ม"
      }
    }
  ];

  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  const currentLanguage = i18n.language as 'en' | 'th';

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2Fcifan2%404x.png?alt=media&token=730a1860-b80b-49b4-bbe5-3bc88c18e276"
              alt="CIFAN 2025 Logo"
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain"
            />
          </div>
          
          {/* Festival Programs Text */}
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-4 text-white`}>
            {currentLanguage === 'th' ? 'โปรแกรมเทศกาล' : 'Festival Programs'}
          </h2>
          
          <p className={`text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto ${getTypographyClass('body')} px-4`}>
            {currentLanguage === 'th' 
              ? 'ดื่มด่ำไปกับสัปดาห์แห่งภาพยนตร์แฟนตาสติก การแข่งขันสร้างสรรค์ และความเป็นเลิศทางอุตสาหกรรม'
              : 'Immerse yourself in a week of fantastic cinema, creative competitions, and industry excellence'
            }
          </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mt-12 sm:mt-16 md:mt-20 justify-items-center justify-center">
          {programs.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} currentLanguage={currentLanguage} />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

interface Program {
  id: number;
  icon: string;
  title: { en: string; th: string };
  description: { en: string; th: string };
  features: { en: string[]; th: string[] };
  gradient: string;
  buttonText: { en: string; th: string };
}

const ProgramCard = ({ program, index, currentLanguage }: { 
  program: Program; 
  index: number; 
  currentLanguage: 'en' | 'th' 
}) => {
  const { i18n } = useTranslation();
  const { getThaiAdjustedSize } = useResponsiveTypography();
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  return (
    <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-500 border border-white/10 flex flex-col h-full w-full max-w-sm mx-auto">
      {/* Card Header with Icon */}
      <div className={`h-32 sm:h-40 md:h-48 bg-gradient-to-br ${program.gradient} flex items-center justify-center relative overflow-hidden`}>
        <div className="text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
          {program.icon}
        </div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow text-center">
        <h3 className={`text-lg sm:text-xl md:text-2xl ${getTypographyClass('header')} mb-3 text-white group-hover:text-[#FCB283] transition-colors text-center`}>
          {program.title[currentLanguage]}
        </h3>
        <p className={`text-white/70 mb-4 sm:mb-6 leading-relaxed ${getTypographyClass('body')} text-center ${getThaiAdjustedSize('text-sm sm:text-base')}`}>
          {program.description[currentLanguage]}
        </p>

        {/* CTA Button */}
        <div className="mt-auto">
          <button 
            onClick={() => {
              // Navigate to competition page for Short Film Competition program, others go to coming soon
              if (program.id === 2) {
                window.location.hash = '#competition';
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              } else {
                window.location.hash = '#coming-soon';
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }
            }}
            className={`w-full glass-button-secondary py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-white/20 ${getTypographyClass('menu')} ${getThaiAdjustedSize('text-sm sm:text-base')} font-medium`}>
            {program.buttonText[currentLanguage]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramsSection;
