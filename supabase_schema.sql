-- ==============================================================================
-- RESOLVIA CREATIVE STUDIO: Supabase Database Schema
-- CMS (Blog & Case Studies) + CRM (Inbound Leads)
-- ==============================================================================

-- 1. Create Posts Table (Blog Posts & Case Studies)
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
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Index on slug and status for instant query performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- 2. Create Leads Table (Client Inquiries from #contact Lead Form)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    format TEXT DEFAULT 'Short-Form (Shorts / Reels / TikTok)',
    channel_url TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal_sent', 'won', 'archived')),
    ip_country TEXT,
    source_page TEXT DEFAULT '/',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Index on leads status and creation timestamp
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- 3. Row-Level Security (RLS) Configuration

-- Enable RLS on both tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Posts Policies:
-- Anyone (public/unauthenticated) can READ published posts
CREATE POLICY "Public can view published posts"
    ON public.posts
    FOR SELECT
    USING (status = 'published');

-- Authenticated admins can view, insert, update, and delete ALL posts
CREATE POLICY "Admins full access to posts"
    ON public.posts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Leads Policies:
-- Anyone (public visitors) can INSERT new inquiries via the contact form
CREATE POLICY "Public can submit inquiries"
    ON public.leads
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated admins can READ and UPDATE leads
CREATE POLICY "Admins can view and manage leads"
    ON public.leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Automatic updated_at trigger for Posts
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

-- 5. Seed initial categories
COMMENT ON TABLE public.posts IS 'Resolvia Editorial CMS blog posts, case studies, and retention guides';
COMMENT ON TABLE public.leads IS 'Resolvia prospective client inbound inquiries from theresolvia.com';
