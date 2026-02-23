'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    href: '/dashboard',
    label: 'ホーム',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/income',
    label: '収入',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    ),
  },
  null, // center FAB placeholder
  {
    href: '/expense',
    label: '経費',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-4m-6 4h6m-3-4v4" />
      </svg>
    ),
  },
  {
    href: '/summary',
    label: '申告書',
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

const sidebarNavItems = [
  {
    href: '/dashboard',
    label: 'ホーム',
    path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '/income',
    label: '収入',
    path: 'M7 11l5-5m0 0l5 5m-5-5v12',
  },
  {
    href: '/expense',
    label: '経費',
    path: 'M9 14H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-4m-6 4h6m-3-4v4',
  },
  {
    href: '/summary',
    label: '申告書',
    path: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col bg-white border-r border-slate-100 z-20">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-xl">
            <span className="text-white font-extrabold text-[13px]">副</span>
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-slate-900 leading-tight">fukuraku</p>
            <p className="text-[10px] text-slate-400 leading-tight">副業確定申告</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {sidebarNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                  active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2.5 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.path} />
                </svg>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Settings (bottom) */}
        <div className="px-3 pb-4 border-t border-slate-100 pt-3 flex-shrink-0">
          {(() => {
            const active = pathname === '/settings' || pathname.startsWith('/settings/')
            return (
              <Link
                href="/settings"
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                  active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2.5 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                設定
              </Link>
            )
          })()}
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-10">
        <div
          className="max-w-lg mx-auto flex items-center justify-around h-14"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {tabs.map((tab, i) => {
            if (tab === null) {
              // Center FAB
              return (
                <Link
                  key="fab"
                  href="/income/new"
                  className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-full -mt-4 shadow-lg shadow-indigo-300 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label="収入を追加"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </Link>
              )
            }

            const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-lg ${
                  active ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                {tab.icon(active)}
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
