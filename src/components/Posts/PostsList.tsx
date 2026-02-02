import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { getSupabase } from '../../lib/supabase';

// Blog content model ID
const BLOG_MODEL_ID = 'b0000000-0000-0000-0000-000000000001';

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

interface PostsListProps {
  onEdit: (post: BlogEntry | null) => void;
}

export function PostsList({ onEdit }: PostsListProps) {
  const [posts, setPosts] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await getSupabase()
        .from('content_entries')
        .select('*')
        .eq('content_model_id', BLOG_MODEL_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await getSupabase()
        .from('content_entries')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-bg-slate rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Blog Posts</h1>
          <p className="text-text-muted mt-2">Manage your blog content</p>
        </div>
        <button
          onClick={() => onEdit(null)}
          className="btn-primary py-2 text-small flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-text-muted mb-4">No posts yet. Create your first blog post to get started.</p>
          <button
            onClick={() => onEdit(null)}
            className="btn-primary py-2 text-small inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Create First Post
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-light-gray border-b border-bg-slate">
                <tr>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Title</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Category</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Status</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Updated</th>
                  <th className="text-right px-6 py-4 text-small font-semibold text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-slate">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-bg-light-gray transition cursor-pointer"
                    onClick={() => onEdit(post)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.fields?.featured_image && (
                          <img
                            src={post.fields.featured_image}
                            alt=""
                            className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-medium text-text-primary">{post.title}</div>
                          {post.fields?.slug && (
                            <div className="text-tiny text-text-muted">/blog/{post.fields.slug}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.fields?.category && (
                        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-tiny rounded-pill font-medium">
                          {post.fields.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-pill text-tiny font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {post.status === 'published' ? (
                          <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                        ) : (
                          <FontAwesomeIcon icon={faEyeSlash} className="w-3 h-3" />
                        )}
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-small text-text-muted">
                      {formatDate(post.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEdit(post)}
                          className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-light-gray rounded-md transition"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
