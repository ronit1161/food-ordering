import { Toaster } from "react-hot-toast";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import AppContext from "@/components/AppContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "700", "800"],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const metadata = {
  title: "Food Ordering App",
  description: "Best food ordering application",
  // ...
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable} ${jakarta.variable}`}>
      <body>
        <main className="max-w-6xl mx-auto p-4">
          <AppContext>
            <Toaster position="top-right" />
            <Header />
            {children}
            <footer className="border-t border-gray-200 py-12 mt-16 text-center text-gray-500 text-sm">
              <div className="max-w-md mx-auto">
                &copy; 2024 All rights reserved &middot; Pizza House
              </div>
            </footer>
          </AppContext>
        </main>
      </body>
    </html>
  );
}
