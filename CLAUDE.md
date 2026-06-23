# rag-chat-agent — Project Charter

## What This Is

Portfolio Project #1. A RAG chatbot where users upload PDFs and chat with an AI that answers from them. Demonstrates: full-stack AI product, dual retrieval strategy, persona system, token management.

**Upwork pitch angle:** "AI-powered document assistant — upload any PDF and chat with it instantly."

---

## Architecture

```
Next.js (Vercel)  →  LightRAG (Render)  →  knowledge graph retrieval
                  →  Supabase pgvector  →  semantic chunk retrieval
                  →  Claude Haiku 4.5   →  answer synthesis
                  →  Mistral OCR        →  vision/image PDF handling
```

**Dual retrieval on every query:** LightRAG hybrid mode + Supabase pgvector, results merged before synthesis.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js (App Router, TypeScript, Tailwind) |
| Hosting | Vercel (frontend), Render free tier (LightRAG) |
| Database | Supabase (Auth + PostgreSQL + pgvector) |
| RAG engine | LightRAG (GraphRAG, hybrid retrieval mode) |
| LLM | Claude Haiku 4.5 (claude-haiku-4-5) |
| Embeddings | OpenAI text-embedding-3-small (1536d) |
| Vision OCR | Mistral OCR API |

---

## Key Files

- `supabase/schema.sql` — run once in Supabase SQL editor
- `src/app/api/chat/route.ts` — dual retrieval + synthesis
- `src/app/api/upload/route.ts` — PDF processing pipeline
- `lightrag-server/` — LightRAG deployment config for Render
- `.env.local` — all secrets (never commit)

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
LIGHTRAG_URL                  # https://your-app.onrender.com
OPENAI_API_KEY                # embeddings only
ANTHROPIC_API_KEY             # Claude Haiku synthesis
MISTRAL_API_KEY               # Vision OCR
DAILY_TOKEN_LIMIT=50000
```

---

## Status

| Item | Status |
|---|---|
| Folder + docs | ✅ Done |
| Supabase schema | ⬜ |
| LightRAG on Render | ⬜ |
| Next.js scaffold | ⬜ |
| Auth | ⬜ |
| PDF upload flow | ⬜ |
| Chat + dual retrieval | ⬜ |
| UI | ⬜ |
| Vercel deploy | ⬜ |
| Loom demo | ⬜ |

---

*Last updated: 2026-06-23*
