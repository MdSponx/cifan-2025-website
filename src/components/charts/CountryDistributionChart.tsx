import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { CountryStats } from '../../types/admin.types';
import ChartContainer from '../ui/ChartContainer';

interface CountryDistributionChartProps {
  data: CountryStats[];
  loading?: boolean;
  error?: string;
}

const CountryDistributionChart: React.FC<CountryDistributionChartProps> = ({
  data,
  loading = false,
  error
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      title: "การกระจายตัวตามประเทศ",
      subtitle: "10 ประเทศที่มีผู้ส่งผลงานมากที่สุด",
      noData: "ไม่มีข้อมูลประเทศ",
      submissions: "ผลงาน"
    },
    en: {
      title: "Country Distribution",
      subtitle: "Top 10 countries by submission count",
      noData: "No country data available",
      submissions: "submissions"
    }
  };

  const currentContent = content[currentLanguage];

  // Take top 10 countries and sort by count
  const topCountries = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-container rounded-lg p-3 border border-white/20">
          <div className="flex items-center space-x-2 mb-1">
            {data.flag && <span className="text-lg">{data.flag}</span>}
            <p className={`${getClass('body')} text-white font-medium`}>
              {data.country}
            </p>
          </div>
          <p className={`${getClass('body')} text-[#FCB283] text-sm`}>
            {data.count} {currentContent.submissions}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const country = topCountries.find(c => c.country === payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize="12"
          className={getClass('body')}
        >
          {country?.flag && (
            <tspan x={0} dy="-8" fontSize="16">{country.flag}</tspan>
          )}
          <tspan x={0} dy="20" fontSize="10">
            {payload.value.length > 8 ? `${payload.value.slice(0, 8)}...` : payload.value}
          </tspan>
        </text>
      </g>
    );
  };

  return (
    <ChartContainer
      title={currentContent.title}
      subtitle={currentContent.subtitle}
      loading={loading}
      error={error}
    >
      {topCountries.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCountries}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)"
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="country"
                axisLine={false}
                tickLine={false}
                tick={<CustomXAxisTick />}
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={(value) => value.toString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#countryGradient)"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                animationBegin={200}
              />
              <defs>
                <linearGradient id="countryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FCB283" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#AA4626" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-white/60">
          <div className="text-center">
            <div className="text-4xl mb-2">🌍</div>
            <p className={`${getClass('body')} text-sm`}>
              {currentContent.noData}
            </p>
          </div>
        </div>
      )}
    </ChartContainer>
  );
};

export default CountryDistributionChart;