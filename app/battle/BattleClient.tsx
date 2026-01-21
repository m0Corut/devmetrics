'use client';

import { useEffect, useState } from 'react';
import { calculateRPGStats, RPGStats } from '@/lib/gamification';
import DevCard from '@/components/RPG/DevCard';
import { Swords, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useLanguage } from '@/context/LanguageContext';

interface BattleClientProps {
  fighters: string[];
}

export default function BattleClient({ fighters }: BattleClientProps) {
  const { t } = useLanguage();
  const [p1, p2] = fighters;
  const [p1Data, setP1Data] = useState<any>(null);
  const [p2Data, setP2Data] = useState<any>(null);
  const [p1Stats, setP1Stats] = useState<RPGStats | null>(null);
  const [p2Stats, setP2Stats] = useState<RPGStats | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    async function initBattle() {
      try {
        const [u1Res, u2Res, c1Res, c2Res, r1Res, r2Res] = await Promise.all([
           fetch(`/api/github/user/${p1}`),
           fetch(`/api/github/user/${p2}`),
           fetch(`/api/github/commits/${p1}`),
           fetch(`/api/github/commits/${p2}`),
           fetch(`/api/github/repos/${p1}`),
           fetch(`/api/github/repos/${p2}`)
        ]);

        const u1 = await u1Res.json();
        const u2 = await u2Res.json();
        const c1 = await c1Res.json();
        const c2 = await c2Res.json();
        const r1 = await r1Res.json();
        const r2 = await r2Res.json();

        setP1Data(u1.data);
        setP2Data(u2.data); 

        // Stats (Updated Formula)
        const estCommits1 = (u1.data.public_repos * 20) + (c1.data || []).length;
        const estCommits2 = (u2.data.public_repos * 20) + (c2.data || []).length;
        setP1Stats(calculateRPGStats(u1.data, r1.data || [], estCommits1));
        setP2Stats(calculateRPGStats(u2.data, r2.data || [], estCommits2));

        // Call AI Judge
        const battleRes = await fetch('/api/ai/battle', {
             method: 'POST',
             body: JSON.stringify({
                 u1, u2,
                 u1Data: { ...u1.data, stars: r1.data?.reduce((a:any,b:any)=>a+b.stargazers_count,0) || 0, topLang: p1Stats?.topLang },
                 u2Data: { ...u2.data, stars: r2.data?.reduce((a:any,b:any)=>a+b.stargazers_count,0) || 0, topLang: p2Stats?.topLang }
             })
        });
        const battleData = await battleRes.json();
        setResult(battleData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initBattle();
  }, [p1, p2]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
            <Swords size={64} className="text-red-500 mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold animate-pulse">{t('battle.preparing')}</h2>
        <p className="text-gray-500">{t('battle.summoning')}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Dynamic Confetti for Winner */}
      {result && <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={200} recycle={false} />}
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen flex flex-col justify-center">
        
        {/* Header */}
        <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12 relative z-10"
        >
            <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 drop-shadow-lg">
                {t('battle.title')}
            </h1>
            <p className="text-gray-400 mt-2 text-xl">{t('battle.subtitle')}</p>
        </motion.div>

        {/* The Arena */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
            
            {/* Player 1 */}
            <motion.div 
                initial={{ x: -200, opacity: 0 }}
                animate={result?.winner === p1 ? {
                    x: 0, opacity: 1, scale: 1.1,
                    y: [0, -20, 0], // Higher Levitation
                    boxShadow: [
                        "0px 0px 0px rgba(234, 179, 8, 0)",
                        "0px 0px 40px rgba(234, 179, 8, 0.8)",
                        "0px 0px 0px rgba(234, 179, 8, 0)"
                    ]
                } : { 
                    x: 0, opacity: 1, scale: 0.95
                }}
                transition={result?.winner === p1 ? {
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    default: { type: 'spring' }
                } : { type: 'spring' }}
                className={`relative ${result?.winner === p1 ? 'z-20' : 'z-10 opacity-60'}`} 
            >
                 {result?.winner === p1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.5 }} 
                        animate={{ opacity: 1, y: -60, scale: 1.2 }}
                        className="absolute -top-12 left-0 right-0 text-center flex justify-center"
                    >
                        <span className="bg-yellow-500 text-black font-black px-4 py-1 rounded-full text-xl shadow-lg shadow-yellow-500/50 flex items-center gap-2">
                             👑 {t('battle.winner')}
                        </span>
                    </motion.div>
                 )}
                 <DevCard user={p1Data} stats={p1Stats!} loading={false} />
                 
                 {/* HP/Score Bar */}
                 {result && (
                    <div className="mt-4 bg-gray-800 rounded-full h-6 overflow-hidden border-2 border-gray-700 relative">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.u1Score}%` }}
                            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-red-600 to-yellow-500"
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-sm shadow-black drop-shadow-md z-10">
                            {t('battle.power')}: {result.u1Score}
                        </span>
                    </div>
                 )}
            </motion.div>

            {/* VS CENTER */}
            <div className="flex flex-col items-center justify-center z-10">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                >
                    <span className="text-7xl font-black text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] italic">VS</span>
                </motion.div>
                
                {/* AI VERDICT */}
                <AnimatePresence>
                    {result && (
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.5, type: 'spring' }}
                            className="mt-8 bg-black/80 backdrop-blur-md border border-red-500/30 p-6 rounded-xl text-center shadow-2xl max-w-sm"
                        >
                            <h3 className="text-red-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
                                <Skull size={20} /> {t('battle.verdict')}
                            </h3>
                            <p className="text-gray-200 italic font-medium leading-relaxed">
                                "{result.reason}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Player 2 */}
            <motion.div 
                initial={{ x: 200, opacity: 0 }}
                animate={result?.winner === p2 ? {
                    x: 0, opacity: 1, scale: 1.1,
                    y: [0, -20, 0], // Higher Levitation
                    boxShadow: [
                        "0px 0px 0px rgba(56, 189, 248, 0)",
                        "0px 0px 40px rgba(56, 189, 248, 0.8)",
                        "0px 0px 0px rgba(56, 189, 248, 0)"
                    ]
                } : { 
                    x: 0, opacity: 1, scale: 0.95 
                }}
                transition={result?.winner === p2 ? {
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    default: { type: 'spring' }
                } : { type: 'spring' }}
                className={`relative ${result?.winner === p2 ? 'z-20' : 'z-10 opacity-60'}`} 
            >
                 {result?.winner === p2 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.5 }} 
                        animate={{ opacity: 1, y: -60, scale: 1.2 }}
                        className="absolute -top-12 left-0 right-0 text-center flex justify-center"
                    >
                        <span className="bg-yellow-500 text-black font-black px-4 py-1 rounded-full text-xl shadow-lg shadow-yellow-500/50 flex items-center gap-2">
                             👑 {t('battle.winner')}
                        </span>
                    </motion.div>
                 )}
                 <DevCard user={p2Data} stats={p2Stats!} loading={false} />

                 {/* HP/Score Bar */}
                 {result && (
                    <div className="mt-4 bg-gray-800 rounded-full h-6 overflow-hidden border-2 border-gray-700 relative">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.u2Score}%` }}
                            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-sm shadow-black drop-shadow-md z-10">
                            {t('battle.power')}: {result.u2Score}
                        </span>
                    </div>
                 )}
            </motion.div>

        </div>

         <div className="text-center mt-12">
            <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                ← {t('battle.back')}
            </a>
         </div>
      </div>
    </div>
  );
}
