import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a safe Supabase client that won't throw errors
let supabaseClient = null

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: 'implicit'
      }
    })
  }
} catch (error) {
  console.warn('Supabase client initialization failed:', error)
  supabaseClient = null
}

export const supabase = supabaseClient

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
}