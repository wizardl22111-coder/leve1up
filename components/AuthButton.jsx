'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { User, LogIn, LogOut } from 'lucide-react'

export default function AuthButton() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null)
          getProfile(session?.user?.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const getUser = async () => {
    try {
      if (!supabase) {
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await getProfile(user.id)
      }
    } catch (error) {
      console.error('Error getting user:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProfile = async (userId) => {
    try {
      if (!supabase || !userId) return

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error getting profile:', error)
    }
  }

  const signOut = async () => {
    try {
      if (!supabase) return
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="w-8 h-8 border-2 border-primary-300 border-t-transparent rounded-full animate-spin"></div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-2 px-3 py-2 bg-primary-300/20 hover:bg-primary-300/30 text-primary-300 rounded-xl transition-all duration-200 font-semibold text-sm border border-primary-300/30"
        >
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.full_name || 'User'} 
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="hidden lg:inline">
            {profile?.full_name?.split(' ')[0] || 'الملف الشخصي'}
          </span>
        </Link>
        
        {profile?.role === 'admin' && (
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-all duration-200 font-semibold text-sm border border-purple-300/30"
          >
            <span className="hidden lg:inline">الإدارة</span>
            <span className="lg:hidden">👑</span>
          </Link>
        )}
        
        <button
          onClick={signOut}
          className="p-2 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors"
          aria-label="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-all duration-200 font-semibold text-sm border border-blue-300/30"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden lg:inline">دخول</span>
      </Link>
      <Link
        href="/login"
        className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-all duration-200 font-semibold text-sm border border-purple-300/30"
      >
        <User className="w-4 h-4" />
        <span className="hidden lg:inline">تسجيل</span>
      </Link>
    </div>
  )
}
