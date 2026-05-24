
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: messagesData, error: messagesErr } = await supabase.from('messages').select('*').limit(5);
  const { data: guestsData, error: guestsErr } = await supabase.from('guests').select('message, first_name').not('message', 'is', null).neq('message', '').limit(5);
  console.log('--- MESSAGES TABLE ---');
  console.log(JSON.stringify(messagesData, null, 2));
  console.error(messagesErr);
  
  console.log('--- GUESTS TABLE ---');
  console.log(JSON.stringify(guestsData, null, 2));
  console.error(guestsErr);
}
run();

