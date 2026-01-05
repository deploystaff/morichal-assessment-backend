-- Sprint Roadmap Feature Migration
-- Run this SQL against the Railway PostgreSQL database

-- Create sprints table
CREATE TABLE IF NOT EXISTS sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    sprint_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'planned',
    "order" INTEGER DEFAULT 0,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, sprint_code)
);

-- Create sprint_items table
CREATE TABLE IF NOT EXISTS sprint_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    item_type VARCHAR(20) DEFAULT 'feature',
    status VARCHAR(20) DEFAULT 'planned',
    priority VARCHAR(20) DEFAULT 'medium',
    "order" INTEGER DEFAULT 0,
    assigned_to VARCHAR(100),
    estimated_hours DECIMAL(6,2),
    actual_hours DECIMAL(6,2),
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, item_code)
);

-- Add sprint_id column to meetings table
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sprints_client ON sprints(client_id);
CREATE INDEX IF NOT EXISTS idx_sprints_status ON sprints(status);
CREATE INDEX IF NOT EXISTS idx_sprint_items_client ON sprint_items(client_id);
CREATE INDEX IF NOT EXISTS idx_sprint_items_sprint ON sprint_items(sprint_id);
CREATE INDEX IF NOT EXISTS idx_sprint_items_status ON sprint_items(status);
CREATE INDEX IF NOT EXISTS idx_meetings_sprint ON meetings(sprint_id);
