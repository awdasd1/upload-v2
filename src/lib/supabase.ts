import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jfmsjuqzljiciblgmcpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmbXNqdXF6bGppY2libGdtY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODM5NDYsImV4cCI6MjA2NTI1OTk0Nn0.dxiEplcj4-nRBsD8rKO3l5OG3Xvv6FSrt_SfTrcoVxM'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error)
  } else {
    console.log('Supabase connected successfully')
  }
})

export interface FileUpload {
  id: string
  user_id: string
  file_name: string
  file_size: number
  file_type: string
  upload_status: 'pending' | 'processing' | 'completed' | 'failed'
  webhook_response?: any
  created_at: string
  updated_at: string
}
