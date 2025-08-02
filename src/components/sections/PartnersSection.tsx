import React from 'react';
import { useTranslation } from 'react-i18next';

const PartnersSection = () => {
  const { i18n } = useTranslation();
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      title: "🤝 พาร์ทเนอร์และผู้สนับสนุน",
      subtitle: "CIFAN 2025 เกิดขึ้นได้ด้วยการสนับสนุนอย่างใจกว้างจากพาร์ทเนอร์และสปอนเซอร์ที่มีคุณค่า"
    },
    en: {
      title: "🤝 Partners & Supporters",
      subtitle: "CIFAN 2025 is made possible through the generous support of our valued partners and sponsors"
    }
  };

  const partners = {
    main: [
      { name: "Netflix", emoji: "🎬" },
      { name: "Major Cineplex", emoji: "🎭" },
      { name: "Central Group", emoji: "🏢" }
    ],
    support: [
      { name: "Tourism Authority", emoji: "🏛️" },
      { name: "Chiang Mai University", emoji: "🎓" },
      { name: "SF Cinema", emoji: "🎪" },
      { name: "Department of Culture", emoji: "🎨" },
      { name: "Provincial Admin", emoji: "🏛️" }
    ],
    friend: [
      { name: "Local Restaurant", emoji: "🍜" },
      { name: "Coffee Shop", emoji: "☕" },
      { name: "Hotel Chain", emoji: "🏨" },
      { name: "Transport Co", emoji: "🚌" },
      { name: "Tech Startup", emoji: "💻" },
      { name: "Art Gallery", emoji: "🖼️" },
      { name: "Music Store", emoji: "🎵" },
      { name: "Book Store", emoji: "📚" }
    ]
  };

  const currentContent = content[currentLanguage];

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-4 text-white`}>
            {currentContent.title}
          </h2>
          <p className={`text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto ${getTypographyClass('body')} px-4`}>
            {currentContent.subtitle}
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16">
          {/* Main Partners - Largest */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8">
              {partners.main.map((partner, index) => (
                <div key={index} className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl group-hover:scale-110 transition-transform duration-300">
                    {partner.emoji}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Partners - Medium */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6">
              {partners.support.map((partner, index) => (
                <div key={index} className="glass-card p-3 sm:p-4 rounded-lg sm:rounded-xl hover:scale-105 transition-all duration-300 group">
                  <div className="text-3xl sm:text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                    {partner.emoji}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Friend Partners - Small */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4">
              {partners.friend.map((partner, index) => (
                <div key={index} className="glass-card p-2 sm:p-3 rounded-md sm:rounded-lg hover:scale-105 transition-all duration-300 group">
                  <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                    {partner.emoji}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;