import React, { useEffect, useState } from 'react';

type ProductType = {
  id: string;
  title: string;
  // add more fields based on your API
};

const Search: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [products, setProducts] = useState<ProductType[]>([]);

  const fetchProducts = async (title: string) => {
    try {
      const response = await fetch(`https://waitingforbackend.com/search?title=${title}`);
      const data = await response.json();

      if (response.ok && data.Search) {
        setProducts(data.Search);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setProducts([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    if (search.trim()) {
      fetchProducts(search.trim());
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        placeholder="Search for Products"
        value={search}
        onChange={handleInputChange}
        className="border px-3 py-2 rounded w-full"
      />
      <button
        className="bg-[#4F225E] hover:bg-[#4F225E]-500 text-white p-3 rounded-full transition-colors"
        onClick={handleSearch}
        aria-label="Search"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Search;
