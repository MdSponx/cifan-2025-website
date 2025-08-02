import React from 'react';

const QuickInfoSection = () => {
  const highlights = [
    {
      icon: "🎬",
      title: "20 Films",
      description: "Curated fantastic films from around the world",
      color: "from-[#00305A] to-[#3B6891]"
    },
    {
      icon: "💰", 
      title: "1 Million Baht",
      description: "Total prize money for short film competition",
      color: "from-[#AA4626] to-[#FCB283]"
    },
    {
      icon: "🎪",
      title: "City Rally",
      description: "Collect points around Chiang Mai city",
      color: "from-[#6EE7B7] to-[#3B82F6]"
    },
    {
      icon: "🎓",
      title: "Workshops",
      description: "Professional film industry training sessions",
      color: "from-[#A78BFA] to-[#F472B6]"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl header-en mb-4 bg-gradient-to-r from-[#FCB283] to-[#AA4626] bg-clip-text text-transparent">
            ✨ Festival Highlights
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto body-en">
            Experience the magic of fantastic cinema with world-class programming, competitions, and industry events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <div key={index} className="group">
              <div className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 border border-white/10">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl header-en mb-3 text-white group-hover:text-[#FCB283] transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/70 leading-relaxed body-en">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickInfoSection;