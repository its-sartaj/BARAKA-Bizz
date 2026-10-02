import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';
import { SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

const CATEGORIES: ProductCategory[] = ['All', 'New In', 'Men', 'Women', 'Accessories', 'Best Sellers'];

export const ProductGrid: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    activeSort,
    setActiveSort
  } = useStore();

  // Filter products
  const filteredProducts = products.filter((prod) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'New In') return prod.isNew;
    if (activeCategory === 'Best Sellers') return prod.isBestSeller;
    return prod.category === activeCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeSort === 'price-asc') return a.price - b.price;
    if (activeSort === 'price-desc') return b.price - a.price;
    if (activeSort === 'rating') return b.rating - a.rating;
    return 0; // featured default order
  });

  return (
    <section id="products-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E4DC]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B85D36]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Permanent Edition</span>
          </div>
          <h2 className="font-brand text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
            Artisanal Apparel & Essentials
          </h2>
          <p className="text-sm text-[#756E65] max-w-xl">
            Each silhouette is tailored with precision from certified organic and heritage materials, built to outlast seasons.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#756E65]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as any)}
            className="text-xs font-semibold text-[#141413] bg-white border border-[#DDD8CE] rounded-md px-3 py-2 focus:outline-none focus:border-[#B85D36] cursor-pointer"
          >
            <option value="featured">Featured Atelier Picks</option>
            <option value="price-asc">Price: Modest to High</option>
            <option value="price-desc">Price: High to Modest</option>
            <option value="rating">Highest Acclaim / Rating</option>
          </select>
        </div>
      </div>

      {/* Category Segmented Control Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-6 pb-8">
        <div className="flex items-center gap-1.5 p-1 bg-[#EFECE4] rounded-lg overflow-x-auto max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-md transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-[#141413] shadow-sm'
                  : 'text-[#615B54] hover:text-[#141413]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#756E65] font-mono tabular-nums">
          Showing {sortedProducts.length} of {products.length} garments
        </div>
      </div>

      {/* Product Cards Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-[#DDD8CE] p-8">
          <p className="text-base font-medium text-[#141413]">No garments found in this category.</p>
          <p className="text-xs text-[#756E65] mt-1">Please select another collection or reset your filter.</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-4 px-4 py-2 bg-[#141413] text-white text-xs font-semibold uppercase tracking-wider rounded"
          >
            View All Pieces
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Banner quote / editorial craftsmanship break */}
      <div className="mt-20 p-8 sm:p-12 rounded-xl bg-[#191918] text-[#FAF8F5] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(#B85D36_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#B85D36] font-semibold">
            THE BARAKA BIZZ. PHILOSOPHY
          </span>
          <h3 className="font-editorial italic text-2xl sm:text-3xl font-normal leading-snug">
            "True luxury is not about excess. It is the uncompromised tactile weight of 280 GSM cotton, the slow patina of Tuscan leather, and seams built to endure decades."
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#B3ACA0]">
            — Creative Director, BARAKA Bizz. Atelier
          </p>
        </div>
      </div>
    </section>
  );
};
