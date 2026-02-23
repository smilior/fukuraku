'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

const CONSENT_KEY = 'fukuraku_ocr_consent_v1'

interface OcrConsentDialogProps {
  onConsent: () => void
  onDecline: () => void
}

export default function OcrConsentDialog({ onConsent, onDecline }: OcrConsentDialogProps) {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>AI仕訳について</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-[13px] text-slate-600">
              <p>レシート画像をAI解析するために、OpenAI（米国）のサーバーに画像を送信します。</p>
              <ul className="space-y-1 text-[12px] bg-slate-50 rounded-xl p-3">
                <li>送信データ：レシート画像</li>
                <li>送信先：OpenAI API（米国）</li>
                <li>保持期間：最大30日（OpenAIポリシーによる）</li>
              </ul>
              <p className="text-[11px] text-slate-400">同意すると次回以降は表示されません</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDecline}>同意しない</AlertDialogCancel>
          <AlertDialogAction onClick={onConsent} className="bg-indigo-600 hover:bg-indigo-700">
            同意してAI仕訳する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function useOcrConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    setHasConsent(consent === 'true')
  }, [])

  const requestConsent = useCallback((): Promise<boolean> => {
    if (hasConsent) return Promise.resolve(true)
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setShowDialog(true)
    })
  }, [hasConsent])

  const handleConsent = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'true')
    setHasConsent(true)
    setShowDialog(false)
    resolveRef.current?.(true)
    resolveRef.current = null
  }, [])

  const handleDecline = useCallback(() => {
    setShowDialog(false)
    resolveRef.current?.(false)
    resolveRef.current = null
  }, [])

  return { hasConsent, showDialog, requestConsent, handleConsent, handleDecline }
}
