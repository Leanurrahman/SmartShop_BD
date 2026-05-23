import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { getFAQs } from '../../services/adminService';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_FAQS = [
  {
    id: 'f1',
    question: 'How do I track my order?',
    answer: 'You can check your order delivery status by using the "Track Order" utility on this support portal. Simply paste your Order ID, which is emailed to you after checkout, and press lookup.'
  },
  {
    id: 'f2',
    question: 'What payment methods do you accept?',
    answer: 'We accept bKash, Nagad, Cash On Delivery (COD), Stripe, and major international credit cards like Visa or Mastercard for smooth transactions.'
  },
  {
    id: 'f3',
    question: 'What is your refund policy?',
    answer: 'We provide a 7-day hassle-free return policy if products are returned intact with their original seals, price tags, and packing inserts.'
  },
  {
    id: 'f4',
    question: 'How long does shipment take in Dhaka?',
    answer: 'Delivery within Dhaka takes 24 to 48 hours maximum. Outside of Dhaka, delivery generally requires between 3 to 5 business days.'
  },
  {
    id: 'f5',
    question: 'Are there electronic warranties?',
    answer: 'Warranty coverage varies list of products. Products with warranty include certificates inside the original box. Check product details before placing order.'
  }
];

const FAQs = () => {
  const { isDarkMode } = useTheme();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const dbFaqs = await getFAQs();
        if (dbFaqs && dbFaqs.length > 0) {
          setFaqs(dbFaqs);
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      } catch (err) {
        console.error("Error loading FAQs from database, using built-in presets.", err);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleAccordion = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#F97316] animate-spin mb-3" />
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Syncing FAQs database...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-5 h-5 text-[#F97316]" />
        <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h3>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div 
              key={faq.id || index}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isOpen 
                  ? isDarkMode 
                    ? 'bg-gray-950 border-white/20' 
                    : 'bg-[#FFFDF9] border-[#F97316]' 
                  : isDarkMode 
                    ? 'bg-gray-950/40 border-white/5 hover:border-white/10' 
                    : 'bg-white border-orange-100 shadow-[0_10px_20px_-15px_rgba(249,115,22,0.05)]'
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer group"
              >
                <span className={`text-xs font-bold transition-colors ${
                  isOpen 
                    ? 'text-[#F97316]' 
                    : isDarkMode 
                      ? 'text-white/80 group-hover:text-white' 
                      : 'text-gray-700 group-hover:text-[#F97316]'
                }`}>
                  {faq.question}
                </span>
                <span className={`p-1 rounded-lg transition-colors ${
                  isOpen ? 'bg-[#F97316]/10 text-[#F97316]' : 'bg-neutral-500/10 text-gray-400'
                }`}>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className={`p-5 pt-0 text-xs leading-relaxed font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} border-t border-orange-50/10 dark:border-white/5 mt-1`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FAQs;
