import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      // Check if it's an admin email (bootstrapped check)
      const isAdminEmail = email === 'leanroom1@gmail.com' || email.includes('admin');
      if (!isAdminEmail) {
        throw new Error("Unauthorized access. Admin credentials required.");
      }

      await login(email, password);
      
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back, Admin',
        text: 'Access granted to SmartShop DB systems.',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      navigate('/admin');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: error.message,
        confirmButtonColor: '#F97316'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto shadow-xl orange-shadow mb-6 rotate-3">
            <ShoppingBag className="text-white w-10 h-10 -rotate-3" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Admin <span className="text-primary italic">Terminal</span>
          </h1>
          <p className="text-gray-500 font-bold mt-2 tracking-widest text-[10px] uppercase">SmartShop BD Management System</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Registry Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@smartshop.bd"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary" />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Keep Session Active</span>
                </label>
                <button type="button" className="text-xs font-bold text-primary hover:underline italic">System Recovery</button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[4px] text-xs shadow-xl orange-shadow hover:bg-primary-dark transition-all transform active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    Initiate Boot
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 py-6 px-10 text-center border-t border-gray-100">
             <Link to="/" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-2">
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                Public Shop Interface
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
             </Link>
          </div>
        </motion.div>

        {/* Footer Info */}
        <p className="text-center text-gray-400 text-[10px] uppercase font-bold tracking-[3px] mt-10 opacity-50">
          SmartShop BD Cloud Engine v4.0.0
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
