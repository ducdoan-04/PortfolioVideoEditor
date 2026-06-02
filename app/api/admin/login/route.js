import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS if available, otherwise fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập đầy đủ username và password' }, { status: 400 });
    }

    // Query user
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error);
      // Giả sử RLS đang chặn
      if (error.code === '42501') {
        return NextResponse.json({ success: false, message: 'Lỗi quyền truy cập Database (RLS). Vui lòng cấu hình SUPABASE_SERVICE_ROLE_KEY trong .env.local hoặc tắt RLS.' }, { status: 500 });
      }
      return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'Sai username hoặc password' }, { status: 401 });
    }

    const user = users[0];

    // Check if active
    if (!user.is_active) {
      return NextResponse.json({ success: false, message: 'Tài khoản đã bị khóa' }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Sai username hoặc password' }, { status: 401 });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from user object
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}
