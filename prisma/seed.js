const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'dev.db');
const db = new Database(dbPath);

console.log('🌱 Seeding database...');

// Demo user 1: octocat
const stmt1 = db.prepare(`
  INSERT OR REPLACE INTO AnalyticsCache (id, username, profileData, aiAnalysis, cachedAt, expiresAt)
  VALUES (?, ?, ?, ?, ?, ?)
`);

stmt1.run(
  'clx1',
  'octocat',
  JSON.stringify({
    name: 'The Octocat',
    bio: 'GitHub mascot',
    avatar_url: 'https://github.com/octocat.png',
    followers: 5000,
    following: 200,
    public_repos: 150,
    location: 'San Francisco',
    company: '@github'
  }),
  JSON.stringify({
    productivity_score: 85,
    peak_hours: ['14:00-18:00', '20:00-23:00'],
    work_pattern: 'Düzenli, hafta içi odaklı',
    commit_quality: 'Yüksek - Conventional commits kullanıyor',
    recommendations: [
      '🌅 Sabah saatlerinde de kod yazmayı dene',
      '📝 Commit mesajlarına issue numarası ekle'
    ],
    overall_quality_score: 83,
    strengths: ['🎯 Modern tech stack', '📚 Kaliteli README'],
    improvements: ['🧪 Test coverage artırılmalı']
  }),
  new Date().toISOString(),
  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
);

// Demo user 2: torvalds
const stmt2 = db.prepare(`
  INSERT OR REPLACE INTO AnalyticsCache (id, username, profileData, aiAnalysis, cachedAt, expiresAt)
  VALUES (?, ?, ?, ?, ?, ?)
`);

stmt2.run(
  'clx2',
  'torvalds',
  JSON.stringify({
    name: 'Linus Torvalds',
    bio: 'Creator of Linux and Git',
    avatar_url: 'https://github.com/torvalds.png',
    followers: 200000,
    following: 0,
    public_repos: 10,
    location: 'Portland, OR',
    company: 'Linux Foundation'
  }),
  JSON.stringify({
    productivity_score: 95,
    peak_hours: ['09:00-12:00', '14:00-17:00'],
    work_pattern: 'Çok düzenli, sabah odaklı',
    commit_quality: 'Mükemmel - Detaylı commit mesajları',
    recommendations: ['🎯 Mükemmel çalışma düzeni!'],
    overall_quality_score: 95,
    strengths: ['⚡ Çok yüksek kod kalitesi'],
    improvements: ['📚 Daha fazla tutorial eklenebilir']
  }),
  new Date().toISOString(),
  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
);

db.close();

console.log('✅ Seed complete! Demo users: octocat, torvalds');
