import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, ToastMessage, ProductCategory, ProductReview } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialProducts';
import { INITIAL_REVIEWS } from '../data/initialReviews';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  orders: Order[];
  reviews: ProductReview[];
  appliedCoupon: { code: string; discountPercent: number } | null;
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
  activeSort: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  setActiveSort: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  getProductReviews: (productId: string) => ProductReview[];
  addProductReview: (productId: string, rating: number, comment: string, reviewerName?: string) => void;
  
  // UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;

  // Actions
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  login: (email: string, role?: 'customer' | 'admin') => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;
  placeOrder: (shippingDetails: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    paymentMethod: string;
  }) => Order;

  // Admin Actions
  adminAddProduct: (product: Omit<Product, 'id' | 'sku'>) => void;
  adminUpdateProduct: (product: Product) => void;
  adminDeleteProduct: (productId: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: Order['status'], tracking?: string) => void;
  adminUpdateStock: (productId: string, stock: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'user-demo',
  name: 'Shahzad Ali',
  email: 'mr7.shahzad@gmail.com',
  phone: '+91 9870168023',
  role: 'customer',
  address: {
    street: '42 Artisans Boulevard, Suite 5B',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India'
  },
  createdAt: '2026-09-01T00:00:00Z'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('baraka_bizz_products') || localStorage.getItem('baraka_dizz_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If prices are still under 500 (old USD values), migrate to INITIAL_PRODUCTS in INR
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].price < 500) {
          return INITIAL_PRODUCTS;
        }
        return parsed;
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('baraka_bizz_cart') || localStorage.getItem('baraka_dizz_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].product && parsed[0].product.price < 500) {
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('baraka_bizz_wishlist') || localStorage.getItem('baraka_dizz_wishlist');
    return saved ? JSON.parse(saved) : ['prod-denim-jacket', 'prod-leather-wallet'];
  });

  // User
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('baraka_bizz_user') || localStorage.getItem('baraka_dizz_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('baraka_bizz_orders') || localStorage.getItem('baraka_dizz_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].total < 500) {
          return INITIAL_ORDERS;
        }
        return parsed;
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('baraka_bizz_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Filters
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');
  const [activeSort, setActiveSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('baraka_bizz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('baraka_bizz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('baraka_bizz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('baraka_bizz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('baraka_bizz_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('baraka_bizz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('baraka_bizz_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const addProductReview = (productId: string, rating: number, comment: string, reviewerName?: string) => {
    const author = reviewerName?.trim() || user?.name || 'Artisanal Patron';
    const newReview: ProductReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId,
      userName: author,
      rating: Math.max(1, Math.min(5, rating)),
      comment: comment.trim(),
      verifiedPurchase: true,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Compute updated rating & review count for the product
    const allProdReviews = updatedReviews.filter((r) => r.productId === productId);
    const avgRating = allProdReviews.reduce((sum, r) => sum + r.rating, 0) / allProdReviews.length;
    const roundedRating = Number(avgRating.toFixed(1));

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              rating: roundedRating,
              reviewsCount: allProdReviews.length
            }
          : p
      )
    );

    setQuickViewProduct((prev) =>
      prev && prev.id === productId
        ? {
            ...prev,
            rating: roundedRating,
            reviewsCount: allProdReviews.length
          }
        : prev
    );

    showToast(
      'Review Published',
      `Thank you ${author}! Your ${rating}-star feedback has been published.`,
      'success'
    );
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = color || (product.colors[0] ? product.colors[0].name : 'Default');
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id && item.size === chosenSize && item.color === chosenColor
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        product,
        size: chosenSize,
        color: chosenColor,
        quantity
      };
      setCart((prev) => [...prev, newItem]);
    }

    showToast('Added to Bag', `${product.name} (${chosenSize}) added to your collection.`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item Removed', 'The item was removed from your shopping bag.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from Wishlist', `${product?.name || 'Item'} removed.`, 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Saved to Wishlist', `${product?.name || 'Item'} saved to your favorites.`, 'success');
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Coupon
  const applyCoupon = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'BARAKA10') {
      setAppliedCoupon({ code: 'BARAKA10', discountPercent: 10 });
      showToast('Voucher Applied', '10% artisanal luxury discount applied to your order!', 'success');
      return true;
    } else if (normalized === 'LUXURY20' || normalized === 'FIRSTORDER') {
      setAppliedCoupon({ code: normalized, discountPercent: 20 });
      showToast('Privilege Discount Applied', '20% off entire order applied!', 'success');
      return true;
    } else {
      showToast('Invalid Code', 'Please enter a valid promotional code (Try BARAKA10 or LUXURY20)', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Auth actions
  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      phone: '+91 9870168023',
      role,
      address: {
        street: '42 Artisans Boulevard',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India'
      },
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast('Welcome to BARAKA Bizz.', `Signed in successfully as ${newUser.name}.`, 'success');
  };

  const signup = (name: string, email: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: '+91 9870168023',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast('Account Created', `Welcome to the BARAKA Bizz. Atelier, ${name}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    setIsProfileOpen(false);
    setIsAdminOpen(false);
    showToast('Signed Out', 'You have been safely signed out.', 'info');
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);
    showToast('Profile Updated', 'Your atelier details have been saved.', 'success');
  };

  // Place Order
  const placeOrder = (details: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    paymentMethod: string;
  }): Order => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
    const shipping = subtotal - discount > 2499 ? 0 : 199;
    const total = subtotal - discount + shipping;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `BD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user ? user.id : 'guest',
      customerName: details.name,
      customerEmail: details.email,
      customerPhone: details.phone,
      items: cart.map((c) => ({
        productId: c.productId,
        productName: c.product.name,
        productImage: c.product.image,
        size: c.size,
        color: c.color,
        quantity: c.quantity,
        price: c.product.price
      })),
      subtotal,
      discount,
      shipping,
      total,
      status: 'Processing',
      shippingAddress: {
        street: details.street,
        city: details.city,
        state: details.state,
        postalCode: details.postalCode,
        country: details.country
      },
      trackingNumber: `TRK-BD-${Math.floor(1000000 + Math.random() * 9000000)}IN`,
      createdAt: new Date().toISOString(),
      paymentMethod: details.paymentMethod
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.productId === prod.id);
        if (cartMatch) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartMatch.quantity)
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    showToast('Order Confirmed!', `Order #${newOrder.orderNumber} is now being hand-packaged.`, 'success');
    return newOrder;
  };

  // Admin Actions
  const adminAddProduct = (newProdData: Omit<Product, 'id' | 'sku'>) => {
    const id = `prod-custom-${Date.now()}`;
    const sku = `BD-ART-${Math.floor(100 + Math.random() * 900)}`;
    const product: Product = {
      ...newProdData,
      id,
      sku
    };
    setProducts((prev) => [product, ...prev]);
    showToast('Product Created', `${product.name} was successfully added to inventory.`, 'success');
  };

  const adminUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    showToast('Product Updated', `${updatedProd.name} changes have been published.`, 'success');
  };

  const adminDeleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product Deleted', `${prod?.name || 'Item'} was removed from catalog.`, 'info');
  };

  const adminUpdateOrderStatus = (orderId: string, status: Order['status'], tracking?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              ...(tracking ? { trackingNumber: tracking } : {})
            }
          : ord
      )
    );
    showToast('Order Status Updated', `Order status changed to ${status}.`, 'success');
  };

  const adminUpdateStock = (productId: string, stock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, stock) } : p))
    );
    showToast('Inventory Updated', `Stock quantity adjusted to ${stock}.`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        orders,
        reviews,
        appliedCoupon,
        activeCategory,
        setActiveCategory,
        activeSort,
        setActiveSort,
        getProductReviews,
        addProductReview,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isProfileOpen,
        setIsProfileOpen,
        isAdminOpen,
        setIsAdminOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        dismissToast,
        showToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        applyCoupon,
        removeCoupon,
        login,
        signup,
        logout,
        updateUserProfile,
        placeOrder,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminUpdateOrderStatus,
        adminUpdateStock
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
