import SectionHeaders from "@/components/layout/SectionHeaders";
import Link from "next/link";
import React from "react";

const LearnMorePage = () => {
  const values = [
    {
      icon: "🍕",
      title: "Our Story",
      text: "At Delight Bites, we believe in the magic of good food. It all started with a simple dream: to create a place where friends and families could gather around bubbling stone-baked pizzas and juicy flame-grilled burgers that comfort both heart and soul.",
    },
    {
      icon: "🌾",
      title: "What We Offer",
      text: "We take pride in serving up irresistible artisan pizzas, smash burgers, and handcrafted sides, each made with fresh, non-GMO flour, farm mozzarella, and slow-simmered sauces crafted with pride every morning.",
    },
    {
      icon: "💡",
      title: "Culinary Innovation",
      text: "Our kitchen never rests on its laurels. We experiment with artisanal cheese blends, secret seasoning rubs, and seasonal gourmet toppings to ensure every visit gives you something brand new to celebrate.",
    },
    {
      icon: "🤝",
      title: "Community & Quality",
      text: "Delight Bites is more than just a kitchen — we are a community of passionate food lovers. We treat every order with the exact same care and attention as if cooking for our own family.",
    },
  ];

  return (
    <section className="py-8 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-primary mb-3">
          Behind The Kitchen
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-950 font-display">
          Our Story & Philosophy
        </h1>
        <p className="mt-3 text-gray-500 text-sm sm:text-base">
          Delight Bites — where every bite is crafted with passion, authentic stone ovens, and real ingredients.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {values.map((v, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-8 border border-orange-100/80 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl mb-5 shadow-xs">
              {v.icon}
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
              {v.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {v.text}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="mt-14 bg-gradient-to-r from-orange-500 to-primary rounded-4xl p-8 sm:p-12 text-center text-white shadow-xl shadow-orange-500/20">
        <h2 className="text-3xl font-extrabold font-display">
          Ready to taste the difference?
        </h2>
        <p className="mt-2 text-white/90 text-sm max-w-md mx-auto">
          Explore our complete selection of pizzas, burgers, sides, and chilled beverages. Delivered hot to your door in 20 minutes.
        </p>
        <Link
          href="/menu"
          className="inline-flex mt-6 px-8 py-3.5 rounded-full font-bold text-sm bg-white text-primary hover:bg-orange-50 shadow-lg transition-all active:scale-[0.98]"
        >
          Explore Full Menu ➔
        </Link>
      </div>
    </section>
  );
};

export default LearnMorePage;
