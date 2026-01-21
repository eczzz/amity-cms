import { Handler } from '@netlify/functions';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Allowed MIME types
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

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { filename, contentType } = body;

    // Validate inputs
    if (!filename || !contentType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing filename or contentType' }),
      };
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'File type not allowed' }),
      };
    }

    // Validate filename (basic security)
    if (filename.includes('..') || filename.includes('/')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid filename' }),
      };
    }

    // Create presigned URL for PUT operation
    const command = new PutObjectCommand({
      Bucket: process.env.VITE_R2_BUCKET_NAME || '',
      Key: `media/${filename}`,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 15 * 60, // 15 minutes
    });

    // Construct public URL
    const publicUrl = `${process.env.VITE_R2_PUBLIC_URL}/media/${filename}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        presignedUrl,
        publicUrl,
        filename,
      }),
    };
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate presigned URL',
        details: error.message,
      }),
    };
  }
};

export { handler };
