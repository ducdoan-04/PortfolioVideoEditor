import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('project_briefs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Handle case where table hasn't been created in Supabase yet
      if (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        (error.message && error.message.includes('project_briefs'))
      ) {
        return NextResponse.json({
          success: true,
          data: [],
          tableMissing: true,
          message: 'Bảng project_briefs chưa được khởi tạo trên Supabase.'
        });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, contact_info, project_type, details } = body;

    if (!name || !details) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập đầy đủ Tên và Chi tiết dự án.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('project_briefs')
      .insert([
        {
          name: name.trim(),
          contact_info: (contact_info || '').trim(),
          project_type: (project_type || '').trim(),
          details: details.trim(),
          status: 'new'
        }
      ])
      .select()
      .single();

    if (error) {
      if (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        (error.message && error.message.includes('project_briefs'))
      ) {
        return NextResponse.json(
          {
            success: false,
            tableMissing: true,
            message: 'Bảng project_briefs chưa được tạo trên Supabase.'
          },
          { status: 503 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Đã gửi yêu cầu dự án thành công!',
      data
    });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi kết nối server' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
