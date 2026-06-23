# LightRAG Server — Render Deployment

## Deploy Steps

1. Push the `lightrag-server/` folder to a GitHub repo (or the main project repo)
2. In Render dashboard: **New → Web Service → Connect repo**
3. Set **Root Directory** to `lightrag-server`
4. Render auto-detects `render.yaml`
5. In Environment tab, set secrets:
   - `ANTHROPIC_API_KEY` — your Anthropic key
   - `OPENAI_API_KEY` — your OpenAI key (for embeddings)
6. Deploy. Get the public URL (e.g. `https://lightrag-server.onrender.com`)
7. Add the URL to your Next.js `.env.local` as `LIGHTRAG_URL`

## API Endpoints Used

- `POST /api/v1/insert` — ingest document text
- `POST /api/v1/query` — hybrid retrieval query

## Free Tier Notes

- Free tier sleeps after 15 min of inactivity (first request takes ~30s cold start)
- 512MB RAM — sufficient for small knowledge bases
- No persistent disk — knowledge graph resets on redeploy. Upgrade to paid tier for persistence.

## Upgrade Path

For production: use Render Starter ($7/mo) with a persistent disk mount at `/tmp/lightrag_data`.
