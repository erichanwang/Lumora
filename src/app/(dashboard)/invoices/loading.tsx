export default function InvoicesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-shimmer rounded-lg" />
        <div className="h-8 w-36 animate-shimmer rounded-md" style={{ animationDelay: "100ms" }} />
      </div>
      <div className="h-4 w-56 animate-shimmer rounded-md" style={{ animationDelay: "150ms" }} />
      <div className="h-10 w-full animate-shimmer rounded-lg" style={{ animationDelay: "200ms" }} />
      <div className="h-72 animate-shimmer rounded-xl" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
