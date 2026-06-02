export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: true, data: null });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // 1. Check Authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    // 2. Process Request Data
    let updateData = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      updateData = {
        name: formData.get('name'),
        greeting: formData.get('greeting'),
        description: formData.get('description'),
        video_tools: formData.get('video_tools'),
        photo_tools: formData.get('photo_tools'),
        experience_years: parseInt(formData.get('experience_years') || 0),
        satisfaction_rate: parseInt(formData.get('satisfaction_rate') || 0),
        toeic_score: parseInt(formData.get('toeic_score') || 0),
        facebook_url: formData.get('facebook_url'),
        instagram_url: formData.get('instagram_url'),
        zalo_url: formData.get('zalo_url'),
        avatar_url: formData.get('avatar_url')
      };
    } else {
      updateData = await request.json();
    }

    updateData.updated_at = new Date().toISOString();

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from('profile')
      .update(updateData)
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
