import { useState } from 'react';
import { PostsList } from './PostsList';
import { PostEditor } from './PostEditor';
import { Post } from '../../types';

export function Posts() {
  const [editingPost, setEditingPost] = useState<Post | null | undefined>(undefined);

  const handleEdit = (post: Post | null) => {
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
