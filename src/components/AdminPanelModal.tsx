import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Plus,
  Package,
  TrendingUp,
  AlertTriangle,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Shield,
  Layers,
  Search,
  RefreshCw,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { Product, Order } from '../types';
import { SafeImage } from './SafeImage';
import { BarakaBizzLogo } from './BarakaBizzLogo';
import { formatINR } from '../utils/formatCurrency';

export const AdminPanelModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    orders,
    user,
    adminLoginWithPin,
    logout,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    adminUpdateStock
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory'>('analytics');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Admin PIN login state
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Product Form State (for Add / Edit)
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Men' | 'Women' | 'Accessories'>('Men');
  const [formSubCategory, setFormSubCategory] = useState('Outerwear');
  const [formPrice, setFormPrice] = useState(3499);
  const [formStock, setFormStock] = useState(20);
  const [formDescription, setFormDescription] = useState('');
  const [formFabric, setFormFabric] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formSizes, setFormSizes] = useState('S, M, L, XL');

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.toLowerCase() === '#admin' || window.location.hash.toLowerCase() === '#/admin') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adminLoginWithPin(adminPin);
    if (!ok) {
      setPinError('Galt Security PIN! Kripya sahi PIN enter karein.');
    } else {
      setAdminPin('');
      setPinError('');
    }
  };

  if (!isAdminOpen) return null;

  // Verify Admin Permissions
  const isAdmin = user && user.role === 'admin';

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockItems = products.filter((p) => p.stock < 15);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory('Men');
    setFormSubCategory('Apparel');
    setFormPrice(2999);
    setFormStock(25);
    setFormDescription('Artisanal garment woven from premium natural fibers.');
    setFormFabric('100% Organic Heritage Cotton. Pre-shrunk finish.');
    setFormImage('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80');
    setFormSizes('S, M, L, XL');
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSubCategory(p.subCategory);
    setFormPrice(p.price);
    setFormStock(p.stock);
    setFormDescription(p.description);
    setFormFabric(p.fabricDetails);
    setFormImage(p.image);
    setFormSizes(p.sizes.join(', '));
    setIsEditingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formSizes.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        adminUpdateProduct({
          ...existing,
          name: formName,
          category: formCategory,
          subCategory: formSubCategory,
          price: Number(formPrice),
          stock: Number(formStock),
          description: formDescription,
          fabricDetails: formFabric,
          image: formImage || existing.image,
          sizes: sizesArray.length ? sizesArray : ['Standard']
        });
      }
    } else {
      adminAddProduct({
        name: formName,
        category: formCategory,
        subCategory: formSubCategory,
        price: Number(formPrice),
        stock: Number(formStock),
        rating: 5.0,
        reviewsCount: 1,
        image: formImage || 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
        fallbackGradient: 'from-[#2A2927] to-[#171615]',
        description: formDescription,
        fabricDetails: formFabric,
        sizes: sizesArray.length ? sizesArray : ['S', 'M', 'L'],
        colors: [{ name: 'Artisan Natural', hex: '#E2DDD4' }],
        isNew: true
      });
    }

    setIsEditingProduct(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl border border-[#E8E4DC] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E8E4DC] flex items-center justify-between bg-[#191918] text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#B85D36] flex items-center justify-center font-bold">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <BarakaBizzLogo inverted className="h-7 w-auto" />
                <span className="text-[10px] tracking-widest font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-amber-300">
                  ATELIER ADMIN MANAGEMENT
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                Products · Inventory · Real-Time Order Tracking · Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                <span className="text-xs text-white/80 hidden sm:inline">
                  Operator: <strong>{user?.name}</strong>
                </span>
                <button
                  onClick={() => {
                    logout();
                    setPinError('');
                  }}
                  className="px-2.5 py-1 text-[11px] bg-red-900/60 hover:bg-red-800 text-white rounded font-medium transition-colors"
                  title="Lock Admin Console"
                >
                  Lock Console
                </button>
              </>
            )}
            <button
              onClick={handleCloseAdmin}
              className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Confidential Admin PIN Login */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center space-y-5 max-w-md mx-auto">
            <div className="w-14 h-14 bg-[#191918] text-amber-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-white/10">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#B85D36] font-semibold block mb-1">
                CONFIDENTIAL OWNER ACCESS
              </span>
              <h3 className="font-brand text-2xl font-bold text-[#141413]">
                Atelier Master Console
              </h3>
              <p className="text-xs text-[#756E65] mt-1.5">
                Kripya apna Owner Security PIN enter karke Admin Panel unlock karein.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4 pt-2 text-left">
              {pinError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium">
                  {pinError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  Master Security PIN
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Enter PIN (Default: 7860)"
                  className="w-full text-center text-lg font-mono tracking-[0.3em] py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg focus:outline-none focus:border-[#B85D36]"
                />
                <span className="text-[11px] text-[#756E65] mt-1.5 block text-center">
                  Owner Default PIN: <strong className="font-mono text-[#141413]">7860</strong>
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAdmin}
                  className="flex-1 py-3 bg-[#EFECE4] hover:bg-[#E5E0D5] text-[#141413] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#191918] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Unlock Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Admin Tabs */}
            <div className="flex border-b border-[#E8E4DC] bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider px-6 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setIsEditingProduct(false);
                }}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-[#B85D36] text-[#141413] bg-white'
                    : 'border-transparent text-[#756E65] hover:text-[#141413]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Executive Overview</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsEditingProduct(false);
                }}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'products'
                    ? 'border-[#B85D36] text-[#141413] bg-white'
                    : 'border-transparent text-[#756E65] hover:text-[#141413]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Product Catalog ({products.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setIsEditingProduct(false);
                }}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'orders'
                    ? 'border-[#B85D36] text-[#141413] bg-white'
                    : 'border-transparent text-[#756E65] hover:text-[#141413]'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Order Tracking ({orders.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('inventory');
                  setIsEditingProduct(false);
                }}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'inventory'
                    ? 'border-[#B85D36] text-[#141413] bg-white'
                    : 'border-transparent text-[#756E65] hover:text-[#141413]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Inventory Health</span>
                {lowStockItems.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center font-bold">
                    {lowStockItems.length}
                  </span>
                )}
              </button>
            </div>

            {/* Admin Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
              
              {/* TAB 1: EXECUTIVE ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-white rounded-lg border border-[#E8E4DC] space-y-1">
                      <span className="text-xs text-[#756E65] uppercase font-semibold">Total Atelier Gross</span>
                      <p className="text-2xl font-bold font-mono text-[#141413] tabular-nums">
                        {formatINR(totalRevenue)}
                      </p>
                      <span className="text-[11px] text-[#3C6E47] font-medium">+18.4% this quarter</span>
                    </div>

                    <div className="p-5 bg-white rounded-lg border border-[#E8E4DC] space-y-1">
                      <span className="text-xs text-[#756E65] uppercase font-semibold">Total Client Orders</span>
                      <p className="text-2xl font-bold font-mono text-[#141413] tabular-nums">
                        {orders.length}
                      </p>
                      <span className="text-[11px] text-[#756E65]">100% fulfillment rate</span>
                    </div>

                    <div className="p-5 bg-white rounded-lg border border-[#E8E4DC] space-y-1">
                      <span className="text-xs text-[#756E65] uppercase font-semibold">Active Garments</span>
                      <p className="text-2xl font-bold font-mono text-[#141413] tabular-nums">
                        {products.length}
                      </p>
                      <span className="text-[11px] text-[#756E65]">Across Men, Women & Accessories</span>
                    </div>

                    <div className="p-5 bg-white rounded-lg border border-[#E8E4DC] space-y-1">
                      <span className="text-xs text-[#756E65] uppercase font-semibold">Physical Stock Units</span>
                      <p className="text-2xl font-bold font-mono text-[#141413] tabular-nums">
                        {totalStockUnits}
                      </p>
                      <span className={`text-[11px] font-medium ${lowStockItems.length > 0 ? 'text-amber-700' : 'text-[#3C6E47]'}`}>
                        {lowStockItems.length} styles require restock
                      </span>
                    </div>
                  </div>

                  {/* Recent Activity & Highlights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-5 bg-white rounded-lg border border-[#E8E4DC] space-y-4">
                      <h4 className="font-brand font-bold text-sm text-[#141413] uppercase tracking-wider">
                        Recent Store Orders
                      </h4>
                      <div className="space-y-3">
                        {orders.slice(0, 4).map((ord) => (
                          <div key={ord.id} className="flex items-center justify-between text-xs pb-2 border-b border-[#F0ECE4]">
                            <div>
                              <p className="font-mono font-bold text-[#141413]">#{ord.orderNumber}</p>
                              <p className="text-[#756E65]">{ord.customerName} · {ord.items.length} items</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold text-[#141413]">{formatINR(ord.total)}</p>
                              <span className="text-[10px] uppercase font-semibold text-[#B85D36]">{ord.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 bg-white rounded-lg border border-[#E8E4DC] space-y-4">
                      <h4 className="font-brand font-bold text-sm text-[#141413] uppercase tracking-wider">
                        Curated Top Performers
                      </h4>
                      <div className="space-y-3">
                        {products.slice(0, 4).map((prod) => (
                          <div key={prod.id} className="flex items-center justify-between text-xs pb-2 border-b border-[#F0ECE4]">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-10 bg-[#F4F1EA] rounded overflow-hidden">
                                <SafeImage src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-[#141413] line-clamp-1">{prod.name}</p>
                                <p className="text-[#756E65]">Stock: {prod.stock} units</p>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-[#141413]">{formatINR(prod.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCT MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  {isEditingProduct ? (
                    /* Product Add/Edit Form */
                    <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-lg border border-[#E8E4DC] space-y-4 max-w-2xl">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
                        <h4 className="font-brand font-bold text-base text-[#141413]">
                          {editingProductId ? 'Edit Product Details' : 'Add New Artisanal Garment'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingProduct(false)}
                          className="text-xs text-[#756E65] hover:text-[#141413]"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Garment Title
                          </label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="e.g. Japanese Selvedge Overshirt"
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Primary Category
                          </label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value as any)}
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Accessories">Accessories</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Sub-Category
                          </label>
                          <input
                            type="text"
                            required
                            value={formSubCategory}
                            onChange={(e) => setFormSubCategory(e.target.value)}
                            placeholder="e.g. Outerwear, Shirts, Knitwear"
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Retail Price (₹ INR)
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={formPrice}
                            onChange={(e) => setFormPrice(Number(e.target.value))}
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Initial Stock Units
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={formStock}
                            onChange={(e) => setFormStock(Number(e.target.value))}
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Available Sizes (comma separated)
                          </label>
                          <input
                            type="text"
                            value={formSizes}
                            onChange={(e) => setFormSizes(e.target.value)}
                            placeholder="XS, S, M, L, XL"
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Product Image URL
                          </label>
                          <input
                            type="url"
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Fabric & Material Origin Details
                          </label>
                          <input
                            type="text"
                            value={formFabric}
                            onChange={(e) => setFormFabric(e.target.value)}
                            placeholder="e.g. 100% Normandy Flax Linen (180 GSM)"
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                            Garment Description
                          </label>
                          <textarea
                            rows={3}
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-[#DDD8CE] rounded bg-[#FAF8F5]"
                          />
                        </div>
                      </div>

                      <div className="pt-3 flex gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-wider rounded"
                        >
                          {editingProductId ? 'Update Garment' : 'Publish Product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProduct(false)}
                          className="px-4 py-2.5 border border-[#DDD8CE] text-xs text-[#544F49] rounded"
                        >
                          Discard
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* Products Toolbar */}
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="relative w-full sm:w-72">
                          <Search className="w-4 h-4 text-[#8C867D] absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Search catalog by title, SKU..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-[#DDD8CE] rounded focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={handleOpenAddProduct}
                          className="w-full sm:w-auto px-4 py-2 bg-[#191918] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4 text-[#B85D36]" />
                          <span>Add New Garment</span>
                        </button>
                      </div>

                      {/* Products Table */}
                      <div className="bg-white rounded-lg border border-[#E8E4DC] overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#F0ECE4] text-[#544F49] uppercase tracking-wider font-semibold">
                            <tr>
                              <th className="py-3 px-4">Garment</th>
                              <th className="py-3 px-4">SKU / Cat</th>
                              <th className="py-3 px-4">Price</th>
                              <th className="py-3 px-4">Stock Units</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F0ECE4]">
                            {filteredProducts.map((p) => (
                              <tr key={p.id} className="hover:bg-[#FAF8F5]">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-12 rounded bg-[#F4F1EA] overflow-hidden shrink-0">
                                      <SafeImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-[#141413] line-clamp-1">{p.name}</p>
                                      <p className="text-[11px] text-[#756E65] line-clamp-1">{p.fabricDetails}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="font-mono text-[#141413]">{p.sku}</p>
                                  <span className="text-[10px] uppercase text-[#756E65]">{p.category} · {p.subCategory}</span>
                                </td>
                                <td className="py-3 px-4 font-mono font-bold text-[#141413] tabular-nums">
                                  {formatINR(p.price)}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-mono tabular-nums font-semibold ${p.stock < 15 ? 'text-red-600' : 'text-[#141413]'}`}>
                                      {p.stock}
                                    </span>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => adminUpdateStock(p.id, Math.max(0, p.stock - 1))}
                                        className="px-1.5 py-0.5 bg-[#EFECE4] hover:bg-[#E5E0D5] rounded text-[10px]"
                                      >
                                        -
                                      </button>
                                      <button
                                        onClick={() => adminUpdateStock(p.id, p.stock + 5)}
                                        className="px-1.5 py-0.5 bg-[#EFECE4] hover:bg-[#E5E0D5] rounded text-[10px]"
                                      >
                                        +5
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleOpenEditProduct(p)}
                                      className="p-1.5 text-[#544F49] hover:text-[#141413] hover:bg-[#EFECE4] rounded"
                                      title="Edit Product"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to remove "${p.name}"?`)) {
                                          adminDeleteProduct(p.id);
                                        }
                                      }}
                                      className="p-1.5 text-[#544F49] hover:text-red-600 hover:bg-red-50 rounded"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: ORDER TRACKING */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Orders Toolbar */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-[#8C867D] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by Order #, Customer..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-[#DDD8CE] rounded focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#756E65]">Status:</span>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="bg-white border border-[#DDD8CE] rounded px-3 py-2 text-xs text-[#141413]"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded border border-[#E8E4DC] text-[#756E65]">
                        No orders match the selected criteria.
                      </div>
                    ) : (
                      filteredOrders.map((ord) => (
                        <div key={ord.id} className="p-5 bg-white rounded-lg border border-[#E8E4DC] space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-[#F0ECE4]">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-base text-[#141413]">
                                  Order #{ord.orderNumber}
                                </span>
                                <span className="text-xs text-[#756E65]">
                                  ({new Date(ord.createdAt).toLocaleDateString()})
                                </span>
                              </div>
                              <p className="text-xs text-[#544F49] mt-0.5">
                                Client: <strong>{ord.customerName}</strong> ({ord.customerEmail}) · {ord.customerPhone}
                              </p>
                            </div>

                            {/* Status Updater */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#756E65]">Fulfillment:</span>
                              <select
                                value={ord.status}
                                onChange={(e) => adminUpdateOrderStatus(ord.id, e.target.value as any)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded border ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : ord.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <span className="font-mono font-bold text-base text-[#141413] tabular-nums">
                                {formatINR(ord.total)}
                              </span>
                            </div>
                          </div>

                          {/* Items and Address Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2 bg-[#FAF8F5] p-3 rounded border border-[#E8E4DC]">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#756E65] block">
                                Manifest Items
                              </span>
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                  <span>{item.productName} ({item.size}) × {item.quantity}</span>
                                  <span className="font-mono">{formatINR(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-1.5 bg-[#FAF8F5] p-3 rounded border border-[#E8E4DC]">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#756E65] block">
                                Shipping Destination & Tracking
                              </span>
                              <p className="text-[#141413]">
                                {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.postalCode}, {ord.shippingAddress.country}
                              </p>
                              <div className="pt-1 flex items-center justify-between">
                                <span className="text-[#756E65]">Tracking Code:</span>
                                <input
                                  type="text"
                                  defaultValue={ord.trackingNumber || 'TRK-BD-PENDING'}
                                  onBlur={(e) => adminUpdateOrderStatus(ord.id, ord.status, e.target.value)}
                                  className="font-mono text-xs px-2 py-0.5 bg-white border border-[#DDD8CE] rounded w-44 text-right"
                                  title="Click to edit tracking code and blur to save"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: INVENTORY HEALTH */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-900">Restock Advisory Notice</h4>
                        <p className="text-[11px] text-amber-800">
                          {lowStockItems.length} styles currently have fewer than 15 units available in the atelier warehouse.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-[#E8E4DC] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F0ECE4] text-[#544F49] uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-3 px-4">Garment</th>
                          <th className="py-3 px-4">SKU</th>
                          <th className="py-3 px-4">Current Stock</th>
                          <th className="py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0ECE4]">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF8F5]">
                            <td className="py-3 px-4 font-medium text-[#141413]">{p.name}</td>
                            <td className="py-3 px-4 font-mono text-[#756E65]">{p.sku}</td>
                            <td className="py-3 px-4 font-mono font-semibold tabular-nums">
                              <span className={p.stock < 15 ? 'text-red-600 font-bold' : 'text-[#3C6E47]'}>
                                {p.stock} units
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => adminUpdateStock(p.id, p.stock + 15)}
                                className="px-3 py-1 bg-[#191918] hover:bg-black text-white text-[11px] font-semibold uppercase rounded transition-colors flex items-center gap-1.5"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Restock +15 Units</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-t border-[#E8E4DC] flex justify-between items-center text-xs text-[#756E65]">
          <span>Protected Atelier Admin Portal</span>
          <button
            onClick={handleCloseAdmin}
            className="px-4 py-1.5 bg-[#EFECE4] hover:bg-[#E5E0D5] text-[#141413] text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
