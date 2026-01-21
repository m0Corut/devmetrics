export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-700/50 rounded ${className}`} />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full max-w-lg" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsightSkeleton() {
  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="bg-slate-800 rounded-lg p-6 h-[300px]">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex items-end gap-2 h-48 justify-between">
          {[40, 60, 30, 80, 50, 70, 45, 75, 55, 90, 40, 65].map((h, i) => (
            <div key={i} className="animate-pulse bg-slate-700/50 rounded w-8" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="bg-slate-800 rounded-lg p-6 h-[300px]">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="w-48 h-48 rounded-full mx-auto" />
      </div>
    </div>
  );
}

export function ReposSkeleton() {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-slate-700 rounded p-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
