import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedButton from '../ui/AnimatedButton';
import { useAuth } from '../auth/AuthContext';
import { AGE_LIMITS } from '../../utils/formConstants';

const CompetitionPage = () => {
  const { i18n } = useTranslation();
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };
  const { userProfile } = useAuth();
  const [showAgeWarningModal, setShowAgeWarningModal] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<{ id: number; title: { th: string; en: string }; route: string } | null>(null);
  const [originalCategory, setOriginalCategory] = useState<{ id: number; title: { th: string; en: string }; route: string } | null>(null);

  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      pageTitle: "การประกวดภาพยนตร์สั้นแฟนตาสติกโลก",
      heroSubtitle: 'หัวข้อ: "เชียงใหม่ในอนาคต" (Chiang Mai Future)',
      description: "สร้างสรรค์ภาพยนตร์สั้นแนวแฟนตาสติกที่จินตนาการถึงอนาคตของเมืองเชียงใหม่ ผ่านมุมมองความคิดสร้างสรรค์และเทคนิคการถ่ายทำที่โดดเด่น",
      totalPrize: "รางวัลรวม: กว่า 1,000,000 บาท",
      
      // Competition Categories
      categoriesTitle: "หมวดการประกวด",
      categories: [
        {
          id: 1,
          logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
          title: "รางวัลหนังสั้นแฟนตาสติกเยาวชน",
          subtitle: "Youth Fantastic Short Film Award",
          totalPrize: "160,000 บาท",
          eligibility: [
            "นักเรียนระดับมัธยมศึกษา (ม.1-ม.6) หรือเทียบเท่า",
            "อายุ 12-18 ปี",
            "สามารถส่งผลงานเป็นทีมหรือเดี่ยว (ทีมไม่เกิน 10 คน)"
          ],
          prizes: [
            { place: "รางวัลชนะเลิศ", amount: "70,000 บาท" },
            { place: "รางวัลรองชนะเลิศอันดับ 1", amount: "35,000 บาท" },
            { place: "รางวัลรองชนะเลิศอันดับ 2", amount: "25,000 บาท" },
            { place: "รางวัลพิเศษ (4 รางวัล)", amount: "5,000 บาท/รางวัล" },
            { place: "รางวัลโหวตประชาชน", amount: "10,000 บาท" }
          ]
        },
        {
          id: 2,
          logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
          title: "รางวัลหนังสั้นแฟนตาสติกอนาคต",
          subtitle: "Future Fantastic Short Film Award",
          totalPrize: "380,000 บาท",
          eligibility: [
            "นักศึกษาระดับอุดมศึกษา หรือเทียบเท่า",
            "อายุไม่เกิน 25 ปี",
            "สามารถส่งผลงานเป็นทีมหรือเดี่ยว (ทีมไม่เกิน 10 คน)"
          ],
          prizes: [
            { place: "รางวัลชนะเลิศ", amount: "150,000 บาท" },
            { place: "รางวัลรองชนะเลิศอันดับ 1", amount: "100,000 บาท" },
            { place: "รางวัลรองชนะเลิศอันดับ 2", amount: "50,000 บาท" },
            { place: "รางวัลพิเศษ (3 รางวัล)", amount: "20,000 บาท/รางวัล" },
             { place: "รางวัลสุดประทับใจ (2 รางวัล)", amount: "5,000 บาท/รางวัล" },
            { place: "รางวัลโหวตประชาชน", amount: "10,000 บาท" }
          ]
        },
        {
          id: 3,
          logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67",
          title: "รางวัลหนังสั้นแฟนตาสติกโลก",
          subtitle: "World Fantastic Short Film Award",
          totalPrize: "460,000 บาท",
          eligibility: [
            "ประชาชนทั่วไป ไม่จำกัดอายุ",
            "เปิดรับผลงานจากทั่วโลก",
            "สามารถส่งผลงานเป็นทีมหรือเดี่ยว (ทีมไม่เกิน 15 คน)"
          ],
          prizes: [
            { place: "รางวัลชนะเลิศ", amount: "200,000 บาท" },
            { place: "รางวัลรองชนะเลิศอันดับ 1", amount: "150,000 บาท" },
            { place: "รางวัลรองชนะเลิศอันดับ 2", amount: "50,000 บาท" },
            { place: "รางวัลพิเศษ (2 รางวัล)", amount: "20,000 บาท/รางวัล" },
            { place: "รางวัลสุดประทับใจ (2 รางวัล)", amount: "5,000 บาท/รางวัล" },
            { place: "รางวัลโหวตประชาชน", amount: "10,000 บาท" }
          ]
        }
      ],

      // Rules and Guidelines
      rulesTitle: "กติกาและเงื่อนไขการประกวด",
      generalRules: [
        {
          title: "⏱️ ความยาวภาพยนตร์",
          description: "5-10 นาที (รวมไตเติลและเครดิต)"
        },
        {
          title: "🎬 รูปแบบภาพยนตร์",
          description: "Live Action หรือ Animation"
        },
        {
          title: "📍 เนื้อหา",
          description: "ต้องเกี่ยวข้องกับเชียงใหม่อย่างชัดเจน และสอดคล้องกับธีม \"เชียงใหม่ในอนาคต\""
        },
        {
          title: "✨ ความเป็นต้นฉบับ",
          description: "ผลงานใหม่ที่สร้างเพื่อการประกวดนี้เท่านั้น ห้ามส่งผลงานที่เคยเข้าประกวดหรือเผยแพร่แล้ว"
        },
        {
          title: "©️ ลิขสิทธิ์",
          description: "ผู้ส่งต้องเป็นเจ้าของลิขสิทธิ์ทั้งหมด รวมถึงเพลง เสียงประกอบ และภาพทุกส่วน"
        },
        {
          title: "🤖 การใช้ AI",
          description: "อนุญาตให้ใช้ AI สร้างภาพเคลื่อนไหว แต่ห้ามใช้ AI ในการสร้างสรรค์เรื่องราว/บท"
        },
        {
          title: "🗣️ ภาษา",
          description: "ภาษาไทยหรือภาษาอังกฤษ (หากใช้ภาษาอื่นต้องมีซับไตเติลภาษาไทยหรืออังกฤษ)"
        },
        {
          title: "💾 รูปแบบไฟล์",
          description: "MP4, MOV เท่านั้น ความละเอียดขั้นต่ำ 1080p"
        }
      ],

      // Timeline
      timelineTitle: "กำหนดการส่งหนังสั้น",
      timeline: [
        { date: "15 กรกฎาคม 2568", event: "เปิดรับสมัคร" },
        { date: "5 กันยายน 2568", event: "ปิดรับสมัคร" },
        { date: "12 กันยายน 2568", event: "ประกาศผลรอบคัดเลือก" },
        { date: "20-27 กันยายน 2568", event: "เทศกาลภาพยนตร์" },
        { date: "27 กันยายน 2568", event: "ประกาศผลรางวัล" }
      ],

      // Submission Requirements
      submissionTitle: "เอกสารที่ต้องส่ง",
      submissionDocs: [
        "ไฟล์ภาพยนตร์สั้น (MP4, MOV เท่านั้น)",
        "โปสเตอร์ภาพยนตร์ (JPG หรือ PNG ความละเอียด 300 DPI)",
        "Synopsis ภาษาไทยและอังกฤษ (ไม่เกิน 200 คำ)",
        "ประวัติผู้กำกับ/ทีมงาน",
        "หนังสือยินยอมการใช้ลิขสิทธิ์ (หากมี)",
        "สำเนาบัตรประชาชนหรือหนังสือเดินทาง"
      ],

      // Judging Criteria
      judgingTitle: "เกณฑ์การตัดสิน",
      judgingCriteria: [
        { criteria: "ความคิดสร้างสรรค์และนวัตกรรม", weight: "20%" },
        { criteria: "เทคนิคการถ่ายทำและการตัดต่อ", weight: "20%" },
        { criteria: "การเล่าเรื่องและโครงสร้าง", weight: "20%" },
        { criteria: "ความเกี่ยวข้องกับธีม \"เชียงใหม่ในอนาคต\"", weight: "20%" },
         { criteria: "ความพยายามในการสร้าง", weight: "20%" },
      ],

      submitNow: "ส่งผลงานเลย",
      downloadGuidelines: "ดาวน์โหลดคู่มือ",
      contactUs: "ติดต่อสอบถาม"
    },
    en: {
      pageTitle: "World Fantastic Short Film Competition",
      heroSubtitle: 'Theme: "Chiang Mai Future"',
      description: "Create fantastic short films that imagine the future of Chiang Mai through creative vision and outstanding cinematography techniques.",
      totalPrize: "Total Prizes: Over 1,000,000 Baht",
      
      // Competition Categories
      categoriesTitle: "Competition Categories",
      categories: [
        {
          id: 1,
          logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
          title: "Youth Fantastic Short Film Award",
          subtitle: "รางวัลหนังสั้นแฟนตาสติกเยาวชน",
          totalPrize: "160,000 THB",
          eligibility: [
            "High school students (Grade 7-12) or equivalent",
            "Age 12-18 years",
            "Individual or team submission (max 10 members)"
          ],
          prizes: [
            { place: "Winner", amount: "70,000 THB" },
            { place: "1st Runner-up", amount: "35,000 THB" },
            { place: "2nd Runner-up", amount: "25,000 THB" },
            { place: "Special Awards (4 prize)", amount: "5,000 THB each" },
            { place: "Popular Vote", amount: "10,000 THB" },
          ]
        },
        {
          id: 2,
          logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
          title: "Future Fantastic Short Film Award",
          subtitle: "รางวัลหนังสั้นแฟนตาสติกอนาคต",
          totalPrize: "380,000 THB",
          eligibility: [
            "University students or equivalent",
            "Age not exceeding 25 years",
            "Individual or team submission (max 10 members)"
          ],
          prizes: [
            { place: "Winner", amount: "150,000 THB" },
            { place: "1st Runner-up", amount: "100,000 THB" },
            { place: "2nd Runner-up", amount: "50,000 THB" },
            { place: "Special Awards (3 prizes)", amount: "20,000 THB each" },
              { place: "Honorable Mentioned (2 prizes)", amount: "5,000 THB each" },
            { place: "Popular Vote", amount: "10,000 THB" }
        
          ]
        },
        {
          id: 3,
          logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67",
          title: "World Fantastic Short Film Award",
          subtitle: "รางวัลหนังสั้นแฟนตาสติกโลก",
          totalPrize: "460,000 THB",
          eligibility: [
            "General public, no age limit",
            "Open to submissions worldwide",
            "Individual or team submission (max 15 members)"
          ],
          prizes: [
            { place: "Winner", amount: "200,000 THB" },
            { place: "1st Runner-up", amount: "150,000 THB" },
            { place: "2nd Runner-up", amount: "50,000 THB" },
            { place: "Special Awards (2 prizes)", amount: "20,000 THB each" },
            { place: "Honorable Mention (2 prizes)", amount: "5,000 THB each" },
            { place: "Popular Vote", amount: "10,000 THB" },
          ]
        }
      ],

      // Rules and Guidelines
      rulesTitle: "Competition Rules & Guidelines",
      generalRules: [
        {
          title: "⏱️ Film Duration",
          description: "5-10 minutes (including titles and credits)"
        },
        {
          title: "🎬 Film Format",
          description: "Live Action or Animation"
        },
        {
          title: "📍 Content",
          description: "Must clearly relate to Chiang Mai and align with the \"Chiang Mai Future\" theme"
        },
        {
          title: "✨ Originality",
          description: "New work created exclusively for this competition. Previously submitted or published works are not allowed"
        },
        {
          title: "©️ Copyright",
          description: "Participants must own all copyrights including music, sound effects, and all visual elements"
        },
        {
          title: "🤖 AI Usage",
          description: "AI-generated video is allowed, but AI cannot be used for story/script creation"
        },
        {
          title: "🗣️ Language",
          description: "Thai or English (other languages must include Thai or English subtitles)"
        },
        {
          title: "💾 File Format",
          description: "MP4, MOV ONLY with minimum 1080p resolution"
        }
      ],

      // Timeline
      timelineTitle: "Submission Timeline",
      timeline: [
        { date: "July 15, 2025", event: "Submission Opens" },
        { date: "September 5, 2025", event: "Submission Deadline" },
        { date: "September 12, 2025", event: "Shortlist Announcement" },
        { date: "September 20-27, 2025", event: "Film Festival Dates" },
        { date: "September 27, 2025", event: "Award Announcement" }
      ],

      // Submission Requirements
      submissionTitle: "Required Documents",
      submissionDocs: [
        "Short film file (MP4, MOV Only)",
        "Film poster (JPG or PNG, 300 DPI resolution)",
        "Synopsis in Thai and English (max 200 words)",
        "Director/team biography",
        "Copyright consent letter (if applicable)",
        "Copy of ID card or passport"
      ],

      // Judging Criteria
      judgingTitle: "Judging Criteria",
      judgingCriteria: [
        { criteria: "Creativity and Innovation", weight: "20%" },
        { criteria: "Cinematography and Editing Techniques", weight: "20%" },
        { criteria: "Storytelling and Structure", weight: "20%" },
        { criteria: "Relevance to \"Chiang Mai Future\" Theme", weight: "20%" },
        { criteria: "Human Effort in Creation", weight: "20%" }
      ],

      submitNow: "Submit Now",
      downloadGuidelines: "Download Guidelines",
      contactUs: "Contact Us"
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    const categoryMap: { [key: number]: string } = {
      1: 'submit-youth',
      2: 'submit-future',
      3: 'submit-world'
    };
    const categoryNameMap: { [key: number]: 'YOUTH' | 'FUTURE' | 'WORLD' } = {
      1: 'YOUTH',
      2: 'FUTURE',
      3: 'WORLD'
    };

    const clickedCategory = currentContent.categories.find(category => category.id === categoryId);
    if (!clickedCategory) return;

    const originalRoute = `#${categoryMap[categoryId]}`;
    setOriginalCategory({ ...clickedCategory, route: originalRoute });

    if (!userProfile || !userProfile.age) {
      // If user is not logged in or age is not available, proceed directly.
      // ProtectedRoute on submission page will handle login/profile completion.
      window.location.hash = originalRoute;
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }

    const userAge = userProfile.age;
    const targetCategoryType = categoryNameMap[categoryId];
    const targetLimits = AGE_LIMITS[targetCategoryType];

    // Check if user's age fits the clicked category
    if (userAge >= targetLimits.min && userAge <= targetLimits.max) {
      window.location.hash = originalRoute;
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      // Age does not fit, find a suggested category
      let bestSuggested: { id: number; title: { th: string; en: string }; route: string } | null = null;
      for (const category of currentContent.categories) {
        const currentCategoryType = categoryNameMap[category.id];
        const currentLimits = AGE_LIMITS[currentCategoryType];
        if (userAge >= currentLimits.min && userAge <= currentLimits.max) {
          bestSuggested = { ...category, route: `#${categoryMap[category.id]}` };
          break; // Found a suitable category
        }
      }
      setSuggestedCategory(bestSuggested);
      setShowAgeWarningModal(true);
    }
  };

  const categoryNameMap: { [key: number]: 'YOUTH' | 'FUTURE' | 'WORLD' } = {
    1: 'YOUTH',
    2: 'FUTURE',
    3: 'WORLD'
  };

  const currentContent = content[currentLanguage];

  return (
    <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Background with Competition Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FT1%404x.png?alt=media&token=d4cdf90f-fc4a-4b33-a047-65efb75a0dae"
            alt="Competition Logo Background"
            className="w-full max-w-6xl h-auto object-contain"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Competition Logo */}
          <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FT1%404x.png?alt=media&token=d4cdf90f-fc4a-4b33-a047-65efb75a0dae"
              alt="Short Film Competition Logo"
              className="h-20 sm:h-24 md:h-32 lg:h-40 xl:h-48 w-auto object-contain animate-fade-in-up filter drop-shadow-[0_0_20px_rgba(252,178,131,0.6)]"
            />
          </div>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${getTypographyClass('header')} mb-6 sm:mb-8 leading-tight`}>
            <span className="bg-gradient-to-r from-[#FCB283] via-[#AA4626] to-[#FCB283] bg-clip-text text-transparent animate-gradient-shift">
              {currentContent.pageTitle}
            </span>
          </h1>
          
          <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ${getTypographyClass('subtitle')} text-[#FCB283] mb-6 sm:mb-8`}>
            {currentContent.heroSubtitle}
          </h2>
          
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${getTypographyClass('body')} text-white/90 max-w-5xl mx-auto leading-relaxed mb-6 sm:mb-8`}>
            {currentContent.description}
          </p>
          
          <p className={`text-xl sm:text-2xl md:text-3xl ${getTypographyClass('subtitle')} text-[#FCB283] font-bold animate-pulse filter drop-shadow-[0_0_15px_rgba(252,178,131,0.8)]`}>
            {currentContent.totalPrize}
          </p>
        </div>
      </section>

      {/* Competition Categories Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 text-white`}>
              {currentContent.categoriesTitle}
            </h2>
          </div>
          
          <div className="space-y-8 sm:space-y-12">
            {currentContent.categories.map((category) => (
              <div key={category.id} className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                  
                  {/* Category Info */}
                  <div className="lg:col-span-1">
                    <div className="text-center mb-6">
                      <img 
                        src={category.logo}
                        alt={category.title + " Logo"}
                        className="h-20 sm:h-24 md:h-28 w-auto object-contain mx-auto mb-4 filter drop-shadow-lg"
                      />
                      <h3 className={`text-lg sm:text-xl md:text-2xl ${getTypographyClass('header')} text-white mb-2`}>
                        {category.title}
                      </h3>
                      <p className={`text-sm sm:text-base ${getTypographyClass('body')} text-white/70 mb-4`}>
                        {category.subtitle}
                      </p>
                      <p className={`text-lg sm:text-xl ${getTypographyClass('subtitle')} text-[#FCB283] font-bold`}>
                        {category.totalPrize}
                      </p>
                    </div>
                    
                    {/* Eligibility */}
                    <div className="mb-6">
                      <h4 className={`text-base sm:text-lg ${getTypographyClass('subtitle')} text-white mb-3`}>
                        {currentLanguage === 'th' ? 'คุณสมบัติผู้เข้าประกวด' : 'Eligibility'}
                      </h4>
                      <ul className="space-y-2">
                        {category.eligibility.map((item, index) => (
                          <li key={index} className={`text-white/80 ${getTypographyClass('body')} text-sm sm:text-base flex items-start`}>
                            <span className="text-[#FCB283] mr-3 mt-1 flex-shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <AnimatedButton 
                      variant="primary" 
                      size="medium" 
                      icon="📋"
                      className={`w-full ${getTypographyClass('menu')}`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {currentContent.submitNow}
                    </AnimatedButton>
                  </div>

                  {/* Prize Table */}
                  <div className="lg:col-span-2">
                    <h4 className={`text-lg sm:text-xl ${getTypographyClass('subtitle')} text-white mb-4 text-center lg:text-left`}>
                      {currentLanguage === 'th' ? 'โครงสร้างรางวัล' : 'Prize Structure'}
                    </h4>
                    <div className="glass-card rounded-xl overflow-hidden border border-white/10">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-[#AA4626] to-[#FCB283]">
                            <th className={`px-4 py-3 text-left ${getTypographyClass('subtitle')} text-white text-sm sm:text-base`}>
                              {currentLanguage === 'th' ? 'รางวัล' : 'Award'}
                            </th>
                            <th className={`px-4 py-3 text-right ${getTypographyClass('subtitle')} text-white text-sm sm:text-base`}>
                              {currentLanguage === 'th' ? 'เงินรางวัล' : 'Prize Money'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.prizes.map((prize, index) => (
                            <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className={`px-4 py-3 ${getTypographyClass('body')} text-white/90 text-sm sm:text-base`}>
                                {prize.place}
                              </td>
                              <td className={`px-4 py-3 text-right ${getTypographyClass('body')} text-[#FCB283] font-bold text-sm sm:text-base`}>
                                {prize.amount}
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-[#FCB283] bg-gradient-to-r from-[#AA4626]/20 to-[#FCB283]/20">
                            <td className={`px-4 py-3 ${getTypographyClass('subtitle')} text-white font-bold text-sm sm:text-base`}>
                              {currentLanguage === 'th' ? 'รางวัลรวม' : 'Total Prize'}
                            </td>
                            <td className={`px-4 py-3 text-right ${getTypographyClass('subtitle')} text-[#FCB283] font-bold text-base sm:text-lg`}>
                              {category.totalPrize}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules and Guidelines Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 text-white`}>
              {currentContent.rulesTitle}
            </h2>
          </div>
          
          <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {currentContent.generalRules.map((rule, index) => (
                <div key={index} className="glass-card p-4 sm:p-6 rounded-xl border border-white/10">
                  <h4 className={`text-base sm:text-lg ${getTypographyClass('subtitle')} text-[#FCB283] mb-3`}>
                    {rule.title}
                  </h4>
                  <p className={`text-white/80 ${getTypographyClass('body')} text-sm sm:text-base leading-relaxed`}>
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 text-white`}>
              {currentContent.timelineTitle}
            </h2>
          </div>
          
          <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
            <div className="space-y-4 sm:space-y-6">
              {currentContent.timeline.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-6 glass-card rounded-xl border border-white/10">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#FCB283] to-[#AA4626] flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[#FCB283] ${getTypographyClass('subtitle')} font-bold text-lg sm:text-xl md:text-2xl mb-1 animate-pulse filter drop-shadow-[0_0_15px_rgba(252,178,131,0.8)]`}>
                      {item.date}
                    </p>
                    <p className={`text-white/90 ${getTypographyClass('body')} text-sm sm:text-base`}>
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Submission Requirements & Judging Criteria */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            
            {/* Submission Requirements */}
            <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <h3 className={`text-xl sm:text-2xl md:text-3xl ${getTypographyClass('header')} text-white mb-6 text-center`}>
                {currentContent.submissionTitle}
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {currentContent.submissionDocs.map((doc, index) => (
                  <li key={index} className={`text-white/80 ${getTypographyClass('body')} text-sm sm:text-base flex items-start`}>
                    <span className="text-[#FCB283] mr-3 mt-1 flex-shrink-0">📄</span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Judging Criteria */}
            <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <h3 className={`text-xl sm:text-2xl md:text-3xl ${getTypographyClass('header')} text-white mb-6 text-center`}>
                {currentContent.judgingTitle}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {currentContent.judgingCriteria.map((criteria, index) => (
                  <div key={index} className="flex justify-between items-center p-3 sm:p-4 glass-card rounded-lg border border-white/10">
                    <span className={`text-white/90 ${getTypographyClass('body')} text-sm sm:text-base flex-1`}>
                      {criteria.criteria}
                    </span>
                    <span className={`text-[#FCB283] ${getTypographyClass('subtitle')} font-bold text-sm sm:text-base ml-4`}>
                      {criteria.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 md:py-20 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-center">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 sm:mb-8 text-white`}>
              {currentLanguage === 'th' ? 'พร้อมแล้วหรือยัง?' : 'Ready to Submit?'}
            </h2>
            
            <p className={`text-base sm:text-lg md:text-xl ${getTypographyClass('body')} text-white/80 leading-relaxed max-w-4xl mx-auto mb-8 sm:mb-12`}>
              {currentLanguage === 'th' 
                ? 'เริ่มต้นการเดินทางสู่การสร้างสรรค์ภาพยนตร์สั้นที่จะเปลี่ยนอนาคตของเชียงใหม่ ส่งผลงานของคุณวันนี้!'
                : 'Start your journey to create a short film that will shape the future of Chiang Mai. Submit your work today!'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <AnimatedButton 
                variant="primary" 
                size="large" 
                icon="🎬"
                className={getTypographyClass('menu')}
                onClick={() => {
                  // Navigate to competition details or submission
                  window.location.hash = '#competition';
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                {currentContent.submitNow}
              </AnimatedButton>
              <AnimatedButton 
                variant="secondary" 
                size="large" 
                icon="📋"
                className={getTypographyClass('menu')}
                onClick={() => {
                  window.location.hash = '#coming-soon';
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                {currentContent.downloadGuidelines}
              </AnimatedButton>
              <AnimatedButton 
                variant="outline" 
                size="large" 
                icon="💬"
                className={getTypographyClass('menu')}
                onClick={() => {
                  window.location.hash = '#coming-soon';
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                {currentContent.contactUs}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Age Warning Modal */}
      {showAgeWarningModal && originalCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-container rounded-2xl max-w-md w-full p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className={`text-xl ${getTypographyClass('header')} text-white mb-3`}>
              {currentLanguage === 'th' ? 'คุณสมบัติอายุไม่ตรง' : 'Age Mismatch'}
            </h3>
            <p className={`${getTypographyClass('body')} text-white/80 mb-4`}>
              {currentLanguage === 'th'
                ? `อายุของคุณ (${userProfile?.age} ปี) ไม่ตรงกับเกณฑ์ของหมวด "${currentContent.categories.find(cat => cat.id === originalCategory.id)?.title || 'หมวดการประกวด'}" (อายุ ${AGE_LIMITS[categoryNameMap[originalCategory.id]].min}-${AGE_LIMITS[categoryNameMap[originalCategory.id]].max} ปี)`
                : `Your age (${userProfile?.age} years old) does not fit the requirements for "${currentContent.categories.find(cat => cat.id === originalCategory.id)?.title || 'Competition Category'}" (Age ${AGE_LIMITS[categoryNameMap[originalCategory.id]].min}-${AGE_LIMITS[categoryNameMap[originalCategory.id]].max} years).`
              }
            </p>

            {suggestedCategory ? (
              <>
                <p className={`${getTypographyClass('body')} text-white/80 mb-6`}>
                  {currentLanguage === 'th'
                    ? `จากอายุของคุณ คุณอาจมีสิทธิ์สมัครในหมวด "${currentContent.categories.find(cat => cat.id === suggestedCategory.id)?.title || 'หมวดการประกวด'}" (อายุ ${AGE_LIMITS[categoryNameMap[suggestedCategory.id]].min}-${AGE_LIMITS[categoryNameMap[suggestedCategory.id]].max} ปี)`
                    : `Based on your age, you might be eligible for "${currentContent.categories.find(cat => cat.id === suggestedCategory.id)?.title || 'Competition Category'}" (Age ${AGE_LIMITS[categoryNameMap[suggestedCategory.id]].min}-${AGE_LIMITS[categoryNameMap[suggestedCategory.id]].max} years).`
                  }
                </p>
                <div className="flex flex-col space-y-3">
                  <AnimatedButton
                    variant="primary"
                    size="medium"
                    onClick={() => {
                      window.location.hash = suggestedCategory.route;
                      setShowAgeWarningModal(false);
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    {currentLanguage === 'th' ? `ไปที่หมวด${currentContent.categories.find(cat => cat.id === suggestedCategory.id)?.title || 'หมวดการประกวด'}` : `Go to ${currentContent.categories.find(cat => cat.id === suggestedCategory.id)?.title || 'Competition Category'}`}
                  </AnimatedButton>
                  <AnimatedButton
                    variant="outline"
                    size="medium"
                    onClick={() => setShowAgeWarningModal(false)}
                  >
                    {currentLanguage === 'th' ? 'ยกเลิก' : 'Cancel'}
                  </AnimatedButton>
                </div>
              </>
            ) : (
              <>
                <p className={`${getTypographyClass('body')} text-white/80 mb-6`}>
                  {currentLanguage === 'th'
                    ? 'อายุของคุณไม่ตรงกับเกณฑ์ของหมวดการประกวดใดๆ กรุณาติดต่อเจ้าหน้าที่เพื่อขอคำแนะนำ'
                    : 'Your age does not fit the requirements for any competition category. Please contact support for guidance.'
                  }
                </p>
                <AnimatedButton
                  variant="primary"
                  size="medium"
                  onClick={() => setShowAgeWarningModal(false)}
                >
                  {currentLanguage === 'th' ? 'ปิด' : 'Close'}
                </AnimatedButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionPage;