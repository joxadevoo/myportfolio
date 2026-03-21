import { createClient } from '@supabase/supabase-js'

// These should be environment variables. For now, we will mock the connection if they are missing.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key'

// We create the client, but handle the mock fallback in our components if it's the placeholder URL
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co';
