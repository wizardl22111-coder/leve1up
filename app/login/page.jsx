'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      if (!supabase) return
      
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        window.location.href = '/profile'
      }
    }
    
    checkUser()
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        
        if (data.user) {
          alert('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتفعيل.')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        if (data.user) {
          window.location.href = '/profile'
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('خطأ: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? 'أو' : 'أو'}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? 'تسجيل الدخول إلى حساب موجود' : 'إنشاء حساب جديد'}
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'جاري المعالجة...' : (isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول')}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
