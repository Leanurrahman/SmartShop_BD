import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, ChevronRight, Filter, Calendar, MapPin, Truck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getOrdersByUser } from '../services/orderService';
import { formatPrice } from '../utils/helpers';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const MyOrders = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const data = await getOrdersByUser(user.uid);
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
            <div className="space-y-2">
              <h1 className={`text-5xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>My Orders</h1>
              <p className={`font-black uppercase text-[10px] tracking-[4px] ${isDarkMode ? 'text-white/30' : 'text-gray-500/80'}`}>Mission History & Logistics Archive</p>
            </div>
            
            <div className="relative w-full md:w-96 group">
              <input
                type="text"
                placeholder="Search by Order ID..."
                className={`w-full pl-16 pr-8 py-5 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm tracking-tight ${
                  isDarkMode 
                    ? 'glass-panel border-white/5 bg-white/5 text-white placeholder:text-white/30' 
                    : 'glass-panel border-orange-100 bg-white text-gray-950 placeholder:text-gray-400 shadow-xl'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className={`absolute left-6 top-5 w-6 h-6 group-focus-within:text-primary transition-colors ${
                isDarkMode ? 'text-white/20' : 'text-gray-400'
              }`} />
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-10">
               <AnimatePresence mode="popLayout">
                 {filteredOrders.map((order) => (
                   <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`glass-panel p-10 hover:border-primary/20 transition-all group rounded-[3rem] ${
                      isDarkMode 
                        ? 'border-white/10 bg-white/5 shadow-2xl' 
                        : 'border-orange-100 bg-white shadow-xl shadow-orange-500/5'
                    }`}
                   >
                     <div className="flex flex-col md:flex-row justify-between gap-10">
                        <div className="flex-1 space-y-6">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 glass-panel border-primary/20 bg-primary/5 text-primary rounded-2xl flex items-center justify-center orange-shadow">
                                 <Package className="w-8 h-8" />
                              </div>
                              <div>
                                 <h4 className={`font-black italic tracking-tight text-2xl mb-1 ${
                                   isDarkMode ? 'text-white/90' : 'text-gray-900'
                                 }`}>Order #{order.id.slice(0, 8)}</h4>
                                 <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${
                                   isDarkMode ? 'text-white/30' : 'text-gray-500'
                                 }`}>
                                    <Calendar className="w-4 h-4" /> {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex flex-wrap gap-4 pt-2">
                              <div className={`flex items-center gap-3 glass-panel px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                isDarkMode ? 'border-white/5 bg-white/5 text-white/85' : 'border-orange-100/50 bg-gray-50 text-gray-750 font-bold'
                              }`}>
                                 <MapPin className="w-4 h-4 text-primary" /> {order.shippingAddress?.city} Sector
                              </div>
                              <div className={`flex items-center gap-3 glass-panel px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                isDarkMode ? 'border-blue-500/20 bg-blue-500/5 text-blue-400' : 'border-blue-100 bg-blue-50 text-blue-600 font-bold'
                              }`}>
                                 <Truck className="w-4 h-4" /> {order.orderStatus} Protocol
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col items-end gap-6 justify-between">
                           <div className="text-right">
                              <p className={`text-[10px] font-black uppercase mb-2 tracking-[3px] ${
                                isDarkMode ? 'text-white/20' : 'text-gray-450'
                              }`}>Payload Value</p>
                              <p className="text-4xl font-black text-primary italic tracking-tighter leading-none">৳ {formatPrice(order.total).replace('TK', '')}</p>
                           </div>
                           <Link 
                            to={`/orders/${order.id}`}
                            className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[3px] flex items-center gap-3 glass-panel transition-all shadow-2xl transform hover:translate-x-2 ${
                              isDarkMode 
                                ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' 
                                : 'bg-orange-50 hover:bg-orange-100/80 text-[#F97316] border-orange-100 shadow-md shadow-orange-500/5'
                            }`}
                           >
                             Examine Ledger <ChevronRight className="w-5 h-5" />
                           </Link>
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
          ) : (
            <div className={`text-center py-32 glass-panel rounded-[4rem] shadow-2xl relative overflow-hidden ${
              isDarkMode ? 'border-white/10 bg-white/5' : 'border-orange-100 bg-white shadow-xl shadow-orange-500/5'
            }`}>
               <Package className={`w-32 h-32 mx-auto mb-8 opacity-20 ${isDarkMode ? 'text-white/5' : 'text-gray-300'}`} />
               <h3 className={`text-4xl font-black italic mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Zero Commissions Found</h3>
               <p className={`font-black uppercase text-[10px] tracking-[4px] max-w-xs mx-auto mb-12 leading-relaxed ${
                 isDarkMode ? 'text-white/20' : 'text-gray-500'
               }`}>No historical acquisition data detected in this sector.</p>
               <Link to="/products" className="bg-primary text-white px-16 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] inline-block hover:scale-105 transition-all orange-shadow">Initiate Browse Protocol</Link>
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default MyOrders;
