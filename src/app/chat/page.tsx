import Link from 'next/link'

export default function ChatPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-8">
      <div className="w-12 h-12 rounded-2xl bg-[#EBF5EF] border border-[rgba(26,107,60,0.2)] flex items-center justify-center text-2xl mb-4">🧠</div>
      <h2 className="font-serif text-[22px] text-[#1C1510] mb-2">No conversation selected</h2>
      <p className="text-sm text-[#6B5E52] max-w-xs mb-6">Choose a conversation from the sidebar, or upload a document to get started.</p>
      <Link href="/upload"
        className="rounded-xl bg-[#1A6B3C] hover:bg-[#15572f] text-white text-sm font-semibold px-5 py-2.5 transition shadow-sm shadow-[rgba(26,107,60,0.2)]">
        Upload a document →
      </Link>
    </div>
  )
}
