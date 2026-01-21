import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Demo kullanıcı 1: octocat
  await prisma.analyticsCache.upsert({
    where: { username: 'octocat' },
    update: {},
    create: {
      username: 'octocat',
      profileData: JSON.stringify({
        name: 'The Octocat',
        bio: 'GitHub mascot',
        avatar_url: 'https://github.com/octocat.png',
        followers: 5000,
        following: 200,
        public_repos: 150,
        location: 'San Francisco',
        company: '@github'
      }),
      aiAnalysis: JSON.stringify({
        productivity_score: 85,
        peak_hours: ['14:00-18:00', '20:00-23:00'],
        work_pattern: 'Düzenli, hafta içi odaklı. Haftasonları nadiren commit yapıyor.',
        commit_quality: 'Yüksek - Conventional commits kullanıyor (feat:, fix:, docs:)',
        recommendations: [
          '🌅 Sabah saatlerinde de kod yazmayı dene (fresh mind)',
          '📝 Commit mesajlarına issue numarası ekle (#123)',
          '🔄 Haftada 1 gün refactoring için ayır'
        ],
        overall_quality_score: 83,
        strengths: [
          '🎯 Modern tech stack (TypeScript, React, Next.js)',
          '📚 Kaliteli README ve API dokümantasyonu',
          '🏗️ Modüler ve temiz kod organizasyonu'
        ],
        improvements: [
          '🧪 Test coverage %75 → %90\'a çıkarılmalı',
          '📝 Code comments artırılmalı',
          '🔒 Security audit yapılmalı'
        ]
      }),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat
    }
  });
  
  // Demo kullanıcı 2: torvalds
  await prisma.analyticsCache.upsert({
    where: { username: 'torvalds' },
    update: {},
    create: {
      username: 'torvalds',
      profileData: JSON.stringify({
        name: 'Linus Torvalds',
        bio: 'Creator of Linux and Git',
        avatar_url: 'https://github.com/torvalds.png',
        followers: 200000,
        following: 0,
        public_repos: 10,
        location: 'Portland, OR',
        company: 'Linux Foundation'
      }),
      aiAnalysis: JSON.stringify({
        productivity_score: 95,
        peak_hours: ['09:00-12:00', '14:00-17:00'],
        work_pattern: 'Çok düzenli, sabah odaklı çalışma. Hafta sonu da aktif.',
        commit_quality: 'Mükemmel - Detaylı commit mesajları, atomik değişiklikler',
        recommendations: [
          '🎯 Mükemmel çalışma düzeni, devam et!',
          '📖 Daha fazla dokümantasyon eklenebilir',
          '👥 Community contribution\'ları artırabilirsin'
        ],
        overall_quality_score: 95,
        strengths: [
          '⚡ Çok yüksek kod kalitesi',
          '📝 Mükemmel commit discipline',
          '🏆 Industry-leading best practices'
        ],
        improvements: [
          '📚 Daha fazla tutorial/guide eklenebilir'
        ]
      }),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  });
  
  console.log('✅ Seed complete! Demo users: octocat, torvalds');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
