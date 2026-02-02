import { useState } from 'react';
import { PostsList } from './PostsList';
import { PostEditor } from './PostEditor';

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

export function Posts() {
  const [editingPost, setEditingPost] = useState<BlogEntry | null | undefined>(undefined);

  const handleEdit = (post: BlogEntry | null) => {
    setEditingPost(post);
  };

  const handleBack = () => {
    setEditingPost(undefined);
  };

  const handleSave = () => {
    setEditingPost(undefined);
  };

  if (editingPost !== undefined) {
    return <PostEditor post={editingPost} onBack={handleBack} onSave={handleSave} />;
  }

  return <PostsList onEdit={handleEdit} />;
}
