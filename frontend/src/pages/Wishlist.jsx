import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { PageTransition } from '../components/PageTransition';

export const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore(state => state.addItem);

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-gray-300" strokeWidth={1} />
            <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-8">Save your favorite items to purchase them later.</p>
            <Link to="/shop">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wider uppercase">
                Explore Products
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Wishlist</h1>
          <p className="text-gray-600">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</p>
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
                  
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addToCart(item)} className="w-full mt-2 bg-black text-white py-3 text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingBag className="w-3 h-3" /> Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};