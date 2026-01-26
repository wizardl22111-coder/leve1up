import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionsReplace from '@/components/SectionsReplace';
import { AppProvider } from '@/contexts/AppContext';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  );
});

// Mock ScrollReveal component
jest.mock('@/components/ScrollReveal', () => {
  return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

// Mock ToastContainer
jest.mock('@/components/ToastContainer', () => ({
  showToast: jest.fn(),
}));

// Mock currency utilities
jest.mock('@/lib/currency', () => ({
  calculatePrice: jest.fn(() => ({
    finalPrice: 100,
    originalPrice: 150,
    discountedPrice: 100,
  })),
  formatPrice: jest.fn((price) => `${price} ر.س`),
}));

const MockAppProvider = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>
    {children}
  </AppProvider>
);

describe('SectionsReplace', () => {
  it('renders editing tools section title', () => {
    render(
      <MockAppProvider>
        <SectionsReplace sections={['editingTools']} />
      </MockAppProvider>
    );

    expect(screen.getByText('أدوات المونتاج الاحترافية')).toBeInTheDocument();
  });

  it('renders subscriptions section title', () => {
    render(
      <MockAppProvider>
        <SectionsReplace sections={['subscriptions']} />
      </MockAppProvider>
    );

    expect(screen.getByText('الاشتراكات المميزة')).toBeInTheDocument();
  });

  it('renders both sections by default', () => {
    render(
      <MockAppProvider>
        <SectionsReplace />
      </MockAppProvider>
    );

    expect(screen.getByText('أدوات المونتاج الاحترافية')).toBeInTheDocument();
    expect(screen.getByText('الاشتراكات المميزة')).toBeInTheDocument();
  });

  it('renders at least one product in editing tools section', () => {
    render(
      <MockAppProvider>
        <SectionsReplace sections={['editingTools']} />
      </MockAppProvider>
    );

    expect(screen.getByText('باقة الأيقونات المتحركة')).toBeInTheDocument();
  });

  it('renders at least one product in subscriptions section', () => {
    render(
      <MockAppProvider>
        <SectionsReplace sections={['subscriptions']} />
      </MockAppProvider>
    );

    expect(screen.getByText('اشتراك Google Gemini Pro')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(
      <MockAppProvider>
        <SectionsReplace />
      </MockAppProvider>
    );

    expect(screen.getByText('استكشف الأدوات')).toBeInTheDocument();
    expect(screen.getByText('تصفح الاشتراكات')).toBeInTheDocument();
  });

  it('renders product badges', () => {
    render(
      <MockAppProvider>
        <SectionsReplace sections={['editingTools']} />
      </MockAppProvider>
    );

    expect(screen.getByText('الأكثر مبيعاً')).toBeInTheDocument();
  });

  it('handles empty sections gracefully', () => {
    render(
      <MockAppProvider>
        <SectionsReplace sections={[]} />
      </MockAppProvider>
    );

    // Should render without crashing
    expect(screen.queryByText('أدوات المونتاج الاحترافية')).not.toBeInTheDocument();
    expect(screen.queryByText('الاشتراكات المميزة')).not.toBeInTheDocument();
  });
});
