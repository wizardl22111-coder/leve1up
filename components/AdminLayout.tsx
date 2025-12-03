'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  Bell,
  Search
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    name: 'لوحة التحكم',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'المنتجات',
    href: '/admin/products',
    icon: Package
  },
  {
    name: 'الطلبات',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    name: 'المستخدمون',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'البانرات',
    href: '/admin/banners',
    icon: ImageIcon
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const goToMainSite = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 right-0 h-full w-64 bg-slate-800/95 backdrop-blur-lg border-l border-slate-700/50 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">لوحة الإدارة</h2>
                  <p className="text-sm text-slate-400">leve1up.store</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02, x: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.a>
              );
            })}
          </nav>

          {/* User info & actions */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="صورة المدير"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name || 'مدير النظام'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <motion.button
                onClick={goToMainSite}
                className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">الموقع الرئيسي</span>
              </motion.button>
              
              <motion.button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">تسجيل الخروج</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="lg:mr-64">
        {/* Top bar */}
        <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {sidebarItems.find(item => item.href === pathname)?.name || 'لوحة الإدارة'}
                </h1>
                <p className="text-sm text-slate-400">
                  إدارة وتحكم في موقع leve1up.store
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>

              {/* Notifications */}
              <motion.button
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

