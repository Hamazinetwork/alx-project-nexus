import React from 'react'
import { ProductProps } from '@/interfaces';
import Image from 'next/image';

const Card: React.FC<ProductProps> = ({price, image, plusIcon, name}) => {
  return (
    <div>
      <Image src={image} alt={name} layout="fill" objectFit='cover' className='rounded-md'/>
      <h2>{name}</h2>
      <p>{price}</p>
      <p>{plusIcon}</p>
    </div>
  )
}

export default Card;
