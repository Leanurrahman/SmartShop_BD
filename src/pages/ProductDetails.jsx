import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Share2, 
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import ReviewCard from '../components/ReviewCard';
import ProductCarousel from '../components/ProductCarousel';
import PageTransition from '../components/PageTransition';
import AnimatedSection from '../components/AnimatedSection';
import { getProductById, getAllProducts } from '../services/dbService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import Swal from 'sweetalert2';
import { generateReviewSummary, getProductRecommendations } from '../services/aiService';
import { db } from '../services/firebaseConfig';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const p = await getProductById(id);
        if (p) {
          setProduct(p);
          addToRecentlyViewed(p);
          
          // Fetch reviews
          const reviewsQuery = query(collection(db, "reviews"), where("productId", "==", id));
          const reviewSnap = await getDocs(reviewsQuery);
          const reviewsList = reviewSnap.docs.map(doc => doc.data());
          setReviews(reviewsList);

          // Related products
          const all = await getAllProducts();
          setRelatedProducts(all.filter(item => item.category === p.category && item.id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAiSummary = async () => {
    if (reviews.length === 0) return;
    setIsAiLoading(true);
    try {
      const summary = await generateReviewSummary(reviews);
      setAiSummary(summary);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({ icon: 'info', title: 'Please login to review' });
      return;
    }
    try {
      await addDoc(collection(db, "reviews"), {
        ...newReview,
        productId: id,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: serverTimestamp()
      });
      setReviews(prev => [...prev, { ...newReview, userName: user.displayName, createdAt: { seconds: Date.now()/1000 } }]);
      setNewReview({ rating: 5, comment: "" });
      Swal.fire({ icon: 'success', title: 'Review added!', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (error) {
       Swal.fire({ icon: 'error', title: 'Failed to add review' });
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  const discount = calculateDiscount(product.price, product.discountPrice);

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Breadcrumbs */}
          <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[2.5px] border-b pb-6 overflow-x-auto whitespace-nowrap scrollbar-hide ${isDarkMode ? 'text-white/30 border-white/5' : 'text-gray-400 border-gray-100'}`}>
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-primary transition-colors">Lab</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors tracking-widest">{product.category}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black`}>{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
            {/* Image Gallery */}
            <div className="space-y-6">
               <motion.div 
                layoutId={`img-${id}`}
                className="aspect-square glass-panel rounded-[4rem] overflow-hidden border-white/10 shadow-2xl relative group"
               >
                 <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      src={product.images?.[activeImage]}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={product.name}
                    />
                 </AnimatePresence>
                 {/* Decorative image border */}
                 <div className="absolute inset-4 border border-white/5 rounded-[3.2rem] pointer-events-none"></div>
               </motion.div>
               <div className="flex gap-4 p-2 overflow-x-auto pb-4 custom-scrollbar">
                 {product.images?.map((img, idx) => (
                   <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-28 h-28 glass-panel rounded-3xl overflow-hidden border-2 transition-all p-1.5 shrink-0 group ${activeImage === idx ? 'border-primary scale-105 orange-shadow' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                   >
                     <img src={img} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform" alt="" />
                   </button>
                 ))}
               </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
               <div className="mb-10">
                 <div className="flex items-center gap-4 mb-8">
                  <div className={`flex items-center gap-1.5 text-primary`}>
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < product.rating ? 'fill-current' : isDarkMode ? 'text-white/10' : 'text-gray-200'}`} />)}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[2px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>({reviews.length} Verified Logs)</span>
                    {product.featured && (
                      <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[2.5px] border border-primary/20">Alpha Tier</span>
                    )}
                 </div>
                 
                 <h1 className={`text-5xl md:text-6xl font-black tracking-tight mb-6 italic leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h1>
                 <p className={`text-primary font-black uppercase tracking-[4px] text-[10px] mb-10`}>Signature Series by SmartShop <span className={isDarkMode ? 'text-white/60' : 'text-gray-400'}>©</span></p>
                 
                 <div className="flex items-end gap-6 mb-12">
                    <div className="glass-panel p-6 border-primary/20 bg-primary/5 flex flex-col min-w-[180px]">
                       <span className="text-4xl font-black text-primary italic">{formatPrice(product.discountPrice || product.price).includes('৳') ? formatPrice(product.discountPrice || product.price).replace('TK', '') : `৳ ${formatPrice(product.discountPrice || product.price).replace('TK', '')}`}</span>
                       <div className="flex items-center gap-3 mt-1">
                          {product.discountPrice && (
                            <span className={`text-xs line-through font-bold tracking-widest ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>{formatPrice(product.price)}</span>
                          )}
                          {discount > 0 && (
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">-{discount}% Off</span>
                          )}
                       </div>
                    </div>
                 </div>

                  <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} leading-relaxed mb-12 text-lg font-medium max-w-xl`}>
                    {product.description}
                  </p>

                 {/* Indicators Grid */}
                 <div className="grid grid-cols-2 gap-4 mb-12">
                   <div className={`glass-panel p-6 border-white/5 bg-white/5 space-y-3 ${isDarkMode ? '' : 'bg-gray-50'}`}>
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                       <Truck className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Logistics</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Global Express</p>
                     </div>
                   </div>
                   <div className={`glass-panel p-6 border-white/5 bg-white/5 space-y-3 ${isDarkMode ? '' : 'bg-gray-50'}`}>
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                       <RotateCcw className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Standard</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>7D Resolution</p>
                     </div>
                   </div>
                 </div>

                 {/* Stock Status */}
                 <div className="flex items-center gap-3 mb-12 p-4 glass-panel border-white/5 bg-white/5 w-fit">
                   <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                   <span className={`text-[10px] font-black uppercase tracking-[2px] ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                     {product.stock > 0 ? `Active Index (${product.stock} Units)` : 'Depleted'}
                   </span>
                 </div>

                 {/* Actions */}
                 <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto">
                    <div className="flex items-center glass-panel border-white/10 p-1 bg-white/5">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q-1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-colors font-black text-white/40"
                      >
                        -
                      </button>
                      <span className="w-14 text-center font-black text-lg text-primary">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q+1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-colors font-black text-white/40"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => addToCart(product, quantity)}
                      className="flex-1 w-full bg-primary text-white py-5 px-10 rounded-[2rem] font-black uppercase tracking-[3px] text-xs flex items-center justify-center gap-4 hover:bg-primary-dark transition-all orange-shadow transform hover:scale-105 active:scale-95"
                    >
                      <ShoppingCart className="w-5 h-5" /> Initialize Access
                    </button>

                    <button 
                      onClick={() => toggleWishlist(product)}
                      className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all glass-panel border-white/10 ${
                        isInWishlist(product.id) ? 'bg-primary border-primary orange-shadow text-white' : 'hover:bg-white/10 text-white/40'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                 </div>
               </div>

               <div className={`mt-12 pt-10 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5 shadow-none' : 'border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center gap-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Protocol:</span>
                    <div className="flex gap-4">
                       {[Facebook, Twitter, Instagram].map((Icon, i) => (
                         <button key={i} className={`w-10 h-10 flex items-center justify-center transition-all border rounded-xl ${
                           isDarkMode 
                             ? 'glass-panel border-white/10 text-white/20 hover:text-primary' 
                             : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-primary'
                         }`}><Icon className="w-4 h-4" /></button>
                       ))}
                    </div>
                  </div>
                  <button className={`text-[10px] font-black uppercase tracking-[3px] text-primary hover:opacity-80 transition-all flex items-center gap-2`}>
                    <Share2 className="w-4 h-4" /> Sync Link
                  </button>
               </div>
            </div>
          </div>

          {/* Social Discovery Layer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 mb-32">
             <div className="lg:col-span-2 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                   <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2 italic">Pulse Reviews</h2>
                    <p className={`text-sm font-medium tracking-[1px] uppercase ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Validated Experience Matrix</p>
                   </div>
                   <button 
                    onClick={handleAiSummary}
                    disabled={reviews.length === 0 || isAiLoading}
                    className="flex items-center gap-3 text-primary font-black uppercase tracking-[3px] text-[10px] glass-panel border-primary/20 bg-primary/5 px-8 py-4 px-10 rounded-full hover:bg-primary hover:text-white transition-all disabled:opacity-50 orange-shadow"
                   >
                     {isAiLoading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <Sparkles className="w-4 h-4" />}
                     Generate Core Matrix
                   </button>
                </div>

                {aiSummary && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel border-primary/30 bg-primary/5 p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl"
                  >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-700" />
                     <h4 className="font-black text-primary mb-6 flex items-center gap-3 uppercase tracking-[3px] text-xs italic">
                        <Sparkles className="w-5 h-5" /> Synthetic Intelligence Overview
                     </h4>
                     <p className={`text-xl md:text-2xl leading-relaxed font-black italic tracking-tight ${isDarkMode ? 'text-white/80' : 'text-gray-800'}`}>
                       "{aiSummary}"
                     </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   {reviews.length > 0 ? (
                     reviews.map((r, idx) => <ReviewCard key={idx} review={r} />)
                   ) : (
                     <div className="col-span-2 glass-panel border-white/5 bg-white/5 p-16 text-center rounded-[3rem]">
                        <p className={`font-black uppercase tracking-[4px] mb-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Zero Transmission Found</p>
                        <p className="text-primary font-black italic tracking-[1px] uppercase text-xs">Be the first to establish signal!</p>
                     </div>
                   )}
                </div>

                {/* Secure Review Terminal */}
                <div className={`glass-panel p-12 rounded-[3.5rem] shadow-2xl ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-105 bg-white text-gray-900'}`}>
                   <h3 className={`text-2xl font-black tracking-tight mb-10 italic uppercase border-b pb-6 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>Write Review</h3>
                   <form onSubmit={handleAddReview} className="space-y-10">
                      <div className="space-y-4">
                        <label className={`text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Sentiment Value</label>
                        <div className="flex gap-4">
                           {[...Array(5)].map((_, i) => (
                             <button
                              key={i}
                              type="button"
                              onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                              className={`p-1.5 transition-all transform hover:scale-125 ${i < newReview.rating ? 'text-primary' : isDarkMode ? 'text-white/10' : 'text-gray-200'}`}
                             >
                                <Star className={`w-8 h-8 ${i < newReview.rating ? 'fill-current' : ''}`} />
                             </button>
                           ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                         <label className={`text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Transmission Data</label>
                         <textarea
                          required
                          rows="5"
                          className={`w-full glass-panel p-6 rounded-[2rem] focus:outline-none focus:border-primary/50 transition-all font-medium leading-relaxed ${
                            isDarkMode 
                              ? 'border-white/10 bg-white/5 text-white placeholder:text-white/20' 
                              : 'border-orange-100 bg-white text-gray-800 placeholder:text-gray-400'
                          }`}
                          placeholder="Decrypt your experience here..."
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        />
                      </div>
                      <button type="submit" className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[3px] text-[10px] hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 orange-shadow">
                        Authorize Submission
                      </button>
                   </form>
                </div>
             </div>

             {/* Sidebar Info - Trust Matrix */}
             <div className="space-y-10">
                <div className="glass-panel p-10 shadow-k overflow-hidden relative group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary group-hover:scale-[6] transition-transform duration-1000 origin-top-right rounded-full opacity-5" />
                   <ShieldCheck className="w-16 h-16 text-primary mb-8" />
                   <h3 className="text-2xl font-black tracking-tighter italic mb-3">Integrity Matrix</h3>
                   <p className={`text-[10px] font-black uppercase tracking-[2px] mb-8 border-b pb-6 ${isDarkMode ? 'text-white/20 border-white/5' : 'text-gray-400 border-gray-100'}`}>SmartShop Validated Protocol</p>
                   <ul className="space-y-6">
                      {[
                        { icon: Star, text: "Authentic Genetic Origin" },
                        { icon: ShieldCheck, text: "End-to-End Secure bKash Node" },
                        { icon: RotateCcw, text: "7-Epoch Return Gateway" }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4 items-start group/item">
                           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover/item:bg-primary transition-colors">
                              <item.icon className="w-4 h-4 text-primary group-hover/item:text-white" />
                           </div>
                           <span className={`text-sm font-medium tracking-tight leading-relaxed translate-y-0.5 group-hover/item:text-white transition-colors ${isDarkMode ? 'text-white/60' : 'text-gray-650'}`}>{item.text}</span>
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="glass-panel border-white/10 bg-white/5 p-10 rounded-[3rem] space-y-6 shadow-2xl">
                   <h4 className="text-[10px] font-black uppercase tracking-[3.5px] text-primary">Priority Layer</h4>
                   <div className="space-y-4">
                      {['Logistic Parameters', 'Policy Framework', 'Contact Uplink'].map((item, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-5 glass-panel border-white/5 bg-white/5 hover:bg-white/10 transition-all group/link">
                           <span className={`text-xs font-black uppercase tracking-widest group-hover/link:text-white transition-colors ${isDarkMode ? 'text-white/40' : 'text-gray-500 group-hover/link:text-gray-800'}`}>{item}</span>
                           <ChevronRight className="w-4 h-4 text-primary transform group-hover/link:translate-x-1 transition-transform" />
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t dark:border-gray-800 pt-20">
              <ProductCarousel 
                products={relatedProducts} 
                title="Related Products" 
                subtitle="You Might Also Like"
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default ProductDetails;
