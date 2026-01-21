import { useState } from 'react';
import { ContentModel, ContentEntry } from '../../types';
import { ContentModelsList } from './ContentModelsList';
import { ContentModelEditor } from './ContentModelEditor';
import { ContentEntriesList } from './ContentEntriesList';
import { ContentEntryEditor } from './ContentEntryEditor';

type ViewState =
  | { view: 'models' }
  | { view: 'model-editor'; model: ContentModel | null }
  | { view: 'entries'; model: ContentModel }
  | { view: 'entry-editor'; model: ContentModel; entry: ContentEntry | null };

export function ContentModels() {
  const [viewState, setViewState] = useState<ViewState>({ view: 'models' });

  // Navigation handlers
  const handleEditModel = (model: ContentModel | null) => {
    setViewState({ view: 'model-editor', model });
  };

  const handleViewEntries = (model: ContentModel) => {
    setViewState({ view: 'entries', model });
  };

  const handleEditEntry = (model: ContentModel, entry: ContentEntry | null) => {
    setViewState({ view: 'entry-editor', model, entry });
  };

  const handleBackToModels = () => {
    setViewState({ view: 'models' });
  };

  const handleBackToEntries = (model: ContentModel) => {
    setViewState({ view: 'entries', model });
  };

  // Render appropriate view based on state
  if (viewState.view === 'model-editor') {
    return (
      <ContentModelEditor
        model={viewState.model}
        onBack={handleBackToModels}
        onSave={handleBackToModels}
      />
    );
  }

  if (viewState.view === 'entries') {
    return (
      <ContentEntriesList
        model={viewState.model}
        onBack={handleBackToModels}
        onEditEntry={(entry) => handleEditEntry(viewState.model, entry)}
      />
    );
  }

  if (viewState.view === 'entry-editor') {
    return (
      <ContentEntryEditor
        model={viewState.model}
        entry={viewState.entry}
        onBack={() => handleBackToEntries(viewState.model)}
        onSave={() => handleBackToEntries(viewState.model)}
      />
    );
  }

  // Default: show models list
  return (
    <ContentModelsList
      onEdit={handleEditModel}
      onViewEntries={handleViewEntries}
    />
  );
}
