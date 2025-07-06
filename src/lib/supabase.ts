import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = 'https://vbzlmmvtjnngttqpiwtn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiemxtbXZ0am5uZ3R0cXBpd3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDAzODYsImV4cCI6MjA2NzI3NjM4Nn0.WYBwr0j1KdMbN6PZVybHw6GO3tyBj3rNo0jshSFezYo';

// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Create a safe Supabase client that won't throw errors
let supabaseClient = null;

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