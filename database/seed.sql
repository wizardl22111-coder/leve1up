-- Seed data for Admin Dashboard

-- Insert sample admin user (you'll need to register this user first through Supabase Auth)
-- Then update their role to admin
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';

-- Sample products
INSERT INTO public.products (name, description, price, image_url, category, stock_quantity, is_active) VALUES
('Laptop Pro 15"', 'High-performance laptop with 16GB RAM and 512GB SSD', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 'Electronics', 50, true),
('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Electronics', 100, true),
('Coffee Maker', 'Automatic drip coffee maker with programmable timer', 89.99, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', 'Home & Kitchen', 25, true),
('Running Shoes', 'Comfortable running shoes with advanced cushioning', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Sports', 75, true),
('Smartphone', 'Latest smartphone with 128GB storage and dual camera', 699.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Electronics', 30, true),
('Desk Chair', 'Ergonomic office chair with lumbar support', 249.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', 'Furniture', 20, true),
('Water Bottle', 'Insulated stainless steel water bottle', 24.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 'Sports', 200, true),
('Backpack', 'Durable travel backpack with multiple compartments', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'Travel', 40, true);

-- Sample banners
INSERT INTO public.banners (title, description, image_url, link_url, is_active, display_order, start_date, end_date) VALUES
('Summer Sale', 'Get up to 50% off on selected items', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200', '/products?sale=true', true, 1, NOW(), NOW() + INTERVAL '30 days'),
('New Electronics Collection', 'Discover the latest tech gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200', '/products?category=electronics', true, 2, NOW(), NOW() + INTERVAL '60 days'),
('Free Shipping', 'Free shipping on orders over $100', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200', '/shipping-info', true, 3, NOW(), NOW() + INTERVAL '90 days');

-- Sample orders (these would typically be created by users)
-- Note: You'll need actual user IDs from your auth.users table
-- INSERT INTO public.orders (user_id, status, total_amount, shipping_address, payment_method, payment_status) VALUES
-- ('user-uuid-here', 'delivered', 1589.98, '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001"}', 'credit_card', 'paid');

-- Sample order items (corresponding to the above order)
-- INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
-- ('order-uuid-here', (SELECT id FROM public.products WHERE name = 'Laptop Pro 15"'), 1, 1299.99, 1299.99),
-- ('order-uuid-here', (SELECT id FROM public.products WHERE name = 'Wireless Headphones'), 1, 299.99, 299.99);

-- Create a function to generate sample orders for testing
CREATE OR REPLACE FUNCTION generate_sample_orders(user_id UUID)
RETURNS VOID AS $$
DECLARE
  order_id UUID;
  product_record RECORD;
BEGIN
  -- Create a sample order
  INSERT INTO public.orders (user_id, status, total_amount, shipping_address, payment_method, payment_status, notes)
  VALUES (
    user_id,
    'delivered',
    1589.98,
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "USA"}',
    'credit_card',
    'paid',
    'Sample order for testing'
  ) RETURNING id INTO order_id;

  -- Add order items
  INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, total_price)
  SELECT 
    order_id,
    id,
    1,
    price,
    price
  FROM public.products 
  WHERE name IN ('Laptop Pro 15"', 'Wireless Headphones')
  LIMIT 2;

  -- Create another order
  INSERT INTO public.orders (user_id, status, total_amount, shipping_address, payment_method, payment_status, notes)
  VALUES (
    user_id,
    'processing',
    219.98,
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    'paypal',
    'paid',
    'Another sample order'
  ) RETURNING id INTO order_id;

  -- Add order items for second order
  INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, total_price)
  SELECT 
    order_id,
    id,
    CASE WHEN name = 'Running Shoes' THEN 1 ELSE 2 END,
    price,
    CASE WHEN name = 'Running Shoes' THEN price ELSE price * 2 END
  FROM public.products 
  WHERE name IN ('Running Shoes', 'Water Bottle')
  LIMIT 2;
END;
$$ LANGUAGE plpgsql;

-- Usage: Call this function with a real user ID after creating a user
-- SELECT generate_sample_orders('your-user-uuid-here');
