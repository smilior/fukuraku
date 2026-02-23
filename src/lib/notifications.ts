export interface AppNotification {
  id: string
  type: 'threshold_warning' | 'threshold_approaching' | 'deadline_30d' | 'deadline_7d'
  message: string
  severity: 'warning' | 'info'
}

export function generateNotifications(annualNet: number): AppNotification[] {
  const notifications: AppNotification[] = []
  const today = new Date()
  const year = today.getFullYear()

  // Tax deadline calculations
  const deadline = new Date(year, 2, 15) // March 15
  const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (annualNet >= 200000) {
    notifications.push({
      id: 'threshold_warning',
      type: 'threshold_warning',
      message: '副業所得が20万円を超えました。確定申告が必要です',
      severity: 'warning',
    })
  } else if (annualNet >= 180000) {
    notifications.push({
      id: 'threshold_approaching',
      type: 'threshold_approaching',
      message: `確定申告ラインまであと¥${(200000 - annualNet).toLocaleString('ja-JP')}です`,
      severity: 'info',
    })
  }

  if (daysUntil > 0 && daysUntil <= 7) {
    notifications.push({
      id: 'deadline_7d',
      type: 'deadline_7d',
      message: `確定申告期限まであと${daysUntil}日です！`,
      severity: 'warning',
    })
  } else if (daysUntil > 7 && daysUntil <= 30) {
    notifications.push({
      id: 'deadline_30d',
      type: 'deadline_30d',
      message: `確定申告期限まであと${daysUntil}日を切りました`,
      severity: 'info',
    })
  }

  return notifications
}
