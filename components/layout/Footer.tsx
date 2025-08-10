import React from 'react'

const Footer = () => {
  return (
    <div className='bg-black flex gap-10 '>
        <div>
            <p className='text-white'>MartAfrica is an E-commerce platform that sells African product to the word</p>
        </div>
        <div className='flex flex-col'>
            <p className='text-white'>Company</p>
            <p className='text-white'>About us </p>
            <p className='text-white'>blog</p>
        </div>
        <div className='flex flex-col'>
            <p className='text-white'>Help</p>
            <p className='text-white'>Suppory </p>
            <p className='text-white'>Refund Process</p>
        </div>
      
    </div>
  )
}

export default Footer
