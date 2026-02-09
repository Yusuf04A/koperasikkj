import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// --- TAMBAHKAN INI SEMENTARA ---
console.log('Cek URL Supabase:', supabaseUrl)
console.log('Cek Key Supabase:', supabaseAnonKey ? 'Ada (Terbaca)' : 'KOSONG (Error!)')
// -------------------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey)