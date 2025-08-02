import React from 'react';
import { useTranslation } from 'react-i18next';

const OfficialSelectionSection = () => {
  const { i18n } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Clean Background Image with Cat's Eyes Focus */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Fcat%2F1E629016-EB19-4E6F-9E89-6E9A860A545C.png?alt=media&token=fbf6ec2d-b30f-4d4d-b7f8-2b30e9146e6a')`,
            backgroundPosition: 'center 40%', // Shift down for better composition
          }}
        />
        
        {/* Subtle dark overlay for text contrast only */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* CIFAN Logo - Centered between cat's eyes */}
        <div className="mb-8">
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FT2%404x.png?alt=media&token=d7999ca8-6be4-4d15-bc64-66c6a2395965"
            alt="CIFAN 2025 Logo"
            className="h-28 md:h-40 lg:h-48 w-auto object-contain animate-fade-in-up"
          />
        </div>

        {/* Subtitle Text */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className={`text-lg md:text-xl lg:text-2xl ${
            i18n.language === 'th' 
              ? 'font-anuphan font-extralight' 
              : 'font-oswald font-extralight'
          } text-white/90 tracking-wide max-w-4xl mx-auto leading-relaxed`}>
            {i18n.language === 'th' 
              ? 'เตรียมพบกับภาพยนตร์ยาวแนวแฟนตาสติกที่น่าตื่นตาตื่นใจจากนานาชาติ และเข้าร่วมเสวนาพิเศษกับนักทำหนังและผู้เชี่ยวชาญจากทั่วโลก'
              : 'Get ready to experience captivating fantastic feature films from around the world, and join exclusive panel discussions with filmmakers and industry experts from across the globe.'
            }
          </p>
        </div>

        {/* Coming Soon Text with Subtle Pulsing */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-oswald font-bold text-white tracking-wider animate-gentle-pulse">
            COMING SOON
          </h2>
        </div>
      </div>
    </section>
  );
};

export default OfficialSelectionSection;