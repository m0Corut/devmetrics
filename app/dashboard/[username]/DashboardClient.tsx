'use client';

import { useEffect, useState, useRef } from 'react';
import ContributionHeatmap from '@/components/Charts/ContributionHeatmap';
import LanguageChart from '@/components/Charts/LanguageChart';
import ActivityPattern from '@/components/Charts/ActivityPattern';
import { ProfileSkeleton, InsightSkeleton, ChartsSkeleton, ReposSkeleton } from '@/components/UI/Skeleton';
import DevCard from '@/components/RPG/DevCard';
import { calculateRPGStats, RPGStats } from '@/lib/gamification';
import { generateResume } from '@/lib/resumeGenerator';
import { FileDown, Brain } from 'lucide-react';
import { ArrowLeft, Share2, Download, Swords } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface UserData {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

interface RepoData {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export default function DashboardClient({ username }: { username: string }) {
  const { t } = useLanguage();
  const [user, setUser] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [rpgStats, setRpgStats] = useState<RPGStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent double fetching in Strict Mode
  const isFetching = useRef(false);

  useEffect(() => {
    async function fetchData() {
      // If already fetching or data exists, skip
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        setLoading(true);
        
        // Fetch user data
        const userRes = await fetch(`/api/github/user/${username}`, { cache: 'no-store' });
        const userData = await userRes.json();
        
        if (userData.error) {
          setError(userData.error);
          return;
        }
        
        setUser(userData.data);

        // Fetch repos
        const reposRes = await fetch(`/api/github/repos/${username}`, { cache: 'no-store' });
        const reposData = await reposRes.json();
        setRepos(reposData.data || []);

        // Fetch commits (needed for AI)
        const commitsRes = await fetch(`/api/github/commits/${username}`, { cache: 'no-store' });
        const commitsData = await commitsRes.json();
        const commits = commitsData.data || [];

        // Fetch AI analysis with commits data
        const aiRes = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ 
            username,
            commits: JSON.stringify(commits.slice(0, 50)),
            repos: JSON.stringify(reposData.data || [])
          }),
        });
        const aiData = await aiRes.json();
        setAiAnalysis(aiData.data);

        // Calculate RPG Stats
        const estimatedTotalCommits = (userData.data.public_repos * 20) + commits.length;
        const rpg = calculateRPGStats(userData.data, reposData.data || [], estimatedTotalCommits);
        setRpgStats(rpg);

      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  if (loading) return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
          <div className="max-w-7xl mx-auto space-y-8">
              <ProfileSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                      <ChartsSkeleton />
                      <InsightSkeleton />
                  </div>
                  <div className="hidden md:block">
                       <div className="bg-slate-800/50 rounded-xl h-[600px] animate-pulse"></div>
                  </div>
              </div>
          </div>
      </div>
  );
  
  if (error || !user) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-3xl font-bold mb-4 text-red-500">User Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md text-center">
            {error || "We couldn't locate this GitHub user. Please check the spelling."}
        </p>
        <Link href="/" className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-full transition-colors">
            {t('dashboard.tryAnother')}
        </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <a href="/" className="text-teal-400 hover:text-teal-300 mb-4 inline-block text-sm md:text-base">
                ← {t('dashboard.back')}
            </a>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">DevMetrics Dashboard</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <button
              onClick={() => aiAnalysis && generateResume({ user, repos, aiAnalysis, rpgStats })}
              disabled={!aiAnalysis}
              className="px-6 py-3 md:py-2 bg-teal-500/10 border border-teal-500/50 text-teal-400 hover:bg-teal-500 hover:text-white rounded-full font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <FileDown size={20} /> {t('dashboard.downloadResume')}
            </button>
            <a href="/battle" className="px-6 py-3 md:py-2 bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-full font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
              <span className="text-xl">⚔️</span> {t('dashboard.battleArena')}
            </a>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl border border-slate-700 text-center md:text-left">
          <Image 
            src={user.avatar_url} 
            alt={user.login} 
            width={96} 
            height={96} 
            className="rounded-full border-4 border-teal-500" 
          />
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold">{user.name}</h2>
            <p className="text-teal-400">@{user.login}</p>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto md:mx-0">{user.bio}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mt-4 text-sm text-gray-300">
                <span>🏙 {user.location || 'Remote'}</span>
                <span>👥 {user.followers} Followers</span>
                <span>📦 {user.public_repos} Repos</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Insights & Charts */}
          <div className="lg:col-span-2 space-y-8">
          
            {/* CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ContributionHeatmap />
                <LanguageChart repos={repos} />
            </div>

            {/* AI ANALYSIS */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain size={120} />
                </div>
                
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-teal-300">
                    <Brain /> {t('dashboard.aiInsights')}
                </h3>

                {/* Productivity Section */}
                <div className="mb-8 bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-yellow-400">{t('dashboard.workPattern')}</h4>
                        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-bold">
                            {t('dashboard.productivity')}: {aiAnalysis?.commit_pattern?.productivity_score || 0}/100
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-400 uppercase mb-2">{t('dashboard.peakHours')}</p>
                            <div className="flex gap-2">
                                {(aiAnalysis?.commit_pattern?.peak_hours || []).map((h:string) => (
                                    <span key={h} className="bg-slate-700 px-3 py-1 rounded text-sm">{h}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 uppercase mb-2">{t('dashboard.workPattern')}</p>
                            <p className="text-gray-300 italic">
                                {aiAnalysis?.commit_pattern?.work_pattern || "Analyzing patterns..."}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm text-gray-400 uppercase mb-2">{t('dashboard.recommendations')}</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                            {(aiAnalysis?.commit_pattern?.recommendations || []).map((rec:string, i:number) => (
                                <li key={i}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Code Quality Section */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-purple-400">{t('dashboard.codeQuality')}</h4>
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                             {aiAnalysis?.code_quality?.overall_quality_score || 0}/100
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-green-400 uppercase mb-2">✅ {t('dashboard.strengths')}</p>
                            <ul className="space-y-1 text-gray-300 text-sm">
                                {(aiAnalysis?.code_quality?.strengths || []).map((s:string, i:number) => (
                                    <li key={i}>• {s}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm text-red-400 uppercase mb-2">⚠️ {t('dashboard.improvements')}</p>
                            <ul className="space-y-1 text-gray-300 text-sm">
                                {(aiAnalysis?.code_quality?.improvements || []).map((s:string, i:number) => (
                                    <li key={i}>• {s}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

             {/* REPO LIST SECTION */}
             <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                    <span className="text-teal-400">📦</span> {t('dashboard.topRepos')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repos.slice(0, 6).map((repo) => (
                        <a 
                            key={repo.name} 
                            href={`https://github.com/${username}/${repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-teal-400 group-hover:text-teal-300 truncate pr-2">
                                    {repo.name}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-gray-400 bg-slate-800 px-2 py-1 rounded">
                                    <span className="flex items-center gap-1 text-yellow-400">
                                        ★ {repo.stargazers_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        🔱 {repo.forks_count}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 h-10 mb-3">
                                {repo.description || "No description provided."}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${
                                    repo.language === 'TypeScript' ? 'bg-blue-500' :
                                    repo.language === 'JavaScript' ? 'bg-yellow-400' :
                                    repo.language === 'Python' ? 'bg-blue-400' :
                                    repo.language === 'HTML' ? 'bg-orange-500' :
                                    repo.language === 'CSS' ? 'bg-blue-300' :
                                    repo.language === 'Vue' ? 'bg-green-500' :
                                    'bg-gray-500'
                                }`} />
                                <span className="text-xs text-gray-500">{repo.language || 'Code'}</span>
                            </div>
                        </a>
                    ))}
                </div>
             </div>

          </div>

          {/* RIGHT COLUMN: RPG Card (Fixed/Sticky if needed) */}
          <div className="lg:col-span-1 flex justify-center lg:block">
             {rpgStats ? (
                 <div className="sticky top-8 scale-75 md:scale-90 lg:scale-100 origin-top lg:origin-top-left transition-transform">
                     <DevCard user={user} stats={rpgStats} loading={loading} />
                 </div>
             ) : (
                 <div className="h-[600px] bg-slate-800 rounded-lg animate-pulse"></div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
