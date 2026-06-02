import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Không có token xác thực' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return NextResponse.json({
        success: true,
        message: 'Token hợp lệ',
        user: decoded
      });
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 401 });
    }
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}
