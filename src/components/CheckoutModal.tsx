import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowLeft, Download, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { BarakaBizzLogo } from './BarakaBizzLogo';
import { formatINR } from '../utils/formatCurrency';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    appliedCoupon,
    user,
    placeOrder,
    setIsProfileOpen
  } = useStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 9870168023');
  const [street, setStreet] = useState(user?.address?.street || '42 Artisans Boulevard, Suite 5B');
  const [city, setCity] = useState(user?.address?.city || 'Mumbai');
  const [state, setState] = useState(user?.address?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '400050');
  const [country, setCountry] = useState(user?.address?.country || 'India');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('889');

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const shippingCost = subtotal - discountAmount >= 2499 || subtotal === 0 ? 0 : 199;
  const total = subtotal - discountAmount + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !street || !city) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder({
        name,
        email,
        phone,
        street,
        city,
        state,
        postalCode,
        country,
        paymentMethod:
          paymentMethod === 'card'
            ? 'Visa Card Ending in 4242'
            : paymentMethod === 'applepay'
            ? 'Apple Pay Express'
            : 'Cash on Delivery (Verified)'
      });
      setConfirmedOrder(order);
      setIsSubmitting(false);
    }, 700);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-[#E8E4DC] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <BarakaBizzLogo className="h-7 w-auto" />
            <span className="text-xs text-[#8C867D] font-mono">/ ATELIER CHECKOUT</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#756E65] hover:text-[#141413] rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#EDF5EE] text-[#3C6E47] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#B85D36]">
                Order Confirmed & Logged
              </span>
              <h2 className="font-brand text-3xl font-bold text-[#141413]">
                Thank You, {confirmedOrder.customerName}
              </h2>
              <p className="text-sm text-[#59544E] max-w-md mx-auto">
                Your order <strong className="font-mono text-[#141413]">#{confirmedOrder.orderNumber}</strong> has been received by our master artisans. A confirmation has been transmitted to <span className="underline">{confirmedOrder.customerEmail}</span>.
              </p>
            </div>

            {/* Order Receipt Card */}
            <div className="bg-[#FAF8F5] p-5 rounded-lg border border-[#E8E4DC] text-left text-xs space-y-3 max-w-lg mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E4DC]">
                <span className="text-[#756E65]">Tracking Reference:</span>
                <span className="font-mono font-bold text-[#141413]">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E4DC]">
                <span className="text-[#756E65]">Destination:</span>
                <span className="text-[#141413] text-right font-medium">
                  {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E4DC]">
                <span className="text-[#756E65]">Payment Method:</span>
                <span className="text-[#141413]">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-1 font-semibold text-sm">
                <span>Total Paid:</span>
                <span className="font-mono text-[#141413] tabular-nums">{formatINR(confirmedOrder.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  handleClose();
                  setIsProfileOpen(true);
                }}
                className="px-6 py-3 bg-[#141413] hover:bg-[#B85D36] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                View in Order History
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-[#EFECE4] hover:bg-[#E5E0D5] text-[#141413] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="font-brand text-base font-bold text-[#141413] uppercase tracking-wider pb-2 border-b border-[#E8E4DC]">
                  1. Delivery Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                      Full Recipient Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shahzad Ali"
                      className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mr7.shahzad@gmail.com"
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9870168023"
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street, suite, floor"
                      className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Review */}
              <div className="space-y-4">
                <h3 className="font-brand text-base font-bold text-[#141413] uppercase tracking-wider pb-2 border-b border-[#E8E4DC]">
                  2. Payment & Confirmation
                </h3>

                {/* Payment Selection */}
                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-3 rounded border cursor-pointer text-xs transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-[#B85D36] bg-[#FAF3EC]'
                        : 'border-[#DDD8CE] bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#B85D36]" />
                      <span className="font-medium text-[#141413]">Credit / Debit Card</span>
                    </div>
                    <span className="text-[11px] text-[#756E65]">Visa, Mastercard, Amex</span>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DC] rounded text-xs space-y-2">
                      <div>
                        <span className="text-[10px] text-[#756E65] uppercase">Card Number</span>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#DDD8CE] rounded mt-0.5"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-[#756E65] uppercase">Expiry</span>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#DDD8CE] rounded mt-0.5"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#756E65] uppercase">CVC</span>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#DDD8CE] rounded mt-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <label
                    onClick={() => setPaymentMethod('applepay')}
                    className={`flex items-center justify-between p-3 rounded border cursor-pointer text-xs transition-colors ${
                      paymentMethod === 'applepay'
                        ? 'border-[#B85D36] bg-[#FAF3EC]'
                        : 'border-[#DDD8CE] bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#141413]"> Pay / Google Pay</span>
                    </div>
                    <span className="text-[11px] text-[#756E65]">Instant Authorization</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-3 rounded border cursor-pointer text-xs transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#B85D36] bg-[#FAF3EC]'
                        : 'border-[#DDD8CE] bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#B85D36]" />
                      <span className="font-medium text-[#141413]">Cash On Delivery (COD)</span>
                    </div>
                    <span className="text-[11px] text-[#756E65]">Pay at door</span>
                  </label>
                </div>

                {/* Summary Box */}
                <div className="p-4 bg-[#FAF8F5] rounded border border-[#E8E4DC] text-xs space-y-2">
                  <div className="flex justify-between text-[#756E65]">
                    <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span className="font-mono text-[#141413]">{formatINR(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-[#B85D36]">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-mono">-{formatINR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#756E65]">
                    <span>Shipping</span>
                    <span className="font-mono text-[#141413]">
                      {shippingCost === 0 ? 'Complimentary' : formatINR(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#141413] pt-2 border-t border-[#DDD8CE]">
                    <span>Grand Total:</span>
                    <span className="font-mono tabular-nums text-base">{formatINR(total)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Handcrafting Order...</span>
                  ) : (
                    <span>Confirm Order & Pay ({formatINR(total)})</span>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C867D]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3C6E47]" />
                  <span>256-Bit SSL Encrypted & Guaranteed Authentic</span>
                </div>
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
};
