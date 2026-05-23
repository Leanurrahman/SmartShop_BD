import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <footer className={`relative mt-20 pt-20 pb-10 overflow-hidden transition-colors duration-500 border-t ${
      isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-orange-100'
    }`}>
      {/* Decorative gradient blur */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent ${isDarkMode ? 'via-primary/30' : 'via-primary/20'} to-transparent`}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className={`text-3xl font-black italic flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">S</span>
              </div>
              <span className="tracking-tighter">SmartShop <span className="text-primary">BD</span></span>
            </Link>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm leading-relaxed max-w-xs font-medium`}>
              Bangladesh's premium AI-powered e-commerce destination for quality products and seamless shopping experiences.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className={`w-10 h-10 flex items-center justify-center transition-all group rounded-xl border ${
                  isDarkMode ? 'bg-gray-900 border-gray-800 hover:bg-primary' : 'bg-gray-50 border-gray-100 hover:bg-primary'
                }`}>
                  <Icon className={`w-4 h-4 transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-white'}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="text-sm font-black uppercase tracking-[3px] text-primary mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['All Products', 'Categories', 'My Wishlist', 'My Account', 'Shopping Cart', 'Admin Dashboard'].map((item, i) => (
                <li key={i}>
                  <Link to={item === 'Admin Dashboard' ? '/admin/login' : `/${item.toLowerCase().replace(' ', '-')}`} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-primary'} transition-colors text-sm font-medium`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[3px] text-primary mb-8">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'FAQs', 'Track Order', 'Returns & Refunds', 'Shipping Policy'].map((item, i) => (
                <li key={i}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-primary'} transition-colors text-sm font-medium`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`glass-panel p-8 border-white/5 space-y-6 shadow-2xl ${isDarkMode ? 'bg-[#111827]/80' : 'bg-white/80'}`}>
            <h4 className="text-sm font-black uppercase tracking-[3px] text-primary">Get In Touch</h4>
            <ul className="space-y-5">
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed font-medium`}>House 42, Road 7, Sector 3, Uttara, Dhaka-1230</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>+880 1234 567 890</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>support@smartshopbd.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`pt-10 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center gap-8`}>
          <p className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} text-xs font-bold uppercase tracking-widest leading-none`}>
            © {new Date().getFullYear()} SmartShop BD. All rights reserved.
          </p>
          <div className="flex gap-8 items-center opacity-30 grayscale hover:opacity-100 transition-all duration-500">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bkash_logo.png/1200px-Bkash_logo.png" className="h-6" alt="bkash" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-5" alt="paypal" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" className="h-4" alt="stripe" />
          </div>
          <div className={`flex gap-6 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
