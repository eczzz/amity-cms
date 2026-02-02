import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faEye, faEyeSlash, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { getSupabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MediaPicker } from '../ContentModels/MediaPicker';
import TipTapEditor from '../TipTapEditor';

// Blog content model ID — matches the seeded content model for blog posts
const BLOG_MODEL_ID = 'b0000000-0000-0000-0000-000000000001';

const CATEGORIES = ['Climbing', 'Nutrition', 'Reflections'];

interface BlogEntry {
  id: string;
  content_model_id: string;
  title: string;
  fields: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface PostEditorProps {
  post: BlogEntry | null;
  onBack: () => void;
  onSave: () => void;
}

export function PostEditor({ post, onBack, onSave }: PostEditorProps) {
  const { user } = useAuth();

  // Core fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  // SEO fields
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [publishedAt, setPublishedAt] = useState('');

  // State
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.fields?.slug || '');
      setFeaturedImage(post.fields?.featured_image || null);
      setCategory(post.fields?.category || '');
      setExcerpt(post.fields?.excerpt || '');
      setContent(post.fields?.content || '');
      setSeoTitle(post.fields?.seo_title || '');
      setMetaDescription(post.fields?.meta_description || '');
      setOgImage(post.fields?.og_image || null);
      setTags(post.fields?.tags || '');
      setPublishedAt(post.fields?.published_at || '');
      setStatus(post.status === 'published' ? 'published' : 'draft');
    }
  }, [post]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!post) {
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
      const fields = {
        title: title.trim(),
        slug: slug.trim(),
        featured_image: featuredImage || '',
        category,
        excerpt,
        content,
        seo_title: seoTitle,
        meta_description: metaDescription,
        og_image: ogImage || '',
        tags,
        published_at: publishedAt || null,
      };

      const entryData = {
        content_model_id: BLOG_MODEL_ID,
        title: title.trim(),
        fields,
        status,
        published_at: status === 'published' ? (publishedAt || new Date().toISOString()) : null,
        created_by: user?.id,
      };

      if (post) {
        const { error: updateError } = await getSupabase()
          .from('content_entries')
          .update(entryData)
          .eq('id', post.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await getSupabase()
          .from('content_entries')
          .insert([entryData]);

        if (insertError) throw insertError;
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  // Google search preview
  const previewTitle = seoTitle || title || 'Page Title';
  const previewSlug = slug || 'page-url';
  const previewDescription = metaDescription || excerpt || 'No description provided.';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          Back to Posts
        </button>
        <div className="flex items-center justify-between">
          <h1>{post ? 'Edit Post' : 'Create New Post'}</h1>
          <div className="flex items-center gap-3">
            {/* Status Toggle */}
            <button
              type="button"
              onClick={() => setStatus(status === 'draft' ? 'published' : 'draft')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-small font-medium transition ${
                status === 'published'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              <FontAwesomeIcon
                icon={status === 'published' ? faEye : faEyeSlash}
                className="w-4 h-4"
              />
              {status === 'published' ? 'Published' : 'Draft'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary py-2 text-small flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-small">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="card p-6">
            <div className="mb-4">
              <label className="block text-small font-medium text-text-primary mb-2">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 text-small"
                placeholder="Post title"
              />
            </div>

            <div>
              <label className="block text-small font-medium text-text-primary mb-2">
                Slug <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-small text-text-muted">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-4 py-2 text-small"
                  placeholder="post-url-slug"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="card p-6">
            <label className="block text-small font-medium text-text-primary mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 text-small resize-none"
              placeholder="Brief summary of the post (shown on blog list page)"
            />
          </div>

          {/* Content - TipTap Editor */}
          <div className="card p-6">
            <label className="block text-small font-medium text-text-primary mb-2">
              Content
            </label>
            <TipTapEditor
              value={content}
              onChange={setContent}
              placeholder="Write your blog post content here..."
              minHeight="large"
            />
          </div>

          {/* SEO Settings */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-primary" />
              SEO Settings
            </h3>

            <div className="mb-4">
              <label className="block text-small font-medium text-text-primary mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-4 py-2 text-small"
                placeholder="Custom title for search engines (defaults to post title)"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-tiny text-text-muted">Recommended: 50-60 characters</p>
                <p className={`text-tiny ${
                  seoTitle.length > 60 ? 'text-red-600' : seoTitle.length > 50 ? 'text-amber-600' : 'text-text-muted'
                }`}>
                  {seoTitle.length}/60
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-small font-medium text-text-primary mb-2">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 text-small resize-none"
                placeholder="Brief description for search engines (150-160 characters ideal)"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-tiny text-text-muted">Recommended: 150-160 characters</p>
                <p className={`text-tiny ${
                  metaDescription.length > 160 ? 'text-red-600'
                    : metaDescription.length >= 150 ? 'text-green-600'
                    : metaDescription.length > 0 ? 'text-amber-600'
                    : 'text-text-muted'
                }`}>
                  {metaDescription.length}/160
                </p>
              </div>
            </div>

            {/* Google Search Preview */}
            <div className="bg-bg-light-gray rounded-lg p-4 mt-4">
              <p className="text-tiny font-medium text-text-muted mb-3 uppercase tracking-wide">
                Google Search Preview
              </p>
              <div className="bg-white rounded-md p-4 border border-bg-slate">
                <div className="text-[13px] text-text-muted mb-0.5">
                  amitywarme.com › blog › {previewSlug}
                </div>
                <div className="text-[18px] text-[#1a0dab] font-normal mb-1 leading-tight hover:underline cursor-pointer">
                  {previewTitle.length > 60 ? previewTitle.slice(0, 60) + '...' : previewTitle}
                </div>
                <div className="text-[13px] text-[#545454] leading-snug line-clamp-2">
                  {previewDescription.length > 160
                    ? previewDescription.slice(0, 160) + '...'
                    : previewDescription}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Featured Image</h3>
            <MediaPicker
              value={featuredImage}
              onChange={(url) => setFeaturedImage(url)}
            />
          </div>

          {/* Category */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Category</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 text-small"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Tags</h3>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 text-small"
              placeholder="climbing, training, nutrition"
            />
            <p className="text-tiny text-text-muted mt-1">Comma-separated tags</p>
            {tags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.split(',').filter(t => t.trim()).map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-tiny rounded-pill font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* OG Image */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">OG Image</h3>
            <p className="text-tiny text-text-muted mb-3">
              Image shown when shared on social media. Defaults to featured image if not set.
            </p>
            <MediaPicker
              value={ogImage}
              onChange={(url) => setOgImage(url)}
            />
          </div>

          {/* Published Date */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Published Date</h3>
            <input
              type="date"
              value={publishedAt ? publishedAt.split('T')[0] : ''}
              onChange={(e) => setPublishedAt(e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-4 py-2 text-small"
            />
            <p className="text-tiny text-text-muted mt-1">
              When to display as the publish date
            </p>
          </div>

          {/* Save Button (sticky) */}
          <div className="card p-6 sticky top-8">
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
              {saving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
