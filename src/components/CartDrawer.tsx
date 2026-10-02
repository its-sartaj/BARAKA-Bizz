import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { formatINR } from '../utils/formatCurrency';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    setActiveCategory
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const freeShippingThreshold = 2499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discountAmount));
  const shippingCost = subtotal - discountAmount >= freeShippingThreshold || subtotal === 0 ? 0 : 199;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const ok = applyCoupon(couponCode);
    if (!ok) {
      setCouponError('Invalid voucher code. Try BARAKA10 or LUXURY20.');
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E8E4DC] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B85D36]" />
              <h2 className="font-brand text-lg font-bold text-[#141413]">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#756E65] hover:text-[#141413] hover:bg-[#FAF8F5] rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#F0ECE4] text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#544F49]">
                  <span>Add <strong className="font-mono text-[#141413]">{formatINR(remainingForFreeShipping)}</strong> more for Free Courier across India</span>
                  <span className="font-mono">{Math.round(((freeShippingThreshold - remainingForFreeShipping) / freeShippingThreshold) * 100)}%</span>
                </div>
                <div className="w-full bg-[#DDD8CE] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B85D36] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((freeShippingThreshold - remainingForFreeShipping) / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-[#3C6E47] font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>You unlocked Complimentary Express Global Delivery!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#EFECE4] flex items-center justify-center text-[#756E65]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-medium text-base text-[#141413]">Your shopping bag is empty</h3>
                  <p className="text-xs text-[#756E65] mt-1 max-w-xs mx-auto">
                    Explore our curated collection of selvedge denim, linen shirts, and handcrafted goods.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveCategory('All');
                    const el = document.getElementById('products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-[#141413] hover:bg-[#B85D36] text-white text-xs font-semibold tracking-wider uppercase rounded transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-lg border border-[#E8E4DC] relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#F4F1EA] rounded overflow-hidden shrink-0">
                    <SafeImage
                      src={item.product.image}
                      alt={item.product.name}
                      fallbackTitle={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-[13px] text-[#141413] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#9C958A] hover:text-[#B85D36] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[#756E65] mt-1">
                        <span>Size: <strong className="font-mono text-[#141413]">{item.size}</strong></span>
                        <span>·</span>
                        <span>{item.color}</span>
                      </div>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#DDD8CE] rounded bg-[#FAF8F5]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#756E65] hover:text-[#141413]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-mono font-medium text-xs text-[#141413]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#756E65] hover:text-[#141413]"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono font-semibold text-sm text-[#141413] tabular-nums">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Module */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8E4DC] space-y-4">
              {/* Voucher Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FAF3EC] border border-[#ECD9C6] rounded text-xs">
                  <div className="flex items-center gap-1.5 text-[#B85D36] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> ({appliedCoupon.discountPercent}% Off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#756E65] hover:text-[#141413] text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. BARAKA10)"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      className="flex-1 text-xs uppercase px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#EFECE4] hover:bg-[#E5E0D5] text-[#141413] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600">{couponError}</p>
                  )}
                </form>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#756E65] border-t border-[#F0ECE4] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#141413]">{formatINR(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#B85D36]">
                    <span>Atelier Discount ({appliedCoupon.discountPercent}%)</span>
                    <span className="font-mono tabular-nums">-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Courier</span>
                  <span className="font-mono tabular-nums text-[#141413]">
                    {shippingCost === 0 ? 'Complimentary' : formatINR(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#141413] pt-2 border-t border-[#F0ECE4]">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-base">{formatINR(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-[11px] text-center text-[#8C867D]">
                Taxes included. Handcrafted packaging with certified organic dustbags.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
