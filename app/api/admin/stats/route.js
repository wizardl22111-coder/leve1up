import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Helper function to check admin access
async function checkAdminAccess() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!user || user.role !== 'admin') {
    return { error: 'Forbidden', status: 403 }
  }

  return { user: session.user }
}

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request) {
  const adminCheck = await checkAdminAccess()
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  try {
    // Get total users count
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get total products count
    const { count: totalProducts } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Get total orders count
    const { count: totalOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Get total revenue
    const { data: revenueData } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0

    // Get recent orders
    const { data: recentOrders } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        user:users!orders_user_id_fkey(full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get orders by status
    const { data: ordersByStatus } = await supabaseAdmin
      .from('orders')
      .select('status')

    const statusCounts = ordersByStatus?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {}) || {}

    // Get monthly revenue (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: monthlyRevenueData } = await supabaseAdmin
      .from('orders')
      .select('total_amount, created_at')
      .eq('payment_status', 'paid')
      .gte('created_at', sixMonthsAgo.toISOString())

    const monthlyRevenue = {}
    monthlyRevenueData?.forEach(order => {
      const month = new Date(order.created_at).toISOString().slice(0, 7) // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + parseFloat(order.total_amount)
    })

    // Get top selling products
    const { data: topProducts } = await supabaseAdmin
      .from('order_items')
      .select(`
        product_id,
        quantity,
        product:products(name, image_url)
      `)

    const productSales = {}
    topProducts?.forEach(item => {
      if (item.product) {
        const key = item.product_id
        if (!productSales[key]) {
          productSales[key] = {
            product: item.product,
            totalQuantity: 0
          }
        }
        productSales[key].totalQuantity += item.quantity
      }
    })

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5)

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2)
      },
      recentOrders,
      ordersByStatus: statusCounts,
      monthlyRevenue,
      topSellingProducts
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
