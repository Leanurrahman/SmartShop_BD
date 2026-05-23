import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const ProductFlipCard = ({ product }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { addToCart } = useCart();

  return (
    <div 
      className="relative w-full h-[400px] perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-accent rounded-2xl shadow-sm border dark:border-gray-800 p-4">
           <img 
            src={product.images?.[0]} 
            alt={product.name} 
            className="w-full h-[250px] object-cover rounded-xl mb-4" 
           />
           <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
           <p className="text-primary font-bold text-xl">{formatPrice(product.price)}</p>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden bg-primary text-white rounded-2xl shadow-xl p-6 flex flex-col justify-between"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div>
            <h3 className="font-bold text-xl mb-2">{product.name}</h3>
            <div className="flex items-center gap-1 mb-4 text-orange-200">
               {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-current' : ''}`} />)}
            </div>
            <p className="text-sm opacity-90 line-clamp-4 mb-4">{product.description}</p>
            <p className="text-2xl font-bold">{formatPrice(product.discountPrice || product.price)}</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-white text-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
            >
              <ShoppingCart className="w-5 h-5" /> Add
            </button>
            <button className="w-12 h-12 bg-primary-dark border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/10">
              <Eye className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductFlipCard;
