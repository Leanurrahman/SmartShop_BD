import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ShoppingBag, Sparkles, Tag, Calendar, Gift } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const LotteryModal = ({ isOpen, onClose, prize, darkMode }) => {
  const { width, height } = useWindowSize();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !prize) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPercentage = prize.discountType === 'percentage';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Confetti Explosion */}
        <Confetti
          width={width}
          height={height}
          numberOfPieces={250}
          recycle={false}
          colors={['#F97316', '#FB923C', '#E0F2FE', '#3B82F6', '#FFD700']}
        />

        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className={`w-full max-w-lg relative overflow-hidden rounded-[3rem] p-8 md:p-10 shadow-[0_50px_100px_-20px_rgba(249,115,22,0.3)] border ${
            darkMode 
              ? 'bg-[#111827] border-orange-500/20 text-white' 
              : 'bg-white border-orange-100 text-gray-900'
          }`}
        >
          {/* Accent Glow rings */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all hover:scale-115 ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
            }`}
          >
            <X size={18} />
          </button>

          <div className="text-center space-y-6 relative z-10">
            {/* Visual Header icon */}
            <div className="inline-flex relative">
              <span className="absolute inset-0 bg-[#F97316]/20 rounded-full animate-ping scale-150 opacity-75" />
              <div className="w-20 h-20 bg-gradient-to-tr from-[#F97316] to-[#FB923C] rounded-full flex items-center justify-center text-white shadow-2xl relative">
                <Gift size={36} className="animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-[4px] text-[#F97316] flex items-center justify-center gap-1.5">
                <Sparkles size={12} /> Congratulations Winner! <Sparkles size={12} />
              </span>
              <h2 className="text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                You Won a Discount!
              </h2>
            </div>

            {/* Price/Discount Display Board */}
            <div className="p-8 rounded-3xl border border-dashed border-orange-500/30 bg-orange-500/5 shadow-inner space-y-4">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                {prize.occasion} Exclusive Offer
              </div>
              <div className="text-5xl font-black text-[#F97316] tracking-tight">
                {isPercentage ? `${prize.discount}%` : `৳${prize.discount}`} OFF
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {prize.name}. Available for{' '}
                {prize.category === 'all' ? (
                  <span className="text-[#F97316] font-bold">all products</span>
                ) : (
                  <span>
                    category: <strong className="text-purple-400 font-bold">{prize.category}</strong>
                  </span>
                )}
                .
              </p>
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider text-left pl-1">
                Your Exclusive checkout code
              </div>
              <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-orange-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Tag className="text-[#F97316] w-5 h-5 flex-shrink-0" />
                  <span className="font-mono font-black text-lg tracking-wider text-[#F97316] uppercase">
                    {prize.code}
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-[#F97316]/90 text-white font-bold rounded-xl text-xs transition-all hover:scale-[1.03]"
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag size={18} /> Apply Option & Start Shopping!
              </button>
            </div>

            <p className="text-[10px] text-gray-400 italic">
              *Your coupon is automatically loaded. Simply check out to apply! Limit 1 spin discount per order.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LotteryModal;
