"""
Management command to set up clients with branding.
"""
from django.core.management.base import BaseCommand
from apps.clients.models import Client
from apps.deliverables.models import ClientBranding


class Command(BaseCommand):
    help = 'Set up clients and their branding configurations'

    CLIENTS = [
        {
            'name': 'Morichal',
            'slug': 'morichal',
            'branding': {
                'primary_color': '#0f766e',
                'secondary_color': '#1e293b',
                'accent_color': '#f59e0b',
                'company_name': 'MorichalAI',
                'tagline': 'AI-Powered Trade Intelligence',
                'website': 'https://morichalai.com',
                'features': {
                    'sprints': True,
                    'ai_suggestions': True,
                    'transcription': True,
                },
            },
        },
        {
            'name': 'Zidan',
            'slug': 'zidan',
            'branding': {
                'primary_color': '#3B82F6',
                'secondary_color': '#1e293b',
                'accent_color': '#f59e0b',
                'company_name': 'ZidansAI',
                'tagline': 'AI-Powered Solutions',
                'website': 'https://app.zidansai.com',
                'features': {
                    'sprints': True,
                    'ai_suggestions': True,
                    'transcription': True,
                },
            },
        },
    ]

    def add_arguments(self, parser):
        parser.add_argument(
            '--client',
            type=str,
            help='Set up a specific client by slug (e.g., morichal, zidan)',
        )

    def handle(self, *args, **options):
        specific_client = options.get('client')

        for client_data in self.CLIENTS:
            if specific_client and client_data['slug'] != specific_client:
                continue

            self.setup_client(client_data)

        self.stdout.write(self.style.SUCCESS('Client setup complete!'))

    def setup_client(self, client_data):
        """Create or update a client and its branding."""
        slug = client_data['slug']
        name = client_data['name']
        branding_data = client_data['branding']

        # Get or create client
        client, created = Client.objects.get_or_create(
            slug=slug,
            defaults={'name': name}
        )

        if created:
            self.stdout.write(f'  Created client: {name} ({slug})')
        else:
            self.stdout.write(f'  Client exists: {name} ({slug})')

        # Get or create branding
        branding, branding_created = ClientBranding.objects.get_or_create(
            client=client,
            defaults=branding_data
        )

        if branding_created:
            self.stdout.write(self.style.SUCCESS(f'    Created branding for {name}'))
        else:
            # Update existing branding
            for key, value in branding_data.items():
                setattr(branding, key, value)
            branding.save()
            self.stdout.write(f'    Updated branding for {name}')

        self.stdout.write(f'    Primary color: {branding.primary_color}')
        self.stdout.write(f'    Company name: {branding.company_name}')
