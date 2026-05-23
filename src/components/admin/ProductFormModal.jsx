import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Loader2, Image as ImageIcon, Link as LinkIcon, 
  Hash, Tag, Type, DollarSign, Package, Settings, Eye, 
  Palette, Grid, Check, ArrowUp, ArrowDown, Sparkles, Plus, AlertCircle 
} from 'lucide-react';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { getCategories } from '../../services/adminService';
import Swal from 'sweetalert2';

// Standard base options to toggle quickly
const AVAILABLE_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Living', 'Groceries', 
  'Beauty', 'Sports & Outdoors', 'Accessories'
];

const COMMON_COLORS = [
  'Black', 'White', 'Silver', 'Space Gray', 'Dark Blue', 
  'Sunset Gold', 'Olive Green', 'Rose Gold', 'Crimson Red'
];

const COMMON_SIZES = [
  'S', 'M', 'L', 'XL', 'XXL', 
  'iPhone 14/15', 'iPhone 16 Pro Max', 'Samsung S24 Ultra', 'Universal Fit',
  '8GB / 256GB', '16GB / 512GB', '32GB / 1TB', 
  '50ml', '100ml', '250g', '500g', '1kg'
];

const ProductFormModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('core'); // 'core' | 'properties' | 'config'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Electronics', // standard backing field
    categories: ['Electronics'], // multi-category array
    stock: '',
    brand: '',
    images: [''],
    featured: false,
    popularity: 50,
    colors: [],
    sizes: [],
    defaultColor: '',
    defaultSize: '',
    modalConfig: {
      showName: true,
      showRating: true,
      showDescription: true,
      showPrice: true,
      showColors: true,
      showSizes: true,
      showQuantity: true,
      showThumbnails: true,
      showStock: true,
      showBrandBadge: true,
      showFeatures: true,
      showDeliveryInfo: true
    }
  });

  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [customColorInput, setCustomColorInput] = useState('');
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const fetchDbCats = async () => {
      try {
        const list = await getCategories();
        if (list && list.length > 0) {
          const names = list.map(c => c.name);
          setDbCategories(names);
        }
      } catch (err) {
        console.error("Error fetching admin categories for selection:", err);
      }
    };
    fetchDbCats();
  }, [isOpen]);

  const categoryOptions = dbCategories.length > 0 ? dbCategories : AVAILABLE_CATEGORIES;

  // Synchronize on edit/add target change
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        discountPrice: product.discountPrice?.toString() || '',
        category: product.category || (product.categories?.[0] || 'Electronics'),
        categories: product.categories || [product.category || 'Electronics'],
        brand: product.brand || '',
        images: product.images?.length > 0 ? product.images : [''],
        featured: !!product.featured,
        popularity: product.popularity || 50,
        colors: product.colors || [],
        sizes: product.sizes || [],
        defaultColor: product.defaultColor || '',
        defaultSize: product.defaultSize || '',
        modalConfig: product.modalConfig || {
          showName: true,
          showRating: true,
          showDescription: true,
          showPrice: true,
          showColors: true,
          showSizes: true,
          showQuantity: true,
          showThumbnails: true,
          showStock: true,
          showBrandBadge: true,
          showFeatures: true,
          showDeliveryInfo: true
        }
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: 'Electronics',
        categories: ['Electronics'],
        stock: '',
        brand: '',
        images: [''],
        featured: false,
        popularity: 50,
        colors: [],
        sizes: [],
        defaultColor: '',
        defaultSize: '',
        modalConfig: {
          showName: true,
          showRating: true,
          showDescription: true,
          showPrice: true,
          showColors: true,
          showSizes: true,
          showQuantity: true,
          showThumbnails: true,
          showStock: true,
          showBrandBadge: true,
          showFeatures: true,
          showDeliveryInfo: true
        }
      });
    }
    setActiveTab('core');
  }, [product, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations check
    const cost = parseFloat(formData.price);
    const qty = parseInt(formData.stock);
    const promo = formData.discountPrice ? parseFloat(formData.discountPrice) : null;

    if (isNaN(cost) || cost <= 0) {
      Swal.fire('Validation Error', 'Base Price must be a valid positive amount.', 'warning');
      return;
    }
    if (isNaN(qty) || qty < 0) {
      Swal.fire('Validation Error', 'Stock Quantity must be a valid non-negative integer.', 'warning');
      return;
    }
    if (promo !== null && (isNaN(promo) || promo < 0)) {
      Swal.fire('Validation Error', 'Discount Price must be a valid non-negative value.', 'warning');
      return;
    }
    if (promo !== null && promo >= cost) {
      Swal.fire('Validation Error', 'Discount/Promo price should be less than the regular price.', 'warning');
      return;
    }
    if (formData.categories.length === 0) {
      Swal.fire('Validation Error', 'Please select at least one Product Category classification.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const dataToSave = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: cost,
        stock: qty,
        discountPrice: promo,
        brand: formData.brand.trim() || 'Premium',
        featured: formData.featured,
        popularity: formData.popularity,
        category: formData.categories[0] || 'Electronics', // fallback backward-compatible single value
        categories: formData.categories,
        colors: formData.colors,
        sizes: formData.sizes,
        defaultColor: formData.defaultColor,
        defaultSize: formData.defaultSize,
        modalConfig: formData.modalConfig,
        updatedAt: serverTimestamp(),
        // Filter empty urls
        images: formData.images.filter(img => img && img.trim() !== '')
      };

      if (product) {
        await updateDoc(doc(db, "products", product.id), dataToSave);
        Swal.fire({
          icon: 'success',
          title: 'Registry Updated!',
          text: `"${dataToSave.name}" has been fully synchronized in systems.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        const newId = `p${Date.now()}`;
        await setDoc(doc(db, "products", newId), {
          ...dataToSave,
          id: newId,
          createdAt: serverTimestamp(),
          rating: 4 + Math.round(Math.random() * 10) / 10 // random pleasing 4.x - 5.0 rating for mock beauty
        });

        Swal.fire({
          icon: 'success',
          title: 'Registered Successfully!',
          text: `"${dataToSave.name}" has been registered into the database catalogs.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Registry Sync Failure', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Category Selection array controller ---
  const handleToggleCategory = (cat) => {
    const isSelected = formData.categories.includes(cat);
    let updated = [];
    if (isSelected) {
      updated = formData.categories.filter(c => c !== cat);
    } else {
      updated = [...formData.categories, cat];
    }
    setFormData({ ...formData, categories: updated });
  };

  const handleAddCustomCategory = () => {
    const cat = customCategoryInput.trim();
    if (cat && !formData.categories.includes(cat)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, cat]
      });
      setCustomCategoryInput('');
    }
  };

  // --- Image List Reorder Controllers ---
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  };

  const moveImageUp = (index) => {
    if (index === 0) return;
    const list = [...formData.images];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    setFormData({ ...formData, images: list });
  };

  const moveImageDown = (index) => {
    if (index === formData.images.length - 1) return;
    const list = [...formData.images];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    setFormData({ ...formData, images: list });
  };

  // --- Colors Selection toggler ---
  const handleToggleColor = (col) => {
    const isSelected = formData.colors.includes(col);
    let updated = [];
    if (isSelected) {
      updated = formData.colors.filter(c => c !== col);
    } else {
      updated = [...formData.colors, col];
    }

    // fallback check for default selected color
    let defColor = formData.defaultColor;
    if (updated.length > 0 && !updated.includes(defColor)) {
      defColor = updated[0];
    } else if (updated.length === 0) {
      defColor = '';
    }

    setFormData({ ...formData, colors: updated, defaultColor: defColor });
  };

  const handleAddCustomColor = () => {
    const col = customColorInput.trim();
    if (col && !formData.colors.includes(col)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, col],
        defaultColor: formData.defaultColor ? formData.defaultColor : col
      });
      setCustomColorInput('');
    }
  };

  // --- Sizes Selection toggler ---
  const handleToggleSize = (sz) => {
    const isSelected = formData.sizes.includes(sz);
    let updated = [];
    if (isSelected) {
      updated = formData.sizes.filter(s => s !== sz);
    } else {
      updated = [...formData.sizes, sz];
    }

    // fallback check for default selected size
    let defSize = formData.defaultSize;
    if (updated.length > 0 && !updated.includes(defSize)) {
      defSize = updated[0];
    } else if (updated.length === 0) {
      defSize = '';
    }

    setFormData({ ...formData, sizes: updated, defaultSize: defSize });
  };

  const handleAddCustomSize = () => {
    const sz = customSizeInput.trim();
    if (sz && !formData.sizes.includes(sz)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, sz],
        defaultSize: formData.defaultSize ? formData.defaultSize : sz
      });
      setCustomSizeInput('');
    }
  };

  // --- Helper to toggle modalConfig elements ---
  const toggleModalConfigField = (field) => {
    setFormData({
      ...formData,
      modalConfig: {
        ...formData.modalConfig,
        [field]: !formData.modalConfig[field]
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col h-[90vh]"
          >
            {/* Header section with theme background */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#F97316] flex items-center justify-center text-white shadow-lg orange-shadow">
                    {product ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                 </div>
                 <div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tighter text-gray-900 uppercase">
                      {product ? 'Synchronize Registry' : 'Register Catalog Item'}
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">SmartShop Multi-Store Protocol</p>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB Navigation Bar */}
            <div className="flex border-b border-gray-100 bg-gray-50/50 px-8 py-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('core')}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === 'core' 
                    ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/10' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
                Core Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('properties')}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === 'properties' 
                    ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/10' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Palette className="w-4 h-4" />
                Properties & Colors
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('config')}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === 'config' 
                    ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/10' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                Modal Configuration
              </button>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 md:p-10 flex-1 flex flex-col justify-between scrollbar-hide">
              {/* TAB 1: Core details */}
              {activeTab === 'core' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Item Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-2">Product Name</label>
                      <div className="relative group">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F97316] transition-colors w-5 h-5" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#F97316] transition-all font-bold text-gray-800"
                          placeholder="e.g. iPhone 17 Pro Max 256GB"
                        />
                      </div>
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-2">Brand Name (Identifier)</label>
                      <div className="relative group">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F97316] transition-colors w-5 h-5" />
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#F97316] transition-all font-bold text-gray-800"
                          placeholder="e.g. Apple"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-2">Base Price (৳)</label>
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F97316] transition-colors w-5 h-5" />
                        <input
                          type="number"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#F97316] transition-all font-bold text-gray-800"
                          placeholder="00"
                        />
                      </div>
                    </div>

                    {/* Discount/Promo Price */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-2">Discount Price (৳ Optional)</label>
                      <div className="relative group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F97316] transition-colors w-5 h-5" />
                        <input
                          type="number"
                          value={formData.discountPrice}
                          onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#F97316] transition-all font-bold text-gray-800"
                          placeholder="00"
                        />
                      </div>
                    </div>

                    {/* Stock Units */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-2">Initial Stock Capacity</label>
                      <div className="relative group">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F97316] transition-colors w-5 h-5" />
                        <input
                          type="number"
                          required
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#F97316] transition-all font-bold text-gray-800"
                          placeholder="25"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Multi Categories Picker section */}
                  <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 block ml-2">
                        Classifications <span className="text-[#F97316] italic">(Category Multi-Select Match)</span>
                      </label>
                      {/* Search Add Category */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end">
                        <input 
                          type="text"
                          placeholder="Custom category..."
                          value={customCategoryInput}
                          onChange={(e) => setCustomCategoryInput(e.target.value)}
                          className="px-4 py-2 border-none bg-white rounded-xl text-xs font-bold shadow-sm focus:ring-1 focus:ring-[#F97316]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomCategory();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomCategory}
                          className="p-2.5 bg-[#F97316] text-white rounded-xl shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Selector chips */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {categoryOptions.map(cat => {
                        const isSelected = formData.categories.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => handleToggleCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                              isSelected 
                                ? 'bg-[#F97316] text-white shadow-md scale-105' 
                                : 'bg-white hover:bg-gray-100 border border-gray-200 text-gray-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            {cat}
                          </button>
                        );
                      })}

                      {/* Display added custom ones if any */}
                      {formData.categories.filter(cat => !categoryOptions.includes(cat)).map(cat => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => handleToggleCategory(cat)}
                          className="px-4 py-2 rounded-xl text-xs font-black bg-orange-100 text-[#F97316] border border-orange-200 shadow-md scale-105 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specification details */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-2">Detailed Specifications</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 focus:ring-2 focus:ring-[#F97316] transition-all font-bold resize-none text-gray-800"
                      placeholder="Write core detailed information, technical specs, and components here..."
                    />
                  </div>

                  {/* Featured state */}
                  <div className="p-5 bg-[#F97316]/5 rounded-3xl border border-[#F97316]/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-gray-800 tracking-tight leading-none mb-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#F97316] fill-current" />
                        Featured Spotlight Program
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Place this catalog registry on primary interface landing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#F97316]"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: Properties, Colors, Sizes & Image gallery ordering */}
              {activeTab === 'properties' && (
                <div className="space-y-8">
                  {/* Colors chip picker */}
                  <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 block ml-2">Colors Palette Selection</label>
                        <p className="text-[9px] text-gray-400 font-bold ml-2">Select matching options | Select default selection by Clicking on Radio icon</p>
                      </div>
                      
                      {/* Search Add Color */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end">
                        <input 
                          type="text"
                          placeholder="Custom color..."
                          value={customColorInput}
                          onChange={(e) => setCustomColorInput(e.target.value)}
                          className="px-4 py-2 border-none bg-white rounded-xl text-xs font-bold shadow-sm focus:ring-1 focus:ring-[#F97316]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomColor();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomColor}
                          className="p-2.5 bg-[#F97316] text-white rounded-xl shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {COMMON_COLORS.map(col => {
                        const isSelected = formData.colors.includes(col);
                        const isDefault = formData.defaultColor === col;
                        return (
                          <div 
                            key={col} 
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                              isSelected 
                                ? 'bg-[#F97316] text-white shadow-sm' 
                                : 'bg-white border border-gray-200 text-gray-600'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleColor(col)}
                              className="text-xs font-black uppercase tracking-wider block"
                            >
                              {col}
                            </button>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, defaultColor: col })}
                                title="Set as default color in user view"
                                className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-extrabold ${
                                  isDefault ? 'bg-white text-[#F97316]' : 'bg-black/20 text-white'
                                }`}
                              >
                                {isDefault ? '★' : 'o'}
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Display added custom ones */}
                      {formData.colors.filter(c => !COMMON_COLORS.includes(c)).map(col => {
                        const isDefault = formData.defaultColor === col;
                        return (
                          <div 
                            key={col} 
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 text-[#F97316] border border-orange-200 shadow-sm"
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleColor(col)}
                              className="text-xs font-black uppercase tracking-wider block"
                            >
                              {col}
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, defaultColor: col })}
                              title="Set as default color in user view"
                              className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-extrabold ${
                                isDefault ? 'bg-[#F97316] text-white' : 'bg-orange-250/20 text-[#F97316]'
                              }`}
                            >
                              {isDefault ? '★' : 'o'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sizes multiselect chip picker */}
                  <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 block ml-2">Sizes Configuration</label>
                        <p className="text-[9px] text-gray-400 font-bold ml-2">Select variety specs | Click Star/Star marker to set default selected sizing</p>
                      </div>

                      {/* Search Add Size */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end">
                        <input 
                          type="text"
                          placeholder="Custom size specs..."
                          value={customSizeInput}
                          onChange={(e) => setCustomSizeInput(e.target.value)}
                          className="px-4 py-2 border-none bg-white rounded-xl text-xs font-bold shadow-sm focus:ring-1 focus:ring-[#F97316]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomSize();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSize}
                          className="p-2.5 bg-[#F97316] text-white rounded-xl shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {COMMON_SIZES.map(sz => {
                        const isSelected = formData.sizes.includes(sz);
                        const isDefault = formData.defaultSize === sz;
                        return (
                          <div 
                            key={sz} 
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                              isSelected 
                                ? 'bg-[#F97316] text-white shadow-sm' 
                                : 'bg-white border border-gray-200 text-gray-600'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleSize(sz)}
                              className="text-xs font-black uppercase block"
                            >
                              {sz}
                            </button>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, defaultSize: sz })}
                                title="Set as default size"
                                className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-extrabold ${
                                  isDefault ? 'bg-white text-[#F97316]' : 'bg-black/20 text-white'
                                }`}
                              >
                                {isDefault ? '★' : 'o'}
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Display added custom ones */}
                      {formData.sizes.filter(s => !COMMON_SIZES.includes(s)).map(sz => {
                        const isDefault = formData.defaultSize === sz;
                        return (
                          <div 
                            key={sz} 
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 text-[#F97316] border border-orange-200 shadow-sm"
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleSize(sz)}
                              className="text-xs font-black uppercase block"
                            >
                              {sz}
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, defaultSize: sz })}
                              title="Set as default size"
                              className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-extrabold ${
                                isDefault ? 'bg-[#F97316] text-white' : 'bg-orange-250/20 text-[#F97316]'
                              }`}
                            >
                              {isDefault ? '★' : 'o'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Visual Gallery List with thumb ordering */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 block ml-2">
                      Product Images Gallery URLs <span className="text-[#F97316] italic">(Reorder and Preview)</span>
                    </label>

                    <div className="space-y-3">
                      {formData.images.map((url, index) => (
                        <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                          {/* Image preview thumbnail */}
                          <div className="w-14 h-14 bg-white rounded-lg border flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {url ? (
                              <img src={url} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }} />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-200" />
                            )}
                          </div>

                          {/* URL input */}
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => handleImageChange(index, e.target.value)}
                              className="w-full bg-white border-gray-250 border rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-[#F97316] text-xs font-bold text-gray-700"
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>

                          {/* Order actions */}
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveImageUp(index)}
                              className="p-2 hover:bg-white text-gray-400 hover:text-[#F97316] rounded-lg disabled:opacity-35 transition-all"
                              title="Move Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={index === formData.images.length - 1}
                              onClick={() => moveImageDown(index)}
                              className="p-2 hover:bg-white text-gray-400 hover:text-[#F97316] rounded-lg disabled:opacity-35 transition-all"
                              title="Move Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            {formData.images.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="p-2 hover:bg-white text-gray-400 hover:text-red-500 rounded-lg transition-all"
                                title="Remove Image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <button 
                        type="button" 
                        onClick={addImageField}
                        className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-gray-400 hover:border-[#F97316]/50 hover:text-[#F97316] transition-all"
                      >
                        + Expand Visual Array
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: User-side Product modal display configuration options */}
              {activeTab === 'config' && (
                <div className="space-y-6">
                  {/* Explanation card */}
                  <div className="p-6 bg-blue-50 text-blue-800 rounded-3xl border border-blue-100 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 mt-0.5 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-sm mb-1 uppercase tracking-wider">Interface Display Matrix</h4>
                      <p className="text-xs leading-relaxed text-blue-700 font-medium">Configure exactly which spec indicators dynamically render on the detail dialog card view to users on clicking this product. Checkboxes direct systems to show or hide segments.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                    {[
                      { field: 'showName', label: 'Item Header / Name', desc: 'Primary core title' },
                      { field: 'showRating', label: 'Score Ratings Stars', desc: 'Mock assessment panel' },
                      { field: 'showDescription', label: 'Spec Overviews details', desc: 'Hardware text block' },
                      { field: 'showPrice', label: 'Valuations Price values', desc: 'Prices & discounts' },
                      { field: 'showColors', label: 'Colors Picker Selector', desc: 'Varieties palette toggler' },
                      { field: 'showSizes', label: 'Variety Sizes Selection', desc: 'Custom pack sizing list' },
                      { field: 'showQuantity', label: 'Quantity Modifier Buttons', desc: 'Items count buttons' },
                      { field: 'showThumbnails', label: 'Sub-images Thumbnails list', desc: 'Gallery slides navigator' },
                      { field: 'showStock', label: 'Inventory Units marker', desc: 'Units capacity alerts' },
                      { field: 'showBrandBadge', label: 'Brand Tag Badge identifier', desc: 'Badge element' },
                      { field: 'showFeatures', label: 'Shipping Feature Badges', desc: 'Bottom left alerts' },
                      { field: 'showDeliveryInfo', label: 'Free Delivery instructions', desc: 'Bottom status warning banner' }
                    ].map(({ field, label, desc }) => {
                      const looksChecked = !!formData.modalConfig?.[field];
                      return (
                        <div 
                          key={field}
                          onClick={() => toggleModalConfigField(field)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                            looksChecked 
                              ? 'bg-[#F97316]/5 border-[#F97316] shadow-sm' 
                              : 'bg-white border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <p className="font-black text-gray-800 text-xs tracking-tight">{label}</p>
                            <p className="text-[9px] text-gray-400 font-extrabold uppercase italic">{desc}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            looksChecked ? 'bg-[#F97316] text-white' : 'bg-gray-100 text-transparent'
                          }`}>
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-8 flex items-center justify-end gap-3 mt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 rounded-xl font-black uppercase tracking-[3px] text-[10px] text-gray-400 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                >
                  Cancel Sync
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#F97316] text-white px-10 py-4 rounded-xl font-black uppercase tracking-[3px] text-[10px] shadow-xl hover:bg-orange-600 transition-all transform active:scale-95 disabled:opacity-75 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Commiting updates...
                    </>
                  ) : (
                    <>
                      Commit Registration
                      <Save className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;
