"""Management command to create meeting elements tables."""
from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Create tables for Updates, Blockers, Attachments, and MeetingSummaries'

    def handle(self, *args, **options):
        sql = """
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

        CREATE INDEX IF NOT EXISTS idx_updates_client ON updates(client_id);
        CREATE INDEX IF NOT EXISTS idx_updates_meeting ON updates(meeting_id);
        CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC);

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

        CREATE INDEX IF NOT EXISTS idx_blockers_client ON blockers(client_id);
        CREATE INDEX IF NOT EXISTS idx_blockers_meeting ON blockers(meeting_id);
        CREATE INDEX IF NOT EXISTS idx_blockers_status ON blockers(status);
        CREATE INDEX IF NOT EXISTS idx_blockers_created_at ON blockers(created_at DESC);

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

        CREATE INDEX IF NOT EXISTS idx_attachments_client ON attachments(client_id);
        CREATE INDEX IF NOT EXISTS idx_attachments_meeting ON attachments(meeting_id);
        CREATE INDEX IF NOT EXISTS idx_attachments_created_at ON attachments(created_at DESC);

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

        CREATE INDEX IF NOT EXISTS idx_meeting_summaries_client ON meeting_summaries(client_id);
        CREATE INDEX IF NOT EXISTS idx_meeting_summaries_meeting ON meeting_summaries(meeting_id);
        """

        with connection.cursor() as cursor:
            for statement in sql.split(';'):
                statement = statement.strip()
                if statement:
                    try:
                        cursor.execute(statement)
                        self.stdout.write(f'Executed: {statement[:50]}...')
                    except Exception as e:
                        if 'already exists' in str(e):
                            self.stdout.write(self.style.WARNING(f'Already exists: {e}'))
                        else:
                            self.stdout.write(self.style.ERROR(f'Error: {e}'))

        self.stdout.write(self.style.SUCCESS('Successfully created meeting element tables'))
