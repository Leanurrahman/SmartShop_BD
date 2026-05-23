import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, RotateCcw, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { getSupportPolicy } from '../../services/adminService';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_RETURNS_POLICY = `
### 7-Days Easy Return & Exchange Policy

At **SmartShop BD**, we prioritize your satisfaction. If you are not completely satisfied with your purchase, we are here to assist with an easy refund or exchange.

#### Standard Requirements for Returns:
1. **Timeframe:** Return request must be initiated within **7 days** of the delivery date.
2. **Product State:** The item must be unused, unwashed, and in its original packaging with all security seals, tags, barcodes, and manuals intact.
3. **Receipt Required:** A valid invoice or proof of purchase is mandatory.

#### Returns Exclusion List
The following products are strictly excluded from returns unless received damaged or defective:
- Personal care hygiene items
- Undergarments and swimwear
- Clearance and Flash sale products
- Digital gift cards or downloadable software

#### How to Initiate a Return:
- Step 1: Package your items securely, keeping original invoice copy inside the package.
- Step 2: Contact our Customer Care line at **+880 1234 567 890** or send a query inside our **Contact Us** tab.
- Step 3: Send the package via any courier to our local processing center in Sector 3, Uttara, Dhaka.
`;

const ReturnsPolicy = () => {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policy = await getSupportPolicy('returns');
        if (policy && policy.content) {
          setContent(policy.content);
        } else {
          setContent(DEFAULT_RETURNS_POLICY);
        }
      } catch (err) {
        console.error("Error loading returns policy:", err);
        setContent(DEFAULT_RETURNS_POLICY);
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
        <RotateCcw className="w-5 h-5 text-[#F97316]" />
        <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Returns & Refunds Policy</h3>
      </div>

      <div className={`p-6 sm:p-8 rounded-[2rem] border ${
        isDarkMode ? 'bg-gray-950/85 border-white/10 text-gray-300' : 'bg-white border-orange-100 text-gray-700 font-semibold'
      }`}>
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400 font-semibold animate-pulse">
            Fetching return policies...
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

export default ReturnsPolicy;
