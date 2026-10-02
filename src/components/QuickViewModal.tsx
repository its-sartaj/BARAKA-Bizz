import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  ShoppingBag,
  Check,
  MessageSquarePlus,
  BadgeCheck,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import { formatINR } from '../utils/formatCurrency';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    getProductReviews,
    addProductReview,
    user
  } = useStore();

  const [activeModalTab, setActiveModalTab] = useState<'details' | 'reviews'>('details');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Review Form State
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerNameInput, setReviewerNameInput] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [reviewError, setReviewError] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[0] || 'Standard');
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Standard');
      setQuantity(1);
      setIsAdded(false);
      setActiveModalTab('details');
      setIsWritingReview(false);
      setRatingInput(5);
      setReviewerNameInput(user?.name || '');
      setCommentInput('');
      setReviewError('');
      setReviewSuccess(false);
    }
  }, [quickViewProduct, user]);

  if (!quickViewProduct) return null;

  const isSaved = isWishlisted(quickViewProduct.id);
  const productReviews = getProductReviews(quickViewProduct.id);

  // Rating descriptors
  const ratingLabels: Record<number, string> = {
    1: '1 Star — Needs Improvement',
    2: '2 Stars — Fair Fit & Quality',
    3: '3 Stars — Good Standard',
    4: '4 Stars — Very Good Tailoring',
    5: '5 Stars — Exceptional Artisanal Masterpiece'
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setReviewError('Please write your review feedback.');
      return;
    }
    if (commentInput.trim().length < 10) {
      setReviewError('Review feedback should be at least 10 characters.');
      return;
    }

    addProductReview(
      quickViewProduct.id,
      ratingInput,
      commentInput,
      reviewerNameInput || user?.name || 'Verified Customer'
    );

    setReviewSuccess(true);
    setCommentInput('');
    setReviewError('');
    setTimeout(() => {
      setReviewSuccess(false);
      setIsWritingReview(false);
    }, 1800);
  };

  // Calculate star distribution
  const totalReviewsCount = productReviews.length;
  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = productReviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#E8E4DC] overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-30 p-2 text-[#756E65] hover:text-[#141413] bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Stage */}
        <div className="md:w-1/2 bg-[#F6F3EC] relative min-h-[260px] md:min-h-full flex items-center justify-center shrink-0">
          <SafeImage
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            fallbackTitle={quickViewProduct.name}
            category={quickViewProduct.category}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => toggleWishlist(quickViewProduct.id)}
            className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isSaved
                ? 'bg-[#B85D36] text-white'
                : 'bg-white/80 text-[#544F49] hover:bg-white hover:text-[#141413]'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : 'stroke-[1.8]'}`} />
          </button>
        </div>

        {/* Product Details & Reviews Column */}
        <div className="md:w-1/2 flex flex-col justify-between overflow-hidden bg-white">
          
          {/* Top Segmented Tab Header */}
          <div className="flex border-b border-[#E8E4DC] bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider px-6">
            <button
              onClick={() => setActiveModalTab('details')}
              className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeModalTab === 'details'
                  ? 'border-[#B85D36] text-[#141413] bg-white'
                  : 'border-transparent text-[#756E65] hover:text-[#141413]'
              }`}
            >
              <span>Garment Overview</span>
            </button>

            <button
              onClick={() => setActiveModalTab('reviews')}
              className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeModalTab === 'reviews'
                  ? 'border-[#B85D36] text-[#141413] bg-white'
                  : 'border-transparent text-[#756E65] hover:text-[#141413]'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="font-mono text-[10px] bg-[#EFECE4] px-1.5 py-0.5 rounded text-[#141413]">
                {productReviews.length}
              </span>
            </button>
          </div>

          {/* TAB 1: PRODUCT DETAILS & PURCHASE */}
          {activeModalTab === 'details' && (
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-4">
                {/* Category & Rating Pill */}
                <div className="flex items-center justify-between text-xs text-[#756E65]">
                  <span className="uppercase tracking-widest font-semibold text-[#B85D36]">
                    {quickViewProduct.category} · {quickViewProduct.subCategory}
                  </span>
                  
                  {/* Clickable star summary that jumps to reviews tab */}
                  <button
                    onClick={() => setActiveModalTab('reviews')}
                    className="flex items-center gap-1.5 hover:text-[#141413] transition-colors group cursor-pointer"
                    title="View customer reviews"
                  >
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="font-mono font-medium text-[#141413] tabular-nums">
                      {quickViewProduct.rating.toFixed(1)}
                    </span>
                    <span className="group-hover:underline">
                      ({quickViewProduct.reviewsCount} reviews)
                    </span>
                  </button>
                </div>

                {/* Title & Price */}
                <div>
                  <h2 className="font-brand text-2xl font-bold text-[#141413]">
                    {quickViewProduct.name}
                  </h2>
                  <div className="flex items-baseline gap-3 mt-1.5">
                    <span className="text-2xl font-bold text-[#141413] font-mono tabular-nums">
                      {formatINR(quickViewProduct.price)}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-[#9C958A] line-through font-mono tabular-nums">
                        {formatINR(quickViewProduct.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs text-[#8C867D] font-mono">
                      SKU: {quickViewProduct.sku}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#59544E] leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Fabric & Origin note */}
                <div className="p-3 bg-[#FAF8F5] rounded-md border border-[#E8E4DC] text-xs space-y-1">
                  <span className="font-semibold text-[#141413] block uppercase tracking-wider text-[10px]">
                    Artisanal Fabric Details
                  </span>
                  <p className="text-[#69635A]">{quickViewProduct.fabricDetails}</p>
                </div>

                {/* Color Swatches */}
                {quickViewProduct.colors.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#141413] flex items-center justify-between">
                      <span>Selected Color:</span>
                      <span className="font-normal text-[#756E65]">{selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                            selectedColor === c.name
                              ? 'border-[#B85D36] ring-1 ring-[#B85D36]'
                              : 'border-transparent hover:border-[#DDD8CE]'
                          }`}
                          title={c.name}
                        >
                          <span
                            className="w-full h-full rounded-full border border-black/10 block"
                            style={{ backgroundColor: c.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#141413] flex items-center justify-between">
                    <span>Select Size:</span>
                    <span className="font-normal text-[#756E65]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-mono font-medium rounded border transition-colors ${
                          selectedSize === size
                            ? 'border-[#141413] bg-[#141413] text-white'
                            : 'border-[#DDD8CE] text-[#544F49] hover:border-[#141413]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#141413]">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-[#DDD8CE] rounded w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-sm text-[#756E65] hover:text-[#141413] hover:bg-[#FAF8F5]"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-mono tabular-nums font-semibold text-[#141413]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(quickViewProduct.stock, q + 1))}
                      className="px-3 py-1.5 text-sm text-[#756E65] hover:text-[#141413] hover:bg-[#FAF8F5]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Button & Guarantees */}
              <div className="space-y-4 pt-4 border-t border-[#E8E4DC]">
                <button
                  onClick={handleAddToCart}
                  disabled={quickViewProduct.stock === 0}
                  className={`w-full py-3.5 px-6 rounded-md text-sm font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm ${
                    isAdded
                      ? 'bg-[#3C6E47] text-white'
                      : 'bg-[#B85D36] hover:bg-[#A34E2A] text-white active:scale-[0.99]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag — {formatINR(quickViewProduct.price * quantity)}</span>
                    </>
                  )}
                </button>

                {/* Value Props */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-[#756E65] uppercase tracking-wider">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#B85D36]" />
                    <span>Express Courier</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B85D36]" />
                    <span>10-Yr Seam Care</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-[#B85D36]" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVIEWS & RATING SYSTEM */}
          {activeModalTab === 'reviews' && (
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              
              {/* Rating Overview Scorecard */}
              <div className="p-4 bg-[#FAF8F5] rounded-lg border border-[#E8E4DC] flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center sm:border-r sm:border-[#E8E4DC] sm:pr-6 shrink-0">
                  <span className="font-mono text-4xl font-extrabold text-[#141413] block">
                    {quickViewProduct.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(quickViewProduct.rating)
                            ? 'fill-current'
                            : 'text-amber-200 stroke-[1.5]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#756E65]">
                    Based on {productReviews.length} customer reviews
                  </span>
                </div>

                {/* Star Distribution Bars */}
                <div className="flex-1 w-full space-y-1 text-xs">
                  {starCounts.map(({ stars, count, percentage }) => (
                    <div key={stars} className="flex items-center gap-2 text-[#756E65]">
                      <span className="w-12 text-right font-mono text-[11px]">{stars} stars</span>
                      <div className="flex-1 bg-[#DDD8CE] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-[11px] tabular-nums">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Toggle Write Review Form */}
              <div className="flex items-center justify-between pt-1">
                <h3 className="font-brand font-bold text-base text-[#141413]">
                  Customer Reviews
                </h3>
                {!isWritingReview && (
                  <button
                    onClick={() => {
                      setIsWritingReview(true);
                      setReviewSuccess(false);
                    }}
                    className="px-3.5 py-1.5 bg-[#141413] hover:bg-[#B85D36] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Write Feedback</span>
                  </button>
                )}
              </div>

              {/* Interactive Write Review Form */}
              {isWritingReview && (
                <form
                  onSubmit={handleSubmitReview}
                  className="p-4 sm:p-5 bg-white border border-[#B85D36]/40 rounded-lg shadow-sm space-y-4 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#141413]">
                      Submit Your Review
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="text-xs text-[#756E65] hover:text-[#141413]"
                    >
                      Cancel
                    </button>
                  </div>

                  {reviewError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                      {reviewError}
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#3C6E47] text-xs rounded flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 shrink-0" />
                      <span>Thank you! Your feedback has been recorded and published.</span>
                    </div>
                  )}

                  {/* Star Rating Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#544F49] block">
                      Your Rating (1 to 5 Stars):
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled =
                            hoverRating > 0 ? star <= hoverRating : star <= ratingInput;
                          return (
                            <button
                              type="button"
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setRatingInput(star)}
                              className="p-1 hover:scale-110 transition-transform focus:outline-none"
                              aria-label={`Rate ${star} star`}
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  isFilled
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-[#DDD8CE] stroke-[1.5]'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-medium text-[#756E65]">
                        {ratingLabels[hoverRating || ratingInput]}
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#544F49] block mb-1">
                      Your Name / Handle:
                    </label>
                    <input
                      type="text"
                      value={reviewerNameInput}
                      onChange={(e) => setReviewerNameInput(e.target.value)}
                      placeholder={user ? user.name : 'e.g. Marcus Laurent'}
                      className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>

                  {/* Review Comment */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#544F49] block mb-1">
                      Review Feedback & Tailoring Notes:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Comment on the fabric handfeel, fit, weight, and construction details..."
                      className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#8C867D]">
                      Verified as an authentic BARAKA Bizz customer
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>
              )}

              {/* List of Reviews */}
              <div className="space-y-3">
                {productReviews.length === 0 ? (
                  <div className="text-center py-10 bg-[#FAF8F5] rounded-lg border border-dashed border-[#DDD8CE] p-6 space-y-2">
                    <p className="text-xs font-medium text-[#141413]">No client reviews yet.</p>
                    <p className="text-[11px] text-[#756E65]">
                      Be the first customer to share tailoring notes and review this silhouette.
                    </p>
                    <button
                      onClick={() => setIsWritingReview(true)}
                      className="mt-2 px-3 py-1.5 bg-[#141413] text-white text-[11px] font-semibold uppercase rounded"
                    >
                      Write First Review
                    </button>
                  </div>
                ) : (
                  productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-[#FAF8F5] rounded-lg border border-[#E8E4DC] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#141413]">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#3C6E47] font-medium bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              <BadgeCheck className="w-3 h-3" />
                              <span>Verified Customer</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8C867D]">
                          {new Date(rev.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating ? 'fill-current' : 'text-[#DDD8CE] stroke-[1]'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-[#544F49] leading-relaxed pt-0.5">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
