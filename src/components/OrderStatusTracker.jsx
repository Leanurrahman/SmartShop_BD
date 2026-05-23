import React from 'react';
import { motion } from 'framer-motion';
import { Check, Truck, Package, Clock, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const OrderStatusTracker = ({ status }) => {
  const { isDarkMode } = useTheme();
  const steps = [
    { label: "Pending", icon: Clock },
    { label: "Confirmed", icon: ShieldCheck },
    { label: "Processing", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: Check },
  ];

  const currentStep = steps.findIndex(s => s.label === status);

  return (
    <div className={`relative py-16 px-6 glass-panel rounded-[3rem] ${
      isDarkMode ? 'border-white/5 bg-white/5 text-white' : 'border-orange-100 bg-gray-50 text-gray-900'
    }`}>
      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentStep;
          const isActive = idx === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center gap-4 relative flex-1">
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.3 : 1,
                  boxShadow: isActive ? "0 0 40px rgba(255,153,0,0.4)" : "none"
                }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all glass-panel ${
                  isCompleted 
                    ? 'bg-primary border-primary/20 text-white shadow-xl' 
                    : isDarkMode 
                      ? 'bg-white/5 border-white/10 text-white/20'
                      : 'bg-white border-orange-100 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-7 h-7 font-black" /> : <Icon className="w-6 h-6" />}
              </motion.div>
              
              {/* Label */}
              <div className="space-y-1">
                <span className={`text-[9px] font-black uppercase tracking-[2px] block text-center ${
                  isCompleted 
                    ? 'text-primary' 
                    : isDarkMode 
                      ? 'text-white/20'
                      : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 bg-primary rounded-full mx-auto"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </div>

              {/* Progress Line */}
              {idx < steps.length - 1 && (
                <div className={`absolute top-7 left-1/2 w-full h-[2px] -z-10 ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}>
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: idx < currentStep ? "100%" : "0%" }}
                    className="h-full bg-primary shadow-[0_0_10px_rgba(255,153,0,0.5)]"
                   />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
