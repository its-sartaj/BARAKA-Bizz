import React from 'react';
import { Compass, Feather, Scissors, ShieldCheck, Sparkles } from 'lucide-react';
import { SafeImage } from './SafeImage';

export const StorySection: React.FC = () => {
  return (
    <section id="our-story-section" className="py-20 sm:py-28 bg-[#F5F2EB] border-t border-[#E8E4DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Editorial Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-xl border border-[#E3DDD1] bg-[#1E1E1C]">
              <SafeImage
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
                alt="BARAKA Bizz. Textile Heritage"
                fallbackTitle="Textile Craftsmanship"
                category="Artisanal Mills"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-[10px] tracking-[0.25em] uppercase text-amber-200/90 font-mono">
                  OUR ESSENCE
                </span>
                <p className="font-editorial text-2xl italic font-normal text-white mt-1">
                  "Respect the raw fiber, honor the human hand."
                </p>
              </div>
            </div>

            {/* Overlapping Detail Card */}
            <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-white p-5 rounded-lg shadow-xl border border-[#E8E4DC] max-w-[240px] hidden sm:block">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B85D36] block">
                RAW INTEGRITY
              </span>
              <p className="text-xs text-[#141413] font-medium mt-1">
                Zero synthetic fillers. Only pure Japanese selvedge denim, Grade-A Mongolian cashmere, and Normandy flax.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B85D36]">
              <Compass className="w-3.5 h-3.5" />
              <span>The Atelier Manifesto</span>
            </div>

            <h2 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#141413] tracking-tight leading-tight">
              Where Honest Materials Meet Timeless Modernity.
            </h2>

            <div className="space-y-4 text-sm text-[#59544E] leading-relaxed">
              <p>
                Founded on the belief that everyday clothing should feel like a bespoke work of art, <strong className="text-[#141413]">BARAKA Bizz.</strong> rejects the transient cycles of disposable fashion. We bridge the gap between unattainable couture and accessible everyday wear.
              </p>
              <p>
                Every silhouette begins with the world’s most venerable textile mills: 14.5oz selvedge woven on slow Toyoda wooden shuttle looms in Kojima, organic flax gathered from coastal Normandy farms, and full-grain vegetable-tanned hides hand-rubbed with natural oils in Tuscany.
              </p>
            </div>

            {/* Craft pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8E4DC]">
              <div className="flex gap-3">
                <Scissors className="w-5 h-5 text-[#B85D36] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#141413]">
                    Master Pattern Cutters
                  </h4>
                  <p className="text-xs text-[#756E65] mt-0.5">
                    Proportions tuned for effortless movement and razor-sharp drape.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Feather className="w-5 h-5 text-[#B85D36] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#141413]">
                    Low-Impact Dyeing
                  </h4>
                  <p className="text-xs text-[#756E65] mt-0.5">
                    Closed-loop botanical and mineral wash baths that enrich over time.
                  </p>
                </div>
              </div>
            </div>

            {/* Quote attribution */}
            <div className="p-4 bg-white/70 rounded-lg border border-[#E3DDD1] flex items-center justify-between">
              <div>
                <p className="font-brand text-xs font-bold text-[#141413]">BARAKA Bizz. Design Studio</p>
                <p className="text-[11px] text-[#756E65]">Mumbai · Milan · Tokyo Collective</p>
              </div>
              <span className="font-serif italic text-base text-[#B85D36]">Est. 2024</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
