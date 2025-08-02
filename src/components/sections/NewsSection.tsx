import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsiveTypography } from '../../utils/fontSizeUtils';
import AnimatedButton from '../ui/AnimatedButton';

const NewsSection = () => {
  const { i18n } = useTranslation();
  const { getThaiAdjustedSize } = useResponsiveTypography();
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      title: "📢 ข่าวสารและอัปเดตล่าสุด",
      subtitle: "ติดตามประกาศ กำหนดเวลาสำคัญ และความคืบหน้าที่น่าตื่นเต้นจาก CIFAN 2025",
      viewAllNews: "ดูข่าวสารทั้งหมด",
      readMore: "อ่านเพิ่มเติม"
    },
    en: {
      title: "📢 Latest News & Updates",
      subtitle: "Stay updated with the latest announcements, deadlines, and exciting developments from CIFAN 2025",
      viewAllNews: "View All News",
      readMore: "Read More"
    }
  };

  const newsItems = [
    {
      id: 1,
      date: "July 12, 2025",
      datesTh: "12 กรกฎาคม 2568",
      title: {
        en: "Short Film Competition Now Open!",
        th: "เปิดรับสมัครประกวดภาพยนตร์สั้นแล้ว!"
      },
      excerpt: {
        en: "Start submitting your 'Chiang Mai Future' films. Competition runs until August 15th with 1 million baht in prizes.",
        th: "เริ่มส่งผลงานภาพยนตร์ 'เชียงใหม่ในอนาคต' ได้แล้ว การประกวดจะดำเนินไปจนถึง 15 สิงหาคม พร้อมเงินรางวัลรวม 1 ล้านบาท"
      },
      image: "📰",
      category: {
        en: "Competition", 
        th: "การประกวด"
      }
    },
    {
      id: 2, 
      date: "July 5, 2025",
      datesTh: "5 กรกฎาคม 2568",
      title: {
        en: "International Film Selection Announced",
        th: "ประกาศรายชื่อภาพยนตร์นานาชาติ"
      },
      excerpt: {
        en: "20 fantastic films from around the world have been selected for CIFAN 2025 screenings.",
        th: "ภาพยนตร์แฟนตาสติก 20 เรื่องจากทั่วโลกได้รับการคัดเลือกสำหรับการฉาย CIFAN 2025"
      },
      image: "🎬",
      category: {
        en: "Programming",
        th: "โปรแกรม"
      }
    },
    {
      id: 3,
      date: "June 28, 2025", 
      datesTh: "28 มิถุนายน 2568",
      title: {
        en: "City Rally Kicks Off Early!",
        th: "กิจกรรมเที่ยวเมืองเริ่มต้นแล้ว!"
      },
      excerpt: {
        en: "Start collecting points now! Find Kham Pan Cat at 5 locations around Chiang Mai city.",
        th: "เริ่มเก็บแต้มได้แล้ว! ตามหาข้าวปั่นแคทที่ 5 จุดรอบเมืองเชียงใหม่"
      },
      image: "🎪",
      category: {
        en: "City Rally",
        th: "เที่ยวเมือง"
      }
    }
  ];

  const currentContent = content[currentLanguage];

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 relative mt-8 sm:mt-12 md:mt-16">
      {/* Clear visual separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-4 text-white`}>
            {currentContent.title}
          </h2>
          <p className={`text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto ${getTypographyClass('body')} leading-relaxed px-4`}>
            {currentContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {newsItems.map((item, index) => (
            <article key={item.id} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-white/10">
              
              {/* News Image/Icon */}
              <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-br from-[#3B6891] to-[#00305A] flex items-center justify-center relative">
                <span className="text-4xl sm:text-5xl md:text-6xl">{item.image}</span>
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className={`px-2 sm:px-3 py-1 text-xs ${getTypographyClass('menu')} bg-[#FCB283] text-[#110D16] rounded-full`}>
                    {item.category[currentLanguage]}
                  </span>
                </div>
              </div>

              {/* News Content */}
              <div className="p-4 sm:p-6">
                <div className={`text-xs sm:text-sm text-[#FCB283] mb-2 ${getTypographyClass('body')}`}>
                  {currentLanguage === 'th' ? item.datesTh : item.date}
                </div>
                <h3 className={`text-lg sm:text-xl ${getTypographyClass('subtitle')} mb-3 text-white leading-tight`}>
                  {item.title[currentLanguage]}
                </h3>
                <p className={`text-white/70 mb-4 leading-relaxed ${getTypographyClass('body')} ${getThaiAdjustedSize('text-sm sm:text-base')}`}>
                  {item.excerpt[currentLanguage]}
                </p>
                <button className={`text-[#FCB283] ${getTypographyClass('menu')} hover:text-white transition-colors text-sm`}>
                  {currentContent.readMore} →
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <AnimatedButton 
            variant="outline" 
            size="large" 
            icon="📰"
            onClick={() => {
              window.location.hash = '#coming-soon';
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            {currentContent.viewAllNews}
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
