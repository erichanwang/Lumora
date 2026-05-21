export default function HealthLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-shimmer rounded-lg" />
        <div className="h-8 w-48 animate-shimmer rounded-md" style={{ animationDelay: "100ms" }} />
      </div>
      <div className="h-4 w-72 animate-shimmer rounded-md" style={{ animationDelay: "150ms" }} />
      <div className="h-24 animate-shimmer rounded-xl" style={{ animationDelay: "200ms" }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-shimmer rounded-xl" style={{ animationDelay: `${300 + i * 100}ms` }} />
        ))}
      </div>
      <div className="h-72 animate-shimmer rounded-xl" style={{ animationDelay: "700ms" }} />
    </div>
  );
}
