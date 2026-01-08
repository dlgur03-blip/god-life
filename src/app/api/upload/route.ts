import { put, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logError } from '@/lib/errors';

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Check Blob token configuration
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      await logError({
        level: 'error',
        message: 'BLOB_READ_WRITE_TOKEN not configured',
        userId: (session.user as { id?: string }).id,
        requestUrl: request.url,
        requestMethod: 'POST',
      });
      return NextResponse.json(
        { error: 'STORAGE_NOT_CONFIGURED', message: 'Storage service not configured' },
        { status: 503 }
      );
    }

    // 3. Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Invalid form data' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;
    const dayIndex = formData.get('dayIndex') as string | null;

    // 4. Validate required fields
    if (!file || !projectId || !dayIndex) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 5. Validate file type
    const fileType = file.type.toLowerCase();
    if (!VALID_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: 'INVALID_FILE_TYPE', message: 'Only JPEG, PNG, WebP, and HEIC images are allowed' },
        { status: 400 }
      );
    }

    // 6. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'FILE_TOO_LARGE', message: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // 7. Generate filename with timestamp
    const extension = fileType === 'image/heic' || fileType === 'image/heif' ? 'jpg' : fileType.split('/')[1];
    const filename = `success/${projectId}/${dayIndex}-${Date.now()}.${extension}`;

    // 8. Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    await logError({
      level: 'error',
      message: `Upload failed: ${errorMessage}`,
      stack: errorStack,
      requestUrl: request.url,
      requestMethod: 'POST',
    });

    return NextResponse.json(
      { error: 'UPLOAD_FAILED', message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      );
    }

    let body: { url?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    if (!body.url) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL belongs to our blob storage
    if (!body.url.includes('blob.vercel-storage.com')) {
      return NextResponse.json(
        { error: 'INVALID_URL', message: 'Invalid storage URL' },
        { status: 400 }
      );
    }

    await del(body.url);
    return NextResponse.json({ success: true });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await logError({
      level: 'error',
      message: `Delete failed: ${errorMessage}`,
      requestUrl: request.url,
      requestMethod: 'DELETE',
    });

    return NextResponse.json(
      { error: 'DELETE_FAILED', message: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
