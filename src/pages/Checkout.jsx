import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  ChevronRight, 
  CheckCircle,
  ShieldCheck,
  Smartphone,
  Wallet,
  Loader2,
  Globe,
  Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CouponBox from '../components/CouponBox';
import PageTransition from '../components/PageTransition';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatPrice } from '../utils/helpers';
import { createOrder } from '../services/orderService';
import { simulateBkashPayment, simulateStripePayment, simulatePaypalPayment } from '../services/paymentService';
import Swal from 'sweetalert2';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('appliedSpinCoupon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.code) {
          setCoupon(parsed);
          const val = parsed.discountValue !== undefined ? parsed.discountValue : (parsed.discount !== undefined ? parsed.discount : 0);
          // Auto-confirm
          Swal.fire({
            icon: 'success',
            title: 'Lottery Reward Applied!',
            text: `Your ${val}${parsed.discountType === 'percentage' ? '%' : ' TK'} discount of occasion (${parsed.occasion || 'Seasonal'}) has been auto-applied to checkout!`,
            timer: 4000
          });
        }
      } catch (e) {
        console.error("Error loading spin coupon:", e);
      }
    }
  }, []);
  const [address, setAddress] = useState({
    name: user?.displayName || "",
    phone: user?.phoneNumber || "",
    email: user?.email || "",
    country: "Bangladesh",
    district: "Dhaka",
    city: "Dhaka",
    area: "",
    address: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const couponDiscountValue = coupon 
    ? (coupon.discountValue !== undefined ? Number(coupon.discountValue) : (coupon.discount !== undefined ? Number(coupon.discount) : 0)) 
    : 0;

  const discountRaw = coupon 
    ? (coupon.discountType === 'percentage' ? (subtotal * couponDiscountValue / 100) : couponDiscountValue)
    : 0;
  
  const discount = isNaN(discountRaw) ? 0 : discountRaw;
  const total = Math.max(0, subtotal - discount);

  const handlePlaceOrder = async () => {
    if (!address.phone || !address.address || !address.email || !address.country || !address.district) {
      Swal.fire({ icon: 'error', title: 'Details missing', text: 'Please fill in country, district, email address and shipping details.' });
      return;
    }

    setLoading(true);
    try {
      let paymentRes = { success: true, transactionId: "COD_" + Date.now(), paymentStatus: "Unpaid" };

      if (paymentMethod === "bKash") {
        paymentRes = await simulateBkashPayment();
      } else if (paymentMethod === "Stripe") {
        paymentRes = await simulateStripePayment();
      } else if (paymentMethod === "PayPal") {
        paymentRes = await simulatePaypalPayment();
      }

      if (paymentRes.success) {
        const orderId = await createOrder({
          userId: user.uid,
          customerName: address.name,
          customerEmail: user.email,
          phone: address.phone,
          shippingAddress: address,
          items: cart,
          subtotal,
          discount,
          total,
          couponCode: coupon?.code || "",
          paymentMethod,
          paymentStatus: paymentRes.paymentStatus,
          transactionId: paymentRes.transactionId,
          orderStatus: "Pending"
        });

        clearCart();
        localStorage.removeItem('appliedSpinCoupon');
        navigate("/order-success", { state: { orderId, total } });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Order Failed', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Stepper */}
          <div className="flex justify-center mb-16">
            <div className={`flex items-center gap-6 glass-panel px-10 py-5 shadow-2xl ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-white'}`}>
               {[1, 2, 3].map((i) => (
                 <React.Fragment key={i}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all transform ${
                      step >= i 
                        ? 'bg-primary text-white scale-110 shadow-[0_0_30px_rgba(255,153,0,0.5)]' 
                        : isDarkMode 
                          ? 'glass-panel border-white/10 text-white/20' 
                          : 'glass-panel border-orange-100 bg-orange-50 text-gray-300'
                    }`}>
                      {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                    </div>
                    {i < 3 && <div className={`w-16 h-1 ${step > i ? 'bg-primary' : isDarkMode ? 'bg-white/5' : 'bg-gray-200'} rounded-full transition-colors duration-500`} />}
                 </React.Fragment>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Content */}
            <div className="lg:col-span-2">
               <AnimatePresence mode="wait">
                 {step === 1 && (
                    <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    className="space-y-10"
                   >
                     <div className={`glass-panel p-10 shadow-2xl ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'}`}>
                        <div className="flex items-center gap-5 mb-10">
                           <div className="w-14 h-14 glass-panel border-primary/20 bg-primary/5 text-primary rounded-2xl flex items-center justify-center"><MapPin className="w-6 h-6" /></div>
                           <div>
                             <h2 className="text-3xl font-black italic tracking-tight">Shipping Protocol</h2>
                             <p className={`text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Target Destination</p>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-3">
                             <label className={`text-[10px] font-black uppercase tracking-[3px] ml-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Full Name</label>
                             <div className="relative group">
                               <input 
                                type="text"
                                className={`w-full pl-14 pr-6 py-5 glass-panel transition-all font-bold ${isDarkMode ? 'border-white/5 bg-white/5 text-white focus:border-primary/50' : 'border-orange-100 bg-gray-50 text-gray-900 focus:border-primary focus:bg-white'}`}
                                value={address.name}
                                onChange={(e) => setAddress({...address, name: e.target.value})}
                               />
                               <User className={`absolute left-5 top-5 w-5 h-5 group-focus-within:text-primary transition-colors ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} />
                             </div>
                           </div>
                           <div className="space-y-3">
                             <label className={`text-[10px] font-black uppercase tracking-[3px] ml-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Contact Signal</label>
                             <div className="relative group">
                               <input 
                                type="text"
                                placeholder="+880 1XXX XXXXXX"
                                className={`w-full pl-14 pr-6 py-5 glass-panel transition-all font-bold ${isDarkMode ? 'border-white/5 bg-white/5 text-white placeholder:text-white/20 focus:border-primary/50' : 'border-orange-100 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white'}`}
                                value={address.phone}
                                onChange={(e) => setAddress({...address, phone: e.target.value})}
                               />
                               <Phone className={`absolute left-5 top-5 w-5 h-5 group-focus-within:text-primary transition-colors ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} />
                             </div>
                           </div>

                           {/* Country Dropdown selection */}
                           <div className="space-y-3">
                             <label className={`text-[10px] font-black uppercase tracking-[3px] ml-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Country</label>
                             <div className="relative group">
                               <select 
                                className={`w-full pl-14 pr-10 py-5 glass-panel transition-all font-bold bg-transparent cursor-pointer ${isDarkMode ? 'border-white/5 bg-[#0a0f1d] text-white focus:border-primary/50' : 'border-orange-100 bg-gray-50 text-gray-900 focus:border-primary focus:bg-white'}`}
                                value={address.country}
                                onChange={(e) => setAddress({...address, country: e.target.value})}
                               >
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Bangladesh">Bangladesh</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="India">India</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="USA">USA</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Canada">Canada</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="UK">UK</option>
                               </select>
                               <Globe className={`absolute left-5 top-5 w-5 h-5 group-focus-within:text-primary transition-colors ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} />
                             </div>
                           </div>

                           {/* District Dropdown selection */}
                           <div className="space-y-3">
                             <label className={`text-[10px] font-black uppercase tracking-[3px] ml-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>District</label>
                             <div className="relative group">
                               <select 
                                className={`w-full pl-14 pr-10 py-5 glass-panel transition-all font-bold bg-transparent cursor-pointer ${isDarkMode ? 'border-white/5 bg-[#0a0f1d] text-white focus:border-primary/50' : 'border-orange-100 bg-gray-50 text-gray-900 focus:border-primary focus:bg-white'}`}
                                value={address.district}
                                onChange={(e) => setAddress({...address, district: e.target.value})}
                               >
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Dhaka">Dhaka</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Chittagong">Chittagong</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Sylhet">Sylhet</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Rajshahi">Rajshahi</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Khulna">Khulna</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Barisal">Barisal</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Rangpur">Rangpur</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Mymensingh">Mymensingh</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Comilla">Comilla</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Narayanganj">Narayanganj</option>
                                 <option className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200" value="Gazipur">Gazipur</option>
                               </select>
                               <MapPin className={`absolute left-5 top-5 w-5 h-5 group-focus-within:text-primary transition-colors ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} />
                             </div>
                           </div>

                           {/* Gmail / Email Address field */}
                           <div className="sm:col-span-2 space-y-3">
                             <label className={`text-[10px] font-black uppercase tracking-[3px] ml-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Gmail / Email Address</label>
                             <div className="relative group">
                               <input 
                                type="email"
                                placeholder="username@gmail.com"
                                className={`w-full pl-14 pr-6 py-5 glass-panel transition-all font-bold ${isDarkMode ? 'border-white/5 bg-white/5 text-white placeholder:text-white/20 focus:border-primary/50' : 'border-orange-100 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white'}`}
                                value={address.email}
                                onChange={(e) => setAddress({...address, email: e.target.value})}
                               />
                               <Mail className={`absolute left-5 top-5 w-5 h-5 group-focus-within:text-primary transition-colors ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} />
                             </div>
                           </div>

                           <div className="sm:col-span-2 space-y-3">
                             <label className={`text-[10px] font-black uppercase tracking-[3px] ml-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Logistics Matrix (Address)</label>
                             <textarea 
                               rows="4"
                               placeholder="Grid coordinates, sectors, landmarks..."
                               className={`w-full p-6 glass-panel transition-all font-bold resize-none ${isDarkMode ? 'border-white/5 bg-white/5 text-white placeholder:text-white/20 focus:border-primary/50' : 'border-orange-100 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white'}`}
                               value={address.address}
                               onChange={(e) => setAddress({...address, address: e.target.value})}
                             />
                           </div>
                        </div>

                        <button 
                          onClick={() => setStep(2)}
                          className="mt-12 w-full md:w-auto bg-primary text-white px-16 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] hover:bg-primary-dark transition-all orange-shadow flex items-center justify-center gap-4 transform hover:scale-[1.03]"
                        >
                          Proceed to Verification <ChevronRight className="w-5 h-5" />
                        </button>
                     </div>
                   </motion.div>
                 )}

                 {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="space-y-10"
                    >
                      <div className={`glass-panel p-10 shadow-2xl ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'}`}>
                        <div className="flex items-center gap-5 mb-10">
                           <div className="w-14 h-14 glass-panel border-primary/20 bg-primary/5 text-primary rounded-2xl flex items-center justify-center"><Wallet className="w-6 h-6" /></div>
                           <div>
                             <h2 className="text-3xl font-black italic tracking-tight">Payment Matrix</h2>
                             <p className={`text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Select Settlement Protocol</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {/* COD */}
                           <div 
                             onClick={() => setPaymentMethod("COD")}
                             className={`p-8 rounded-[2.5rem] glass-panel border-2 transition-all cursor-pointer flex flex-col gap-6 relative group ${
                               paymentMethod === "COD" 
                                 ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(255,153,0,0.1)]' 
                                 : isDarkMode 
                                   ? 'border-white/5 bg-white/5 hover:border-white/20' 
                                   : 'border-orange-100 bg-gray-50 hover:border-orange-200'
                             }`}
                           >
                             <div className="flex justify-between items-center">
                               <Truck className={`w-10 h-10 ${paymentMethod === 'COD' ? 'text-primary' : isDarkMode ? 'text-white/20' : 'text-gray-300'} group-hover:text-primary transition-colors`} />
                               <div className={`w-6 h-6 glass-panel flex items-center justify-center transition-all ${
                                 paymentMethod === 'COD' 
                                   ? 'bg-primary border-primary' 
                                   : isDarkMode 
                                     ? 'border-white/10' 
                                     : 'border-gray-200 bg-gray-200'
                               }`}>
                                 {paymentMethod === "COD" && <CheckCircle className="text-white w-4 h-4" />}
                               </div>
                             </div>
                             <div>
                               <h4 className="font-black italic tracking-tight text-xl">Cash on Delivery</h4>
                               <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Physical Signal Exchange</p>
                             </div>
                           </div>

                           {/* bKash */}
                           <div 
                             onClick={() => setPaymentMethod("bKash")}
                             className={`p-8 rounded-[2.5rem] glass-panel border-2 transition-all cursor-pointer flex flex-col gap-6 relative group ${
                               paymentMethod === "bKash" 
                                 ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(255,153,0,0.1)]' 
                                 : isDarkMode 
                                   ? 'border-white/5 bg-white/5 hover:border-white/20' 
                                   : 'border-orange-100 bg-gray-50 hover:border-orange-200'
                             }`}
                           >
                             <div className="flex justify-between items-center">
                               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bkash_logo.png/1200px-Bkash_logo.png" className={`h-10 transition-all ${paymentMethod === 'bKash' ? '' : 'opacity-30 grayscale'}`} />
                               <div className={`w-6 h-6 glass-panel flex items-center justify-center transition-all ${
                                 paymentMethod === 'bKash' 
                                   ? 'bg-primary border-primary' 
                                   : isDarkMode 
                                     ? 'border-white/10' 
                                     : 'border-gray-200 bg-gray-200'
                               }`}>
                                 {paymentMethod === "bKash" && <CheckCircle className="text-white w-4 h-4" />}
                               </div>
                             </div>
                             <div>
                               <h4 className="font-black italic tracking-tight text-xl">bKash Portal</h4>
                               <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Encrypted Mobile Gateway</p>
                             </div>
                           </div>

                           {/* Stripe */}
                           <div 
                             onClick={() => setPaymentMethod("Stripe")}
                             className={`p-8 rounded-[2.5rem] glass-panel border-2 transition-all cursor-pointer flex flex-col gap-6 relative group ${
                               paymentMethod === "Stripe" 
                                 ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(255,153,0,0.1)]' 
                                 : isDarkMode 
                                   ? 'border-white/5 bg-white/5 hover:border-white/20' 
                                   : 'border-orange-100 bg-gray-50 hover:border-orange-200'
                             }`}
                           >
                             <div className="flex justify-between items-center">
                               <CreditCard className={`w-10 h-10 ${paymentMethod === 'Stripe' ? 'text-blue-500' : isDarkMode ? 'text-white/20' : 'text-gray-300'} group-hover:text-blue-400 transition-colors`} />
                               <div className={`w-6 h-6 glass-panel flex items-center justify-center transition-all ${
                                 paymentMethod === 'Stripe' 
                                   ? 'bg-primary border-primary' 
                                   : isDarkMode 
                                     ? 'border-white/10' 
                                     : 'border-gray-200 bg-gray-200'
                               }`}>
                                 {paymentMethod === "Stripe" && <CheckCircle className="text-white w-4 h-4" />}
                               </div>
                             </div>
                             <div>
                               <h4 className="font-black italic tracking-tight text-xl">Global Grid Card</h4>
                               <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Stripe Integrated Auth</p>
                             </div>
                           </div>

                           {/* PayPal */}
                           <div 
                             onClick={() => setPaymentMethod("PayPal")}
                             className={`p-8 rounded-[2.5rem] glass-panel border-2 transition-all cursor-pointer flex flex-col gap-6 relative group ${
                               paymentMethod === "PayPal" 
                                 ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(255,153,0,0.1)]' 
                                 : isDarkMode 
                                   ? 'border-white/5 bg-white/5 hover:border-white/20' 
                                   : 'border-orange-100 bg-gray-50 hover:border-orange-200'
                             }`}
                           >
                             <div className="flex justify-between items-center">
                               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className={`h-8 transition-all ${paymentMethod === 'PayPal' ? '' : 'opacity-30 grayscale'}`} />
                               <div className={`w-6 h-6 glass-panel flex items-center justify-center transition-all ${
                                 paymentMethod === 'PayPal' 
                                   ? 'bg-primary border-primary' 
                                   : isDarkMode 
                                     ? 'border-white/10' 
                                     : 'border-gray-200 bg-gray-200'
                               }`}>
                                 {paymentMethod === "PayPal" && <CheckCircle className="text-white w-4 h-4" />}
                               </div>
                             </div>
                             <div>
                               <h4 className="font-black italic tracking-tight text-xl">Digital Vault</h4>
                               <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>PayPal Verified Ledger</p>
                             </div>
                           </div>
                        </div>

                        <div className="mt-12 flex flex-col sm:flex-row gap-6">
                           <button 
                             onClick={() => setStep(1)}
                             className={`glass-panel px-10 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] flex items-center justify-center gap-3 transition-all ${
                               isDarkMode 
                                 ? 'border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white' 
                                 : 'border-orange-100 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                             }`}
                           >
                             Recalibrate
                           </button>
                           <button 
                             onClick={() => setStep(3)}
                             className="flex-1 bg-primary text-white px-16 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] hover:bg-primary-dark transition-all orange-shadow flex items-center justify-center gap-4 transform hover:scale-[1.03]"
                           >
                             Review Configuration <ChevronRight className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                 )}

                 {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="space-y-10"
                    >
                      <div className={`glass-panel p-10 shadow-2xl ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'}`}>
                        <div className="flex items-center gap-5 mb-10">
                           <div className="w-14 h-14 glass-panel border-primary/20 bg-primary/5 text-primary rounded-2xl flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                           <div>
                             <h2 className="text-3xl font-black italic tracking-tight">Final Authorization</h2>
                             <p className={`text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Verify Matrix Consistency</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                           <div className={`glass-panel p-8 rounded-[2.5rem] ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-gray-50'}`}>
                              <h4 className={`text-[9px] font-black uppercase mb-6 tracking-[3px] ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Target Matrix</h4>
                              <p className="font-black italic text-xl mb-1">{address.name}</p>
                              {address.email && <p className="text-xs font-bold text-gray-500/80 mb-1 leading-none">{address.email}</p>}
                              <p className="text-xs font-bold text-primary mb-2 leading-none">{address.phone}</p>
                              <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider mb-5 leading-none">{address.district}, {address.country}</p>
                              <div className={`h-px w-full mb-5 ${isDarkMode ? 'bg-white/5' : 'bg-orange-100'}`} />
                              <p className={`text-sm italic leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{address.address}</p>
                           </div>
                           <div className={`glass-panel p-8 rounded-[2.5rem] ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-gray-50'}`}>
                              <h4 className={`text-[9px] font-black uppercase mb-6 tracking-[3px] ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Settlement Path</h4>
                              <div className="flex items-center gap-3 mb-6">
                                <h4 className="font-black italic text-2xl text-primary">{paymentMethod}</h4>
                              </div>
                              <div className={`inline-flex items-center gap-3 text-[10px] glass-panel px-5 py-2 rounded-full font-black uppercase tracking-widest ${
                                isDarkMode 
                                  ? 'border-green-500/20 text-green-400 bg-green-400/5' 
                                  : 'border-green-150 text-green-600 bg-green-50'
                              }`}>
                                 <ShieldCheck className="w-4 h-4" /> Secure Protocol
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6 mb-12">
                           <h4 className={`text-[9px] font-black uppercase mb-4 tracking-[3px] ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Payload Summary</h4>
                           {cart.map((item) => (
                             <div key={item.id} className={`flex items-center justify-between py-4 border-b group ${isDarkMode ? 'border-white/5' : 'border-orange-50'}`}>
                               <div className="flex items-center gap-6">
                                  <div className={`w-16 h-16 glass-panel p-1 rounded-2xl overflow-hidden ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-orange-50/50'}`}>
                                     <img src={item.images?.[0]} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                  </div>
                                  <div>
                                    <p className={`font-black italic tracking-tight ${isDarkMode ? 'text-white/80' : 'text-gray-800'}`}>{item.name}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>{item.quantity} Unit{item.quantity !== 1 ? 's' : ''} x ৳ {formatPrice(item.discountPrice || item.price).replace('TK', '')}</p>
                                  </div>
                               </div>
                               <span className="font-black text-primary text-xl italic">৳ {formatPrice((item.discountPrice || item.price) * item.quantity).replace('TK', '')}</span>
                             </div>
                           ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                           <button 
                             onClick={() => setStep(2)}
                             className={`glass-panel px-10 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] flex items-center justify-center gap-3 transition-all ${
                               isDarkMode 
                                 ? 'border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white' 
                                 : 'border-orange-100 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                             }`}
                           >
                             Revisit Methods
                           </button>
                           <button 
                             onClick={handlePlaceOrder}
                             disabled={loading}
                             className="flex-1 bg-primary text-white px-16 py-6 rounded-[2rem] font-black uppercase tracking-[4px] text-[12px] hover:bg-primary-dark transition-all orange-shadow flex items-center justify-center gap-4 transform hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                           >
                             {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Deploy Final Authorization"}
                           </button>
                        </div>
                      </div>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-1">
               <div className={`glass-panel p-10 shadow-[0_30px_100px_-20px_rgba(255,153,0,0.15)] sticky top-40 space-y-12 rounded-[3.5rem] ${
                 isDarkMode 
                   ? 'border-primary/20 bg-primary/5 text-white' 
                   : 'border-orange-150 bg-[#FFFBF7] text-gray-900'
               }`}>
                  <CouponBox orderAmount={subtotal} onApply={(c) => setCoupon(c)} initialCoupon={coupon} />
                  
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[4px] text-primary">Settlement Matrix</h3>
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <span className={`text-[9px] font-black uppercase tracking-[2px] ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Gross Matrix Value</span>
                          <span className={`font-bold ${isDarkMode ? 'text-white/80' : 'text-gray-800'}`}>{formatPrice(subtotal)}</span>
                       </div>
                       {discount > 0 && (
                          <div className="flex justify-between items-end">
                             <span className={`text-[9px] font-black uppercase tracking-[2px] ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Discount Logic Applied</span>
                             <span className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>-{formatPrice(discount)}</span>
                          </div>
                       )}
                       <div className="flex justify-between items-end">
                          <span className={`text-[9px] font-black uppercase tracking-[2px] ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>Transfer Logistics</span>
                          <span className={`text-[10px] font-black uppercase px-3 py-1 glass-panel tracking-widest leading-none ${
                            isDarkMode 
                              ? 'border-green-500/20 text-green-400 bg-green-400/5' 
                              : 'border-green-150 text-green-600 bg-green-50'
                          }`}>Complimentary</span>
                       </div>
                       <div className={`pt-8 border-t flex justify-between items-end ${isDarkMode ? 'border-white/10' : 'border-orange-100'}`}>
                          <span className="text-xs font-black uppercase tracking-[3px] text-primary">Final Settlement</span>
                          <span className="text-4xl font-black text-primary italic">৳ {formatPrice(total).replace('TK', '')}</span>
                       </div>
                    </div>
                  </div>

                  <div className={`glass-panel p-6 rounded-[2.5rem] text-[9px] text-center leading-relaxed font-black uppercase tracking-[3px] ${
                    isDarkMode 
                      ? 'border-white/5 bg-white/5 text-white/20' 
                      : 'border-orange-100 bg-orange-50/50 text-gray-500'
                  }`}>
                     By initiating authorization, you confirm data integrity & <span className="text-primary hover:underline cursor-pointer">Protocol Agreements</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Checkout;
