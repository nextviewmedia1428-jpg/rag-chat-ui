-- Enable pgvector
create extension if not exists vector;

-- DOCUMENTS
create table public.documents (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  filename   text not null,
  status     text default 'processing' check (status in ('processing', 'ready', 'error')),
  created_at timestamptz default now()
);

alter table public.documents enable row level security;
create policy "owner" on public.documents for all using (auth.uid() = user_id);

-- DOCUMENT_CHUNKS (pgvector semantic store)
create table public.document_chunks (
  id          uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  content     text not null,
  embedding   vector(1536),
  created_at  timestamptz default now()
);

alter table public.document_chunks enable row level security;
create policy "owner" on public.document_chunks for all using (auth.uid() = user_id);

create index idx_chunks_embedding on public.document_chunks
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index idx_chunks_user on public.document_chunks(user_id);

-- CONVERSATIONS
create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  title      text default 'New Chat',
  persona    text default 'assistant',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.conversations enable row level security;
create policy "owner" on public.conversations for all using (auth.uid() = user_id);

-- MESSAGES
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz default now()
);

alter table public.messages enable row level security;
create policy "owner" on public.messages for all using (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id and c.user_id = auth.uid()
  )
);

-- TOKEN USAGE (daily per-user)
create table public.token_usage (
  user_id uuid references auth.users(id) on delete cascade not null,
  date    date default current_date,
  tokens  int default 0,
  primary key (user_id, date)
);

alter table public.token_usage enable row level security;
create policy "owner" on public.token_usage for all using (auth.uid() = user_id);

-- VECTOR SEARCH FUNCTION
create or replace function match_chunks(
  query_embedding  vector(1536),
  filter_user_id   uuid,
  match_count      int   default 5,
  match_threshold  float default 0.5
)
returns table (content text, similarity float)
language sql stable as $$
  select content, 1 - (embedding <=> query_embedding) as similarity
  from public.document_chunks
  where user_id = filter_user_id
    and 1 - (embedding <=> query_embedding) >= match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
