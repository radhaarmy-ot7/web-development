import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold tracking-widest uppercase mb-4">NOIR</h2>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Curated essentials for the modern minimalist. We believe in quality over quantity.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">Shop</h3>
            <ul className="space-y-3">
              {['All Products', 'New Arrivals', 'Accessories', 'Home'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-3">
              {[
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Shipping', path: '#' },
                { label: 'Returns', path: '#' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group">
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm"> 2024 NOIR. All rights reserved.</p>
          <div className="flex gap-6">
            {['Instagram', 'Twitter', 'Pinterest'].map((social) => (
              <motion.a
                key={social}
                href="#"
                whileHover={{ y: -2 }}
                className="text-gray-500 hover:text-white transition-colors text-sm"
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};