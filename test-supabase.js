const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/messages?select=sender_name,content,created_at';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

fetch(url, {
  headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
}).then(r => r.json()).then(d => {
  console.log('Messages:', d);
}).catch(console.error);
