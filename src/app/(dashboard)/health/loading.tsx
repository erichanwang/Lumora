export default function HealthLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-shimmer rounded-md" />
      <div className="h-4 w-72 animate-shimmer rounded-md" />
      <div className="h-24 animate-shimmer rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-shimmer rounded-xl" />
        ))}
      </div>
      <div className="h-72 animate-shimmer rounded-xl" />
    </div>
  );
}
