import Link from 'next/link';
import React, { useState } from 'react';
import { FaHamburger } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className='hidden sm:flex justify-between items-center px-4 py-2 bg-white shadow-md'>
        <img src='/images/martafricalogo.jpeg' alt='Logo' className='h-10' />
        <ul className='flex gap-4'>
          <li>
            <Link href='/Login'>
              Login
            </Link>
          </li>
          <li>
            <Link href='/Carts'>
              Cart
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden px-4 py-2 bg-white shadow-md'>
        <div className='flex justify-between items-center'>
          <img src='/images/martafricalogo.jpeg' alt='Logo' className='h-10' />
          <FaHamburger onClick={toggleMenu} className='text-2xl cursor-pointer color-[#4F225E]' />
        </div>

        {isOpen && (
          <div className='flex flex-col mt-2 space-y-2'>
            <Link href='/Login'>Login</Link>
            <Link href='/Carts'>Cart</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
