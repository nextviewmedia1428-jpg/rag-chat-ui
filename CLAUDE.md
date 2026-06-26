# rag-chat-agent — Project Charter

## What This Is

Portfolio Project #1. A RAG chatbot where users upload PDFs and an AI answers from them using dual retrieval — pgvector semantic search + LightRAG knowledge graph. Live demo on the landing page uses ABC Electronics mock documents.

**Upwork pitch angle:** "AI-powered document assistant — upload any PDF and chat with it instantly. Dual retrieval: semantic search + knowledge graph."

**No n8n involved.** Direct API integration stack — Next.js calls LightRAG, Supabase, and OpenAI directly.

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

## Architecture — Full Data Flow

### Upload flow
```
Browser → POST /api/upload
    ├─ Auth check (Supabase JWT)
    ├─ Create document record (status: processing)
    ├─ Extract text via unpdf (Mistral OCR if MISTRAL_API_KEY set)
    ├─ Send PDF → LightRAG /documents/upload (builds knowledge graph async)
    ├─ Chunk text (1500 chars, 150 overlap) → embed with text-embedding-3-small
    │       └─ Store as plain float array in document_chunks.embedding (NOT JSON.stringify)
    └─ Update document status → ready
```

### Chat flow (authenticated users)
```
Browser → POST /api/chat
    ├─ Auth + daily token limit check
    ├─ DUAL RETRIEVAL (parallel):
    │       ├─ pgvector: embed query → match_chunks() top 5, threshold 0.3
    │       └─ LightRAG: POST /query mode=mix top_k=5
    ├─ Merge context → OpenAI gpt-4o-mini
    └─ Save reply, update token_usage
```

### Demo flow (no login)
```
Browser → POST /api/demo-chat  (pgvector only, fast <3s)
        → POST /api/lightrag-query  (fired separately by client, 25s timeout)
    
demo-chat:
    ├─ Read DEMO_USER_ID per-request (not module-level constant)
    ├─ Embed query → match_chunks(filter_user_id=DEMO_USER_ID, match_count=10)
    ├─ Filter similarity >= 0.3 in app code
    └─ OpenAI gpt-4o-mini with pgvector context

lightrag-query (separate route, called by browser after chat reply lands):
    └─ POST /query to Render, 25s timeout, returns {text}
```

**Why split demo-chat and lightrag-query?**
Vercel Hobby has a 10s function timeout. LightRAG takes 5-25s depending on cache. Splitting lets the chat response arrive immediately from pgvector while LightRAG fills in the panel asynchronously.

---

## Demo Section Architecture

Landing page demo (`/`) uses ABC Electronics mock documents:
- `public/Mock Documents/abc_electronics_company_overview.pdf`
- `public/Mock Documents/abc_electronics_product_catalogue.pdf`
- `public/Mock Documents/abc_electronics_warranty_and_service.pdf`
- `public/Mock Documents/abc_electronics_hr_policy.pdf`

**5 personas** (keys: `abc-general-secretary`, `abc-hr-support`, `abc-customer-support`, `abc-sales-team`, `abc-sales-trainer`) defined in `src/lib/personas.ts`.

**DEMO_USER_ID** env var = Supabase UUID of the account that uploaded the 4 ABC Electronics PDFs. pgvector searches chunks belonging to this user.

**Render keep-warm:** `RenderStatusProvider` in root layout pings `/api/lightrag-health` every 10 min to prevent 15-min inactivity spin-down. On cold start detected (server up but `/documents` empty), auto-triggers `/api/demo-sync` to re-upload the 4 PDFs.

**Knowledge graph:** `/api/graph` fetches from LightRAG `/graphs?label=*`, filters top 50 nodes by degree server-side (raw response is ~150KB, would timeout if proxied whole). Rendered as canvas force-directed graph in cream/forest theme.

**Retrieved context panel:** After each chat reply, shows pgvector chunks with similarity scores (green badge) and LightRAG synthesized text (gold badge, loads async).

