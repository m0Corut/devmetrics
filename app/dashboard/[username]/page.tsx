import DashboardClient from './DashboardClient';

export default async function DashboardPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  return <DashboardClient username={username} />;
}
