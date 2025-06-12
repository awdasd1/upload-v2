import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Initializing Supabase connection...')
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      } else {
        console.log('Initial session:', session)
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting to sign up user:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      console.log('Sign up response:', { data, error })
      
      if (error) {
        console.error('Sign up error:', error)
        throw error
      }
      
      if (data.user && !data.session) {
        toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب')
      } else if (data.session) {
        toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح!')
      }
      
    } catch (error: any) {
      console.error('Sign up error:', error)
      toast.error(error.message || 'حدث خطأ أثناء إنشاء الحساب')
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in user:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('Sign in response:', { data, error })
      
      if (error) {
        console.error('Sign in error:', error)
        throw error
      }
      
      toast.success('تم تسجيل الدخول بنجاح!')
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول')
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log('Attempting to sign out')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
      
      toast.success('تم تسجيل الخروج بنجاح!')
    } catch (error: any) {
      console.error('Sign out error:', error)
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الخروج')
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
