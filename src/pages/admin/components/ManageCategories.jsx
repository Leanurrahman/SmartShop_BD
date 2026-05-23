import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Folder, FolderOpen, ArrowUp, ArrowDown, 
  Search, ArrowRight, RefreshCw, LayoutList, Database
} from 'lucide-react';
import Swal from 'sweetalert2';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '../../../services/adminService';
import { InputField } from './AdminUI';

const DEFAULT_CATEGORIES_TO_SEED = [
  { name: "Electronics", slug: "electronics", parentCategoryId: null, displayOrder: 1 },
  { name: "Fashion", slug: "fashion", parentCategoryId: null, displayOrder: 2 },
  { name: "Home & Living", slug: "home-living", parentCategoryId: null, displayOrder: 3 },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care", parentCategoryId: null, displayOrder: 4 },
  { name: "Sports & Outdoors", slug: "sports-outdoors", parentCategoryId: null, displayOrder: 5 },
  { name: "Groceries", slug: "groceries", parentCategoryId: null, displayOrder: 6 },
  { name: "Books & Stationery", slug: "books-stationery", parentCategoryId: null, displayOrder: 7 },
  { name: "Toys & Games", slug: "toys-games", parentCategoryId: null, displayOrder: 8 },
  { name: "Baby & Kids", slug: "baby-kids", parentCategoryId: null, displayOrder: 9 },
  { name: "Bike", slug: "bike", parentCategoryId: null, displayOrder: 10 }
];

const SEED_SUBCATEGORIES_FOR_FASHION = [
  { name: "Men", slug: "men", parentCategoryName: "Fashion", displayOrder: 1 },
  { name: "Women", slug: "women", parentCategoryName: "Fashion", displayOrder: 2 },
  { name: "Kids", slug: "kids", parentCategoryName: "Fashion", displayOrder: 3 }
];

