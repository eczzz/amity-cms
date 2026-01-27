import { useState } from 'react';
import { useSetup } from '../SetupContext';
import { useConfig } from '../../../contexts/ConfigContext';

export function CompleteStep() {
  const { state } = useSetup();
  const { updateBranding, completeSetup } = useConfig();
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  const finishSetup = async () => {
    setFinishing(true);
    setError('');

    try {
      // Save branding configuration
      const brandingSuccess = await updateBranding(state.branding);
      if (!brandingSuccess) {
        throw new Error('Failed to save branding configuration');
      }

      // Mark setup as complete
      const completeSuccess = await completeSetup();
      if (!completeSuccess) {
        throw new Error('Failed to mark setup as complete');
      }

      setCompleted(true);
    } catch (err: any) {
      console.error('Failed to complete setup:', err);
      setError(err.message || 'Failed to complete setup');
    } finally {
      setFinishing(false);
    }
  };

  const goToLogin = () => {
    window.location.reload();
  };

  if (completed) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Setup Complete!</h3>
          <p className="text-text-muted text-small">
            Your CMS is ready to use. Click below to go to the login page.
          </p>
        </div>

        <button
          onClick={goToLogin}
          className="btn-primary px-8 py-3 text-small"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Ready to Complete Setup</h3>
        <p className="text-text-muted text-small">
          Review your configuration and click finish to complete the setup.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-small">
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h4 className="font-medium text-text-primary">Configuration Summary</h4>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-small text-text-muted">Business Name</span>
            <span className="text-small font-medium text-text-primary">{state.branding.businessName}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-small text-text-muted">Admin Email</span>
            <span className="text-small font-medium text-text-primary">{state.admin.email}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-small text-text-muted">Database</span>
            <span className="text-small font-medium text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Connected
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-small text-text-muted">Media Storage</span>
            <span className="text-small font-medium text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Configured
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-small text-text-muted">Colors</span>
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: state.branding.primaryColor }} title="Primary" />
              <div className="w-6 h-6 rounded" style={{ backgroundColor: state.branding.secondaryColor }} title="Secondary" />
              <div className="w-6 h-6 rounded" style={{ backgroundColor: state.branding.accentColor }} title="Accent" />
              <div className="w-6 h-6 rounded" style={{ backgroundColor: state.branding.navyColor }} title="Navy" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={finishSetup}
          disabled={finishing}
          className="btn-primary px-8 py-3 text-small disabled:opacity-50"
        >
          {finishing ? 'Finishing...' : 'Finish Setup'}
        </button>
      </div>
    </div>
  );
}
