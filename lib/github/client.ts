import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  html_url: string;
}

export async function getUser(username: string): Promise<GitHubUser | null> {
  try {
    const { data } = await octokit.users.getByUsername({ username });
    return data as GitHubUser;
  } catch (error) {
    console.error('GitHub API Error (getUser):', error);
    return null;
  }
}

export async function getUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const { data } = await octokit.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 10,
    });
    return data as GitHubRepo[];
  } catch (error) {
    console.error('GitHub API Error (getUserRepos):', error);
    return [];
  }
}

export async function getUserCommits(username: string) {
  try {
    // Get user's repos first
    const repos = await getUserRepos(username);
    
    // Get commits from first repo (simplified for demo)
    if (repos.length > 0) {
      const { data } = await octokit.repos.listCommits({
        owner: username,
        repo: repos[0].name,
        per_page: 30,
      });
      return data;
    }
    
    return [];
  } catch (error) {
    console.error('GitHub API Error (getUserCommits):', error);
    return [];
  }
}
