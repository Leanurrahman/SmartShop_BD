import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getSupportPolicy } from '../../services/adminService';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_SHIPPING_POLICY = `
### Courier & Delivery Information

We design our dispatch logs carefully to guarantee rapid, secure courier shipping across all 64 regions of Bangladesh. 

#### Shipping Charges:
1. **Inside Dhaka Metro:** Flat rate of **৳ 60** per order. 
2. **Outside Dhaka Metro:** Flat rate of **৳ 120** per order.

#### Estimated Cargo transit limits:
- **DHAKA METROPOLITAN:** Deliveries occur within **24 to 48 hours**.
- **DIVISIONS & SUBURBS (Exterior):** Orders will reach destination in **3 to 5 business days**.

#### Delivery Partner Network:
We send shipments through reliable courier services:
- **Pathao Courier** and **Steadfast Courier** for rapid doorstep deliveries inside Dhaka and district headquarters.
- **SA Paribahan** or **Sundarban Courier** for general exterior division pick-up offices.

#### Standard Tracking & Dispatch
- Once your shipment leaves our central depot in Sector 3, Uttara, you will receive a unique dispatch code.
- Always inspect packaging seals before accepting deliveries. If you notice leaks or open tapes, please reject the package and report to our call desk.
`;

const ShippingPolicy = () => {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policy = await getSupportPolicy('shipping');
        if (policy && policy.content) {
          setContent(policy.content);
        } else {
          setContent(DEFAULT_SHIPPING_POLICY);
        }
      } catch (err) {
        console.error("Error loading shipping policy:", err);
        setContent(DEFAULT_SHIPPING_POLICY);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-none"
    >
      <div className="flex items-center gap-3 mb-2">
        <Truck className="w-5 h-5 text-[#F97316]" />
        <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shipping & Logistics Policy</h3>
      </div>

      <div className={`p-6 sm:p-8 rounded-[2rem] border ${
        isDarkMode ? 'bg-gray-950/85 border-white/10 text-gray-300' : 'bg-white border-orange-100 text-gray-700 font-semibold'
      }`}>
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400 font-semibold animate-pulse">
            Fetching shipping policies...
          </div>
        ) : (
          <div className="space-y-4 text-xs leading-relaxed">
            {content.split('\n').map((line, idx) => {
              if (line.startsWith('###')) {
                return (
                  <h4 key={idx} className={`text-sm font-black text-[#F97316] mt-6 mb-2 tracking-tight ${idx === 0 ? 'mt-0' : ''}`}>
                    {line.replace('###', '').trim()}
                  </h4>
                );
              }
              if (line.startsWith('####')) {
                return (
                  <h5 key={idx} className={`text-xs font-black tracking-tight mt-4 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {line.replace('####', '').trim()}
                  </h5>
                );
              }
              if (line.startsWith('-')) {
                return (
                  <div key={idx} className="flex gap-2.5 items-start pl-2 my-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                    <span>{line.replace('-', '').trim()}</span>
                  </div>
                );
              }
              if (line.trim().length > 0) {
                return <p key={idx} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{line}</p>;
              }
              return null;
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShippingPolicy;
