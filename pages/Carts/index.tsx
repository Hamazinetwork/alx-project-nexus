import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext'; // Adjust path if needed
import { useRouter } from 'next/router';
import { FaTrash } from 'react-icons/fa';

const CartPage: React.FC = () => {
  const { cartState, updateQuantity, removeItem, getTotalPrice } = useCart();
  const router = useRouter();

  // --- ADD THIS CHECK: Prevents crash on the first render ---
  // If the context is not yet loaded, show a loading message.
  if (!cartState) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  // Now it's safe to use the cart array
  const { cart } = cartState;

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) {
      // If the user tries to set quantity to 0, remove the item
      removeItem(id);
    } else {
      updateQuantity(id, quantity);
    }
  };
  
  const handleProceedToOrder = () => {
    router.push('/Order');
  };
  
  // Helper to format price strings
  const formatPrice = (price: number | string) => {
      const num = typeof price === 'string' ? parseFloat(price) : price;
      return num.toFixed(2);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
            <Link href="/" className="bg-yellow-500 text-white font-bold py-3 px-6 rounded hover:bg-yellow-600 transition-colors">
                Continue Shopping
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b py-4 px-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="relative w-20 h-20">
                    <Image src={item.primary_image} alt={item.name} layout="fill" objectFit="cover" className="rounded-md" />
                  </div>
                  <div className="ml-4">
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-600">${formatPrice(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                    className="w-16 text-center border rounded-md p-1"
                    min="1"
                  />
                  {/* --- CORRECTED: Call removeItem directly --- */}
                  <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500 hover:text-red-700 p-2" title="Remove item">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                {/* --- CORRECTED: Use the function from the context --- */}
                <span>${formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between mb-4 border-b pb-4">
                <span>Shipping</span>
                <span className='text-green-600 font-semibold'>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${formatPrice(getTotalPrice())}</span>
              </div>
              <button
                onClick={handleProceedToOrder}
                className="w-full bg-purple-700 text-white py-3 mt-6 rounded-lg hover:bg-purple-800 transition-colors"
              >
                Proceed to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;