-- ==============================================================================
-- RESOLVIA CREATIVE STUDIO: Supabase Database Migration (Safe & Idempotent)
-- Handles fresh databases as well as pre-existing tables without column conflicts
-- ==============================================================================

-- 1. Create or Upgrade Posts Table (Blog Posts & Case Studies)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Retention Science',
    badge TEXT NOT NULL DEFAULT 'Retention Science',
    cover_image TEXT,
    youtube_id TEXT,
    content_markdown TEXT NOT NULL,
    read_time TEXT DEFAULT '7 min read',
    author TEXT DEFAULT 'Resolvia Studio Team',
    status TEXT NOT NULL DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Ensure all posts columns exist even if public.posts was pre-existing
ALTER TABLE public.posts
    ADD COLUMN IF NOT EXISTS slug TEXT,
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Retention Science',
    ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT 'Retention Science',
    ADD COLUMN IF NOT EXISTS cover_image TEXT,
    ADD COLUMN IF NOT EXISTS youtube_id TEXT,
    ADD COLUMN IF NOT EXISTS content_markdown TEXT,
    ADD COLUMN IF NOT EXISTS read_time TEXT DEFAULT '7 min read',
    ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Resolvia Studio Team',
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
    ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW());

-- 2. Create or Upgrade Leads Table (Client Inquiries)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    format TEXT DEFAULT 'Short-Form (Shorts / Reels / TikTok)',
    channel_url TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    ip_country TEXT,
    source_page TEXT DEFAULT '/',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Safe upgrade: add any columns missing in pre-existing leads table
ALTER TABLE public.leads
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'Short-Form (Shorts / Reels / TikTok)',
    ADD COLUMN IF NOT EXISTS channel_url TEXT,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
    ADD COLUMN IF NOT EXISTS ip_country TEXT,
    ADD COLUMN IF NOT EXISTS source_page TEXT DEFAULT '/',
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW());

-- 3. Indexes (Fast Querying & Sorting)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- 4. Row-Level Security (RLS) Configuration
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Posts Policies:
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
CREATE POLICY "Public can view published posts"
    ON public.posts FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Admins full access to posts" ON public.posts;
CREATE POLICY "Admins full access to posts"
    ON public.posts FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon full access to posts" ON public.posts;
CREATE POLICY "Allow anon full access to posts"
    ON public.posts FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Leads Policies:
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.leads;
CREATE POLICY "Public can submit inquiries"
    ON public.leads FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage leads" ON public.leads;
CREATE POLICY "Admins can view and manage leads"
    ON public.leads FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read manage leads" ON public.leads;
CREATE POLICY "Allow anon read manage leads"
    ON public.leads FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- 5. Automatic updated_at trigger for Posts
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_posts_updated ON public.posts;
CREATE TRIGGER on_posts_updated
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Table Documentation Comments
COMMENT ON TABLE public.posts IS 'Resolvia Editorial CMS blog posts, case studies, and retention guides';
COMMENT ON TABLE public.leads IS 'Resolvia prospective client inbound inquiries from theresolvia.com';
