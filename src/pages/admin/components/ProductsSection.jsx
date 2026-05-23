import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { addProduct, updateProduct, deleteProduct } from '../../../services/adminService';
import { InputField } from './AdminUI';

const ProductsSection = ({ products, onUpdate, darkMode, t }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    stock: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
      setShowAddForm(true);
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Processing...',
      didOpen: () => Swal.showLoading(),
      background: darkMode ? '#111827' : '#fff',
      color: darkMode ? '#fff' : '#000',
    });
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        Swal.fire({ 
          icon: 'success', 
          title: 'Product Updated', 
          timer: 1500, 
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      } else {
        await addProduct(data);
        Swal.fire({ 
          icon: 'success', 
          title: 'Product Added', 
          timer: 1500, 
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      }

      setFormData({ name: '', price: '', image: '', stock: '', category: '', description: '' });
      setShowAddForm(false);
      setEditingProduct(null);
      onUpdate();
    } catch (error) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Action Failed', 
        text: error.message,
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'Delete Product?',
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
        await deleteProduct(id);
        Swal.fire({
          title: 'Deleted!', 
          text: 'Product has been removed.', 
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.products} Inventory ({products.length})</h3>
        <button 
          onClick={() => { setShowAddForm(!showAddForm); setEditingProduct(null); }}
          className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? 'Cancel' : `Add New ${t.products}`}
        </button>
      </div>

      {showAddForm && (
        <motion.form 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className={`p-6 rounded-2xl border space-y-4 overflow-hidden transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField label="Product Name" placeholder="e.g. iPhone 15 Pro" value={formData.name} onChange={v => setFormData({...formData, name: v})} required darkMode={darkMode} />
            <InputField label="Price (৳)" type="number" placeholder="99.99" value={formData.price} onChange={v => setFormData({...formData, price: v})} required darkMode={darkMode} />
            <InputField label="Stock" type="number" placeholder="50" value={formData.stock} onChange={v => setFormData({...formData, stock: v})} required darkMode={darkMode} />
            <InputField label="Category" placeholder="e.g. Electronics" value={formData.category} onChange={v => setFormData({...formData, category: v})} required darkMode={darkMode} />
            <InputField label="Image URL" placeholder="https://..." value={formData.image} onChange={v => setFormData({...formData, image: v})} required darkMode={darkMode} />
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <textarea 
                className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500' 
                    : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-orange-500 focus:bg-white'
                }`}
                rows="3"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#F97316] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
            {editingProduct ? 'Update Product Details' : 'Confirm & Save Product'}
          </button>
        </motion.form>
      )}

      <div className={`rounded-2xl border overflow-hidden shadow-sm overflow-x-auto transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
        <table className="w-full text-left">
          <thead className={`border-b transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-[#FFF7ED] border-gray-100 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">{t.products}</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {products.map((p) => (
              <tr key={p.id} className={`transition-colors group ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-100 group-hover:ring-[#F97316]/20 transition-all" />
                    <div>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{p.name}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-orange-400' : 'text-gray-700'}`}>৳{p.price}</td>
                <td className="px-6 py-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${darkMode ? 'bg-gray-800 text-orange-400' : 'bg-orange-50 text-[#F97316]'}`}>{p.category}</span></td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                     <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{p.stock} units</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingProduct(p)} className={`p-2 rounded-lg transition-all ${darkMode ? 'text-blue-400 hover:bg-blue-500/10' : 'text-blue-500 hover:bg-blue-50'}`}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className={`p-2 rounded-lg transition-all ${darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-20 text-gray-400 font-medium italic">No products in inventory yet...</p>}
      </div>
    </motion.div>
  );
};

export default ProductsSection;
