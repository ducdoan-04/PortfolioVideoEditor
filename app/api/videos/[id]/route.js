import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadFileToCloudinary } from '@/lib/upload';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const contentType = request.headers.get('content-type') || '';
    let dataObj = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (key !== 'thumbnail') dataObj[key] = value;
      }
      
      if (formData.get('thumbnail') && formData.get('thumbnail') instanceof Blob) {
        const uploadData = await uploadFileToCloudinary(formData.get('thumbnail'));
        dataObj.thumbnail_url = uploadData.url;
      }
    } else {
      dataObj = await request.json();
    }

    const { data, error } = await supabase.from('videos').update(dataObj).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const fs = require('fs');
    fs.appendFileSync('api_error.log', new Date().toISOString() + ' - PUT videos/[id] ERROR: ' + error.message + '\\n' + error.stack + '\\n');
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
