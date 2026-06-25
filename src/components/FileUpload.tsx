'use client'

import { useState, DragEvent, ChangeEvent } from 'react'

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'ready' | 'error'

export function FileUpload() {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [filename, setFilename] = useState('')
  const [dragging, setDragging] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function upload(file: File) {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are supported.')
      setStatus('error')
      return
    }
    setFilename(file.name)
    setStatus('uploading')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setErrorMsg(data.error ?? 'Upload failed.')
      setStatus('error')
      return
    }

    setStatus('processing')
    // Poll for document status
    const docId = data.document_id
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      const r = await fetch(`/api/upload?doc_id=${docId}`)
      if (r.ok) {
        const d = await r.json()
        if (d.status === 'ready') { clearInterval(poll); setStatus('ready') }
        if (d.status === 'error') { clearInterval(poll); setStatus('error'); setErrorMsg('Processing failed.') }
      }
      if (attempts > 30) { clearInterval(poll); setStatus('error'); setErrorMsg('Processing timed out.') }
    }, 3000)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  const statusMessages: Record<UploadStatus, string> = {
    idle: 'Drag & drop a PDF here, or click to browse',
    uploading: `Uploading ${filename}…`,
    processing: `Reading your document — this takes about 30 seconds…`,
    ready: `✓ ${filename} is ready — go ask questions in chat!`,
    error: errorMsg || 'Something went wrong.',
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <label
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${status === 'ready' ? 'border-green-400 bg-green-50' : ''} ${status === 'error' ? 'border-red-400 bg-red-50' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input type="file" accept=".pdf" className="hidden" onChange={handleChange} disabled={status === 'uploading' || status === 'processing'} />
        <div className="text-4xl mb-3">{status === 'ready' ? '✅' : status === 'error' ? '❌' : '📄'}</div>
        <p className="text-sm text-center px-4 text-gray-600">{statusMessages[status]}</p>
        {(status === 'uploading' || status === 'processing') && (
          <div className="mt-3 h-1 w-32 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse w-full" />
          </div>
        )}
      </label>
      {status === 'error' && (
        <button onClick={() => setStatus('idle')} className="mt-3 text-sm text-blue-600 hover:underline">
          Try again
        </button>
      )}
    </div>
  )
}
