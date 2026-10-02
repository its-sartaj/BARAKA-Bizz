import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Layers,
  Search,
  RefreshCw,
  LogOut,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Download,
  Calendar,
  Clock,
  Eye,
  CreditCard,
  Tag,
  Sliders,
  Check,
  ChevronRight,
  ExternalLink,
  Copy
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
    adminUpdateStock,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory'>('analytics');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Admin PIN login state
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

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

  // Live Atelier Time
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

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
      setPinError('Access Denied. Master Security PIN is invalid.');
    } else {
      setAdminPin('');
      setPinError('');
    }
  };

  if (!isAdminOpen) return null;

  // Verify Admin Permissions
  const isAdmin = user && user.role === 'admin';

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockItems = products.filter((p) => p.stock < 15);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory('Men');
    setFormSubCategory('Apparel');
    setFormPrice(2999);
    setFormStock(25);
    setFormDescription('Artisanal garment woven from premium natural fibers with bespoke tailoring.');
    setFormFabric('100% Organic Heritage Cotton (240 GSM). Pre-shrunk finish.');
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
          sizes: sizesArray.length ? sizesArray : existing.sizes
        });
      }
    } else {
      adminAddProduct({
        name: formName,
        category: formCategory,
        subCategory: formSubCategory,
        price: Number(formPrice),
        stock: Number(formStock),
        description: formDescription,
        fabricDetails: formFabric,
        image: formImage || 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
        fallbackGradient: 'from-[#1C1B1A] to-[#2E2B27]',
        sizes: sizesArray.length ? sizesArray : ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Artisanal Black', hex: '#141413' },
          { name: 'Oatmeal Natural', hex: '#E6E1D5' }
        ],
        rating: 5.0,
        reviewsCount: 1,
        isNew: true
      });
    }

    setIsEditingProduct(false);
  };

  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      store: 'BARAKA Bizz. Luxury Atelier',
      grossRevenue: totalRevenue,
      inventoryValuation: totalInventoryValue,
      totalOrders: orders.length,
      activeGarments: products.length,
      orders: orders
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `baraka-bizz-executive-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Report Exported', 'Executive atelier metrics downloaded as JSON.', 'success');
  };

  const handleBulkRestockCritical = () => {
    lowStockItems.forEach((p) => {
      adminUpdateStock(p.id, p.stock + 20);
    });
    showToast('Warehouse Restocked', `Added +20 units to ${lowStockItems.length} low stock items.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-7xl bg-[#0F0E0D] text-[#FAF8F5] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[#2B2925] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================================= */}
        {/* TOP STATUS BAR: Director Credentials & Actions                            */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-[#24221E] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#171614] via-[#131211] to-[#171614]">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 bg-gradient-to-br from-[#2E2A23] to-[#171614] rounded-xl border border-[#423C32] shadow-inner">
              <BarakaBizzLogo inverted className="h-6 sm:h-7 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-brand font-bold tracking-[0.25em] text-[#E5C378] uppercase">
                  ATELIER EXECUTIVE OS
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Atelier
                </span>
              </div>
              <p className="text-[11px] text-[#A8A298] font-mono mt-0.5 flex items-center gap-2">
                <span>Director Clearance</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-white/80">
                  <Clock className="w-3 h-3 text-[#B85D36]" />
                  <span>{currentTime || 'MUMBAI IST'}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {isAdmin && (
              <>
                <button
                  onClick={handleExportReport}
                  className="px-3 py-1.5 bg-[#1F1E1B] hover:bg-[#2B2924] border border-[#38342E] text-[#E5C378] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  title="Download JSON Report"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export Audit</span>
                </button>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-[#B85D36] to-[#964724] hover:from-[#C7673C] hover:to-[#A34E2A] text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Garment</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setPinError('');
                  }}
                  className="px-3 py-1.5 bg-[#1F1414] hover:bg-[#2E1818] border border-red-900/40 text-red-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Sign Out Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock Console</span>
                </button>
              </>
            )}

            <button
              onClick={handleCloseAdmin}
              className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Return to Storefront"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* UNAUTHORIZED STATE: Bespoke High-Security Vault Entrance                  */}
        {/* ========================================================================= */}
        {!isAdmin ? (
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#181714] to-[#11100F] border border-[#332F27] p-8 sm:p-10 rounded-2xl shadow-2xl text-center space-y-6">
              
              {/* Subtle luxury glow ring behind badge */}
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-xl animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#2B271F] to-[#1A1813] border border-[#524939] rounded-2xl flex items-center justify-center shadow-lg text-[#E5C378]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#E5C378] font-mono font-bold block">
                  RESTRICTED ACCESS
                </span>
                <h3 className="font-brand text-2xl font-bold text-white tracking-wide">
                  Atelier Executive Vault
                </h3>
                <p className="text-xs text-[#9E988D] max-w-xs mx-auto leading-relaxed">
                  Enter your encrypted Director Security Passcode to access inventory, sales telemetry, and fulfillment.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4 pt-2 text-left">
                {pinError && (
                  <div className="p-3 bg-red-950/70 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{pinError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-[11px] font-semibold text-[#B8B1A4] uppercase tracking-wider">
                      Master Passcode / PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-[11px] text-[#E5C378] hover:underline flex items-center gap-1 font-mono"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{showPin ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      autoFocus
                      value={adminPin}
                      onChange={(e) => {
                        setAdminPin(e.target.value);
                        setPinError('');
                      }}
                      placeholder="••••"
                      className="w-full text-center text-2xl font-mono tracking-[0.4em] py-3.5 bg-[#0C0B0A] border border-[#38332A] rounded-xl text-[#FAF8F5] focus:outline-none focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/50 transition-all placeholder:text-white/20"
                    />
                  </div>

                  {/* 1-Click Master PIN Quick Filler */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#7A7468]">
                      Default PIN: <strong className="font-mono text-[#E5C378]">7860</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdminPin('7860')}
                      className="text-[11px] text-[#B85D36] hover:text-[#D46B3E] font-semibold underline cursor-pointer"
                    >
                      Fill Master PIN (7860)
                    </button>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={handleCloseAdmin}
                    className="flex-1 py-3 bg-[#1A1917] hover:bg-[#24221F] border border-[#332F28] text-[#DDD7CC] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#B85D36] via-[#A8512B] to-[#8C3F1E] hover:from-[#C7673C] hover:to-[#9E4622] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B85D36]/20 cursor-pointer active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Vault</span>
                  </button>
                </div>
              </form>

              <div className="pt-2 border-t border-[#24211B] flex items-center justify-center gap-1.5 text-[10px] text-[#756E63] font-mono">
                <Shield className="w-3 h-3 text-[#E5C378]" />
                <span>SHA-256 SESSION PROTECTED · BARAKA BIZZ ATELIER</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* AUTHORIZED STATE: Full Luxury Admin Dashboard                             */
          /* ========================================================================= */
          <>
            {/* LUXURY TABS BAR */}
            <div className="flex border-b border-[#24221E] bg-[#141311] px-4 sm:px-6 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setIsEditingProduct(false);
                }}
                className={`py-4 px-4 sm:px-5 border-b-2 flex items-center gap-2.5 whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'border-[#E5C378] text-[#E5C378] bg-[#1C1A16]'
                    : 'border-transparent text-[#9E978C] hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Executive Telemetry</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsEditingProduct(false);
                }}
                className={`py-4 px-4 sm:px-5 border-b-2 flex items-center gap-2.5 whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-[#E5C378] text-[#E5C378] bg-[#1C1A16]'
                    : 'border-transparent text-[#9E978C] hover:text-white hover:bg-white/5'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Garment Catalog ({products.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setIsEditingProduct(false);
                }}
                className={`py-4 px-4 sm:px-5 border-b-2 flex items-center gap-2.5 whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#E5C378] text-[#E5C378] bg-[#1C1A16]'
                    : 'border-transparent text-[#9E978C] hover:text-white hover:bg-white/5'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Client Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('inventory');
                  setIsEditingProduct(false);
                }}
                className={`py-4 px-4 sm:px-5 border-b-2 flex items-center gap-2.5 whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'border-[#E5C378] text-[#E5C378] bg-[#1C1A16]'
                    : 'border-transparent text-[#9E978C] hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Warehouse & Stock</span>
                {lowStockItems.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center font-bold font-mono">
                    {lowStockItems.length}
                  </span>
                )}
              </button>
            </div>

            {/* DASHBOARD CONTENT BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0F0E0D] space-y-6">

              {/* =================================================================== */}
              {/* TAB 1: EXECUTIVE TELEMETRY & ANALYTICS                             */}
              {/* =================================================================== */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  
                  {/* Top 4 KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Gross Revenue */}
                    <div className="p-5 bg-gradient-to-br from-[#1C1A17] to-[#141311] rounded-xl border border-[#332F27] space-y-2 relative overflow-hidden group hover:border-[#E5C378]/50 transition-all">
                      <div className="flex items-center justify-between text-[#9E978C]">
                        <span className="text-[11px] uppercase font-bold tracking-wider">Gross Atelier Revenue</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                        {formatINR(totalRevenue)}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>+28.4% vs last quarter</span>
                      </div>
                    </div>

                    {/* Average Order Value */}
                    <div className="p-5 bg-gradient-to-br from-[#1C1A17] to-[#141311] rounded-xl border border-[#332F27] space-y-2 relative overflow-hidden group hover:border-[#E5C378]/50 transition-all">
                      <div className="flex items-center justify-between text-[#9E978C]">
                        <span className="text-[11px] uppercase font-bold tracking-wider">Average Order Value</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-800/40 text-[#E5C378] flex items-center justify-center">
                          <Tag className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                        {formatINR(averageOrderValue)}
                      </p>
                      <div className="text-[11px] text-[#A8A298] font-mono">
                        Across {orders.length} verified transactions
                      </div>
                    </div>

                    {/* Total Stock Units */}
                    <div className="p-5 bg-gradient-to-br from-[#1C1A17] to-[#141311] rounded-xl border border-[#332F27] space-y-2 relative overflow-hidden group hover:border-[#E5C378]/50 transition-all">
                      <div className="flex items-center justify-between text-[#9E978C]">
                        <span className="text-[11px] uppercase font-bold tracking-wider">Inventory Valuation</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-800/40 text-purple-300 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                        {formatINR(totalInventoryValue)}
                      </p>
                      <div className="text-[11px] text-[#A8A298] font-mono">
                        {totalStockUnits} units in warehouse
                      </div>
                    </div>

                    {/* Stock Health */}
                    <div className="p-5 bg-gradient-to-br from-[#1C1A17] to-[#141311] rounded-xl border border-[#332F27] space-y-2 relative overflow-hidden group hover:border-[#E5C378]/50 transition-all">
                      <div className="flex items-center justify-between text-[#9E978C]">
                        <span className="text-[11px] uppercase font-bold tracking-wider">Inventory Health</span>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                          lowStockItems.length > 0
                            ? 'bg-amber-950/70 border-amber-800/40 text-amber-400'
                            : 'bg-emerald-950/70 border-emerald-800/40 text-emerald-400'
                        }`}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                        {products.length - lowStockItems.length} / {products.length}
                      </p>
                      <div className={`text-[11px] font-mono font-medium ${
                        lowStockItems.length > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {lowStockItems.length > 0
                          ? `⚠️ ${lowStockItems.length} styles require restock`
                          : '✓ All garment inventory optimal'}
                      </div>
                    </div>

                  </div>

                  {/* Revenue Trajectory Wave Chart & Restock Radar */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Visual Sales Growth Trajectory (SVG Chart) */}
                    <div className="lg:col-span-2 p-6 bg-[#161513] rounded-xl border border-[#2B2925] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-brand font-bold text-base text-white tracking-wider">
                            Revenue Trajectory (Fiscal 2026)
                          </h4>
                          <p className="text-xs text-[#9E978D] font-mono">
                            Monthly Gross Atelier Performance in INR (₹)
                          </p>
                        </div>
                        <span className="text-xs font-mono text-[#E5C378] bg-[#24211A] border border-[#423C2F] px-3 py-1 rounded-full">
                          +42.6% YoY Growth
                        </span>
                      </div>

                      {/* SVG Line / Area Graph */}
                      <div className="pt-4">
                        <div className="relative h-48 w-full">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#E5C378" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#E5C378" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line x1="0" y1="30" x2="600" y2="30" stroke="#2B2925" strokeDasharray="3 3" />
                            <line x1="0" y1="80" x2="600" y2="80" stroke="#2B2925" strokeDasharray="3 3" />
                            <line x1="0" y1="130" x2="600" y2="130" stroke="#2B2925" strokeDasharray="3 3" />

                            {/* Area Fill */}
                            <path
                              d="M 0,140 Q 100,120 200,95 T 400,60 T 600,25 L 600,180 L 0,180 Z"
                              fill="url(#goldGradient)"
                            />

                            {/* Main Stroke Path */}
                            <path
                              d="M 0,140 Q 100,120 200,95 T 400,60 T 600,25"
                              fill="none"
                              stroke="#E5C378"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />

                            {/* Data Points */}
                            <circle cx="0" cy="140" r="4.5" fill="#E5C378" stroke="#141311" strokeWidth="2" />
                            <circle cx="100" cy="122" r="4.5" fill="#E5C378" stroke="#141311" strokeWidth="2" />
                            <circle cx="200" cy="95" r="4.5" fill="#E5C378" stroke="#141311" strokeWidth="2" />
                            <circle cx="300" cy="80" r="4.5" fill="#E5C378" stroke="#141311" strokeWidth="2" />
                            <circle cx="400" cy="60" r="4.5" fill="#E5C378" stroke="#141311" strokeWidth="2" />
                            <circle cx="500" cy="42" r="4.5" fill="#E5C378" stroke="#141311" strokeWidth="2" />
                            <circle cx="600" cy="25" r="5.5" fill="#FFF" stroke="#B85D36" strokeWidth="3" />
                          </svg>
                        </div>
                        {/* Month Labels */}
                        <div className="flex justify-between text-[10px] font-mono text-[#8C867B] pt-2 border-t border-[#24221E]">
                          <span>APR</span>
                          <span>MAY</span>
                          <span>JUN</span>
                          <span>JUL</span>
                          <span>AUG</span>
                          <span>SEP</span>
                          <span className="text-[#E5C378] font-bold">OCT (CURRENT)</span>
                        </div>
                      </div>
                    </div>

                    {/* Warehouse Radar & Quick Restock */}
                    <div className="p-6 bg-[#161513] rounded-xl border border-[#2B2925] flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-brand font-bold text-sm text-white tracking-wider">
                            Warehouse Alert Radar
                          </h4>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                            {lowStockItems.length} Low Stock
                          </span>
                        </div>
                        <p className="text-xs text-[#9E978D] leading-relaxed">
                          Garments with fewer than 15 physical units in stock at Mumbai Atelier facility.
                        </p>
                      </div>

                      <div className="space-y-2.5 overflow-y-auto max-h-48 pr-1">
                        {lowStockItems.length === 0 ? (
                          <div className="p-4 bg-[#1C1A17] rounded-lg text-center text-xs text-emerald-400 font-medium">
                            ✓ All product stock is healthy and balanced.
                          </div>
                        ) : (
                          lowStockItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="p-2.5 bg-[#1F1D1A] rounded-lg border border-[#332F28] flex items-center justify-between text-xs">
                              <div className="truncate mr-2">
                                <p className="font-medium text-white truncate">{item.name}</p>
                                <span className="text-[10px] font-mono text-[#A8A298]">SKU: {item.sku}</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                                {item.stock} left
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {lowStockItems.length > 0 && (
                        <button
                          onClick={handleBulkRestockCritical}
                          className="w-full py-2.5 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Restock All Critical (+20)</span>
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Recent Orders Overview */}
                  <div className="p-6 bg-[#161513] rounded-xl border border-[#2B2925] space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-brand font-bold text-base text-white tracking-wider">
                        Recent Atelier Orders
                      </h4>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-[#E5C378] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>View All Orders ({orders.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#DDD7CC]">
                        <thead className="border-b border-[#2B2925] text-[10px] uppercase font-mono text-[#8C867B] bg-[#1C1A17]">
                          <tr>
                            <th className="py-3 px-4">Order Ref</th>
                            <th className="py-3 px-4">Client</th>
                            <th className="py-3 px-4">Items</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Total Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#24221E]">
                          {orders.slice(0, 4).map((ord) => (
                            <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-white">#{ord.orderNumber}</td>
                              <td className="py-3 px-4 font-medium text-white">{ord.customerName}</td>
                              <td className="py-3 px-4 text-[#A8A298]">{ord.items.length} garments</td>
                              <td className="py-3 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                                    : ord.status === 'Shipped'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-white text-right">
                                {formatINR(ord.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 2: GARMENT CATALOG & PRODUCT MANAGEMENT                        */}
              {/* =================================================================== */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  {/* Category Pills & Search Controls */}
                  <div className="p-4 bg-[#161513] rounded-xl border border-[#2B2925] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Categories Filter */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                      {['All', 'Men', 'Women', 'Accessories'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-[#E5C378] text-[#141413]'
                              : 'bg-[#211F1C] text-[#A8A298] hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                      <Search className="w-4 h-4 text-[#8C867B] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search garments by name or SKU..."
                        className="w-full text-xs pl-9 pr-3 py-2 bg-[#0C0B0A] border border-[#332F28] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#E5C378]"
                      />
                    </div>
                  </div>

                  {/* Add / Edit Product Form Drawer */}
                  {isEditingProduct && (
                    <div className="p-6 bg-gradient-to-br from-[#1C1A16] to-[#12110F] rounded-xl border-2 border-[#E5C378]/40 shadow-xl space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-[#332F28] pb-3">
                        <div className="flex items-center gap-2 text-[#E5C378]">
                          <Sparkles className="w-4 h-4" />
                          <h4 className="font-brand font-bold text-sm uppercase tracking-wider">
                            {editingProductId ? 'Edit Atelier Garment' : 'Create New Luxury Garment'}
                          </h4>
                        </div>
                        <button
                          onClick={() => setIsEditingProduct(false)}
                          className="p-1 text-white/60 hover:text-white rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                              Garment Name
                            </label>
                            <input
                              type="text"
                              required
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="e.g. Artisanal Cashmere Overcoat"
                              className="w-full text-xs px-3 py-2 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white focus:outline-none focus:border-[#E5C378]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                              Department Category
                            </label>
                            <select
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value as any)}
                              className="w-full text-xs px-3 py-2 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white focus:outline-none focus:border-[#E5C378]"
                            >
                              <option value="Men">Men's Tailoring</option>
                              <option value="Women">Women's Atelier</option>
                              <option value="Accessories">Artisanal Accessories</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                              Sub-Category
                            </label>
                            <input
                              type="text"
                              value={formSubCategory}
                              onChange={(e) => setFormSubCategory(e.target.value)}
                              placeholder="Outerwear, Shirts, Knitwear"
                              className="w-full text-xs px-3 py-2 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white focus:outline-none focus:border-[#E5C378]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                              Retail Price (₹ INR)
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={formPrice}
                              onChange={(e) => setFormPrice(Number(e.target.value))}
                              className="w-full text-xs px-3 py-2 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white font-mono focus:outline-none focus:border-[#E5C378]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                              Stock Units
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={formStock}
                              onChange={(e) => setFormStock(Number(e.target.value))}
                              className="w-full text-xs px-3 py-2 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white font-mono focus:outline-none focus:border-[#E5C378]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                              Available Sizes
                            </label>
                            <input
                              type="text"
                              value={formSizes}
                              onChange={(e) => setFormSizes(e.target.value)}
                              placeholder="S, M, L, XL"
                              className="w-full text-xs px-3 py-2 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white focus:outline-none focus:border-[#E5C378]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                            High-Resolution Image URL
                          </label>
                          <input
                            type="url"
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full text-xs px-3 py-2 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white font-mono focus:outline-none focus:border-[#E5C378]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                            Fabric & Material Chronicle
                          </label>
                          <input
                            type="text"
                            value={formFabric}
                            onChange={(e) => setFormFabric(e.target.value)}
                            placeholder="e.g. 100% Japanese Kurabo Selvedge Denim (14.5 oz)"
                            className="w-full text-xs px-3 py-2 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white focus:outline-none focus:border-[#E5C378]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#B8B1A4] uppercase tracking-wider block mb-1">
                            Garment Story & Description
                          </label>
                          <textarea
                            rows={3}
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Describe design inspiration, cut, and craftsmanship..."
                            className="w-full text-xs p-3 bg-[#0C0B0A] border border-[#38332A] rounded-lg text-white focus:outline-none focus:border-[#E5C378]"
                          />
                        </div>

                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingProduct(false)}
                            className="px-4 py-2 bg-[#211F1C] hover:bg-[#2B2925] text-[#DDD7CC] text-xs font-semibold uppercase rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Save Garment to Atelier</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Product Cards Table View */}
                  <div className="bg-[#161513] rounded-xl border border-[#2B2925] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#DDD7CC]">
                        <thead className="border-b border-[#2B2925] text-[10px] uppercase font-mono text-[#8C867B] bg-[#1C1A17]">
                          <tr>
                            <th className="py-3.5 px-4">Garment</th>
                            <th className="py-3.5 px-4">Department</th>
                            <th className="py-3.5 px-4">Retail Price</th>
                            <th className="py-3.5 px-4">Physical Stock</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#24221E]">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-12 rounded-lg bg-[#211F1C] overflow-hidden shrink-0 border border-[#332F28]">
                                    <SafeImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white line-clamp-1 group-hover:text-[#E5C378] transition-colors">
                                      {p.name}
                                    </p>
                                    <span className="text-[10px] font-mono text-[#8C867B]">
                                      SKU: {p.sku}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded bg-[#211F1C] text-[10px] uppercase font-semibold text-[#B8B1A4]">
                                  {p.category} · {p.subCategory}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-white">
                                {formatINR(p.price)}
                              </td>
                              <td className="py-3 px-4 font-mono">
                                <span className={`font-bold ${p.stock < 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                  {p.stock} units
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {p.stock > 0 ? (
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-red-400 flex items-center gap-1 font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    Sold Out
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="p-1.5 text-[#B8B1A4] hover:text-[#E5C378] hover:bg-white/10 rounded transition-colors"
                                    title="Edit Garment"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Remove "${p.name}" from active collection?`)) {
                                        adminDeleteProduct(p.id);
                                      }
                                    }}
                                    className="p-1.5 text-[#B8B1A4] hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                                    title="Archive Garment"
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
                  </div>

                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 3: CLIENT ORDERS & LOGISTICS TRACKING                          */}
              {/* =================================================================== */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  
                  {/* Status Pills & Search Filter */}
                  <div className="p-4 bg-[#161513] rounded-xl border border-[#2B2925] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                      {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                            orderStatusFilter === st
                              ? 'bg-[#E5C378] text-[#141413]'
                              : 'bg-[#211F1C] text-[#A8A298] hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full md:w-72">
                      <Search className="w-4 h-4 text-[#8C867B] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search by order #, client, tracking..."
                        className="w-full text-xs pl-9 pr-3 py-2 bg-[#0C0B0A] border border-[#332F28] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#E5C378]"
                      />
                    </div>
                  </div>

                  {/* Orders Cards Grid */}
                  <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                      <div className="p-12 text-center text-xs text-[#8C867B] bg-[#161513] rounded-xl border border-[#2B2925]">
                        No client orders match the current filter.
                      </div>
                    ) : (
                      filteredOrders.map((ord) => (
                        <div key={ord.id} className="p-5 bg-[#161513] rounded-xl border border-[#2B2925] hover:border-[#3D3A34] transition-all space-y-4">
                          
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24221E] pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-sm text-[#E5C378]">
                                #{ord.orderNumber}
                              </span>
                              <span className="text-xs text-[#9E978D] font-mono">
                                {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="text-xs font-medium text-white">
                                • {ord.customerName}
                              </span>
                            </div>

                            {/* Status Selector Dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#8C867B] uppercase font-mono">Fulfillment:</span>
                              <select
                                value={ord.status}
                                onChange={(e) => adminUpdateOrderStatus(ord.id, e.target.value as any)}
                                className="text-xs font-semibold uppercase font-mono px-3 py-1 rounded-lg bg-[#211F1C] border border-[#3D3A33] text-white focus:outline-none focus:border-[#E5C378] cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Items and Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            
                            {/* Garments in order */}
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-mono text-[#8C867B] block">
                                Garment Manifest ({ord.items.length})
                              </span>
                              <div className="space-y-1.5">
                                {ord.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-[#DDD7CC] bg-[#1C1A17] p-2 rounded-lg">
                                    <span className="truncate mr-2 font-medium">{item.productName}</span>
                                    <span className="font-mono text-[11px] text-[#A8A298] shrink-0">
                                      {item.quantity}x ({item.size})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery & Contact Details */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] uppercase font-mono text-[#8C867B] block">
                                Shipping Destination
                              </span>
                              <p className="text-white font-medium">{ord.shippingAddress.street}</p>
                              <p className="text-[#A8A298]">
                                {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.postalCode}
                              </p>
                              <p className="text-[#8C867B] font-mono text-[11px]">
                                Phone: {ord.customerPhone}
                              </p>
                            </div>

                            {/* Payment & Tracking */}
                            <div className="space-y-2 bg-[#1C1A17] p-3 rounded-lg border border-[#2B2925]">
                              <div className="flex justify-between items-center">
                                <span className="text-[11px] text-[#8C867B]">Total Remittance:</span>
                                <span className="font-mono font-bold text-sm text-white">{formatINR(ord.total)}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-[#8C867B]">Payment:</span>
                                <span className="font-medium text-[#E5C378]">{ord.paymentMethod}</span>
                              </div>
                              <div className="pt-1 border-t border-[#2B2925]">
                                <span className="text-[10px] uppercase text-[#8C867B] font-mono block mb-1">
                                  Priority Air Waybill:
                                </span>
                                <div className="flex items-center justify-between bg-[#0F0E0D] px-2 py-1 rounded text-xs font-mono text-emerald-400">
                                  <span>{ord.trackingNumber || 'TRK-BD-PENDING'}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard?.writeText(ord.trackingNumber || '');
                                      showToast('Copied', 'Tracking number copied.', 'info');
                                    }}
                                    className="text-[#8C867B] hover:text-white"
                                    title="Copy Tracking ID"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 4: WAREHOUSE HEALTH & INVENTORY CONTROL                         */}
              {/* =================================================================== */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-[#161513] rounded-xl border border-[#2B2925] space-y-1">
                      <span className="text-xs text-[#8C867B] font-mono uppercase">Total Warehouse Units</span>
                      <p className="text-3xl font-bold font-mono text-white">{totalStockUnits}</p>
                      <span className="text-[11px] text-[#A8A298]">Ready for immediate courier dispatch</span>
                    </div>

                    <div className="p-5 bg-[#161513] rounded-xl border border-[#2B2925] space-y-1">
                      <span className="text-xs text-[#8C867B] font-mono uppercase">Inventory Asset Value</span>
                      <p className="text-3xl font-bold font-mono text-[#E5C378]">{formatINR(totalInventoryValue)}</p>
                      <span className="text-[11px] text-[#A8A298]">Finished goods retail valuation</span>
                    </div>

                    <div className="p-5 bg-[#161513] rounded-xl border border-[#2B2925] space-y-1">
                      <span className="text-xs text-[#8C867B] font-mono uppercase">Low Stock Threshold</span>
                      <p className={`text-3xl font-bold font-mono ${lowStockItems.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {lowStockItems.length} Items
                      </p>
                      <span className="text-[11px] text-[#A8A298]">Below minimum atelier threshold (15 units)</span>
                    </div>
                  </div>

                  {/* Stock Grid Table with Quick Increment */}
                  <div className="bg-[#161513] rounded-xl border border-[#2B2925] overflow-hidden">
                    <div className="p-4 border-b border-[#24221E] flex justify-between items-center bg-[#1C1A17]">
                      <h4 className="font-brand font-bold text-sm text-white uppercase tracking-wider">
                        Warehouse Stock Units Management
                      </h4>
                      <span className="text-xs text-[#8C867B] font-mono">
                        Instant Stock Replenishment
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#DDD7CC]">
                        <thead className="border-b border-[#24221E] text-[10px] uppercase font-mono text-[#8C867B] bg-[#141311]">
                          <tr>
                            <th className="py-3 px-4">Garment</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Current Stock</th>
                            <th className="py-3 px-4">Stock Health</th>
                            <th className="py-3 px-4 text-right">Quick Restock Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#24221E]">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-10 rounded bg-[#211F1C] overflow-hidden shrink-0 border border-[#332F28]">
                                    <SafeImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white truncate max-w-xs">{p.name}</p>
                                    <span className="text-[10px] font-mono text-[#8C867B]">SKU: {p.sku}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] text-[#A8A298]">
                                {p.category}
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                                {p.stock}
                              </td>
                              <td className="py-3 px-4">
                                <div className="w-32 bg-[#2B2925] h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      p.stock < 10
                                        ? 'bg-red-500'
                                        : p.stock < 18
                                        ? 'bg-amber-400'
                                        : 'bg-emerald-400'
                                    }`}
                                    style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => adminUpdateStock(p.id, p.stock + 10)}
                                    className="px-2.5 py-1 bg-[#211F1C] hover:bg-[#2E2B26] border border-[#3D3A33] text-white text-[11px] font-mono font-semibold rounded cursor-pointer transition-colors active:scale-95"
                                    title="Add 10 units"
                                  >
                                    +10 Units
                                  </button>
                                  <button
                                    onClick={() => adminUpdateStock(p.id, p.stock + 25)}
                                    className="px-2.5 py-1 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-[11px] font-mono font-semibold rounded cursor-pointer transition-colors active:scale-95 shadow-xs"
                                    title="Add 25 units"
                                  >
                                    +25 Units
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* =================================================================== */}
            {/* LUXURY CONSOLE FOOTER                                               */}
            {/* =================================================================== */}
            <div className="px-6 py-3.5 bg-[#141311] border-t border-[#24221E] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#8C867B]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px]">
                  Encrypted Session Active · Mumbai Atelier Central Hub
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    logout();
                    setPinError('');
                  }}
                  className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                >
                  Lock Console
                </button>
                <span>•</span>
                <button
                  onClick={handleCloseAdmin}
                  className="px-4 py-1.5 bg-[#211F1C] hover:bg-[#2D2A26] border border-[#3D3A33] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            </div>

          </>
        )}

      </div>
    </div>
  );
};
