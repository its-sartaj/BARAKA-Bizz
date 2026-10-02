import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { StorySection } from './components/StorySection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141413] selection:bg-[#B85D36] selection:text-white">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Section with Floating Apparel */}
          <Hero />

          {/* Curated Product Grid */}
          <ProductGrid />

          {/* Our Story / Artisanal Heritage */}
          <StorySection />

          {/* Minimal Newsletter Section */}
          <NewsletterSection />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Overlays, Drawers & Modals */}
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <AuthModal />
        <UserProfileModal />
        <AdminPanelModal />
        <CheckoutModal />
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}
