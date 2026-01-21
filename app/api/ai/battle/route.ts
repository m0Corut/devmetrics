import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { u1, u2, u1Data, u2Data } = await request.json();

    // Check for API Key (Groq or OpenAI)
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
       return NextResponse.json({
         winner: u1Data.followers > u2Data.followers ? u1 : u2,
         reason: "[MOCK] Provide GROQ_API_KEY for real battle judgement.",
         u1Score: 60, u2Score: 60,
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    const prompt = `
      Act as a harsh code battle judge. Compare:
      P1 (${u1}): Repos: ${u1Data.public_repos}, Followers: ${u1Data.followers}, Stars: ${u1Data.stars}, Class: ${u1Data.topLang}
      P2 (${u2}): Repos: ${u2Data.public_repos}, Followers: ${u2Data.followers}, Stars: ${u2Data.stars}, Class: ${u2Data.topLang}
      
      Output JSON: { "winner": string, "reason": string (witty & short), "u1Score": number, "u2Score": number }
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // Groq's Powerhouse (Updated)
            messages: [{ role: 'system', content: 'Output JSON only.' }, { role: 'user', content: prompt }],
            temperature: 0.8,
        });

        let content = response.choices[0].message.content || '{}';
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if(jsonMatch) content = jsonMatch[0];

        return NextResponse.json(JSON.parse(content));

    } catch (err: any) {
        throw new Error(`Groq Error: ${err.message}`);
    }

  } catch (error: any) {
    const { u1, u2, u1Data, u2Data } = await request.clone().json().catch(() => ({ u1: 'P1', u2: 'P2' }));
    
    // Smart Fallback
    const score1 = Math.min(95, (u1Data?.public_repos || 0) + (u1Data?.followers || 0));
    const score2 = Math.min(95, (u2Data?.public_repos || 0) + (u2Data?.followers || 0));
    
    return NextResponse.json({
         winner: score1 > score2 ? u1 : u2,
         reason: `[Judge Offline: ${error.message}] Winner by raw stats.`,
         u1Score: score1,
         u2Score: score2,
    });
  }
}
