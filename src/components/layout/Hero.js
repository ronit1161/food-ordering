import Image from "next/image";
import Link from "next/link";
import Right from "../icons/Right";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      {/* Background Glow Accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headlines & CTA */}
        <div className="md:col-span-7 flex flex-col items-start">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-primary text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span>🚀 Free Delivery on orders over ₹499</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 font-display leading-[1.12]">
            Savor Every Slice with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-amber-500">
              Extra Cheese
            </span>{" "}
            & Passion.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
            Handcrafted artisan pizzas, flame-grilled burgers, and crispy sides made from scratch daily with farm-fresh ingredients. Delivered piping hot to your doorstep.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all active:scale-[0.98] group"
            >
              <span>Explore Menu</span>
              <span className="group-hover:translate-x-1 transition-transform">
                <Right />
              </span>
            </Link>
            
            <Link
              href="/learn-more"
              className="inline-flex items-center justify-center font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 text-base px-7 py-3.5 rounded-full shadow-xs hover:border-gray-300 transition-all"
            >
              Our Story
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-10 pt-8 border-t border-orange-100/80 flex items-center gap-6">
            <div className="flex -space-x-2">
              <span className="w-9 h-9 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-xs">🍕</span>
              <span className="w-9 h-9 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-xs">🍔</span>
              <span className="w-9 h-9 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-xs">🍟</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                <span className="font-bold text-gray-900 ml-1">4.9 / 5</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Based on 1,200+ local food lover reviews</p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual with Micro-Cards */}
        <div className="md:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-[420px] aspect-square">
            {/* Soft Ambient Radial Behind the Dish */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 to-amber-300/30 rounded-full blur-2xl transform scale-95" />

            {/* Food Image */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/15 border-4 border-white">
              <Image
                src="/hero-pizza.jpg"
                alt="Gourmet Artisan Pepperoni Pizza"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Micro-Card: Delivery Time */}
            <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-orange-100 flex items-center gap-3 animate-bounce [animation-duration:3s]">
              <span className="w-9 h-9 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-lg">
                ⏱️
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">20 mins</p>
                <p className="text-[11px] text-gray-500">Flash Delivery</p>
              </div>
            </div>

            {/* Floating Micro-Card: Rating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-orange-100 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg font-bold">
                ⭐
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">4.9 Star</p>
                <p className="text-[11px] text-gray-500">Customer Choice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
