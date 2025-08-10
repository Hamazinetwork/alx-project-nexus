import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaShippingFast, FaCity, FaMapPin, FaCreditCard } from 'react-icons/fa';

// A small, reusable spinner component
const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const OrderPage: React.FC = () => {
  // --- CORRECTED: Use the actual values from your context ---
  const { cartState, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    shipping_address: '',
    city: '',
    postal_code: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- ADD THIS CHECK: Prevents crash on initial render & empty cart ---
  if (!cartState) {
    return <div className="min-h-screen bg-gray-900 text-center text-white p-10">Loading...</div>;
  }
  
  const { cart } = cartState;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.shipping_address || !formData.city || !formData.postal_code) {
      setError("Please fill in all shipping details.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/Login'); // Redirect to login if not authenticated
        return;
      }

      const orderData = {
        order_items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        shipping_address: formData.shipping_address,
        city: formData.city,
        postal_code: formData.postal_code,
      };

      const response = await fetch('https://martafrica.onrender.com/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to place order.');
      }

      // --- CORRECTED: Call clearCart() directly ---
      clearCart();
      
      // Assuming you have an order success page
      router.push('/order-success');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
      return (
          <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
              <p className="text-gray-300 mb-8">You have no items in your cart to order.</p>
              <Link href="/" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg py-3 px-8 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
                  Continue Shopping
              </Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Shipping Information Card */}
          <div className="lg:col-span-3 bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Shipping Information</h2>
            <div className="space-y-6">
              <div className="relative"><FaShippingFast className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><input type="text" name="shipping_address" placeholder="Shipping Address" onChange={handleInputChange} className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition py-2 pl-10"/></div>
              <div className="relative"><FaCity className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><input type="text" name="city" placeholder="City" onChange={handleInputChange} className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition py-2 pl-10"/></div>
              <div className="relative"><FaMapPin className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><input type="text" name="postal_code" placeholder="Postal Code" onChange={handleInputChange} className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition py-2 pl-10"/></div>
            </div>
          </div>
          
          {/* Order Summary Card */}
          <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 h-fit">
            <h2 className="text-2xl font-semibold text-white mb-6">Your Order</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-gray-300">
                  <span className="truncate pr-4">{item.name} <span className="text-gray-400 text-sm">x{item.quantity}</span></span>
                  <span className="font-mono">${( (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-gray-700 my-6"></div>
            <div className="flex justify-between font-bold text-xl text-white">
              <span>Total</span>
              <span className="font-mono">${getTotalPrice().toFixed(2)}</span>
            </div>
            
            {error && <p className="bg-red-500/20 text-red-300 text-sm rounded-lg p-3 text-center mt-6">{error}</p>}
            
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full flex justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg py-3 px-4 mt-6 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'Place Order Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;