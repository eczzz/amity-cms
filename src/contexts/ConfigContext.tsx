import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CMSConfig, BrandingConfig, loadConfig, saveBrandingConfig, markSetupComplete, applyBrandingColors, applyBrandingMeta } from '../lib/config';

interface ConfigContextType {
  config: CMSConfig;
  loading: boolean;
  error: string | null;
  updateBranding: (branding: BrandingConfig, client?: SupabaseClient) => Promise<boolean>;
  completeSetup: (client?: SupabaseClient) => Promise<boolean>;
  refreshConfig: () => Promise<void>;
}

const defaultConfig: CMSConfig = {
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

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  loading: true,
  error: null,
  updateBranding: async () => false,
  completeSetup: async () => false,
  refreshConfig: async () => {},
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CMSConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedConfig = await loadConfig();
      setConfig(loadedConfig);
      applyBrandingColors(loadedConfig.branding);
      applyBrandingMeta(loadedConfig.branding);
    } catch (err) {
      setError('Failed to load configuration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateBranding = async (branding: BrandingConfig, client?: SupabaseClient): Promise<boolean> => {
    const success = await saveBrandingConfig(branding, client);
    if (success) {
      setConfig((prev) => ({ ...prev, branding }));
      applyBrandingColors(branding);
      applyBrandingMeta(branding);
    }
    return success;
  };

  const completeSetup = async (client?: SupabaseClient): Promise<boolean> => {
    const success = await markSetupComplete(client);
    if (success) {
      setConfig((prev) => ({ ...prev, setupComplete: true }));
    }
    return success;
  };

  const refreshConfig = async () => {
    await fetchConfig();
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        loading,
        error,
        updateBranding,
        completeSetup,
        refreshConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
