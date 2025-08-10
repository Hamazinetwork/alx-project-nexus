import "@/styles/globals.css";
import type { AppProps } from "next/app";
import CartProvider from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <CartProvider>
        {/* <Header /> */}
        <Component {...pageProps} />
      </CartProvider>
    </ThemeProvider>
  );
}
