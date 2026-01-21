import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../lib/supabase';
import { Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PostsListProps {
  onEdit: (post: Post | null) => void;
}

export function PostsList({ onEdit }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
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
      const { error } = await supabase.from('posts').delete().eq('id', id);
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
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Slug</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Status</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Updated</th>
                  <th className="text-right px-6 py-4 text-small font-semibold text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-slate">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-bg-light-gray transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-small text-text-muted mt-1 line-clamp-1">{post.excerpt}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-small text-text-muted">/{post.slug}</div>
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(post)}
                          className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-light-gray rounded-md transition"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                        </button>
                        {post.created_by === user?.id && (
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        )}
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
