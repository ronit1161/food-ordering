import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppContext from "@/components/AppContext";
import "react-toastify/dist/ReactToastify.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Delight Bites | Artisan Pizzas & Gourmet Fast Food",
  description: "Handcrafted stone-baked pizzas, flame-grilled burgers, and crispy sides made with farm-fresh ingredients and delivered piping hot.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${jakarta.variable} ${outfit.variable}`}>
      <body className="font-sans bg-[#FAF9F5] text-gray-800 antialiased min-h-screen flex flex-col selection:bg-orange-500 selection:text-white">
        <AppContext>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </AppContext>
      </body>
    </html>
  );
}

