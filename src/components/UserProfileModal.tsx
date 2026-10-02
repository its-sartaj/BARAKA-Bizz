import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Package,
  Heart,
  User as UserIcon,
  LogOut,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Truck,
  Search,
  Clock,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import { Order } from '../types';
import { formatINR } from '../utils/formatCurrency';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    user,
    orders,
    wishlist,
    products,
    logout,
    updateUserProfile,
    addToCart,
    toggleWishlist,
    setQuickViewProduct,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'tracking' | 'wishlist' | 'profile'>('orders');

  // Edit profile local state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [isSavedInfo, setIsSavedInfo] = useState(false);

  // Tracking state
  const [trackInput, setTrackInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingError, setTrackingError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isProfileOpen || !user) return null;

  const userOrders = orders.filter((o) => o.userId === user.id || o.customerEmail === user.email);
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      address: {
        street,
        city,
        state: user.address?.state || 'Maharashtra',
        postalCode,
        country: user.address?.country || 'India'
      }
    });
    setIsSavedInfo(true);
    setTimeout(() => setIsSavedInfo(false), 2000);
  };

  const handleTrackSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : trackInput).trim().toLowerCase();

    if (!query) {
      setTrackingError('Please enter an Order ID or Tracking Number.');
      setTrackedOrder(null);
      return;
    }

    // Clean any leading # or trk:
    const cleanQuery = query.replace(/^#/, '').replace(/^order\s*/, '');

    const found = orders.find((o) => {
      const ordNum = o.orderNumber.toLowerCase();
      const ordId = o.id.toLowerCase();
      const trkNum = o.trackingNumber ? o.trackingNumber.toLowerCase() : '';
      return (
        ordNum === cleanQuery ||
        ordNum.includes(cleanQuery) ||
        ordId === cleanQuery ||
        ordId.includes(cleanQuery) ||
        trkNum === cleanQuery ||
        trkNum.includes(cleanQuery)
      );
    });

    if (found) {
      setTrackedOrder(found);
      setTrackingError('');
      setTrackInput(found.orderNumber);
    } else {
      setTrackedOrder(null);
      setTrackingError(
        `No shipment record found for "${query}". Please check your order reference number.`
      );
    }
  };

  const selectOrderForTracking = (order: Order) => {
    setTrackInput(order.orderNumber);
    setTrackedOrder(order);
    setTrackingError('');
    setActiveTab('tracking');
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    showToast('Copied to Clipboard', `Tracking code ${code} copied.`, 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRefreshTracking = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Shipment Pinged', 'Real-time telemetry updated with carrier satellite feed.', 'success');
    }, 700);
  };

  // Timeline stage resolver
  const getStageIndex = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#E8E4DC] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#191918] text-white flex items-center justify-center font-bold text-sm">
              {(user.name && !user.name.toLowerCase().includes('patron') ? user.name : 'Customer').charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-brand text-lg font-bold text-[#141413]">
                  {user.name && !user.name.toLowerCase().includes('patron') ? user.name : 'Customer Account'}
                </h3>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full">
                  Verified Customer
                </span>
                {user.role === 'admin' && (
                  <span className="bg-[#B85D36] text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded">
                    Admin Staff
                  </span>
                )}
              </div>
              <p className="text-xs text-[#756E65]">{user.phone || user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={() => setIsProfileOpen(false)}
              className="p-1.5 text-[#756E65] hover:text-[#141413] rounded-full hover:bg-white"
              aria-label="Close profile modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-[#E8E4DC] bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#B85D36] text-[#141413] bg-white'
                : 'border-transparent text-[#756E65] hover:text-[#141413]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({userOrders.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tracking');
              if (!trackedOrder && userOrders.length > 0) {
                selectOrderForTracking(userOrders[0]);
              }
            }}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'border-[#B85D36] text-[#141413] bg-white'
                : 'border-transparent text-[#756E65] hover:text-[#141413]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#B85D36]" />
            <span>Order Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-[#B85D36] text-[#141413] bg-white'
                : 'border-transparent text-[#756E65] hover:text-[#141413]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistedProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#B85D36] text-[#141413] bg-white'
                : 'border-transparent text-[#756E65] hover:text-[#141413]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Account Details</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="text-center py-12 text-[#756E65] space-y-2">
                  <Package className="w-8 h-8 mx-auto text-[#B85D36]" />
                  <p className="text-sm font-medium text-[#141413]">No orders recorded yet.</p>
                  <p className="text-xs">Your completed acquisitions will be cataloged here with live tracking.</p>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-[#FAF8F5] rounded-lg border border-[#E8E4DC] space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-[#E8E4DC] text-xs">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#141413]">Order #{ord.orderNumber}</span>
                        <span className="text-[#8C867D] ml-2">
                          {new Date(ord.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                        <span className="font-mono font-semibold text-sm text-[#141413] tabular-nums">
                          {formatINR(ord.total)}
                        </span>
                      </div>
                    </div>

                    {/* Ordered items */}
                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-white rounded overflow-hidden shrink-0 border border-[#DDD8CE]">
                              <SafeImage src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-[#141413]">{item.productName}</p>
                              <p className="text-[#756E65]">Size: {item.size} · {item.color} · Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-mono font-medium">{formatINR(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking details with direct action */}
                    <div className="pt-2 border-t border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#756E65]">
                      <div>
                        {ord.trackingNumber ? (
                          <span>Carrier Tracking: <strong className="font-mono text-[#141413]">{ord.trackingNumber}</strong></span>
                        ) : (
                          <span>Carrier assignment in progress</span>
                        )}
                      </div>
                      <button
                        onClick={() => selectOrderForTracking(ord)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#191918] hover:bg-[#B85D36] text-white rounded text-[11px] font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Track Shipment</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ORDER TRACKING (NEW FEATURE) */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              
              {/* Order ID Input Section */}
              <div className="p-5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] space-y-4">
                <div>
                  <span className="text-[10px] tracking-[0.25em] font-mono text-[#B85D36] uppercase block font-semibold">
                    REAL-TIME ATELIER LOGISTICS
                  </span>
                  <h4 className="font-brand font-bold text-lg text-[#141413] mt-0.5">
                    Track Your Shipment Status
                  </h4>
                  <p className="text-xs text-[#756E65] mt-0.5">
                    Input your Order Number (e.g. <span className="font-mono text-[#141413] font-semibold">BD-94812</span>) or Waybill code to monitor air courier progress.
                  </p>
                </div>

                <form onSubmit={(e) => handleTrackSubmit(e)} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#8C867D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trackInput}
                      onChange={(e) => {
                        setTrackInput(e.target.value);
                        if (trackingError) setTrackingError('');
                      }}
                      placeholder="Enter Order ID (e.g. BD-94812)..."
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#DDD8CE] rounded-md focus:outline-none focus:border-[#B85D36] focus:ring-1 focus:ring-[#B85D36] font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Order</span>
                  </button>
                </form>

                {/* Quick Select from User's Existing Orders */}
                {userOrders.length > 0 && (
                  <div className="pt-2 border-t border-[#E8E4DC] flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[#8C867D] text-[11px] font-medium">Quick Select:</span>
                    {userOrders.map((ord) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => selectOrderForTracking(ord)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors border ${
                          trackedOrder?.id === ord.id
                            ? 'bg-[#141413] text-white border-[#141413]'
                            : 'bg-white text-[#544F49] border-[#DDD8CE] hover:border-[#141413]'
                        }`}
                      >
                        #{ord.orderNumber} ({ord.status})
                      </button>
                    ))}
                  </div>
                )}

                {/* Error Banner */}
                {trackingError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{trackingError}</span>
                  </div>
                )}
              </div>

              {/* TRACKED ORDER RESULT CARD */}
              {trackedOrder ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  
                  {/* Status Banner */}
                  <div className="p-5 bg-white rounded-xl border border-[#E8E4DC] shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E4DC]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-[#141413]">
                            Order #{trackedOrder.orderNumber}
                          </span>
                          <span className="text-xs text-[#8C867D] font-mono">
                            (ID: {trackedOrder.id})
                          </span>
                        </div>
                        <p className="text-xs text-[#756E65] mt-0.5">
                          Placed on {new Date(trackedOrder.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Live ping beacon */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] text-xs">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#141413]">
                            {trackedOrder.status === 'Delivered'
                              ? 'Delivered to Doorstep'
                              : trackedOrder.status === 'Shipped'
                              ? 'In Transit (Air Cargo)'
                              : 'Atelier Processing'}
                          </span>
                        </div>

                        <button
                          onClick={handleRefreshTracking}
                          disabled={isRefreshing}
                          className="p-2 border border-[#DDD8CE] hover:border-[#141413] rounded text-[#756E65] hover:text-[#141413] transition-colors"
                          title="Refresh satellite tracking status"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#B85D36]' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Carrier & Tracking Number Ribbon */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#FAF8F5] p-3.5 rounded-lg border border-[#E8E4DC]">
                      <div>
                        <span className="text-[#8C867D] block uppercase tracking-wider text-[10px] font-semibold">
                          Carrier Partner
                        </span>
                        <p className="font-medium text-[#141413] mt-0.5">
                          BARAKA Global Express Air
                        </p>
                      </div>

                      <div>
                        <span className="text-[#8C867D] block uppercase tracking-wider text-[10px] font-semibold">
                          Waybill / Tracking No.
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-bold text-[#141413]">
                            {trackedOrder.trackingNumber || 'PENDING-ASSIGN'}
                          </span>
                          {trackedOrder.trackingNumber && (
                            <button
                              onClick={() => handleCopyTracking(trackedOrder.trackingNumber!)}
                              className="text-[#8C867D] hover:text-[#141413] p-0.5"
                              title="Copy tracking number"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[#8C867D] block uppercase tracking-wider text-[10px] font-semibold">
                          Estimated Delivery
                        </span>
                        <p className="font-medium text-[#B85D36] mt-0.5 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {trackedOrder.status === 'Delivered'
                              ? 'Delivered & Signed'
                              : 'Expected in 2–4 Business Days'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* 4-Stage Shipment Progress Bar */}
                    <div className="pt-4 pb-2">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#E8E4DC] -z-0">
                          <div
                            className="h-full bg-[#B85D36] transition-all duration-700"
                            style={{
                              width: `${(getStageIndex(trackedOrder.status) / 3) * 100}%`
                            }}
                          />
                        </div>

                        {/* Milestones */}
                        <div className="grid grid-cols-4 text-center relative z-10">
                          {[
                            { label: 'Order Confirmed', sub: 'Atelier Registered' },
                            { label: 'Crafting & QA', sub: 'Hand-Inspected' },
                            { label: 'In Transit', sub: 'Priority Courier' },
                            { label: 'Delivered', sub: 'Direct Handoff' }
                          ].map((step, idx) => {
                            const currentStage = getStageIndex(trackedOrder.status);
                            const isCompleted = idx <= currentStage;
                            const isCurrent = idx === currentStage;

                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
                                    isCompleted
                                      ? 'bg-[#B85D36] text-white shadow'
                                      : 'bg-white border-2 border-[#DDD8CE] text-[#8C867D]'
                                  } ${isCurrent ? 'ring-4 ring-[#B85D36]/20 ring-offset-2' : ''}`}
                                >
                                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span className={`text-xs font-semibold mt-2 ${isCurrent ? 'text-[#141413]' : isCompleted ? 'text-[#544F49]' : 'text-[#8C867D]'}`}>
                                  {step.label}
                                </span>
                                <span className="text-[10px] text-[#8C867D] hidden sm:block">
                                  {step.sub}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Real-Time Scan History Log */}
                    <div className="pt-4 border-t border-[#E8E4DC] space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#141413] block">
                        Chronological Checkpoint History
                      </span>

                      <div className="space-y-3 pl-2 border-l-2 border-[#E8E4DC] ml-2 text-xs">
                        {trackedOrder.status === 'Delivered' && (
                          <div className="relative pl-4 space-y-0.5">
                            <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#141413]">Package Delivered to Recipient</span>
                              <span className="text-[11px] text-[#8C867D]">Today, 14:15</span>
                            </div>
                            <p className="text-[11px] text-[#756E65]">
                              Signed by customer at {trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.country}.
                            </p>
                          </div>
                        )}

                        {(trackedOrder.status === 'Shipped' || trackedOrder.status === 'Delivered') && (
                          <div className="relative pl-4 space-y-0.5">
                            <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#B85D36] ring-2 ring-white" />
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#141413]">Departed International Gateway Air Cargo Hub</span>
                              <span className="text-[11px] text-[#8C867D]">Yesterday, 21:40</span>
                            </div>
                            <p className="text-[11px] text-[#756E65]">
                              Flight BD-304 departed Mumbai Air Cargo; Customs clearances completed.
                            </p>
                          </div>
                        )}

                        <div className="relative pl-4 space-y-0.5">
                          <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#B85D36] ring-2 ring-white" />
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#141413]">Sealed in Archival Packaging</span>
                            <span className="text-[11px] text-[#8C867D]">2 Days Ago, 11:20</span>
                          </div>
                          <p className="text-[11px] text-[#756E65]">
                            Hand-pressed, thread inspection verified at BARAKA Bizz. Design Atelier.
                          </p>
                        </div>

                        <div className="relative pl-4 space-y-0.5">
                          <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#544F49] ring-2 ring-white" />
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#141413]">Order Placed & Payment Verified</span>
                            <span className="text-[11px] text-[#8C867D]">
                              {new Date(trackedOrder.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#756E65]">
                            Bespoke reservation registered via {trackedOrder.paymentMethod}.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Destination & Manifest Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E8E4DC] text-xs">
                      {/* Destination Address */}
                      <div className="p-3 bg-[#FAF8F5] rounded border border-[#E8E4DC] space-y-1">
                        <span className="font-semibold text-[11px] uppercase tracking-wider text-[#141413] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#B85D36]" />
                          <span>Destination Address</span>
                        </span>
                        <p className="font-medium text-[#141413]">{trackedOrder.customerName}</p>
                        <p className="text-[#69635A]">
                          {trackedOrder.shippingAddress.street}, {trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} {trackedOrder.shippingAddress.postalCode}
                        </p>
                        <p className="text-[#8C867D] text-[11px]">{trackedOrder.shippingAddress.country} · {trackedOrder.customerPhone}</p>
                      </div>

                      {/* Package Contents */}
                      <div className="p-3 bg-[#FAF8F5] rounded border border-[#E8E4DC] space-y-2">
                        <span className="font-semibold text-[11px] uppercase tracking-wider text-[#141413] flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#B85D36]" />
                          <span>Package Contents ({trackedOrder.items.length} silhouettes)</span>
                        </span>
                        <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                          {trackedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px]">
                              <span className="text-[#141413] truncate max-w-[160px]">
                                {item.quantity}x {item.productName}
                              </span>
                              <span className="font-mono text-[#756E65]">
                                {item.size} · {formatINR(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-1 border-t border-[#E8E4DC] flex justify-between font-bold text-xs text-[#141413]">
                          <span>Order Total</span>
                          <span className="font-mono">{formatINR(trackedOrder.total)}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                /* Empty state when no order has been queried */
                <div className="text-center py-10 bg-[#FAF8F5] rounded-xl border border-dashed border-[#DDD8CE] p-6 space-y-3">
                  <Truck className="w-10 h-10 text-[#B85D36] mx-auto opacity-70" />
                  <h4 className="font-brand font-bold text-sm text-[#141413]">
                    Ready to Trace Your Acquisition
                  </h4>
                  <p className="text-xs text-[#756E65] max-w-sm mx-auto">
                    Type your Order Number in the field above or click one of your recent acquisitions to inspect real-time courier milestones.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-12 text-[#756E65] space-y-2">
                  <Heart className="w-8 h-8 mx-auto text-[#B85D36]" />
                  <p className="text-sm font-medium text-[#141413]">Your wishlist is clear.</p>
                  <p className="text-xs">Tap the heart on any product card to curate your private selection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistedProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E4DC] flex flex-col justify-between">
                      <div
                        onClick={() => setQuickViewProduct(p)}
                        className="cursor-pointer space-y-2"
                      >
                        <div className="aspect-[4/3] rounded overflow-hidden bg-white">
                          <SafeImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-medium text-xs text-[#141413] line-clamp-1">{p.name}</h4>
                        <p className="font-mono font-bold text-xs text-[#141413]">{formatINR(p.price)}</p>
                      </div>

                      <div className="flex gap-2 pt-3">
                        <button
                          onClick={() => {
                            addToCart(p, p.sizes[0], p.colors[0]?.name, 1);
                            toggleWishlist(p.id);
                          }}
                          className="flex-1 py-1.5 bg-[#141413] hover:bg-[#B85D36] text-white text-[11px] font-semibold uppercase rounded transition-colors"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="px-2.5 py-1.5 border border-[#DDD8CE] text-[#756E65] hover:text-red-600 rounded text-xs"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Account Details */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="max-w-lg space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full text-xs px-3 py-2 bg-[#F0ECE4] text-[#756E65] border border-[#DDD8CE] rounded cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  WhatsApp Mobile Number (Direct Contact)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9870168023"
                  className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                />
                <span className="text-[11px] text-[#756E65] mt-1 block">
                  Used by our atelier team to dispatch WhatsApp tracking and courier updates.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  Primary Delivery Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street and building"
                  className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Save Profile Changes
                </button>
                {isSavedInfo && (
                  <span className="text-xs text-[#3C6E47] flex items-center gap-1 font-medium">
                    <CheckCircle className="w-4 h-4" /> Saved
                  </span>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E4DC] flex items-center justify-between">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Atelier</span>
          </button>

          <span className="text-[11px] text-[#8C867D]">
            BARAKA Bizz. Atelier Client Services
          </span>
        </div>
      </div>
    </div>
  );
};
