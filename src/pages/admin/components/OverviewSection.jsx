import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingCart, 
  UserPlus, 
  Clock 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { StatCard } from './AdminUI';

const OverviewSection = ({ stats, salesData, orders, darkMode, t }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-8"
  >
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label={t.totalSales} value={`৳${stats.totalSales.toLocaleString()}`} icon={DollarSign} color="bg-orange-500" darkMode={darkMode} />
      <StatCard label={t.totalOrders} value={stats.totalOrders} icon={ShoppingCart} color="bg-blue-500" darkMode={darkMode} />
      <StatCard label={t.newUsers} value={stats.newUsers} icon={UserPlus} color="bg-green-500" darkMode={darkMode} />
      <StatCard label={t.pendingOrders} value={stats.pendingOrders} icon={Clock} color="bg-amber-500" darkMode={darkMode} />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={`lg:col-span-2 p-6 rounded-2xl shadow-sm border transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.overview}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  backgroundColor: darkMode ? '#1F2937' : '#fff',
                  color: darkMode ? '#fff' : '#000'
                }}
              />
              <Line type="monotone" dataKey="sales" stroke="#F97316" strokeWidth={4} dot={{ r: 4, fill: '#fff', stroke: '#F97316', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-6 rounded-2xl shadow-sm border transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.lastTransactions}</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-orange-50/50 hover:bg-orange-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${darkMode ? 'bg-gray-700 text-orange-400' : 'bg-white text-[#F97316]'}`}>
                  {order.userName?.[0] || 'U'}
                </div>
                <div>
                  <p className={`text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{order.userName}</p>
                  <p className="text-[10px] text-gray-400">
                    {order.createdAt?.seconds 
                      ? new Date(order.createdAt.seconds * 1000).toDateString() 
                      : 'Recently'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-orange-500">৳{order.total}</span>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>}
        </div>
      </div>
    </div>
  </motion.div>
);

export default OverviewSection;
