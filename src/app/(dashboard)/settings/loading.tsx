export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-shimmer rounded-lg" />
        <div className="h-8 w-36 animate-shimmer rounded-md" style={{ animationDelay: "100ms" }} />
      </div>
      <div className="h-4 w-56 animate-shimmer rounded-md" style={{ animationDelay: "150ms" }} />
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="h-64 animate-shimmer rounded-xl" style={{ animationDelay: "200ms" }} />
        </div>
        <div className="lg:col-span-3">
          <div className="h-96 animate-shimmer rounded-xl" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
