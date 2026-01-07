import { getDisciplineStats } from '@/app/actions/discipline';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, BarChart3 } from 'lucide-react';

export default async function DisciplineInsightsPage() {
  const stats = await getDisciplineStats();

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
           <Link href="/discipline/day/today" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Check
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-secondary" />
            Mastery Insights
          </h1>
        </header>

        <div className="space-y-6">
          {stats.map((rule) => (
            <div key={rule.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-100">{rule.title}</h2>
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-primary">{rule.sevenDayRate}%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">7-Day Rate</div>
                  <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${rule.sevenDayRate}%` }} />
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-bold text-secondary">{rule.thirtyDayRate}%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">30-Day Rate</div>
                   <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${rule.thirtyDayRate}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {stats.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500">Add rules to see your performance trends.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
