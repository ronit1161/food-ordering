import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-orange-100 bg-gradient-to-b from-white to-orange-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold font-display text-gray-900 group">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                🍕
              </span>
              <span>Delight<span className="text-primary">Bites</span></span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Crafting artisan pizzas, flame-grilled burgers, and handcrafted sides with premium ingredients, love, and passion. Delivered hot to your doorstep.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Kitchen Open Now
              </span>
              <span className="text-xs text-gray-400">11:00 AM – 11:00 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 font-display">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  Full Menu & Combos
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-primary transition-colors">
                  Our Story & Mission
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-primary transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Menu */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 font-display">
              Popular Picks
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  🍕 Stone-Baked Margherita
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  🌶️ Fiery Pepperoni Blast
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  🍔 Double Smash Cheeseburger
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  🍟 Truffle Parmesan Fries
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Payment Trust */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 font-display">
              Direct Support
            </h4>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="text-primary font-semibold">📞 Phone:</span>
                <a href="tel:9879847545" className="hover:underline font-medium text-gray-900">
                  +91 98798 47545
                </a>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-semibold">📍 Location:</span>
                <span>Camp, Pune, MH 411001</span>
              </p>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-white border border-orange-100 shadow-sm">
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <span className="text-emerald-500 text-sm">🔒</span> 100% Secure Checkout via <strong>Razorpay</strong>
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                UPI, Cards, NetBanking & Wallets accepted.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Delight Bites. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
