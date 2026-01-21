import { supabase } from './supabase';
import { generateUniqueFilename } from './fileValidation';

export interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
  filename: string;
}

/**
 * Request a presigned URL from the backend API
 */
export async function requestPresignedUrl(
  filename: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const uniqueFilename = generateUniqueFilename(filename);

  const response = await fetch('/api/generate-presigned-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
    body: JSON.stringify({
      filename: uniqueFilename,
      contentType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get presigned URL');
  }

  return response.json();
}

/**
 * Upload file directly to R2 using presigned URL
 */
export async function uploadToR2(
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}

/**
 * Save media metadata to Supabase
 */
export async function saveMediaMetadata(
  filename: string,
  url: string,
  mimeType: string,
  size: number,
  uploadedBy: string
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('media')
    .insert({
      filename,
      url,
      mime_type: mimeType,
      size,
      uploaded_by: uploadedBy,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Delete media file from Supabase and R2
 */
export async function deleteMedia(id: string): Promise<void> {
  const { error: fetchError } = await supabase
    .from('media')
    .select('filename')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Delete from database
  const { error: deleteError } = await supabase.from('media').delete().eq('id', id);

  if (deleteError) {
    throw deleteError;
  }

  // Note: Actual file deletion from R2 would require backend endpoint
  // For now, we just mark it as deleted in the database
}

/**
 * Get the R2 public URL for a file
 */
export function getPublicUrl(filename: string): string {
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || 'https://ketsuronmedia.com';
  return `${baseUrl}/media/${filename}`;
}
