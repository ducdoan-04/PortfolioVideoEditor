require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
console.log("Using URL:", supabaseUrl);
console.log("Using Key length:", supabaseKey ? supabaseKey.length : 0);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Querying username: admin");
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', 'admin');

  console.log("Error:", error);
  console.log("Users:", users);

  if (users && users.length > 0) {
    const isMatch = await bcrypt.compare('admin', users[0].password);
    console.log("Password match:", isMatch);
  }
}
test();
