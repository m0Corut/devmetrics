'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swords } from 'lucide-react';

export default function BattlePage() {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const router = useRouter();

  const handleFight = (e: React.FormEvent) => {
    e.preventDefault();
    if (p1 && p2) {
      router.push(`/battle/${p1}-vs-${p2}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 mb-2 drop-shadow-lg tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
          DEV BATTLE
        </h1>
        <p className="text-red-400 tracking-[0.5em] font-bold mb-12 uppercase">Choose Your Fighters</p>

        {/* VS Form */}
        <form onSubmit={handleFight} className="w-full grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
          
          {/* Player 1 */}
          <div className="flex flex-col gap-2">
            <label className="text-blue-400 font-bold uppercase tracking-wider text-sm">Challenger 1</label>
            <input 
              type="text" 
              placeholder="github_username"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              className="bg-slate-950 border-2 border-blue-900/50 p-4 rounded-lg text-white font-mono focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-center text-lg placeholder:text-slate-700"
              required
            />
          </div>

          {/* VS Icon */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse">
                <span className="font-black italic text-2xl text-white">VS</span>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex flex-col gap-2">
            <label className="text-orange-400 font-bold uppercase tracking-wider text-sm">Challenger 2</label>
            <input 
              type="text" 
              placeholder="github_username"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              className="bg-slate-950 border-2 border-orange-900/50 p-4 rounded-lg text-white font-mono focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all text-center text-lg placeholder:text-slate-700"
              required
            />
          </div>

          {/* Fight Button */}
          <div className="md:col-span-3 flex justify-center mt-8">
            <button 
              type="submit"
              disabled={!p1 || !p2}
              className="group relative px-12 py-4 bg-red-600 hover:bg-red-500 text-white text-xl font-black uppercase tracking-widest rounded-sm transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.4)] clip-path-slant"
            >
              <span className="flex items-center gap-3">
                <Swords size={24} />
                FIGHT!
              </span>
              {/* Button Glitch Effect layer */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>

        </form>

        <a href="/" className="mt-8 text-slate-500 hover:text-white transition-colors text-sm">
          ← Back to Peace Mode (Dashboard)
        </a>
      </div>
    </div>
  );
}
