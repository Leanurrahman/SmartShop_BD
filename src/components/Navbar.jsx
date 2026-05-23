import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingCart, Heart, Bell, User, Menu, X, Sun, Moon, LogOut, Settings, Languages, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languagesList = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'bn', label: 'Bangla', native: 'বাংলা' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ur', label: 'Urdu', native: 'اردو' }
  ];

  useEffect(() => {
    if (!langMenuOpen) return;
    const handleClose = () => setLangMenuOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [langMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 glass-panel shadow-2xl px-8 py-3 ${
      scrolled ? 'translate-y-0' : 'translate-y-2'
    }`}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
            className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg orange-shadow"
          >
            <span className="text-white text-2xl font-black italic">S</span>
          </motion.div>
          <span className="hidden sm:inline tracking-tight">SmartShop <span className="text-primary">BD</span></span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-12 relative items-center">
          <input
            type="text"
            placeholder={t('nav_search_placeholder')}
            className={`w-full pl-12 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500' 
                : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 text-gray-400 w-5 h-5 pointer-events-none" />
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLangMenuOpen(!langMenuOpen);
                }}
                className={`p-2 rounded-xl transition-all flex items-center gap-1 text-sm font-bold ${
                  isDarkMode ? 'text-gray-400 hover:text-primary hover:bg-white/5' : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                }`}
              >
                <Languages className="w-4 h-4" />
                <span className="uppercase text-xs">{language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute right-0 top-full mt-2 w-40 rounded-2xl shadow-2xl p-2 border z-[60] backdrop-blur-2xl ${
                      isDarkMode ? 'bg-gray-900 border-white/10 shadow-none' : 'bg-white border-orange-100 shadow-xl'
                    }`}
                  >
                    {languagesList.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          language === lang.code 
                            ? 'bg-primary text-white orange-shadow' 
                            : isDarkMode 
                              ? 'text-gray-300 hover:bg-white/10' 
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className={`text-[9px] font-medium ${language === lang.code ? 'text-white/80' : 'text-gray-400'}`}>{lang.native}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleTheme} className={`p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'}`}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <Link to="/wishlist" className={`relative p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'}`}>
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className={`relative p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'}`}>
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </Link>

            <NotificationBell />
          </div>

          <div className={`h-8 w-[1px] hidden sm:block ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

          {user ? (
             <div className="relative group">
               <div className="flex items-center gap-3 cursor-pointer p-1">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-dark border-2 border-white/20 overflow-hidden shadow-lg">
                   {user.photoURL ? <img src={user.photoURL} alt="" /> : <User className="w-10 h-10 p-2 text-white" />}
                 </div>
                 <div className="hidden md:flex flex-col">
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.displayName || 'Ahmed Khan'}</span>
                    <span className={`text-[10px] ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>{isAdmin ? 'Admin' : 'Platinum Member'}</span>
                 </div>
               </div>
               
               <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                 <div className={`glass-panel p-2 w-56 shadow-2xl backdrop-blur-2xl ${isDarkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-orange-100'}`}>
                    <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.displayName || 'User'}</p>
                      <p className={`text-xs truncate ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className={`flex items-center gap-3 px-4 py-2 hover:bg-primary/10 text-primary rounded-xl transition-colors mt-2`}>
                        <Settings className="w-4 h-4" /> <span className="text-sm font-medium">{t('nav_admin')}</span>
                      </Link>
                    )}
                    <Link to="/profile" className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                      <User className="w-4 h-4" /> <span className="text-sm font-medium">{t('nav_profile')}</span>
                    </Link>
                    <Link to="/orders" className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                      <ShoppingCart className="w-4 h-4" /> <span className="text-sm font-medium">{t('nav_orders')}</span>
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors mt-2">
                      <LogOut className="w-4 h-4" /> <span className="text-sm font-medium">{t('nav_logout')}</span>
                    </button>
                 </div>
               </div>
             </div>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center gap-2 bg-primary text-white px-8 py-2.5 rounded-2xl font-bold orange-shadow hover:bg-primary-dark transition-all">
              {t('nav_login')}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-accent border-t dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={t('nav_search_placeholder')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
              </form>
              <nav className="flex flex-col gap-2">
                <Link to="/" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl font-medium">{t('nav_home')}</Link>
                <Link to="/products" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl font-medium">{t('nav_products')}</Link>
                {!user && <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 bg-primary text-white text-center rounded-xl font-semibold">{t('nav_login')}</Link>}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
