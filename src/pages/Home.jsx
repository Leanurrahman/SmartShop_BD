import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star as StarIcon,
  Laptop,
  Shirt,
  Home as HomeIcon,
  ShoppingBasket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VoiceSearch from '../components/VoiceSearch';
import FlashSaleTimer from '../components/FlashSaleTimer';
import ProductCarousel from '../components/ProductCarousel';
import CategoryCard from '../components/CategoryCard';
import AnimatedSection from '../components/AnimatedSection';
import PageTransition from '../components/PageTransition';
import AIChatbot from '../components/AIChatbot';
import { getAllProducts } from '../services/dbService';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { recentlyViewed } = useRecentlyViewed();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const all = await getAllProducts();
        setFeaturedProducts(all.filter(p => p.featured).slice(0, 8));
        setBestSellers(all.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 8));
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: "Electronics", icon: <Laptop className="w-8 h-8" />, itemCount: "450+" },
    { name: "Fashion", icon: <Shirt className="w-8 h-8" />, itemCount: "1.2k+" },
    { name: "Home & Living", icon: <HomeIcon className="w-8 h-8" />, itemCount: "800+" },
    { name: "Groceries", icon: <ShoppingBasket className="w-8 h-8" />, itemCount: "2k+" },
  ];

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-20">
        
        {/* Frosted Glass Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24 overflow-hidden px-4 sm:px-6 lg:px-8">
          {/* Background Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

          <div className="container mx-auto">
            <div className="grid grid-cols-12 gap-8 items-center min-h-[70vh]">
              {/* Main Banner */}
              <div className="col-span-12 lg:col-span-8 h-full">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="glass-panel relative overflow-hidden flex items-center p-8 md:p-16 h-full min-h-[500px] shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>
                  
                  <div className="relative z-10 space-y-8 max-w-2xl">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                    >
                      <Sparkles className="w-4 h-4" /> {t('hero_tag')}
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`text-5xl md:text-7xl font-black leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {t('hero_title_1')} <br />
                      <span className="text-transparent bg-clip-text orange-gradient">{t('hero_title_2')}</span>
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className={`text-lg md:text-xl leading-relaxed max-w-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {t('hero_desc')}
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex flex-wrap gap-4 pt-4"
                    >
                      <Link to="/products" className="px-10 py-4 bg-primary rounded-2xl font-bold text-white shadow-xl orange-shadow hover:bg-primary-dark transition-all transform active:scale-95">
                        {t('button_explore')}
                      </Link>
                      <Link to="/products?category=Electronics" className="px-10 py-4 glass-panel font-bold border-white/20 hover:bg-white/10 transition-all transform active:scale-95">
                        {t('button_learn')}
                      </Link>
                    </motion.div>
                  </div>

                  {/* Decorative Card Floating in Hero */}
                  <motion.div 
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [6, 8, 6]
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute right-12 top-12 w-64 h-80 glass-panel rotate-6 hidden xl:flex flex-col p-4 shadow-2xl backdrop-blur-3xl border-white/20"
                  >
                    <div className="w-full h-48 bg-white/10 rounded-xl mb-4 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" className="w-full h-full object-cover opacity-80" alt="" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                      <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-primary font-bold">৳ 85,000</span>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Side Panels - AI Recommendations */}
              <div className="col-span-12 lg:col-span-4 h-full">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="glass-panel p-8 h-full flex flex-col shadow-2xl"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                    {t('ai_rec_title')} 
                    <span className="flex gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full bg-primary animate-pulse`}></span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-primary/45' : 'bg-primary/30'}`}></span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}></span>
                    </span>
                  </h3>
                  
                  <div className="space-y-4 flex-1">
                    {[
                      { name: "Realme GT Neo 5", price: "42,999", match: "98%", img: "https://m.media-amazon.com/images/I/71o8O9LqGHL._AC_SL1500_.jpg" },
                      { name: "Logitech MX Master", price: "11,500", match: "84%", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46" },
                      { name: "AirPods Pro 2", price: "28,900", match: "79%", img: "https://images.unsplash.com/photo-1588423770574-91023ad60da1" }
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group cursor-pointer ${
                        isDarkMode 
                          ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                          : 'bg-gray-50 border-orange-50 hover:bg-gray-100'
                      } ${i > 0 ? 'opacity-70 hover:opacity-100' : ''}`}>
                        <div className="w-16 h-16 rounded-xl shrink-0 overflow-hidden bg-white">
                           <img src={item.img} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-sm tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                          <p className="text-primary text-xs font-semibold">৳ {item.price}</p>
                        </div>
                        <div className={`text-[10px] italic font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.match} {t('match')}</div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-8 p-5 rounded-2xl border relative ${isDarkMode ? 'bg-primary/10 border-primary/20' : 'bg-orange-50 border-orange-100'}`}>
                    <p className={`text-[12px] leading-relaxed italic ${isDarkMode ? 'text-gray-400' : 'text-gray-650'}`}>
                       "{t('ai_rec_tagline')}"
                    </p>
                    <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-primary" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <div className="container mx-auto px-4 -mt-12 relative z-20">
          <VoiceSearch className="max-w-3xl mx-auto" />
        </div>

        {/* Trust Badges */}
        <section className="py-16 border-b dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="flex items-center gap-5 p-6 rounded-3xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-lg">
                 <div className="w-14 h-14 bg-blue-100 text-blue-500 flex items-center justify-center rounded-2xl">
                   <ShieldCheck className="w-7 h-7" />
                 </div>
                 <div>
                    <h4 className="font-bold">{t('badge_secure')}</h4>
                    <p className="text-xs text-gray-500">{t('badge_secure_desc')}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-5 p-6 rounded-3xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-lg">
                 <div className="w-14 h-14 bg-orange-100 text-primary flex items-center justify-center rounded-2xl">
                   <Truck className="w-7 h-7" />
                 </div>
                 <div>
                    <h4 className="font-bold">{t('badge_shipping')}</h4>
                    <p className="text-xs text-gray-500">{t('badge_shipping_desc')}</p>
                 </div>
               </div>

               <div className="flex items-center gap-5 p-6 rounded-3xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-lg">
                 <div className="w-14 h-14 bg-green-100 text-green-500 flex items-center justify-center rounded-2xl">
                   <RotateCcw className="w-7 h-7" />
                 </div>
                 <div>
                    <h4 className="font-bold">{t('badge_returns')}</h4>
                    <p className="text-xs text-gray-500">{t('badge_returns_desc')}</p>
                 </div>
               </div>

               <div className="flex items-center gap-5 p-6 rounded-3xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-lg">
                 <div className="w-14 h-14 bg-purple-100 text-purple-500 flex items-center justify-center rounded-2xl">
                   <Sparkles className="w-7 h-7" />
                 </div>
                 <div>
                    <h4 className="font-bold">{t('badge_support')}</h4>
                    <p className="text-xs text-gray-500">{t('badge_support_desc')}</p>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Flash Sale Countdown Timer Section */}
        <AnimatedSection className="py-8">
          <div className="container mx-auto px-4">
            <FlashSaleTimer />
          </div>
        </AnimatedSection>

        {/* Categories Section */}
        <AnimatedSection className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-12">
               <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{t('section_explore')}</p>
               <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('section_popular_categories')}</h2>
               <div className="w-20 h-1 bg-primary mt-4 rounded-full" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat, idx) => (
                <CategoryCard key={idx} category={cat} />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Featured Products */}
        {!loading && featuredProducts.length > 0 && (
          <ProductCarousel 
            products={featuredProducts} 
            title="Featured Products" 
            subtitle="Handpicked For You"
          />
        )}

        {/* Best Sellers */}
        {!loading && bestSellers.length > 0 && (
          <section className="py-20">
            <ProductCarousel 
              products={bestSellers} 
              title="Best Sellers" 
              subtitle="The Crowd Favorites"
            />
          </section>
        )}

        {/* Promotional Banner */}
        <AnimatedSection className="py-12 px-4 container mx-auto">
          <div className="bg-primary rounded-[3rem] overflow-hidden relative min-h-[400px] flex items-center p-8 md:p-20 shadow-2xl shadow-primary/30">
             <div className="relative z-10 max-w-xl">
                <span className="bg-white text-primary px-4 py-1.5 rounded-full text-sm font-black uppercase mb-6 inline-block">{t('promo_tag')}</span>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{t('promo_title')}</h2>
                <p className="text-white/80 text-lg mb-10 leading-relaxed font-medium">{t('promo_desc')}</p>
                <Link to="/products?category=Fashion" className="bg-black text-white px-10 py-4 rounded-2xl font-bold inline-flex items-center gap-3 hover:bg-gray-900 transition-all shadow-xl active:scale-95">
                   {t('promo_btn')} <ShoppingBag className="w-5 h-5" />
                </Link>
             </div>
             
             {/* Decorative blob shapes */}
             <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-20 z-0" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -translate-x-20 translate-y-20 z-0" />
          </div>
        </AnimatedSection>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <ProductCarousel 
            products={recentlyViewed} 
            title="Recently Viewed" 
            subtitle="Pick Up Where You Left Off"
          />
        )}

      </main>
      <Footer />
      <AIChatbot />
    </PageTransition>
  );
};

export default Home;
