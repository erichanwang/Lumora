export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-shimmer rounded-md" />
      <div className="h-4 w-72 animate-shimmer rounded-md" />
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-shimmer rounded-xl" />
        ))}
      </div>
      <div className="h-64 animate-shimmer rounded-xl" />
    </div>
  );
}
