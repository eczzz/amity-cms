import { useState, useEffect } from 'react';
import { ContentEntry } from '../../types';
import { getSupabase } from '../../lib/supabase';

interface ReferencePickerProps {
  modelApiIdentifier: string;
  value: string | null;
  onChange: (entryId: string | null) => void;
  required?: boolean;
}

export function ReferencePicker({ modelApiIdentifier, value, onChange, required }: ReferencePickerProps) {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [modelApiIdentifier]);

  const loadEntries = async () => {
    try {
      setLoading(true);

      // First, get the model ID from the API identifier
      const { data: models, error: modelError } = await getSupabase()
        .from('content_models')
        .select('id')
        .eq('api_identifier', modelApiIdentifier)
        .single();

      if (modelError) throw modelError;

      if (models) {
        // Then get entries for that model
        const { data: entriesData, error: entriesError } = await getSupabase()
          .from('content_entries')
          .select('*')
          .eq('content_model_id', models.id)
          .order('created_at', { ascending: false });

        if (entriesError) throw entriesError;
        setEntries(entriesData || []);
      }
    } catch (error) {
      console.error('Error loading reference entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <select disabled className="w-full px-4 py-2 text-small">
        <option>Loading...</option>
      </select>
    );
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full px-4 py-2 text-small"
      required={required}
    >
      <option value="">Select {modelApiIdentifier}...</option>
      {entries.map((entry) => (
        <option key={entry.id} value={entry.id}>
          {entry.title}
        </option>
      ))}
      {entries.length === 0 && (
        <option disabled>No {modelApiIdentifier} entries found</option>
      )}
    </select>
  );
}
