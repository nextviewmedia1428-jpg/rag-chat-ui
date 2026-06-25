import { Message } from '@/lib/types'

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-[#1A6B3C] text-white rounded-br-sm'
          : 'glass-cream text-[#1C1510] rounded-bl-sm'
      }`}>
        {message.content}
      </div>
    </div>
  )
}
