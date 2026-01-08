import { put, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // 1. Verify authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get file from form data
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;
  const dayIndex = formData.get('dayIndex') as string;

  if (!file || !projectId || !dayIndex) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // 3. Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  // 4. Upload to Vercel Blob
  const filename = `success/${projectId}/${dayIndex}-${Date.now()}.${file.type.split('/')[1]}`;
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  await del(url);
  return NextResponse.json({ success: true });
}
