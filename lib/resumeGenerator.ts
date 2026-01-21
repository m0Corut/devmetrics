// Removed static imports to save bundle size
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

interface ResumeData {
  user: any;
  repos: any[];
  aiAnalysis: any;
  rpgStats: any;
}

// Helper to remove non-ASCII characters
const cleanText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/[^\x00-\x7F]/g, '');
};

export const generateResume = async ({ user, repos, aiAnalysis, rpgStats }: ResumeData) => {
  // Dynamic Import for Performance
  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // --- COLORS ---
  const PRIMARY_COLOR = [45, 212, 191]; // Teal
  const TEXT_COLOR = [60, 60, 60];
  const SUBTEXT_COLOR = [100, 100, 100];

  let yPos = 20;

  // --- HEADER ---
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText(user.name || user.login), margin, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setTextColor(SUBTEXT_COLOR[0], SUBTEXT_COLOR[1], SUBTEXT_COLOR[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`GitHub: github.com/${cleanText(user.login)}`, margin, yPos);
  
  if (user.location) {
    yPos += 5;
    doc.text(`Location: ${cleanText(user.location)}`, margin, yPos);
  }
  
  // --- AI SUMMARY ---
  yPos += 12;
  doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.setLineWidth(1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFESSIONAL SUMMARY', margin, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
  doc.setFont('helvetica', 'normal');
  
  // Cleaned up summary logic to avoid weird repetition
  const strengthList = aiAnalysis.code_quality?.strengths?.map(cleanText).join(', ') || 'clean code';
  const summaryText = `Highly productive developer specializing in ${cleanText(rpgStats.topLang || 'Modern Web')}. Identified as a "${cleanText(rpgStats.class)}" (Level ${rpgStats.level}) based on coding activity. Known for ${cleanText(aiAnalysis.commit_pattern?.work_pattern || 'consistent contributions')}. Key technical strengths include: ${strengthList}.`;
  
  const splitSummary = doc.splitTextToSize(summaryText, pageWidth - (margin * 2));
  doc.text(splitSummary, margin, yPos);
  yPos += splitSummary.length * 5 + 8;

  // --- TECHNICAL SKILLS ---
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('KEY SKILLS', margin, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
  doc.setFont('helvetica', 'normal');

  const languages = [...new Set(repos.map((r: any) => cleanText(r.language)).filter(Boolean))].slice(0, 10).join('  |  ');
  doc.text(languages.toUpperCase(), margin, yPos);
  yPos += 12;

  // --- PROJECTS ---
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('TOP PROJECTS', margin, yPos);
  yPos += 5;

  const projectRows = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map(r => [
      cleanText(r.name),
      cleanText(r.description ? r.description.slice(0, 75) + (r.description.length > 75 ? '...' : '') : 'No description'),
      cleanText(r.language || 'N/A'),
      r.stargazers_count.toString()
    ]);

  autoTable(doc, {
    startY: yPos,
    head: [['PROJECT NAME', 'DESCRIPTION', 'TECH', 'STARS']],
    body: projectRows,
    theme: 'grid',
    headStyles: { fillColor: [45, 212, 191], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { textColor: 50 },
    styles: { fontSize: 8, cellPadding: 3, overflow: 'ellipsize' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 15, halign: 'center' }
    },
    margin: { left: margin, right: margin }
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;

  // --- DEV METRICS ---
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('PERFORMANCE METRICS', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
  doc.setFont('helvetica', 'normal');
  
  // Fix for totalStars undefined issue - calculate it here if missing
  const totalStars = rpgStats.totalStars || repos.reduce((acc: number, r: any) => acc + r.stargazers_count, 0);

  const metrics = [
    `Productivity Score: ${aiAnalysis.commit_pattern?.productivity_score || 0}/100`,
    `Code Quality Score: ${aiAnalysis.code_quality?.overall_quality_score || 0}/100`,
    `Developer Class: ${cleanText(rpgStats.class)} (Lvl ${rpgStats.level})`,
    `Total Stars Earned: ${totalStars}`,
    `Total Public Repos: ${user.public_repos}`
  ];

  metrics.forEach(m => {
    doc.text(`-  ${m}`, margin, yPos);
    yPos += 5;
  });

  // --- FOOTER ---
  const footerY = doc.internal.pageSize.height - 10;
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('Verified by DevMetrics.app', pageWidth / 2, footerY, { align: 'center' });

  doc.save(`${cleanText(user.login)}_resume.pdf`);
};
