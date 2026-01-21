'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts
}

interface LanguageChartProps {
  repos: Array<{ language: string | null }>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f7df1e',
  'Python': '#3776ab',
  'Java': '#007396',
  'Go': '#00add8',
  'Rust': '#000000',
  'C++': '#00599c',
  'C': '#555555',
  'Ruby': '#cc342d',
  'PHP': '#777bb4',
  'Swift': '#fa7343',
  'Kotlin': '#7f52ff',
  'Other': '#6b7280'
};

export default function LanguageChart({ repos }: LanguageChartProps) {
  const { t } = useLanguage();

  // Count languages
  const languageCounts: Record<string, number> = {};
  
  repos.forEach(repo => {
    const lang = repo.language || 'Other';
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  });

  // Convert to chart data
  const data: LanguageData[] = Object.entries(languageCounts)
    .map(([name, value]) => ({
      name,
      value,
      color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS['Other']
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 languages

  if (data.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎨 {t('dashboard.languageDistribution')}</h3>
        <p className="text-gray-400">No language data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">🎨 {t('dashboard.languageDistribution')}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={70} 
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: any, name: any) => [
               `${value} Repos`, 
               name
            ]}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-gray-300">{lang.name}</span>
            <span className="text-gray-500">({lang.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
