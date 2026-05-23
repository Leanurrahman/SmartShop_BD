import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Truck, 
  ChevronLeft, 
  Printer, 
  MessageSquare, 
  Calendar,
  CreditCard,
  CheckCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import OrderStatusTracker from '../components/OrderStatusTracker';
import DeliveryMap from '../components/DeliveryMap';
import Loader from '../components/Loader';
import { getOrderById, updateOrderStatus } from '../services/orderService';
import { formatPrice } from '../utils/helpers';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

const OrderDetails = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleRefundRequest = () => {
    Swal.fire({
      title: 'Refund Request',
      text: 'Our AI will review your request. Proceed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Request Refund',
      confirmButtonColor: '#FF9900'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire('Request Sent', 'We will notify you soon.', 'success');
      }
    });
  };

  if (loading) return <Loader />;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-4">
              <Link to="/orders" className="text-primary font-black uppercase tracking-[3px] text-[10px] inline-flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                 <ChevronLeft className="w-4 h-4" /> Return to Archive
              </Link>
              <h1 className={`text-5xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>Comission #{order.id.slice(0, 8)}</h1>
              <p className={`font-black uppercase text-[10px] tracking-[4px] ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Detailed Logistics Manifest</p>
            </div>
            <div className="flex gap-6">
               <button className={`flex items-center gap-3 px-8 py-5 glass-panel transition-all font-black uppercase tracking-[3px] text-[10px] ${
                 isDarkMode 
                   ? 'border-white/5 bg-white/5 hover:bg-white/10 text-white' 
                   : 'border-orange-100 bg-white hover:bg-gray-50 text-gray-750 shadow-md'
               }`}>
                  <Printer className="w-5 h-5" /> Generate Invoice
               </button>
               <button className="flex items-center gap-3 px-8 py-5 bg-primary text-white rounded-[1.5rem] shadow-2xl orange-shadow hover:scale-105 transition-all font-black uppercase tracking-[3px] text-[10px]">
                  <MessageSquare className="w-5 h-5" /> Signal Support
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
               
               {/* Order Status */}
               <div className={`glass-panel p-10 shadow-2xl rounded-[4rem] ${
                 isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-950 shadow-md shadow-orange-500/5'
               }`}>
                  <div className="flex items-center justify-between mb-12">
                     <div className="space-y-2">
                       <h3 className="text-2xl font-black italic tracking-tight">Status Matrix</h3>
                       <p className={`text-[9px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Real-time Telemetry Data</p>
                     </div>
                     <span className="text-[10px] glass-panel border-primary/20 bg-primary/5 text-primary px-6 py-2 rounded-full font-black uppercase tracking-widest">{order.orderStatus} Protocol</span>
                  </div>
                  <OrderStatusTracker status={order.orderStatus} />
               </div>

               {/* Items List */}
               <div className={`glass-panel p-10 shadow-2xl rounded-[4rem] overflow-hidden ${
                 isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-950 shadow-md shadow-orange-500/5'
               }`}>
                  <h3 className="text-2xl font-black italic tracking-tight mb-10">Unit Breakdown</h3>
                  <div className="space-y-6">
                     {order.items?.map((item, idx) => (
                       <div key={idx} className={`flex items-center gap-8 p-6 rounded-3xl glass-panel transition-all shadow-xl group ${isDarkMode ? 'border-white/5 bg-white/5 hover:border-white/20' : 'border-orange-100/50 bg-gray-50 hover:border-orange-200'}`}>
                          <div className={`w-24 h-24 glass-panel p-1 rounded-2xl overflow-hidden shrink-0 ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-white'}`}>
                            <img src={item.images?.[0]} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" alt="" />
                          </div>
                          <div className="flex-1">
                             <Link to={`/products/${item.id}`} className={`font-black italic text-xl tracking-tight hover:text-primary transition-colors leading-none decoration-primary/30 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</Link>
                             <p className={`text-[9px] font-black uppercase tracking-widest mt-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>{item.category} Sector</p>
                             <div className="flex items-center gap-6 mt-4">
                                <span className="text-primary font-black text-xl italic tracking-tighter">৳ {formatPrice(item.discountPrice || item.price).replace('TK', '')}</span>
                                <span className={`text-[10px] font-black uppercase tracking-[2px] ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Qty: {item.quantity} Unit{item.quantity !== 1 ? 's' : ''}</span>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Mock Delivery Map */}
               <div className={`glass-panel p-2 shadow-2xl rounded-[4.5rem] overflow-hidden ${
                 isDarkMode ? 'border-white/10 bg-white/5' : 'border-orange-100 bg-white shadow-md shadow-orange-500/5'
               }`}>
                  <DeliveryMap address={order.shippingAddress?.address} />
               </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-12">
               <div className={`glass-panel p-10 rounded-[3.5rem] shadow-[0_30px_100px_-20px_rgba(255,153,0,0.2)] relative overflow-hidden group border-primary/20 bg-primary/5 ${
                 isDarkMode ? 'text-white' : 'text-gray-900'
               }`}>
                  <CreditCard className="w-16 h-16 text-primary mb-8" />
                  <h3 className="text-3xl font-black italic tracking-tight mb-8">Protocol Clearance</h3>
                  <div className="space-y-6 text-[10px] font-black tracking-widest uppercase">
                     <div className="flex justify-between items-end">
                        <span className={`tracking-[3px] ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Settlement Method</span>
                        <span className={isDarkMode ? 'text-white/80' : 'text-gray-700'}>{order.paymentMethod}</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className={`tracking-[3px] ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Status Signal</span>
                        <span className="text-primary italic text-lg leading-none">{order.paymentStatus}</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className={`tracking-[3px] ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>ID Hash</span>
                        <span className={`font-mono tracking-tighter truncate max-w-[120px] ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{order.transactionId}</span>
                     </div>
                  </div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
               </div>

               <div className={`glass-panel p-10 shadow-2xl rounded-[3.5rem] ${
                 isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-950 shadow-md shadow-orange-500/5'
               }`}>
                  <h3 className="text-2xl font-black italic tracking-tight mb-8">Ledger Summary</h3>
                  <div className="space-y-5 mb-8">
                     <div className={`flex justify-between items-end text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                        <span>Unit Aggregate</span>
                        <span className={isDarkMode ? 'text-white/80' : 'text-gray-750'}>{formatPrice(order.subtotal)}</span>
                     </div>
                     <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[3px] text-green-500 font-bold">
                        <span>Logic Applied</span>
                        <span>-{formatPrice(order.discount)}</span>
                     </div>
                     <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[3px] text-blue-500 font-bold">
                        <span>Logistics</span>
                        <span className={`tracking-[1px] text-[9px] glass-panel px-3 py-1 rounded-full leading-none ${
                          isDarkMode ? 'border-blue-400/20 bg-blue-500/5' : 'border-blue-100 bg-blue-50 text-blue-600'
                        }`}>Complimentary</span>
                     </div>
                     <div className={`h-px my-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-primary">Final Clearance</span>
                        <span className="text-4xl font-black text-primary italic tracking-tighter">৳ {formatPrice(order.total).replace('TK', '')}</span>
                     </div>
                  </div>
                  <button 
                    onClick={handleRefundRequest}
                    className={`w-full py-5 glass-panel rounded-[1.5rem] font-black uppercase tracking-[4px] text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-2xl ${
                      isDarkMode ? 'border-red-500/20 text-red-500/60 bg-white/5' : 'border-red-100 text-red-500 bg-red-50/50'
                    }`}
                  >
                     Request Reversal
                  </button>
               </div>

               <div className="glass-panel p-10 border-white/10 shadow-2xl bg-white/5 rounded-[3.5rem]">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 glass-panel border-green-500/20 bg-green-500/5 text-green-400 rounded-2xl flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                     <div className="space-y-1">
                       <h3 className="font-black italic text-xl tracking-tight leading-none">Target Vector</h3>
                       <p className="text-[9px] font-black uppercase tracking-[3px] text-white/20">Shipping Info</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="font-black italic text-xl tracking-tight">{order.customerName}</p>
                     <p className="text-[10px] font-black uppercase tracking-[4px] text-primary">{order.phone}</p>
                     <p className="text-sm text-white/40 italic leading-relaxed tracking-tight border-t border-white/5 pt-4">{order.shippingAddress?.address}, {order.shippingAddress?.city} Sector</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default OrderDetails;
