import React, { useState } from "react";

type ProductType = {
  id: number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
};

const Search: React.FC = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://martafrica.onrender.com/products?search=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      // adjust this if your API returns { results: [...] }
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Search fetch error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      fetchProducts(search.trim());
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 w-full mb-4">
        <input
          type="text"
          placeholder="Search for Products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          className="bg-[#4F225E] text-white px-4 py-2 rounded hover:bg-purple-800"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}

      {!loading && products.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="border rounded p-3 shadow hover:shadow-lg transition"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h3 className="font-bold mt-2">{product.name}</h3>
              {product.price && (
                <p className="text-sm text-gray-600">${product.price}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && products.length === 0 && search && (
        <p>No products found for "{search}"</p>
      )}
    </div>
  );
};

export default Search;

