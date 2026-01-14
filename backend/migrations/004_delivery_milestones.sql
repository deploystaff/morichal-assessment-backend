-- Delivery Milestones Feature Migration
-- Run this SQL against the Railway PostgreSQL database

-- Create delivery_milestones table
CREATE TABLE IF NOT EXISTS delivery_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    milestone_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    milestone_type VARCHAR(20) DEFAULT 'deliverable',
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'upcoming',
    "order" INTEGER DEFAULT 0,
    color VARCHAR(7) DEFAULT '#6366F1',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, milestone_code)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_delivery_milestones_client ON delivery_milestones(client_id);
CREATE INDEX IF NOT EXISTS idx_delivery_milestones_status ON delivery_milestones(status);
CREATE INDEX IF NOT EXISTS idx_delivery_milestones_start_date ON delivery_milestones(start_date);
