'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle,
  Crown,
  Edit3
} from 'lucide-react';
import Image from 'next/image';

interface ProfileData {
  name: string;
  email: string;
  image?: string | null;
  provider?: string;
  joinedAt?: string;
  verified?: boolean;
  membershipType?: string;
}

interface ProfileSummaryProps {
  className?: string;
  onEditClick?: () => void;
}

export default function ProfileSummary({ className = '', onEditClick }: ProfileSummaryProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الملف الشخصي');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('خطأ في جلب الملف الشخصي:', error);
      setError('حدث خطأ في جلب بيانات الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'غير محدد';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMembershipIcon = (type?: string) => {
    switch (type) {
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'pro':
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <User className="w-4 h-4 text-blue-400" />;
    }
  };

  const getMembershipText = (type?: string) => {
    switch (type) {
      case 'premium':
        return 'عضوية مميزة';
      case 'pro':
        return 'عضوية احترافية';
      default:
        return 'عضوية عادية';
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={`${className}`}>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-red-500/30 p-6">
          <div className="text-center text-red-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{error || 'لم يتم العثور على بيانات الملف الشخصي'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            الملف الشخصي
          </h3>
          
          {onEditClick && (
            <motion.button
              onClick={onEditClick}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="w-4 h-4" />
              تعديل
            </motion.button>
          )}
        </div>

        {/* Profile Content */}
        <div className="space-y-4">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full border-2 border-slate-600"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              
              {profile.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-1">
                {profile.name}
              </h4>
              <p className="text-slate-400 text-sm">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 mb-1">البريد الإلكتروني</p>
                <p className="text-sm text-white truncate">{profile.email}</p>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 mb-1">تاريخ الانضمام</p>
                <p className="text-sm text-white">{formatJoinDate(profile.joinedAt)}</p>
              </div>
            </div>

            {/* Membership Type */}
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              {getMembershipIcon(profile.membershipType)}
              <div>
                <p className="text-xs text-slate-500 mb-1">نوع العضوية</p>
                <p className="text-sm text-white">{getMembershipText(profile.membershipType)}</p>
              </div>
            </div>

            {/* Provider */}
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
              <Shield className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 mb-1">طريقة التسجيل</p>
                <p className="text-sm text-white capitalize">
                  {profile.provider === 'google' ? 'جوجل' : 
                   profile.provider === 'github' ? 'جيت هاب' : 
                   'البريد الإلكتروني'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
            {profile.verified && (
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
                <CheckCircle className="w-3 h-3" />
                محقق
              </div>
            )}
            
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">
              {getMembershipIcon(profile.membershipType)}
              {getMembershipText(profile.membershipType)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

