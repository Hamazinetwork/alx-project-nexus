import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/router';

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return; // Prevent quantity from being less than 1
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const calculateSubtotal = () => {
    return state.cart.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleProceedToOrder = () => {
    router.push('/Order');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      {state.cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {state.cart.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b py-4">
                <div className="flex items-center">
                  <Image src={item.primary_image} alt={item.name} width={80} height={80} className="rounded-md" />
                  <div className="ml-4">
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-600">${typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="w-16 text-center border rounded-md"
                  />
                  <button onClick={() => handleRemoveItem(item.id)} className="ml-4 text-red-500 hover:text-red-700">
                    Remove
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
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <button
                onClick={handleProceedToOrder}
                className="w-full bg-[#4F225E] text-white py-3 mt-6 rounded-lg hover:bg-purple-800"
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