# rag-chat-agent — Project Charter

## What This Is

Portfolio Project #1. A RAG chatbot where users upload PDFs and chat with an AI that answers from them. Demonstrates: full-stack AI product, dual retrieval strategy, persona system, token management.

**Upwork pitch angle:** "AI-powered document assistant — upload any PDF and chat with it instantly."

**No n8n involved.** This is a direct API integration stack — Next.js calls LightRAG, Supabase, and OpenAI directly.

---

## Live URLs

| Service | URL | Platform |
|---|---|---|
| Frontend (UI) | https://rag-chat-ui-psi.vercel.app | Vercel (Hobby) |
| LightRAG backend | https://ai-rag-agent-zs1y.onrender.com | Render (Free tier) |
| Database / Auth | https://vwdcmbroznmjrzcmzyss.supabase.co | Supabase |

**GitHub repos:**
- UI: https://github.com/nextviewmedia1428-jpg/rag-chat-ui
- LightRAG server config: https://github.com/nextviewmedia1428-jpg/AI-RAG-AGENT

---

## How the Stack Works (full data flow)

### Upload flow (user uploads a PDF)

```
Browser → POST /api/upload (Next.js on Vercel)
    │
    ├─ 1. Auth check (Supabase JWT)
    ├─ 2. Create document record in Supabase (status: processing)
    ├─ 3. Extract text for Supabase:
    │       └─ Mistral OCR if MISTRAL_API_KEY set (handles image PDFs)
    │       └─ unpdf fallback (text-based PDFs, serverless-compatible)
    ├─ 4. Send original PDF file → LightRAG POST /documents/upload (multipart)
    │       └─ LightRAG does its own PDF extraction + builds knowledge graph
    │       └─ Runs on Render, uses OpenAI gpt-4o-mini to extract entities/relations
    │       └─ Graph building is async — appears in WebUI 30–60s after upload
    ├─ 5. Chunk extracted text (1500 chars, 150 overlap) → embed with OpenAI text-embedding-3-small
    │       └─ Store chunks + embeddings in Supabase pgvector
    └─ 6. Update document status → ready
```

### Chat flow (user asks a question)

```
Browser → POST /api/chat (Next.js on Vercel)
    │
    ├─ 1. Auth check + daily token limit check (Supabase)
    ├─ 2. DUAL RETRIEVAL (runs in parallel):
    │       ├─ A. Semantic search: embed query → match_chunks() in Supabase pgvector (top 5)
    │       └─ B. Graph RAG: POST /api/v1/query to LightRAG (hybrid mode, top 5)
    ├─ 3. Merge both result sets into a single context block
    ├─ 4. Call OpenAI gpt-4o-mini with: system persona + merged context + message history
    └─ 5. Save reply to Supabase, update token_usage
```

### Why dual retrieval?
- **LightRAG (GraphRAG):** Understands entity relationships across the whole document. Better for "what is the relationship between X and Y?" questions.
- **Supabase pgvector (semantic):** Fast, user-scoped chunk search. Better for "find the part that mentions X" questions.
- Both run in parallel and their results are merged — covers each other's blind spots.

### Why no n8n?
n8n is for workflow automation between external services. This stack is a direct API product — Next.js server-side code handles all the logic. n8n would add latency and complexity for no gain here. n8n is used in other portfolio projects (lead management, calling agent).

---

## Architecture Diagram

```
User Browser
    │
    ▼
Next.js API Routes (Vercel)
    │
    ├──────────────────────────────────────────┐
    │                                          │
    ▼                                          ▼
LightRAG (Render)                     Supabase (pgvector)
GraphRAG: entity/relation graph       Semantic chunk search
gpt-4o-mini for graph building        text-embedding-3-small
    │                                          │
    └──────────────┬───────────────────────────┘
                   │
                   ▼
           Merged context
                   │
                   ▼
         OpenAI gpt-4o-mini
         (answer synthesis)
                   │
                   ▼
           Response to user
```

---

## Tech Stack

| Layer | Tech | Notes |
|---|---|---|
| Frontend | Next.js 16, App Router, TypeScript, Tailwind | Vercel |
| LightRAG backend | Python, FastAPI, LightRAG library | Render free tier |
| Database | Supabase (PostgreSQL + pgvector) | Auth + chunks + metadata |
| LLM (chat + graph) | OpenAI gpt-4o-mini | Chat synthesis + LightRAG graph building |
| Embeddings | OpenAI text-embedding-3-small (1536d) | Both upload and query |
| PDF extraction | unpdf (serverless-compatible pdfjs WASM) | Replaced pdf-parse which crashes on Vercel Turbopack |
| Vision OCR | Mistral OCR API | Optional — image-heavy PDFs only |

