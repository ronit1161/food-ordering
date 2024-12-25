import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import AppContext from "@/components/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["100", "400", "500", "700", "900"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <main className="max-w-4xl mx-auto p-4">
          <AppContext>
            <Header />
            {children}
            <footer className="border-t p-8 mt-16 text-center text-gray-500">
              2024 all rights reserved
            </footer>
            <ToastContainer /> {/* Add ToastContainer here */}
          </AppContext>
        </main>
      </body>
    </html>
  );
}
