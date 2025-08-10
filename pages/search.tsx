// File: pages/search.tsx

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image, { ImageLoaderProps } from 'next/image'; // Import ImageLoaderProps
import Header from '../components/layout/Header';
import { FaSpinner } from 'react-icons/fa';

// Type definitions remain the same
type Product = {
  id: number;
  name: string;
  brand: string;
  price: string;
  primary_image?: {
    image: string; // This is the partial path, e.g., "image/upload/..."
    alt_text: string;
  } | null;
  average_rating: number;
};

type ApiResponse = {
  results: Product[];
  pagination: {
    total_items: number;
  };
};

// --- FIX START: The official Next.js "loader" function ---
// This function tells next/image how to build the full URL from the partial path.
// It keeps your component's JSX clean and respects the "no hardcoded URLs" rule.
const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  // IMPORTANT: Replace 'dzzwubyqr' with your Cloudinary cloud name.
  const cloudName = 'dvnu42cex'; 
  return `https://res.cloudinary.com/${cloudName}/${src}?w=${width}&q=${quality || 75}`;
};
// --- FIX END ---

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (typeof q === 'string' && q.trim()) {
      setLoading(true);
      setError('');
      
      fetch(`https://martafrica.onrender.com/api/search/?q=${encodeURIComponent(q)}`)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then((data: ApiResponse) => {
          setProducts(data.results || []);
          setTotalResults(data.pagination?.total_items || 0);
        })
        .catch(() => {
          setError('Could not load search results.');
          setProducts([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [q]);

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? price : `$${numPrice.toFixed(2)}`;
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-8 min-h-[60vh]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Search Results</h1>
          {typeof q === 'string' && q.trim() && !loading && (
            <p className="text-gray-600 mt-1">
              Found {totalResults} results for: <span className="font-semibold text-gray-900">"{q}"</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-yellow-500" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group block border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image
                    // --- FIX START: Use the loader prop ---
                    loader={cloudinaryLoader} // Assign our custom loader function
                    src={product.primary_image?.image || ''} // Pass the RAW partial path from the API
                    // --- FIX END ---
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-yellow-600">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                  <p className="text-base font-bold text-gray-900">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold">No Products Found</h2>
            <p className="text-gray-500 mt-2">We couldn't find any products matching your search for "{q}".</p>
          </div>
        )}
      </main>
    </>
  );
};

export default SearchResultsPage;