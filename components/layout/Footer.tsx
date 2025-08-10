import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand and Description */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              MART<span className="text-yellow-500">AFRICA</span>
            </h2>
            <p className="text-sm text-gray-400">
              MartAfrica is an E-commerce platform that sells authentic African products to the world.
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h3 className="font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/about" className="hover:text-yellow-500 transition-colors">About Us</Link>
              <Link href="/blog" className="hover:text-yellow-500 transition-colors">Blog</Link>
              <Link href="/careers" className="hover:text-yellow-500 transition-colors">Careers</Link>
            </div>
          </div>

          {/* Column 3: Help Links */}
          <div>
            <h3 className="font-semibold text-white uppercase tracking-wider mb-4">Help</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/support" className="hover:text-yellow-500 transition-colors">Support</Link>
              <Link href="/refunds" className="hover:text-yellow-500 transition-colors">Refund Process</Link>
              <Link href="/faq" className="hover:text-yellow-500 transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Column 4: Contact/Social */}
          <div>
            <h3 className="font-semibold text-white uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-yellow-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-yellow-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-yellow-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-yellow-500 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MartAfrica. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;