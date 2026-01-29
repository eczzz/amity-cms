import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { getSupabase } from '../../lib/supabase';
import { Page } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PageEditorProps {
  page: Page | null;
  onBack: () => void;
  onSave: () => void;
}

export function PageEditor({ page, onBack, onSave }: PageEditorProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setSlug(page.slug);
      setContent(page.content);
      setMetaDescription(page.meta_description);
      setMetaKeywords(page.meta_keywords);
      setStatus(page.status);
    }
  }, [page]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!page) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const pageData = {
        title,
        slug,
        content,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (page) {
        const { error } = await getSupabase()
          .from('pages')
          .update(pageData)
          .eq('id', page.id);

        if (error) throw error;
      } else {
        const { error } = await getSupabase()
          .from('pages')
          .insert({
            ...pageData,
            created_by: user?.id,
          });

        if (error) throw error;
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          Back to Pages
        </button>
        <h1>
          {page ? 'Edit Page' : 'Create New Page'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-small">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="mb-4">
              <label className="block text-small font-medium text-text-primary mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 text-small"
                placeholder="Page title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-small font-medium text-text-primary mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 text-small"
                placeholder="page-url-slug"
              />
              <p className="text-tiny text-text-muted mt-1">URL: /{slug}</p>
            </div>

            <div>
              <label className="block text-small font-medium text-text-primary mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-2 text-small resize-none"
                placeholder="Write your page content here..."
              />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">SEO Settings</h3>

            <div className="mb-4">
              <label className="block text-small font-medium text-text-primary mb-2">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 text-small resize-none"
                placeholder="Brief description for search engines"
              />
            </div>

            <div>
              <label className="block text-small font-medium text-text-primary mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className="w-full px-4 py-2 text-small"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Publish</h3>

            <div className="mb-4">
              <label className="block text-small font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-4 py-2 text-small"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full btn-primary py-2 text-small flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Page'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
