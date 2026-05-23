import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import ProductFormModal from '../../components/admin/ProductFormModal';
import Swal from 'sweetalert2';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to decouple "${name}" from the registry?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, decouple it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter(p => p.id !== id));
        Swal.fire({
          title: 'Decoupled!',
          text: 'The product has been removed from the catalog database.',
          icon: 'success',
          confirmButtonColor: '#F97316'
        });
      } catch (error) {
        Swal.fire('Error', 'De-alignment failed: ' + error.message, 'error');
      }
    }
  };

  // Inline Stock Incrementor & Updater with Toast
  const handleInlineStockUpdate = async (productId, newStock) => {
    if (newStock < 0) return;
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, { stock: newStock });
      
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: false
      });
      Toast.fire({
        icon: 'success',
        title: `Stock updated to ${newStock}`
      });
    } catch (err) {
      console.error("Error updates stock", err);
      Swal.fire('Error', 'Failed to save stock updates: ' + err.message, 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(term);
    const categoryMatch = p.category?.toLowerCase().includes(term);
    const categoriesArrayMatch = p.categories?.some(cat => cat?.toLowerCase().includes(term));
    const brandMatch = p.brand?.toLowerCase().includes(term);
    return nameMatch || categoryMatch || categoriesArrayMatch || brandMatch;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-orange-100 text-primary">
                <Package className="w-6 h-6 text-[#F97316]" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-none">
                Item <span className="text-primary italic">Registry</span>
              </h2>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Managing {products.length} catalog identifiers</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search catalog registry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold w-full md:w-80 shadow-inner focus:ring-2 focus:ring-[#F97316] transition-all text-gray-700"
              />
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="bg-[#F97316] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[3px] text-xs flex items-center gap-3 hover:bg-orange-600 transition-all orange-shadow active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Identifier
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Classifications</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Valuation</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Inventory Core (Stock Adjuster)</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence initial={false}>
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      key={product.id}
                      className="hover:bg-orange-50/30 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-transparent group-hover:border-primary/20 transition-all">
                            <img 
                              src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 leading-none mb-1 group-hover:text-primary transition-colors">{product.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.brand || 'No Brand'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {product.categories && product.categories.length > 0 ? (
                            product.categories.map((cat, idx) => (
                              <span key={idx} className="bg-orange-50 text-[#F97316] border border-orange-100 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                              {product.category || 'No Category'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <p className="font-black text-gray-905">৳{product.price?.toLocaleString()}</p>
                          {product.discountPrice && (
                            <p className="text-[10px] font-bold text-primary italic uppercase tracking-tighter decoration-1 line-through opacity-50">
                              ৳{product.discountPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          {/* Inline Stock Selector Button Inputs */}
                          <div className="flex items-center gap-1.5 bg-gray-50 border rounded-xl p-1.5 w-fit shadow-inner">
                            <button
                              type="button"
                              onClick={() => handleInlineStockUpdate(product.id, Math.max(0, parseInt(product.stock || 0) - 1))}
                              className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center font-black text-xs text-gray-500 hover:text-primary hover:bg-orange-50 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-10 text-center text-xs font-black text-gray-800">
                              {product.stock || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleInlineStockUpdate(product.id, parseInt(product.stock || 0) + 1)}
                              className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center font-black text-xs text-gray-500 hover:text-primary hover:bg-orange-50 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                            <span className={`text-[10px] font-bold ${product.stock > 10 ? 'text-gray-500' : 'text-red-500'}`}>
                              {product.stock <= 10 ? 'Low Stock' : 'Secure'}
                            </span>
                            {product.stock <= 10 && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-3 hover:bg-white hover:shadow-sm rounded-xl text-gray-400 hover:text-blue-500 hover:border hover:border-gray-100 transition-all active:scale-90"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-3 hover:bg-white hover:shadow-sm rounded-xl text-gray-400 hover:text-red-500 hover:border hover:border-gray-100 transition-all active:scale-90"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Displaying {filteredProducts.length} results</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-primary transition-colors disabled:opacity-50" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-xs font-black px-4">01</div>
              <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-primary transition-colors disabled:opacity-50" disabled>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct} 
        onSuccess={fetchProducts}
      />
    </AdminLayout>
  );
};

export default ManageProducts;
