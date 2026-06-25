'use client'

import { useState, DragEvent, ChangeEvent } from 'react'
import Link from 'next/link'

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'ready' | 'error'

interface DocMeta {
  filename: string
  fileSize: number
  chunk_count: number
}

const STEPS = [
  { key: 'uploading',   icon: '📤', label: 'Uploading your document…',            sub: 'Sending to the server' },
  { key: 'parsing',     icon: '📖', label: 'Parsing text from PDF…',              sub: 'Extracting every word and sentence' },
  { key: 'embedding',   icon: '🧠', label: 'Building the knowledge graph…',       sub: 'Mapping entities, relations, and facts' },
  { key: 'indexing',    icon: '🔍', label: 'Creating semantic search index…',     sub: 'Chunking + embedding via pgvector' },
]

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function estimatePages(chunkCount: number) {
  // ~1500 chars per chunk, ~250 words per page, ~5 chars/word → ~300 words/chunk → ~1.2 pages/chunk
  return Math.max(1, Math.round(chunkCount * 1.2))
}

export function FileUpload() {
  const [status, setStatus]     = useState<UploadStatus>('idle')
  const [step, setStep]         = useState(0)       // index into STEPS during processing
  const [dragging, setDragging] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [meta, setMeta]         = useState<DocMeta | null>(null)

  async function upload(file: File) {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are supported right now.')
      setStatus('error')
      return
    }
    setMeta(null)
    setStatus('uploading')
    setStep(0)
    setErrorMsg('')

    const formData = new FormData()
    formData.append('file', file)

    // Animate through steps while waiting
    let stepIdx = 0
    const stepTimer = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, STEPS.length - 1)
      setStep(stepIdx)
    }, 4000)

    let docId: string | null = null
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        clearInterval(stepTimer)
        setErrorMsg(data.error ?? 'Upload failed.')
        setStatus('error')
        return
      }
      docId = data.document_id
      setStatus('processing')
      setStep(2)
    } catch {
      clearInterval(stepTimer)
      setErrorMsg('Network error — check your connection and try again.')
      setStatus('error')
      return
    }

    // Poll for completion
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      try {
        const r = await fetch(`/api/upload?doc_id=${docId}`)
        if (!r.ok) return
        const d = await r.json()
        if (d.status === 'ready') {
          clearInterval(poll)
          clearInterval(stepTimer)
          setMeta({ filename: file.name, fileSize: file.size, chunk_count: d.chunk_count ?? 0 })
          setStatus('ready')
        }
        if (d.status === 'error') {
          clearInterval(poll)
          clearInterval(stepTimer)
          setStatus('error')
          setErrorMsg('Processing failed — the document may be image-only (no text layer).')
        }
      } catch { /* network blip — keep polling */ }
      if (attempts > 40) {
        clearInterval(poll)
        clearInterval(stepTimer)
        setStatus('error')
        setErrorMsg('Processing is taking longer than expected. Check back in a moment.')
      }
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

  const busy = status === 'uploading' || status === 'processing'
  const currentStep = STEPS[step] ?? STEPS[0]

  if (status === 'ready' && meta) {
    const estPages = estimatePages(meta.chunk_count)
    const estSections = Math.max(3, Math.round(meta.chunk_count * 0.4))
    return (
      <div className="space-y-5">
        {/* Success card */}
        <div className="rounded-2xl border border-[rgba(26,107,60,0.25)] bg-[#EBF5EF] p-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#1A6B3C] flex items-center justify-center text-white text-lg">✓</div>
            <div>
              <div className="font-semibold text-[#1A6B3C]">Document ready</div>
              <div className="text-xs text-[#6B5E52] font-mono truncate max-w-[220px]">{meta.filename}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: '📄', label: 'File size',            val: fmtSize(meta.fileSize) },
              { icon: '📑', label: 'Est. pages',           val: `~${estPages}` },
              { icon: '🧩', label: 'Semantic chunks',      val: meta.chunk_count.toString() },
              { icon: '🔍', label: 'pgvector sections',    val: `~${estSections}` },
            ].map(({ icon, label, val }) => (
              <div key={label} className="rounded-xl bg-white border border-[rgba(26,107,60,0.15)] p-3.5">
                <div className="text-base mb-1">{icon}</div>
                <div className="font-mono text-[18px] font-semibold text-[#1A6B3C]">{val}</div>
                <div className="text-[10px] text-[#6B5E52]">{label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white border border-[rgba(26,107,60,0.15)] p-4 text-xs text-[#6B5E52] leading-relaxed mb-5">
            <span className="font-semibold text-[#1A6B3C]">What just happened:</span> Your document was split into {meta.chunk_count} searchable chunks,
            each embedded as a vector in Supabase pgvector. LightRAG also built a knowledge graph mapping
            every entity and relationship across the document. Your AI agent can now answer questions using
            both graph traversal and semantic search simultaneously.
          </div>

          <Link href="/chat"
            className="block w-full text-center rounded-xl bg-[#1A6B3C] hover:bg-[#15572f] text-white font-semibold text-sm py-3 transition shadow-sm shadow-[rgba(26,107,60,0.25)]">
            Start chatting with this document →
          </Link>
        </div>

        <button
          onClick={() => { setStatus('idle'); setMeta(null) }}
          className="w-full text-center text-xs text-[#6B5E52] hover:text-[#1C1510] transition"
        >
          Upload another document
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="rounded-2xl border border-[rgba(255,77,61,0.25)] bg-[#FFF0EE] p-7 text-center space-y-4">
        <div className="text-3xl">⚠</div>
        <div className="font-semibold text-[#FF4D3D]">Upload failed</div>
        <p className="text-sm text-[#6B5E52]">{errorMsg}</p>
        <button
          onClick={() => { setStatus('idle'); setErrorMsg('') }}
          className="rounded-xl bg-[#1C1510] hover:bg-[#2d241e] text-white text-sm font-semibold px-6 py-2.5 transition"
        >
          Try again
        </button>
      </div>
    )
  }

  if (busy) {
    return (
      <div className="rounded-2xl border border-[#E8E0D5] bg-white p-8">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="text-3xl mb-3 animate-bounce">{currentStep.icon}</div>
          <div className="font-semibold text-[#1C1510] mb-1">{currentStep.label}</div>
          <div className="text-xs text-[#6B5E52]">{currentStep.sub}</div>
        </div>

        {/* Step progress */}
        <div className="space-y-2.5">
          {STEPS.map((s, i) => (
            <div key={s.key} className={`flex items-center gap-3 text-xs transition-all ${i <= step ? 'opacity-100' : 'opacity-25'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                i < step  ? 'bg-[#1A6B3C] text-white' :
                i === step ? 'bg-[#E8A020] text-white animate-pulse' :
                'bg-[#E8E0D5] text-[#6B5E52]'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={i === step ? 'text-[#1C1510] font-medium' : 'text-[#6B5E52]'}>{s.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[11px] text-[#6B5E52] font-mono text-center">
          This takes 30–60 seconds on first run (cold start on free tier)
        </p>
      </div>
    )
  }

  // Idle drop zone
  return (
    <label
      className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
        dragging
          ? 'border-[#1A6B3C] bg-[#EBF5EF] scale-[1.01]'
          : 'border-[#E8E0D5] bg-white hover:border-[rgba(26,107,60,0.4)] hover:bg-[#FAF7F2]'
      }`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input type="file" accept=".pdf" className="hidden" onChange={handleChange} />
      <div className="text-4xl mb-3">📄</div>
      <p className="text-sm font-semibold text-[#1C1510] mb-1">Drop your PDF here</p>
      <p className="text-xs text-[#6B5E52]">or click to browse — max 4MB</p>
      <p className="mt-4 font-mono text-[10px] text-[#6B5E52]/60 tracking-wide">PDF only · text-layer required · processed in ~30s</p>
    </label>
  )
}
