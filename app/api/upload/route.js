import { NextResponse } from 'next/server';
import { uploadFileToCloudinary } from '@/lib/upload';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'Không có file nào được upload' }, { status: 400 });
    }

    const resultData = await uploadFileToCloudinary(file);

    return NextResponse.json({
      success: true,
      message: 'Upload file thành công',
      data: resultData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi upload file: ' + error.message }, { status: 500 });
  }
}
