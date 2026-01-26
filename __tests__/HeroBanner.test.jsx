import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroBanner from '../components/HeroBanner';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('HeroBanner', () => {
  const mockProps = {
    image: '/images/banners/edits-hero.webp',
    title: 'أدوات المونتاج الاحترافية',
    subtitle: 'اكتشف مجموعة شاملة من الأدوات والقوالب',
    ctaText: 'استكشف الأدوات',
    ctaHref: '/edits-tools'
  };

  it('renders hero banner with all props', () => {
    render(<HeroBanner {...mockProps} />);
    
    // Check if title is rendered
    expect(screen.getByText('أدوات المونتاج الاحترافية')).toBeInTheDocument();
    
    // Check if subtitle is rendered
    expect(screen.getByText('اكتشف مجموعة شاملة من الأدوات والقوالب')).toBeInTheDocument();
    
    // Check if CTA button is rendered
    expect(screen.getByText('استكشف الأدوات')).toBeInTheDocument();
    
    // Check if image is rendered with correct alt text
    expect(screen.getByAltText('أدوات المونتاج الاحترافية')).toBeInTheDocument();
  });

  it('renders CTA link with correct href', () => {
    render(<HeroBanner {...mockProps} />);
    
    const ctaLink = screen.getByRole('link');
    expect(ctaLink).toHaveAttribute('href', '/edits-tools');
  });

  it('renders with proper accessibility attributes', () => {
    render(<HeroBanner {...mockProps} />);
    
    const ctaLink = screen.getByRole('link');
    expect(ctaLink).toHaveAttribute('aria-label', 'استكشف الأدوات - أدوات المونتاج الاحترافية');
  });

  it('renders hero section with proper structure', () => {
    render(<HeroBanner {...mockProps} />);
    
    const section = screen.getByRole('banner');
    expect(section).toBeInTheDocument();
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
