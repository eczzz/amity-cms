import { ContentEntry, ContentModel } from '../types';

/**
 * Media fields now store URLs directly, so no resolution is needed.
 * This function is kept for backwards compatibility but simply returns
 * the entry as-is.
 */
export async function resolveMediaFields(
  entry: ContentEntry,
  _model: ContentModel
): Promise<ContentEntry> {
  return entry;
}

/**
 * Resolves media fields for multiple entries (no-op, kept for compatibility)
 */
export async function resolveMediaFieldsForEntries(
  entries: ContentEntry[],
  _model: ContentModel
): Promise<ContentEntry[]> {
  return entries;
}
