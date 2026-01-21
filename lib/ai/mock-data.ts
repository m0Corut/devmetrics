// Mock AI analysis data (used when OPENAI_API_KEY is not provided)

export const mockCommitPatternAnalysis = {
  productivity_score: 85,
  peak_hours: ['14:00-18:00', '20:00-23:00'],
  work_pattern: 'Düzenli, hafta içi odaklı. Haftasonları nadiren commit yapıyor.',
  commit_quality: 'Yüksek - Conventional commits kullanıyor (feat:, fix:, docs:)',
  recommendations: [
    '🌅 Sabah saatlerinde de kod yazmayı dene (fresh mind)',
    '📝 Commit mesajlarına issue numarası ekle (#123)',
    '🔄 Haftada 1 gün refactoring için ayır'
  ]
};

export const mockCodeQualityAnalysis = {
  overall_quality_score: 83,
  organization_score: 90,
  test_coverage_score: 75,
  documentation_score: 85,
  tech_stack_score: 95,
  
  strengths: [
    '🎯 Modern tech stack (TypeScript, React, Next.js)',
    '📚 Kaliteli README ve API dokümantasyonu',
    '🏗️ Modüler ve temiz kod organizasyonu',
    '🔄 CI/CD pipeline kurulu'
  ],
  
  improvements: [
    '🧪 Test coverage %75 → %90\'a çıkarılmalı',
    '📝 Code comments artırılmalı (özellikle complex logic)',
    '🔒 Security audit yapılmalı',
    '📦 Dependency güncellemeleri gerekli'
  ],
  
  recommendations: [
    'E2E testler ekle (Playwright/Cypress)',
    'CHANGELOG.md oluştur',
    'GitHub Actions ile otomatik release',
    'Storybook ekle (component dokümantasyonu)'
  ]
};

export function getMockAIAnalysis() {
  return {
    commit_pattern: mockCommitPatternAnalysis,
    code_quality: mockCodeQualityAnalysis
  };
}
