import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUser, faLock, faUsers, faPalette } from '@fortawesome/free-solid-svg-icons';
import { getSupabase } from '../../lib/supabase';
import { Setting } from '../../types';
import { ChangePassword } from './ChangePassword';
import { UserManagement } from './UserManagement';
import { useConfig } from '../../contexts/ConfigContext';
import { BrandingConfig } from '../../lib/config';
import { requestPresignedUrl, uploadToR2 } from '../../lib/r2';

type SettingsTab = 'profile' | 'password' | 'users' | 'branding';

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

  // Branding state
  const { config, updateBranding: contextUpdateBranding } = useConfig();
  const [brandingForm, setBrandingForm] = useState<BrandingConfig | null>(null);
  const [brandingSaving, setBrandingSaving] = useState(false);
  const [brandingSuccess, setBrandingSuccess] = useState(false);
  const [brandingError, setBrandingError] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

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

  // Branding handlers
  const getBrandingForm = (): BrandingConfig => {
    if (!brandingForm) {
      const initial = { ...config.branding };
      setBrandingForm(initial);
      return initial;
    }
    return brandingForm;
  };

  const handleBrandingChange = (field: keyof BrandingConfig, value: string) => {
    const current = getBrandingForm();
    setBrandingForm({ ...current, [field]: value });
  };

  const handleBrandingFileUpload = async (
    file: File,
    type: 'logo' | 'favicon' | 'background',
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    try {
      const { presignedUrl, publicUrl } = await requestPresignedUrl(file.name, file.type);
      await uploadToR2(file, presignedUrl);

      const current = getBrandingForm();
      switch (type) {
        case 'logo':
          setBrandingForm({ ...current, logoUrl: publicUrl });
          break;
        case 'favicon':
          setBrandingForm({ ...current, faviconUrl: publicUrl });
          break;
        case 'background':
          setBrandingForm({ ...current, loginBackgroundUrl: publicUrl });
          break;
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setBrandingError('Failed to upload file. Please try again.');
      setTimeout(() => setBrandingError(''), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleBrandingSave = async () => {
    const form = getBrandingForm();
    setBrandingSaving(true);
    setBrandingError('');
    setBrandingSuccess(false);

    try {
      const success = await contextUpdateBranding(form);
      if (!success) throw new Error('Failed to save branding settings');

      setBrandingSuccess(true);
      setTimeout(() => setBrandingSuccess(false), 3000);
    } catch (err: any) {
      setBrandingError(err.message || 'Failed to save branding settings');
    } finally {
      setBrandingSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile Settings', icon: faUser },
    { id: 'password' as SettingsTab, label: 'Change Password', icon: faLock },
    { id: 'users' as SettingsTab, label: 'User Management', icon: faUsers },
    { id: 'branding' as SettingsTab, label: 'Branding', icon: faPalette },
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

          {activeTab === 'branding' && (() => {
            const form = getBrandingForm();
            return (
              <>
                {brandingError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{brandingError}</span>
                  </div>
                )}

                {brandingSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Branding settings saved successfully</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Business Identity Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <h2 className="text-lg font-semibold text-gray-900">Business Identity</h2>
                      <p className="text-xs text-gray-500 mt-1">Your business name and visual assets</p>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Business Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          value={form.businessName}
                          onChange={(e) => handleBrandingChange('businessName', e.target.value)}
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                          placeholder="Your Business Name"
                        />
                      </div>

                      {/* Logo & Favicon */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBrandingFileUpload(file, 'logo', setUploadingLogo);
                            }}
                          />
                          <div
                            onClick={() => logoInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                          >
                            {uploadingLogo ? (
                              <p className="text-sm text-gray-500">Uploading...</p>
                            ) : form.logoUrl ? (
                              <img src={form.logoUrl} alt="Logo preview" className="max-h-16 mx-auto" />
                            ) : (
                              <p className="text-sm text-gray-500">Click to upload logo</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Favicon</label>
                          <input
                            ref={faviconInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBrandingFileUpload(file, 'favicon', setUploadingFavicon);
                            }}
                          />
                          <div
                            onClick={() => faviconInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                          >
                            {uploadingFavicon ? (
                              <p className="text-sm text-gray-500">Uploading...</p>
                            ) : form.faviconUrl ? (
                              <img src={form.faviconUrl} alt="Favicon preview" className="max-h-16 mx-auto" />
                            ) : (
                              <p className="text-sm text-gray-500">Click to upload favicon</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Login Background Image */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Login Background Image
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          Optional background image for the login screen
                        </p>
                        <input
                          ref={bgInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBrandingFileUpload(file, 'background', setUploadingBg);
                          }}
                        />
                        <div
                          onClick={() => bgInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                        >
                          {uploadingBg ? (
                            <p className="text-sm text-gray-500">Uploading...</p>
                          ) : form.loginBackgroundUrl ? (
                            <img src={form.loginBackgroundUrl} alt="Background preview" className="max-h-24 mx-auto rounded" />
                          ) : (
                            <p className="text-sm text-gray-500">Click to upload background image</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand Colors Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <h2 className="text-lg font-semibold text-gray-900">Brand Colors</h2>
                      <p className="text-xs text-gray-500 mt-1">Customize the color palette used across the CMS</p>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={form.primaryColor}
                              onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border-0"
                            />
                            <input
                              type="text"
                              value={form.primaryColor}
                              onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={form.secondaryColor}
                              onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border-0"
                            />
                            <input
                              type="text"
                              value={form.secondaryColor}
                              onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={form.accentColor}
                              onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border-0"
                            />
                            <input
                              type="text"
                              value={form.accentColor}
                              onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Navy / Dark Color</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={form.navyColor}
                              onChange={(e) => handleBrandingChange('navyColor', e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border-0"
                            />
                            <input
                              type="text"
                              value={form.navyColor}
                              onChange={(e) => handleBrandingChange('navyColor', e.target.value)}
                              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleBrandingSave}
                      disabled={brandingSaving || uploadingLogo || uploadingFavicon || uploadingBg}
                      className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                    >
                      <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                      {brandingSaving ? 'Saving...' : 'Save Branding'}
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