---

## Key Files

| File | Purpose |
|---|---|
| `src/app/api/chat/route.ts` | Dual retrieval + OpenAI synthesis |
| `src/app/api/upload/route.ts` | PDF → LightRAG + Supabase pipeline |
| `src/app/api/conversations/route.ts` | List / create conversations |
| `src/lib/types.ts` | Persona type + PERSONA_PROMPTS |
| `src/lib/supabase-server.ts` | Server-side Supabase clients (user + admin) |
| `src/lib/supabase-browser.ts` | Browser-side Supabase client |
| `supabase/schema.sql` | Full DB schema — run once in Supabase SQL editor |
| `lightrag-server/serve.py` | LightRAG startup script (bypasses Gunicorn wrapper) |
| `lightrag-server/render.yaml` | Render deployment config |
| `.env.local` | All secrets — never commit |

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://vwdcmbroznmjrzcmzyss.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# LightRAG
LIGHTRAG_URL=https://ai-rag-agent-zs1y.onrender.com

# OpenAI (embeddings + chat synthesis + LightRAG graph building)
OPENAI_API_KEY=sk-proj-...

# Optional — Vision OCR for image-heavy PDFs
MISTRAL_API_KEY=

# Limits
DAILY_TOKEN_LIMIT=50000
```

---

## Personas

| Persona key | Behaviour |
|---|---|
| `assistant` | General-purpose helpful assistant |
| `customer_support` | Friendly, solution-focused support agent |
| `receptionist` | Warm, professional front-desk style |
| `book_guide` | Academic, cites sections, encourages deeper reading |

Swap persona via `PersonaSelector.tsx` — changes the system prompt on every chat request.

---

## Known Limitations (free tier)

- **LightRAG on Render free tier spins down after 15 min inactivity.** First request after sleep takes ~30s cold start. Knowledge graph resets on each redeploy (no persistent disk — `/tmp` only).
- **File size limit: 4MB.** Vercel Hobby serverless functions have a hard 4.5MB body payload limit. PDFs larger than 4MB are rejected. Upgrade to Vercel Pro or switch to direct-to-Supabase-Storage upload to lift this.
- **Upload is synchronous.** Vercel kills background tasks after the response is sent, so the full pipeline (extract → LightRAG → embed → pgvector) runs before returning. Large PDFs near the 4MB limit may approach the 60s function timeout.
- **LightRAG only indexes text-layer PDFs.** Scanned/image PDFs need `MISTRAL_API_KEY` set for OCR — otherwise extraction returns empty text.
- **Supabase free tier:** 500MB storage, 50K monthly active users.
- **LightRAG correct API endpoints:** `POST /documents/upload` (multipart file), `POST /query` (search). Not `/api/v1/insert` or `/api/v1/query`.

---

## Status

| Item | Status |
|---|---|
| Folder + docs | ✅ Done |
| Supabase schema | ✅ Done |
| LightRAG on Render | ✅ Live |
| Next.js scaffold | ✅ Done |
| Auth (Supabase) | ✅ Done |
| PDF upload flow | ✅ Working (text-based PDFs ≤4MB) |
| Chat + dual retrieval | ✅ Working |
| UI components | ✅ Done |
| Vercel deploy | ✅ Live |
| Email confirmation redirect | ✅ Fixed (Supabase Site URL set to Vercel URL) |
| Loom demo | ⬜ Pending — record tomorrow |

---

## Loom Demo Script (3 min)

1. **[0:00–0:20]** Open the live URL. "This is a document assistant that lets you chat with any PDF."
2. **[0:20–0:50]** Sign up → lands on chat. Show the 4 personas in the sidebar.
3. **[0:50–1:30]** Upload a PDF (use something with clear content). Watch status → ready.
4. **[1:30–2:30]** Ask 2–3 questions. Show it citing content from the PDF. Switch persona mid-conversation.
5. **[2:30–3:00]** "Built with Next.js, LightRAG GraphRAG, Supabase pgvector, and OpenAI. Dual retrieval gives better answers than either method alone."

---

*Last updated: 2026-06-24, Sprint 1, Day 3. Status: MVP deployed.*
