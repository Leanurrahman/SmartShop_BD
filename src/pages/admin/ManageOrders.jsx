import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Printer,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard,
  Calendar
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import Swal from 'sweetalert2';

const statusColors = {
  pending: { bg: 'bg-orange-100', text: 'text-orange-600', icon: Clock },
  processing: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Loader2 },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-600', icon: Truck },
  delivered: { bg: 'bg-green-100', text: 'text-green-600', icon: CheckCircle2 },
  cancelled: { bg: 'bg-red-100', text: 'text-red-600', icon: AlertCircle }
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Order status shifted to ${newStatus.toUpperCase()}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-none">
                Transaction <span className="text-blue-600 italic">Flow</span>
              </h2>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Processing {orders.length} order sequences</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold w-full md:w-80 shadow-inner focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
           {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Order Token</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Customer Node</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Valuation</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Time Stamp</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Pulse Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusColors[order.status?.toLowerCase()]?.icon || Clock;
                  const statusColor = statusColors[order.status?.toLowerCase()] || statusColors.pending;
                  
                  return (
                    <motion.tr 
                      layout
                      key={order.id}
                      className="hover:bg-blue-50/10 transition-colors group"
                    >
                      <td className="p-6">
                        <span className="font-black text-gray-900 font-mono tracking-tighter">#{order.id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="p-6">
                        <div>
                          <p className="font-bold text-gray-900 leading-none mb-1">{order.shippingAddress?.fullName || 'Anonymous'}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[150px]">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-black text-gray-900 italic">৳{order.total?.toLocaleString()}</span>
                      </td>
                      <td className="p-6">
                        <p className="text-xs font-bold text-gray-500 whitespace-nowrap">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${statusColor.bg} ${statusColor.text}`}>
                          <StatusIcon className={`w-3 h-3 ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-3 py-2 focus:ring-blue-500 ring-1 ring-gray-100"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button 
                            onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                            className="p-3 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all active:scale-90"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Displaying {filteredOrders.length} identifiers</p>
            <div className="flex items-center gap-2">
               <button className="p-2 rounded-lg bg-gray-100 text-gray-300" disabled><ChevronLeft className="w-4 h-4"/></button>
               <button className="p-2 rounded-lg bg-gray-100 text-gray-300" disabled><ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
               {/* Modal Header */}
               <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                        <ShoppingBag className="w-6 h-6" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
                          Order Details <span className="text-blue-600">#{selectedOrder.id.slice(-8).toUpperCase()}</span>
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Internal Transaction Log</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm active:scale-90">
                      <Printer className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm active:scale-90"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
               </div>

               <div className="overflow-y-auto p-10 space-y-10 flex-1">
                  {/* Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Customer Info */}
                    <div className="space-y-6">
                      <h4 className="text-sm font-black uppercase tracking-[3px] text-primary flex items-center gap-2 underline decoration-primary/20 underline-offset-8">
                        <User className="w-4 h-4" />
                        Customer Node
                      </h4>
                      <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated Email</p>
                          <p className="font-bold text-gray-900">{selectedOrder.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Recipient</p>
                          <p className="font-bold text-gray-900">{selectedOrder.shippingAddress?.fullName}</p>
                        </div>
                         <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Phone</p>
                          <p className="font-bold text-gray-900">{selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-6">
                       <h4 className="text-sm font-black uppercase tracking-[3px] text-primary flex items-center gap-2 underline decoration-primary/20 underline-offset-8">
                        <Truck className="w-4 h-4" />
                        Logistics Vector
                      </h4>
                      <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Designated Address</p>
                          <p className="font-bold text-gray-900 leading-relaxed">
                            {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.zipCode}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Method</p>
                              <p className="font-bold text-gray-900 uppercase text-xs italic">{selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Registry Date</p>
                              <p className="font-bold text-gray-900 text-xs">
                                {selectedOrder.createdAt?.toDate ? selectedOrder.createdAt.toDate().toLocaleString() : new Date(selectedOrder.createdAt).toLocaleString()}
                              </p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-[3px] text-primary flex items-center gap-2 underline decoration-primary/20 underline-offset-8">
                      <ShoppingBag className="w-4 h-4" />
                      Payload Manifest
                    </h4>
                    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Identifier</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Unit Val</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Quantity</th>
                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Summation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedOrder.items?.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="font-bold text-gray-900 text-sm tracking-tighter">{item.name}</span>
                                </div>
                              </td>
                              <td className="p-4 font-bold text-gray-500 text-sm">৳{item.price?.toLocaleString()}</td>
                              <td className="p-4 font-black text-gray-900 text-sm italic">x{item.quantity}</td>
                              <td className="p-4 font-black text-gray-900 text-sm text-right">৳{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-blue-50/50 border-t border-blue-100">
                          <tr>
                            <td colSpan="3" className="p-4 text-right">
                              <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-400">Aggregate Valuation</span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="text-xl font-black text-blue-600 italic leading-none">৳{selectedOrder.total?.toLocaleString()}</span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-8 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status Update:</span>
                    <div className="flex gap-2">
                       {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                         <button 
                            key={status}
                            onClick={() => handleStatusChange(selectedOrder.id, status)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                              selectedOrder.status === status 
                                ? statusColors[status].bg + ' ' + statusColors[status].text + ' ring-2 ring-offset-2 ring-blue-500' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                         >
                           {status}
                         </button>
                       ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[3px] text-xs shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                  >
                    Sync & Close
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ManageOrders;

const X = ({ className, ...props }) => <motion.svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></motion.svg>;
