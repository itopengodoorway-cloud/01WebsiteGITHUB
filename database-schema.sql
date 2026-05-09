-- ===========================================
-- IOG.doorway Golf Coaching App - Database Schema
-- Phase 2: Database Design & Supabase Configuration
-- Clean schema with proper ordering, IF NOT EXISTS, and separated test inserts
-- ===========================================

-- ===========================================
-- PART 1: STRUCTURE, INDEXES, RLS, TRIGGERS, STORAGE
-- ===========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLES
-- ===========================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    current_handicap NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS libraries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_paid BOOLEAN DEFAULT FALSE NOT NULL,
    price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    library_id UUID REFERENCES libraries(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    youtube_id TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS handicap_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    handicap NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS video_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
    progress_percentage NUMERIC DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, video_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT NOT NULL DEFAULT 'inactive',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'video')),
    is_from_coach BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_handicap_history_user_id ON handicap_history(user_id);
CREATE INDEX IF NOT EXISTS idx_handicap_history_created_at ON handicap_history(created_at);
CREATE INDEX IF NOT EXISTS idx_videos_library_id ON videos(library_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_video_id ON video_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);

-- ===========================================
-- RLS POLICIES
-- ===========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE handicap_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can view own handicap history" ON handicap_history
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own handicap history" ON handicap_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Free libraries visible to all" ON libraries
    FOR SELECT USING (NOT is_paid);
CREATE POLICY IF NOT EXISTS "Paid libraries visible to paid users" ON libraries
    FOR SELECT USING (
        is_paid = FALSE OR
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.user_id = auth.uid()
            AND s.status = 'active'
            AND s.current_period_end > NOW()
        )
    );
CREATE POLICY IF NOT EXISTS "Admin full access to libraries" ON libraries
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Videos in free libraries visible to all" ON videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM libraries l
            WHERE l.id = videos.library_id AND NOT l.is_paid
        )
    );
CREATE POLICY IF NOT EXISTS "Videos in paid libraries visible to paid users" ON videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM libraries l
            WHERE l.id = videos.library_id AND (
                NOT l.is_paid OR
                EXISTS (
                    SELECT 1 FROM subscriptions s
                    WHERE s.user_id = auth.uid()
                    AND s.status = 'active'
                    AND s.current_period_end > NOW()
                )
            )
        )
    );
CREATE POLICY IF NOT EXISTS "Admin full access to videos" ON videos
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Users can view own video progress" ON video_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own video progress" ON video_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own video progress" ON video_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own subscription" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own subscription" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Admin can view all subscriptions" ON subscriptions
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Coach can view all messages" ON chat_messages
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'coach');

CREATE POLICY IF NOT EXISTS "Users can view attachments for own messages" ON message_attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_messages cm
            WHERE cm.id = message_attachments.message_id
            AND cm.user_id = auth.uid()
        )
    );
CREATE POLICY IF NOT EXISTS "Users can insert attachments for own messages" ON message_attachments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_messages cm
            WHERE cm.id = message_attachments.message_id
            AND cm.user_id = auth.uid()
        )
    );
CREATE POLICY IF NOT EXISTS "Coach can view all attachments" ON message_attachments
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'coach');

-- ===========================================
-- TRIGGER TO AUTO-CREATE USER PROFILE
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- STORAGE BUCKET FOR CHAT VIDEOS
-- ===========================================
INSERT INTO storage.buckets (id, name, public)
SELECT 'chat-videos', 'chat-videos', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'chat-videos'
);

DROP POLICY IF EXISTS "Users can upload their own chat videos" ON storage.objects;
CREATE POLICY "Users can upload their own chat videos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'chat-videos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Users can view their own chat videos" ON storage.objects;
CREATE POLICY "Users can view their own chat videos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'chat-videos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Coach can view all chat videos" ON storage.objects;
CREATE POLICY "Coach can view all chat videos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'chat-videos' AND
        (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'coach')
    );

-- ===========================================
-- PART 2: TEST DATA INSERTS
-- ===========================================

INSERT INTO libraries (name, description, is_paid, price) VALUES
('Library 1 - Free Content', 'Free golf coaching videos for beginners', false, 0),
('Library 2 - Paid Content', 'Advanced coaching videos for paid members', true, 49);

INSERT INTO videos (library_id, title, description, youtube_id, thumbnail_url, duration)
SELECT l.id, 'Basic Swing Fundamentals', 'Learn the basics of a proper golf swing', 'dQw4w9WgXcQ',
       'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', '5:30'
FROM libraries l
WHERE l.name = 'Library 1 - Free Content';

INSERT INTO videos (library_id, title, description, youtube_id, thumbnail_url, duration)
SELECT l.id, 'Advanced Putting Techniques', 'Master the art of putting with pro tips', 'dQw4w9WgXcQ',
       'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', '8:15'
FROM libraries l
WHERE l.name = 'Library 2 - Paid Content';
