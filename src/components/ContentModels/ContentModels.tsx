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
  const [refreshKey, setRefreshKey] = useState(0);

  // Navigation handlers
  const handleEditModel = (model: ContentModel | null) => {
    setViewState({ view: 'model-editor', model });
  };

  const handleViewEntries = (model: ContentModel) => {
    setViewState({ view: 'entries', model });
  };

  const handleEditEntry = (model: ContentModel, entry: ContentEntry | null) => {
    console.log('handleEditEntry called with:', { model, entry });
    setViewState({ view: 'entry-editor', model, entry });
  };

  const handleBackToModels = () => {
    setViewState({ view: 'models' });
  };

  const handleBackToEntries = (model: ContentModel) => {
    setViewState({ view: 'entries', model });
  };

  const handleModelSave = () => {
    // Trigger a refresh without navigating away
    setRefreshKey(prev => prev + 1);
  };

  const handleEntrySave = () => {
    // Trigger a refresh for entries list without navigating away
    setRefreshKey(prev => prev + 1);
  };

  // Render appropriate view based on state
  if (viewState.view === 'model-editor') {
    return (
      <ContentModelEditor
        model={viewState.model}
        onBack={handleBackToModels}
        onSave={handleModelSave}
      />
    );
  }

  if (viewState.view === 'entries') {
    return (
      <ContentEntriesList
        key={refreshKey}
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
        onSave={handleEntrySave}
      />
    );
  }

  // Default: show models list
  return (
    <ContentModelsList
      key={refreshKey}
      onEdit={handleEditModel}
      onViewEntries={handleViewEntries}
    />
  );
}
