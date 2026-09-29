import Hero from "@/components/layout/Hero";
import { HomeMenu } from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: "🍕",
      title: "Artisan Stone-Baked",
      desc: "Fermented 48-hour artisan dough baked in 400°C ovens for an irresistible crisp, bubbly crust.",
    },
    {
      icon: "🌿",
      title: "Farm-Fresh Quality",
      desc: "Crafted daily with whole-milk mozzarella, fresh basil, and sun-ripened organic San Marzano tomatoes.",
    },
    {
      icon: "⚡",
      title: "20-Min Flash Delivery",
      desc: "Thermal-insulated dispatch bags ensure your pizza arrives bubbling hot and crispy every single time.",
    },
    {
      icon: "💳",
      title: "Instant Secure Payments",
      desc: "Fast, encrypted checkout powered by Razorpay supporting UPI, credit cards, and digital wallets.",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <Hero />

      {/* Highlights / Why Choose Us Grid */}
      <section className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl mb-4 shadow-xs">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-base text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers Menu Section */}
      <HomeMenu />

      {/* Our Story / About Us Section */}
      <section className="py-12" id="about">
        <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-4xl border border-orange-100/80 p-8 sm:p-12 shadow-card">
          <SectionHeaders subHeader="About Delight Bites" mainHeader="Our Passion for Real Food" />
          
          <div className="max-w-3xl mx-auto mt-6 text-gray-600 text-center space-y-4 text-sm sm:text-base leading-relaxed">
            <p>
              Welcome to <strong>Delight Bites</strong>, where authentic culinary traditions meet modern convenience. We started with a simple belief: fast food shouldn’t compromise on quality, flavor, or wholesome ingredients.
            </p>
            <p>
              Every morning, our chefs handcraft our proprietary dough, simmer rich Italian plum tomato sauces with aromatic herbs, and select only the freshest dairy mozzarella. Whether you are craving our signature Truffle Margherita, a fiery Double Smash Burger, or crisp golden fries, we prepare each meal with heart and craft.
            </p>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mt-10 pt-8 border-t border-orange-100 text-center">
            <div>
              <p className="text-3xl font-extrabold text-primary font-display">15k+</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Pizzas Baked</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary font-display">4.9 ★</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Average Rating</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary font-display">20 Min</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Average Delivery</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary font-display">100%</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Fresh Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="py-8" id="contact">
        <div className="bg-white rounded-4xl border border-orange-100/80 p-8 sm:p-12 shadow-card text-center max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <SectionHeaders
            subHeader="Have Questions or Catering Orders?"
            mainHeader="We're Here to Help"
          />

          <p className="text-gray-500 text-sm max-w-md mx-auto mt-2 mb-8">
            Got a question about our menu, an existing order, or special catering requests? Give our kitchen team a call directly.
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-orange-50/80 border border-orange-200/60 p-4 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-xl shadow-md shadow-orange-500/25">
              📞
            </div>
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Direct Kitchen Hotline
              </span>
              <a
                href="tel:9879847545"
                className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display hover:text-primary transition-colors"
              >
                +91 98798 47545
              </a>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span>📍 Pune, Maharashtra</span>
            <span>•</span>
            <span>🕒 Open Daily 11:00 AM – 11:00 PM</span>
          </div>
        </div>
      </section>
    </div>
  );
}
