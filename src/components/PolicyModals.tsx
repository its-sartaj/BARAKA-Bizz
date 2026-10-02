import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface PolicyModalProps {
  type: 'faq' | 'shipping' | 'privacy' | 'contact' | null;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!type) return null;

  const faqs = [
    {
      q: 'How do I care for my 14.5oz Japanese Selvedge Denim Jacket?',
      a: 'We recommend wearing your selvedge denim jacket for at least 6 months before its first wash to establish authentic personalized fades. When washing, turn inside out, soak in cold water with mild organic detergent, and hang dry away from direct sunlight.'
    },
    {
      q: 'What is your shipping policy and delivery timeframe?',
      a: 'We provide complimentary Express Courier shipping on all orders over ₹2,499. Deliveries within India arrive in 2–4 business days via priority air express with end-to-end tracking.'
    },
    {
      q: 'Can I exchange sizes if the garment fit is not ideal?',
      a: 'Yes. We offer 30-day hassle-free returns and size exchanges on all unworn items with original atelier tags intact. Reach out to our concierge at mr7.shahzad@gmail.com and we will dispatch a prepaid return courier.'
    },
    {
      q: 'What makes BARAKA Bizz. linen and cotton artisanal?',
      a: 'Our linen is harvested exclusively from coastal Normandy farms using traditional dew-retting, while our tees are knitted from 280 GSM long-staple organic cotton. Every piece is constructed with single-needle tailoring and reinforced seams.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E8E4DC] overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B85D36]">
              CLIENT CONCIERGE & CARE
            </span>
            <h3 className="font-brand text-xl font-bold text-[#141413]">
              {type === 'faq' && 'Frequently Asked Questions'}
              {type === 'shipping' && 'Global Shipping & Returns Policy'}
              {type === 'privacy' && 'Privacy & Client Data Policy'}
              {type === 'contact' && 'Contact BARAKA Bizz. Concierge'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#756E65] hover:text-[#141413] rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-sm text-[#544F49] space-y-4">
          
          {/* FAQ */}
          {type === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-[#E8E4DC] rounded-lg overflow-hidden bg-[#FAF8F5]"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-[#141413] flex justify-between items-center gap-4 hover:bg-[#F2ECE1] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-4 h-4 text-[#B85D36] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#756E65] shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="p-4 pt-1 text-xs sm:text-sm text-[#59544E] leading-relaxed border-t border-[#E8E4DC] bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SHIPPING & RETURNS */}
          {type === 'shipping' && (
            <div className="space-y-4 leading-relaxed text-xs sm:text-sm">
              <h4 className="font-brand font-bold text-base text-[#141413]">1. Express Courier Shipping</h4>
              <p>
                All BARAKA Bizz. orders are hand-inspected, wrapped in archival tissue, and placed in certified recyclable packaging. Orders above ₹2,499 qualify for complimentary priority air courier across India.
              </p>

              <h4 className="font-brand font-bold text-base text-[#141413] pt-2">2. 30-Day Effortless Returns</h4>
              <p>
                We want you to treasure every garment. If the fit or drape does not exceed your expectations, you may return or exchange within 30 days of delivery.
              </p>

              <h4 className="font-brand font-bold text-base text-[#141413] pt-2">3. Direct Assistance</h4>
              <p>
                For custom shipping inquiries or address changes, contact our logistics lead directly at <strong className="text-[#141413]">mr7.shahzad@gmail.com</strong> or call <strong className="text-[#141413]">+91 9870168023</strong>.
              </p>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {type === 'privacy' && (
            <div className="space-y-4 leading-relaxed text-xs sm:text-sm">
              <h4 className="font-brand font-bold text-base text-[#141413]">Your Privacy is Paramount</h4>
              <p>
                At BARAKA Bizz., we treat our patrons’ personal information with the same integrity and respect as our garments. We never sell, lease, or monetize your contact or purchase details.
              </p>

              <h4 className="font-brand font-bold text-base text-[#141413] pt-2">Payment Security</h4>
              <p>
                All payment transactions are encrypted using enterprise-grade 256-bit SSL protocols. We do not store full credit card numbers on our local servers.
              </p>

              <h4 className="font-brand font-bold text-base text-[#141413] pt-2">Data Rights</h4>
              <p>
                You may request complete export or deletion of your atelier client records at any time by contacting our privacy compliance team at <strong className="text-[#141413]">mr7.shahzad@gmail.com</strong>.
              </p>
            </div>
          )}

          {/* CONTACT US FORM */}
          {type === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EDF5EE] text-[#3C6E47] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-brand font-bold text-lg text-[#141413]">Message Received</h4>
                  <p className="text-xs text-[#59544E] max-w-sm mx-auto">
                    Thank you. An atelier concierge specialist will reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="mt-2 text-xs text-[#B85D36] font-semibold underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="p-3 bg-[#FAF8F5] rounded border border-[#E8E4DC] text-xs flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="flex items-center gap-2 text-[#141413]">
                      <Mail className="w-4 h-4 text-[#B85D36]" />
                      <span>mr7.shahzad@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#141413]">
                      <Phone className="w-4 h-4 text-[#B85D36]" />
                      <span>+91 9870168023</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shahzad Ali"
                      className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="mr7.shahzad@gmail.com"
                      className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                      Inquiry Subject
                    </label>
                    <select className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]">
                      <option>Sizing & Fit Advice</option>
                      <option>Custom Atelier Order</option>
                      <option>Order Status & Tracking</option>
                      <option>Press & Collaboration</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How may our concierge assist your wardrobe requirements today?"
                      className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Atelier</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E4DC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#141413] hover:bg-[#B85D36] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
