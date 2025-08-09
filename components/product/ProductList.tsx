import React, { useState, useEffect } from "react";

type ProductImage = {
  id: number;
  url: string;
  alt_text: string;
};

type Product = {
  id: number;
  name: string;
  brand: string;
  category_name: string;
  price: number;
  primary_image: ProductImage | null;
  qty_left: number;
  total_reviews: number;
  average_rating: number;
  is_in_stock: boolean;
  created_at: string;
};

type DetailedProduct = Product & {
  description: string;
  sizes: string[];
  total_qty: number;
  total_sold: number;
  images: ProductImage[];
  user_name: string;
  updated_at: string;
};

const ProductL: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://martafrica.onrender.com/api/products/");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.detail || "Failed to fetch products");
      }

      // Handle paginated response or direct array
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F225E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
          <p>{error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-4 bg-[#4F225E] text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Our Products
      </h1>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-200">
                {product.primary_image ? (
                  <img
                    src={product.primary_image.url}
                    alt={product.primary_image.alt_text || product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/placeholder/300/200';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Stock Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_in_stock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  <p className="text-xs text-gray-500">{product.category_name}</p>
                </div>

                <div className="mb-3">
                  <p className="text-xl font-bold text-[#4F225E]">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.qty_left} left in stock
                  </p>
                </div>

                {/* Rating */}
                {product.total_reviews > 0 && (
                  <div className="mb-3">
                    {renderStars(product.average_rating)}
                    <p className="text-xs text-gray-500 mt-1">
                      {product.total_reviews} review{product.total_reviews !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                <button
                  className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                    product.is_in_stock
                      ? 'bg-[#4F225E] text-white hover:bg-purple-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!product.is_in_stock}
                >
                  {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductL;