import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Calendar, Award, Tag, Sparkles, Coins, Users, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import { 
  addLotteryOffer, 
  updateLotteryOffer, 
  deleteLotteryOffer, 
  getAllLotteryOffers, 
  getAllUserSpins,
  getProducts 
} from '../../../services/adminService';
import { InputField } from './AdminUI';

const ManageLotteryOffers = ({ darkMode }) => {
  const [offers, setOffers] = useState([]);
  const [spins, setSpins] = useState([]);
  const [categories, setCategories] = useState(['Electronics', 'Fashion', 'Home & Living', 'Groceries']);
  const [loading, setLoading] = useState(true);
  const [formActiveTab, setFormActiveTab] = useState('create'); // 'create' or 'logs'
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    occasion: 'Eid',
    category: 'all',
    discount: '',
    discountType: 'percentage',
    expiryDate: ''
  });
  
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allOffers, allSpins, products] = await Promise.all([
        getAllLotteryOffers(),
        getAllUserSpins(),
        getProducts()
      ]);
      
      setOffers(allOffers);
      setSpins(allSpins);
      
      // Dynamically load categories from products if available
      if (products && products.length > 0) {
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
        }
      }
    } catch (error) {
      console.error("Error loading lottery management data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      occasion: 'Eid',
      category: 'all',
      discount: '',
      discountType: 'percentage',
      expiryDate: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.discount || !formData.expiryDate) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please complete all required fields.',
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      return;
    }

    try {
      Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading(),
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });

      const offerPayload = {
        name: formData.name,
        occasion: formData.occasion,
        category: formData.category,
        discount: Number(formData.discount),
        discountType: formData.discountType,
        expiryDate: formData.expiryDate
      };

      if (editingId) {
        await updateLotteryOffer(editingId, offerPayload);
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'Lottery offer updated successfully!',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      } else {
        await addLotteryOffer(offerPayload);
        Swal.fire({
          icon: 'success',
          title: 'Created',
          text: 'New lottery offer added for the occasion!',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      }

      handleReset();
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Database Error',
        text: error.message,
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    }
  };

  const handleEdit = (offer) => {
    setFormData({
      name: offer.name || '',
      occasion: offer.occasion || 'Eid',
      category: offer.category || 'all',
      discount: offer.discount || '',
      discountType: offer.discountType || 'percentage',
      expiryDate: offer.expiryDate || ''
    });
    setEditingId(offer.id);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'Remove offer?',
      text: "This sector will disappear from user lottery spins!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      background: darkMode ? '#111827' : '#fff',
      color: darkMode ? '#fff' : '#000',
    });

    if (res.isConfirmed) {
      try {
        await deleteLotteryOffer(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Lottery wheel offer removed.',
          icon: 'success',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      }
    }
  };

  const isExpired = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  };

  // Occasions list based on standard seasonal campaigns
  const OCCASIONS = ['Eid', 'Qurban', 'New Year', 'Daily Luck', 'Weekly Mystery', 'Bishwas Mega Campaign'];

  return (
    <div className="space-y-8">
      {/* Header Tabs */}
      <div className="flex gap-4 border-b border-gray-700/20 pb-4">
        <button
          onClick={() => setFormActiveTab('create')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            formActiveTab === 'create'
              ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/20'
              : `${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-100'} hover:opacity-85`
          }`}
        >
          <Award size={18} /> Configure Opportunities
        </button>
        <button
          onClick={() => setFormActiveTab('logs')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            formActiveTab === 'logs'
              ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/20'
              : `${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-100'} hover:opacity-85`
          }`}
        >
          <Users size={18} /> User Spin History ({spins.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {formActiveTab === 'create' ? (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Form & Stats Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Offer Editor */}
              <div className={`xl:col-span-2 p-8 rounded-3xl border shadow-xl transition-all ${darkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-orange-50'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-[#F97316] animate-pulse" />
                  <h4 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {editingId ? 'Edit Wheel Sector Offer' : 'Add Wheel Sector Offer'}
                  </h4>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Sector Display Name" 
                      placeholder="e.g. Eid Extra 15%" 
                      value={formData.name} 
                      onChange={v => setFormData({...formData, name: v})} 
                      required 
                      darkMode={darkMode} 
                    />
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Occasion Campaign</label>
                      <select
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-[#F97316]' 
                            : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#F97316]'
                        }`}
                        value={formData.occasion}
                        onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                      >
                        {OCCASIONS.map(occ => (
                          <option key={occ} value={occ}>{occ}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assign to Category</label>
                      <select
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-[#F97316]' 
                            : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#F97316]'
                        }`}
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="all">Apply to ALL Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <InputField 
                        label="Amount" 
                        type="number" 
                        placeholder="10" 
                        value={formData.discount} 
                        onChange={v => setFormData({...formData, discount: v})} 
                        required 
                        darkMode={darkMode} 
                      />
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</label>
                        <select
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-[#F97316]' 
                              : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#F97316]'
                          }`}
                          value={formData.discountType}
                          onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (TK)</option>
                        </select>
                      </div>
                    </div>

                    <InputField 
                      label="Expiry Date" 
                      type="date" 
                      value={formData.expiryDate} 
                      onChange={v => setFormData({...formData, expiryDate: v})} 
                      required 
                      darkMode={darkMode} 
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit" 
                      className="flex-1 bg-[#F97316] text-white py-3 px-6 rounded-xl font-bold hover:scale-[1.01] hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10"
                    >
                      {editingId ? 'Modify Option' : 'Register Offer Segment'}
                    </button>
                    {editingId && (
                      <button 
                        type="button" 
                        onClick={handleReset}
                        className="bg-gray-500/20 text-gray-400 py-3 px-6 rounded-xl font-bold hover:bg-gray-500/30 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Side Cards */}
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border shadow-md transition-all ${darkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-orange-50'}`}>
                  <h5 className="font-bold text-sm text-[#F97316] mb-3 uppercase tracking-wider">Lottery Guidelines</h5>
                  <ul className="text-xs text-gray-400 space-y-3 list-disc pl-4 leading-relaxed">
                    <li>Offers are added as sectors on the Wheel automatically.</li>
                    <li>Ensure there are at least 4 sectors (at least 1 or 2 options) to make the wheel look engaging and spin correctly!</li>
                    <li>Users are permitted a single spin per campaign occasion.</li>
                    <li>A winner's checkout reward code is registered directly to system couplers dynamically.</li>
                  </ul>
                </div>

                <div className={`p-6 rounded-3xl border shadow-md flex items-center justify-between transition-all ${darkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-orange-50'}`}>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Spun Wheels</p>
                    <p className={`text-2xl font-black mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{spins.length}</p>
                  </div>
                  <div className="p-4 bg-orange-500/10 text-[#F97316] rounded-2xl"><Coins size={24} /></div>
                </div>
              </div>
            </div>

            {/* List Table of Offers */}
            <div className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${darkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
              <div className="p-6 border-b border-gray-700/20 flex gap-2 items-center justify-between">
                <h4 className="font-black">Active Offer Segments on Wheel</h4>
                <span className="text-xs px-3 py-1 bg-orange-500/20 text-[#F97316] rounded-full font-black">
                  {offers.length} Sectors Registered
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className={`border-b transition-colors ${darkMode ? 'bg-gray-900 border-gray-850 text-gray-400' : 'bg-[#FFF7ED] border-gray-50 text-gray-500'}`}>
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Occasion</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Wheel Text Label</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Category Constraint</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Discount</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Expiration</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/10 text-sm">
                    {offers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center font-semibold text-gray-400 italic">
                          No offers configured! Add offers to enable wheel sectors.
                        </td>
                      </tr>
                    ) : (
                      offers.map((offer) => {
                        const expired = isExpired(offer.expiryDate);
                        return (
                          <tr key={offer.id} className="hover:bg-primary/5 transition-colors">
                            <td className="px-6 py-4 font-black text-[#F97316]">{offer.occasion}</td>
                            <td className="px-6 py-4 font-bold">{offer.name}</td>
                            <td className="px-6 py-4 text-xs">
                              {offer.category === 'all' ? (
                                <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-bold">All Products</span>
                              ) : (
                                <span className="bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full font-bold">{offer.category}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-bold">
                              {offer.discountType === 'percentage' ? `${offer.discount}%` : `৳${offer.discount}`}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-400">{offer.expiryDate}</td>
                            <td className="px-6 py-4">
                              {expired ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500">
                                  <AlertTriangle size={12} /> Expired
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">
                                  <CheckCircle size={12} /> Live Spot
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(offer)}
                                  className="p-2 bg-blue-500/15 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(offer.id)}
                                  className="p-2 bg-red-500/15 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`rounded-2xl border overflow-hidden shadow-xl transition-colors ${darkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-orange-50 text-gray-800'}`}
          >
            <div className="p-6 border-b border-gray-700/20">
              <h4 className="font-bold text-lg">Detailed Spin History Logs ({spins.length})</h4>
              <p className="text-xs text-gray-400">Total analytical spins recorded per occasion identifier.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className={`border-b transition-colors ${darkMode ? 'bg-gray-900 border-gray-850 text-gray-400' : 'bg-[#FFF7ED] border-gray-50 text-gray-500'}`}>
                  <tr>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Occasion</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">User Email ID</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Prize Won</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Active Coupon Code</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Recorded Spin date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/10 text-sm">
                  {spins.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center font-semibold text-gray-400 italic">
                        No spin records exist yet! Shares are tracked automatically upon win completion.
                      </td>
                    </tr>
                  ) : (
                    spins.map((spin) => (
                      <tr key={spin.id} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 font-black text-[#F97316]">{spin.occasion}</td>
                        <td className="px-6 py-4 font-mono text-xs">{spin.userEmail || spin.userId}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold">{spin.offerName}</span> ({spin.discountType === 'percentage' ? `${spin.discount}%` : `৳${spin.discount}`})
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-blue-400 font-bold">{spin.code}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {spin.createdAt?.toDate ? spin.createdAt.toDate().toLocaleString() : new Date(spin.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageLotteryOffers;
