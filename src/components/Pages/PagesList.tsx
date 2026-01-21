import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../lib/supabase';
import { Page } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PagesListProps {
  onEdit: (page: Page | null) => void;
}

export function PagesList({ onEdit }: PagesListProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase.from('pages').delete().eq('id', id);
      if (error) throw error;
      setPages(pages.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
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
          <h1>Pages</h1>
          <p className="text-text-muted mt-2">Manage your website pages</p>
        </div>
        <button
          onClick={() => onEdit(null)}
          className="btn-primary py-2 text-small flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          New Page
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-text-muted mb-4">No pages yet. Create your first page to get started.</p>
          <button
            onClick={() => onEdit(null)}
            className="btn-primary py-2 text-small inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Create First Page
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
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-bg-light-gray transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{page.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-small text-text-muted">/{page.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-pill text-tiny font-medium ${
                          page.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {page.status === 'published' ? (
                          <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                        ) : (
                          <FontAwesomeIcon icon={faEyeSlash} className="w-3 h-3" />
                        )}
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-small text-text-muted">
                      {formatDate(page.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(page)}
                          className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-light-gray rounded-md transition"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                        </button>
                        {page.created_by === user?.id && (
                          <button
                            onClick={() => handleDelete(page.id)}
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
