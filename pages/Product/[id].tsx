// File: pages/products/[id].tsx

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header'; // Adjust path as needed
import Footer from '@/components/layout/Footer'; // Adjust path as needed
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

// Define the full Product type for the detail page
type ProductDetail = {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: string;
  images: { id: number; image: string; alt_text: string }[];
  category: { id: number; name: string };
  is_in_stock: boolean;
  average_rating: number;
  seller_name: string;
};

// The props your page will receive
interface ProductPageProps {
  product: ProductDetail | null;
  error?: string;
}

const ProductDetailPage: NextPage<ProductPageProps> = ({ product, error }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(product?.images[0]?.image || null);
  const [quantity, setQuantity] = useState(1);

  // Fallback state while page is loading on the server
  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-5xl text-yellow-500" />
      </div>
    );
  }

  // Error state if product fetch failed
  if (error || !product) {
    return (
      <>
        <Header />
        <main className="text-center py-20 container mx-auto">
          <h1 className="text-2xl font-bold text-red-500">Product Not Found</h1>
          <p className="text-gray-600 mt-2">{error || "The product you are looking for does not exist."}</p>
          <Link href="/" className="mt-6 inline-block bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600">
            Go Back Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Successful render of the product
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square w-full border rounded-lg overflow-hidden mb-4">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map(img => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image)}
                  className={`relative aspect-square w-full rounded-md overflow-hidden border-2 transition ${
                    selectedImage === img.image ? 'border-yellow-500' : 'border-transparent'
                  }`}
                >
                  <Image src={img.image} alt={img.alt_text} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-md text-gray-500 mb-4">Sold by {product.seller_name}</p>
            
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-yellow-600">${parseFloat(product.price).toFixed(2)}</span>
            </div>

            <div
              className="prose prose-sm max-w-none text-gray-600 mb-6"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border rounded">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg">-</button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-lg">+</button>
              </div>
              <button className="flex-1 bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                <FaShoppingCart />
                Add to Cart
              </button>
            </div>

            <div className={`font-semibold ${product.is_in_stock ? 'text-green-600' : 'text-red-600'}`}>
              {product.is_in_stock ? '✔ In Stock' : '❌ Out of Stock'}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// This function runs on the server for every request to this page
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the 'id' from the URL parameters
  const { id } = context.params!;

  // Validate that 'id' is a number
  if (!id || isNaN(Number(id))) {
    return { props: { product: null, error: 'Invalid Product ID.' } };
  }

  try {
    // Fetch the product using its ID
    const res = await fetch(`https://martafrica.onrender.com/api/products/${id}/`);
    
    if (!res.ok) {
      if (res.status === 404) {
        return { props: { product: null, error: 'Product not found.' } };
      }
      throw new Error('API request failed');
    }
    
    const product: ProductDetail = await res.json();
    
    // Pass the fetched product data to the page as props
    return {
      props: {
        product,
      },
    };
  } catch (err) {
    console.error(err);
    return { props: { product: null, error: 'A server error occurred.' } };
  }
};

export default ProductDetailPage;