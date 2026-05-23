import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="relative">
        <motion.div
          className="w-20 h-20 border-2 border-primary/20 border-t-primary rounded-[1.5rem] glass-panel"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 w-20 h-20 border-2 border-blue-500/20 border-b-blue-500 rounded-[1.5rem] glass-panel"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-4 h-4 bg-primary rounded-full blur-[4px]"
          />
        </div>
      </div>
      <motion.p 
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-[10px] font-black uppercase tracking-[5px] text-white/30"
      >
        Initializing Nexus Registry...
      </motion.p>
    </div>
  );
};

export default Loader;
