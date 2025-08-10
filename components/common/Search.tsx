import React, { useState, useEffect } from "react";

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
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch all products once
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://martafrica.onrender.com/api/products/", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const products = Array.isArray(data) ? data : data.results || [];
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (err) {
        console.error("Fetch error:", err);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      const results = allProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(allProducts);
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

      {loading && <p>Loading products...</p>}

      {!loading && filteredProducts.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
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

      {!loading && filteredProducts.length === 0 && search && (
        <p>No products found for "{search}"</p>
      )}
    </div>
  );
};

export default Search;
