import { useState, useRef } from 'react';
import { useSetup } from '../SetupContext';
import { requestPresignedUrl, uploadToR2 } from '../../../lib/r2';

export function BrandingStep() {
  const { state, updateBranding, nextStep, prevStep } = useSetup();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    file: File,
    type: 'logo' | 'favicon' | 'background',
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);

    try {
      const { presignedUrl, publicUrl } = await requestPresignedUrl(file.name, file.type);
      await uploadToR2(file, presignedUrl);

      switch (type) {
        case 'logo':
          updateBranding({ logoUrl: publicUrl });
          break;
        case 'favicon':
          updateBranding({ faviconUrl: publicUrl });
          break;
        case 'background':
          updateBranding({ loginBackgroundUrl: publicUrl });
          break;
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (state.branding.businessName) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-text-muted text-small">
          Customize your CMS with your brand identity.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            Business Name *
          </label>
          <input
            type="text"
            value={state.branding.businessName}
            onChange={(e) => updateBranding({ businessName: e.target.value })}
            className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
            placeholder="Your Business Name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Logo
            </label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'logo', setUploadingLogo);
              }}
            />
            <div
              onClick={() => logoInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            >
              {state.branding.logoUrl ? (
                <img
                  src={state.branding.logoUrl}
                  alt="Logo preview"
                  className="max-h-16 mx-auto"
                />
              ) : uploadingLogo ? (
                <p className="text-small text-text-muted">Uploading...</p>
              ) : (
                <p className="text-small text-text-muted">Click to upload logo</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Favicon
            </label>
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'favicon', setUploadingFavicon);
              }}
            />
            <div
              onClick={() => faviconInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            >
              {state.branding.faviconUrl ? (
                <img
                  src={state.branding.faviconUrl}
                  alt="Favicon preview"
                  className="max-h-16 mx-auto"
                />
              ) : uploadingFavicon ? (
                <p className="text-small text-text-muted">Uploading...</p>
              ) : (
                <p className="text-small text-text-muted">Click to upload favicon</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-small font-medium text-text-primary mb-2">
            Login Background Image (Optional)
          </label>
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'background', setUploadingBg);
            }}
          />
          <div
            onClick={() => bgInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
          >
            {state.branding.loginBackgroundUrl ? (
              <img
                src={state.branding.loginBackgroundUrl}
                alt="Background preview"
                className="max-h-24 mx-auto"
              />
            ) : uploadingBg ? (
              <p className="text-small text-text-muted">Uploading...</p>
            ) : (
              <p className="text-small text-text-muted">Click to upload background image</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.branding.primaryColor}
                onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={state.branding.primaryColor}
                onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 text-small border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.branding.secondaryColor}
                onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={state.branding.secondaryColor}
                onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                className="flex-1 px-3 py-2 text-small border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.branding.accentColor}
                onChange={(e) => updateBranding({ accentColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={state.branding.accentColor}
                onChange={(e) => updateBranding({ accentColor: e.target.value })}
                className="flex-1 px-3 py-2 text-small border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Navy/Dark Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.branding.navyColor}
                onChange={(e) => updateBranding({ navyColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={state.branding.navyColor}
                onChange={(e) => updateBranding({ navyColor: e.target.value })}
                className="flex-1 px-3 py-2 text-small border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
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
          disabled={!state.branding.businessName}
          className="btn-primary px-6 py-2 text-small disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
