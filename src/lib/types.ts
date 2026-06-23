export type DocumentStatus = 'processing' | 'ready' | 'error'

export interface Document {
  id: string
  user_id: string
  filename: string
  status: DocumentStatus
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  persona: Persona
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export type Persona = 'assistant' | 'customer_support' | 'receptionist' | 'book_guide'

export const PERSONA_LABELS: Record<Persona, string> = {
  assistant: 'General Assistant',
  customer_support: 'Customer Support',
  receptionist: 'Receptionist',
  book_guide: 'Book Guide',
}

export const PERSONA_PROMPTS: Record<Persona, string> = {
  assistant:
    'You are a helpful AI assistant. Answer questions based on the provided documents accurately and concisely.',
  customer_support:
    'You are a professional customer support agent. Be friendly, empathetic, and resolve questions using the provided documents. Always offer further help.',
  receptionist:
    'You are a warm virtual receptionist. Greet users, help them find information from the provided documents, and guide them to the right resources.',
  book_guide:
    'You are a knowledgeable book guide. Help users explore, understand, and navigate the content of their uploaded documents. Reference specific sections when helpful.',
}
