export default function SkeletonCard() {
  return (
    <div className="card-surface p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-14 rounded-full" />
        <div className="skeleton h-6 w-18 rounded-full" />
        <div className="skeleton h-6 w-12 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-warm-100 dark:border-warm-800">
        <div className="skeleton h-4 w-24" />
        <div className="flex gap-3">
          <div className="skeleton h-8 w-16 rounded-lg" />
          <div className="skeleton h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="card-surface p-4 flex items-center gap-4 animate-pulse">
      <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
      <div className="skeleton h-8 w-20 rounded-lg" />
    </div>
  );
}
