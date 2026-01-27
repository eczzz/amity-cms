import { useSetup } from '../SetupContext';

export function WelcomeStep() {
  const { nextStep } = useSetup();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Welcome to CMS Setup</h3>
        <p className="text-text-muted text-small">
          This wizard will guide you through configuring your CMS. Before you begin, please ensure you have:
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h4 className="font-medium text-text-primary">Prerequisites</h4>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-medium text-text-primary">Supabase Project</p>
              <p className="text-tiny text-text-muted">
                Create a free project at{' '}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  supabase.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-medium text-text-primary">Cloudflare R2 Bucket</p>
              <p className="text-tiny text-text-muted">
                Create an R2 bucket at{' '}
                <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Cloudflare Dashboard
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-medium text-text-primary">Environment Variables</p>
              <p className="text-tiny text-text-muted">
                Ensure your <code className="bg-gray-200 px-1 rounded">.env</code> file contains Supabase and R2 credentials
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-medium text-text-primary">Your Branding Assets</p>
              <p className="text-tiny text-text-muted">
                Logo and favicon images ready to upload
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="btn-primary px-6 py-2 text-small"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
