import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Chrome, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import PageTransition from '../components/PageTransition';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome to SmartShop BD',
        timer: 1500,
        showConfirmButton: false,
        iconColor: '#F97316'
      });
      
      // Admin check logic
      if (email.toLowerCase() === 'admin@leanssmartshopbd.com') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
        confirmButtonColor: '#F97316'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome to SmartShop BD',
        timer: 1500,
        showConfirmButton: false,
        iconColor: '#F97316'
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
        confirmButtonColor: '#F97316'
      });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED] dark:bg-[#0a0a0a] p-6 transition-colors">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-xl border border-orange-100 dark:border-gray-800"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SmartShop <span className="text-[#F97316]">BD</span></h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[#F97316] text-xs font-semibold hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#F97316] transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F97316] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-5 h-5" /> Login Now</>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 text-gray-700 dark:text-gray-200"
          >
            <Chrome className="w-5 h-5" /> Google Login
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-[#F97316] font-bold hover:underline ml-1">Register Now</Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
