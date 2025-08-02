import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { GenreStats } from '../../types/admin.types';
import ChartContainer from '../ui/ChartContainer';

interface GenreDistributionChartProps {
  data: GenreStats[];
  loading?: boolean;
  error?: string;
}

const GenreDistributionChart: React.FC<GenreDistributionChartProps> = ({
  data,
  loading = false,
  error
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      title: "การกระจายตัวของแนวภาพยนตร์",
      subtitle: "สัดส่วนแนวภาพยนตร์ในการประกวด",
      noData: "ไม่มีข้อมูลแนวภาพยนตร์"
    },
    en: {
      title: "Genre Distribution",
      subtitle: "Film genre breakdown across all submissions",
      noData: "No genre data available"
    }
  };

  const currentContent = content[currentLanguage];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-container rounded-lg p-3 border border-white/20">
          <p className={`${getClass('body')} text-white font-medium mb-1`}>
            {data.genre}
          </p>
          <p className={`${getClass('body')} text-[#FCB283] text-sm`}>
            {data.count} {currentLanguage === 'th' ? 'เรื่อง' : 'films'} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 px-3 py-1 glass-card rounded-lg">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className={`${getClass('body')} text-white/80 text-xs`}>
              {entry.value} ({data.find(d => d.genre === entry.value)?.percentage}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Genre count badges below the chart
  const GenreCountBadges = () => {
    if (data.length === 0) return null;

    // Calculate total count for percentage calculation
    const totalCount = data.reduce((sum, genre) => sum + genre.count, 0);

    return (
      <div className="mt-6 pt-4 border-t border-white/20">
        <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-3 text-center`}>
          {currentLanguage === 'th' ? 'จำนวนตามแนวภาพยนตร์' : 'Count by Genre'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {data.slice(0, 8).map((genre, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: genre.color }}
                ></div>
                <span className={`${getClass('body')} text-white/80 text-xs truncate`}>
                  {genre.genre} {genre.count} ({Math.round((genre.count / totalCount) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
        {data.length > 8 && (
          <p className={`text-xs ${getClass('body')} text-white/60 text-center mt-2`}>
            {currentLanguage === 'th' 
              ? `และอีก ${data.length - 8} แนวอื่นๆ` 
              : `and ${data.length - 8} more genres`
            }
          </p>
        )}
      </div>
    );
  };

  return (
    <ChartContainer
      title={currentContent.title}
      subtitle={currentContent.subtitle}
      loading={loading}
      error={error}
    >
      {data.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                paddingAngle={2}
                dataKey="count"
                animationBegin={0}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-white/60">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className={`${getClass('body')} text-sm`}>
              {currentContent.noData}
            </p>
          </div>
        </div>
      )}
      
      {/* Genre Count Badges */}
      <GenreCountBadges />
    </ChartContainer>
  );
};

export default GenreDistributionChart;