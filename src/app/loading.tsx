export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">DPP Brasil</span>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-40 bg-slate-200 rounded" />
            <div className="h-40 bg-slate-200 rounded" />
            <div className="h-40 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
