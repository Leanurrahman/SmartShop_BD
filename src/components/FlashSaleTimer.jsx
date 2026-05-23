import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Zap, Clock, Star, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Digit display container with smooth slide-and-fade keyframe transitions
const AnimatedDigit = ({ digit }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`relative h-14 w-10 sm:h-16 sm:w-12 md:h-20 md:w-16 flex items-center justify-center rounded-2xl font-black text-2xl sm:text-3xl md:text-5xl shadow-lg border overflow-hidden ${
      isDarkMode 
        ? 'bg-gray-950 border-white/5 text-[#F97316]' 
        : 'bg-white border-orange-100 text-[#F97316]'
    }`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="absolute block"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// Standard block container for two-digit quantities (Hours / Minutes / Seconds)
const TimeBlock = ({ label, value }) => {
  const { isDarkMode } = useTheme();
  // Ensure we have two digits represented
  const stringVal = String(value).padStart(2, '0');
  const d1 = stringVal[0];
  const d2 = stringVal[1];

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div className="flex gap-1">
        <AnimatedDigit digit={d1} />
        <AnimatedDigit digit={d2} />
      </div>
      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {label}
      </span>
    </div>
  );
};

// Multi-Product Data for Flash Sale Carousel or Tiles
const FLASH_DEALS = [
  {
    id: "deal_1",
    title: "Premium ANC Earbuds",
    originalPrice: 7500,
    salePrice: 2250,
    discount: "70% OFF",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
    category: "Electronics",
    stockProgress: 84
  },
  {
    id: "deal_2",
    title: "Minimalist Leather Chrono",
    originalPrice: 12500,
    salePrice: 4999,
    discount: "60% OFF",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    category: "Fashion",
    stockProgress: 35
  },
  {
    id: "deal_3",
    title: "Smart Sports Tracker v5",
    originalPrice: 6000,
    salePrice: 2400,
    discount: "60% OFF",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop",
    category: "Electronics",
    stockProgress: 58
  }
];

