import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { formatINR } from '../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const isSaved = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, product.colors[0]?.name, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setQuickViewProduct(product)}
      className="group flex flex-col bg-white rounded-lg border border-[#E8E4DC] overflow-hidden hover:border-[#C4BBB0] hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] bg-[#F4F1EA] overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackTitle={product.name}
          category={product.category}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isSaved
              ? 'bg-[#B85D36] text-white shadow-md'
              : 'bg-white/80 text-[#544F49] hover:bg-white hover:text-[#141413]'
          }`}
          title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : 'stroke-[1.8]'}`} />
        </button>

        {/* Subtle status tag (text, unboxed) */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#191918]/80 text-[#F5F2EB] text-[10px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded backdrop-blur-sm">
            New Arrival
          </div>
        )}
        {!product.isNew && product.isBestSeller && (
          <div className="absolute top-3 left-3 bg-[#B85D36]/90 text-white text-[10px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded backdrop-blur-sm">
            Curated Best
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="px-3.5 py-1.5 bg-white/95 hover:bg-white text-[#141413] text-xs font-semibold tracking-wider uppercase rounded shadow flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-[#756E65]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          {/* Metadata line (clean unboxed text with dot separator) */}
          <div className="flex items-center justify-between text-xs text-[#756E65]">
            <span className="uppercase tracking-wider font-medium">{product.category} · {product.subCategory}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="font-mono tabular-nums text-[#141413]">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-[15px] text-[#141413] group-hover:text-[#B85D36] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Fabric preview snippet */}
          <p className="text-xs text-[#827C73] line-clamp-1">
            {product.fabricDetails}
          </p>
        </div>

        {/* Price & Size / Add to Cart Action */}
        <div className="pt-2 border-t border-[#F0ECE4] space-y-2">
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-[#141413] font-mono tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#9C958A] line-through font-mono tabular-nums">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            {/* In stock badge */}
            <span className="text-[11px] text-[#557A58] font-medium">
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>

          {/* Size Pills & Quick Add */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Size selector buttons */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar"
            >
              {product.sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                    selectedSize === size
                      ? 'border-[#141413] bg-[#141413] text-white'
                      : 'border-[#DDD8CE] text-[#544F49] hover:border-[#141413]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                isAddedRecently
                  ? 'bg-[#3C6E47] text-white'
                  : 'bg-[#141413] hover:bg-[#B85D36] text-white active:scale-95'
              }`}
              title="Quick Add to Shopping Bag"
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
