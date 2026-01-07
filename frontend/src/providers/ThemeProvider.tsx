import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientConfig } from '../services/api';
import type { ClientConfig, ClientBranding } from '../types';

interface ThemeContextValue {
  config: ClientConfig | null;
  branding: ClientBranding | null;
  isLoading: boolean;
  error: Error | null;
  companyName: string;
  primaryColor: string;
}

const ThemeContext = createContext<ThemeContextValue>({
  config: null,
  branding: null,
  isLoading: true,
  error: null,
  companyName: 'MorichalAI',
  primaryColor: '#0f766e',
});

// Default branding values (Morichal)
const DEFAULT_BRANDING: ClientBranding = {
  id: '',
  primary_color: '#0f766e',
  secondary_color: '#1e293b',
  accent_color: '#f59e0b',
  logo_url: null,
  favicon_url: null,
  company_name: 'MorichalAI',
  tagline: '',
  website: null,
  features: {},
  created_at: '',
  updated_at: '',
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { data: config, isLoading, error } = useQuery({
    queryKey: ['clientConfig'],
    queryFn: clientConfig.get,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });

  const branding = config?.branding || DEFAULT_BRANDING;

  // Apply CSS custom properties when branding changes
  useEffect(() => {
    if (branding) {
      const root = document.documentElement;

      // Apply theme colors
      root.style.setProperty('--color-primary', branding.primary_color);
      root.style.setProperty('--color-primary-dark', adjustBrightness(branding.primary_color, -15));
      root.style.setProperty('--color-primary-light', adjustBrightness(branding.primary_color, 20));
      root.style.setProperty('--color-secondary', branding.secondary_color);
      root.style.setProperty('--color-accent', branding.accent_color);

      // Update favicon if provided
      if (branding.favicon_url) {
        const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (favicon) {
          favicon.href = branding.favicon_url;
        }
      }

      // Update page title with company name
      const companyName = branding.company_name || config?.name || 'MorichalAI';
      document.title = `${companyName} Assessment Portal`;
    }
  }, [branding, config?.name]);

  const contextValue: ThemeContextValue = {
    config: config || null,
    branding,
    isLoading,
    error: error as Error | null,
    companyName: branding.company_name || config?.name || 'MorichalAI',
    primaryColor: branding.primary_color,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useClientConfig() {
  const { config, isLoading, error } = useTheme();
  return { config, isLoading, error };
}

export function useBranding() {
  const { branding, isLoading, error } = useTheme();
  return { branding, isLoading, error };
}

export function useCompanyName() {
  const { companyName } = useTheme();
  return companyName;
}

/**
 * Adjust brightness of a hex color
 * @param hex - Hex color string (e.g., '#0f766e')
 * @param percent - Positive to lighten, negative to darken
 */
function adjustBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse RGB values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, r + (r * percent) / 100));
  g = Math.min(255, Math.max(0, g + (g * percent) / 100));
  b = Math.min(255, Math.max(0, b + (b * percent) / 100));

  // Convert back to hex
  const rHex = Math.round(r).toString(16).padStart(2, '0');
  const gHex = Math.round(g).toString(16).padStart(2, '0');
  const bHex = Math.round(b).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}
