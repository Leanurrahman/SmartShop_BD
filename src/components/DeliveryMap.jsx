import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Truck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DeliveryMap = ({ address }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`rounded-[3.5rem] h-80 relative overflow-hidden flex items-center justify-center glass-panel ${
      isDarkMode ? 'bg-white/5 border-white/5' : 'bg-orange-50/30 border-orange-100'
    }`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Mock grid lines for map feel */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-8">
           {[...Array(96)].map((_, i) => <div key={i} className="border-[0.5px] border-primary/20" />)}
        </div>
      </div>

      <div className={`relative text-center p-12 glass-panel backdrop-blur-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3rem] max-w-sm z-10 ${
        isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'
      }`}>
        <div className="w-16 h-16 glass-panel border-primary/20 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 orange-shadow">
          <MapPin className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-black italic tracking-tight mb-2">Vector Tracking</h4>
        <p className={`text-[10px] font-black uppercase tracking-[2px] mb-6 leading-relaxed px-4 ${
          isDarkMode ? 'text-white/20' : 'text-gray-500'
        }`}>{address || "Processing delivery location data..."}</p>
        <div className="flex items-center gap-4 justify-center">
           <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="flex items-center gap-3 glass-panel border-primary/30 bg-primary/10 text-primary px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest"
           >
              <Truck className="w-4 h-4" /> Transit Active
           </motion.div>
        </div>
      </div>

      {/* Decorative cybernetic lines */}
      <div className="absolute left-0 right-0 h-[1px] bg-primary/10 bottom-1/4 -skew-y-3" />
      <div className="absolute top-0 bottom-0 w-[1px] bg-primary/10 right-1/4 -skew-x-3" />
      <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/5" />
      <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-white/5" />
    </div>
  );
};

export default DeliveryMap;
