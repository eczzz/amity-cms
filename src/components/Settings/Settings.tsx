import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUser, faLock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { getSupabase } from '../../lib/supabase';
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
      const { data, error } = await getSupabase()
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
        const { error } = await getSupabase()
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

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile Settings', icon: faUser },
    { id: 'password' as SettingsTab, label: 'Change Password', icon: faLock },
    { id: 'users' as SettingsTab, label: 'User Management', icon: faUsers },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-text-muted mt-1 text-sm">Manage your account and system configuration</p>
        </div>

        {/* Horizontal Tab Navigation */}
        <div className="px-8">
          <nav className="flex gap-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'profile' && (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Settings saved successfully</span>
                </div>
              )}

              <div className="space-y-6">
                {/* General Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
                    <p className="text-xs text-gray-500 mt-1">Basic site configuration and details</p>
                  </div>

                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.site_name}
                        onChange={(e) => handleChange('site_name', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                        placeholder="Your Site Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.site_description}
                        onChange={(e) => handleChange('site_description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                        placeholder="Brief description of your site"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                    <p className="text-xs text-gray-500 mt-1">How people can reach you</p>
                  </div>

                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => handleChange('contact_email', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.contact_phone}
                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={settings.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                        placeholder="Your business address"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
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
