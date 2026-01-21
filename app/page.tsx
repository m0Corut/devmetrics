'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Swords, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/dashboard/${username}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          DEV<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">METRICS</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('home.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Analysis Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl shadow-xl flex flex-col items-center group cursor-pointer hover:border-teal-500/30 transition-all"
          >
            <div className="bg-teal-500/10 p-4 rounded-full mb-6 group-hover:bg-teal-500/20 transition-colors">
              <Brain size={48} className="text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t('home.title')}</h2>
            
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-lg placeholder:text-slate-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-4 rounded-lg transition-colors flex items-center"
              >
                Go
              </button>
            </form>
          </motion.div>

          {/* Battle Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push('/battle')}
            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl shadow-xl flex flex-col items-center group cursor-pointer hover:border-red-500/30 transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="bg-red-500/10 p-4 rounded-full mb-6 group-hover:bg-red-500/20 transition-colors">
              <Swords size={48} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-50">{t('home.features.battle')}</h2>
            <p className="text-slate-400 mb-8 max-w-xs">{t('battle.subtitle')}</p>
            
            <button className="mt-auto w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
              {t('home.battleButton')} <Swords size={20} />
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="flex justify-center gap-8 text-slate-500 text-sm font-medium uppercase tracking-wider">
            <span className="flex items-center gap-2"><Brain size={16} /> {t('home.features.ai')}</span>
            <span className="flex items-center gap-2"><Zap size={16} /> {t('home.features.rpg')}</span>
            <span className="flex items-center gap-2"><Swords size={16} /> {t('home.features.battle')}</span>
        </div>
      </motion.div>
    </div>
  );
}
