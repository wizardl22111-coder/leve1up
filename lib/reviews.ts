export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  date?: string;
  productId?: number;
  approved?: boolean;
  customerId?: string;
  orderId?: string;
  productName?: string;
  customerName?: string;
  customerEmail?: string;
}

export const getAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

export const getRatingDistribution = (reviews: Review[]) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  return distribution;
};

// Mock data for reviews (in a real app, this would be in a database)
let mockReviews: Review[] = [];

export const getAllReviews = (): Review[] => {
  return mockReviews;
};

export const getApprovedReviews = (): Review[] => {
  return mockReviews.filter(review => review.approved === true);
};

export const getProductReviews = (productId: number): Review[] => {
  return mockReviews.filter(review => review.productId === productId);
};

export const addReview = (review: Omit<Review, 'id'>): Review => {
  const newReview: Review = {
    ...review,
    id: Date.now(), // Simple ID generation
    approved: false, // Reviews need approval by default
  };
  mockReviews.push(newReview);
  return newReview;
};

export const approveReview = (reviewId: number): boolean => {
  const reviewIndex = mockReviews.findIndex(review => review.id === reviewId);
  if (reviewIndex !== -1) {
    mockReviews[reviewIndex].approved = true;
    return true;
  }
  return false;
};

export const deleteReview = (reviewId: number): boolean => {
  const reviewIndex = mockReviews.findIndex(review => review.id === reviewId);
  if (reviewIndex !== -1) {
    mockReviews.splice(reviewIndex, 1);
    return true;
  }
  return false;
};

export const hasCustomerPurchasedProduct = (customerId: string, productId: number): boolean => {
  // Mock implementation - in a real app, this would check purchase history
  return true; // For demo purposes, assume all customers have purchased
};

export const hasCustomerReviewedProduct = (customerId: string, productId: number): boolean => {
  return mockReviews.some(review => 
    review.customerId === customerId && review.productId === productId
  );
};
