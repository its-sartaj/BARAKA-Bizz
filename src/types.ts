export type ProductCategory = 'All' | 'Men' | 'Women' | 'Accessories' | 'New In' | 'Best Sellers';

export interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Accessories';
  subCategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  fallbackGradient: string;
  description: string;
  fabricDetails: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  sku: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: string;
  paymentMethod: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}
