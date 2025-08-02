import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import AnimatedButton from '../ui/AnimatedButton';
import { ArrowLeft } from 'lucide-react';

const TermsConditionsPage = () => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      pageTitle: "ข้อกำหนดและเงื่อนไขการใช้งาน",
      lastUpdated: "วันที่มีผลบังคับใช้: 26 กรกฎาคม 2568",
      backButton: "กลับ",
      sections: {
        welcome: {
          title: "",
          content: "ขอต้อนรับสู่เว็บไซต์เทศกาลภาพยนตร์แฟนตาสติกนานาชาติเชียงใหม่ (CIFAN) (\"เทศกาล\") เว็บไซต์นี้ดำเนินการโดย บริษัท ยูไลซัน จำกัด (Yulaison Co.,Ltd.) (\"เรา\" หรือ \"ผู้จัด\") โปรดอ่านข้อกำหนดและเงื่อนไขการใช้งาน (\"ข้อกำหนด\") เหล่านี้อย่างละเอียดก่อนเข้าใช้งาน"
        },
        acceptance: {
          title: "1. การยอมรับข้อกำหนด",
          content: "การเข้าถึงหรือใช้งานเว็บไซต์นี้ ถือว่าท่าน (\"ผู้ใช้\" หรือ \"ท่าน\") ได้อ่าน ทำความเข้าใจ และยอมรับที่จะผูกพันตามข้อกำหนดฉบับนี้ รวมถึงนโยบายคุ้มครองข้อมูลส่วนบุคคลซึ่งถือเป็นส่วนหนึ่งของข้อกำหนดนี้ หากท่านไม่ยอมรับข้อกำหนดเหล่านี้ กรุณายุติการใช้งานเว็บไซต์ทันที"
        },
        obligations: {
          title: "2. ภาระผูกพันและการใช้งานเว็บไซต์",
          content: `<div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-[#FCB283] mb-3">2.1 การลงทะเบียนบัญชี</h3>
              <div class="pl-4 space-y-2">
                <p>• ท่านตกลงที่จะให้ข้อมูลที่เป็นจริง ถูกต้อง เป็นปัจจุบัน และครบถ้วนสมบูรณ์ในระหว่างการลงทะเบียน</p>
                <p>• ท่านมีหน้าที่รับผิดชอบในการรักษารหัสผ่านและข้อมูลบัญชีของท่านให้เป็นความลับ</p>
                <p>• ท่านยอมรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของท่านแต่เพียงผู้เดียว</p>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-[#FCB283] mb-3">2.2 การใช้งานที่ได้รับอนุญาต</h3>
              <div class="pl-4 space-y-2">
                <p>• ท่านตกลงจะใช้เว็บไซต์นี้เพื่อวัตถุประสงค์ที่ชอบด้วยกฎหมายและตามที่ระบุไว้ในข้อกำหนดนี้เท่านั้น</p>
                <p>• ท่านจะปฏิบัติตามกฎ กติกา และเกณฑ์การประกวดของเทศกาลที่ประกาศไว้อย่างเคร่งครัด</p>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-[#FCB283] mb-3">2.3 พฤติกรรมต้องห้าม</h3>
              <p class="mb-3">ท่านตกลงว่าจะไม่กระทำการดังต่อไปนี้:</p>
              <div class="pl-4 space-y-2">
                <p>• อัปโหลด เผยแพร่ หรือส่งต่อเนื้อหาที่ผิดกฎหมาย ละเมิดสิทธิผู้อื่น มีลักษณะลามกอนาจาร สร้างความเกลียดชัง หรือไม่เหมาะสมในประการอื่น</p>
                <p>• แอบอ้างเป็นบุคคลหรือนิติบุคคลอื่น หรือให้ข้อมูลอันเป็นเท็จเกี่ยวกับความเกี่ยวข้องของท่านกับบุคคลหรือนิติบุคคลใด</p>
                <p>• ละเมิดทรัพย์สินทางปัญญาของผู้อื่น ซึ่งรวมถึงลิขสิทธิ์ เครื่องหมายการค้า หรือสิทธิอื่นๆ</p>
                <p>• เผยแพร่ไวรัสคอมพิวเตอร์ มัลแวร์ หรือโค้ดที่เป็นอันตรายต่อการทำงานของเว็บไซต์หรือระบบคอมพิวเตอร์</p>
              </div>
            </div>
          </div>`
        },
        intellectualProperty: {
          title: "3. ทรัพย์สินทางปัญญา",
          content: `<div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-[#FCB283] mb-3">3.1 เนื้อหาของผู้จัด</h3>
              <p class="pl-4">เนื้อหาทั้งหมดบนเว็บไซต์นี้ ซึ่งรวมถึงแต่ไม่จำกัดเพียง ข้อความ กราฟิก โลโก้ รูปภาพ และซอฟต์แวร์ เป็นทรัพย์สินทางปัญญาของผู้จัดหรือผู้ให้อนุญาตของเรา และได้รับการคุ้มครองตามกฎหมายทรัพย์สินทางปัญญา</p>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-[#FCB283] mb-3">3.2 เนื้อหาที่ส่งโดยผู้ใช้ (ผลงานที่ส่งเข้าประกวด)</h3>
              
              <div class="pl-4 space-y-4">
                <div>
                  <h4 class="font-semibold text-white mb-2">การรับรองสิทธิ์:</h4>
                  <p class="mb-2">ท่านรับรองและรับประกันว่า:</p>
                  <div class="pl-4 space-y-1">
                    <p>• (ก) ท่านเป็นเจ้าของลิขสิทธิ์แต่เพียงผู้เดียวในผลงานที่ส่งเข้าประกวด หรือได้รับอนุญาตจากเจ้าของสิทธิ์อย่างถูกต้อง</p>
                    <p>• (ข) ผลงานดังกล่าวเป็นผลงานต้นฉบับและไม่ละเมิดสิทธิในทรัพย์สินทางปัญญา สิทธิในความเป็นส่วนตัว หรือสิทธิอื่นใดของบุคคลที่สาม</p>
                    <p>• (ค) ท่านได้รับความยินยอมจากบุคคลทุกคนที่ปรากฏในผลงานแล้ว</p>
                  </div>
                </div>

                <div>
                  <h4 class="font-semibold text-white mb-2">การอนุญาตให้ใช้สิทธิ์:</h4>
                  <p class="mb-3">โดยการส่งผลงานเข้าร่วมประกวด ท่านได้อนุญาตให้ผู้จัดมีสิทธิ์ดังนี้:</p>
                  
                  <div class="space-y-3">
                    <div class="bg-white/5 rounded-lg p-3">
                      <h5 class="font-medium text-[#FCB283] mb-2">สำหรับผลงานทุกชิ้นที่ส่งเข้าประกวด:</h5>
                      <p class="text-sm">ท่านอนุญาตให้ผู้จัดมีสิทธิ์ในการใช้ ทำซ้ำ จัดแสดง และเผยแพร่ผลงานของท่าน (รวมถึงภาพนิ่งหรือคลิปสั้นๆ จากผลงาน) โดยไม่จำกัดรูปแบบ (non-exclusive) ไม่ต้องจ่ายค่าตอบแทน (royalty-free) ทั่วโลก (worldwide) เพื่อวัตถุประสงค์ในการตัดสิน การประชาสัมพันธ์ และการดำเนินงานของเทศกาลในปีปัจจุบัน</p>
                    </div>
                    
                    <div class="bg-white/5 rounded-lg p-3">
                      <h5 class="font-medium text-[#FCB283] mb-2">สำหรับผลงานที่ได้รับรางวัลหรือได้รับคัดเลือก:</h5>
                      <p class="text-sm">เพิ่มเติมจากข้อข้างต้น ท่านอนุญาตให้ผู้จัดมีสิทธิ์ในการใช้ ทำซ้ำ จัดแสดง เผยแพร่ และจัดเก็บผลงานของท่านในระยะเวลา <span class="font-semibold text-[#FCB283]">5 ปี</span> เพื่อวัตถุประสงค์ในการประชาสัมพันธ์เทศกาลในครั้งต่อๆ ไป การจัดฉายในกิจกรรมที่ไม่ใช่เชิงพาณิชย์ของเทศกาล และเพื่อการเก็บเป็นข้อมูลในจดหมายเหตุ (archive) ของเทศกาล</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="font-semibold text-white mb-2">การจัดการเนื้อหา:</h4>
                  <p class="pl-4">เราขอสงวนสิทธิ์ในการลบ ระงับ หรือปฏิเสธเนื้อหาใดๆ ที่เราเห็นว่าละเมิดข้อกำหนดนี้ โดยไม่จำเป็นต้องแจ้งให้ทราบล่วงหน้า</p>
                </div>
              </div>
            </div>
          </div>`
        },
        liability: {
          title: "4. การจำกัดความรับผิด",
          content: "ในขอบเขตสูงสุดที่กฎหมายอนุญาต เราจะไม่รับผิดต่อความเสียหายใดๆ ทั้งทางตรง ทางอ้อม โดยบังเอิญ หรือที่เป็นผลสืบเนื่อง อันเกิดจากการใช้งานหรือการไม่สามารถใช้งานเว็บไซต์นี้ได้ เราไม่รับประกันว่าเว็บไซต์จะทำงานอย่างต่อเนื่อง ปลอดภัย หรือปราศจากข้อผิดพลาด"
        },
        indemnification: {
          title: "5. การชดใช้ค่าเสียหาย",
          content: "ท่านตกลงที่จะปกป้อง ชดใช้ และป้องกันเราและบุคลากรของเราจากข้อเรียกร้อง ความรับผิด ความเสียหาย และค่าใช้จ่ายใดๆ (รวมถึงค่าทนายความ) ที่เกิดขึ้นจากการที่ท่านละเมิดข้อกำหนดนี้ หรือละเมิดสิทธิของบุคคลอื่น"
        },
        termination: {
          title: "6. การยกเลิกหรือระงับบัญชี",
          content: "เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกการเข้าถึงเว็บไซต์และบัญชีของท่านได้ทุกเมื่อ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า หากเราเชื่อว่าท่านได้ละเมิดข้อกำหนดฉบับนี้"
        },
        modification: {
          title: "7. การแก้ไขข้อกำหนด",
          content: "เราขอสงวนสิทธิ์ในการแก้ไขเปลี่ยนแปลงข้อกำหนดนี้ได้ตลอดเวลา การแก้ไขจะมีผลบังคับใช้ทันทีเมื่อมีการเผยแพร่บนเว็บไซต์ การที่ท่านใช้งานเว็บไซต์ต่อไปถือเป็นการยอมรับข้อกำหนดฉบับใหม่"
        },
        governingLaw: {
          title: "8. กฎหมายที่ใช้บังคับและเขตอำนาจศาล",
          content: "ข้อกำหนดนี้อยู่ภายใต้การบังคับใช้และตีความตามกฎหมายแห่งราชอาณาจักรไทย ข้อพิพาทใดๆ ที่เกิดขึ้นจะอยู่ภายใต้เขตอำนาจของศาลไทย"
        }
      }
    },
    en: {
      pageTitle: "Terms and Conditions",
      lastUpdated: "Effective Date: July 26, 2025",
      backButton: "Back",
      sections: {
        welcome: {
          title: "",
          content: "Welcome to the official website of the Chiang Mai International Fantastic Film Festival (CIFAN) (\"Festival\"). This website is operated by Yulaison Co.,Ltd. (\"we,\" \"us,\" or \"our\"). Please read these Terms and Conditions (\"Terms\") carefully before using the site."
        },
        acceptance: {
          title: "1. Acceptance of Terms",
          content: "By accessing or using this website, you (\"User\" or \"you\") acknowledge that you have read, understood, and agree to be bound by these Terms, including our Privacy Policy, which is incorporated herein by reference. If you do not agree to these Terms, please cease using the website immediately."
        },
        obligations: {
          title: "2. User Obligations and Conduct",
          content: `<h3>2.1 Account Registration</h3>
<p>You agree to provide true, accurate, current, and complete information during the registration process.</p>
<p>You are responsible for maintaining the confidentiality of your password and account information.</p>
<p>You agree to accept sole responsibility for all activities that occur under your account.</p>

<h3>2.2 Permitted Use</h3>
<p>You agree to use this website only for lawful purposes and as permitted by these Terms.</p>
<p>You shall strictly adhere to all festival rules, regulations, and submission criteria as published.</p>

<h3>2.3 Prohibited Conduct</h3>
<p>You agree not to:</p>
<ul>
<li>Upload, post, or transmit any content that is unlawful, infringing, obscene, hateful, or otherwise objectionable.</li>
<li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
<li>Infringe upon the intellectual property rights of others, including copyrights, trademarks, or other proprietary rights.</li>
<li>Distribute computer viruses, malware, or any other code that is harmful to the functionality of the website or computer systems.</li>
</ul>`
        },
        intellectualProperty: {
          title: "3. Intellectual Property",
          content: `<h3>3.1 Our Content</h3>
<p>All content on this website, including but not limited to text, graphics, logos, images, and software, is the intellectual property of us or our licensors and is protected by intellectual property laws.</p>

<h3>3.2 User-Submitted Content (Competition Submissions)</h3>
<p><strong>Representation and Warranty:</strong> You represent and warrant that: (a) you are the sole copyright owner of the submitted work or are fully authorized by the rights holder to submit it; (b) the work is original and does not infringe upon the intellectual property rights, privacy rights, or any other rights of any third party; and (c) you have obtained all necessary releases and permissions from all individuals appearing in your work.</p>

<p><strong>License Grant:</strong> By submitting your work to the competition, you grant us the following licenses:</p>

<p><strong>(For All Submissions):</strong> You grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, display, and distribute your work (including stills or short clips thereof) for the purposes of judging, promotion, and operation of the current year's Festival.</p>

<p><strong>(For Award-Winning or Selected Works):</strong> In addition to the above, you grant us a license for a period of 5 years to use, reproduce, display, distribute, and archive your work for the purposes of promoting future editions of the Festival, screening at non-commercial Festival events, and for our historical archives.</p>

<p><strong>Content Management:</strong> We reserve the right to remove, suspend, or reject any content that we, in our sole discretion, deem to be in violation of these Terms, without prior notice.</p>`
        },
        liability: {
          title: "4. Limitation of Liability",
          content: "To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of, or inability to use, this website. We do not warrant that the website will be uninterrupted, secure, or error-free."
        },
        indemnification: {
          title: "5. Indemnification",
          content: "You agree to defend, indemnify, and hold us and our personnel harmless from and against any and all claims, liabilities, damages, and costs (including reasonable attorneys' fees) arising from your violation of these Terms or your infringement of any third-party rights."
        },
        termination: {
          title: "6. Termination or Suspension",
          content: "We reserve the right to suspend or terminate your access to the website and your account at any time, without prior notice, if we believe you have violated these Terms."
        },
        modification: {
          title: "7. Modification of Terms",
          content: "We reserve the right to modify these Terms at any time. Modifications will become effective immediately upon being posted on the website. Your continued use of the website constitutes your acceptance of the revised Terms."
        },
        governingLaw: {
          title: "8. Governing Law and Jurisdiction",
          content: "These Terms shall be governed by and construed in accordance with the laws of the Kingdom of Thailand. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts of Thailand."
        }
      }
    }
  };

  const currentContent = content[currentLanguage];

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#110D16] pt-24">
      {/* Header Container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-container rounded-2xl p-8">
          <div className="text-center">
            {/* CIFAN Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2Flogo%20cifan%20full%404x.png?alt=media&token=9087f171-7499-40c5-a849-b09106f84a98"
                alt="CIFAN 2025 Logo"
                className="h-16 sm:h-20 w-auto object-contain filter brightness-0 invert"
              />
            </div>
            <h1 className={`text-3xl sm:text-4xl ${getClass('header')} mb-4 text-white`}>
              {currentContent.pageTitle}
            </h1>
            <p className={`text-white/70 ${getClass('body')} text-sm`}>
              {currentContent.lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="glass-card rounded-xl p-6 border border-white/10">
            <p className={`text-white/90 ${getClass('body')} leading-relaxed`}>
              {currentContent.sections.welcome.content}
            </p>
          </div>

          {/* All other sections */}
          {Object.entries(currentContent.sections).map(([key, section]) => {
            if (key === 'welcome') return null;
            
            return (
              <div key={key} className="glass-card rounded-xl p-6 border border-white/10">
                <h2 className={`text-xl sm:text-2xl ${getClass('subtitle')} mb-4 text-[#FCB283]`}>
                  {section.title}
                </h2>
                <div 
                  className={`text-white/90 ${getClass('body')} leading-relaxed prose prose-invert max-w-none`}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                  style={{
                    '--tw-prose-body': 'rgb(255 255 255 / 0.9)',
                    '--tw-prose-headings': 'rgb(252 178 131)',
                    '--tw-prose-links': 'rgb(252 178 131)',
                    '--tw-prose-bold': 'rgb(255 255 255)',
                    '--tw-prose-bullets': 'rgb(252 178 131)',
                    '--tw-prose-counters': 'rgb(252 178 131)',
                  } as React.CSSProperties}
                />
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <AnimatedButton
            variant="outline"
            size="medium"
            onClick={handleBack}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentContent.backButton}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
