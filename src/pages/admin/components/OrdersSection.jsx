import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { updateOrderStatus } from '../../../services/adminService';

const OrdersSection = ({ orders, onUpdate, darkMode, t }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      Swal.fire({
        title: 'Updating...',
        didOpen: () => Swal.showLoading(),
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      await updateOrderStatus(id, newStatus);
      Swal.fire({ 
        icon: 'success', 
        title: 'Status Updated', 
        timer: 1000, 
        showConfirmButton: false,
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      onUpdate();
    } catch (error) {
      Swal.fire({
        title: 'Error', 
        text: error.message, 
        icon: 'error',
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    }
  };

  const showInvoice = (order) => {
    setSelectedOrder(order);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.orders} Management ({orders.length})</h3>
      
      <div className={`rounded-2xl border overflow-hidden shadow-sm overflow-x-auto transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
        <table className="w-full text-left">
          <thead className={`border-b transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-[#FFF7ED] border-gray-100 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Items</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${darkMode ? 'divide-gray-700 text-gray-300' : 'divide-gray-100'}`}>
            {orders.map((o) => (
              <tr key={o.id} className={`transition-colors text-sm ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                <td className="px-6 py-4 font-mono font-bold text-orange-500">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <p className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{o.userName}</p>
                  <p className="text-[10px] text-gray-400">{o.email}</p>
                </td>
                <td className="px-6 py-4">{o.items?.length || 0} items</td>
                <td className={`px-6 py-4 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>৳{o.total}</td>
                <td className="px-6 py-4">
                  <select 
                    value={o.status || 'Pending'} 
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full outline-none appearance-none cursor-pointer border-none ring-1 transition-all ${
                      o.status === 'Delivered' 
                        ? 'bg-green-100 text-green-600 ring-green-200' : 
                      o.status === 'Cancelled' 
                        ? 'bg-red-100 text-red-600 ring-red-200' : 
                        'bg-amber-100 text-amber-600 ring-amber-200'
                    } ${darkMode ? 'bg-opacity-20 ring-opacity-30' : ''}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-[10px] text-gray-400">
                  {o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => showInvoice(o)}
                    className={`p-2 rounded-lg transition-all ${darkMode ? 'text-gray-400 hover:text-orange-400 hover:bg-gray-800' : 'text-gray-400 hover:text-[#F97316] hover:bg-orange-50'}`}
                  >
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-20 text-gray-400 font-medium italic">No orders received yet...</p>}
      </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${darkMode ? 'bg-[#1F2937]' : 'bg-white'}`}
          >
            <div className={`p-6 border-b flex justify-between items-center no-print ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Order Invoice</h4>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}><Printer size={16} /> Print</button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><X size={20} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 printable">
              <div className="flex justify-between mb-10">
                <div>
                  <h1 className="text-2xl font-black text-[#F97316]">SmartShop BD</h1>
                  <p className="text-sm text-gray-400">Order ID: {selectedOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Date: {selectedOrder.createdAt?.seconds ? new Date(selectedOrder.createdAt.seconds * 1000).toDateString() : 'Today'}</p>
                  <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">{selectedOrder.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h5 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Billed To</h5>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.userName}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.address}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.phone}</p>
                </div>
                <div className="text-right">
                  <h5 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Payment</h5>
                  <p className={`font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.paymentMethod}</p>
                  <p className={`text-sm ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-500' : 'text-amber-500'} font-bold`}>{selectedOrder.paymentStatus}</p>
                </div>
              </div>

              <table className="w-full text-left mb-10">
                <thead className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <tr>
                    <th className="py-4 text-xs font-bold text-gray-400">Description</th>
                    <th className="py-4 text-xs font-bold text-gray-400 text-center">Qty</th>
                    <th className="py-4 text-xs font-bold text-gray-400 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                  {selectedOrder.items?.map((item, i) => (
                    <tr key={i}>
                      <td className={`py-4 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</td>
                      <td className={`py-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.quantity}</td>
                      <td className={`py-4 text-right font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>৳{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>৳{selectedOrder.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping:</span>
                    <span className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>৳0.00</span>
                  </div>
                  <div className={`pt-3 border-t flex justify-between items-center text-lg ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <span className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>Total:</span>
                    <span className="font-black text-[#F97316]">৳{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default OrdersSection;
