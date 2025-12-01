import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionGrid from '../components/SectionGrid';

// Mock ProductCard component
jest.mock('../components/ProductCard', () => {
  return function MockProductCard({ title, price }) {
    return <div data-testid="product-card">{title} - {price} ريال</div>;
  };
});

describe('SectionGrid', () => {
  const mockItems = [
    {
      id: 1,
      title: 'باقة أيقونات متحركة',
      excerpt: 'مجموعة شاملة من الأيقونات المتحركة',
      image: '/images/products/animated-icons-pack.png',
      price: 25,
      href: '/products/1',
      badge: 'الأكثر مبيعاً'
    },
    {
      id: 2,
      title: 'باقة التصميم',
      excerpt: 'أدوات وقوالب متقدمة',
      image: '/images/products/design-content-pack.png',
      price: 35,
      href: '/products/2',
      badge: 'جديد'
    }
  ];

  it('renders section with title and items', () => {
    render(<SectionGrid title="أدوات المونتاج" items={mockItems} />);
    
    // Check if title is rendered
    expect(screen.getByText('أدوات المونتاج')).toBeInTheDocument();
    
    // Check if items are rendered
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    
    // Check if specific items are rendered
    expect(screen.getByText('باقة أيقونات متحركة - 25 ريال')).toBeInTheDocument();
    expect(screen.getByText('باقة التصميم - 35 ريال')).toBeInTheDocument();
  });

  it('renders at least 1 item when items are provided', () => {
    render(<SectionGrid title="اختبار" items={mockItems} />);
    
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards.length).toBeGreaterThanOrEqual(1);
  });

  it('does not render when items array is empty', () => {
    const { container } = render(<SectionGrid title="اختبار" items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when items is null or undefined', () => {
    const { container: container1 } = render(<SectionGrid title="اختبار" items={null} />);
    expect(container1.firstChild).toBeNull();
    
    const { container: container2 } = render(<SectionGrid title="اختبار" items={undefined} />);
    expect(container2.firstChild).toBeNull();
  });

  it('renders section heading with proper level', () => {
    render(<SectionGrid title="أدوات المونتاج" items={mockItems} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('أدوات المونتاج');
  });

  it('renders "عرض المزيد" button when items length >= 4', () => {
    const manyItems = [
      ...mockItems,
      { id: 3, title: 'منتج 3', excerpt: 'وصف', image: '/test.png', price: 30, href: '/products/3' },
      { id: 4, title: 'منتج 4', excerpt: 'وصف', image: '/test.png', price: 40, href: '/products/4' }
    ];
    
    render(<SectionGrid title="اختبار" items={manyItems} />);
    
    expect(screen.getByText('عرض المزيد')).toBeInTheDocument();
  });

  it('does not render "عرض المزيد" button when items length < 4', () => {
    render(<SectionGrid title="اختبار" items={mockItems} />);
    
    expect(screen.queryByText('عرض المزيد')).not.toBeInTheDocument();
  });
});
