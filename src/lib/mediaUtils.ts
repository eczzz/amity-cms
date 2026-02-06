import type { MediaValue } from '../types';

/**
 * Normalize a media field value to the canonical MediaValue object.
 * Handles backward compatibility:
 *   - null/undefined/''  → null (no media selected)
 *   - plain string       → { url: string, photographer: '', route: '' }
 *   - object             → fill in missing keys with defaults
 */
export function normalizeMediaValue(value: unknown): MediaValue | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'string') {
    return { url: value, photographer: '', route: '' };
  }
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    return {
      url: (obj.url as string) || '',
      photographer: (obj.photographer as string) || '',
      route: (obj.route as string) || '',
    };
  }
  return null;
}

/**
 * Extract just the URL from a media value (string or object).
 */
export function getMediaUrl(value: unknown): string | null {
  const normalized = normalizeMediaValue(value);
  return normalized?.url || null;
}
