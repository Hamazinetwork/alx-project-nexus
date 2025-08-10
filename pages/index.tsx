import React from 'react'
import Search from '@/components/common/Search'
import Header from '@/components/layout/Header'
import ProductList from '@/components/product/Product'
import Image from 'next/image'
// import ProductL from '@/components/product/ProductList'
// import Footer from '@/components/layout/Footer'




const index = () => {
  return (
    <div>
      <Header/>
      <Search/>
     
       {/* Hero Section */}
      <section className="relative w-full h-[296px] sm:h-[421px] lg:h-[481px] flex items-center justify-center overflow-hidden bg-gray-50">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 mx-[21px] sm:mx-[40px] lg:mx-[60px] rounded-[11px] sm:rounded-[27px] overflow-hidden">
          {/* mobile background */}
          <div className="block sm:hidden">
            <Image
              src="/images/herosection.jpeg"
              alt="Beautiful lakeside cabin with mountains"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
          {/* Tablet and desktop view background */}
          <div className="hidden sm:block">
            <Image
              src="/images/herosection.jpeg"
              alt="Beautiful lakeside cabin with mountains"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Find your favorite
            <br />
            African Products here!
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
            The best marketplace dedicated to sharing the beauty, creativity, and craftsmanship of Africa with the world.
          </p>
        </div>
        
        </section>
        <div/>
      
      <ProductList/>
      {/* <Footer/> */}
    </div>
  )
}

export default index
