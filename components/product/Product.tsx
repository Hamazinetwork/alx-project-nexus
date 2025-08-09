import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext"; // Import the useCart hook

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
  const { dispatch } = useCart(); // Get the dispatch function from the cart context

  // Helper function to safely format price
  const formatPrice = (price: number | string): string => {
    try {
      const numPrice = typeof price === 'number' ? price : parseFloat(price.toString());
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    } catch {
      return '0.00';
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    // Optionally, show a notification that the item was added
    alert(`${product.name} has been added to your cart!`);
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
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.results) {
          setProducts(data.results);
        } else {
          setProducts([]);
        }
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
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">No products available</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <div className="mb-4">
              {product.primary_image ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
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
              <div className="flex justify-between items-center pt-2">
                <p className="text-[4F225E] font-bold text-xl">
                  ${formatPrice(product.price)}
                </p>
                {product.qty_left !== undefined && (
                  <p className="text-sm text-gray-500">{product.qty_left} left</p>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-[#4F225E] text-white py-2 px-4 rounded hover:bg-purple-800 transition-colors mt-3"
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