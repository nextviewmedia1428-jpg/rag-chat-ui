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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
            <p className="text-sm text-gray-500 mt-1">Upload PDFs to your knowledge base</p>
          </div>
          <Link href="/chat" className="text-sm text-blue-600 hover:underline">← Back to chat</Link>
        </div>
        <FileUpload />
      </div>
    </div>
  )
}
