import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-denim-jacket',
    name: 'Artisanal Selvedge Denim Jacket',
    category: 'Men',
    subCategory: 'Outerwear',
    price: 6999,
    originalPrice: 8499,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#2A374A] to-[#1E2631]',
    description: 'Constructed from rare 14.5oz Japanese shuttle-loom selvedge denim. Finished with hand-hammered antique brass shank buttons, reinforced chain-stitch construction, and subtle contrast stitching.',
    fabricDetails: '100% Ring-Spun Kurabo Japanese Cotton (14.5 oz). Unwashed raw selvedge edge inside placket.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Indigo Selvedge', hex: '#1F2A38' },
      { name: 'Washed Charcoal', hex: '#2C2B29' }
    ],
    stock: 18,
    isNew: true,
    isBestSeller: true,
    sku: 'BD-DNM-001'
  },
  {
    id: 'prod-linen-shirt',
    name: 'Riviera Relaxed Linen Shirt',
    category: 'Men',
    subCategory: 'Shirts',
    price: 3499,
    originalPrice: 4199,
    rating: 4.8,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#EAE5D9] to-[#D4CEBF]',
    description: 'A tribute to relaxed Mediterranean tailoring. Woven from 100% certified Normandy flax linen with a camp collar, mother-of-pearl buttons, and tailored split back yoke.',
    fabricDetails: '100% Normandy Certified Flax (180 GSM). Pre-washed with natural pumice stones for immediate softness.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Natural', hex: '#E6E1D5' },
      { name: 'Olive Drab', hex: '#585C4B' },
      { name: 'Crisp Chalk', hex: '#F9F8F5' }
    ],
    stock: 24,
    isNew: true,
    isBestSeller: true,
    sku: 'BD-LNN-002'
  },
  {
    id: 'prod-graphic-tee',
    name: 'Atelier Heavyweight Graphic Tee',
    category: 'Men',
    subCategory: 'T-Shirts',
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#1E1E1E] to-[#141414]',
    description: 'Engineered from ultra-heavy 280 GSM combed organic cotton. Features custom archival typography silkscreened with water-based eco-pigments and a binded ribbed collar that never sags.',
    fabricDetails: '100% GOTS-Certified Organic Combed Ring-Spun Cotton (280 GSM). Zero shrink finish.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Vintage Black', hex: '#1D1D1C' },
      { name: 'Raw Cream', hex: '#EBE7DD' },
      { name: 'Earthy Terracotta', hex: '#9E553B' }
    ],
    stock: 35,
    isNew: false,
    isBestSeller: true,
    sku: 'BD-TEE-003'
  },
  {
    id: 'prod-leather-wallet',
    name: 'Heritage Vegetable-Tanned Leather Wallet',
    category: 'Accessories',
    subCategory: 'Leather Goods',
    price: 2499,
    originalPrice: 2999,
    rating: 5.0,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#8C4A28] to-[#5C2B14]',
    description: 'Hand-burnished and hand-stitched in limited runs. Vegetable-tanned Tuscan leather that develops a magnificent personalized golden patina over years of daily carry.',
    fabricDetails: 'Full-Grain Certified Italian Vegetable-Tanned Cowhide (Ponte a Egola, Tuscany). 0.6mm waxed linen thread.',
    sizes: ['One Size'],
    colors: [
      { name: 'Cognac Saddle', hex: '#874D27' },
      { name: 'Espresso Black', hex: '#1B1715' }
    ],
    stock: 15,
    isNew: false,
    isBestSeller: true,
    sku: 'BD-WLT-004'
  },
  {
    id: 'prod-trench-coat',
    name: 'Bespoke Double-Breasted Trench',
    category: 'Women',
    subCategory: 'Outerwear',
    price: 11999,
    originalPrice: 13999,
    rating: 4.9,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#D2C5B3] to-[#B3A38F]',
    description: 'A masterwork in modern tailoring. Cut from dense, water-repellent British cotton gabardine with genuine horn buttons, deep storm storm flaps, and a structured silhouette.',
    fabricDetails: '100% Water-Repellent Compact Cotton Gabardine (340 GSM). Cupro satin full interior lining.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Honey Khaki', hex: '#CDBCA7' },
      { name: 'Midnight Navy', hex: '#1C2430' }
    ],
    stock: 12,
    isNew: true,
    isBestSeller: false,
    sku: 'BD-TRN-005'
  },
  {
    id: 'prod-pleated-trousers',
    name: 'Sartorial Wide-Leg Pleated Trousers',
    category: 'Men',
    subCategory: 'Bottoms',
    price: 4499,
    originalPrice: 5299,
    rating: 4.8,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#4F4B46] to-[#363431]',
    description: 'Timeless architectural drape. Features double forward pleats, extended tab waistband with side adjusters, and a clean, gentle taper towards the hem.',
    fabricDetails: '90% Virgin Tropical Wool, 10% Mulberry Silk. Natural crease recovery and year-round breathability.',
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Charcoal Mélange', hex: '#3E3E3C' },
      { name: 'Desert Sand', hex: '#C2B8A8' }
    ],
    stock: 22,
    isNew: false,
    isBestSeller: true,
    sku: 'BD-TRS-006'
  },
  {
    id: 'prod-cashmere-knit',
    name: 'Oversized Pure Mongolian Cashmere Sweater',
    category: 'Women',
    subCategory: 'Knitwear',
    price: 8999,
    originalPrice: 10499,
    rating: 5.0,
    reviewsCount: 47,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#DFD9CE] to-[#C9C1B2]',
    description: 'Sourced from the high plateaus of Inner Mongolia. Spun from Grade-A 2-ply long-staple cashmere fibers, providing featherlight warmth without pill formation.',
    fabricDetails: '100% Grade-A Mongolian Cashmere (15.5 micron diameter, 38mm fiber length). Rib-knit collar, cuffs, and hem.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Chantilly Cream', hex: '#F0ECE1' },
      { name: 'Heather Grey', hex: '#A8A7A3' },
      { name: 'Warm Terracotta', hex: '#A85A3D' }
    ],
    stock: 14,
    isNew: true,
    isBestSeller: true,
    sku: 'BD-CSH-007'
  },
  {
    id: 'prod-silk-scarf',
    name: 'Botanical Hand-Rolled Silk Foulard',
    category: 'Accessories',
    subCategory: 'Scarves',
    price: 2199,
    originalPrice: 2699,
    rating: 4.7,
    reviewsCount: 16,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80',
    fallbackGradient: 'from-[#7A4B3A] to-[#45271D]',
    description: 'An art piece meant to be worn. Screen-printed with archival botanical motifs onto 16-momme mulberry silk twill, completed with hand-rolled and hand-sewn hem borders.',
    fabricDetails: '100% Grade-6A Mulberry Silk Twill (16 Momme). Hand-rolled edges finished by master artisans.',
    sizes: ['One Size (90x90cm)'],
    colors: [
      { name: 'Terracotta & Ochre', hex: '#A35338' },
      { name: 'Indigo Flora', hex: '#263445' }
    ],
    stock: 20,
    isNew: false,
    isBestSeller: false,
    sku: 'BD-SCF-008'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 'BD-94812',
    userId: 'user-demo',
    customerName: 'Shahzad Ali',
    customerEmail: 'mr7.shahzad@gmail.com',
    customerPhone: '+91 9870168023',
    items: [
      {
        productId: 'prod-denim-jacket',
        productName: 'Artisanal Selvedge Denim Jacket',
        productImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
        size: 'L',
        color: 'Indigo Selvedge',
        quantity: 1,
        price: 6999
      },
      {
        productId: 'prod-linen-shirt',
        productName: 'Riviera Relaxed Linen Shirt',
        productImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
        size: 'L',
        color: 'Oatmeal Natural',
        quantity: 1,
        price: 3499
      }
    ],
    subtotal: 10498,
    discount: 1050,
    shipping: 0,
    total: 9448,
    status: 'Shipped' as const,
    shippingAddress: {
      street: '42 Artisans Boulevard, Suite 5B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India'
    },
    trackingNumber: 'TRK-BD-8829103IN',
    createdAt: '2026-09-28T14:30:00Z',
    paymentMethod: 'UPI (GPay - mr7.shahzad@okhdfcbank)'
  },
  {
    id: 'ord-1002',
    orderNumber: 'BD-94750',
    userId: 'user-demo-2',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@fashionstudio.com',
    customerPhone: '+91 9820011223',
    items: [
      {
        productId: 'prod-cashmere-knit',
        productName: 'Oversized Pure Mongolian Cashmere Sweater',
        productImage: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1000&q=80',
        size: 'M',
        color: 'Chantilly Cream',
        quantity: 1,
        price: 8999
      }
    ],
    subtotal: 8999,
    discount: 0,
    shipping: 0,
    total: 8999,
    status: 'Processing' as const,
    shippingAddress: {
      street: 'Flat 14A, Sea Face Enclave, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India'
    },
    trackingNumber: 'TRK-BD-991044IN',
    createdAt: '2026-10-01T09:15:00Z',
    paymentMethod: 'Net Banking (HDFC Bank)'
  }
];
