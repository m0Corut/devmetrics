import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// --- SMART FALLBACK ENGINE ---
function generateSmartFallback(username: string, repos: any[]) {
    const langCounts: Record<string, number> = {};
    repos.forEach(r => {
        if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    });
    const sortedLangs = Object.keys(langCounts).sort((a,b) => langCounts[b] - langCounts[a]);
    const topLang = sortedLangs[0] || 'Code';

    const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
    const prodScore = Math.min(98, 60 + (repos.length * 2)); 
    const qualScore = Math.min(95, 70 + Math.floor(totalStars / 5));

    return {
        commit_pattern: {
            productivity_score: prodScore,
            peak_hours: ['09:00-11:00', '14:00-17:00'],
            work_pattern: `[Standard Analysis] High activity detected in ${topLang} projects. Maintains ${repos.length} active repositories with consistent output.`,
            recommendations: [
                `Consider documenting your complex ${topLang} modules better.`,
                'Automate your deployment pipelines for side projects.',
                `Expand your portfolio with more ${topLang === 'TypeScript' ? 'Rust or Go' : 'TypeScript'} projects.`
            ]
        },
        code_quality: {
            overall_quality_score: qualScore,
            strengths: [
                `Solid understanding of ${topLang} ecosystems`,
                'Good repository structuring patterns',
                `Maintains clean version control history`
            ],
            improvements: [
                'Add more unit test coverage for core logic',
                'Include detailed contributing guidelines',
                'Optimize build times for larger projects'
            ]
        }
    };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, commits } = body;
    const reposList = body.repos ? JSON.parse(body.repos) : [];
    const commitsList = commits ? JSON.parse(commits) : [];

    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('Missing API Key');
    }

    try {
        // Init Groq Client
        const openai = new OpenAI({
          apiKey: apiKey,
          baseURL: 'https://api.groq.com/openai/v1',
        });

        // 1. Optimize Repo Context (Max 5, truncated desc)
        const repoSummary = reposList.slice(0, 5).map((r: any) => 
            `- ${r.name} (${r.language || 'N/A'}): ${r.description ? r.description.slice(0, 100) : 'No description'}`
        ).join('\n');

        // 2. Optimize Commit Context (Max 5, truncated messages)
        const commitSummary = commitsList.length > 0 
            ? JSON.stringify(commitsList.slice(0, 5).map((c:any) => ({
                msg: c.commit.message.slice(0, 100),
                date: c.commit.author.date
            })))
            : "No recent public commits found.";

        const prompt = `Act as a Senior Eng. Manager. Review dev profile.
        User: ${username}
        Repos: ${repoSummary}
        Commits: ${commitSummary}
        
        Output JSON:
        {
          "commit_pattern": { 
            "productivity_score": number (0-100), 
            "peak_hours": ["HH:MM"], 
            "work_pattern": "string", 
            "recommendations": ["string"] 
          },
          "code_quality": { 
            "overall_quality_score": number, 
            "strengths": ["string"], 
            "improvements": ["string"] 
          }
        }`;

        // GROQ MODELS
        const model = 'llama-3.3-70b-versatile'; 

        const response = await openai.chat.completions.create({
            model: model,
            messages: [{ role: 'system', content: 'Output JSON only.' }, { role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 1024, 
        });

        let content = response.choices[0].message.content || '{}';
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, '');
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) content = jsonMatch[0];
        
        const analysis = JSON.parse(content);
        
        return NextResponse.json({ data: analysis, source: 'groq' });

    } catch (aiError: any) {
        console.error('AI Service Failed:', aiError.message);
        
        // Pass the error message to the fallback so user sees it
        const fallbackData = generateSmartFallback(username, reposList);
        fallbackData.commit_pattern.work_pattern = `[AI Unavailable] ` + fallbackData.commit_pattern.work_pattern;

        return NextResponse.json({
          data: fallbackData,
          source: 'smart-fallback',
          error: aiError.message 
        });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
