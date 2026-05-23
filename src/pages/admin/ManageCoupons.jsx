import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Ticket, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar, 
  Percent, 
  DollarSign,
  Loader2,
  X,
  Save,
  Tag
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import Swal from 'sweetalert2';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    expiryDate: '',
    active: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "coupons"), orderBy("code", "asc"));
      const snap = await getDocs(q);
      setCoupons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: parseFloat(formData.minOrderAmount),
        expiryDate: new Date(formData.expiryDate)
      };

      if (editingCoupon) {
        await updateDoc(doc(db, "coupons", editingCoupon.id), data);
      } else {
        await setDoc(doc(db, "coupons", formData.code.toUpperCase()), data);
      }

      Swal.fire('Success', 'Coupon token saved successfully', 'success');
      fetchCoupons();
      setIsModalOpen(false);
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        expiryDate: '',
        active: true
      });
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Coupon?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      confirmButtonText: 'Delete'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "coupons", id));
      fetchCoupons();
      Swal.fire('Deleted!', 'Coupon has been removed.', 'success');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <Ticket className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-none">
                Promo <span className="text-indigo-600 italic">Tokens</span>
              </h2>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Managing {coupons.length} active discount sequences</p>
          </div>

          <button 
            onClick={() => { setEditingCoupon(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[3px] text-xs flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Sequence
          </button>
        </div>

        {/* Coupons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full flex justify-center py-20"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /></div>
          ) : coupons.map((coupon) => (
            <motion.div 
              key={coupon.id}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Ticket className="w-32 h-32 -rotate-12 translate-x-12 -translate-y-8" />
              </div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">
                  {coupon.code}
                </div>
                <div className="flex gap-2">
                   <button onClick={() => {
                     setEditingCoupon(coupon);
                     setFormData({
                       ...coupon,
                       expiryDate: coupon.expiryDate?.toDate ? coupon.expiryDate.toDate().toISOString().split('T')[0] : coupon.expiryDate
                     });
                     setIsModalOpen(true);
                   }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                     <Edit3 className="w-4 h-4" />
                   </button>
                   <button onClick={() => handleDelete(coupon.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-end gap-1">
                   <span className="text-4xl font-black text-gray-900 tracking-tighter">
                     {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}
                   </span>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Discount</span>
                </div>

                <div className="space-y-2 border-t border-gray-50 pt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-2"><DollarSign className="w-3 h-3" /> Min Spend:</span>
                    <span className="text-gray-900 underline decoration-indigo-200">৳{coupon.minOrderAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Expires:</span>
                    <span className="text-gray-900 italic">{coupon.expiryDate?.toDate ? coupon.expiryDate.toDate().toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className={`mt-6 w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-[2px] text-center ${
                coupon.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {coupon.active ? 'Pulse Active' : 'Sequence Halted'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
               <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50">
                  <h3 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">
                    {editingCoupon ? 'Edit Sequence' : 'New promo identifier'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl text-gray-400 shadow-sm"><X className="w-5 h-5"/></button>
               </div>

               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Token Code</label>
                    <input 
                      type="text" 
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500"
                      placeholder="SUMMER25"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Valuation Type</label>
                      <select 
                         value={formData.discountType}
                         onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                         className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-indigo-500 appearance-none"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (৳)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Valuation</label>
                      <input 
                        type="number" 
                        required
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-indigo-500"
                        placeholder="20"
                      />
                    </div>
                  </div>

                   <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Threshold spend</label>
                      <input 
                        type="number" 
                        required
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-indigo-500"
                        placeholder="1000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Deactivation Date</label>
                      <input 
                        type="date" 
                        required
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-[3px] text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 mt-4"
                  >
                    <Save className="w-4 h-4"/> 
                    Confirm Configuration
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ManageCoupons;
