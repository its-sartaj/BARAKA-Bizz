import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, User as UserIcon, Menu, X, Heart } from 'lucide-react';
import { ProductCategory } from '../types';
import { BarakaBizzLogo } from './BarakaBizzLogo';

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    user,
    setIsCartOpen,
    setIsSearchOpen,
    setIsAuthModalOpen,
    setIsProfileOpen,
    setActiveCategory
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (category: ProductCategory | 'Our Story') => {
    setMobileMenuOpen(false);
    if (category === 'Our Story') {
      const el = document.getElementById('our-story-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveCategory(category);
      const el = document.getElementById('products-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAccountClick = () => {
    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E4DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ZONE 1: Brand Wordmark on the left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group flex items-center gap-2 hover:opacity-85 transition-opacity"
              title="BARAKA Bizz."
            >
              <BarakaBizzLogo className="h-9 sm:h-12 w-auto" />
            </button>
          </div>

          {/* ZONE 2: 4-6 Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-widest uppercase font-semibold text-[#544F49]">
            <button
              onClick={() => handleNavClick('New In')}
              className="hover:text-[#141413] transition-colors relative py-1 hover:border-b-2 hover:border-[#B85D36]"
            >
              New In
            </button>
            <button
              onClick={() => handleNavClick('Men')}
              className="hover:text-[#141413] transition-colors relative py-1 hover:border-b-2 hover:border-[#B85D36]"
            >
              Men
            </button>
            <button
              onClick={() => handleNavClick('Women')}
              className="hover:text-[#141413] transition-colors relative py-1 hover:border-b-2 hover:border-[#B85D36]"
            >
              Women
            </button>
            <button
              onClick={() => handleNavClick('Accessories')}
              className="hover:text-[#141413] transition-colors relative py-1 hover:border-b-2 hover:border-[#B85D36]"
            >
              Accessories
            </button>
            <button
              onClick={() => handleNavClick('Our Story')}
              className="hover:text-[#141413] transition-colors relative py-1 hover:border-b-2 hover:border-[#B85D36]"
            >
              Our Story
            </button>
          </nav>

          {/* ZONE 3: Primary Actions (Search, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-[#383531] hover:text-[#141413] hover:bg-[#F0ECE4] rounded-full transition-colors relative group"
              title="Search store (Cmd+K)"
              aria-label="Search garments"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
              <span className="sr-only">Search</span>
            </button>

            {/* Wishlist quick count */}
            <button
              onClick={() => {
                if (user) {
                  setIsProfileOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="hidden sm:flex p-2.5 text-[#383531] hover:text-[#141413] hover:bg-[#F0ECE4] rounded-full transition-colors relative"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B85D36]" />
              )}
            </button>

            {/* Account Icon */}
            <button
              onClick={handleAccountClick}
              className="p-2.5 text-[#383531] hover:text-[#141413] hover:bg-[#F0ECE4] rounded-full transition-colors relative flex items-center gap-1.5"
              title={user ? `Signed in as ${user.name}` : 'Sign In / Account'}
              aria-label="User Account"
            >
              <UserIcon className="w-5 h-5 stroke-[1.75]" />
              {user && (
                <span className="hidden xl:inline text-xs font-semibold text-[#141413] max-w-[85px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 text-[#383531] hover:text-[#141413] hover:bg-[#F0ECE4] rounded-full transition-colors relative group"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B85D36] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-sm transform group-hover:scale-110 transition-transform">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-[#383531] hover:text-[#141413] hover:bg-[#F0ECE4] rounded-full transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8E4DC] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-semibold tracking-wider uppercase text-[#4A4742]">
            <button
              onClick={() => handleNavClick('New In')}
              className="text-left py-2 hover:text-[#B85D36] transition-colors"
            >
              New In
            </button>
            <button
              onClick={() => handleNavClick('Men')}
              className="text-left py-2 hover:text-[#B85D36] transition-colors"
            >
              Men's Collection
            </button>
            <button
              onClick={() => handleNavClick('Women')}
              className="text-left py-2 hover:text-[#B85D36] transition-colors"
            >
              Women's Collection
            </button>
            <button
              onClick={() => handleNavClick('Accessories')}
              className="text-left py-2 hover:text-[#B85D36] transition-colors"
            >
              Artisanal Accessories
            </button>
            <button
              onClick={() => handleNavClick('Our Story')}
              className="text-left py-2 hover:text-[#B85D36] transition-colors"
            >
              Our Story & Heritage
            </button>
          </div>

          <div className="pt-4 border-t border-[#E8E4DC] flex flex-col gap-2.5">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsProfileOpen(true);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#141413] rounded-lg text-center"
              >
                Atelier Account ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#141413] rounded-lg text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
