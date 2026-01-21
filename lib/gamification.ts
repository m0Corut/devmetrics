export interface RPGStats {
  level: number;
  class: string;
  str: number;
  int: number;
  dex: number;
  cha: number;
  specialAbility: string;
  totalStars?: number;
  topLang?: string;
}

export function calculateRPGStats(user: any, repos: any[], totalCommits: number): RPGStats {
  // 1. Calculate Level (Weighted: Commits + Stars + Followers)
  const totalStars = repos.reduce((acc: any, r: any) => acc + (r.stargazers_count || 0), 0);
  
  const commitScore = Math.sqrt(totalCommits / 25); // Commits weight (reduced divisor)
  const starScore = Math.sqrt(totalStars); // Stars weight 
  const socialScore = Math.sqrt((user.followers || 0) * 2); // Followers weight

  const level = Math.min(99, Math.floor(1 + commitScore + starScore + socialScore));

  // 2. Determine Class (based on languages)
  const languages: Record<string, number> = {};
  const totalBytes = 0;

  repos.forEach((repo: any) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  // Find top language
  const sortedLangs = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const topLang = sortedLangs.length > 0 ? sortedLangs[0][0] : 'Generalist';

  let rpgClass = 'Novice';
  let specialAbility = 'Hello World';

  switch (topLang) {
    case 'JavaScript':
    case 'TypeScript':
      rpgClass = 'Code Ninja';
      specialAbility = 'Async Strike';
      break;
    case 'Python':
      rpgClass = 'Data Sorcerer';
      specialAbility = 'Snake Charm';
      break;
    case 'Java':
    case 'C#':
      rpgClass = 'System Paladin';
      specialAbility = 'Strict Typing';
      break;
    case 'Rust':
    case 'Go':
    case 'C++':
      rpgClass = 'Memory Warlord';
      specialAbility = 'Pointer Crush';
      break;
    case 'HTML':
    case 'CSS':
      rpgClass = 'Pixel Artist';
      specialAbility = 'Flexbox Grid';
      break;
    default:
      rpgClass = 'Fullstack Ranger';
      specialAbility = 'Bug Hunt';
  }

  // 3. Calculate Stats (0-20 scale)
  const reposCount = user.public_repos || 0;
  const followers = user.followers || 0;
  
  // STR: Based on volume of code (repos)
  const str = Math.min(20, Math.floor(reposCount / 2) + 1);

  // INT: Based on language diversity
  const int = Math.min(20, Object.keys(languages).length * 2 + 3);

  // DEX: Based on commit frequency (speed) - using level proxy here
  const dex = Math.min(20, Math.floor(level * 1.5) + 2);

  // CHA: Based on social (followers)
  const cha = Math.min(20, Math.floor(Math.sqrt(followers)) + 1);

  return {
    level,
    class: rpgClass,
    str,
    int,
    dex,
    cha,
    specialAbility,
    topLang, // Added for AI context
    totalStars // Added for PDF resume
  };
}
