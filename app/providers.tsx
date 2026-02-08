'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'
import { OfflineProvider } from '@/stores/offlineStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const initializeApp = useAppStore((s) => s.initializeApp)

  useEffect(() => {
    // Register service worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Initialize offline capabilities
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        console.log('Storage quota:', estimate.quota)
        console.log('Storage usage:', estimate.usage)
      })
    }

    // Initialize app state
    if (initializeApp) initializeApp()
  }, [initializeApp])

  return (
    <OfflineProvider>
      {children}
    </OfflineProvider>
  )
}