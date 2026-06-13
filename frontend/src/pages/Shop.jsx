import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { PageTransition } from '../components/PageTransition';

export const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Shop</h1>
          <p className="text-gray-600 max-w-xl">
            Discover our curated collection of minimalist essentials.
          </p>
        </motion.div>

        <div className="flex items-center justify-between mb-12">
          <div className="hidden md:flex gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm font-medium tracking-wide transition-all ${
                  selectedCategory === category ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
          
          <button className="md:hidden flex items-center gap-2 text-sm font-medium" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          
          <p className="text-sm text-gray-500">{filteredProducts.length} Products</p>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mb-8 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setIsFilterOpen(false); }}
                    className={`px-4 py-2 text-sm ${selectedCategory === category ? 'bg-black text-white' : 'bg-white border border-gray-200'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-gray-500">No products found in this category.</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};