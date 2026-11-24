const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    realtime: { transport: ws }
  }
);

async function resetPasswords() {
  // Danh sách user và password mới (plain text)
  const users = [
    { username: 'admin',     newPassword: 'Ducdoan2004.' },
    { username: 'ducdoan04', newPassword: 'Ducdoan2004.' },
    { username: 'user1',     newPassword: 'Ducdoan2004.' },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.newPassword, 12);
    const { error } = await supabase
      .from('users')
      .update({ password: hashed })
      .eq('username', u.username);

    if (error) {
      console.error(`❌ Lỗi khi update ${u.username}:`, error.message);
    } else {
      console.log(`✅ Đã hash password cho: ${u.username}  =>  ${hashed}`);
    }
  }

  console.log('\nHoàn tất! Bây giờ hãy thử đăng nhập lại.');
  process.exit(0);
}

resetPasswords();
