import { useState } from 'react';
import { useSetup } from '../SetupContext';

export function R2Step() {
  const { state, updateR2, nextStep, prevStep } = useSetup();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const testR2 = async () => {
    setTesting(true);
    setTestResult(null);
    setErrorMessage('');

    try {
      // Test by requesting a presigned URL
      const response = await fetch('/api/generate-presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'test-connection.txt',
          contentType: 'text/plain',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate presigned URL');
      }

      setTestResult('success');
      updateR2({ configured: true });
    } catch (err: any) {
      setTestResult('error');
      setErrorMessage(err.message || 'Failed to connect to R2');
      updateR2({ configured: false });
    } finally {
      setTesting(false);
    }
  };

  const handleNext = () => {
    // Allow skipping R2 test if values are filled
    if (state.r2.accountId && state.r2.bucketName && state.r2.publicUrl) {
      updateR2({ configured: true });
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-text-muted text-small">
          Configure Cloudflare R2 for media storage. This allows you to upload logos, images, and other media.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-amber-800 mb-2">R2 Setup Instructions</h4>
        <ol className="text-small text-amber-700 space-y-2 list-decimal list-inside">
          <li>Go to your Cloudflare Dashboard and navigate to R2</li>
          <li>Create a new bucket (or use an existing one)</li>
          <li>Under bucket settings, enable public access or set up a custom domain</li>
          <li>Create an API token with R2 read/write permissions</li>
          <li>Add the credentials to your environment variables</li>
        </ol>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            Cloudflare Account ID
          </label>
          <input
            type="text"
            value={state.r2.accountId}
            onChange={(e) => updateR2({ accountId: e.target.value, configured: false })}
            className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
            placeholder="Your Cloudflare account ID"
          />
          <p className="text-tiny text-text-muted mt-1">
            Found in your Cloudflare dashboard URL or account settings
          </p>
        </div>

        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            R2 Bucket Name
          </label>
          <input
            type="text"
            value={state.r2.bucketName}
            onChange={(e) => updateR2({ bucketName: e.target.value, configured: false })}
            className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
            placeholder="your-bucket-name"
          />
        </div>

        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            R2 Public URL
          </label>
          <input
            type="text"
            value={state.r2.publicUrl}
            onChange={(e) => updateR2({ publicUrl: e.target.value, configured: false })}
            className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
            placeholder="https://your-r2-domain.com"
          />
          <p className="text-tiny text-text-muted mt-1">
            Your R2 public bucket URL or custom domain
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={testR2}
            disabled={testing || !state.r2.accountId || !state.r2.bucketName}
            className="btn-secondary px-4 py-2 text-small disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          {testResult === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-small">R2 configured correctly</span>
            </div>
          )}

          {testResult === 'error' && (
            <div className="flex items-center gap-2 text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-small">{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {state.r2.accountId && state.r2.bucketName && state.r2.publicUrl && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800 text-small">Add to your .env file</h4>
            <button
              onClick={() => {
                const snippet = `VITE_R2_ACCOUNT_ID=${state.r2.accountId}\nVITE_R2_BUCKET_NAME=${state.r2.bucketName}\nVITE_R2_PUBLIC_URL=${state.r2.publicUrl}`;
                navigator.clipboard.writeText(snippet);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-tiny px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-600"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 rounded p-3 text-tiny overflow-x-auto">
            <code>{`VITE_R2_ACCOUNT_ID=${state.r2.accountId}\nVITE_R2_BUCKET_NAME=${state.r2.bucketName}\nVITE_R2_PUBLIC_URL=${state.r2.publicUrl}`}</code>
          </pre>
          <p className="text-tiny text-gray-500 mt-2">
            Paste this into your <code className="bg-gray-100 px-1 rounded">.env</code> file, then restart the dev server for changes to take effect.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 text-small text-text-muted hover:text-text-primary"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!state.r2.accountId || !state.r2.bucketName || !state.r2.publicUrl}
          className="btn-primary px-6 py-2 text-small disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
