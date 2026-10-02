import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowDown, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { SafeImage } from './SafeImage';

export const Hero: React.FC = () => {
  const { setActiveCategory, setQuickViewProduct, products } = useStore();

  const denimJacket = products.find((p) => p.id === 'prod-denim-jacket');
  const linenShirt = products.find((p) => p.id === 'prod-linen-shirt');
  const trousers = products.find((p) => p.id === 'prod-pleated-trousers');

  const scrollToProducts = () => {
    setActiveCategory('All');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStory = () => {
    const el = document.getElementById('our-story-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-10 pb-20 md:pt-16 md:pb-28 border-b border-[#EBE7DF]">
      {/* Subtle artisanal geometric watermark grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#D8D2C6_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Atmospheric warm ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#EBE2D5]/50 to-[#EAD4C2]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Hero Copy & Actions */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            {/* Curated Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFECE4] border border-[#E3DDD1] rounded-full text-xs font-medium text-[#4A4640]">
              <Sparkles className="w-3.5 h-3.5 text-[#B85D36]" />
              <span className="tracking-wider uppercase">Artisanal Autumn / Winter Edition</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-brand text-4xl sm:text-5xl xl:text-6xl font-extrabold text-[#141413] tracking-tight leading-[1.08] text-balance">
                Elevate Your <br className="hidden sm:inline" />
                <span className="italic font-serif font-normal text-[#B85D36]">Everyday</span> Wear.
              </h1>
              <p className="text-lg sm:text-xl text-[#59544E] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed text-balance pt-2">
                Discover <strong className="font-semibold text-[#141413]">BARAKA Bizz.</strong> — Where premium fabric meets timeless design. Small-batch garments constructed by master artisans.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-4 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-sm font-semibold tracking-wider uppercase rounded-md shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group"
              >
                <span>Shop the Collection</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={scrollToStory}
                className="w-full sm:w-auto px-7 py-4 bg-[#EFECE4] hover:bg-[#E4DFD4] text-[#141413] text-sm font-semibold tracking-wider uppercase rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#756E65]" />
                <span>Our Heritage</span>
              </button>
            </div>

            {/* Trust points - clean unboxed editorial list */}
            <div className="pt-6 border-t border-[#E8E4DC] grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-lg font-bold text-[#141413] tabular-nums">14.5<span className="text-xs font-normal text-[#756E65]">oz</span></p>
                <p className="text-xs text-[#756E65] uppercase tracking-wider mt-0.5">Kurabo Selvedge</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#141413] tabular-nums">100<span className="text-xs font-normal text-[#756E65]">%</span></p>
                <p className="text-xs text-[#756E65] uppercase tracking-wider mt-0.5">Normandy Linen</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#141413] tabular-nums">10<span className="text-xs font-normal text-[#756E65]">yr</span></p>
                <p className="text-xs text-[#756E65] uppercase tracking-wider mt-0.5">Stitch Guarantee</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Apparel Showcase with Dynamic Floating Clothing Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] sm:min-h-[520px]">
            {/* Centerpiece Hero Backdrop Portrait */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-[#E3DDD1] bg-[#1E1E1C]">
              <SafeImage
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                alt="BARAKA Bizz. Atelier Editorial Campaign"
                fallbackTitle="BARAKA Bizz. Master Collection"
                category="Autumn / Winter Lookbook"
                className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] tracking-[0.25em] uppercase text-amber-200/90 font-mono">
                  BARAKA Bizz. CORE SILHOUETTE
                </span>
                <p className="text-xl font-bold font-brand tracking-tight mt-1 text-white">
                  Artisanal Craftsmanship
                </p>
                <p className="text-xs text-white/80 mt-0.5">
                  Woven slowly on heritage wooden shuttle looms.
                </p>
              </div>
            </div>

            {/* DYNAMIC FLOATING CARD 1: Selvedge Denim Jacket */}
            {denimJacket && (
              <div
                onClick={() => setQuickViewProduct(denimJacket)}
                className="animate-float-1 absolute -top-4 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-lg shadow-xl border border-[#E8E4DC] max-w-[170px] sm:max-w-[210px] cursor-pointer hover:border-[#B85D36] transition-all z-20 group"
                title="Click to view Denim Jacket"
              >
                <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-[#EFECE6] relative">
                  <SafeImage
                    src={denimJacket.image}
                    alt={denimJacket.name}
                    fallbackTitle="Denim Jacket"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    14.5oz Raw
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-[#141413] truncate group-hover:text-[#B85D36] transition-colors">
                    {denimJacket.name}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#756E65]">
                    <span className="font-mono font-medium text-[#141413]">${denimJacket.price}</span>
                    <span className="text-[9px] text-[#B85D36] font-semibold">Floating Cutout</span>
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC FLOATING CARD 2: Riviera Linen Shirt */}
            {linenShirt && (
              <div
                onClick={() => setQuickViewProduct(linenShirt)}
                className="animate-float-2 absolute -bottom-6 -left-2 sm:left-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-lg shadow-xl border border-[#E8E4DC] max-w-[160px] sm:max-w-[190px] cursor-pointer hover:border-[#B85D36] transition-all z-20 group"
                title="Click to view Riviera Linen Shirt"
              >
                <div className="aspect-square rounded overflow-hidden mb-2 bg-[#EFECE6] relative">
                  <SafeImage
                    src={linenShirt.image}
                    alt={linenShirt.name}
                    fallbackTitle="Linen Shirt"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 bg-[#4A5D4E] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    100% Flax
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-[#141413] truncate group-hover:text-[#B85D36] transition-colors">
                    Riviera Linen Shirt
                  </p>
                  <p className="text-[11px] font-mono text-[#141413] font-medium">${linenShirt.price}</p>
                </div>
              </div>
            )}

            {/* DYNAMIC FLOATING CARD 3: Sartorial Pleated Trousers */}
            {trousers && (
              <div
                onClick={() => setQuickViewProduct(trousers)}
                className="animate-float-3 absolute top-12 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-lg shadow-xl border border-[#E8E4DC] max-w-[160px] sm:max-w-[200px] cursor-pointer hover:border-[#B85D36] transition-all z-20 group"
                title="Click to view Pleated Trousers"
              >
                <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-[#EFECE6] relative">
                  <SafeImage
                    src={trousers.image}
                    alt={trousers.name}
                    fallbackTitle="Pleated Trousers"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    Virgin Wool
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-[#141413] truncate group-hover:text-[#B85D36] transition-colors">
                    Pleated Trousers
                  </p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#141413] font-medium">${trousers.price}</span>
                    <span className="text-[9px] text-[#756E65]">Small Batch</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
