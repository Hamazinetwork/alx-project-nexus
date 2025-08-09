import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/router';

const OrderPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    shipping_address: '',
    city: '',
    postal_code: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    const orderData = {
      order_items: state.cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      shipping_address: formData.shipping_address,
      city: formData.city,
      postal_code: formData.postal_code,
    };

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // Redirect to login if user is not authenticated
        router.push('/login');
        return;
      }

      const response = await fetch('https://martafrica.onrender.com/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to place order.');
      }

      // Clear the cart on successful order
      dispatch({ type: 'CLEAR_CART' });

      // Redirect to an order confirmation page
      router.push('/order-success');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Place Your Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="shipping_address"
              placeholder="Shipping Address"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Postal Code"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Order</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            {state.cart.map(item => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${( (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-purple-700 text-white py-3 mt-6 rounded-lg hover:bg-purple-800 disabled:bg-gray-400"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;