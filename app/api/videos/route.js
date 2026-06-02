export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadFileToCloudinary } from '@/lib/upload';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const all = searchParams.get('all');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let query = supabase.from('videos').select('*');
    if (category) query = query.eq('category', category);
    if (all !== 'true') query = query.limit(limit);
    query = query.order('updated_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data: { videos: data } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const dataObj = {};
    for (const [key, value] of formData.entries()) {
      dataObj[key] = value;
    }

    let thumbnailUrl = null;
    if (dataObj.thumbnail && dataObj.thumbnail instanceof Blob) {
      const uploadData = await uploadFileToCloudinary(dataObj.thumbnail);
      thumbnailUrl = uploadData.url;
    }

    const { data, error } = await supabase.from('videos').insert({
      title: dataObj.title,
      description: dataObj.description,
      video_id: dataObj.video_id,
      category: dataObj.category,
      software: dataObj.software,
      thumbnail_url: thumbnailUrl
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { error } = await supabase.from('videos').delete().neq('id', 0); // Delete all hack
    if (error) throw error;
    return NextResponse.json({ success: true, deletedCount: 999 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

