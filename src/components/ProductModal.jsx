import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingCart, CheckCircle, Truck, Package, RefreshCw, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { formatPrice } from '../utils/helpers';
import Swal from 'sweetalert2';

// Hex mapper for customizable color values
const getColorHexValue = (colorName) => {
  const cn = colorName?.toLowerCase() || '';
  if (cn.includes('black') || cn === 'slate-900' || cn === 'charcoal') return '#111827';
  if (cn.includes('white') || cn === 'offwhite') return '#F9FAF6';
  if (cn.includes('gray') || cn.includes('grey') || cn === 'slate-500') return '#6B7280';
  if (cn.includes('red') || cn === 'crimson') return '#EF4444';
  if (cn.includes('blue') || cn === 'indigo' || cn === 'navy') return '#1E3A8A';
  if (cn.includes('green') || cn === 'emerald') return '#10B981';
  if (cn.includes('yellow') || cn === 'amber') return '#EAB308';
  if (cn.includes('orange') || cn === 'coral') return '#F97316';
  if (cn.includes('purple') || cn === 'violet') return '#8B5CF6';
  if (cn.includes('pink') || cn === 'rose') return '#EC4899';
  if (cn.includes('silver') || cn === 'metallic') return '#D1D5DB';
  if (cn.includes('gold')) return '#FBBF24';
  if (cn.includes('olive')) return '#365314';
  if (cn.includes('teal')) return '#0D9488';
  if (cn.includes('brown')) return '#78350F';
  return '#4F46E5'; // Premium Royal Indigo Fallback
};

// Dynamic category config to make options highly relevant and realistic
const getCategoryOptions = (category, name = '') => {
  const normCategory = category?.toLowerCase() || '';
  const normName = name?.toLowerCase() || '';

  // Return specific defaults for phone cases, covers, glasses and general accessories
  if (
    normCategory.includes('cover') || 
    normCategory.includes('case') || 
    normCategory.includes('accessory') || 
    normCategory.includes('accessories') || 
    normName.includes('cover') || 
    normName.includes('case') || 
    normName.includes('glass') || 
    normName.includes('protector') || 
    normName.includes('holder') || 
    normName.includes('stand') || 
    normName.includes('strap')
  ) {
    return {
      colors: [
        { name: 'Pitch Black', value: '#111827' },
        { name: 'Clear Frost', value: '#E5E7EB' },
        { name: 'Navy Blue', value: '#1E3A8A' },
        { name: 'Coral Pink', value: '#EC4899' }
      ],
      sizesLabel: 'Device Model',
      sizes: ['iPhone 14/15', 'iPhone 16 Pro Max', 'Samsung S24 Ultra']
    };
  }

  if (normCategory.includes('electronics')) {
    return {
      colors: [
        { name: 'Space Gray', value: '#374151' },
         { name: 'Silver', value: '#D1D5DB' },
         { name: 'Midnight', value: '#111822' }
      ],
      sizesLabel: 'Configuration',
      sizes: ['8GB / 256GB', '16GB / 512GB', '32GB / 1TB']
    };
  } else if (normCategory.includes('fashion')) {
    return {
      colors: [
        { name: 'Pitch Black', value: '#111827' },
        { name: 'Indigo Blue', value: '#1E3A8A' },
        { name: 'Olive Green', value: '#365314' }
      ],
      sizesLabel: 'Size Chart',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    };
  } else if (normCategory.includes('sports') || normCategory.includes('outdoor')) {
    return {
      colors: [
        { name: 'Electric Lime', value: '#84CC16' },
        { name: 'Slate Matte', value: '#475569' },
        { name: 'Sunset Amber', value: '#F97316' }
      ],
      sizesLabel: 'Size / Variety',
      sizes: ['40 (EU)', '41 (EU)', '42 (EU)', '43 (EU)', '44 (EU)']
    };
  } else if (normCategory.includes('beauty')) {
    return {
      colors: [
        { name: 'Rose Petal', value: '#F43F5E' },
        { name: 'Nude Beige', value: '#EAB308' },
        { name: 'Clear Glow', value: '#F8FAF6' }
      ],
      sizesLabel: 'Volume',
      sizes: ['50ml', '100ml', '200ml']
    };
  } else {
    // Groceries or General
    return {
      colors: [],
      sizesLabel: 'Pack Size',
      sizes: ['250g', '500g', '1kg']
    };
  }
};

