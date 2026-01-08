'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { useTranslations } from 'next-intl';

type DisciplineTrendChartProps = {
  data: Array<{ date: string; rate: number }>;
  averageRate: number;
};

export default function DisciplineTrendChart({ data, averageRate }: DisciplineTrendChartProps) {
  const t = useTranslations('Admin.stats');

  const formattedData = data.map((d) => ({
    ...d,
    displayDate: d.date.slice(5).replace('-', '/'),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="displayDate"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#e2e8f0',
          }}
          formatter={(value) => [`${value}%`, t('charts.achievementRate')]}
        />
        <ReferenceLine
          y={averageRate}
          stroke="#f59e0b"
          strokeDasharray="5 5"
          label={{
            value: `${t('charts.average')}: ${averageRate}%`,
            fill: '#f59e0b',
            fontSize: 11,
            position: 'right'
          }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: '#f59e0b', strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: '#f59e0b' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
