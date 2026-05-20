export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-36 animate-shimmer rounded-md" />
      <div className="h-4 w-56 animate-shimmer rounded-md" />
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="h-64 animate-shimmer rounded-xl" />
        </div>
        <div className="lg:col-span-3">
          <div className="h-96 animate-shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );
}
