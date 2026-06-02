const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'app', 'api');

const template = `import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { data, error } = await supabase.from('TABLE_NAME').select('*').order('id', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('TABLE_NAME').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
`;

const idTemplate = `import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json().catch(() => null);
    
    let dataObj = body;
    if (!body) {
      // Might be formData (like videos update)
      const formData = await request.formData();
      dataObj = {};
      for (const [key, value] of formData.entries()) {
        if (key !== 'thumbnail') dataObj[key] = value;
      }
      
      let thumbnailUrl = null;
      if (formData.get('thumbnail') && formData.get('thumbnail') instanceof Blob) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.get('thumbnail'));
        const uploadRes = await fetch(new URL('/api/upload', request.url), {
          method: 'POST',
          body: uploadFormData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          dataObj.thumbnail_url = uploadData.data.url;
        }
      }
    }

    const { data, error } = await supabase.from('TABLE_NAME').update(dataObj).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const { error } = await supabase.from('TABLE_NAME').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
`;

function createRoute(tableName) {
  const dir = path.join(apiDir, tableName);
  const idDir = path.join(dir, '[id]');
  fs.mkdirSync(idDir, { recursive: true });
  
  if (tableName !== 'videos') {
    fs.writeFileSync(path.join(dir, 'route.js'), template.replace(/TABLE_NAME/g, tableName));
  }
  fs.writeFileSync(path.join(idDir, 'route.js'), idTemplate.replace(/TABLE_NAME/g, tableName));
}

createRoute('categories');
createRoute('users');
createRoute('videos');

console.log('Routes created!');
