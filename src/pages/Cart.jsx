import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { formatPrice } from '../utils/helpers';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Robustly handle currency formatting to prevent double ৳ signs across platforms
  const getFormattedPrice = (price) => {
    const formatted = formatPrice(price).replace('TK', '').trim();
    return formatted.includes('৳') ? formatted : `৳ ${formatted}`;
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[4px] text-[10px] mb-4">
               <ShoppingBag className="w-4 h-4" /> Collection Hub
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-4">Shopping Cart</h1>
            <div className={`flex items-center gap-3 glass-panel px-6 py-2 ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-orange-50/50'}`}>
               <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Index Status</span> 
               <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> 
               <span className="text-sm font-black text-primary">{cart.length} Unit{cart.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Product List */}
              <div className="lg:col-span-2 space-y-8">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 50 }}
                      className={`glass-panel p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-8 group ${isDarkMode ? 'border-white/10' : 'border-orange-100 bg-white'}`}
                    >
                      <div className={`w-28 h-28 sm:w-40 sm:h-40 glass-panel rounded-3xl overflow-hidden shrink-0 relative p-2 ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-50 bg-gray-50'}`}>
                        <img src={item.images?.[0]} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <Link to={`/products/${item.id}`} className="block group/title">
                          <h3 className={`text-xl md:text-2xl font-black italic tracking-tight group-hover/title:text-primary transition-colors leading-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                        </Link>
                        <p className={`text-[10px] font-black uppercase tracking-[2px] mb-6 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>{item.category}</p>
                        <span className="text-2xl font-black text-primary italic">{getFormattedPrice(item.discountPrice || item.price)}</span>
                      </div>

                      <div className="flex flex-col sm:items-end gap-6">
                        <div className={`flex items-center glass-panel p-1 ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-white shadow-sm'}`}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                              isDarkMode 
                                ? 'hover:bg-white/10 text-white/40 hover:text-white' 
                                : 'hover:bg-orange-50 text-gray-400 hover:text-primary'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-black text-primary text-lg">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                              isDarkMode 
                                ? 'hover:bg-white/10 text-white/40 hover:text-white' 
                                : 'hover:bg-orange-50 text-gray-400 hover:text-primary'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className={`flex items-center gap-2 font-black uppercase tracking-widest text-[9px] transition-all group/trash ${
                            isDarkMode ? 'text-red-500/40 hover:text-red-500' : 'text-gray-400 hover:text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4 group-hover/trash:rotate-12 transition-transform" /> Remove Entry
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <Link to="/products" className={`inline-flex items-center gap-3 text-primary font-black uppercase tracking-[3px] text-[10px] transition-all py-6 ${
                  isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
                }`}>
                  <ArrowLeft className="w-4 h-4" /> Continue Expedition
                </Link>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="glass-panel p-10 shadow-[0_30px_100px_-20px_rgba(255,153,0,0.15)] border-primary/20 bg-primary/5 sticky top-40 space-y-10 rounded-[3rem]">
                   <div className="space-y-4">
                     <h3 className="text-sm font-black uppercase tracking-[4px] text-primary">Calculation Matrix</h3>
                     <div className={`h-px w-full ${isDarkMode ? 'bg-white/5' : 'bg-orange-100'}`} />
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <span className={`text-[10px] font-black uppercase tracking-[2px] ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Gross Total</span>
                        <span className={`font-bold ${isDarkMode ? 'text-white/80' : 'text-gray-800'}`}>{getFormattedPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className={`text-[10px] font-black uppercase tracking-[2px] ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Transfer Logistics</span>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 glass-panel text-green-400 tracking-widest leading-none ${isDarkMode ? 'border-green-500/20 bg-green-400/5' : 'border-green-100 bg-green-50'}`}>Complimentary</span>
                      </div>
                      <div className={`pt-6 border-t flex justify-between items-end ${isDarkMode ? 'border-white/10' : 'border-orange-100'}`}>
                        <span className="text-xs font-black uppercase tracking-[3px] text-primary">Final Settlement</span>
                        <span className="text-3xl font-black text-primary italic">{getFormattedPrice(subtotal)}</span>
                      </div>
                   </div>

                   <button 
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] flex items-center justify-center gap-4 hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 orange-shadow"
                   >
                     Authorize Checkout <ArrowRight className="w-5 h-5" />
                   </button>

                   <div className={`pt-10 flex gap-6 justify-center items-center opacity-30 grayscale hover:opacity-100 transition-all duration-500 border-t ${isDarkMode ? 'border-white/5' : 'border-orange-100'}`}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bkash_logo.png/1200px-Bkash_logo.png" className="h-6" alt="bkash" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-5" alt="paypal" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" className="h-4" alt="stripe" />
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
               <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-40 h-40 glass-panel rounded-full flex items-center justify-center mb-10 shadow-2xl relative group ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-orange-50'}`}
               >
                 <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping scale-75 group-hover:animate-none group-hover:scale-110 transition-transform"></div>
                 <ShoppingBag className={`w-16 h-16 transition-colors ${isDarkMode ? 'text-white/10 group-hover:text-primary/40' : 'text-gray-350 group-hover:text-primary/80'}`} />
               </motion.div>
               <h2 className={`text-4xl font-black italic mb-4 tracking-tighter uppercase tracking-[2px] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Index Registry Empty</h2>
               <p className={`text-sm font-medium max-w-sm mb-12 leading-relaxed tracking-tight ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>
                 Your acquisition sequence is currently inactive. Initialize global browsing to secure premium hardware.
               </p>
               <Link to="/products" className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] hover:bg-primary-dark transition-all orange-shadow transform hover:scale-105">
                 Commence Search
               </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Cart;
