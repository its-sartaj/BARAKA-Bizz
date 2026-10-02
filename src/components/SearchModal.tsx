import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { formatINR } from '../utils/formatCurrency';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    setQuickViewProduct,
    addToCart
  } = useStore();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(450);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const quickKeywords = ['Denim', 'Linen', 'Tee', 'Leather', 'Trousers', 'Cashmere', 'Gabardine'];

  const results = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    const q = query.trim().toLowerCase();
    if (!q) return matchesCategory && matchesPrice;

    const matchesText =
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      p.fabricDetails.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q);

    return matchesCategory && matchesPrice && matchesText;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 pb-8">
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E8E4DC] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8E4DC] flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#8C867D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by garment, fabric (e.g. Selvedge, Linen), or style..."
            className="flex-1 bg-transparent text-sm text-[#141413] focus:outline-none placeholder:text-[#8C867D]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8C867D] hover:text-[#141413] px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#756E65] hover:text-[#141413] rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Keyword & Filter Row */}
        <div className="px-5 py-3 border-b border-[#E8E4DC] bg-[#FAF8F5]/50 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#8C867D] text-[11px] font-semibold uppercase tracking-wider">Quick:</span>
            {quickKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setQuery(kw)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  query.toLowerCase() === kw.toLowerCase()
                    ? 'bg-[#B85D36] text-white'
                    : 'bg-[#EFECE4] text-[#544F49] hover:bg-[#E5E0D5]'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#756E65]">
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-[#DDD8CE] rounded px-2 py-0.5 text-xs text-[#141413]"
            >
              <option value="All">All Categories</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex justify-between items-center text-xs text-[#8C867D] px-1 pb-1">
            <span>Garments Found</span>
            <span className="font-mono tabular-nums">{results.length} pieces</span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-medium text-[#141413]">No garments matched your search query.</p>
              <p className="text-xs text-[#756E65]">Try searching for "Denim", "Linen", or browse all categories.</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setQuickViewProduct(product);
                  setIsSearchOpen(false);
                }}
                className="flex items-center justify-between p-3 rounded-lg border border-[#E8E4DC] hover:border-[#B85D36] hover:bg-[#FAF8F5] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-16 bg-[#F4F1EA] rounded overflow-hidden shrink-0">
                    <SafeImage src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-[#B85D36]">
                      {product.category} · {product.subCategory}
                    </span>
                    <h4 className="font-medium text-sm text-[#141413] group-hover:text-[#B85D36] transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[#756E65] line-clamp-1">
                      {product.fabricDetails}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="font-mono font-bold text-sm text-[#141413] tabular-nums">
                    {formatINR(product.price)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, product.sizes[0], product.colors[0]?.name, 1);
                    }}
                    className="p-2 bg-[#141413] hover:bg-[#B85D36] text-white rounded transition-colors"
                    title="Add to Shopping Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF8F5] border-t border-[#E8E4DC] flex justify-between items-center text-[11px] text-[#756E65] px-5">
          <span>Press ESC or click anywhere outside to dismiss</span>
          <span className="font-mono font-medium text-[#141413]">BARAKA Bizz. SEARCH</span>
        </div>
      </div>
    </div>
  );
};
