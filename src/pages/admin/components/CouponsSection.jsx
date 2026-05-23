import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { createCoupon, deleteCoupon } from '../../../services/adminService';
import { InputField } from './AdminUI';

const CouponsSection = ({ coupons, onUpdate, darkMode }) => {
  const [formData, setFormData] = useState({ code: '', discount: '', expiry: '', minOrder: '', active: true });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading(),
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      await createCoupon({...formData, discount: Number(formData.discount), minOrder: Number(formData.minOrder)});
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Coupon created successfully',
        confirmButtonColor: '#F97316',
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      setFormData({ code: '', discount: '', expiry: '', minOrder: '', active: true });
      onUpdate();
    } catch (error) {
       Swal.fire({
         icon: 'error',
         title: 'Error',
         text: error.message,
         background: darkMode ? '#111827' : '#fff',
         color: darkMode ? '#fff' : '#000',
       });
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'Delete Coupon?',
      text: "This cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it',
      background: darkMode ? '#111827' : '#fff',
      color: darkMode ? '#fff' : '#000',
    });

    if (res.isConfirmed) {
      try {
        await deleteCoupon(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Coupon has been removed.',
          icon: 'success',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
        onUpdate();
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
       <div className={`p-6 rounded-2xl border shadow-sm transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
         <h4 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create New Coupon</h4>
         <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <InputField label="Code" placeholder="SAVE50" value={formData.code} onChange={v => setFormData({...formData, code: v})} required darkMode={darkMode} />
            <InputField label="Discount (%)" type="number" placeholder="10" value={formData.discount} onChange={v => setFormData({...formData, discount: v})} required darkMode={darkMode} />
            <InputField label="Min Order" type="number" placeholder="100" value={formData.minOrder} onChange={v => setFormData({...formData, minOrder: v})} required darkMode={darkMode} />
            <InputField label="Expiry Date" type="date" value={formData.expiry} onChange={v => setFormData({...formData, expiry: v})} required darkMode={darkMode} />
            <button className="md:col-span-2 lg:col-span-4 bg-[#F97316] text-white py-3 rounded-xl font-bold hover:scale-[1.02] shadow-lg shadow-orange-500/10 transition-all">Create Coupon</button>
         </form>
       </div>

       <div className={`rounded-2xl border overflow-hidden transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
         <table className="w-full text-left">
           <thead className={`border-b transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-[#FFF7ED] border-gray-100 text-gray-500'}`}>
             <tr>
               <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Code</th>
               <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Discount</th>
               <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Expiry</th>
               <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Active</th>
               <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Actions</th>
             </tr>
           </thead>
           <tbody className={`divide-y transition-colors ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
             {coupons.map(c => (
               <tr key={c.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                 <td className="px-6 py-4 font-bold text-orange-600">{c.code}</td>
                 <td className={`px-6 py-4 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.discount}% OFF</td>
                 <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                   {c.expiry && !isNaN(new Date(c.expiry).getTime()) 
                     ? new Date(c.expiry).toLocaleDateString() 
                     : 'No Expiry'}
                 </td>
                 <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                     c.active 
                       ? 'bg-green-100/20 text-green-500 border border-green-500/20' 
                       : 'bg-red-100/20 text-red-500 border border-red-500/20'
                   }`}>
                     {c.active ? 'YES' : 'NO'}
                   </span>
                 </td>
                 <td className="px-6 py-4">
                   <button 
                     onClick={() => handleDelete(c.id)} 
                     className={`p-2 rounded-lg transition-all ${
                       darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                     }`}
                   >
                     <Trash2 size={16} />
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
         {coupons.length === 0 && (
           <p className="text-center py-20 text-gray-400 font-medium italic">No coupons available...</p>
         )}
       </div>
    </motion.div>
  );
};

export default CouponsSection;
