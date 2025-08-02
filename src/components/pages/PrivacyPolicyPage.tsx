import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import AnimatedButton from '../ui/AnimatedButton';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      pageTitle: "นโยบายคุ้มครองข้อมูลส่วนบุคคล",
      lastUpdated: "วันที่มีผลบังคับใช้: 26 กรกฎาคม 2568",
      backButton: "กลับ",
      sections: {
        introduction: {
          title: "1. บทนำ",
          content: "บริษัท ยูไลซัน จำกัด (Yulaison Co.,Ltd.) (\"เรา\") มุ่งมั่นที่จะคุ้มครองข้อมูลส่วนบุคคลของท่าน (\"เจ้าของข้อมูล\") นโยบายฉบับนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และประมวลผลข้อมูลส่วนบุคคลของท่านให้เป็นไปตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (\"PDPA\")"
        },
        dataCollection: {
          title: "2. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม",
          content: `<div class="space-y-4">
            <p class="mb-4">เราอาจเก็บรวบรวมข้อมูลส่วนบุคคลของท่าน ซึ่งรวมถึงแต่ไม่จำกัดเพียง:</p>
            
            <div class="space-y-4">
              <div class="bg-white/5 rounded-lg p-4">
                <h4 class="font-semibold text-[#FCB283] mb-2">📝 ข้อมูลที่ท่านให้โดยตรง</h4>
                <p class="text-sm pl-4">ชื่อ-นามสกุล, อีเมล, หมายเลขโทรศัพท์, อายุ, วันเกิด, สถานศึกษา/สถานที่ทำงาน, รูปถ่ายประจำตัว</p>
              </div>
              
              <div class="bg-white/5 rounded-lg p-4">
                <h4 class="font-semibold text-[#FCB283] mb-2">🎬 ข้อมูลการสมัคร</h4>
                <p class="text-sm pl-4">ผลงานภาพยนตร์, บทภาพยนตร์ และเอกสารประกอบการสมัครต่างๆ ที่ท่านส่งเข้ามา</p>
              </div>
              
              <div class="bg-white/5 rounded-lg p-4">
                <h4 class="font-semibold text-[#FCB283] mb-2">🔍 ข้อมูลที่เก็บรวบรวมโดยอัตโนมัติ</h4>
                <p class="text-sm pl-4">ที่อยู่ IP (IP Address), ประเภทของเบราว์เซอร์, ข้อมูลการใช้งานเว็บไซต์ (เช่น หน้าที่เข้าชม, เวลาที่ใช้) ผ่านคุกกี้และเทคโนโลยีติดตามอื่นๆ</p>
              </div>
            </div>
          </div>`
        },
        purposes: {
          title: "3. วัตถุประสงค์และฐานทางกฎหมายในการประมวลผลข้อมูล",
          content: `เราประมวลผลข้อมูลของท่านภายใต้วัตถุประสงค์และฐานทางกฎหมายดังต่อไปนี้:

<p><strong>เพื่อปฏิบัติตามสัญญา (Contractual Basis):</strong> เพื่อดำเนินการรับสมัคร, ตรวจสอบคุณสมบัติ, ติดต่อสื่อสาร, ตัดสิน และประกาศผลผู้ชนะการประกวด</p>

<p><strong>เพื่อประโยชน์อันชอบด้วยกฎหมาย (Legitimate Interest):</strong> เพื่อการบริหารจัดการเทศกาล, การประชาสัมพันธ์กิจกรรม, การวิเคราะห์เพื่อปรับปรุงบริการ และการรักษาความปลอดภัยของระบบ</p>

<p><strong>เมื่อได้รับความยินยอมจากท่าน (Consent):</strong> เพื่อส่งข่าวสารทางการตลาด, โปรโมชัน และอัปเดตเกี่ยวกับกิจกรรมอื่นๆ ของเราที่ไม่เกี่ยวข้องโดยตรงกับการประกวดที่ท่านเข้าร่วม</p>`
        },
        disclosure: {
          title: "4. การเปิดเผยข้อมูลส่วนบุคคล",
          content: `เราอาจเปิดเผยข้อมูลส่วนบุคคลของท่านให้แก่บุคคลดังต่อไปนี้:

<ul>
<li>คณะกรรมการตัดสินและทีมงานผู้จัดงาน</li>
<li>ผู้ให้บริการภายนอกที่ให้บริการด้านเทคโนโลยีแก่เรา (ภายใต้ข้อตกลงการประมวลผลข้อมูล)</li>
<li>หน่วยงานราชการหรือหน่วยงานกำกับดูแล เมื่อมีคำร้องขอตามกฎหมาย</li>
</ul>`
        },
        security: {
          title: "5. การรักษาความปลอดภัยของข้อมูล",
          content: "เราได้จัดให้มีมาตรการรักษาความปลอดภัยทางเทคนิคและเชิงองค์กรที่เหมาะสม เพื่อป้องกันการเข้าถึง การใช้ หรือการเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต"
        },
        retention: {
          title: "6. ระยะเวลาในการเก็บรักษาข้อมูล",
          content: `เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านไว้ตามระยะเวลาที่จำเป็นเพื่อบรรลุวัตถุประสงค์ที่ระบุไว้:

<ul>
<li><strong>ข้อมูลการสมัครของผู้ไม่ได้รับรางวัล:</strong> 3 ปี หลังสิ้นสุดเทศกาล</li>
<li><strong>ข้อมูลและผลงานของผู้ได้รับรางวัล/ได้รับคัดเลือก:</strong> 5 ปี หลังสิ้นสุดเทศกาล</li>
<li><strong>ข้อมูลเพื่อการตลาด:</strong> จนกว่าท่านจะถอนความยินยอม</li>
</ul>`
        },
        rights: {
          title: "7. สิทธิของเจ้าของข้อมูล",
          content: "ท่านมีสิทธิตามที่กฎหมาย PDPA กำหนด ซึ่งรวมถึง สิทธิในการเข้าถึง, แก้ไข, ลบ, ระงับการใช้, คัดค้านการประมวลผล, โอนย้ายข้อมูล และถอนความยินยอม"
        },
        cookies: {
          title: "8. นโยบายคุกกี้และเทคโนโลยีติดตาม",
          content: `เว็บไซต์ของเราใช้คุกกี้ ซึ่งเป็นไฟล์ข้อความขนาดเล็กที่จัดเก็บไว้ในคอมพิวเตอร์หรืออุปกรณ์ของท่าน เพื่อช่วยให้เว็บไซต์ทำงานได้อย่างมีประสิทธิภาพและมอบประสบการณ์ที่ดีขึ้นให้แก่ผู้ใช้

<h3>8.1 ประเภทของคุกกี้ที่เราใช้</h3>

<p><strong>คุกกี้ที่จำเป็นอย่างยิ่ง (Strictly Necessary Cookies):</strong> คุกกี้ประเภทนี้จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์ เช่น การเข้าสู่ระบบ การนำทางในหน้าเว็บ และการทำธุรกรรมที่ปลอดภัย ท่านไม่สามารถปิดการใช้งานคุกกี้ประเภทนี้ผ่านระบบของเราได้</p>

<p><strong>คุกกี้เพื่อการวิเคราะห์และวัดผลการทำงาน (Analytical/Performance Cookies):</strong> คุกกี้ประเภทนี้ช่วยให้เราเข้าใจลักษณะการใช้งานเว็บไซต์ เพื่อนับจำนวนและวิเคราะห์แหล่งที่มาของผู้เข้าชม ซึ่งข้อมูลเหล่านี้ช่วยให้เราสามารถปรับปรุงและพัฒนาประสิทธิภาพของเว็บไซต์ให้ดียิ่งขึ้น</p>

<p><strong>คุกกี้เพื่อการตลาด (Marketing Cookies):</strong> คุกกี้ประเภทนี้อาจถูกตั้งค่าผ่านเว็บไซต์ของเราโดยพันธมิตรด้านการโฆษณา เพื่อสร้างโปรไฟล์ความสนใจของท่านและแสดงโฆษณาที่เกี่ยวข้องบนเว็บไซต์อื่น ๆ</p>

<h3>8.2 การจัดการคุกกี้</h3>

<p>นอกเหนือจากคุกกี้ที่จำเป็นอย่างยิ่ง ท่านสามารถยอมรับหรือปฏิเสธการใช้งานคุกกี้ประเภทอื่นได้ผ่านเครื่องมือจัดการความยินยอม (Cookie Consent Tool) บนเว็บไซต์ของเรา นอกจากนี้ ท่านยังสามารถตั้งค่าเบราว์เซอร์ของท่านให้ปฏิเสธคุกกี้ทั้งหมดหรือแจ้งเตือนเมื่อมีการส่งคุกกี้ได้ อย่างไรก็ตาม การปิดใช้งานคุกกี้บางประเภทอาจส่งผลกระทบต่อประสบการณ์การใช้งานเว็บไซต์ของท่าน</p>`
        },
        contact: {
          title: "9. การติดต่อเรา",
          content: `หากท่านมีข้อสงสัยเกี่ยวกับนโยบายฉบับนี้ หรือต้องการใช้สิทธิของท่าน กรุณาติดต่อ:

<p><strong>เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (Data Protection Officer: DPO)</strong></p>

<ul>
<li><strong>อีเมล:</strong> contact@cifanfest.com</li>
<li><strong>โทรศัพท์:</strong> +66 86-346-6425</li>
<li><strong>ที่อยู่:</strong> บ้านเลขที่ 1 ซอย 7 ถนนมูลเมือง ต.ศรีภูมิ อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50200</li>
</ul>`
        },
        amendments: {
          title: "10. การแก้ไขนโยบาย",
          content: "เราอาจทบทวนและแก้ไขนโยบายนี้เป็นครั้งคราวเพื่อให้สอดคล้องกับกฎหมายและแนวปฏิบัติที่เปลี่ยนแปลงไป เราจะแจ้งให้ท่านทราบถึงการเปลี่ยนแปลงที่สำคัญผ่านทางเว็บไซต์"
        }
      }
    },
    en: {
      pageTitle: "Privacy Policy",
      lastUpdated: "Effective Date: July 26, 2025",
      backButton: "Back",
      sections: {
        introduction: {
          title: "1. Introduction",
          content: "Yulaison Co.,Ltd. (\"we,\" \"us\") is committed to protecting the privacy of your personal data (\"Data Subject\"). This Policy describes how we collect, use, disclose, and process your personal data in compliance with Thailand's Personal Data Protection Act B.E. 2562 (2019) (\"PDPA\")."
        },
        dataCollection: {
          title: "2. Personal Data We Collect",
          content: `We may collect the following types of personal data, including but not limited to:

<p><strong>Directly Provided Data:</strong> e.g., name-surname, email address, phone number, age, date of birth, educational institution/workplace, profile photograph.</p>

<p><strong>Submission Data:</strong> Film submissions, screenplays, and other application materials you provide.</p>

<p><strong>Automatically Collected Data:</strong> e.g., IP address, browser type, website usage data (pages visited, time spent) via cookies and other tracking technologies.</p>`
        },
        purposes: {
          title: "3. Purposes and Legal Basis for Processing",
          content: `We process your data based on the following purposes and legal bases:

<p><strong>Contractual Basis:</strong> To process your application, verify eligibility, communicate with you, judge submissions, and announce winners for the competition.</p>

<p><strong>Legitimate Interest:</strong> For festival administration, event promotion, service analytics and improvement, and system security.</p>

<p><strong>Consent:</strong> To send you marketing communications, newsletters, and updates about our other activities not directly related to the competition you entered.</p>`
        },
        disclosure: {
          title: "4. Disclosure of Personal Data",
          content: `We may disclose your personal data to the following parties:

<ul>
<li>Jury Members and the Organizing Team.</li>
<li>Third-Party Service Providers who support our operations (under strict data processing agreements).</li>
<li>Government or Regulatory Authorities upon a lawful request.</li>
</ul>`
        },
        security: {
          title: "5. Data Security",
          content: "We have implemented appropriate technical and organizational security measures to prevent unauthorized access, use, or disclosure of your personal data."
        },
        retention: {
          title: "6. Data Retention Period",
          content: `We will retain your personal data only for as long as necessary to fulfill the stated purposes:

<ul>
<li><strong>Submission Data (Non-awarded):</strong> For 3 years after the festival concludes.</li>
<li><strong>Data and Works (Award-winning/Selected):</strong> For 5 years after the festival concludes.</li>
<li><strong>Marketing Data:</strong> Until you withdraw your consent.</li>
</ul>`
        },
        rights: {
          title: "7. Rights of the Data Subject",
          content: "You have rights under the PDPA, including the right to access, rectify, erase, restrict, object to processing, data portability, and withdraw consent."
        },
        cookies: {
          title: "8. Cookies and Tracking Technologies Policy",
          content: `Our website uses cookies, which are small text files stored on your computer or device, to help the site function effectively and provide a better user experience.

<h3>8.1 Types of Cookies We Use</h3>

<p><strong>Strictly Necessary Cookies:</strong> These cookies are essential for the basic functionality of the website, such as logging in, navigating pages, and enabling secure transactions. You cannot opt out of these cookies through our system.</p>

<p><strong>Analytical/Performance Cookies:</strong> These cookies help us understand how users interact with our website by counting visitors and analyzing traffic sources. This information allows us to measure and improve the performance of our site.</p>

<p><strong>Marketing Cookies:</strong> These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant advertisements on other sites.</p>

<h3>8.2 Managing Your Cookie Preferences</h3>

<p>Except for strictly necessary cookies, you can accept or decline the use of other cookie types through our Cookie Consent Tool. You can also set your browser to refuse all cookies or to indicate when a cookie is being sent. However, disabling certain cookies may impact your experience on the site.</p>`
        },
        contact: {
          title: "9. Contact Us",
          content: `If you have any questions about this Policy or wish to exercise your rights, please contact our:

<p><strong>Data Protection Officer (DPO)</strong></p>

<ul>
<li><strong>Email:</strong> contact@cifanfest.com</li>
<li><strong>Phone:</strong> +66 86-346-6425</li>
<li><strong>Address:</strong> 1 MoonMueng Soi 7, Sriphum, Mueang Chiang Mai, Chiang Mai 50200, Thailand</li>
</ul>`
        },
        amendments: {
          title: "10. Policy Amendments",
          content: "We may review and amend this Policy from time to time to align with changes in laws and practices. We will notify you of any material changes via our website."
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
          {Object.entries(currentContent.sections).map(([key, section]) => (
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
          ))}
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

export default PrivacyPolicyPage;
