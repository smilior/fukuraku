'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function DeleteAccountButton() {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    const confirmed = window.confirm(
      'アカウントを削除しますか？\n\nすべてのデータ（収入・経費・レシート）が削除され、元に戻すことはできません。'
    )
    if (!confirmed) return

    setDeleting(true)

    // アカウント削除 API を呼ぶ（認証が必要なので先にサインアウトしない）
    await fetch('/api/account/delete', { method: 'POST' })

    // 削除後にサインアウトしてセッションを無効化
    await supabase.auth.signOut()

    router.push('/')
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? '削除中...' : 'アカウントを削除'}
    </Button>
  )
}
