import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, X, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../services/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { 
  getActiveLotteryOffers, 
  checkUserEligibility, 
  recordUserSpin 
} from '../services/adminService';
import LotteryModal from './LotteryModal';
import Swal from 'sweetalert2';

// Polar coordinate math for precision vector sector arcs
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ");
};

const generateRandomCode = (length = 4) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const LotteryWheel = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  // Widget states
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [offers, setOffers] = useState([]);
  const [activeOccasions, setActiveOccasions] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Wheel rotation state
  const [rotation, setRotation] = useState(0);
  const [prizeIndex, setPrizeIndex] = useState(null);
  
  // Win Modal state
  const [showWinModal, setShowWinModal] = useState(false);
  const [winPrize, setWinPrize] = useState(null);

  // Default campaign falling blocks if database has none loaded
  const DEFAULT_OFFERS = [
    { id: 'def1', name: 'Eid Extra 15%', discount: 15, discountType: 'percentage', occasion: 'Eid', category: 'all', expiryDate: '2026-12-31' },
    { id: 'def2', name: '৳50 Off Deal', discount: 50, discountType: 'fixed', occasion: 'Daily Luck', category: 'all', expiryDate: '2026-12-31' },
    { id: 'def3', name: 'Winter Super 20%', discount: 20, discountType: 'percentage', occasion: 'New Year', category: 'all', expiryDate: '2026-12-31' },
    { id: 'def4', name: 'Smart Choice ৳80', discount: 80, discountType: 'fixed', occasion: 'Daily Luck', category: 'all', expiryDate: '2026-12-31' },
    { id: 'def5', name: 'Eid Special 10%', discount: 10, discountType: 'percentage', occasion: 'Eid', category: 'all', expiryDate: '2026-12-31' },
    { id: 'def6', name: 'Qurban Flash ৳150', discount: 150, discountType: 'fixed', occasion: 'Qurban', category: 'all', expiryDate: '2026-12-31' }
  ];

  // Load Active Campaigns
  useEffect(() => {
    loadCampaigns();
  }, [isWidgetOpen]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const activeOffers = await getActiveLotteryOffers();
      
      let displayOffers = activeOffers;
      // Fallback if empty
      if (!activeOffers || activeOffers.length === 0) {
        displayOffers = DEFAULT_OFFERS;
      }
      
      setOffers(displayOffers);
      
      // Extract unique occasions
      const uniqueOccasions = [...new Set(displayOffers.map(o => o.occasion))];
      setActiveOccasions(uniqueOccasions);
      
      if (uniqueOccasions.length > 0 && !selectedOccasion) {
        setSelectedOccasion(uniqueOccasions[0]);
      }
    } catch (e) {
      console.error("Error loading wheel campaigns:", e);
      setOffers(DEFAULT_OFFERS);
      setActiveOccasions(['Eid', 'Daily Luck', 'New Year']);
      setSelectedOccasion('Eid');
    } finally {
      setLoading(false);
    }
  };

  // Filter offers for the selected occasion
  const currentOccasionOffers = offers.filter(o => o.occasion === selectedOccasion);
  
  // Make sure we have at least 4 wheel sectors to keep it visually balanced
  const getSectors = () => {
    if (currentOccasionOffers.length === 0) return DEFAULT_OFFERS;
    let sectors = [...currentOccasionOffers];
    while (sectors.length < 4) {
      sectors = [...sectors, ...currentOccasionOffers];
    }
    return sectors;
  };

  const sectors = getSectors();

  const handleSpinClick = async () => {
    if (isSpinning) return;

    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please sign in to take a spin on the lucky wheel and save discount rewards!',
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
      return;
    }

    try {
      setIsSpinning(true);

      // Verify Spin Eligibility
      const eligible = await checkUserEligibility(user.uid, selectedOccasion);
      if (!eligible) {
        Swal.fire({
          icon: 'warning',
          title: 'Spin Limit Reached',
          text: `You have already spun for the '${selectedOccasion}' campaign. Max 1 spin per occasion. Use your won coupon at checkout!`,
          confirmButtonColor: '#F97316',
          background: isDarkMode ? '#111827' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        });
        setIsSpinning(false);
        return;
      }

      // Pick random winning index
      const winIdx = Math.floor(Math.random() * sectors.length);
      setPrizeIndex(winIdx);

      // Calculate Rotation Math
      // A sector is 360 / sectors.length. Pointer is at 0 degrees (top).
      // If we rotate wheel clockwise, the sector at index 'winIdx' must land at the top.
      const sectorDegrees = 360 / sectors.length;
      const targetAngle = 360 - (winIdx + 0.5) * sectorDegrees;
      
      // Let's spin 6 full circles + targetAngle
      const extraSpin = 6 * 360;
      const finalRotation = rotation - (rotation % 360) + extraSpin + targetAngle;
      
      setRotation(finalRotation);

      // We complete the state resolution inside the animation finish handler
    } catch (e) {
      console.error("Error executing spin wheel:", e);
      setIsSpinning(false);
    }
  };

  const handleAnimationComplete = async () => {
    if (prizeIndex === null) return;
    
    try {
      const winner = sectors[prizeIndex];
      const codeStr = `SPIN-${winner.occasion.substring(0,3).toUpperCase()}-${winner.discount}-${generateRandomCode(4)}`;
      
      // CREATE COUPON RECORD IN FIRESTORE FOR REAL CHECKOUT
      const couponRef = doc(db, "coupons", codeStr);
      await setDoc(couponRef, {
        code: codeStr,
        active: true,
        expiryDate: winner.expiryDate || new Date(Date.now() + 7*24*60*60*100).toISOString().split('T')[0],
        discountValue: Number(winner.discount),
        discountType: winner.discountType,
        usedCount: 0,
        usageLimit: 1,
        minimumOrderAmount: 0,
        category: winner.category || 'all',
        description: `Won via Spin-to-Win campaign occasion (${winner.occasion})`,
        createdAt: new Date().toISOString()
      });

      const prizeObj = {
        offerId: winner.id || 'default_offer',
        offerName: winner.name || 'Discount Offer',
        name: winner.name,
        discount: Number(winner.discount),
        discountValue: Number(winner.discount),
        discountType: winner.discountType,
        code: codeStr,
        occasion: winner.occasion,
        category: winner.category || 'all'
      };

      // RECORD SPIN IN FIRESTORE
      await recordUserSpin(user.uid, user.email, prizeObj);

      // SAVE SPIN COUPON IN LOCAL STORAGE FOR AUTOMATIC RECONCILIATION
      localStorage.setItem('appliedSpinCoupon', JSON.stringify(prizeObj));

      setWinPrize(prizeObj);
      setShowWinModal(true);
      setIsWidgetOpen(false); // Close wheel dialog
    } catch (e) {
      console.error("Error finalizing lottery win:", e);
    } finally {
      setIsSpinning(false);
      setPrizeIndex(null);
    }
  };

  // SVG dimensions for vector programmatic wheel
  const wheelSize = 340;
  const cx = wheelSize / 2;
  const cy = wheelSize / 2;
  const radius = wheelSize / 2 - 10;
  const sectorDegrees = 360 / sectors.length;

  const sectorColors = [
    '#F97316', // Orange
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Yellow
  ];

  return (
    <>
      {/* Persistently Floating Badge Trigger in the Bottom Right screen */}
      <div className="fixed bottom-24 right-5 sm:right-8 z-50">
        <motion.button
          onClick={() => setIsWidgetOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-4 bg-[#F97316] hover:bg-orange-600 text-white font-black text-sm rounded-full shadow-[0_15px_30px_rgba(249,115,22,0.3)] transition-all cursor-pointer relative group-hover:scale-105"
        >
          <Gift className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden md:max-w-xs transition-all duration-300 group-hover:max-w-xs group-hover:-mr-2 font-bold whitespace-nowrap">
            Spin & Win!
          </span>
          <span className="text-[9px] px-1.5 py-0.5 bg-white text-[#F97316] rounded-full font-black">
            NEW
          </span>
        </motion.button>
      </div>

      {/* Slide-over Wheel Modal Container */}
      <AnimatePresence>
        {isWidgetOpen && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isSpinning) setIsWidgetOpen(false); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className={`w-full max-w-md relative p-8 rounded-[3rem] shadow-2xl border transition-colors ${
                isDarkMode 
                  ? 'bg-[#111827] border-orange-500/20 text-white' 
                  : 'bg-white border-orange-100 text-gray-900'
              }`}
            >
              {/* Close Button */}
              <button
                disabled={isSpinning}
                onClick={() => setIsWidgetOpen(false)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-all disabled:opacity-30 ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                }`}
              >
                <X size={16} />
              </button>

              <div className="space-y-6 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-[4px] text-[#F97316] flex items-center justify-center gap-1.5">
                    <Sparkles size={12} className="animate-pulse" /> Seasonal Lottery Wheel <Sparkles size={12} className="animate-pulse" />
                  </span>
                  <h3 className="text-2xl font-black tracking-tight leading-none bg-gradient-to-r from-orange-505 to-red-500 bg-clip-text text-transparent">
                    Spin to Claim Reward
                  </h3>
                </div>

                {/* Campaign Occasion Selector Dropdown */}
                {activeOccasions.length > 1 && (
                  <div className="space-y-1.5 text-left max-w-xs mx-auto">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      Choose Campaign Activity:
                    </label>
                    <select
                      disabled={isSpinning}
                      className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-semibold text-[#F97316] transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-800' 
                          : 'bg-orange-50/50 border-orange-100'
                      }`}
                      value={selectedOccasion}
                      onChange={(e) => setSelectedOccasion(e.target.value)}
                    >
                      {activeOccasions.map(occ => (
                        <option key={occ} value={occ}>{occ} Campaign</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Highly Polished SVG Spinning Wheel representation */}
                <div className="flex justify-center py-4 relative select-none">
                  {/* Surrounding Outer Golden Ring Border shadow */}
                  <div className={`p-4 rounded-full border-4 shadow-xl relative ${
                    isDarkMode ? 'border-orange-500/10 bg-gray-900/40' : 'border-orange-100 bg-orange-50/20'
                  }`}>
                    
                    {/* Golden Indicator Pointer Pin at the exact top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30 drop-shadow-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21L3 6h18L12 21z" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Concentric Rotating Wheel */}
                    <motion.div
                      animate={{ rotate: rotation }}
                      transition={isSpinning ? { duration: 5, ease: [0.15, 0.85, 0.35, 1] } : { duration: 0 }}
                      onAnimationComplete={handleAnimationComplete}
                      className="w-[340px] h-[340px] relative rounded-full overflow-hidden flex items-center justify-center pointer-events-none"
                    >
                      <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
                        {sectors.map((sector, index) => {
                          const startAngle = index * sectorDegrees;
                          const endAngle = (index + 1) * sectorDegrees;
                          
                          // Vector segment path
                          const pathStr = describeArc(cx, cy, radius, startAngle, endAngle);
                          const color = sectorColors[index % sectorColors.length];
                          
                          // Rotated text sector math alignment
                          const textAngle = startAngle + sectorDegrees / 2;
                          const textCenter = polarToCartesian(cx, cy, radius * 0.62, textAngle);
                          
                          return (
                            <g key={index}>
                              {/* Sector Path slice */}
                              <path 
                                d={pathStr} 
                                fill={color} 
                                stroke={isDarkMode ? '#111827' : '#FFFFFF'} 
                                strokeWidth="2" 
                              />
                              
                              {/* Text Rotated toward core */}
                              <text
                                x={textCenter.x}
                                y={textCenter.y}
                                fill="#FFFFFF"
                                fontSize="10px"
                                fontWeight="bold"
                                textAnchor="middle"
                                transform={`rotate(${textAngle + 180}, ${textCenter.x}, ${textCenter.y})`}
                              >
                                {sector.discountType === 'percentage' ? `${sector.discount}%` : `৳${sector.discount}`}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Decorative Outer Circle Ring */}
                        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.15" />
                      </svg>

                      {/* Small LED Dots pattern */}
                      <div className="absolute inset-4 border border-white/5 rounded-full pointer-events-none" />
                    </motion.div>

                    {/* Central Core Stationary Spin Button */}
                    <button
                      disabled={isSpinning}
                      onClick={handleSpinClick}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#F97316] to-[#FB923C] text-white font-black text-xs tracking-wider flex flex-col items-center justify-center shadow-lg border-2 border-white hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-90 transition-all z-20 cursor-pointer pointer-events-auto cursor-pointer"
                    >
                      {isSpinning ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span className="text-[10px] leading-tight font-black uppercase">SPIN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
                    Test your luck for the **{selectedOccasion} Campaign** wheel! Prizes are immediate valid coupons copyable and automatically active during order checkout.
                  </p>
                  <p className="text-[10px] text-[#F97316] font-black tracking-wide uppercase">
                    1 Free Spin per occasion account
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebratory Winner Modal wrapper */}
      <LotteryModal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        prize={winPrize}
        darkMode={isDarkMode}
      />
    </>
  );
};

export default LotteryWheel;