// Helper to detect correct sizesLabel dynamically
const detectSizesLabel = (sizes, category, name) => {
  const normCategory = category?.toLowerCase() || '';
  const normName = name?.toLowerCase() || '';
  const sizesString = (sizes || []).join(' ').toLowerCase();

  // If custom sizes exist
  if (sizes && sizes.length > 0) {
    if (sizesString.includes('gb') || sizesString.includes('tb') || sizesString.includes('ram') || sizesString.includes('ssd')) {
      return 'Configuration';
    }
    if (
      sizesString.includes('iphone') || 
      sizesString.includes('samsung') || 
      sizesString.includes('pixel') || 
      sizesString.includes('ultra') || 
      sizesString.includes('oneplus') || 
      sizesString.includes('model') ||
      normCategory.includes('cover') ||
      normCategory.includes('case') ||
      normName.includes('cover') ||
      normName.includes('case') ||
      normName.includes('glass')
    ) {
      return 'Device Model';
    }
    if (sizesString.includes('ml') || sizesString.includes('liter') || sizesString.includes('oz') || sizesString.includes('fl')) {
      return 'Volume';
    }
    if (sizesString.includes('g') || sizesString.includes('kg') || sizesString.includes('pack') || sizesString.includes('pcs') || sizesString.includes('pieces')) {
      return 'Pack Size';
    }
    if (/^[smlx]/i.test(sizes[0]) || sizesString.includes('size') || sizesString.includes('inch')) {
      return 'Size Option';
    }
    return 'Select Option';
  }

  // Fallback defaults matching getCategoryOptions
  if (
    normCategory.includes('cover') || 
    normCategory.includes('case') || 
    normCategory.includes('accessory') || 
    normCategory.includes('accessories') || 
    normName.includes('cover') || 
    normName.includes('case') || 
    normName.includes('glass')
  ) {
    return 'Device Model';
  }
  if (normCategory.includes('electronics')) {
    return 'Configuration';
  }
  if (normCategory.includes('fashion')) {
    return 'Size Chart';
  }
  if (normCategory.includes('sports')) {
    return 'Size / Variety';
  }
  if (normCategory.includes('beauty')) {
    return 'Volume';
  }
  return 'Pack Size';
};

