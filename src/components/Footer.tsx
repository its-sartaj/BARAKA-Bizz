import React, { useState } from 'react';
import { Mail, Phone, Instagram, Facebook, ArrowRight, Heart, Sparkles, Shield } from 'lucide-react';
import { PolicyModals } from './PolicyModals';
import { useStore } from '../context/StoreContext';
import { BarakaBizzLogo } from './BarakaBizzLogo';

// Custom Pinterest SVG icon
const PinterestIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.053.224-.174.271-.401.165-1.495-.695-2.43-2.878-2.43-4.632 0-3.774 2.743-7.239 7.906-7.239 4.15 0 7.377 2.957 7.377 6.91 0 4.124-2.599 7.442-6.207 7.442-1.212 0-2.352-.63-2.743-1.377l-.746 2.846c-.27 1.036-1.002 2.334-1.492 3.127C9.889 23.821 10.927 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'faq' | 'shipping' | 'privacy' | 'contact' | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const { setActiveCategory, setIsAdminOpen } = useStore();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterDone(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterDone(false), 4000);
  };

  return (
    <>
      <footer className="bg-[#141413] text-[#FAF8F5] pt-16 pb-12 border-t border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            
            {/* Col 1 & 2: Brand Identity & Manifesto */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <BarakaBizzLogo inverted className="h-10 sm:h-12 w-auto" />
                <span className="text-[10px] tracking-[0.25em] font-mono text-[#B85D36] uppercase block font-semibold">
                  AFFORDABLE LUXURY & ARTISANAL WEAR
                </span>
              </div>

              <p className="text-xs text-[#A8A298] leading-relaxed max-w-sm">
                Where premium fabric meets timeless design. Thoughtfully crafted in limited runs with Japanese selvedge denim, pure Normandy linen, and handcrafted leather.
              </p>

              {/* Direct Contact Details from Prompt */}
              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-[#D1C9BC]">
                  <Mail className="w-4 h-4 text-[#B85D36]" />
                  <a href="mailto:mr7.shahzad@gmail.com" className="hover:text-white transition-colors">
                    mr7.shahzad@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-[#D1C9BC]">
                  <Phone className="w-4 h-4 text-[#B85D36]" />
                  <a href="tel:+919870168023" className="hover:text-white transition-colors">
                    +91 9870168023
                  </a>
                </div>
              </div>
            </div>

            {/* Col 3: Collections */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#B85D36]">
                Collections
              </h4>
              <ul className="space-y-2 text-xs text-[#A8A298]">
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory('New In');
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    New Arrivals
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory('Men');
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Men's Tailoring
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory('Women');
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Women's Atelier
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory('Accessories');
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Handcrafted Leather & Goods
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory('Best Sellers');
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Permanent Collection
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Quick Links from Prompt */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#B85D36]">
                Client Concierge
              </h4>
              <ul className="space-y-2 text-xs text-[#A8A298]">
                <li>
                  <button
                    onClick={() => setActiveModal('faq')}
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('shipping')}
                    className="hover:text-white transition-colors"
                  >
                    Shipping & Returns
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li className="pt-1">
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Studio Dashboard</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: Newsletter & Social Media */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#B85D36]">
                Atelier Dispatch
              </h4>
              <p className="text-xs text-[#A8A298]">
                Receive private release dates, fabric chronicles, and invitations to small-batch drops.
              </p>

              {newsletterDone ? (
                <div className="p-3 bg-white/10 rounded text-xs text-amber-200">
                  Welcome to the Atelier. Use code <strong className="text-white">BARAKA10</strong> at checkout.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="flex">
                    <input
                      type="email"
                      required
                      placeholder="Enter email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-l px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#B85D36]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#B85D36] hover:bg-[#A34E2A] text-white rounded-r transition-colors flex items-center justify-center"
                      title="Subscribe to dispatch"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* Social Media Icons (Instagram, Facebook, Pinterest) */}
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider text-[#A8A298] block mb-2 font-medium">
                  Follow Our Visual Journal:
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#B85D36] flex items-center justify-center text-white transition-colors"
                    title="Instagram"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#B85D36] flex items-center justify-center text-white transition-colors"
                    title="Facebook"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#B85D36] flex items-center justify-center text-white transition-colors"
                    title="Pinterest"
                    aria-label="Pinterest"
                  >
                    <PinterestIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar with Footer Note from Prompt */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C867D]">
            <p>© {new Date().getFullYear()} BARAKA Bizz. All Rights Reserved.</p>
            
            {/* Required Footer Note */}
            <p className="flex items-center gap-1.5 font-medium text-white/80 text-center">
              <span>Designed and Coded with Heart by BARAKA Bizz. Creative Team.</span>
              <Heart className="w-3.5 h-3.5 text-[#B85D36] fill-current" />
            </p>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-white/60">Crafted with Sustainable Ethics</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive Policy & Contact Modals */}
      <PolicyModals type={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
};
