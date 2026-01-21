export type Language = 'en' | 'tr';

export const translations = {
  en: {
    home: {
      title: 'Analyze Your GitHub Profile',
      subtitle: 'Get AI-powered insights, RPG stats, and battle with friends.',
      searchPlaceholder: 'Enter GitHub Username...',
      analyzeButton: 'Analyze Profile',
      battleButton: 'Battle Arena',
      features: {
        ai: 'AI Insights',
        rpg: 'RPG Stats',
        battle: 'Dev Battle'
      }
    },
    dashboard: {
      back: 'Back to Home',
      loading: 'Analyzing Profile...',
      downloadResume: 'Download Resume',
      battleArena: 'Battle Arena',
      contributionActivity: 'Contribution Activity (Last 90 Days)',
      languageDistribution: 'Language Distribution',
      aiInsights: 'AI Insights',
      productivity: 'Productivity Score',
      peakHours: 'Peak Hours',
      workPattern: 'Work Pattern',
      recommendations: 'Recommendations',
      codeQuality: 'Code Quality Score',
      strengths: 'Strengths',
      improvements: 'Improvements',
      tryAnother: 'Try Another User',
      topRepos: 'Top Repositories'
    },
    battle: {
      title: 'DEV BATTLE',
      subtitle: 'AI-Powered Code Judgement',
      winner: 'WINNER',
      power: 'POWER',
      verdict: 'AI VERDICT',
      summoning: 'Summoning Developers...',
      preparing: 'PREPARING ARENA...',
      back: 'Back to Arena Lobby'
    },
    rpg: {
      lvl: 'LVL',
      str: 'STR',
      int: 'INT',
      dex: 'DEX',
      cha: 'CHA',
      specialAbility: 'Special Ability',
      downloadCard: 'Download Card',
      generating: 'Generating...'
    }
  },
  tr: {
    home: {
      title: 'GitHub Profilini Analiz Et',
      subtitle: 'Yapay zeka destekli analizler al, RPG kartını oluştur ve arkadaşlarınla kapış.',
      searchPlaceholder: 'GitHub Kullanıcı Adı...',
      analyzeButton: 'Profili Analiz Et',
      battleButton: 'Savaş Arenası',
      features: {
        ai: 'Yapay Zeka',
        rpg: 'RPG İstatistikleri',
        battle: 'Geliştirici Savaşı'
      }
    },
    dashboard: {
      back: 'Ana Sayfaya Dön',
      loading: 'Profil Analiz Ediliyor...',
      downloadResume: 'CV İndir',
      battleArena: 'Savaş Arenası',
      contributionActivity: 'Katkı Aktivitesi (Son 90 Gün)',
      languageDistribution: 'Dil Dağılımı',
      aiInsights: 'Yapay Zeka Analizi',
      productivity: 'Üretkenlik Puanı',
      peakHours: 'En Yoğun Saatler',
      workPattern: 'Çalışma Düzeni',
      recommendations: 'Tavsiyeler',
      codeQuality: 'Kod Kalite Puanı',
      strengths: 'Güçlü Yönler',
      improvements: 'Geliştirilmesi Gerekenler',
      tryAnother: 'Başka Kullanıcı Dene',
      topRepos: 'En İyi Projeler'
    },
    battle: {
      title: 'DEV SAVAŞI',
      subtitle: 'Yapay Zeka Destekli Kod Yargıcı',
      winner: 'KAZANAN',
      power: 'GÜÇ',
      verdict: 'YAPAY ZEKA KARARI',
      summoning: 'Geliştiriciler Çağırılıyor...',
      preparing: 'ARENA HAZIRLANIYOR...',
      back: 'Arenaya Dön'
    },
    rpg: {
      lvl: 'SEV',
      str: 'GÜÇ',
      int: 'ZEKA',
      dex: 'ÇEV',
      cha: 'KAR',
      specialAbility: 'Özel Yetenek',
      downloadCard: 'Kartı İndir',
      generating: 'Oluşturuluyor...'
    }
  }
};
