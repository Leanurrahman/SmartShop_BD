import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import ProductModal from './ProductModal';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const discount = calculateDiscount(product.price, product.discountPrice);

  // Stop click events on buttons from opening the modal detail view
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const ratingValue = product.rating || 5;

  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(249,115,22,0.1)' }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all border ${
            isDarkMode 
              ? 'bg-gray-900 border-white/5 shadow-2xl' 
              : 'bg-white border-orange-100 shadow-md'
          }`}
        >
          {/* Image & Discount Badge */}
          <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 shrink-0 flex items-center justify-center p-4">
            {discount > 0 && (
              <div className="absolute top-3 left-3 z-10 bg-primary bg-[#F97316] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                SAVE {discount}%
              </div>
            )}
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-3 w-full">
            <div className="flex justify-between items-start">
            <div>
                <div className={`flex flex-wrap gap-1.5 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-405'}`}>
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map((cat, ci) => (
                      <span key={cat} className="after:content-['•'] last:after:content-none after:mx-1">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span>{product.category}</span>
                  )}
                </div>
                <h3 className={`text-xl font-black mt-1 tracking-tight leading-snug hover:text-[#F97316] transition-colors ${isDarkMode ? 'text-white' : 'text-gray-955'}`}>
                  {product.name}
                </h3>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className={`p-2.5 rounded-full border transition-all transform active:scale-90 hover:scale-110 ${
                  isInWishlist(product.id)
                    ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-sm'
                    : isDarkMode 
                      ? 'bg-gray-800 border-white/15 text-white/50 hover:text-white' 
                      : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-orange-50 hover:text-[#F97316]'
                }`}
              >
                <Heart size={16} className={isInWishlist(product.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-3.5 h-3.5 ${idx < ratingValue ? 'fill-current text-amber-500' : 'text-gray-200 dark:text-gray-800'}`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">({product.rating || 5}.0)</span>
            </div>

            <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {product.description || 'Premium smart collection product. Built helper for durable performance.'}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              {/* Pricing */}
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#F97316] italic leading-none">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className={`text-xs line-through mt-1.5 font-semibold ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Add to Cart Orange Button */}
              <button
                onClick={handleAddToCartClick}
                className="px-6 py-3 bg-[#F97316] hover:bg-orange-600 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-orange-500/10 flex items-center gap-2 justify-center"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Modal detailed view */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
        />
      </>
    );
  }

  // DEFAULT GRID LAYOUT
  return (
    <>
      <motion.div
        onClick={() => setIsModalOpen(true)}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ 
          y: -8, 
          scale: 1.015,
          boxShadow: '0 25px 50px -15px rgba(249,115,22,0.15)' 
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`group relative flex flex-col justify-between h-full rounded-2xl cursor-pointer transition-all border ${
          isDarkMode 
            ? 'bg-gray-950 border-white/5 shadow-2xl' 
            : 'bg-white border-orange-100 shadow-md'
        }`}
      >
        {/* Floating actions (Wishlist and Discount badge) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
          {discount > 0 ? (
            <div className="bg-[#F97316] text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider shadow-lg leading-none">
              SAVE {discount}%
            </div>
          ) : (
            <div />
          )}

          {/* Add to Wishlist Circle button on Card */}
          <button
            onClick={handleWishlistClick}
            className={`pointer-events-auto p-2.5 rounded-full border shadow-xl transition-all transform hover:scale-110 active:scale-95 ${
              isInWishlist(product.id)
                ? 'bg-red-500 border-red-500 text-white'
                : isDarkMode
                  ? 'bg-gray-900/90 border-white/10 text-white/70 hover:text-white'
                  : 'bg-white/94 border-orange-100 text-gray-500 hover:text-primary hover:border-primary/40'
            }`}
            title="Toggle Wishlist"
          >
            <Heart size={15} className={`${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product image with animated hover */}
        <div className="relative aspect-square rounded-t-2xl overflow-hidden bg-gray-50 dark:bg-gray-950/40 p-6 flex items-center justify-center border-b border-gray-100 dark:border-white/5">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="max-h-full max-w-full object-contain rounded-xl select-none"
          />
        </div>

        {/* Details Wrapper */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            {/* Category title */}
            <div className={`flex flex-wrap items-center gap-1 text-[9px] font-black uppercase tracking-[1.5px] ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
              {product.categories && product.categories.length > 0 ? (
                product.categories.map((cat, idx) => (
                  <span key={cat} className="after:content-['•'] last:after:content-none after:mx-1">
                    {cat}
                  </span>
                ))
              ) : (
                <span>{product.category}</span>
              )}
            </div>

            {/* Dynamic Name */}
            <h3 className={`font-black text-base line-clamp-2 tracking-tight group-hover:text-[#F97316] transition-colors leading-snug uppercase ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {product.name}
            </h3>

            {/* Ratings indicators */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex items-center text-amber-500">
                <Star size={12} className="fill-current text-amber-500" />
                <span className="text-[11px] font-bold ml-1">{product.rating || 5}.0</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">• ({product.brand || 'Premium'})</span>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* Price section */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#F97316] italic leading-none">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className={`text-xs line-through font-semibold ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Dedicated Primary Orange Action Button */}
            <button
              onClick={handleAddToCartClick}
              className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-[#F97316]/20 transform active:scale-95 cursor-pointer pointer-events-auto"
            >
              <ShoppingBag size={12} /> Add to Cart
            </button>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Modal detailed view */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;
