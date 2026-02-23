export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 space-y-3">
      <div className="h-10 bg-slate-200 rounded-2xl animate-pulse" />
      <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
      <div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
      <div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
    </div>
  )
}
