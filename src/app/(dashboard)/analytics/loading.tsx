export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-shimmer rounded-lg" />
        <div className="h-8 w-48 animate-shimmer rounded-md" style={{ animationDelay: "100ms" }} />
      </div>
      <div className="h-4 w-72 animate-shimmer rounded-md" style={{ animationDelay: "150ms" }} />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-shimmer rounded-xl" style={{ animationDelay: `${200 + i * 100}ms` }} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 animate-shimmer rounded-xl" style={{ animationDelay: "500ms" }} />
        <div className="h-96 animate-shimmer rounded-xl" style={{ animationDelay: "600ms" }} />
      </div>
    </div>
  );
}
