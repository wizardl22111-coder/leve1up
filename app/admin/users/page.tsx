'use client';

import AdminLayout from '@/components/AdminLayout';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Ban, Eye } from 'lucide-react';

export default function AdminUsers() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">إدارة المستخدمين</h2>
            <p className="text-slate-400">مراجعة وإدارة حسابات المستخدمين</p>
          </div>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="w-4 h-4" />
            إضافة مستخدم
          </motion.button>
        </div>

        {/* Users Table */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">قائمة المستخدمين</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">المستخدم</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">الدور</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">تاريخ التسجيل</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">الحالة</th>
                    <th className="text-center py-3 px-4 text-slate-300 font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample data */}
                  <tr className="border-b border-slate-700/30 hover:bg-slate-700/20">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">أحمد محمد</p>
                          <p className="text-slate-400 text-sm">عضو منذ شهر</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">ahmed@example.com</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        مستخدم
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">2024-01-01</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        نشط
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors">
                          <Shield className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-yellow-400 font-semibold mb-2">قيد التطوير</h3>
          <p className="text-slate-300">
            هذه الصفحة قيد التطوير. سيتم إضافة وظائف إدارة المستخدمين قريباً.
          </p>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

