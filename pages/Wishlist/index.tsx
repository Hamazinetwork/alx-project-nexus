import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCart } from '../../contexts/CartContext';
import { getWishlist, removeFromWishlist } from '../../services/wishlistService';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';

// Define the structure of a product
interface Product {
  id: number;
  name: string;
  price: string;
  primary_image: string;
}

// Define the structure of a wishlist item
interface WishlistItem {
  id: number; // The unique ID of the wishlist entry
  product: Product;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/Login');
        return;
      }
      try {
        setIsLoading(true);
        const data = await getWishlist(token);
        setWishlistItems(data);
        setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching your wishlist.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlistItems();
  }, [router]);

  // This function now only handles the API call and UI update
  const handleRemoveItem = async (wishlistItemId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('You must be logged in to modify your wishlist.');
      return;
    }

    const originalItems = [...wishlistItems];
    // Optimistically update the UI for a fast user experience
    setWishlistItems(currentItems => currentItems.filter(item => item.id !== wishlistItemId));

    try {
      // Call the API to remove the item from the backend
      await removeFromWishlist(wishlistItemId, token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Failed to remove item from wishlist:', err);
      alert('Failed to remove item. Please try again.');
      // If the API call fails, restore the item to the UI
      setWishlistItems(originalItems);
    }
  };
  
  // --- UPDATED: This function now adds to cart AND removes from wishlist ---
  const handleMoveToCart = (itemToMove: WishlistItem) => {
    // 1. Add the product to the cart using the context
    addItem(itemToMove.product);

    // 2. Remove the item from the wishlist by calling our existing function
    handleRemoveItem(itemToMove.id);

    // 3. Give the user clear feedback
    alert(`Moved ${itemToMove.product.name} to your cart.`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-600">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link href="/" className="bg-yellow-500 text-white font-bold py-2 px-6 rounded hover:bg-yellow-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col">
              <Link href={`/products/${item.product.id}`} className="block">
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={item.product.primary_image || '/images/placeholder.png'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {item.product.name}
                </h2>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  ${parseFloat(item.product.price).toFixed(2)}
                </p>
                <div className="mt-auto pt-4 flex justify-between items-center gap-2">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="flex items-center justify-center px-3 py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                    title="Remove from Wishlist"
                  >
                    <FaTrash className="mr-2" />
                    Remove
                  </button>
                  <button
                    // --- UPDATED: Call the new combined function and pass the whole item ---
                    onClick={() => handleMoveToCart(item)}
                    className="flex items-center justify-center px-3 py-2 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600"
                    title="Add to Cart"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;