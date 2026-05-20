export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-shimmer rounded-md" />
      <div className="h-4 w-72 animate-shimmer rounded-md" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-shimmer rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 animate-shimmer rounded-xl" />
        <div className="h-96 animate-shimmer rounded-xl" />
      </div>
    </div>
  );
}
