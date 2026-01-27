import { useState } from 'react';
import { useSetup } from '../SetupContext';
import { supabase } from '../../../lib/supabase';

export function SupabaseStep() {
  const { state, updateSupabase, nextStep, prevStep } = useSetup();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setErrorMessage('');

    try {
      // Test connection by querying the settings table
      const { error } = await supabase.from('settings').select('key').limit(1);

      if (error) {
        throw new Error(error.message);
      }

      setTestResult('success');
      updateSupabase({ connected: true });
    } catch (err: any) {
      setTestResult('error');
      setErrorMessage(err.message || 'Failed to connect to Supabase');
      updateSupabase({ connected: false });
    } finally {
      setTesting(false);
    }
  };

  const handleNext = () => {
    if (state.supabase.connected) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-text-muted text-small">
          Verify your Supabase connection and ensure the database schema is set up.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            Supabase URL
          </label>
          <input
            type="text"
            value={state.supabase.url}
            onChange={(e) => updateSupabase({ url: e.target.value, connected: false })}
            className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
            placeholder="https://your-project.supabase.co"
          />
          <p className="text-tiny text-text-muted mt-1">
            Set via <code className="bg-gray-100 px-1 rounded">VITE_SUPABASE_URL</code> in .env
          </p>
        </div>

        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            Supabase Anon Key
          </label>
          <input
            type="password"
            value={state.supabase.anonKey}
            onChange={(e) => updateSupabase({ anonKey: e.target.value, connected: false })}
            className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
          <p className="text-tiny text-text-muted mt-1">
            Set via <code className="bg-gray-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in .env
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={testConnection}
            disabled={testing || !state.supabase.url || !state.supabase.anonKey}
            className="btn-secondary px-4 py-2 text-small disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          {testResult === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-small">Connected successfully</span>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Database Schema Setup</h4>
        <p className="text-small text-blue-700 mb-3">
          If this is a fresh Supabase project, you need to run the database schema. Copy the contents
          of <code className="bg-blue-100 px-1 rounded">supabase/schema/complete-schema.sql</code> and
          run it in the Supabase SQL Editor.
        </p>
        <a
          href={`${state.supabase.url}/project/default/sql`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-small text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          Open SQL Editor
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 text-small text-text-muted hover:text-text-primary"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!state.supabase.connected}
          className="btn-primary px-6 py-2 text-small disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
