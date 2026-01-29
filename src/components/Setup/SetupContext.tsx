import { createContext, useContext, useState, ReactNode } from 'react';
import { BrandingConfig } from '../../lib/config';

export interface SetupState {
  currentStep: number;
  supabase: {
    url: string;
    anonKey: string;
    connected: boolean;
  };
  r2: {
    accountId: string;
    bucketName: string;
    publicUrl: string;
    accessKeyId: string;
    secretAccessKey: string;
    configured: boolean;
  };
  branding: BrandingConfig;
  admin: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    created: boolean;
  };
}

interface SetupContextType {
  state: SetupState;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateSupabase: (data: Partial<SetupState['supabase']>) => void;
  updateR2: (data: Partial<SetupState['r2']>) => void;
  updateBranding: (data: Partial<BrandingConfig>) => void;
  updateAdmin: (data: Partial<SetupState['admin']>) => void;
}

const initialState: SetupState = {
  currentStep: 0,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    connected: false,
  },
  r2: {
    accountId: import.meta.env.VITE_R2_ACCOUNT_ID || '',
    bucketName: import.meta.env.VITE_R2_BUCKET_NAME || '',
    publicUrl: import.meta.env.VITE_R2_PUBLIC_URL || '',
    accessKeyId: '',
    secretAccessKey: '',
    configured: false,
  },
  branding: {
    businessName: '',
    logoUrl: '',
    collapsedLogoUrl: '',
    faviconUrl: '',
    loginBackgroundUrl: null,
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#FFC844',
    navyColor: '#224059',
  },
  admin: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    created: false,
  },
};

const SetupContext = createContext<SetupContextType | null>(null);

export function SetupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SetupState>(initialState);

  const setCurrentStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const nextStep = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setState((prev) => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  };

  const updateSupabase = (data: Partial<SetupState['supabase']>) => {
    setState((prev) => ({
      ...prev,
      supabase: { ...prev.supabase, ...data },
    }));
  };

  const updateR2 = (data: Partial<SetupState['r2']>) => {
    setState((prev) => ({
      ...prev,
      r2: { ...prev.r2, ...data },
    }));
  };

  const updateBranding = (data: Partial<BrandingConfig>) => {
    setState((prev) => ({
      ...prev,
      branding: { ...prev.branding, ...data },
    }));
  };

  const updateAdmin = (data: Partial<SetupState['admin']>) => {
    setState((prev) => ({
      ...prev,
      admin: { ...prev.admin, ...data },
    }));
  };

  return (
    <SetupContext.Provider
      value={{
        state,
        setCurrentStep,
        nextStep,
        prevStep,
        updateSupabase,
        updateR2,
        updateBranding,
        updateAdmin,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
}

export function useSetup() {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
}
