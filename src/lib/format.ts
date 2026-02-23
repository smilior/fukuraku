export function formatCurrency(n: number): string {
  return `¥${n.toLocaleString('ja-JP')}`
}

export function formatDateJP(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
