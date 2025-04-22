import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as Blob;

  const uploadRes = await fetch('https://file.io/?expires=1d', {
    method: 'POST',
    body: (() => {
      const fd = new FormData();
      fd.append('file', file, 'struk.pdf');
      return fd;
    })(),
  });

  const result = await uploadRes.json();
  if (!result.success) {
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 });
  }

  return NextResponse.json({ url: result.link });
}
