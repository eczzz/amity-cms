import { ContentEntry, ContentModel, FieldDefinition } from '../types';
import { getSupabase } from './supabase';

/**
 * Resolves media field UUIDs to full URLs in a content entry
 */
export async function resolveMediaFields(
  entry: ContentEntry,
  model: ContentModel
): Promise<ContentEntry> {
  const fields = { ...entry.fields };

  // Find all media fields in the model
  const mediaFields = model.fields.filter((field: FieldDefinition) => field.field_type === 'media');

  if (mediaFields.length === 0) {
    return entry;
  }

  // Collect all media IDs to fetch
  const mediaIds = mediaFields
    .map((field: FieldDefinition) => fields[field.api_identifier])
    .filter((id): id is string => !!id);

  if (mediaIds.length === 0) {
    return entry;
  }

  // Fetch all media records in one query
  const { data: mediaRecords, error } = await getSupabase()
    .from('media')
    .select('id, url')
    .in('id', mediaIds);

  if (error) {
    console.error('Error fetching media records:', error);
    return entry;
  }

  // Create a map of id -> url
  const mediaMap = new Map(mediaRecords?.map((m) => [m.id, m.url]) || []);

  // Replace UUIDs with URLs
  mediaFields.forEach((field: FieldDefinition) => {
    const mediaId = fields[field.api_identifier];
    if (mediaId && mediaMap.has(mediaId)) {
      fields[field.api_identifier] = mediaMap.get(mediaId)!;
    }
  });

  return {
    ...entry,
    fields,
  };
}

/**
 * Resolves media fields for multiple entries
 */
export async function resolveMediaFieldsForEntries(
  entries: ContentEntry[],
  model: ContentModel
): Promise<ContentEntry[]> {
  return Promise.all(entries.map((entry) => resolveMediaFields(entry, model)));
}
