import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from '@/contexts/CartContext';

export default function App({ Component, pageProps }: AppProps) {
  // Wrap the Component with CartProvider here
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
