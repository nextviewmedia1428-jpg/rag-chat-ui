'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { FileUpload } from '@/components/FileUpload'
import Link from 'next/link'

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) router.push('/login')
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/chat" className="font-mono text-[11px] text-[#6B5E52] hover:text-[#1C1510] transition mb-3 block">← Back to chat</Link>
            <h1 className="font-serif text-[28px] text-[#1C1510]">Add a document</h1>
            <p className="text-sm text-[#6B5E52] mt-1">Upload a PDF — your agent learns it instantly</p>
          </div>
        </div>
        <FileUpload />
      </div>
    </div>
  )
}
