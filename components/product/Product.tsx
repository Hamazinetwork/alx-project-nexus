import React, { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  images?: { url: string }[];
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://martafrica.onrender.com/api/products/"
        );
        const data = await response.json();
        console.log("Public Products:", data);

        if (!response.ok) throw new Error(JSON.stringify(data));

        // Handle paginated or array response
        if (Array.isArray(data)) setProducts(data);
        else if (data.results) setProducts(data.results);
        else setProducts([]);
      } catch (err) {
        setError("Failed to load products.");
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {error && <p className="text-red-500">{error}</p>}
      {products.map((p) => (
        <div key={p.id} className="bg-white p-4 shadow rounded">
          <h3 className="font-bold text-lg">{p.name}</h3>
          <p>{p.description}</p>
          <p className="text-purple-700 font-bold">${p.price}</p>
          {p.images?.[0] && (
            <img src={p.images[0].url} alt={p.name} className="mt-2 rounded" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
