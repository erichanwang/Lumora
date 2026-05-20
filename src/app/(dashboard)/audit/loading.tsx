export default function AuditLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-36 animate-shimmer rounded-md" />
      <div className="h-4 w-64 animate-shimmer rounded-md" />
      <div className="h-10 w-full animate-shimmer rounded-lg" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 animate-shimmer rounded-xl" />
      ))}
    </div>
  );
}
