import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: guests, error } = await supabase.from('guests').select('*');
  if (error) {
    console.error('Error fetching guests:', error);
    return;
  }
  console.log(JSON.stringify(guests, null, 2));
}
run();
