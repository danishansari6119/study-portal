// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="h-8 w-48 bg-muted rounded-lg shimmer" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-2xl shimmer" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-muted rounded-2xl shimmer" />
        <div className="h-64 bg-muted rounded-2xl shimmer" />
      </div>
    </div>
  );
}
