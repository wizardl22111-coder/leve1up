'use client';

import AdminLayout from '@/components/AdminLayout';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminBanners() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">إدارة البانرات</h2>
            <p className="text-slate-400">إضافة وتعديل بانرات الموقع الرئيسي</p>
          </div>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            إضافة بانر جديد
          </motion.button>
        </div>

        {/* Banners Grid */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">البانرات الحالية</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample banner */}
            <div className="bg-slate-700/30 rounded-lg overflow-hidden">
              <div className="aspect-video bg-slate-600 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-slate-400" />
              </div>
              <div className="p-4">
                <h4 className="text-white font-medium mb-2">بانر العروض الخاصة</h4>
                <p className="text-slate-400 text-sm mb-3">عرض خاص على اشتراكات Netflix</p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    نشط
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
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
            هذه الصفحة قيد التطوير. سيتم إضافة وظائف إدارة البانرات قريباً.
          </p>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

