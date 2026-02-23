'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export default function DeleteAccountButton() {
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (confirmText !== '削除する') return

    setDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) {
        toast.error('アカウント削除に失敗しました。再試行してください')
        setDeleting(false)
        return
      }

      await supabase.auth.signOut()
      toast.success('アカウントを削除しました')
      router.push('/')
    } catch {
      toast.error('予期しないエラーが発生しました')
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setConfirmText('') }}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          アカウントを削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>アカウントを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            すべての収入・経費データが完全に削除されます。この操作は取り消せません。
            確認のため「削除する」と入力してください。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="削除する"
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[13px] mt-2 focus:outline-none focus:border-red-300"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText('')}>キャンセル</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== '削除する' || deleting}
          >
            {deleting ? '削除中...' : 'アカウントを削除する'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
