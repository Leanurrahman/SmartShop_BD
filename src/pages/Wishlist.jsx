import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[4px] text-[10px] mb-4">
               <Heart className="w-4 h-4" /> Priority Selection
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-4">My Wishlist</h1>
            <div className="flex items-center gap-3 glass-panel px-6 py-2 border-white/5 bg-white/5">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Stored Intel</span> 
               <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> 
               <span className="text-sm font-black text-primary">{wishlist.length} Item{wishlist.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {wishlist.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel p-8 border-white/10 shadow-2xl group relative bg-white/5"
                  >
                    <div className="aspect-square glass-panel border-white/5 bg-white/5 rounded-[2.5rem] overflow-hidden mb-8 relative p-2">
                       <img src={product.images?.[0]} className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                       <button 
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-4 right-4 w-12 h-12 glass-panel border-white/10 bg-white/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-2xl"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                    
                    <Link to={`/products/${product.id}`} className="group/link">
                      <h3 className="font-black text-xl italic tracking-tight mb-2 line-clamp-1 group-hover/link:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-3xl font-black text-primary mb-8 italic">{formatPrice(product.discountPrice || product.price).includes('৳') ? formatPrice(product.discountPrice || product.price).replace('TK', '') : `৳ ${formatPrice(product.discountPrice || product.price).replace('TK', '')}`}</p>

                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[3px] text-[10px] flex items-center justify-center gap-3 hover:bg-primary-dark transition-all transform active:scale-95 orange-shadow"
                    >
                      <ShoppingCart className="w-4 h-4" /> Deploy to Cart
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
               <div className="w-40 h-40 glass-panel border-white/5 bg-white/5 rounded-full flex items-center justify-center mb-10 shadow-2xl relative group">
                 <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping scale-75"></div>
                 <Heart className="w-16 h-16 text-white/10 group-hover:text-primary/40 transition-colors" />
               </div>
               <h2 className="text-4xl font-black italic mb-4 tracking-tighter uppercase tracking-[2px]">Wishlist Inactive</h2>
               <p className="text-white/30 text-sm font-medium max-w-sm mb-12 leading-relaxed tracking-tight">
                 You haven't flagged any assets for future acquisition. Populate your matrix with premium hardware.
               </p>
               <Link to="/products" className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] hover:bg-primary-dark transition-all orange-shadow transform hover:scale-105 flex items-center gap-3">
                 Begin Selection <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Wishlist;
