import { NextRequest, NextResponse } from 'next/server';
import { getUserRepos } from '@/lib/github/client';
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
    // Check cache first
    const cacheKey = `github:repos:${username}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return NextResponse.json({ data: cached, cached: true });
    }

    // Fetch from GitHub API
    const repos = await getUserRepos(username);

    // Cache for 1 hour
    cache.set(cacheKey, repos, 3600);

    return NextResponse.json({ data: repos, cached: false });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
