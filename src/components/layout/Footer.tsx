import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#110D16] to-[#00305A] pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          
          {/* Festival Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2Flogoooo%404x.png?alt=media&token=fc82d494-6be2-4218-a7d9-3b63213180b9"
                alt="CIFAN Logo"
                className="w-10 sm:w-12 h-10 sm:h-12 object-contain"
              />
              <div>
                <h3 className="text-lg sm:text-xl header-en text-white">CIFAN 2025</h3>
                <p className="text-xs menu-en text-[#FCB283]">Film Festival</p>
              </div>
            </div>
            <p className="text-white/70 mb-3 sm:mb-4 leading-relaxed body-en text-sm sm:text-base">
              Chiang Mai Fantastic International Film Festival - Where Fantasy Meets Reality
            </p>
            <div className="text-white/60 body-en text-sm">
              <p>📅 September 20-27, 2025</p>
              <p>📍 Railway Station Park, Chiang Mai</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg subtitle-en text-white mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <FooterLink href="#programs">Programs</FooterLink>
              <FooterLink href="#competition">Competition</FooterLink>
              <FooterLink href="#city-rally">City Rally</FooterLink>
              <FooterLink href="#workshops">Workshops</FooterLink>
              <FooterLink href="#tickets">Tickets</FooterLink>
              <FooterLink href="#schedule">Schedule</FooterLink>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-base sm:text-lg subtitle-en text-white mb-4 sm:mb-6">Information</h4>
            <ul className="space-y-2 sm:space-y-3">
              <FooterLink href="#about">About Festival</FooterLink>
              <FooterLink href="#news">News & Updates</FooterLink>
              <FooterLink href="#guidelines">Submission Guidelines</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
              <FooterLink href="#contact">Contact Us</FooterLink>
              <FooterLink href="#press">Press Kit</FooterLink>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-base sm:text-lg subtitle-en text-white mb-4 sm:mb-6">Connect</h4>
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 body-en text-sm">
              <p className="text-white/70">📧 contact@cifanfest.com</p>
              <p className="text-white/70">📱 +66 86-346-6425</p>
              <p className="text-white/70">📍 Mueang, Chiang Mai 50200</p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-3 sm:space-x-4">
              <SocialButton icon={<Facebook size={20} />} href="https://www.facebook.com/cifan.official/" label="Facebook" />
              <SocialButton icon={<Instagram size={20} />} href="https://www.instagram.com/cifanofficial/" label="Instagram" />
              <SocialButton icon={<Youtube size={20} />} href="https://www.youtube.com/@CIFANofficial" label="YouTube" />
            </div>

            {/* Newsletter */}
            <div className="mt-4 sm:mt-6">
              <h5 className="text-white body-en mb-2 sm:mb-3 text-sm sm:text-base">Stay Updated</h5>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 sm:px-4 py-2 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FCB283] body-en text-sm"
                />
                <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#AA4626] to-[#FCB283] rounded-r-lg hover:from-[#FCB283] hover:to-[#AA4626] transition-all text-sm">
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-white/60 text-xs sm:text-sm body-en text-center sm:text-left">
              © 2025 CIFAN - Chiang Mai Fantastic International Film Festival. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm menu-en">
              <a href="#privacy-policy" className="text-white/60 hover:text-[#FCB283] transition-colors">Privacy & Cookie Policy</a>
              <a href="#terms-conditions" className="text-white/60 hover:text-[#FCB283] transition-colors">Terms & Conditions</a>
            </div>
          </div>
          
          <div className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs body-en">
              🎬 Powered by Kham Pan Cat 🐱 | Organized by Ulysses Co., Ltd.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a href={href} className="text-white/70 hover:text-[#FCB283] transition-colors menu-en text-sm">
      {children}
    </a>
  </li>
);

const SocialButton = ({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 sm:w-10 h-8 sm:h-10 glass-card rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
    aria-label={label}
  >
    <span className="text-white">{icon}</span>
  </a>
);

export default Footer;
