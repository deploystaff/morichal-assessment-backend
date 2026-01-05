-- Migration: Add meeting elements (Updates, Blockers, Attachments, MeetingSummaries)
-- Run this SQL on your Railway PostgreSQL database

-- Create updates table
CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    update_code VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_updates_client ON updates(client_id);
CREATE INDEX idx_updates_meeting ON updates(meeting_id);
CREATE INDEX idx_updates_created_at ON updates(created_at DESC);

-- Create blockers table
CREATE TABLE IF NOT EXISTS blockers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    blocker_code VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    owner VARCHAR(100),
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blockers_client ON blockers(client_id);
CREATE INDEX idx_blockers_meeting ON blockers(meeting_id);
CREATE INDEX idx_blockers_status ON blockers(status);
CREATE INDEX idx_blockers_created_at ON blockers(created_at DESC);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL DEFAULT 'link',
    file_url TEXT NOT NULL,
    description TEXT,
    uploaded_by VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_client ON attachments(client_id);
CREATE INDEX idx_attachments_meeting ON attachments(meeting_id);
CREATE INDEX idx_attachments_created_at ON attachments(created_at DESC);

-- Create meeting_summaries table
CREATE TABLE IF NOT EXISTS meeting_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    meeting_id UUID NOT NULL UNIQUE REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    generated_by VARCHAR(20) NOT NULL DEFAULT 'manual',
    key_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meeting_summaries_client ON meeting_summaries(client_id);
CREATE INDEX idx_meeting_summaries_meeting ON meeting_summaries(meeting_id);
