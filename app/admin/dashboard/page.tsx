'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل البيانات
    const loadDashboardData = async () => {
      try {
        // هنا يمكن استدعاء API endpoints للحصول على البيانات الفعلية
        // const response = await fetch('/api/admin/dashboard');
        // const data = await response.json();
        
        // بيانات تجريبية للعرض
        setTimeout(() => {
          setStats({
            totalProducts: 25,
            totalOrders: 142,
            totalUsers: 89,
            totalRevenue: 15420,
            monthlyGrowth: 12.5,
            recentOrders: [
              { id: '1', customer: 'أحمد محمد', amount: 299, status: 'paid', date: '2024-01-15' },
              { id: '2', customer: 'فاطمة علي', amount: 150, status: 'pending', date: '2024-01-14' },
              { id: '3', customer: 'محمد سالم', amount: 450, status: 'completed', date: '2024-01-13' }
            ],
            topProducts: [
              { name: 'Netflix Premium', sales: 45, revenue: 13500 },
              { name: 'Spotify Family', sales: 32, revenue: 4800 },
              { name: 'Adobe Creative', sales: 28, revenue: 8400 }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'إجمالي المنتجات',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-600 to-blue-700',
      change: '+5 هذا الشهر'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-green-600 to-green-700',
      change: '+23 هذا الأسبوع'
    },
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-purple-600 to-purple-700',
      change: '+12 مستخدم جديد'
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${stats.totalRevenue} ر.س`,
      icon: DollarSign,
      color: 'from-yellow-600 to-yellow-700',
      change: `+${stats.monthlyGrowth}% هذا الشهر`
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-slate-400">جاري تحميل البيانات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2">مرحباً بك في لوحة الإدارة</h2>
          <p className="text-primary-100">
            إدارة شاملة لموقع leve1up.store - تحكم في المنتجات والطلبات والمستخدمين
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-white mb-2">{card.value}</p>
                <p className="text-green-400 text-sm">{card.change}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">الطلبات الأخيرة</h3>
              <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                عرض الكل
              </button>
            </div>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{order.customer}</p>
                    <p className="text-slate-400 text-sm">{order.date}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">{order.amount} ر.س</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status === 'paid' ? 'مدفوع' : 
                       order.status === 'pending' ? 'معلق' : 'مكتمل'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">أفضل المنتجات</h3>
              <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                عرض التقرير
              </button>
            </div>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-slate-400 text-sm">{product.sales} مبيعة</p>
                    </div>
                  </div>
                  <p className="text-green-400 font-medium">{product.revenue} ر.س</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              className="flex items-center gap-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Package className="w-5 h-5" />
              <span>إضافة منتج جديد</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-3 p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-green-400 hover:text-green-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-5 h-5" />
              <span>مراجعة الطلبات</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-5 h-5" />
              <span>تقرير شهري</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

