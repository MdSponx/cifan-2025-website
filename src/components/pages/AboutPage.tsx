import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedButton from '../ui/AnimatedButton';

const AboutPage = () => {
  const { i18n } = useTranslation();
  
  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      pageTitle: "เกี่ยวกับ CIFAN",
      heroTitle: "จินตนาการถึงวันพรุ่งนี้ เริ่มต้นวันนี้ที่เชียงใหม่",
      introduction: "เทศกาลภาพยนตร์แฟนตาสติกนานาชาติเชียงใหม่ (CIFAN) คือพื้นที่ที่จินตนาการจะโบยบิน เราถือกำเนิดจากวิสัยทัศน์ที่ต้องการผลักดันให้ภาคเหนือของไทยกลายเป็นศูนย์กลางของผู้สร้างสรรค์ภาพยนตร์แนวแฟนตาสติกในระดับโลก โดยอาศัยมรดกทางวัฒนธรรมอันเป็นเอกลักษณ์และภูมิทัศน์ทางธรรมชาติที่งดงาม เพื่อเปิดประตูสู่โลกแห่งความเป็นไปได้ใหม่ๆ",
      
      visionTitle: "วิสัยทัศน์ของเรา",
      visionContent: "เราเชื่อว่าภาพยนตร์แฟนตาสติกเป็นมากกว่าความบันเทิง แต่คือ \"ประตู\" ที่เปิดไปสู่มุมมองใหม่ๆ ช่วยสะท้อนภาพสังคม พร้อมกับสร้างแรงบันดาลใจให้เราฝันถึงโลกใบอื่น พันธกิจของเราคือการสร้างอัตลักษณ์ทางภาพยนตร์ที่โดดเด่น ด้วยการผสมผสานเทคโนโลยีการผลิตอันล้ำสมัยเข้ากับจิตวิญญาณของวัฒนธรรมไทยและล้านนา เพื่อเป้าหมายในการสถาปนาเชียงใหม่ให้เป็นหัวใจของการสร้างสรรค์ภาพยนตร์แฟนตาสติกแห่งเอเชียตะวันออกเฉียงใต้ สร้างผลงานที่เปี่ยมด้วยมูลค่าและความภาคภูมิใจทางวัฒนธรรมอย่างยั่งยืน",
      
      whatWeDoTitle: "สิ่งที่เราทำ",
      whatWeDoIntro: "CIFAN เป็นมากกว่าเทศกาลภาพยนตร์ แต่เราคือ \"เครื่องยนต์\" ขับเคลื่อนความคิดสร้างสรรค์ที่มุ่งมั่นจะ:",
      whatWeDoItems: [
        {
          title: "เสริมสร้างบุคลากร",
          description: "พัฒนาทักษะที่จำเป็นสำหรับผู้สร้างภาพยนตร์ไทย ผ่านกิจกรรมเวิร์กช็อปและการฝึกอบรมอย่างเข้มข้น",
          icon: "🎓"
        },
        {
          title: "ผลักดันความคิดสร้างสรรค์",
          description: "ส่งเสริมให้เกิดภาพยนตร์ที่ผสมผสานแนวคิดแฟนตาสติกเข้ากับความลุ่มลึกของวัฒนธรรมไทยอย่างกล้าหาญ",
          icon: "🎬"
        },
        {
          title: "สร้างเครือข่าย",
          description: "เป็นเวทีเชื่อมต่อผู้เชี่ยวชาญระดับโลกเข้ากับผู้มีความสามารถรุ่นใหม่ในท้องถิ่น เพื่อสร้างความร่วมมือและการเติบโตไปด้วยกัน",
          icon: "🤝"
        },
        {
          title: "ขับเคลื่อนเศรษฐกิจสร้างสรรค์",
          description: "กระตุ้นอุตสาหกรรมภาพยนตร์ในภูมิภาคและส่งเสริมการท่องเที่ยวเชิงวัฒนธรรมอันมีชีวิตชีวาของเชียงใหม่",
          icon: "💼"
        }
      ],
      
      highlightsTitle: "กิจกรรมไฮไลท์ในเทศกาล",
      highlights: [
        {
          title: "โปรแกรมภาพยนตร์คุณภาพ",
          description: "ดื่มด่ำกับภาพยนตร์แฟนตาสติกจากทั่วโลกที่คัดสรรมาอย่างดี พร้อมร่วมกิจกรรม Q&A พูดคุยกับผู้กำกับและนักแสดงอย่างใกล้ชิด",
          icon: "🎭"
        },
        {
          title: "การประกวดภาพยนตร์สั้น",
          description: "ปลดปล่อยความคิดสร้างสรรค์ของคุณในการประกวดภาพยนตร์สั้นภายใต้โจทย์ \"เชียงใหม่ในอนาคต\" ชิงเงินรางวัลรวมกว่า 1 ล้านบาท",
          icon: "🏆"
        },
        {
          title: "Entertainment EXPO",
          description: "สำรวจพื้นที่จัดแสดงผลงานและนวัตกรรมจากโปรดักชันเฮาส์ สถาบันการศึกษา และผู้ให้บริการในอุตสาหกรรม",
          icon: "🎪"
        },
        {
          title: "เวิร์กช็อปพัฒนาทักษะ",
          description: "ฝึกฝนทักษะกับมืออาชีพในสาขาต่างๆ เช่น การบริหารจัดการกองถ่าย การจัดแสงและอุปกรณ์ และการเตรียมตัวเพื่อคัดเลือกนักแสดง",
          icon: "🛠️"
        },
        {
          title: "CIFAN City Rally",
          description: "ออกผจญภัยในเมืองเชียงใหม่ พร้อมรับส่วนลดและสิทธิพิเศษจากร้านค้าพันธมิตรทั่วเมือง",
          icon: "🗺️"
        }
      ],
      
      foundersTitle: "ผู้ก่อตั้งและพันธมิตรของเรา",
      foundersContent: "CIFAN ริเริ่มโดย Studio Commuan หนึ่งในผู้นำด้านการผลิตคอนเทนต์สร้างสรรค์ของไทย ผู้มีความมุ่งมั่นและวิสัยทัศน์ในการยกระดับอุตสาหกรรมภาพยนตร์ไทยสู่เวทีโลก",
      partnersContent: "เทศกาลนี้สำเร็จได้ด้วยการสนับสนุนที่สำคัญยิ่งจาก กรมส่งเสริมวัฒนธรรม (กระทรวงวัฒนธรรม), THACCA (สำนักงานส่งเสริมวัฒนธรรมสร้างสรรค์), องค์การบริหารส่วนจังหวัดเชียงใหม่ และ เทศบาลนครเชียงใหม่ ความร่วมมืออันแข็งแกร่งระหว่างภาคเอกชนและภาครัฐนี้ คือรากฐานที่ทำให้ CIFAN สามารถสร้างผลกระทบเชิงบวกต่ออุตสาหกรรมได้อย่างยั่งยืน",
      
      ctaTitle: "ร่วมเป็นส่วนหนึ่งของเรื่องราว",
      ctaContent: "ไม่ว่าคุณจะเป็นผู้สร้างภาพยนตร์ นักศึกษา มืออาชีพในวงการ หรือเป็นเพียงผู้ที่หลงใหลในมนต์เสน่ห์ของภาพยนตร์ CIFAN ยินดีต้อนรับทุกคนเสมอ มาร่วมเฉลิมฉลองและสรรค์สร้างอนาคตของภาพยนตร์แฟนตาสติกไปด้วยกัน ณ ใจกลางวัฒนธรรมล้านนาแห่งนี้",
      ctaDate: "CIFAN 2025 | 20-25 กันยายน 2568 | เชียงใหม่ ประเทศไทย",
      
      joinFestival: "ร่วมงานเทศกาล",
      learnMore: "เรียนรู้เพิ่มเติม"
    },
    en: {
      pageTitle: "About CIFAN",
      heroTitle: "Imagine Tomorrow, Starting Today in Chiang Mai.",
      introduction: "The Chiang Mai Fantastic International Film Festival (CIFAN) is where imagination takes flight. Born from a vision to establish Northern Thailand as a global hub for the fantastic film genre, CIFAN harnesses the region's unique cultural heritage and breathtaking natural landscapes to create a world of new possibilities.",
      
      visionTitle: "Our Vision",
      visionContent: "We believe fantastic films are more than entertainment—they are portals to new perspectives, reflecting our world while inspiring us to dream of others. Our mission is to forge a unique cinematic identity by blending cutting-edge production with the timeless spirit of Thai and Lanna culture. We aim to establish Chiang Mai as the creative heart of fantastic film in Southeast Asia, creating works of sustainable value and cultural pride.",
      
      whatWeDoTitle: "What We Do",
      whatWeDoIntro: "CIFAN is more than just a festival; it's a creative engine designed to:",
      whatWeDoItems: [
        {
          title: "Nurture Talent",
          description: "We build essential skills for Thai filmmakers through professional workshops and hands-on training.",
          icon: "🎓"
        },
        {
          title: "Champion Creativity",
          description: "We inspire films that boldly merge fantastic concepts with the richness of Thai culture.",
          icon: "🎬"
        },
        {
          title: "Build Networks",
          description: "We unite global experts with emerging local talent, fostering collaboration and mentorship.",
          icon: "🤝"
        },
        {
          title: "Drive the Creative Economy",
          description: "We boost the regional film industry and promote Chiang Mai's vibrant cultural tourism.",
          icon: "💼"
        }
      ],
      
      highlightsTitle: "Festival Highlights",
      highlights: [
        {
          title: "Curated Film Screenings",
          description: "Immerse yourself in a world-class selection of fantastic films, complete with exclusive Q&A sessions with directors and actors.",
          icon: "🎭"
        },
        {
          title: "Short Film Competition",
          description: "Unleash your creativity in our flagship competition under the theme \"Chiang Mai Future,\" with over 1 million baht in prizes.",
          icon: "🏆"
        },
        {
          title: "Entertainment EXPO",
          description: "Explore a dynamic showcase of production houses, educational programs, and creative services from across the industry.",
          icon: "🎪"
        },
        {
          title: "Professional Workshops",
          description: "Sharpen your skills with practical training in Location Management, Grip & Lighting, Auditioning, and more.",
          icon: "🛠️"
        },
        {
          title: "CIFAN City Rally",
          description: "Discover the magic of Chiang Mai and enjoy exclusive perks from local partners as you connect tourism with the festival.",
          icon: "🗺️"
        }
      ],
      
      foundersTitle: "Our Founders & Partners",
      foundersContent: "CIFAN was initiated by Studio Commuan, a leader in Thailand's creative content scene, driven by a passion for elevating the Thai film industry on the global stage.",
      partnersContent: "The festival is made possible through the vital support of the Department of Cultural Promotion (Ministry of Culture), THACCA (Thailand Creative & Cultural Accelerator), the Chiang Mai Provincial Administrative Organization, and the Chiang Mai Municipality. This powerful alliance between the private and public sectors is the bedrock of CIFAN's mission to create a lasting impact.",
      
      ctaTitle: "Join the Story",
      ctaContent: "Whether you are a filmmaker, a student, an industry professional, or simply a lover of film, CIFAN welcomes you. Join us in celebrating and shaping the future of fantastic cinema, right here in the heart of Lanna.",
      ctaDate: "CIFAN 2025 | September 20-25, 2025 | Chiang Mai, Thailand",
      
      joinFestival: "Join Festival",
      learnMore: "Learn More"
    }
  };

  const currentContent = content[currentLanguage];

  return (
    <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Background with CIFAN Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2Flogo%20cifan%20full%404x.png?alt=media&token=9087f171-7499-40c5-a849-b09106f84a98"
            alt="CIFAN Logo Background"
            className="w-full max-w-4xl h-auto object-contain"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Main CIFAN Logo */}
          <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2Flogo%20cifan%20full%404x.png?alt=media&token=9087f171-7499-40c5-a849-b09106f84a98"
              alt="CIFAN 2025 Logo"
              className="h-20 sm:h-24 md:h-32 lg:h-40 xl:h-48 w-auto object-contain filter brightness-0 invert animate-fade-in-up"
            />
          </div>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${getTypographyClass('header')} mb-6 sm:mb-8 leading-tight`}>
            <span className="bg-gradient-to-r from-[#FCB283] via-[#AA4626] to-[#FCB283] bg-clip-text text-transparent animate-gradient-shift">
              {currentContent.pageTitle}
            </span>
          </h1>
          
          <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ${getTypographyClass('subtitle')} text-white/90 max-w-5xl mx-auto leading-relaxed mb-8 sm:mb-12`}>
            {currentContent.heroTitle}
          </h2>
          
          {/* Introduction Text - Now part of hero section */}
          <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${getTypographyClass('body')} text-white/90 leading-relaxed text-center`}>
              {currentContent.introduction}
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 text-white`}>
              {currentContent.visionTitle}
            </h2>
          </div>
          
          <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10">
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${getTypographyClass('body')} text-white/80 leading-relaxed text-center max-w-6xl mx-auto`}>
              {currentContent.visionContent}
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 text-white`}>
              {currentContent.whatWeDoTitle}
            </h2>
            <p className={`text-base sm:text-lg md:text-xl ${getTypographyClass('body')} text-white/80 max-w-4xl mx-auto leading-relaxed`}>
              {currentContent.whatWeDoIntro}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {currentContent.whatWeDoItems.map((item, index) => (
              <div key={index} className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover:scale-105 transition-all duration-300 border border-white/10">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">
                  {item.icon}
                </div>
                <h3 className={`text-lg sm:text-xl ${getTypographyClass('subtitle')} mb-3 sm:mb-4 text-white`}>
                  {item.title}
                </h3>
                <p className={`text-sm sm:text-base ${getTypographyClass('body')} text-white/70 leading-relaxed`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Highlights Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 text-white`}>
              {currentContent.highlightsTitle}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentContent.highlights.map((highlight, index) => (
              <div key={index} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-white/10">
                <div className="h-32 sm:h-40 bg-gradient-to-br from-[#3B6891] to-[#00305A] flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl">{highlight.icon}</span>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className={`text-lg sm:text-xl ${getTypographyClass('subtitle')} mb-3 text-white`}>
                    {highlight.title}
                  </h3>
                  <p className={`text-sm sm:text-base ${getTypographyClass('body')} text-white/70 leading-relaxed`}>
                    {highlight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders & Partners Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 text-white`}>
              {currentContent.foundersTitle}
            </h2>
          </div>
          
          <div className="space-y-8 sm:space-y-12">
            <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10">
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-r from-[#FCB283] to-[#AA4626] flex items-center justify-center text-2xl sm:text-3xl">
                  🎬
                </div>
              </div>
              <p className={`text-sm sm:text-base md:text-lg ${getTypographyClass('body')} text-white/80 leading-relaxed text-center max-w-4xl mx-auto mb-6 sm:mb-8`}>
                {currentContent.foundersContent}
              </p>
              <p className={`text-sm sm:text-base md:text-lg ${getTypographyClass('body')} text-white/80 leading-relaxed text-center max-w-4xl mx-auto`}>
                {currentContent.partnersContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 md:py-20 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-center">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${getTypographyClass('header')} mb-6 sm:mb-8 text-white`}>
              {currentContent.ctaTitle}
            </h2>
            
            <p className={`text-base sm:text-lg md:text-xl ${getTypographyClass('body')} text-white/80 leading-relaxed max-w-4xl mx-auto mb-8 sm:mb-12`}>
              {currentContent.ctaContent}
            </p>
            
            <div className="mb-8 sm:mb-12">
              <p className={`text-lg sm:text-xl md:text-2xl ${getTypographyClass('subtitle')} text-[#FCB283] font-bold`}>
                {currentContent.ctaDate}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <AnimatedButton 
                variant="primary" 
                size="large" 
                icon="🎬"
                className={getTypographyClass('menu')}
                onClick={() => {
                  window.location.hash = '#coming-soon';
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                {currentContent.joinFestival}
              </AnimatedButton>
              <AnimatedButton 
                variant="secondary" 
                size="large" 
                icon="📚"
                className={getTypographyClass('menu')}
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
      </section>
    </div>
  );
};

export default AboutPage;
