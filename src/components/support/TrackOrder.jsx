import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Package, ShieldCheck, MapPin, 
  CreditCard, Calendar, Truck, Clock 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getOrderById } from '../../services/orderService';
import { useTheme } from '../../context/ThemeContext';

const TrackOrder = () => {
  const { isDarkMode } = useTheme();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Empty Order ID',
        text: 'Please enter a valid Order ID to initiate tracking.',
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
      return;
    }

    setLoading(true);
    setOrder(null);
    try {
      const data = await getOrderById(orderId.trim());
      setOrder(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Order Not Found',
        text: 'Could not find any order with ID: ' + orderId,
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to resolve tracker milestones status
  const getStatusStep = (status) => {
    const s = String(status || 'Pending').toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'shipped') return 3;
    if (s === 'processing') return 2;
    return 1; // Pending
  };

  const steps = [
    { title: 'Ordered', desc: 'Awaiting validation', icon: Calendar },
    { title: 'Processing', desc: 'Being prepared', icon: Clock },
    { title: 'Shipped', desc: 'In transit', icon: Truck },
    { title: 'Delivered', desc: 'Dispatched successfully', icon: ShieldCheck }
  ];

  const currentStep = order ? getStatusStep(order.orderStatus || order.status) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <Package className="w-5 h-5 text-[#F97316]" />
        <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Order Tracking Terminal</h3>
      </div>

      {/* Tracker search bar form */}
      <div className={`p-6 rounded-[2rem] border ${
        isDarkMode ? 'bg-gray-950/85 border-white/10' : 'bg-white border-orange-100 shadow-[0_15px_30px_-15px_rgba(249,115,22,0.08)]'
      }`}>
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Paste your Order ID here (e.g. 5xX8yZ...)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className={`w-full py-3.5 pl-12 pr-4 rounded-xl text-xs font-semibold outline-none transition-all border ${
                isDarkMode 
                  ? 'bg-gray-900 border-white/10 text-white focus:border-[#F97316]' 
                  : 'bg-orange-50/20 border-orange-100/70 text-gray-805 focus:border-[#F97316]'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all transform active:scale-95 cursor-pointer ${
              loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-[#F97316] hover:bg-orange-600 shadow-md'
            }`}
          >
            {loading ? 'Searching...' : 'Lookup Status'}
          </button>
        </form>
      </div>

      {/* Lookup results */}
      <AnimatePresence mode="wait">
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6"
          >
            {/* Tracking timeline */}
            <div className={`md:col-span-3 p-6 sm:p-8 rounded-[2rem] border flex flex-col justify-between ${
              isDarkMode ? 'bg-gray-950/85 border-white/10' : 'bg-white border-orange-100'
            }`}>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#F97316]">Order Reference</span>
                    <h4 className={`text-sm font-black tracking-tight mt-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      #{order.id.slice(0, 12)}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    order.status === 'Delivered' || order.orderStatus === 'Delivered'
                      ? 'bg-green-100 text-green-600 dark:bg-green-950/20'
                      : 'bg-orange-100 text-[#F97316] dark:bg-orange-950/20 animate-pulse'
                  }`}>
                    {order.orderStatus || order.status}
                  </span>
                </div>

                {/* Timeline display */}
                <div className="relative pl-6 py-2 flex flex-col gap-8">
                  {/* Vertical bar */}
                  <div className={`absolute left-2 top-4 bottom-4 w-0.5 ${isDarkMode ? 'bg-gray-800' : 'bg-orange-50'}`} />
                  
                  {steps.map((st, i) => {
                    const stepNum = i + 1;
                    const isPassed = currentStep >= stepNum;
                    const S_Icon = st.icon;

                    return (
                      <div key={i} className="relative flex items-start gap-4">
                        {/* Bullet point */}
                        <div className={`absolute -left-[22px] w-4.5 h-4.5 rounded-full border-2 transition-all flex items-center justify-center ${
                          isPassed 
                            ? 'bg-[#F97316] border-[#F97316] text-white' 
                            : isDarkMode 
                              ? 'bg-gray-900 border-gray-800 text-gray-500' 
                              : 'bg-white border-orange-100 text-gray-400'
                        }`}>
                          {isPassed && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>

                        <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                          isPassed 
                            ? 'bg-[#F97316]/15 border-[#F97316]/25 text-[#F97316]' 
                            : isDarkMode 
                              ? 'bg-gray-900 border-gray-800 text-gray-600' 
                              : 'bg-neutral-50/50 border-orange-50 text-gray-450'
                        }`}>
                          <S_Icon className="w-4 h-4" />
                        </div>

                        <div>
                          <h5 className={`text-xs font-black transition-colors ${
                            isPassed 
                              ? isDarkMode ? 'text-white' : 'text-gray-900' 
                              : 'text-gray-400'
                          }`}>
                            {st.title}
                          </h5>
                          <p className={`text-[10px] mt-0.5 ${isPassed ? 'text-gray-400' : 'text-gray-400/60'}`}>
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Invoiced details summary card */}
            <div className="md:col-span-2 space-y-6">
              {/* Delivery Destination */}
              <div className={`p-6 rounded-[2rem] border ${
                isDarkMode ? 'bg-gray-950/85 border-white/10' : 'bg-[#FFFDF9] border-orange-100'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#F97316]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#F97316]">Destination</h4>
                </div>
                <p className={`text-xs font-bold leading-relaxed ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
                  {order.shippingAddress?.fullName || order.fullName || 'No Name Provided'}
                </p>
                <p className="text-[11px] font-semibold text-gray-400 leading-relaxed mt-1">
                  {order.shippingAddress?.address || order.address || 'Address Unknown'}, {order.shippingAddress?.city || order.city || ''}
                </p>
                <p className="text-[11px] font-semibold text-gray-400 mt-1">
                  Contact: {order.shippingAddress?.phone || order.phone || 'N/A'}
                </p>
              </div>

              {/* Bill totals */}
              <div className={`p-6 rounded-[2rem] border ${
                isDarkMode ? 'bg-gray-950/85 border-white/10' : 'bg-[#FFFDF9] border-orange-100'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-[#F97316]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#F97316]">Payment Details</h4>
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between text-gray-400">
                    <span>Payment Method</span>
                    <span className={`font-black uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-805'}`}>
                      {order.paymentMethod || 'COD'}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Payment Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      order.paymentStatus === 'Paid' || order.paymentStatus === 'Completed'
                        ? 'bg-green-150 text-green-600 dark:bg-green-950/10'
                        : 'bg-yellow-150 text-yellow-600 dark:bg-yellow-950/10'
                    }`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  <hr className={`border-t my-3 ${isDarkMode ? 'border-gray-800' : 'border-orange-50'}`} />
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className={isDarkMode ? 'text-white/60' : 'text-gray-800'}>Total Invoice</span>
                    <span className="text-[#F97316] text-sm">৳ {Number(order.total || order.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TrackOrder;
