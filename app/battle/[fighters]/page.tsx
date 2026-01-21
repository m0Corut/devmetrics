import BattleClient from '../BattleClient';

export default async function BattleResultPage({
  params,
}: {
  params: Promise<{ fighters: string }>;
}) {
  const { fighters } = await params;
  
  // Parse fighters from URL "p1-vs-p2"
  const [u1, u2] = fighters.split('-vs-');

  if (!u1 || !u2) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-500">
            Invalid battle configuration.
        </div>
    );
  }

  return <BattleClient fighters={[u1, u2]} />;
}
