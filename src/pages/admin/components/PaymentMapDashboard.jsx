import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Filter, Search, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getAllOrders } from '../../../services/adminService';
import Swal from 'sweetalert2';

const districts = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh",
  "Gazipur", "Narayanganj", "Comilla"
];

const PaymentMapDashboard = ({ darkMode, t }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedDistrict, searchQuery, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch orders for map.',
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...orders];
    if (selectedDistrict !== 'All') {
      filtered = filtered.filter(o => o.district === selectedDistrict || o.address?.district === selectedDistrict);
    }
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'text-green-500 bg-green-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'failed': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getMarkerColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className={`p-4 rounded-2xl shadow-sm border transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-orange-50'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500' : 'bg-orange-50 border-orange-100 focus:border-orange-500'
                }`}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className={`pl-10 pr-8 py-2 rounded-xl text-sm outline-none appearance-none transition-all ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500' : 'bg-orange-50 border-orange-100 focus:border-orange-500'
                }`}
              >
                <option value="All">{t.allDistricts}</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /> {t.paid}</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {t.pending}</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> {t.failed}</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className={`relative h-[400px] rounded-3xl overflow-hidden border transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-orange-50'}`}>
        {/* Mock Map Background - Stylized Bangladesh Map Shape or Abstract Grid */}
        <div className={`absolute inset-0 opacity-10 flex items-center justify-center transition-colors ${darkMode ? 'bg-gray-900 shadow-inner' : 'bg-orange-50 shadow-inner'}`}>
           <svg viewBox="0 0 500 500" className="w-full h-full p-20 fill-current text-orange-500">
             <path d="M250,50 L350,150 L400,300 L300,450 L150,450 L100,300 L150,150 Z" />
           </svg>
        </div>

        {/* Real Mock Markers */}
        <div className="absolute inset-0 p-8 pt-12">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              {filteredOrders.slice(0, 50).map((order, idx) => {
                // Generate deterministic but "random" looking layout coordinates for the mock map
                const hash = order.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const left = (hash % 80) + 10;
                const top = ((hash * 7) % 70) + 15;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05, type: 'spring' }}
                    className="absolute cursor-pointer group"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <div className="relative">
                      <MapPin 
                        size={24} 
                        fill={getMarkerColor(order.paymentStatus || 'pending')} 
                        className="text-white drop-shadow-lg transform transition-transform group-hover:scale-125" 
                      />
                      {/* Tooltip on Hover */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 group-hover:scale-100 transition-transform origin-bottom z-50 p-3 rounded-xl shadow-2xl min-w-[150px] pointer-events-none ${
                        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 border border-orange-100'
                      }`}>
                        <p className="text-[10px] font-bold opacity-60">ID: {order.id.slice(0, 8)}</p>
                        <p className="text-xs font-bold truncate">{order.customerName || 'Anonymous'}</p>
                        <p className={`text-[10px] font-black mt-1 px-1.5 py-0.5 rounded inline-block ${getStatusColor(order.paymentStatus || 'pending')}`}>
                          {order.paymentStatus || 'Pending'}
                        </p>
                        <p className="text-xs font-black text-orange-500 mt-1">৳ {order.total}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend Overlay */}
        <div className={`absolute bottom-4 left-4 p-3 rounded-2xl border backdrop-blur-md text-[10px] uppercase tracking-widest font-bold ${
          darkMode ? 'bg-gray-900/80 border-gray-700 text-gray-400' : 'bg-white/80 border-orange-100 text-gray-500'
        }`}>
          {t.paymentMap} • Live Node Data
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`rounded-3xl overflow-hidden border transition-colors ${darkMode ? 'bg-[#111827] border-gray-700 text-white' : 'bg-white border-orange-50 text-gray-900'}`}>
        <div className="p-6 border-b border-inherit bg-inherit flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <CreditCard size={18} className="text-orange-500" />
            {t.lastTransactions}
          </h3>
          <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full">{filteredOrders.length} {t.orders}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-[10px] uppercase tracking-widest font-black transition-colors ${darkMode ? 'bg-gray-900/50 text-gray-500' : 'bg-orange-50/50 text-gray-400 text-center'}`}>
              <tr>
                <th className="px-6 py-4">{t.orders} ID</th>
                <th className="px-6 py-4">{t.users}</th>
                <th className="px-6 py-4">{t.district}</th>
                <th className="px-6 py-4 text-center">{t.paymentStatus}</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              <AnimatePresence>
                {filteredOrders.slice(0, 10).map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-50'}`}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-xs">#{order.id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{order.customerName || 'Guest'}</div>
                      <div className="text-[10px] text-gray-400 truncate w-32">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${darkMode ? 'bg-gray-800' : 'bg-orange-50'}`}>
                        {order.district || order.address?.district || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(order.paymentStatus || 'pending')}`}>
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-orange-500">৳ {order.total}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentMapDashboard;
