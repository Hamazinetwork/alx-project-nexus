import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext"; // Import the useCart hook
import { addToWishlist } from "@/services/wishlistService"; // Import the wishlist service
import { FaHeart } from "react-icons/fa"; // Import the heart icon

type Product = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  brand: string;
  primary_image: string;
  images?: string[];
  qty_left: number;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart(); // Get the dispatch function from the cart context

  // Helper function to safely format price
  const formatPrice = (price: number | string): string => {
    try {
      const numPrice = typeof price === 'number' ? price : parseFloat(price.toString());
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    } catch {
      return '0.00';
    }
  };

  // Handler for adding an item to the cart
  const handleAddToCart = (product: Product) => {
    addItem(product); // Call the provided addItem function
    alert(`${product.name} has been added to your cart!`);
  };

  // --- NEW: Handler for adding an item to the wishlist ---
  const handleAddToWishlist = async (productId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in to add items to your wishlist.');
      // Optionally, you could redirect to the login page here
      // import { useRouter } from 'next/router';
      // const router = useRouter();
      // router.push('/Login');
      return;
    }

    try {
      // Call the API service function
      const result = await addToWishlist(productId, token);
      // Provide success feedback to the user
      alert(result.message || 'Product added to wishlist!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Provide error feedback to the user
      console.error('Failed to add to wishlist:', err);
      alert(err.message || 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://martafrica.onrender.com/api/products/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const productList = Array.isArray(data) ? data : data.results || [];
        setProducts(productList);
      } catch (err) {
        setError("Failed to load products.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center p-6">{error}</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">No products available</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow-md rounded-lg flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="relative mb-4">
                {/* --- NEW: Wishlist button --- */}
                <button
                  onClick={() => handleAddToWishlist(product.id)}
                  className="absolute top-2 right-2 z-10 p-2 bg-white/70 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200"
                  title="Add to Wishlist"
                  aria-label="Add to Wishlist"
                >
                  <FaHeart size={20} />
                </button>
                {product.primary_image ? (
                  <div className="relative w-fAull h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={product.primary_image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.brand}</p>
                <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center pt-2">
                <p className="text-purple-700 font-bold text-xl">
                  ${formatPrice(product.price)}
                </p>
                {product.qty_left !== undefined && (
                  <p className="text-sm text-gray-500">{product.qty_left} left</p>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800 transition-colors mt-3"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;