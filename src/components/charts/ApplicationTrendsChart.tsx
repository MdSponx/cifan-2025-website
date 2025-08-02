import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { TrendData } from '../../types/admin.types';
import ChartContainer from '../ui/ChartContainer';

interface ApplicationTrendsChartProps {
  data: TrendData[];
  loading?: boolean;
  error?: string;
}

const ApplicationTrendsChart: React.FC<ApplicationTrendsChartProps> = ({
  data,
  loading = false,
  error
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      title: "แนวโน้มการสมัคร",
      subtitle: "จำนวนใบสมัครใน 30 วันที่ผ่านมา",
      noData: "ไม่มีข้อมูลแนวโน้ม",
      youth: "เยาวชน",
      future: "อนาคต",
      world: "โลก",
      total: "รวม",
      submissions: "ใบสมัคร"
    },
    en: {
      title: "Application Trends",
      subtitle: "Submission trends over the last 30 days",
      noData: "No trend data available",
      youth: "Youth",
      future: "Future",
      world: "World",
      total: "Total",
      submissions: "submissions"
    }
  };

  const currentContent = content[currentLanguage];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-container rounded-lg p-4 border border-white/20">
          <p className={`${getClass('body')} text-white font-medium mb-2`}>
            {data.dateFormatted}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className={`${getClass('body')} text-white/80 text-sm`}>
                    {entry.name}:
                  </span>
                </div>
                <span className={`${getClass('body')} text-white text-sm font-medium`}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className={`${getClass('body')} text-white/80 text-sm`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
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
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)"
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={formatXAxisTick}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              
              <Line 
                type="monotone" 
                dataKey="youth" 
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                name={currentContent.youth}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey="future" 
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                name={currentContent.future}
                animationDuration={1000}
                animationBegin={200}
              />
              <Line 
                type="monotone" 
                dataKey="world" 
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                name={currentContent.world}
                animationDuration={1000}
                animationBegin={400}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#FCB283"
                strokeWidth={4}
                strokeDasharray="5 5"
                dot={{ fill: '#FCB283', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#FCB283', strokeWidth: 2 }}
                name={currentContent.total}
                animationDuration={1000}
                animationBegin={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-white/60">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className={`${getClass('body')} text-sm`}>
              {currentContent.noData}
            </p>
          </div>
        </div>
      )}
    </ChartContainer>
  );
};

export default ApplicationTrendsChart;