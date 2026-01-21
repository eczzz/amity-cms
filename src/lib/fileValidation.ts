// Magic bytes for file type validation
const MAGIC_BYTES: Record<string, number[]> = {
  png: [0x89, 0x50, 0x4e, 0x47],
  jpg: [0xff, 0xd8, 0xff],
  jpeg: [0xff, 0xd8, 0xff],
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  gif: [0x47, 0x49, 0x46],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF
};

// Allowed MIME types for upload
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/csv',
  'text/plain',
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Check file magic bytes to validate actual file type
 */
async function validateMagicBytes(file: File): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 4).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check for SVG (text-based)
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      const text = await file.slice(0, 100).text();
      return text.includes('<svg') || text.includes('<?xml');
    }

    // Check for CSV or plain text
    if (file.type === 'text/csv' || file.type === 'text/plain') {
      return true; // Text files are valid if they pass MIME check
    }

    // Check image and PDF magic bytes
    for (const [type, magicBytes] of Object.entries(MAGIC_BYTES)) {
      if (
        file.type.includes(type) ||
        file.name.toLowerCase().endsWith(`.${type}`)
      ) {
        // Compare bytes
        if (magicBytes.every((byte, index) => bytes[index] === byte)) {
          return true;
        }
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Validate file before upload
 */
export async function validateFile(file: File): Promise<ValidationResult> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: PNG, JPG, GIF, WebP, SVG, PDF, CSV, TXT`,
    };
  }

  // Validate magic bytes
  const magicBytesValid = await validateMagicBytes(file);
  if (!magicBytesValid) {
    return {
      valid: false,
      error: 'File content does not match the file type. Please check the file and try again.',
    };
  }

  return { valid: true };
}

/**
 * Get file category based on MIME type
 */
export function getFileCategory(
  mimeType: string
): 'image' | 'document' | 'spreadsheet' | 'other' {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType === 'application/pdf' || mimeType === 'text/plain') {
    return 'document';
  }
  if (mimeType === 'text/csv') {
    return 'spreadsheet';
  }
  return 'other';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate filename with timestamp to avoid collisions
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const ext = originalFilename.split('.').pop() || '';
  const nameWithoutExt = originalFilename.substring(
    0,
    originalFilename.lastIndexOf('.')
  );
  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-');
  return `${sanitized}-${timestamp}.${ext}`;
}
