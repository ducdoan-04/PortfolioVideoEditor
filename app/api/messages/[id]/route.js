import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();

    const { data, error } = await supabase
      .from('project_briefs')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PUT /api/messages/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi khi cập nhật' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const { error } = await supabase.from('project_briefs').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Đã xóa yêu cầu dự án' });
  } catch (error) {
    console.error('DELETE /api/messages/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi khi xóa' },
      { status: 500 }
    );
  }
}
