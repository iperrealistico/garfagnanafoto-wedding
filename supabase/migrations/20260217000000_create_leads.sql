-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    wedding_location TEXT,
    locale TEXT DEFAULT 'it',
    package_id TEXT,
    is_custom BOOLEAN DEFAULT false,
    quote_snapshot JSONB,
    additional_requests TEXT,
    gdpr_accepted_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated/service role (Admin) full access
CREATE POLICY "Allow service role full access" ON public.leads
    FOR ALL USING (true) WITH CHECK (true);

-- Allow public (anon) to insert leads
CREATE POLICY "Allow public lead submission" ON public.leads
    FOR INSERT WITH CHECK (true);

-- INDEXES for faster search
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
