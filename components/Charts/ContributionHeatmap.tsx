'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function ContributionHeatmap() {
  const { t } = useLanguage();
  
  // Generate mock data for last 90 days
  const data = Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 10), // Mock data
  }));

  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-800';
    if (count < 3) return 'bg-teal-900';
    if (count < 6) return 'bg-teal-700';
    return 'bg-teal-400';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
         📊 {t('dashboard.contributionActivity')}
      </h3>
      
      <div className="flex gap-1 flex-wrap">
        {data.map((d, i) => (
            <div 
                key={i}
                className={`w-3 h-3 rounded-sm ${getColor(d.count)} hover:scale-125 transition-transform`}
                title={`${d.date}: ${d.count} contributions`}
            />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
        <div className="w-3 h-3 bg-teal-900 rounded-sm"></div>
        <div className="w-3 h-3 bg-teal-700 rounded-sm"></div>
        <div className="w-3 h-3 bg-teal-400 rounded-sm"></div>
        <span>More</span>
      </div>
    </div>
  );
}
