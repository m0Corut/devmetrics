import { NextRequest, NextResponse } from 'next/server';
import { getUserCommits } from '@/lib/github/client';
import { cache } from '@/lib/cache/memory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const cacheKey = `github:commits:${username}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return NextResponse.json({ data: cached, cached: true });
    }

    const commits = await getUserCommits(username);
    cache.set(cacheKey, commits, 3600);

    return NextResponse.json({ data: commits, cached: false });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
