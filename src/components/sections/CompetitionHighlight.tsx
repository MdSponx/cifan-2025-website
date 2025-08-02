import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import { useAuthFlow } from '../auth/AuthFlowProvider';
import AnimatedButton from '../ui/AnimatedButton';

const CompetitionHighlight = () => {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { setRedirectIntent } = useAuthFlow();
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      title: "การประกวดภาพยนตร์สั้นแฟนตาสติกโลก",
      theme: 'หัวข้อ: "เชียงใหม่ในอนาคต" (Chiang Mai Future)',
      description: "สร้างสรรค์ภาพยนตร์สั้นแนวแฟนตาสติกที่จินตนาการถึงอนาคตของเมืองเชียงใหม่ ผ่านมุมมองความคิดสร้างสรรค์และเทคนิคการถ่ายทำที่โดดเด่น",
      totalPrize: "รางวัลรวม: กว่า 1,000,000 บาท",
      categories: "หมวดการประกวด: นักเรียน / นักศึกษา / ประชาชนทั่วไป",
      rulesTitle: "กติกาสำคัญ",
      rules: [
        "ความยาว: 5-10 นาที (รวมไตเติลและเครดิต)",
        "รูปแบบ: Live Action หรือ Animation",
        "เนื้อหา: ต้องเกี่ยวข้องกับเชียงใหม่อย่างชัดเจน",
        "ความเป็นต้นฉบับ: ผลงานใหม่ที่สร้างเพื่อการประกวดนี้เท่านั้น",
        "ลิขสิทธิ์: ผู้ส่งต้องเป็นเจ้าของลิขสิทธิ์ทั้งหมด",
        "การใช้ AI: อนุญาตให้ใช้ AI สร้างภาพเคลื่อนไหว แต่ห้ามใช้ AI ในการสร้างสรรค์เรื่องราว/บท"
      ],
      viewDetails: "ดูรายละเอียด",
      note: "หมายเหตุ: ผู้ส่งผลงานต้องเป็นผู้กำกับหลักหรือผู้ผลิตหลักของภาพยนตร์"
    },
    en: {
      title: "World Fantastic Short Film Competition",
      theme: 'Theme: "Chiang Mai Future"',
      description: "Create fantastic short films that imagine the future of Chiang Mai through creative vision and outstanding cinematography techniques.",
      totalPrize: "Total Prizes: Over 1,000,000 Baht",
      categories: "Categories: High School / University / General Public",
      rulesTitle: "Key Rules",
      rules: [
        "Duration: 5-10 minutes (including titles and credits)",
        "Format: Live Action or Animation",
        "Content: Must clearly relate to Chiang Mai",
        "Originality: New work created exclusively for this competition",
        "Copyright: Participants must own all copyrights",
        "AI Usage: AI-generated video is allowed, but AI cannot be used for story/script creation"
      ],
      viewDetails: "View Details",
      note: "Note: Applicants must be the main director or main producer of the film"
    }
  };

  const awards = [
    {
      id: 1,
      logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
      title: {
        th: "รางวัลหนังสั้นแฟนตาสติกเยาวชน",
        en: "Youth Fantastic Short Film Award"
      },
      prize: "160",
      details: {
        th: [
          "นักเรียนระดับมัธยมศึกษา (ม.1-ม.6) หรือเทียบเท่า",
          "อายุ 12-18 ปี",
          "สามารถส่งผลงานเป็นทีมหรือเดี่ยว (ทีมไม่เกิน 10 คน)"
        ],
        en: [
          "High school students (Grade 7-12) or equivalent",
          "Age 12-18 years",
          "Individual or team submission (max 10 members)"
        ]
      },
      gradient: "from-[#6EE7B7] to-[#3B82F6]"
    },
    {
      id: 2,
      logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
      title: {
        th: "รางวัลหนังสั้นแฟนตาสติกอนาคต",
        en: "Future Fantastic Short Film Award"
      },
      prize: "380",
      details: {
        th: [
          "นักศึกษาระดับอุดมศึกษา หรือเทียบเท่า",
          "อายุไม่เกิน 25 ปี",
          "สามารถส่งผลงานเป็นทีมหรือเดี่ยว (ทีมไม่เกิน 10 คน)"
        ],
        en: [
          "University students or equivalent",
          "Age not exceeding 25 years",
          "Individual or team submission (max 10 members)"
        ]
      },
      gradient: "from-[#A78BFA] to-[#F472B6]"
    },
    {
      id: 3,
      logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67",
      title: {
        th: "รางวัลหนังสั้นแฟนตาสติกโลก",
        en: "World Fantastic Short Film Award"
      },
      prize: "460",
      details: {
        th: [
          "ประชาชนทั่วไป ไม่จำกัดอายุ",
          "เปิดรับผลงานจากทั่วโลก",
          "สามารถส่งผลงานเป็นทีมหรือเดี่ยว (ทีมไม่เกิน 15 คน)"
        ],
        en: [
          "General public, no age limit",
          "Open to submissions worldwide",
          "Individual or team submission (max 15 members)"
        ]
      },
      gradient: "from-[#FCB283] to-[#AA4626]"
    }
  ];

  const scheduleContent = {
    th: {
      title: "📅 กำหนดการส่งหนังสั้น",
      items: [
        "เปิดรับสมัคร: 15 กรกฎาคม 2568",
        "ปิดรับสมัคร: 5 กันยายน 2568", 
        "ประกาศผลรอบคัดเลือก: 12 กันยายน 2568",
        "เทศกาลภาพยนตร์: 20-27 กันยายน 2568",
        "ประกาศผลรางวัล: 27 กันยายน 2568"
      ]
    },
    en: {
      title: "📅 Short Film Submission Timeline",
      items: [
        "Submission Opens: July 15, 2025",
        "Submission Deadline: September 5, 2025",
        "Shortlist Announcement: September 12, 2025", 
        "Film Festival Dates: September 20–27, 2025",
        "Award Announcement: September 27, 2025"
      ]
    }
  };

  const currentContent = content[currentLanguage];
  const currentSchedule = scheduleContent[currentLanguage];

  // Smart navigation for submission buttons
  const handleSubmissionClick = (category: 'youth' | 'future' | 'world') => {
    const routes = {
      youth: '#submit-youth',
      future: '#submit-future',
      world: '#submit-world'
    };
    
    if (!isAuthenticated) {
      setRedirectIntent(routes[category]);
      window.location.hash = '#auth/signup';
    } else {
      window.location.hash = routes[category];
    }
  };
  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden min-h-screen">
      {/* Fantasy Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.appspot.com/o/site_files%2Fcat%2Fa807142ab209ecf0a1d6296ae10304197a0f5691c6a98f421eb8fb4ee0b9892b.jpg?alt=media&token=62da39c8-80d0-4e64-93b8-817024b6a3cb')`
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Two Column Layout - Adjusted Ratios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Competition Overview - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Left Column with Fantasy Background */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[500px] sm:min-h-[600px]">
              {/* Fantasy Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Fcat%2Fa807142ab209ecf0a1d6296ae10304197a0f5691c6a98f421eb8fb4ee0b9892b.jpg?alt=media&token=62da39c8-80d0-4e64-93b8-817024b6a3cb')`
                }}
              />
              
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/70"></div>
              
              {/* Content */}
              <div className="relative z-10 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Competition Logo */}
              <div className="flex justify-center lg:justify-start mb-4 sm:mb-6 md:mb-8">
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FT1%404x.png?alt=media&token=d4cdf90f-fc4a-4b33-a047-65efb75a0dae"
                  alt="Short Film Competition Logo"
                  className="h-16 sm:h-20 md:h-24 w-auto object-contain animate-bounce filter drop-shadow-[0_0_20px_rgba(252,178,131,0.6)]"
                />
              </div>

              {/* Title */}
              <h2 className={`text-3xl md:text-4xl ${getTypographyClass('header')} mb-4 text-white leading-tight`}>
                {currentContent.title}
              </h2>
              <h3 className={`${
                currentLanguage === 'th'
                  ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl' 
                  : 'text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl'
              } ${getTypographyClass('subtitle')} mb-4 sm:mb-6 text-[#FCB283] text-center lg:text-left`}>
                {currentContent.theme}
              </h3>
              
              {/* Description */}
              <p className={`text-white/80 ${getTypographyClass('body')} leading-relaxed mb-6 sm:mb-8 text-center lg:text-left ${
                currentLanguage === 'th' 
                  ? 'text-sm sm:text-base' 
                  : 'text-sm sm:text-base md:text-lg'
              }`}>
                {currentContent.description}
              </p>
              
              {/* Prize and Categories */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-center lg:text-left">
                <p className={`text-[#FCB283] ${getTypographyClass('subtitle')} text-xl sm:text-2xl md:text-3xl font-bold animate-pulse filter drop-shadow-[0_0_15px_rgba(252,178,131,0.8)]`}>
                  {currentContent.totalPrize}
                </p>
                <p className={`text-white/80 ${getTypographyClass('body')} text-sm sm:text-base`}>
                  {currentContent.categories}
                </p>
              </div>

              {/* Rules Section */}
              <div className="mb-6 sm:mb-8">
                <h4 className={`text-lg sm:text-xl ${getTypographyClass('subtitle')} text-white mb-3 sm:mb-4 text-center lg:text-left`}>
                  {currentContent.rulesTitle}
                </h4>
                <ul className="space-y-1 sm:space-y-2">
                  {currentContent.rules.map((rule, index) => (
                    <li key={index} className={`text-white/80 ${getTypographyClass('body')} text-left ${
                      currentLanguage === 'th' ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm md:text-base'
                    } flex items-start`}>
                      <span className="text-[#FCB283] mr-2 mt-1 flex-shrink-0">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submission Schedule */}
              <div className="mb-6 sm:mb-8">
                <h4 className={`text-lg sm:text-xl ${getTypographyClass('subtitle')} text-[#FCB283] mb-3 sm:mb-4 text-center lg:text-left`}>
                  {currentSchedule.title}
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {currentSchedule.items.map((item, index) => (
                    <li key={index} className={`text-white/90 ${getTypographyClass('body')} text-left ${
                      currentLanguage === 'th' ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm md:text-base'
                    } flex items-start`}>
                      <span className="text-[#FCB283] mr-3 mt-1 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => window.location.hash = '#competition'}
                className={`liquid-glass-button ${getTypographyClass('menu')}`}
              >
                {currentContent.viewDetails}
              </button>
              </div>
            </div>
          </div>

          {/* Right Column: Award Categories - 1/3 width */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 flex flex-col h-full">
            {awards.map((award) => (
              <div key={award.id} className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 hover:scale-105 transition-all duration-300 flex flex-col flex-1">
                {/* Logo - Largest Element */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28">
                    <img 
                      src={award.logo}
                      alt={award.title[currentLanguage] + " Logo"}
                      className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                  </div>
                </div>

                {/* Competition Title - Second Priority */}
                <div className="text-center mb-2 sm:mb-3">
                  <h3 className={`text-base sm:text-lg md:text-xl ${getTypographyClass('subtitle')} text-white leading-tight`}>
                    {award.title[currentLanguage]}
                  </h3>
                </div>

                {/* Total Prize - Smaller */}
                <div className="text-center mb-3 sm:mb-4">
                  <p className={`text-sm sm:text-base ${getTypographyClass('body')} text-[#FCB283] font-medium`}>
                    {currentLanguage === 'th' ? `รางวัลรวม: ${award.prize},000 บาท` : `Total Prize: ${award.prize},000 THB`}
                  </p>
                </div>

                {/* Award Details */}
                <div className="flex-1">
                  <ul className="space-y-1 sm:space-y-2">
                  {award.details[currentLanguage].map((detail, index) => (
                      <li key={index} className={`text-white/80 ${getTypographyClass('body')} ${
                      currentLanguage === 'th' ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm md:text-base'
                      } flex items-start leading-relaxed`}>
                        <span className="text-[#FCB283] mr-3 mt-1 flex-shrink-0">✨</span>
                        {detail}
                      </li>
                  ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionHighlight;
