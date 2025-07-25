import React from 'react'
import { ProductProps } from '@/interfaces'
import Image from 'next/image'

const ProductDetails: React.FC<ProductProps>  = ({name, price, image, description, plusIcon,id }) => {
  return (
    <div>
      <Image src={image} alt={name} layout="fill" className="object-cover rounded-lg"/>
      <div>
        <h2>Descriptio</h2>
        <p>{description}</p>
      </div>
      <div>
        <p>{price}</p>
        <p>{plusIcon}</p>
      </div>
    </div>
  )
}

export default ProductDetails
