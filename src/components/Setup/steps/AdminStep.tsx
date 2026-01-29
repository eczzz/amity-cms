import { useState } from 'react';
import { useSetup } from '../SetupContext';
import { createSupabaseClient } from '../../../lib/supabase';

export function AdminStep() {
  const { state, updateAdmin, nextStep, prevStep } = useSetup();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const createAdmin = async () => {
    if (!state.admin.email || !state.admin.password) {
      setError('Email and password are required');
      return;
    }

    if (state.admin.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const client = createSupabaseClient(state.supabase.url, state.supabase.anonKey);
      const { data, error: fnError } = await client.functions.invoke('setup-admin-user', {
        body: {
          email: state.admin.email,
          password: state.admin.password,
          firstName: state.admin.firstName,
          lastName: state.admin.lastName,
        },
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      updateAdmin({ created: true });
      nextStep();
    } catch (err: any) {
      console.error('Failed to create admin:', err);
      setError(err.message || 'Failed to create admin user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-text-muted text-small">
          Create your administrator account to access the CMS.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-small">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              First Name
            </label>
            <input
              type="text"
              value={state.admin.firstName}
              onChange={(e) => updateAdmin({ firstName: e.target.value })}
              className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={state.admin.lastName}
              onChange={(e) => updateAdmin({ lastName: e.target.value })}
              className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={state.admin.email}
            onChange={(e) => updateAdmin({ email: e.target.value })}
            className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            Password *
          </label>
          <input
            type="password"
            value={state.admin.password}
            onChange={(e) => updateAdmin({ password: e.target.value })}
            className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
            placeholder="Minimum 6 characters"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Important</h4>
        <p className="text-small text-blue-700">
          This will create an admin user with full access to the CMS. Make sure to use a strong password
          and store it securely.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 text-small text-text-muted hover:text-text-primary"
        >
          Back
        </button>
        <button
          onClick={createAdmin}
          disabled={creating || !state.admin.email || !state.admin.password}
          className="btn-primary px-6 py-2 text-small disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create Admin Account'}
        </button>
      </div>
    </div>
  );
}
