import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Helper function to check admin access
async function checkAdminAccess() {
  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Server configuration error", status: 500 }
  }

  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
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

// GET /api/admin/orders - Get all orders
export async function GET(request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const adminCheck = await checkAdminAccess()
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const status = searchParams.get('status') || ''
  const paymentStatus = searchParams.get('payment_status') || ''
  const search = searchParams.get('search') || ''

  try {
    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        user:users!orders_user_id_fkey(full_name, email),
        order_items(
          *,
          product:products(name, image_url)
        )
      `)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus)
    }
    if (search) {
      // Search in user email or order ID
      query = query.or(`id.ilike.%${search}%,users.email.ilike.%${search}%`)
    }

    // Get total count
    const { count } = await query.select('*', { count: 'exact', head: true })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: orders, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/orders - Update order status
export async function PUT(request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const adminCheck = await checkAdminAccess()
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  try {
    const body = await request.json()
    const { id, status, payment_status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const updateData = {}
    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status
    if (notes !== undefined) updateData.notes = notes

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        user:users!orders_user_id_fkey(full_name, email),
        order_items(
          *,
          product:products(name, image_url)
        )
      `)
      .single()

    if (error) throw error

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
