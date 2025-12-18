import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from '../../middleware/response';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const app = new Hono();

// Configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Create subdirectories for organization
const SUBDIRS = ['avatars', 'products', 'vendors', 'documents', 'temp'];
SUBDIRS.forEach((subdir) => {
  const subdirPath = path.join(UPLOAD_DIR, subdir);
  if (!fs.existsSync(subdirPath)) {
    fs.mkdirSync(subdirPath, { recursive: true });
  }
});

// Helper function to generate unique filename
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${randomString}${ext}`;
}

// Helper function to get file category from path or type
function getFileCategory(type?: string): string {
  if (!type) return 'temp';

  if (type === 'avatar' || type === 'profile') return 'avatars';
  if (type === 'product') return 'products';
  if (type === 'vendor' || type === 'logo' || type === 'cover') return 'vendors';
  if (type === 'document' || type === 'kyc') return 'documents';

  return 'temp';
}

// POST /upload - Upload image/file to server
app.post('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    // Get form data
    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'temp';
    const allowedTypes = (formData.get('allowedTypes') as string) || 'image';

    if (!file) {
      return badRequestResponse(c, 'No file uploaded');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return badRequestResponse(c, `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Check file type
    const fileTypes = allowedTypes === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_FILE_TYPES;
    if (!fileTypes.includes(file.type)) {
      return badRequestResponse(c, `Invalid file type. Allowed types: ${fileTypes.join(', ')}`);
    }

    // Get category subdirectory
    const category = getFileCategory(type);
    const uploadPath = path.join(UPLOAD_DIR, category);

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const filepath = path.join(uploadPath, filename);

    // Save file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));

    // Generate URL (in production, use CDN or cloud storage URL)
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const fileUrl = `${baseUrl}/uploads/${category}/${filename}`;

    return successResponse(
      c,
      {
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        category,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      },
      'File uploaded successfully',
      201
    );
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse(c, 'Failed to upload file', 500);
  }
});

// POST /upload/multiple - Upload multiple files
app.post('/multiple', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    // Get form data
    const formData = await c.req.formData();
    const files = formData.getAll('files') as File[];
    const type = (formData.get('type') as string) || 'temp';
    const allowedTypes = (formData.get('allowedTypes') as string) || 'image';

    if (!files || files.length === 0) {
      return badRequestResponse(c, 'No files uploaded');
    }

    // Limit number of files
    const maxFiles = parseInt(process.env.MAX_FILES_PER_UPLOAD || '10');
    if (files.length > maxFiles) {
      return badRequestResponse(c, `Cannot upload more than ${maxFiles} files at once`);
    }

    const fileTypes = allowedTypes === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_FILE_TYPES;
    const category = getFileCategory(type);
    const uploadPath = path.join(UPLOAD_DIR, category);
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push({
            filename: file.name,
            error: `File size exceeds maximum allowed size`,
          });
          continue;
        }

        // Check file type
        if (!fileTypes.includes(file.type)) {
          errors.push({
            filename: file.name,
            error: `Invalid file type`,
          });
          continue;
        }

        // Generate unique filename
        const filename = generateUniqueFilename(file.name);
        const filepath = path.join(uploadPath, filename);

        // Save file
        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));

        // Generate URL
        const fileUrl = `${baseUrl}/uploads/${category}/${filename}`;

        uploadedFiles.push({
          filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          category,
          url: fileUrl,
        });
      } catch (error) {
        errors.push({
          filename: file.name,
          error: 'Failed to upload file',
        });
      }
    }

    return successResponse(
      c,
      {
        uploaded: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined,
        totalUploaded: uploadedFiles.length,
        totalErrors: errors.length,
      },
      `${uploadedFiles.length} file(s) uploaded successfully`,
      201
    );
  } catch (error) {
    console.error('Multiple upload error:', error);
    return errorResponse(c, 'Failed to upload files', 500);
  }
});

// DELETE /upload/:category/:filename - Delete uploaded file
app.delete('/:category/:filename', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const category = c.req.param('category');
    const filename = c.req.param('filename');

    // Validate category
    if (!SUBDIRS.includes(category)) {
      return badRequestResponse(c, 'Invalid category');
    }

    const filepath = path.join(UPLOAD_DIR, category, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return errorResponse(c, 'File not found', 404, 'Not Found');
    }

    // Delete file
    fs.unlinkSync(filepath);

    return successResponse(
      c,
      { filename, category },
      'File deleted successfully'
    );
  } catch (error) {
    console.error('Delete file error:', error);
    return errorResponse(c, 'Failed to delete file', 500);
  }
});

// GET /upload/presigned-url - Generate presigned URL for cloud storage (S3, CloudFlare R2, etc.)
app.get('/presigned-url', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const filename = c.req.query('filename');
    const type = c.req.query('type') || 'temp';

    if (!filename) {
      return badRequestResponse(c, 'Filename is required');
    }

    // In production, generate presigned URL for S3/R2
    // For now, return a mock response
    const uniqueFilename = generateUniqueFilename(filename);
    const category = getFileCategory(type);

    // Mock presigned URL (in production, use AWS SDK or CloudFlare R2 SDK)
    const presignedUrl = `https://your-bucket.s3.amazonaws.com/${category}/${uniqueFilename}?signature=mock`;

    return successResponse(c, {
      presignedUrl,
      filename: uniqueFilename,
      category,
      expiresIn: 3600, // 1 hour
      method: 'PUT',
    });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return errorResponse(c, 'Failed to generate presigned URL', 500);
  }
});

export default app;