const ManageCategories = ({ darkMode }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    id: '', 
    name: '',
    parentCategoryId: '',
    displayOrder: '1'
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({ id: '', name: '', parentCategoryId: '', displayOrder: '1' });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      Swal.fire({
        title: isEditing ? 'Updating...' : 'Creating...',
        didOpen: () => Swal.showLoading(),
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });

      const payload = {
        name: formData.name.trim(),
        parentCategoryId: formData.parentCategoryId || null,
        displayOrder: parseInt(formData.displayOrder || '1') || 1
      };

      if (isEditing) {
        await updateCategory(formData.id, payload);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Category successfully updated',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      } else {
        await addCategory(payload);
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Category successfully created',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      }

      handleResetForm();
      fetchCategories();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: error.message,
        confirmButtonColor: '#F97316',
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    }
  };

  const handleEdit = (cat) => {
    setFormData({
      id: cat.id,
      name: cat.name,
      parentCategoryId: cat.parentCategoryId || '',
      displayOrder: String(cat.displayOrder || '1')
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    const isParent = categories.some(c => c.parentCategoryId === id);
    let confirmText = `Are you sure you want to delete "${name}"?`;
    if (isParent) {
      confirmText += " Note: This category has sub-categories! Deleting this will orphan them.";
    }

    const res = await Swal.fire({
      title: 'Delete Category?',
      text: confirmText,
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
        await deleteCategory(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Category has been removed successfully.',
          icon: 'success',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
        fetchCategories();
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

  const handleSeedDefaults = async () => {
    const res = await Swal.fire({
      title: 'Seed Standard Categories?',
      text: "This will add the default 10 categories (Fashion, Electronics, Toys, Bike, etc.) and Fashion's subcategories (Men, Women, Kids) to your Firestore if they don't exist already.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Seed Database',
      background: darkMode ? '#111827' : '#fff',
      color: darkMode ? '#fff' : '#000',
    });

    if (res.isConfirmed) {
      try {
        Swal.fire({
          title: 'Seeding...',
          didOpen: () => Swal.showLoading(),
          background: darkMode ? '#111827' : '#fff',
        });

        // 1. Seed top categories
        const createdParentMap = {};

        for (const cat of DEFAULT_CATEGORIES_TO_SEED) {
          // Check if exists
          const exists = categories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());
          if (!exists) {
            const newId = await addCategory({
              name: cat.name,
              slug: cat.slug,
              parentCategoryId: null,
              displayOrder: cat.displayOrder
            });
            createdParentMap[cat.name] = newId;
          } else {
            createdParentMap[cat.name] = exists.id;
          }
        }

        // 2. Seed Fashion subcategories
        const fashionId = createdParentMap["Fashion"];
        if (fashionId) {
          for (const sub of SEED_SUBCATEGORIES_FOR_FASHION) {
            const subExists = categories.find(c => c.name.toLowerCase() === sub.name.toLowerCase() && c.parentCategoryId === fashionId);
            if (!subExists) {
              await addCategory({
                name: sub.name,
                slug: sub.slug,
                parentCategoryId: fashionId,
                displayOrder: sub.displayOrder
              });
            }
          }
        }

        Swal.fire({
          title: 'Seeded!',
          text: 'Default categories and subcategories have been successfully added!',
          icon: 'success',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });

        fetchCategories();
      } catch (error) {
        Swal.fire({
          title: 'Import Error',
          text: error.message,
          icon: 'error',
          background: darkMode ? '#111827' : '#fff',
        });
      }
    }
  };

  const handleAdjustOrder = async (cat, direction) => {
    try {
      const currentOrder = cat.displayOrder || 0;
      const targetOrder = direction === 'up' ? Math.max(1, currentOrder - 1) : currentOrder + 1;
      
      await updateCategory(cat.id, {
        name: cat.name,
        slug: cat.slug,
        parentCategoryId: cat.parentCategoryId || null,
        displayOrder: targetOrder
      });

      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  // Build Top Categories & Sub-categories filtering logic
  const parentCategories = categories.filter(c => !c.parentCategoryId);
  const getSubcategories = (parentId) => categories.filter(c => c.parentCategoryId === parentId);

  // Search filter
  const filteredParents = parentCategories.filter(cat => {
    const nameMatches = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const childMatches = getSubcategories(cat.id).some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return nameMatches || childMatches;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Category Management</h3>
          <p className="text-sm text-gray-400 mt-1">Design parent collections and nested sub-categories</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedDefaults}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              darkMode 
                ? 'bg-gray-800 border border-gray-700 text-[#F97316] hover:bg-gray-700' 
                : 'bg-orange-50 text-[#F97316] hover:bg-orange-100/80'
            }`}
          >
            <Database className="w-4 h-4" /> Seed Standard Layout
          </button>
          
          <button
            onClick={() => {
              if (showForm) {
                handleResetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider bg-[#F97316] text-white shadow-lg shadow-orange-500/10 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
          >
            {showForm ? 'Hide Form' : <><Plus className="w-4 h-4" /> Add Category</>}
          </button>
        </div>
      </div>

      {/* Editor Form */}
      {showForm && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className={`p-6 rounded-2xl border shadow-md transition-colors ${
            darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-orange-100'
          }`}
        >
          <h4 className={`text-lg font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {isEditing ? `Edit Category details` : "Create New Category or Subcategory"}
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <InputField 
              label="Collection Name" 
              placeholder="e.g. Baby & Kids" 
              value={formData.name} 
              onChange={v => setFormData({...formData, name: v})} 
              required 
              darkMode={darkMode} 
            />

            {/* Parent Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parent Category (Optional)</label>
              <select
                value={formData.parentCategoryId}
                onChange={(e) => setFormData({...formData, parentCategoryId: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-[#F97316]' 
                    : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#F97316]'
                }`}
              >
                <option value="">None (Top-Level Category)</option>
                {parentCategories
                  .filter(c => c.id !== formData.id) // Can't be parent of itself
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                }
              </select>
            </div>

            <InputField 
              label="Display Order (priority)" 
              type="number" 
              placeholder="1" 
              value={formData.displayOrder} 
              onChange={v => setFormData({...formData, displayOrder: v})} 
              required 
              darkMode={darkMode} 
            />

            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className={`px-5 py-3 text-xs font-bold rounded-xl transition-colors ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-250 text-gray-600'
                  }`}
                >
                  Cancel Edit
                </button>
              )}
              <button 
                type="submit"
                className="bg-[#F97316] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-orange-500/10 transition-all cursor-pointer"
              >
                {isEditing ? "Save Adjustments" : "Build Collection"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories Hierarchy Table Lists */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
        darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-orange-100'
      }`}>
        {/* Search Bar */}
        <div className={`p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4 ${
          darkMode ? 'border-gray-700 bg-gray-900/40' : 'border-orange-50 bg-[#FDFBF7]'
        }`}>
          <div className="flex items-center gap-2">
            <LayoutList className="w-5 h-5 text-[#F97316]" />
            <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Registered collections ({categories.length})
            </span>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter names..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full py-2 pl-9 pr-4 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#F97316] border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-white border-orange-100 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <RefreshCw className="w-10 h-10 text-[#F97316] animate-spin mb-4" />
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Syncing database collections...</p>
          </div>
        ) : filteredParents.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredParents.map((parent) => {
              const children = getSubcategories(parent.id);
              
              return (
                <div key={parent.id} className="p-4 sm:p-5 flex flex-col gap-3 hover:bg-orange-50/5 dark:hover:bg-white/5 transition-colors">
                  {/* Top Level Category Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100/70 dark:bg-orange-900/10 flex items-center justify-center text-[#F97316]">
                        {children.length > 0 ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                      </div>
                      <div>
                        <h5 className={`font-black text-sm tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {parent.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 font-mono">/{parent.slug}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-orange-100 text-[#F97316] font-bold rounded">
                            Order: {parent.displayOrder || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Priority Shifter */}
                      <button 
                        onClick={() => handleAdjustOrder(parent, 'up')}
                        title="Increase priority"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          darkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-400' : 'border-gray-100 hover:bg-gray-100 text-gray-500'
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleAdjustOrder(parent, 'down')}
                        title="Decrease priority"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          darkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-400' : 'border-gray-100 hover:bg-gray-100 text-gray-500'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Controls */}
                      <button 
                        onClick={() => handleEdit(parent)}
                        className={`p-1.5 rounded-lg border text-blue-500 hover:bg-blue-500/10 transition-colors ${
                          darkMode ? 'border-gray-700' : 'border-gray-100'
                        }`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(parent.id, parent.name)}
                        className={`p-1.5 rounded-lg border text-red-500 hover:bg-red-500/10 transition-colors ${
                          darkMode ? 'border-gray-700' : 'border-gray-100'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Children / Sub-categories List */}
                  {children.length > 0 && (
                    <div className="pl-12 flex flex-col gap-2.5">
                      {children.map((child) => (
                        <div 
                          key={child.id} 
                          className={`flex items-center justify-between p-3 rounded-xl border ${
                            darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50/50 border-orange-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                            <div>
                              <span className={`text-[12px] font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {child.name}
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono ml-2">/{child.slug}</span>
                            </div>
                            <span className="text-[8px] bg-gray-200 dark:bg-gray-800 text-gray-500 px-1 py-0.2 rounded font-bold">
                              Order: {child.displayOrder || 0}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => handleAdjustOrder(child, 'up')}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-neutral-500/10 rounded transition-colors"
                            >
                              <ArrowUp className="w-3" />
                            </button>
                            <button 
                              onClick={() => handleAdjustOrder(child, 'down')}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-neutral-500/10 rounded transition-colors"
                            >
                              <ArrowDown className="w-3" />
                            </button>
                            <button 
                              onClick={() => handleEdit(child)}
                              className="p-1 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(child.id, child.name)}
                              className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <LayoutList className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h5 className="font-bold text-sm">No Collections Registered</h5>
            <p className="text-xs text-gray-400 mt-2 max-w-sm">
              Use the builder above to customize your store hierarchy, or load our robust preset catalog instantly.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageCategories;