---

## Key Files

| File | Purpose |
|---|---|
| `src/app/api/demo-chat/route.ts` | Demo chat — pgvector only, fast |
| `src/app/api/lightrag-query/route.ts` | LightRAG query — separate route, 25s timeout |
| `src/app/api/graph/route.ts` | Graph viz data — filters top 50 server-side |
| `src/app/api/lightrag-health/route.ts` | Health check — detects cold graph via /documents |
| `src/app/api/demo-sync/route.ts` | Re-uploads 4 ABC PDFs to LightRAG on cold start |
| `src/app/api/admin/reembed/route.ts` | One-shot: re-embeds all DEMO_USER_ID chunks |
| `src/app/api/debug-demo/route.ts` | Debug: shows similarity scores for a test query |
| `src/app/api/chat/route.ts` | Auth'd chat — dual retrieval |
| `src/app/api/upload/route.ts` | PDF upload pipeline |
| `src/components/DemoSection.tsx` | Landing page demo UI |
| `src/components/GraphViz.tsx` | Canvas force-directed graph, cream theme |
| `src/components/RenderStatus.tsx` | Provider: keep-warm + cold-start recovery |
| `src/lib/personas.ts` | All personas inc. 5 ABC Electronics demo personas |
| `supabase/schema.sql` | Full DB schema — run once in Supabase SQL editor |

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://vwdcmbroznmjrzcmzyss.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# LightRAG
LIGHTRAG_URL=https://ai-rag-agent-zs1y.onrender.com

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Demo
DEMO_USER_ID=<UUID of Supabase account that uploaded the 4 ABC Electronics PDFs>

# Optional
MISTRAL_API_KEY=
DAILY_TOKEN_LIMIT=50000
```

---

## Supabase Schema Notes

`match_chunks` RPC signature (run in SQL editor if updating):
```sql
create or replace function match_chunks(
  query_embedding  vector(1536),
  filter_user_id   uuid,
  match_count      int   default 5,
  match_threshold  float default 0.3
)
returns table (content text, similarity float)
```
If two overloads exist (ambiguity error), drop the old one first:
```sql
drop function if exists public.match_chunks(vector, uuid, integer);
```

---

## Known Limitations (free tier)

- **Vercel Hobby 10s timeout.** LightRAG queries are decoupled to a separate client-side fetch to work around this. Auth'd `/api/chat` still combines both — may timeout on LightRAG cache miss.
- **Render free tier spins down after 15 min.** Keep-warm ping every 10 min prevents this while a tab is open. Graph resets on any Render restart (stored in /tmp). Auto-sync re-uploads PDFs on detection.
- **File size limit: 4MB.** Vercel Hobby body limit.
- **Embeddings must be plain float arrays.** Do NOT JSON.stringify() before storing — pgvector's <=> operator cannot compute similarity on string columns.
- **LightRAG graph label=*.** Using specific label (e.g. company name) returns empty. Always use `label=*`.
- **pgvector similarity for text-embedding-3-small** tends to be low (0.1–0.3 range for relevant content). Threshold of 0.3 in app code; do not set higher.

---

## Status

| Item | Status |
|---|---|
| MVP deployed | ✅ Live |
| ABC Electronics demo docs | ✅ 4 PDFs, all personas |
| pgvector dual retrieval | ✅ Working (fixed JSON.stringify bug + reembedded) |
| LightRAG GraphRAG | ✅ Working (decoupled from Vercel timeout) |
| Knowledge graph viz | ✅ Cream theme, full-width, cream palette |
| Demo retrieved context panel | ✅ pgvector chunks + GraphRAG text, similarity scores |
| Render keep-warm + auto-sync | ✅ Working |
| Login — no auto-chat creation | ✅ Fixed |
| Favicon | ✅ Green 'i' icon (replaced Vercel triangle) |
| Loom demo | ⬜ Next task |

---

*Last updated: 2026-06-26, Sprint 1, Day 4.*
