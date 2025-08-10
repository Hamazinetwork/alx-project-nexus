import "@/styles/globals.css";
import type { AppProps } from "next/app";
import CartProvider from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          {/* <Header /> */}
          
          {/* Main Content */}
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}