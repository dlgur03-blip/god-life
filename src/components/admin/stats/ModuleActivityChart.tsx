'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTranslations } from 'next-intl';

type ModuleActivityChartProps = {
  destinyTrend: Array<{ date: string; count: number }>;
  epistleTrend: Array<{ date: string; count: number }>;
  successTrend: Array<{ date: string; count: number }>;
};

export default function ModuleActivityChart({ destinyTrend, epistleTrend, successTrend }: ModuleActivityChartProps) {
  const t = useTranslations('Admin.stats');

  // 데이터 병합
  const dateSet = new Set<string>();
  destinyTrend.forEach((d) => dateSet.add(d.date));
  epistleTrend.forEach((d) => dateSet.add(d.date));
  successTrend.forEach((d) => dateSet.add(d.date));

  const dates = Array.from(dateSet).sort();
  const destinyMap = new Map(destinyTrend.map((d) => [d.date, d.count]));
  const epistleMap = new Map(epistleTrend.map((d) => [d.date, d.count]));
  const successMap = new Map(successTrend.map((d) => [d.date, d.count]));

  const data = dates.map((date) => ({
    date,
    displayDate: date.slice(5).replace('-', '/'),
    destiny: destinyMap.get(date) || 0,
    epistle: epistleMap.get(date) || 0,
    success: successMap.get(date) || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#e2e8f0',
          }}
        />
        <Legend
          wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }}
        />
        <Bar dataKey="destiny" name={t('modules.destiny')} fill="#06b6d4" radius={[4, 4, 0, 0]} />
        <Bar dataKey="epistle" name={t('modules.epistle')} fill="#ec4899" radius={[4, 4, 0, 0]} />
        <Bar dataKey="success" name={t('modules.success')} fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
