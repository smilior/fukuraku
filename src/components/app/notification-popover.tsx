'use client'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell } from 'lucide-react'
import type { AppNotification } from '@/lib/notifications'

export default function NotificationPopover({ notifications }: { notifications: AppNotification[] }) {
  const [read, setRead] = useState<Set<string>>(new Set())
  const unread = notifications.filter(n => !read.has(n.id))

  return (
    <Popover onOpenChange={(open) => {
      if (open) setRead(new Set(notifications.map(n => n.id)))
    }}>
      <PopoverTrigger asChild>
        <button className="relative w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center" aria-label="通知を開く">
          <Bell className="w-4 h-4 text-slate-600" strokeWidth={1.8} />
          {unread.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-xl">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-[14px] font-bold text-slate-900">通知</h3>
        </div>
        {notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-[13px] text-slate-400">通知はありません</p>
        ) : (
          <div>
            {notifications.map(n => (
              <div key={n.id} className="px-4 py-3 border-b border-slate-50 last:border-0">
                <div className="flex gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.severity === 'warning' ? 'bg-red-500' : 'bg-indigo-400'}`} />
                  <p className="text-[13px] text-slate-700 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
