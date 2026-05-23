import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  FileText, 
  Menu,
  X,
  LogOut,
  Bell,
  Tag,
  Gift,
  FolderOpen
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { 
  getProducts, 
  getAllOrders, 
  getAllUsers, 
  getCoupons
} from '../../services/adminService';
import { translations } from './translations';
import { Sun, Moon, Languages, Map as MapIcon } from 'lucide-react';

// Sub-sections
import OverviewSection from './components/OverviewSection';
import ProductsSection from './components/ProductsSection';
import OrdersSection from './components/OrdersSection';
import UsersSection from './components/UsersSection';
import CouponsSection from './components/CouponsSection';
import ManageCategories from './components/ManageCategories';
import ManageSupport from './components/ManageSupport';
import SettingsSection from './components/SettingsSection';
import ReportsSection from './components/ReportsSection';
import PaymentMapDashboard from './components/PaymentMapDashboard';
import ManageLotteryOffers from './components/ManageLotteryOffers';

import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Theme & Language
  const { isDarkMode: darkMode, toggleTheme } = useTheme();
  const [lang, setLang] = useState(() => localStorage.getItem('adminLang') || 'en');

  useEffect(() => {
    localStorage.setItem('adminLang', lang);
  }, [lang]);

  const t = translations[lang];
  
  // Data States
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    newUsers: 0,
    pendingOrders: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [allProducts, allOrders, allUsers, allCoupons] = await Promise.all([
        getProducts(),
        getAllOrders(),
        getAllUsers(),
        getCoupons()
      ]);

      setProducts(allProducts);
      setOrders(allOrders);
      setUsers(allUsers);
      setCoupons(allCoupons);

      // Calculate Stats
      const totalSales = allOrders
        .filter(o => o.paymentStatus === 'Paid' || o.status === 'Delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0);
      
      const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
      
      setStats({
        totalSales,
        totalOrders: allOrders.length,
        newUsers: allUsers.length,
        pendingOrders
      });

      // Sample Chart Data
      setSalesData([
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
      ]);

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'overview', label: t.overview, icon: LayoutDashboard },
    { id: 'products', label: t.products, icon: Package },
    { id: 'orders', label: t.orders, icon: ShoppingCart },
    { id: 'users', label: t.users, icon: Users },
    { id: 'coupons', label: t.coupons, icon: Tag },
    { id: 'categories', label: lang === 'bn' ? 'ক্যাটাগরি সমূহ' : lang === 'hi' ? 'श्रेणियां' : lang === 'ur' ? 'اقسام' : 'Categories', icon: FolderOpen },
    { id: 'lottery-offers', label: lang === 'bn' ? 'লটারী অফার' : lang === 'hi' ? 'लॉटरी ऑफ़र' : lang === 'ur' ? 'لاٹری آفرز' : 'Lottery Offers', icon: Gift },
    { id: 'payment-map', label: t.paymentMap, icon: MapIcon },
    { id: 'support-management', label: lang === 'bn' ? 'সাপোর্ট ডেস্ক' : lang === 'hi' ? 'सहायता डेस्क' : lang === 'ur' ? 'سپورٹ ڈیسک' : 'Support Desk', icon: FileText },
    { id: 'settings', label: t.settings, icon: Settings },
    { id: 'reports', label: t.reports, icon: FileText },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: "Are you sure you want to exit?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      iconColor: '#F97316'
    });

    if (result.isConfirmed) {
      await logout();
      window.location.href = '/login';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${darkMode ? 'bg-[#1F2937]' : 'bg-[#FFF7ED]'}`}>
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-colors ${darkMode ? 'bg-[#1F2937]' : 'bg-[#FFF7ED]'}`}>
      {/* Sidebar - Desktop */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'} shadow-xl border-r transition-all duration-300 hidden md:flex flex-col fixed h-full z-50`}
      >
        <div className={`p-6 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          {isSidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              SmartShop <span className="text-[#F97316]">BD</span>
            </motion.h1>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-orange-400 hover:bg-gray-700' : 'bg-orange-50 text-[#F97316] hover:bg-orange-100'}`}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                  activeTab === item.id 
                    ? 'bg-[#F97316] text-white shadow-lg shadow-orange-900/20' 
                    : `${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-orange-400' : 'text-gray-500 hover:bg-orange-50 hover:text-[#F97316]'}`
                }`}
              >
                <Icon size={20} className={activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
                {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="font-semibold">{t.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className={`md:hidden fixed top-0 w-full z-50 p-4 border-b flex items-center justify-between ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
        <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>SmartShop <span className="text-[#F97316]">BD</span></h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-[#F97316]">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}
      <motion.div 
        className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 shadow-2xl transition-all transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-[#111827]' : 'bg-white'}`}
      >
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.dashboard}</h1>
        </div>
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold ${
                  activeTab === item.id ? 'bg-[#F97316] text-white' : `${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'}`
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-xl text-red-500 bg-red-500/10 font-bold mt-8">
            <LogOut size={20} /> {t.logout}
          </button>
        </div>
      </motion.div>

      {/* Content Area */}
      <main className={`flex-1 transition-all duration-300 md:pt-0 pt-16 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className={`sticky top-0 backdrop-blur-md border-b z-40 px-8 py-4 hidden md:flex items-center justify-between transition-colors ${darkMode ? 'bg-[#1F2937]/80 border-gray-700' : 'bg-white/80 border-gray-100'}`}>
          <h2 className={`text-xl font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-orange-400 hover:bg-gray-700' : 'bg-orange-50 text-[#F97316] hover:bg-orange-100'}`}
              title={darkMode ? t.lightMode : t.darkMode}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button className={`flex items-center gap-2 p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                <Languages size={20} />
                <span className="text-xs font-bold uppercase">{lang}</span>
              </button>
              <div className={`absolute right-0 top-full mt-2 w-32 rounded-xl border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                {Object.keys(translations).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors ${
                      lang === l 
                        ? 'bg-orange-500 text-white' 
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-orange-50'}`
                    }`}
                  >
                    {l === 'en' && 'English'}
                    {l === 'bn' && 'বাংলা'}
                    {l === 'hi' && 'हिन्दी'}
                    {l === 'ur' && 'اردو'}
                  </button>
                ))}
              </div>
            </div>

            <div className={`flex items-center gap-3 pl-4 border-l ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.displayName || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{t.superAdmin}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F97316] font-bold ring-2 ring-orange-50/20">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewSection darkMode={darkMode} t={t} stats={stats} salesData={salesData} orders={orders} />}
            {activeTab === 'products' && <ProductsSection darkMode={darkMode} t={t} products={products} onUpdate={fetchDashboardData} />}
            {activeTab === 'orders' && <OrdersSection darkMode={darkMode} t={t} orders={orders} onUpdate={fetchDashboardData} />}
            {activeTab === 'users' && <UsersSection darkMode={darkMode} t={t} users={users} onUpdate={fetchDashboardData} />}
            {activeTab === 'coupons' && <CouponsSection darkMode={darkMode} t={t} coupons={coupons} onUpdate={fetchDashboardData} />}
            {activeTab === 'categories' && <ManageCategories darkMode={darkMode} />}
            {activeTab === 'lottery-offers' && <ManageLotteryOffers darkMode={darkMode} />}
            {activeTab === 'payment-map' && <PaymentMapDashboard darkMode={darkMode} t={t} />}
            {activeTab === 'support-management' && <ManageSupport darkMode={darkMode} />}
            {activeTab === 'settings' && <SettingsSection darkMode={darkMode} t={t} user={user} onUpdate={fetchDashboardData} />}
            {activeTab === 'reports' && <ReportsSection darkMode={darkMode} t={t} orders={orders} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
