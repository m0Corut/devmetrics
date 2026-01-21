import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/github/client';
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
    const cacheKey = `github:user:${username}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return NextResponse.json({ data: cached, cached: true });
    }

    // Fetch from GitHub API
    const user = await getUser(username);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Cache for 1 hour
    cache.set(cacheKey, user, 3600);

    return NextResponse.json({ data: user, cached: false });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
