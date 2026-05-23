import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, HelpCircle, Search, RefreshCw, 
  ShieldAlert, Truck, ChevronRight 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SupportSidebar = ({ activeSection, setActiveSection }) => {
  const { isDarkMode } = useTheme();

  const menuItems = [
    { id: 'contact', label: 'Contact Us', icon: Mail, description: 'Get in touch with our team' },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, description: 'Frequently asked questions' },
    { id: 'track', label: 'Track Order', icon: Search, description: 'Check real-time delivery status' },
    { id: 'returns', label: 'Returns & Refunds', icon: ShieldAlert, description: 'Policy and return submissions' },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck, description: 'Rates, regions and schedules' },
  ];

  return (
    <div className={`p-5 rounded-[2rem] border transition-all h-fit ${
      isDarkMode 
        ? 'bg-gray-950/80 border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.4)]' 
        : 'bg-white border-orange-100 shadow-[0_15px_35px_-15px_rgba(249,115,22,0.1)]'
    }`}>
      <h3 className="text-xs font-black uppercase tracking-[3px] text-[#F97316] mb-5">Support Portal</h3>
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="w-full text-left focus:outline-none relative group cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="activeSupportIndicator"
                  className="absolute inset-0 bg-[#F97316]/10 dark:bg-[#F97316]/15 rounded-2xl border-l-[3px] border-[#F97316]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <div className={`flex items-center justify-between p-3.5 rounded-2xl relative z-10 transition-colors ${
                isActive 
                  ? 'text-[#F97316]' 
                  : isDarkMode 
                    ? 'text-white/60 hover:text-white hover:bg-white/5' 
                    : 'text-gray-600 hover:text-[#F97316] hover:bg-orange-50/50'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-[#F97316]/20 text-[#F97316]' 
                      : isDarkMode 
                        ? 'bg-gray-900 border border-gray-800 text-gray-400 group-hover:text-white' 
                        : 'bg-gray-50 border border-gray-100 text-gray-500 group-hover:text-[#F97316]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-tight">{item.label}</h4>
                    <p className={`text-[10px] hidden sm:block ${isActive ? 'text-[#F97316]/75' : 'text-gray-400 font-medium'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all ${
                  isActive ? 'text-[#F97316] translate-x-1' : 'text-gray-400 translate-x-0'
                }`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SupportSidebar;
