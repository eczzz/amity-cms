import { useState } from 'react';
import { ContentModel } from '../../types';
import { ContentModelsList } from './ContentModelsList';
import { ContentModelEditor } from './ContentModelEditor';

export function ContentModels() {
  const [editingModel, setEditingModel] = useState<ContentModel | null | undefined>(undefined);

  const handleEdit = (model: ContentModel | null) => {
    setEditingModel(model);
  };

  const handleBack = () => {
    setEditingModel(undefined);
  };

  const handleSave = () => {
    setEditingModel(undefined);
  };

  // Show editor when editingModel is not undefined
  if (editingModel !== undefined) {
    return (
      <ContentModelEditor
        model={editingModel}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  // Show list view by default
  return <ContentModelsList onEdit={handleEdit} />;
}