const FlashSaleTimer = () => {
  const { isDarkMode } = useTheme();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Create or retrieve persistent Sale Expiration timestamp
  // We specify a fixed hours limit (e.g., 8 hours out from initial fetch)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [selectedDealIdx, setSelectedDealIdx] = useState(0);

  useEffect(() => {
    const getTargetTime = () => {
      const stored = localStorage.getItem('flash_sale_target');
      if (stored) {
        const timeVal = parseInt(stored, 10);
        // If stored target is valid and still in the future, return it
        if (timeVal > Date.now()) {
          return timeVal;
        }
      }
      
      // Otherwise set target to 8 hours in the future
      const newTarget = Date.now() + 8 * 60 * 60 * 1000 + 45 * 1000;
      localStorage.setItem('flash_sale_target', String(newTarget));
      return newTarget;
    };

    const targetTime = getTargetTime();

    const calculateTime = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        return false;
      }

      const totalSecs = Math.floor(diff / 1000);
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      setTimeLeft({ hours, minutes, seconds });
      return true;
    };

    calculateTime();
    const interval = setInterval(() => {
      const active = calculateTime();
      if (!active) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Alert when Flash Sale finishes
  useEffect(() => {
    if (isExpired) {
      Swal.fire({
        icon: 'info',
        title: 'Flash Sale Concluded!',
        text: 'The current wave of flash bargains has ended. But don\'t worry, new discount matrices are spinning up soon!',
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#111827',
      });
    }
  }, [isExpired, isDarkMode]);

  const handleShopNowClick = () => {
    const deal = FLASH_DEALS[selectedDealIdx];
    navigate(`/products?category=${deal.category}`);
  };

  const handleSelectDeal = (idx) => {
    setSelectedDealIdx(idx);
  };

  const currentDeal = FLASH_DEALS[selectedDealIdx];

  return (
    <div className="w-full relative py-6">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#F97316]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-200/10 dark:bg-orange-950/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Flash Sale Banner Wrapper (Responsive Grid) */}
      <div className={`w-full border rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 relative ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-white/5' 
          : 'bg-gradient-to-br from-white via-[#FFFDF9] to-orange-50/10 border-orange-100 shadow-[0_20px_50px_rgba(249,115,22,0.08)]'
      }`}>
        <div className="absolute top-0 left-0 bg-gradient-to-r from-[#F97316]/5 to-transparent w-full h-1 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 md:p-14 items-center">
          
          {/* LEFT PANEL: Branding & Dynamic Countdown Timer */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Live Indicator */}
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-3 h-3 rounded-full bg-red-500"
              />
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/15 text-red-500 text-xs font-black uppercase tracking-widest rounded-full border border-red-500/30">
                <Zap className="w-3.5 h-3.5 fill-red-500" /> Live Flash Sale
              </span>
            </div>

            <div className="space-y-3.5">
              <h2 className={`text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none ${
                isDarkMode ? 'text-white' : 'text-gray-950'
              }`}>
                {language === 'bn' ? 'ফ্ল্যাশ সেল ' : language === 'hi' ? 'फ्लैश सेल ' : language === 'ur' ? 'فلیش سیل ' : 'Super Flash '}
                <span className="text-[#F97316]">Bargains</span>
              </h2>
              <p className={`text-xs sm:text-sm font-semibold max-w-lg leading-relaxed ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Elite Tier products dropped at raw manufacturing prices. Limit of 1 item per customer. Timer counts down in real time!
              </p>
            </div>

            {/* Countdown Clock (Hours, Minutes, Seconds) */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 bg-orange-50/10 dark:bg-black/20 p-4 sm:p-5 rounded-3xl border border-orange-500/10 w-fit">
              <TimeBlock label={language === 'bn' ? 'ঘণ্টা' : 'Hours'} value={timeLeft.hours} />
              <div className="text-[#F97316] font-black text-2xl sm:text-4xl h-fit pb-5 sm:pb-7 animate-pulse">:</div>
              <TimeBlock label={language === 'bn' ? 'মিনিট' : 'Mins'} value={timeLeft.minutes} />
              <div className="text-[#F97316] font-black text-2xl sm:text-4xl h-fit pb-5 sm:pb-7 animate-pulse">:</div>
              <TimeBlock label={language === 'bn' ? 'সেকেন্ড' : 'Secs'} value={timeLeft.seconds} />
            </div>

            {/* Button Component: Highly Visible "Shop Now" */}
            <button
              onClick={handleShopNowClick}
              className="w-full sm:w-fit py-4 px-10 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#F97316] hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Secure Your Deal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* RIGHT PANEL: Highlighted Product / Interactive Carousel Showcase */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            <div className={`p-4 sm:p-6 rounded-[2.5rem] border transition-all h-full flex flex-col justify-between ${
              isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-white border-orange-100 shadow-xl shadow-orange-500/5'
            }`}>
              
              {/* Product Visual Container */}
              <div className="relative rounded-3xl w-full h-48 sm:h-64 object-cover overflow-hidden bg-gray-50 flex items-center justify-center">
                <img 
                  referrerPolicy="no-referrer"
                  src={currentDeal.image} 
                  alt={currentDeal.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Floating stock banner & discount tag */}
                <div className="absolute top-4 left-4 bg-[#F97316] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md">
                  {currentDeal.discount}
                </div>

                <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                  {currentDeal.rating} Rating
                </div>
              </div>

              {/* Product Meta */}
              <div className="mt-5 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{currentDeal.category}</span>
                    <h4 className={`text-base sm:text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentDeal.title}
                    </h4>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-[11px] font-bold line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      ৳{currentDeal.originalPrice.toLocaleString()}
                    </p>
                    <p className="text-lg sm:text-xl font-black text-[#F97316]">
                      ৳{currentDeal.salePrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Stock scarcity bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Reserved stock</span>
                    <span className="text-red-500">{currentDeal.stockProgress}% Claimed!</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div 
                      className="bg-gradient-to-r from-[#F97316] to-red-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${currentDeal.stockProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick selectors for alternate deal items with separate parameters */}
            <div className="flex gap-2.5 items-center justify-center">
              {FLASH_DEALS.map((dl, i) => (
                <button
                  key={dl.id}
                  onClick={() => handleSelectDeal(i)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                    selectedDealIdx === i
                      ? 'bg-[#F97316] text-white border-[#F97316] shadow-md shadow-orange-500/10'
                      : isDarkMode
                        ? 'bg-gray-950 text-gray-400 border-white/5 hover:text-white'
                        : 'bg-white text-gray-500 border-orange-100 hover:text-gray-800'
                  }`}
                >
                  Deal {i + 1}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleTimer;
