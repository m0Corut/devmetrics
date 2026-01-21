'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityPatternProps {
  peakHours?: string[];
}

export default function ActivityPattern({ peakHours }: ActivityPatternProps) {
  // Generate mock hourly activity data
  const generateMockData = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      
      // Higher activity during peak hours
      let commits = Math.floor(Math.random() * 5);
      
      if (peakHours) {
        const isPeak = peakHours.some(range => {
          const [start] = range.split('-');
          const startHour = parseInt(start.split(':')[0]);
          return i >= startHour && i < startHour + 4;
        });
        
        if (isPeak) {
          commits += Math.floor(Math.random() * 10) + 5;
        }
      } else {
        // Default peak hours: 14-18, 20-23
        if ((i >= 14 && i < 18) || (i >= 20 && i < 23)) {
          commits += Math.floor(Math.random() * 10) + 5;
        }
      }
      
      hours.push({ hour, commits });
    }
    return hours;
  };

  const data = generateMockData();

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">⏰ Activity Pattern (24 Hours)</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="hour" 
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            interval={2}
          />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="commits" fill="#14b8a6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-400 text-center">
        <p>Most active hours highlighted in teal</p>
      </div>
    </div>
  );
}
