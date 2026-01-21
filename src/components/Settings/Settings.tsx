import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../lib/supabase';
import { Setting } from '../../types';
import { ChangePassword } from './ChangePassword';
import { UserManagement } from './UserManagement';

type SettingsTab = 'profile' | 'password' | 'users';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach((setting: Setting) => {
        settingsMap[setting.key] = setting.value;
      });

      setSettings((prev) => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  if (loading && activeTab === 'profile') {
    loadSettings().then(() => setLoading(false));
  }

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .update({ value: update.value, updated_at: update.updated_at })
          .eq('key', update.key);

        if (error) throw error;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Settings</h1>
        <p className="text-text-muted mt-2">Manage your account and system configuration</p>
      </div>

      <div className="flex gap-8">
        <div className="w-48">
          <div className="card p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-md transition ${
                  activeTab === 'profile'
                    ? 'bg-primary text-white'
                    : 'text-text-primary hover:bg-bg-light-gray'
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-2 rounded-md transition ${
                  activeTab === 'password'
                    ? 'bg-primary text-white'
                    : 'text-text-primary hover:bg-bg-light-gray'
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-2 rounded-md transition ${
                  activeTab === 'users'
                    ? 'bg-primary text-white'
                    : 'text-text-primary hover:bg-bg-light-gray'
                }`}
              >
                User Management
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-small">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 text-small">
                  Settings saved successfully
                </div>
              )}

              <div className="max-w-3xl space-y-6">
                <div className="card p-6">
                  <h2 className="font-heading font-semibold text-text-primary mb-6">General Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.site_name}
                        onChange={(e) => handleChange('site_name', e.target.value)}
                        className="w-full px-4 py-2 text-small"
                        placeholder="Your Site Name"
                      />
                    </div>

                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.site_description}
                        onChange={(e) => handleChange('site_description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 text-small resize-none"
                        placeholder="Brief description of your site"
                      />
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="font-heading font-semibold text-text-primary mb-6">Contact Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => handleChange('contact_email', e.target.value)}
                        className="w-full px-4 py-2 text-small"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.contact_phone}
                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                        className="w-full px-4 py-2 text-small"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        Address
                      </label>
                      <textarea
                        value={settings.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 text-small resize-none"
                        placeholder="Your business address"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary py-2 text-small flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'password' && <ChangePassword />}

          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </div>
  );
}
