import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface BrandingConfig {
  businessName: string;
  logoUrl: string;
  faviconUrl: string;
  loginBackgroundUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  navyColor: string;
}

export interface CMSConfig {
  branding: BrandingConfig;
  setupComplete: boolean;
}

const DEFAULT_CONFIG: CMSConfig = {
  branding: {
    businessName: 'CMS Admin',
    logoUrl: '',
    faviconUrl: '',
    loginBackgroundUrl: null,
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#FFC844',
    navyColor: '#224059',
  },
  setupComplete: false,
};

const SETTINGS_KEYS = {
  businessName: 'branding_business_name',
  logoUrl: 'branding_logo_url',
  faviconUrl: 'branding_favicon_url',
  loginBackgroundUrl: 'branding_login_bg_url',
  primaryColor: 'branding_primary_color',
  secondaryColor: 'branding_secondary_color',
  accentColor: 'branding_accent_color',
  navyColor: 'branding_navy_color',
  setupComplete: 'setup_complete',
};

export async function loadConfig(): Promise<CMSConfig> {
  if (!supabase) {
    return DEFAULT_CONFIG;
  }

  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', Object.values(SETTINGS_KEYS));

    if (error) {
      console.error('Error loading config:', error);
      return DEFAULT_CONFIG;
    }

    const settingsMap = new Map(settings?.map((s) => [s.key, s.value]) || []);

    return {
      branding: {
        businessName: settingsMap.get(SETTINGS_KEYS.businessName) || DEFAULT_CONFIG.branding.businessName,
        logoUrl: settingsMap.get(SETTINGS_KEYS.logoUrl) || DEFAULT_CONFIG.branding.logoUrl,
        faviconUrl: settingsMap.get(SETTINGS_KEYS.faviconUrl) || DEFAULT_CONFIG.branding.faviconUrl,
        loginBackgroundUrl: settingsMap.get(SETTINGS_KEYS.loginBackgroundUrl) || DEFAULT_CONFIG.branding.loginBackgroundUrl,
        primaryColor: settingsMap.get(SETTINGS_KEYS.primaryColor) || DEFAULT_CONFIG.branding.primaryColor,
        secondaryColor: settingsMap.get(SETTINGS_KEYS.secondaryColor) || DEFAULT_CONFIG.branding.secondaryColor,
        accentColor: settingsMap.get(SETTINGS_KEYS.accentColor) || DEFAULT_CONFIG.branding.accentColor,
        navyColor: settingsMap.get(SETTINGS_KEYS.navyColor) || DEFAULT_CONFIG.branding.navyColor,
      },
      setupComplete: settingsMap.get(SETTINGS_KEYS.setupComplete) === 'true',
    };
  } catch (err) {
    console.error('Failed to load config:', err);
    return DEFAULT_CONFIG;
  }
}

export async function saveConfigValue(key: string, value: string, client?: SupabaseClient): Promise<boolean> {
  const db = client || supabase;
  if (!db) return false;

  try {
    const { error } = await db
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      console.error('Error saving config:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save config:', err);
    return false;
  }
}

export async function saveBrandingConfig(branding: BrandingConfig, client?: SupabaseClient): Promise<boolean> {
  const db = client || supabase;
  if (!db) return false;

  const updates = [
    { key: SETTINGS_KEYS.businessName, value: branding.businessName },
    { key: SETTINGS_KEYS.logoUrl, value: branding.logoUrl },
    { key: SETTINGS_KEYS.faviconUrl, value: branding.faviconUrl },
    { key: SETTINGS_KEYS.loginBackgroundUrl, value: branding.loginBackgroundUrl || '' },
    { key: SETTINGS_KEYS.primaryColor, value: branding.primaryColor },
    { key: SETTINGS_KEYS.secondaryColor, value: branding.secondaryColor },
    { key: SETTINGS_KEYS.accentColor, value: branding.accentColor },
    { key: SETTINGS_KEYS.navyColor, value: branding.navyColor },
  ];

  try {
    const { error } = await db
      .from('settings')
      .upsert(
        updates.map((u) => ({ ...u, updated_at: new Date().toISOString() })),
        { onConflict: 'key' }
      );

    if (error) {
      console.error('Error saving branding config:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save branding config:', err);
    return false;
  }
}

export async function markSetupComplete(client?: SupabaseClient): Promise<boolean> {
  return saveConfigValue(SETTINGS_KEYS.setupComplete, 'true', client);
}

export function applyBrandingColors(branding: BrandingConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', branding.primaryColor);
  root.style.setProperty('--color-secondary', branding.secondaryColor);
  root.style.setProperty('--color-accent', branding.accentColor);
  root.style.setProperty('--color-navy', branding.navyColor);
}

export function applyBrandingMeta(branding: BrandingConfig): void {
  // Update page title
  document.title = `${branding.businessName} Admin`;

  // Update favicon if set
  if (branding.faviconUrl) {
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = branding.faviconUrl;
    }
  }
}

export { SETTINGS_KEYS };
