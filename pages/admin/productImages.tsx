import React, { useState, useEffect } from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  description: string;
  primary_image?: string | null;
  images?: string[];
  category: {
    id: number;
    name: string;
  } | null;
  sizes?: string[] | null;
  qty_left: number;
};

const API_BASE = "https://martafrica.onrender.com/api";

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/products/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status}): ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      const productsList: Product[] = Array.isArray(data) ? data : data.results || [];
      
      // Debug: Log the first product's image data
      if (productsList.length > 0) {
        console.log('First product:', productsList[0]);
        console.log('First product primary_image:', productsList[0].primary_image);
        console.log('First product images array:', productsList[0].images);
      }
      
      setProducts(productsList);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resolveImageUrl = (url?: string | null): string => {
    if (!url) return "/placeholder.png";
    
    // If it's already a full URL (Cloudinary), return it directly
    if (url.startsWith("http://") || url.startsWith("https://")) {
      console.log('Using full URL:', url); // Debug log
      return url;
    }
    
    // If it's a relative URL from your API, prepend the API base
    try {
      const base = new URL(API_BASE);
      const fullUrl = `${base.origin}${url.startsWith("/") ? url : `/${url}`}`;
      console.log('Resolved API image URL:', fullUrl); // Debug log
      return fullUrl;
    } catch {
      const fallbackUrl = `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
      console.log('Fallback URL:', fallbackUrl); // Debug log
      return fallbackUrl;
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      const raw = localStorage.getItem("cart") || "[]";
      const cart: { id: number; qty: number; price: number; name: string; image?: string }[] = JSON.parse(raw);
      const existing = cart.find((c) => c.id === product.id);
      
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: product.id,
          qty: 1,
          price: product.price,
          name: product.name,
          image: product.primary_image || product.images?.[0],
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding item to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4F225E]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p>Error: {error}</p>
          <button 
            onClick={fetchProducts} 
            className="mt-4 px-4 py-2 bg-[#4F225E] text-white rounded hover:bg-purple-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">No products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl = resolveImageUrl(product.primary_image ?? product.images?.[0] ?? null);
            console.log(`Product ${product.id} image:`, imageUrl); // Debug log
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative">
                  {imageUrl !== "/placeholder.png" ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        // Fallback to placeholder
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.png";
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', imageUrl);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {product.qty_left <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                      Out of Stock
                    </div>
                  )}
                  {product.qty_left > 0 && product.qty_left <= 5 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
                      Low Stock
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Available Sizes:</p>
                      <div className="flex gap-1 flex-wrap">
                        {product.sizes.map((size, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#4F225E]">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">{product.qty_left} left</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 bg-[#4F225E] text-white py-2 rounded hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.qty_left <= 0}
                  >
                    {product.qty_left <= 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsList;