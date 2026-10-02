import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [preference, setPreference] = useState<'All' | 'Men' | 'Women'>('All');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      const existing = localStorage.getItem('baraka_bizz_subscribers');
      const subscribers = existing ? JSON.parse(existing) : [];
      if (!subscribers.some((s: { email: string }) => s.email === email.toLowerCase())) {
        subscribers.push({
          email: email.toLowerCase(),
          preference,
          subscribedAt: new Date().toISOString()
        });
        localStorage.setItem('baraka_bizz_subscribers', JSON.stringify(subscribers));
      }
    } catch {
      // safe fallback
    }

    setIsSubscribed(true);
    setError('');
    showToast(
      'Subscribed to Updates',
      `Welcome to the BARAKA Bizz. circle! Use code BARAKA10 for 10% off.`,
      'success'
    );
  };

  return (
    <section className="relative bg-[#F4EFEB] border-t border-[#E5DFD3] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle organic background grid accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#B85D36_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        {/* Micro Category Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-[#E3DDD1] text-[11px] font-mono uppercase tracking-[0.25em] text-[#B85D36]">
          <Sparkles className="w-3 h-3" />
          <span>Atelier Dispatch</span>
        </div>

        {/* Heading & Editorial Subtitle */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#141413] tracking-tight">
            Subscribe for Updates
          </h2>
          <p className="text-sm sm:text-base text-[#59544E] leading-relaxed">
            Be the first to receive notifications on limited batch releases, private atelier trunk shows, and editorial lookbook launches.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-xl mx-auto">
          {isSubscribed ? (
            <div className="p-8 bg-white rounded-xl border border-[#DDD8CE] shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#3C6E47] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-brand text-xl font-bold text-[#141413]">
                Welcome to the BARAKA Bizz. Registry
              </h3>
              <p className="text-xs text-[#59544E] max-w-md mx-auto leading-relaxed">
                Your email <strong className="text-[#141413]">{email}</strong> has been enrolled. Use code <span className="font-mono font-bold bg-[#FAF8F5] px-2 py-0.5 border border-[#DDD8CE] rounded text-[#B85D36]">BARAKA10</span> for 10% off your upcoming acquisition.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubscribed(false);
                    setEmail('');
                  }}
                  className="text-xs text-[#756E65] hover:text-[#141413] underline underline-offset-4 transition-colors"
                >
                  Register another email address
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category preference toggles */}
              <div className="flex items-center justify-center gap-2 text-xs font-medium">
                {(['All', 'Men', 'Women'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPreference(cat)}
                    className={`px-3.5 py-1 rounded-full border text-xs transition-all ${
                      preference === cat
                        ? 'border-[#141413] bg-[#141413] text-white shadow-sm'
                        : 'border-[#DDD8CE] bg-white/70 text-[#544F49] hover:bg-white hover:border-[#141413]'
                    }`}
                  >
                    {cat === 'All' ? 'All Silhouettes' : `${cat}'s Releases`}
                  </button>
                ))}
              </div>

              {/* Input field + Button */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white p-1.5 rounded-lg border border-[#DDD8CE] shadow-sm focus-within:border-[#B85D36] focus-within:ring-2 focus-within:ring-[#B85D36]/20 transition-all">
                <div className="flex items-center pl-3 pr-2 text-[#8C867D] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address..."
                  className="w-full text-sm text-[#141413] placeholder:text-[#9C958A] bg-transparent py-2.5 px-1 focus:outline-none"
                  aria-label="Email address for updates"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold tracking-wider uppercase rounded-md transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group whitespace-nowrap active:scale-[0.98]"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium text-left px-1">
                  {error}
                </p>
              )}

              {/* Minimal reassurance footer */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-[#756E65] pt-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B85D36]" />
                  <span>Zero spam. Handcrafted dispatches only.</span>
                </span>
                <span className="text-[#DDD8CE]">·</span>
                <span>Unsubscribe anytime.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
