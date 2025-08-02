import React from 'react';
import AnimatedButton from '../ui/AnimatedButton';

const CityRallySection = () => {
  const locations = [
    { name: "Tha Phae Gate", icon: "🏰", points: "50pts" },
    { name: "Three Kings Monument", icon: "👑", points: "40pts" },
    { name: "Chiang Mai University", icon: "🎓", points: "45pts" },
    { name: "Nong Buak Haad Park", icon: "🌳", points: "35pts" },
    { name: "Railway Station", icon: "🚂", points: "60pts" }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#3B6891] to-[#00305A] opacity-90"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl header-en mb-4 text-white">
            🎪 CIFAN City Rally
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto body-en">
            Explore Chiang Mai's iconic locations, take photos with our Kham Pan Cat mascot, and earn points for exclusive rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Rally Map/Locations */}
          <div className="glass-container p-8 rounded-3xl">
            <h3 className="text-2xl header-en mb-6 text-center text-white">📍 Rally Locations</h3>
            <div className="space-y-4">
              {locations.map((location, index) => (
                <div key={index} className="glass-card p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{location.icon}</span>
                    <span className="text-white body-en">{location.name}</span>
                  </div>
                  <span className="text-[#FCB283] body-en">{location.points}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FCB283] to-[#AA4626]">
                <span className="text-2xl">🐱</span>
                <span className="text-white body-en">Find Kham Pan Cat!</span>
              </div>
            </div>
          </div>

          {/* Rally Benefits */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h4 className="text-xl subtitle-en mb-3 text-[#FCB283]">🎁 Exclusive Rewards</h4>
              <ul className="space-y-2 text-white/80 body-en">
                <li>• 10% discount at partner restaurants</li>
                <li>• Free movie tickets for top collectors</li>
                <li>• Exclusive CIFAN merchandise</li>
                <li>• VIP access to special events</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h4 className="text-xl subtitle-en mb-3 text-[#FCB283]">📱 How to Participate</h4>
              <ol className="space-y-2 text-white/80 body-en">
                <li>1. Visit rally locations around Chiang Mai</li>
                <li>2. Take photos with Kham Pan Cat mascot</li>
                <li>3. Share on social media with #CIFAN2025</li>
                <li>4. Collect points and redeem rewards</li>
              </ol>
            </div>

            <AnimatedButton 
              variant="primary" 
              size="large" 
              icon="🚀" 
              className="w-full"
              onClick={() => {
                window.location.hash = '#coming-soon';
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
            >
              Start Your Rally Adventure
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityRallySection;
