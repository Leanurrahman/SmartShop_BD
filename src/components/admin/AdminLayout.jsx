import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Ticket, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: Users, label: 'Customers' },
  { path: '/admin/coupons', icon: Ticket, label: 'Coupons' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of administrative access.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    });

    if (result.isConfirmed) {
      await logout();
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-gray-200 sticky top-0 h-screen hidden md:flex flex-col z-50 overflow-hidden transition-all duration-300 shadow-sm"
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-bottom border-gray-100 overflow-hidden whitespace-nowrap">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <ShoppingBag className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 font-black text-xl tracking-tighter"
            >
              SMART<span className="text-primary">SHOP</span> <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1 font-bold">ADMIN</span>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center p-3 rounded-xl transition-all group overflow-hidden whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg orange-shadow' 
                    : 'text-gray-500 hover:bg-orange-50 hover:text-primary'
                }`}
              >
                <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 font-bold"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isSidebarOpen && isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="ml-auto"
                  >
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all overflow-hidden whitespace-nowrap"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-bold">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 md:block hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="md:hidden block">
               <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
            </div>
            <h1 className="font-bold text-gray-800 text-lg md:block hidden truncate">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative md:block hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search resources..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary w-64 transition-all"
              />
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="text-right items-end flex flex-col md:flex hidden">
                <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">Admin Account</span>
                <span className="text-[10px] font-bold text-primary">{user?.email}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 border-2 border-primary/20 flex items-center justify-center text-primary font-black">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Navbar Bottom - for smaller screens visibility */}
       <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 z-50">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={`p-2 rounded-xl ${isActive ? 'text-primary bg-orange-50' : 'text-gray-400'}`}>
                <Icon className="w-6 h-6" />
              </Link>
            )
          })}
       </div>
    </div>
  );
};

export default AdminLayout;
