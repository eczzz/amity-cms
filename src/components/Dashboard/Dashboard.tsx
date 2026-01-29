import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faNewspaper, faImages, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { getSupabase } from '../../lib/supabase';

interface Stats {
  pages: number;
  posts: number;
  media: number;
  publishedPages: number;
  publishedPosts: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    pages: 0,
    posts: 0,
    media: 0,
    publishedPages: 0,
    publishedPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [pagesResult, postsResult, mediaResult, publishedPagesResult, publishedPostsResult] = await Promise.all([
        getSupabase().from('pages').select('id', { count: 'exact', head: true }),
        getSupabase().from('posts').select('id', { count: 'exact', head: true }),
        getSupabase().from('media').select('id', { count: 'exact', head: true }),
        getSupabase().from('pages').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        getSupabase().from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      ]);

      setStats({
        pages: pagesResult.count || 0,
        posts: postsResult.count || 0,
        media: mediaResult.count || 0,
        publishedPages: publishedPagesResult.count || 0,
        publishedPosts: publishedPostsResult.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Pages',
      value: stats.pages,
      subtitle: `${stats.publishedPages} published`,
      icon: faFileAlt,
      color: 'bg-blue-500',
    },
    {
      title: 'Blog Posts',
      value: stats.posts,
      subtitle: `${stats.publishedPosts} published`,
      icon: faNewspaper,
      color: 'bg-green-500',
    },
    {
      title: 'Media Files',
      value: stats.media,
      subtitle: 'Images & documents',
      icon: faImages,
      color: 'bg-amber-500',
    },
    {
      title: 'Total Content',
      value: stats.pages + stats.posts,
      subtitle: 'All items',
      icon: faChartLine,
      color: 'bg-slate-500',
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-slate rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-bg-slate rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Dashboard</h1>
        <p className="text-text-muted mt-2">Welcome to your content management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="card-hover p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-md`}>
                <FontAwesomeIcon icon={card.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-text-primary mb-1">{card.value}</h3>
            <p className="text-small font-medium text-text-primary">{card.title}</p>
            <p className="text-tiny text-text-muted mt-1">{card.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <h2 className="font-heading font-bold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-bg-slate rounded-md hover:border-primary transition cursor-pointer">
            <FontAwesomeIcon icon={faFileAlt} className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-medium text-text-primary">Create New Page</h3>
            <p className="text-tiny text-text-muted mt-1">Add a new website page</p>
          </div>
          <div className="p-4 border border-bg-slate rounded-md hover:border-primary transition cursor-pointer">
            <FontAwesomeIcon icon={faNewspaper} className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-medium text-text-primary">Write Blog Post</h3>
            <p className="text-tiny text-text-muted mt-1">Create a new blog post</p>
          </div>
          <div className="p-4 border border-bg-slate rounded-md hover:border-primary transition cursor-pointer">
            <FontAwesomeIcon icon={faImages} className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-medium text-text-primary">Upload Media</h3>
            <p className="text-tiny text-text-muted mt-1">Add images and files</p>
          </div>
        </div>
      </div>
    </div>
  );
}
