import React from 'react'
import Search from '@/components/common/Search'
import Header from '@/components/layout/Header'
import ProductList from '@/components/product/Product'
const index = () => {
  return (
    <div className=''>
      <Header/>
      <Search/>
      <ProductList/>
    </div>
  )
}

export default index

