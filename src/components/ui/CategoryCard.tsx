import React from 'react';

interface CategoryCardProps {
  icon: string;
  title: string;
  prize: string;
  description: string;
  gradient: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, prize, description, gradient }) => {
  return (
    <div className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300 border border-white/10">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h4 className="text-xl subtitle-en mb-2 text-white group-hover:text-[#FCB283] transition-colors">
        {title}
      </h4>
      <div className="text-2xl header-en text-[#FCB283] mb-2">
        {prize}
      </div>
      <p className="text-sm text-white/70 body-en">
        {description}
      </p>
    </div>
  );
};

export default CategoryCard;