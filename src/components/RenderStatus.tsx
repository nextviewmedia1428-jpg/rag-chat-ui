'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

export type RenderStatusType = 'checking' | 'ok' | 'warming' | 'offline'

const Ctx = createContext<RenderStatusType>('checking')
export const useRenderStatus = () => useContext(Ctx)

const KEEP_WARM_MS = 10 * 60 * 1000  // ping every 10 min to prevent Render spin-down (inactivity window = 15 min)
const POLL_MS      = 30 * 1000        // re-check every 30s while warming
const MAX_POLLS    = 8                 // give up after 4 min

// Returns true only if Render is up AND graph has documents
async function ping(): Promise<boolean> {
  try {
    const res = await fetch('/api/lightrag-health', { cache: 'no-store' })
    const d = await res.json()
    return d.status === 'ok'  // 'cold' or 'unreachable' both trigger sync
  } catch { return false }
}

async function triggerSync() {
  try { await fetch('/api/demo-sync', { method: 'POST' }) } catch { /* best-effort */ }
}

export function RenderStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<RenderStatusType>('checking')
  const syncDone  = useRef(false)
  const pollCount = useRef(0)

  useEffect(() => {
    let pollTimer: ReturnType<typeof setTimeout> | null = null

    function scheduleNextPoll() {
      pollCount.current += 1
      if (pollCount.current > MAX_POLLS) { setStatus('offline'); return }
      pollTimer = setTimeout(checkAndMaybeRecover, POLL_MS)
    }

    async function checkAndMaybeRecover() {
      const ok = await ping()
      if (ok) {
        setStatus('ok')
        syncDone.current = false
        pollCount.current = 0
      } else {
        scheduleNextPoll()
      }
    }

    async function initialCheck() {
      const ok = await ping()
      if (ok) {
        setStatus('ok')
      } else {
        setStatus('warming')
        // Fire sync to LightRAG (wakes Render + re-uploads demo graph)
        if (!syncDone.current) {
          syncDone.current = true
          triggerSync() // fire-and-forget — Render wakes while this runs
        }
        scheduleNextPoll()
      }
    }

    initialCheck()

    // Keep Render alive while the tab is open
    const keepWarm = setInterval(async () => {
      const ok = await ping()
      if (!ok && status === 'ok') {
        setStatus('warming')
        syncDone.current = false
        pollCount.current = 0
        scheduleNextPoll()
      }
    }, KEEP_WARM_MS)

    return () => {
      clearInterval(keepWarm)
      pollTimer && clearTimeout(pollTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Ctx.Provider value={status}>{children}</Ctx.Provider>
}
