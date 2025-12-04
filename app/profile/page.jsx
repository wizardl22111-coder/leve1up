'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: ''
  })

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      setLoading(true)
      
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      alert('Error loading profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          email: user.email,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setProfile({
        ...profile,
        full_name: formData.full_name,
        avatar_url: formData.avatar_url
      })
      
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      window.location.href = '/'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white">الملف الشخصي</h1>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          {!editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.full_name || 'غير محدد'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">الدور</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  profile?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {profile?.role === 'admin' ? 'مدير' : 'مستخدم'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ التسجيل</label>
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  تعديل الملف الشخصي
                </button>
                
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium text-center"
                  >
                    لوحة الإدارة
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">رابط الصورة الشخصية</label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          {/* Sign Out Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={signOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium"
            >
              تسجيل الخروج
            </button>
          </div>

          {/* Navigation Links */}
          <div className="pt-4">
            <Link
              href="/"
              className="block text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
