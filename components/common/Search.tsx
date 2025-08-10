import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaSpinner } from 'react-icons/fa';

// Updated Product type to match the API response
type Product = {
  id: number;
  name: string;
  brand: string;
  price: string;
  // slug: string; // This property is no longer needed for linking
  primary_image?: {
    id: number;
    image: string;
    alt_text: string;
  } | null;
  category: {
    id: number;
    name: string;
  };
  qty_left: number;
  average_rating: number;
  is_in_stock: boolean;
  seller_name: string;
};

// API response structure
type SearchResponse = {
  results: Product[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    has_next: boolean;
    has_previous: boolean;
  };
  filters_applied: {
    query: string;
    [key: string]: string;
  };
};

// Search suggestions structure
type SearchSuggestions = {
  suggestions: {
    products?: string[]; // Mark as optional
    brands?: string[];   // Mark as optional
    categories?: string[];// Mark as optional
  };
};

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce effect for search suggestions
  useEffect(() => {
    if (query.trim().length < 2) { // Only fetch suggestions for 2+ characters
      setSuggestions(null);
      setShowSuggestions(false);
      return;
    }

    const suggestionTimer = setTimeout(() => {
      fetch(`https://martafrica.onrender.com/api/search/suggestions/?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data: SearchSuggestions) => {
          setSuggestions(data);
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions(null));
    }, 200);

    return () => clearTimeout(suggestionTimer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Full page redirect for search results
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };
  
  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    
    // Trigger full search immediately after clicking a suggestion
    setLoading(true);
    setError('');
    fetch(`https://martafrica.onrender.com/api/search/?q=${encodeURIComponent(suggestion)}&minimal=true&page_size=8`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data: SearchResponse) => {
        setResults(data.results || []);
        setShowResults(true);
      })
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  };
  
  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? price : `$${numPrice.toFixed(2)}`;
  };
  
  // --- FIX START ---
  // This function now correctly uses only the product ID to build the URL,
  // matching the `pages/products/[id].tsx` page structure.
  const getProductUrl = (product: Product): string => `/products/${product.id}`;
  // --- FIX END ---

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Search for products, brands, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query) {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              suggestions ? setShowSuggestions(true) : setShowResults(true);
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-3 rounded-r-md hover:bg-yellow-600 transition-colors flex items-center justify-center min-w-[48px]"
          aria-label="Search"
          disabled={loading && !showSuggestions}
        >
          {loading && !showSuggestions ? <FaSpinner className="animate-spin" /> : <FaSearch />}
        </button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-80 overflow-y-auto">
          <div className="p-2">
            {suggestions?.suggestions?.products?.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs text-gray-400 uppercase tracking-wide px-2 mb-1">Products</h5>
                {suggestions.suggestions.products.map((product, i) => (
                  <button key={`p-${i}`} className="block w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded" onClick={() => handleSuggestionClick(product)}>
                    {product}
                  </button>
                ))}
              </div>
            )}
            
            {suggestions?.suggestions?.brands?.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs text-gray-400 uppercase tracking-wide px-2 mb-1">Brands</h5>
                {suggestions.suggestions.brands.map((brand, i) => (
                  <button key={`b-${i}`} className="block w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded" onClick={() => handleSuggestionClick(brand)}>
                    {brand}
                  </button>
                ))}
              </div>
            )}
            
            {suggestions?.suggestions?.categories?.length > 0 && (
              <div>
                <h5 className="text-xs text-gray-400 uppercase tracking-wide px-2 mb-1">Categories</h5>
                {suggestions.suggestions.categories.map((category, i) => (
                  <button key={`c-${i}`} className="block w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded" onClick={() => handleSuggestionClick(category)}>
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && !showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-[60vh] overflow-y-auto">
          {loading && <div className="p-4 text-center text-gray-500">Searching...</div>}
          {error && <div className="p-4 text-center text-red-500">{error}</div>}
          
          {!loading && !error && (
            results.length > 0 ? (
              <>
                <ul>
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={getProductUrl(product)}
                        onClick={() => setShowResults(false)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-100 transition-colors border-b last:border-b-0"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image 
                            src={product.primary_image?.image || '/placeholder.png'} 
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                          <p className="text-sm font-bold text-yellow-600">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="p-3 border-t bg-gray-50 text-center">
                  <Link 
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => setShowResults(false)}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    View all results for "{query}"
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No products found.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Search;