import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const filename = params.filename.join('/');
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const imageUrl = `${backendUrl}/uploads/${filename}`;
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new NextResponse('Error fetching image', { status: 500 });
  }
} 