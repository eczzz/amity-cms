import { useState } from 'react';
import { PagesList } from './PagesList';
import { PageEditor } from './PageEditor';
import { Page } from '../../types';

export function Pages() {
  const [editingPage, setEditingPage] = useState<Page | null | undefined>(undefined);

  const handleEdit = (page: Page | null) => {
    setEditingPage(page);
  };

  const handleBack = () => {
    setEditingPage(undefined);
  };

  const handleSave = () => {
    setEditingPage(undefined);
  };

  if (editingPage !== undefined) {
    return <PageEditor page={editingPage} onBack={handleBack} onSave={handleSave} />;
  }

  return <PagesList onEdit={handleEdit} />;
}
