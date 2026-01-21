'use client';

import { useRef, useState } from 'react';
// import html2canvas from 'html2canvas'; // Moved to dynamic import
import { RPGStats } from '@/lib/gamification';
import { Sword, Brain, Zap, Crown, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DevCardProps {
  user: {
    login: string;
    avatar_url: string;
    name: string | null;
  };
  stats: RPGStats;
  loading: boolean;
}

export default function DevCard({ user, stats, loading }: DevCardProps) {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    
    try {
      // Dynamic import
      const html2canvas = (await import('html2canvas')).default;

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
        logging: false,
        onclone: (doc) => {
            const all = doc.getElementsByTagName('*');
            for(let i=0; i<all.length; i++) {
                const style = window.getComputedStyle(all[i]);
                if(style.borderColor?.includes('lab') || style.borderColor?.includes('oklch')) {
                    (all[i] as HTMLElement).style.borderColor = '#475569';
                }
                if(style.backgroundColor?.includes('lab') || style.backgroundColor?.includes('oklch')) {
                    (all[i] as HTMLElement).style.backgroundColor = '#0f172a';
                }
                if(style.color?.includes('lab') || style.color?.includes('oklch')) {
                   (all[i] as HTMLElement).style.color = '#cbd5e1';
                }
            }
        }
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${user.login}-dev-card.png`;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate image. Try taking a screenshot instead for now.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getThemeColors = (rpgClass: string) => {
    switch (rpgClass) {
      case 'Code Ninja': return { text: '#c084fc', border: '#a855f7', bg: '#2e1065' };
      case 'Data Sorcerer': return { text: '#60a5fa', border: '#3b82f6', bg: '#172554' };
      case 'System Paladin': return { text: '#facc15', border: '#eab308', bg: '#422006' };
      case 'Performance Monk': return { text: '#fb923c', border: '#f97316', bg: '#431407' };
      case 'Pixel Artist': return { text: '#f472b6', border: '#ec4899', bg: '#500724' };
      default: return { text: '#94a3b8', border: '#64748b', bg: '#0f172a' };
    }
  };

  const theme = getThemeColors(stats.class);

  if (loading) return <div className="text-white">{t('rpg.generating')}</div>;

  return (
    <div className="flex flex-col items-center gap-6 my-8 w-full">
      
      {/* CARD CONTAINER */}
      <div 
        ref={cardRef}
        style={{
          width: '400px',
          height: '600px',
          backgroundColor: '#0f172a',
          border: `4px solid ${theme.border}`,
          borderRadius: '16px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden',
          fontFamily: 'sans-serif'
        }}
      >
          {/* Header */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
            <span style={{ 
                color: theme.text, 
                border: `1px solid ${theme.border}`, 
                backgroundColor: theme.bg,
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
            }}>
              {stats.class}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>{t('rpg.lvl')}</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff' }}>{stats.level}</span>
            </div>
          </div>

          {/* Avatar */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
             <img 
                src={user.avatar_url} 
                alt="avatar" 
                crossOrigin="anonymous"
                style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `4px solid ${theme.border}`,
                    backgroundColor: '#0f172a'
                }}
              />
              <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  right: '8px',
                  backgroundColor: '#1e293b',
                  border: '2px solid #334155',
                  borderRadius: '50%',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#facc15'
              }}>
                 <Crown size={16} fill="#facc15" />
              </div>
          </div>

          {/* Name */}
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px', textAlign: 'center' }}>
            {user.name || user.login}
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px' }}>@{user.login}</p>

          {/* Stats Grid */}
          <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px', 
              width: '100%',
              marginBottom: 'auto'
          }}>
             <StatRow icon={<Sword size={16} />} label={t('rpg.str')} value={stats.str} max={25} color="#f87171" />
             <StatRow icon={<Brain size={16} />} label={t('rpg.int')} value={stats.int} max={25} color="#60a5fa" />
             <StatRow icon={<Zap size={16} />} label={t('rpg.dex')} value={stats.dex} max={25} color="#facc15" />
             <StatRow icon={<Shield size={16} />} label={t('rpg.cha')} value={stats.cha} max={25} color="#c084fc" />
          </div>

          {/* Special Ability Footer */}
          <div style={{
              width: '100%',
              marginTop: '24px',
              padding: '16px',
              border: '1px solid #334155',
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              textAlign: 'center'
          }}>
             <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{t('rpg.specialAbility')}</p>
             <p style={{ fontSize: '16px', fontWeight: 'bold', color: theme.text }}>{stats.specialAbility}</p>
          </div>
      </div>

      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-bold shadow-lg shadow-teal-500/20 transition-all transform hover:scale-105"
      >
        {isDownloading ? t('rpg.generating') : t('rpg.downloadCard')}
      </button>
    </div>
  );
}

function StatRow({ icon, label, value, max, color }: { icon: any, label: string, value: number, max: number, color: string }) {
    const pct = Math.min(100, (value/max)*100);
    return (
        <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: color }}>
                    {icon}
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{label}</span>
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{value}</span>
            </div>
            {/* Bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color }}></div>
            </div>
        </div>
    )
}
