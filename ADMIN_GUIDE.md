# Admin Dashboard - Complete Setup Guide

This guide will help you set up a complete admin dashboard with Supabase backend, including database setup, authentication, and all admin features.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth Configuration (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 3. Database Setup

#### Step 1: Run the Schema
Copy and paste the contents of `database/schema.sql` into your Supabase SQL Editor and execute it. This will create:

- All necessary tables (users, products, orders, order_items, banners, audit_logs)
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic timestamps
- Functions for user management and audit logging

#### Step 2: Add Sample Data
Copy and paste the contents of `database/seed.sql` into your Supabase SQL Editor and execute it. This will add:

- Sample products with images
- Sample banners
- A function to generate sample orders

### 4. Create Your First Admin User

1. **Register a user** through your app's normal registration process (or Supabase Auth)
2. **Update their role** to admin in the database:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
```

3. **Generate sample orders** for testing (optional):

```sql
-- Replace 'your-user-uuid' with the actual user ID from auth.users
SELECT generate_sample_orders('your-user-uuid');
```

## 📁 Project Structure

```
├── lib/
│   └── supabaseClient.js          # Supabase client configuration
├── database/
│   ├── schema.sql                 # Database schema and RLS policies
│   └── seed.sql                   # Sample data and helper functions
├── app/
│   ├── api/admin/                 # Protected admin API routes
│   │   ├── products/              # Product CRUD operations
│   │   ├── orders/                # Order management
│   │   ├── users/                 # User management
│   │   └── stats/                 # Dashboard statistics
│   └── admin/                     # Admin dashboard pages
│       ├── page.jsx               # Dashboard home
│       ├── products/page.jsx      # Products management
│       ├── orders/page.jsx        # Orders management
│       ├── users/page.jsx         # Users management
│       └── banners/page.jsx       # Banners management
├── components/
│   └── AdminLayout.jsx            # Admin layout component
└── middleware.ts                  # Route protection
```

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that:
- Allow users to view/edit their own data
- Allow admins to view/edit all data
- Protect sensitive operations

### API Route Protection
All admin API routes check for:
- Valid user session
- Admin role verification
- Proper authentication headers

### Middleware Protection
The middleware protects admin routes by:
- Checking user authentication
- Verifying admin role
- Redirecting unauthorized users

## 🎯 Features

### Dashboard
- **Overview Statistics**: Total users, products, orders, revenue
- **Recent Orders**: Latest 5 orders with customer info
- **Orders by Status**: Distribution of order statuses
- **Top Selling Products**: Best performing products

### Products Management
- **CRUD Operations**: Create, read, update, delete products
- **Advanced Filtering**: Search, category, status filters
- **Pagination**: Efficient data loading
- **Image Support**: Product images via URLs
- **Stock Management**: Track inventory levels

### Orders Management
- **Order Tracking**: View all orders with details
- **Status Updates**: Change order and payment status
- **Customer Information**: View customer details
- **Order Items**: See all products in each order
- **Filtering**: Filter by status, payment status, search

### Users Management
- **User Overview**: View all registered users
- **Role Management**: Promote users to admin
- **User Statistics**: Order counts per user
- **Search & Filter**: Find users quickly

### Banners Management
- **Promotional Banners**: Create marketing banners
- **Scheduling**: Set start and end dates
- **Display Order**: Control banner priority
- **Status Control**: Activate/deactivate banners

## 🛠 API Endpoints

### Products
- `GET /api/admin/products` - List products with pagination and filters
- `POST /api/admin/products` - Create new product
- `GET /api/admin/products/[id]` - Get single product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Orders
- `GET /api/admin/orders` - List orders with pagination and filters
- `PUT /api/admin/orders` - Update order status

### Users
- `GET /api/admin/users` - List users with pagination and filters
- `PUT /api/admin/users` - Update user role

### Statistics
- `GET /api/admin/stats` - Get dashboard statistics

## 🎨 Customization

### Styling
The admin dashboard uses Tailwind CSS for styling. You can customize:
- Colors by modifying Tailwind classes
- Layout by editing AdminLayout component
- Components by updating individual page files

### Adding New Features
To add new admin features:

1. **Create API Route**: Add new route in `app/api/admin/`
2. **Add Database Table**: Update schema.sql if needed
3. **Create Admin Page**: Add new page in `app/admin/`
4. **Update Navigation**: Modify AdminLayout navigation

### Database Schema Changes
When modifying the database:

1. **Update schema.sql**: Add your changes
2. **Create Migration**: Run SQL in Supabase
3. **Update RLS Policies**: Ensure proper security
4. **Test Thoroughly**: Verify all permissions work

## 🔧 Troubleshooting

### Common Issues

**1. "Unauthorized" errors**
- Check if user has admin role in database
- Verify Supabase environment variables
- Ensure middleware is working correctly

**2. Database connection issues**
- Verify SUPABASE_URL and keys are correct
- Check if RLS policies are properly configured
- Ensure service role key has proper permissions

**3. Build errors**
- Install all required dependencies
- Check for TypeScript errors
- Verify all imports are correct

**4. Authentication issues**
- Ensure user is properly authenticated
- Check session management
- Verify auth helpers are configured

### Performance Optimization

**Database**
- Indexes are already created for common queries
- Use pagination for large datasets
- Consider adding more specific indexes for custom queries

**Frontend**
- Images are loaded lazily
- API calls are optimized with proper caching
- Pagination reduces data transfer

## 📊 Database Schema Details

### Tables Overview

**users**: Extends Supabase auth.users with additional fields
- Links to auth.users via foreign key
- Stores role (user/admin)
- Profile information (name, avatar)

**products**: Product catalog
- Full product information
- Stock management
- Category organization
- Active/inactive status

**orders**: Customer orders
- Order status tracking
- Payment status
- Shipping information (JSONB)
- Customer relationship

**order_items**: Individual items in orders
- Product references
- Quantity and pricing
- Calculated totals

**banners**: Promotional content
- Image and text content
- Scheduling capabilities
- Display order control

**audit_logs**: Activity tracking
- User actions logging
- Change tracking
- Security monitoring

### Relationships
- users ← orders (one-to-many)
- orders ← order_items (one-to-many)
- products ← order_items (one-to-many)
- users ← products (created_by)
- users ← banners (created_by)
- users ← audit_logs (user_id)

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
```

## 📈 Monitoring & Analytics

### Built-in Analytics
- User registration trends
- Order volume and revenue
- Product performance
- Admin activity logs

### Custom Analytics
You can extend the stats API to include:
- Conversion rates
- Customer lifetime value
- Inventory turnover
- Geographic distribution

## 🔄 Maintenance

### Regular Tasks
- Monitor database performance
- Review audit logs
- Update product information
- Manage user roles
- Archive old orders

### Backup Strategy
- Supabase provides automatic backups
- Consider additional backup for critical data
- Test restore procedures regularly

## 📞 Support

For issues or questions:
1. Check this documentation first
2. Review Supabase documentation
3. Check Next.js documentation
4. Search for similar issues online

## 🎉 Conclusion

You now have a fully functional admin dashboard with:
- ✅ Secure authentication and authorization
- ✅ Complete CRUD operations for all entities
- ✅ Real-time statistics and monitoring
- ✅ Responsive design for all devices
- ✅ Production-ready security features
- ✅ Scalable architecture

The system is ready for production use and can be extended with additional features as needed!