const ProductModal = ({ isOpen, onClose, product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isDarkMode } = useTheme();

  if (!product) return null;

  // Read config with fallback to show everything if not set
  const config = product.modalConfig || {
    showName: true,
    showRating: true,
    showDescription: true,
    showPrice: true,
    showColors: true,
    showSizes: true,
    showQuantity: true,
    showThumbnails: true,
    showStock: true,
    showBrandBadge: true,
    showFeatures: true,
    showDeliveryInfo: true
  };

  const options = getCategoryOptions(product.category, product.name);

  // Dynamic lists from product custom settings
  const productColors = product.colors && product.colors.length > 0 
    ? product.colors.map(col => typeof col === 'string' ? { name: col, value: getColorHexValue(col) } : col)
    : options.colors;

  const productSizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : options.sizes;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Sync state whenever product changes
  useEffect(() => {
    setActiveImage(0);
    const newOptions = getCategoryOptions(product.category, product.name);
    
    const customColors = product.colors && product.colors.length > 0
      ? product.colors.map(col => typeof col === 'string' ? { name: col, value: getColorHexValue(col) } : col)
      : newOptions.colors;

    const customSizes = product.sizes && product.sizes.length > 0
      ? product.sizes
      : newOptions.sizes;

    // Honor default selected color and size
    setSelectedColor(product.defaultColor || customColors?.[0]?.name || '');
    setSelectedSize(product.defaultSize || customSizes?.[0] || '');
    setQuantity(1);
  }, [product]);

  // Handle Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Limit Reached',
        text: `Only ${product.stock} items left in stock.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    addToCart(product, quantity);
  };

  const handleAddToWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600x600?text=No+Image+Available'];

  const discountAmount = product.discountPrice ? (product.price - product.discountPrice) : 0;
  const savingPercentage = product.discountPrice 
    ? Math.round((discountAmount / product.price) * 100) 
    : 0;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="product-modal-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-10"
        >
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className={`relative w-full h-[100vh] sm:h-auto sm:max-h-[90vh] max-w-5xl rounded-none sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border z-10 ${
              isDarkMode ? 'bg-gray-950 border-white/10 text-white' : 'bg-white border-orange-100 text-gray-900'
            }`}
          >
            {/* Elegant Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-50 p-2.5 rounded-full border shadow-xl hover:scale-110 active:scale-95 transition-all ${
                isDarkMode 
                  ? 'bg-gray-900/80 border-white/10 hover:bg-white/10 text-white' 
                  : 'bg-white/80 border-orange-100 hover:bg-orange-50 text-gray-800'
              }`}
            >
              <X size={20} />
            </button>

            {/* Left Section: Img Gallery with interactive Thumbnails */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-default overflow-y-auto sm:overflow-visible">
              <div className="space-y-6">
                
                {/* Meta breadcrumb inside modal */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <span>SmartShop</span>
                  <span>/</span>
                  <span className="truncate">
                    {product.categories && product.categories.length > 0 
                      ? product.categories.join(' & ') 
                      : product.category}
                  </span>
                  <span>/</span>
                  <span className="text-primary truncate font-bold">{product.brand || 'Premium'}</span>
                </div>

                {/* Main Large Image Display */}
                <div className="rounded-2xl overflow-hidden aspect-square bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-white/5 relative flex items-center justify-center p-4">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={imagesList[activeImage]}
                      alt={`${product.name} image ${activeImage + 1}`}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="max-h-full max-w-full object-contain rounded-xl select-none"
                    />
                  </AnimatePresence>

                  {/* Smart saving percentage badge inside main image */}
                  {savingPercentage > 0 && config.showPrice && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg tracking-widest leading-none">
                      -{savingPercentage}% Saved
                    </span>
                  )}
                </div>

                {/* Mini thumbnails list */}
                {config.showThumbnails && imagesList.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto py-1">
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 p-1 bg-gray-50 dark:bg-gray-900/60 transition-all transform hover:scale-105 shrink-0 ${
                          activeImage === idx 
                            ? 'border-[#F97316] ring-2 ring-[#F97316]/20' 
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-contain rounded-lg" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bullet Features at Bottom Left */}
              {config.showFeatures && (
                <div className="hidden sm:grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-xs text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Free Express Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span>100% Genuine Product</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary" />
                    <span>7 Days Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    <span>Authorized smart warranty</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section: Details, Selector, Add-To-Cart actions */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[80vh] sm:max-h-none">
              <div className="space-y-6">
                
                {/* Brand and Stock Status */}
                <div className="flex items-center justify-between">
                  {config.showBrandBadge && (
                    <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-white/5 text-gray-400 border border-transparent dark:border-white/5">
                      {product.brand || 'Premium Brand'}
                    </div>
                  )}
                  {config.showStock && (
                    product.stock > 0 ? (
                      <span className="flex items-center gap-1.5 text-xs text-green-500 font-bold ml-auto">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        In Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-red-500 font-bold ml-auto">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Out of Stock
                      </span>
                    )
                  )}
                </div>

                {/* Main Product Name */}
                {config.showName && (
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase">
                    {product.name}
                  </h2>
                )}

                {/* Categories badge labels */}
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.categories.map(cat => (
                      <span key={cat} className="px-2.5 py-1 text-[9px] font-black tracking-widest uppercase bg-orange-100 dark:bg-orange-500/10 text-primary dark:text-[#F97316] rounded-md transition-all">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating component in detail screen */}
                {config.showRating && (
                  <div className="flex items-center gap-4 py-1 border-y border-gray-100 dark:border-white/5">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                           key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 5) 
                              ? 'fill-current text-amber-500' 
                              : 'text-gray-300 dark:text-gray-700'
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 text-sm font-bold text-amber-600 dark:text-amber-500">
                        {product.rating || 5}.0
                      </span>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10" />
                    <span className="text-xs text-gray-400 font-medium">
                      {product.popularity ? `${product.popularity * 2}k+` : '120+'} Total Reviews
                    </span>
                  </div>
                )}

                {/* Dual pricing display (Original & Discount) */}
                {config.showPrice && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Estimated Price</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-primary italic">
                        {formatPrice(product.discountPrice || product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-sm text-gray-400 line-through font-semibold">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Scrollable Description details */}
                {config.showDescription && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Product Overview</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed font-normal">
                      {product.description || 'Elevate your routine with this peak performance option. Crafted with exceptional detail, design metrics, and long lasting premium materials.'}
                    </p>
                  </div>
                )}

                {/* Color Selector */}
                {config.showColors && productColors.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Color <span className="text-primary font-black ml-1">→ {selectedColor}</span>
                    </p>
                    <div className="flex items-center gap-3">
                      {productColors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all transform hover:scale-110 active:scale-95 ${
                            selectedColor === c.name 
                              ? 'border-[#F97316] scale-105 shadow-md shadow-[#F97316]/20' 
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        >
                          {selectedColor === c.name && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white mix-blend-difference" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {config.showSizes && productSizes.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      {detectSizesLabel(productSizes, product.category, product.name)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {productSizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all border transform active:scale-95 ${
                            selectedSize === s
                              ? 'bg-primary text-white border-primary shadow-lg shadow-[#F97316]/15 scale-105'
                              : isDarkMode 
                                ? 'bg-gray-900 border-white/5 hover:border-white/20 text-gray-300' 
                                : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector design */}
                {config.showQuantity && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Select Quantity</p>
                    <div className="flex items-center gap-1.5 w-fit rounded-xl border border-gray-200 dark:border-white/10 p-1 bg-gray-50 dark:bg-white/5">
                      <button
                        onClick={handleDecreaseQuantity}
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm font-black tracking-tight">{quantity}</span>
                      <button
                        onClick={handleIncreaseQuantity}
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Action row at bottom */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                
                <div className="flex items-center gap-4">
                  {/* Add To Cart */}
                  <button
                    onClick={handleAddToCartClick}
                    disabled={product.stock <= 0}
                    className="flex-1 py-4 px-8 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl hover:shadow-[#F97316]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <ShoppingCart size={18} /> Add To Cart
                  </button>

                  {/* Add to Wishlist */}
                  <button
                    onClick={handleAddToWishlistClick}
                    className={`p-4 rounded-2xl border transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                      isInWishlist(product.id)
                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                        : isDarkMode
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                          : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-850'
                    }`}
                    title="Add to wishlist"
                  >
                    <Heart size={20} className={`${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Free Delivery alert under actions */}
                {config.showDeliveryInfo && (
                  <p className="text-[10px] text-gray-400 flex items-center justify-center gap-2 font-black uppercase tracking-wider pt-2">
                    <CheckCircle size={12} className="text-green-500" />
                    Free delivery on orders over ৳1,000 in smart zone
                  </p>
                )}

              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProductModal;
