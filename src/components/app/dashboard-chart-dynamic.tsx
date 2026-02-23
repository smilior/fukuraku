import dynamic from 'next/dynamic'

const DashboardChart = dynamic(() => import('./dashboard-chart'), {
  ssr: false,
  loading: () => <div className="h-[120px] bg-slate-50 rounded-xl animate-pulse" />,
})

export default DashboardChart
