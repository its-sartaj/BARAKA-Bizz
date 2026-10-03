import { Product, Order, ProductReview } from '../types';

export const FIREBASE_RTDB_URL = 'https://baraka-bizz-default-rtdb.asia-southeast1.firebasedatabase.app';

// Helper to normalize objects or arrays into standard typed arrays
function normalizeArray<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.filter(Boolean);
  }
  if (typeof data === 'object') {
    return Object.values(data).filter(Boolean) as T[];
  }
  return [];
}

// -------------------------------------------------------------
// 1. PRODUCTS (Read, Write, Update, Delete, Stock)
// -------------------------------------------------------------

export async function fetchFirebaseProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/products.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    return normalizeArray<Product>(data);
  } catch (err) {
    console.warn('Firebase RTDB: Failed to fetch products:', err);
    return null;
  }
}

export async function saveFirebaseProduct(product: Product): Promise<boolean> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/products/${product.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return res.ok;
  } catch (err) {
    console.error('Firebase RTDB: Failed to save product:', err);
    return false;
  }
}

export async function deleteFirebaseProduct(productId: string): Promise<boolean> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/products/${productId}.json`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('Firebase RTDB: Failed to delete product:', err);
    return false;
  }
}

export async function updateFirebaseStock(productId: string, stock: number): Promise<boolean> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/products/${productId}/stock.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stock)
    });
    return res.ok;
  } catch (err) {
    console.error('Firebase RTDB: Failed to update stock:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 2. ORDERS (Read, Write, Update Status)
// -------------------------------------------------------------

export async function fetchFirebaseOrders(): Promise<Order[] | null> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/orders.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    const arr = normalizeArray<Order>(data);
    return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Firebase RTDB: Failed to fetch orders:', err);
    return null;
  }
}

export async function saveFirebaseOrder(order: Order): Promise<boolean> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/orders/${order.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return res.ok;
  } catch (err) {
    console.error('Firebase RTDB: Failed to save order:', err);
    return false;
  }
}

export async function updateFirebaseOrderStatus(
  orderId: string,
  status: Order['status'],
  tracking?: string
): Promise<boolean> {
  try {
    const payload: any = { status };
    if (tracking) payload.trackingNumber = tracking;
    const res = await fetch(`${FIREBASE_RTDB_URL}/orders/${orderId}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.error('Firebase RTDB: Failed to update order status:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 3. REVIEWS (Read, Write)
// -------------------------------------------------------------

export async function fetchFirebaseReviews(): Promise<ProductReview[] | null> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/reviews.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    return normalizeArray<ProductReview>(data);
  } catch (err) {
    console.warn('Firebase RTDB: Failed to fetch reviews:', err);
    return null;
  }
}

export async function saveFirebaseReview(review: ProductReview): Promise<boolean> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/reviews/${review.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    return res.ok;
  } catch (err) {
    console.error('Firebase RTDB: Failed to save review:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 4. BATCH SYNC & SEED TO FIREBASE
// -------------------------------------------------------------

export async function syncAllToFirebase(
  products: Product[],
  orders: Order[],
  reviews: ProductReview[]
): Promise<boolean> {
  try {
    const productsObj: { [id: string]: Product } = {};
    products.forEach((p) => {
      productsObj[p.id] = p;
    });

    const ordersObj: { [id: string]: Order } = {};
    orders.forEach((o) => {
      ordersObj[o.id] = o;
    });

    const reviewsObj: { [id: string]: ProductReview } = {};
    reviews.forEach((r) => {
      reviewsObj[r.id] = r;
    });

    const [pRes, oRes, rRes, mRes] = await Promise.all([
      fetch(`${FIREBASE_RTDB_URL}/products.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productsObj)
      }),
      fetch(`${FIREBASE_RTDB_URL}/orders.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ordersObj)
      }),
      fetch(`${FIREBASE_RTDB_URL}/reviews.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewsObj)
      }),
      fetch(`${FIREBASE_RTDB_URL}/syncMeta.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastUpdated: new Date().toISOString(),
          updatedBy: 'Admin Atelier Director',
          databaseHost: 'baraka-bizz-default-rtdb.asia-southeast1.firebasedatabase.app',
          status: 'live-synced'
        })
      })
    ]);

    return pRes.ok && oRes.ok && rRes.ok && mRes.ok;
  } catch (err) {
    console.error('Firebase RTDB: Failed to batch sync data:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 5. REAL-TIME SSE LISTENER (EventSource Stream)
// -------------------------------------------------------------

export function listenToFirebaseRealtime(callbacks: {
  onProductsUpdate?: (products: Product[]) => void;
  onOrdersUpdate?: (orders: Order[]) => void;
  onStatusChange?: (status: 'connected' | 'connecting' | 'disconnected') => void;
}): () => void {
  if (typeof window === 'undefined' || !window.EventSource) {
    return () => {};
  }

  let productsEventSource: EventSource | null = null;
  let ordersEventSource: EventSource | null = null;
  let isClosed = false;

  const connect = () => {
    if (isClosed) return;
    callbacks.onStatusChange?.('connecting');

    try {
      // 1. Listen to Products Stream
      productsEventSource = new EventSource(`${FIREBASE_RTDB_URL}/products.json`);

      productsEventSource.addEventListener('put', (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.path === '/') {
            // data is null when all products are deleted — pass empty array
            const prods = parsed.data ? normalizeArray<Product>(parsed.data) : [];
            callbacks.onProductsUpdate?.(prods);
          } else if (parsed.path !== '/') {
            fetchFirebaseProducts().then((prods) => {
              callbacks.onProductsUpdate?.(prods || []);
            });
          }
          callbacks.onStatusChange?.('connected');
        } catch (err) {
          console.warn('Firebase RTDB Products Stream Parse Error:', err);
        }
      });

      productsEventSource.addEventListener('patch', () => {
        fetchFirebaseProducts().then((prods) => {
          callbacks.onProductsUpdate?.(prods || []);
        });
        callbacks.onStatusChange?.('connected');
      });

      productsEventSource.onerror = () => {
        callbacks.onStatusChange?.('disconnected');
      };

      // 2. Listen to Orders Stream
      ordersEventSource = new EventSource(`${FIREBASE_RTDB_URL}/orders.json`);

      ordersEventSource.addEventListener('put', (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.path === '/' && parsed.data) {
            const arr = normalizeArray<Order>(parsed.data);
            callbacks.onOrdersUpdate?.(
              arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            );
          } else if (parsed.path !== '/') {
            fetchFirebaseOrders().then((ords) => {
              if (ords) callbacks.onOrdersUpdate?.(ords);
            });
          }
          callbacks.onStatusChange?.('connected');
        } catch (err) {
          console.warn('Firebase RTDB Orders Stream Parse Error:', err);
        }
      });

      ordersEventSource.addEventListener('patch', () => {
        fetchFirebaseOrders().then((ords) => {
          if (ords) callbacks.onOrdersUpdate?.(ords);
        });
        callbacks.onStatusChange?.('connected');
      });

      ordersEventSource.onerror = () => {
        callbacks.onStatusChange?.('disconnected');
      };

      callbacks.onStatusChange?.('connected');
    } catch (err) {
      console.warn('Firebase RTDB Stream connection failed:', err);
      callbacks.onStatusChange?.('disconnected');
    }
  };

  connect();

  return () => {
    isClosed = true;
    if (productsEventSource) {
      productsEventSource.close();
      productsEventSource = null;
    }
    if (ordersEventSource) {
      ordersEventSource.close();
      ordersEventSource = null;
    }
  };
}
