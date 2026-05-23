import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Filter, Search, ChevronDown, ChevronRight, 
  Tag, Shirt, Cpu, Home, Sparkles, BookOpen, 
  Gamepad, Baby, Bike, ShoppingBag, ListChecks
} from 'lucide-react';
import { getCategories } from '../services/adminService';
import { getAllProducts } from '../services/dbService';
import { useTheme } from '../context/ThemeContext';

// Default categories to fallback on / seed
const DEFAULT_CATEGORIES = [
  { id: "def-electronics", name: "Electronics", slug: "electronics", parentCategoryId: null, displayOrder: 1 },
  { id: "def-fashion", name: "Fashion", slug: "fashion", parentCategoryId: null, displayOrder: 2 },
  { id: "def-fashion-men", name: "Men", slug: "men", parentCategoryId: "def-fashion", displayOrder: 1 },
  { id: "def-fashion-women", name: "Women", slug: "women", parentCategoryId: "def-fashion", displayOrder: 2 },
  { id: "def-fashion-kids", name: "Kids", slug: "kids", parentCategoryId: "def-fashion", displayOrder: 3 },
  { id: "def-home", name: "Home & Living", slug: "home-living", parentCategoryId: null, displayOrder: 3 },
  { id: "def-beauty", name: "Beauty & Personal Care", slug: "beauty-personal-care", parentCategoryId: null, displayOrder: 4 },
  { id: "def-sports", name: "Sports & Outdoors", slug: "sports-outdoors", parentCategoryId: null, displayOrder: 5 },
  { id: "def-groceries", name: "Groceries", slug: "groceries", parentCategoryId: null, displayOrder: 6 },
  { id: "def-books", name: "Books & Stationery", slug: "books-stationery", parentCategoryId: null, displayOrder: 7 },
  { id: "def-toys", name: "Toys & Games", slug: "toys-games", parentCategoryId: null, displayOrder: 8 },
  { id: "def-baby", name: "Baby & Kids", slug: "baby-kids", parentCategoryId: null, displayOrder: 9 },
  { id: "def-bike", name: "Bike", slug: "bike", parentCategoryId: null, displayOrder: 10 }
];

// Icon mapping helper
const getCategoryIcon = (name) => {
  const norm = name.toLowerCase();
  if (norm.includes('fash') || norm.includes('men') || norm.includes('women') || norm.includes('kids')) return <Shirt className="w-4 h-4" />;
  if (norm.includes('elect') || norm.includes('tech') || norm.includes('phone')) return <Cpu className="w-4 h-4" />;
  if (norm.includes('home') || norm.includes('living')) return <Home className="w-4 h-4" />;
  if (norm.includes('beauty') || norm.includes('care') || norm.includes('cosm')) return <Sparkles className="w-4 h-4" />;
  if (norm.includes('sports') || norm.includes('outdoor')) return <ListChecks className="w-4 h-4" />;
  if (norm.includes('groc') || norm.includes('food')) return <ShoppingBag className="w-4 h-4" />;
  if (norm.includes('book') || norm.includes('station')) return <BookOpen className="w-4 h-4" />;
  if (norm.includes('toy') || norm.includes('game')) return <Gamepad className="w-4 h-4" />;
  if (norm.includes('baby') || norm.includes('child')) return <Baby className="w-4 h-4" />;
  if (norm.includes('bike') || norm.includes('cycle')) return <Bike className="w-4 h-4" />;
  return <Tag className="w-4 h-4" />;
};

const CategorySidebar = ({ filters, setFilters, onClose, isOpen }) => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    // Load categories from Firestore with a fallback to default categories
    const loadData = async () => {
      try {
        const firestoreCats = await getCategories();
        if (firestoreCats && firestoreCats.length > 0) {
          setCategories(firestoreCats);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.error("Error loading categories in CategorySidebar, using offline defaults:", err);
        setCategories(DEFAULT_CATEGORIES);
      }

      try {
        const allProducts = await getAllProducts();
        if (allProducts) {
          setProducts(allProducts);
        }
      } catch (err) {
        console.error("Error loading products for counts:", err);
      }
    };

    loadData();
  }, []);

  // Set default expansion for categories with subcategories (e.g. Fashion)
  useEffect(() => {
    if (categories.length > 0) {
      const parentCatsWithSub = categories.filter(c => !c.parentCategoryId && categories.some(sub => sub.parentCategoryId === c.id));
      const initialExp = {};
      parentCatsWithSub.forEach(c => {
        // Expand Fashion by default
        if (c.name.toLowerCase() === 'fashion' || c.name.toLowerCase().includes('clothing')) {
          initialExp[c.id] = true;
        }
      });
      setExpandedCategories(prev => ({ ...initialExp, ...prev }));
    }
  }, [categories]);

  // Compute product counts for each category name
  const getProductCount = (categoryName, isSub = false) => {
    if (!products || products.length === 0) return 0;
    const lowerName = categoryName.toLowerCase();
    return products.filter(p => {
      const pCat = (p.category || "").toLowerCase();
      const pSub = (p.subcategory || "").toLowerCase();
      const pCats = (p.categories || []).map(c => c.toLowerCase());
      
      if (isSub) {
        return pSub === lowerName || pCat === lowerName || pCats.includes(lowerName);
      } else {
        // For parent categories, we match either direct matches or subcategories linked to this parent
        const isFashion = lowerName === "fashion";
        if (isFashion) {
          return pCat === "fashion" || pSub === "men" || pSub === "women" || pSub === "kids" || pCats.includes("fashion") || pCats.includes("men") || pCats.includes("women") || pCats.includes("kids");
        }
        return pCat === lowerName || pCats.includes(lowerName);
      }
    }).length;
  };

  const toggleExpand = (catId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleCategorySelect = (categoryName) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categoryName ? "" : categoryName
    }));
  };

  const handlePriceChange = (e) => {
    setFilters(prev => ({
      ...prev,
      maxPrice: parseInt(e.target.value) || 100000
    }));
  };

  const clearFilters = () => {
    setFilters({ category: "", minPrice: 0, maxPrice: 100000, sort: "newest" });
  };

  // Build category hierarchy
  const parentCategories = categories.filter(c => !c.parentCategoryId);
  const getSubcategories = (parentId) => categories.filter(c => c.parentCategoryId === parentId);

  // Filter top-level categories based on category search
  const filteredParents = parentCategories.filter(cat => {
    const mainMatch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const subMatch = getSubcategories(cat.id).some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return mainMatch || subMatch;
  });

  return (
    <>
      {/* Drawer Overlay for Mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[100] transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Main Sidebar Panel */}
      <div className={`fixed lg:sticky top-0 lg:top-40 left-0 h-full lg:h-fit w-[320px] lg:w-[290px] z-[101] lg:z-10 p-6 flex flex-col gap-6 transition-transform duration-300 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isDarkMode 
          ? 'bg-gray-900/95 border-r border-white/10 lg:bg-transparent lg:border-none lg:p-0' 
          : 'bg-white border-r border-orange-100 lg:bg-transparent lg:border-none lg:p-0'
      }`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between lg:mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
              <Filter className="w-4 h-4 text-[#F97316]" />
            </div>
            <h3 className={`font-black tracking-tight text-lg ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>Product Navigator</h3>
          </div>
          <button 
            onClick={onClose} 
            className={`lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-white/65' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Categories Search Enhancement */}
        <div className="relative">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-2.5 pl-10 pr-4 text-xs font-bold rounded-2xl border transition-all focus:ring-2 focus:ring-[#F97316] ${
              isDarkMode 
                ? 'bg-gray-800/80 border-white/10 text-white placeholder-white/30' 
                : 'bg-orange-50/30 border-orange-100 text-gray-800 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Filter Categories Widget */}
        <div className={`p-5 rounded-[2rem] border ${
          isDarkMode ? 'bg-gray-950/80 border-white/10' : 'bg-white border-orange-100 shadow-[0_10px_30px_-15px_rgba(249,115,22,0.1)]'
        }`}>
          <h4 className="text-[10px] font-black uppercase tracking-[2px] text-[#F97316] mb-4">Categories</h4>
          
          <div className="flex flex-col gap-1.5 max-h-[350px] overflow-y-auto pr-1">
            {filteredParents.map((cat) => {
              const subs = getSubcategories(cat.id);
              const hasSubs = subs.length > 0;
              const isExpanded = !!expandedCategories[cat.id];
              const isActive = filters.category === cat.name;
              
              return (
                <div key={cat.id} className="flex flex-col">
                  {/* Category Option */}
                  <div 
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                      isActive 
                        ? 'bg-[#F97316] text-white shadow-md' 
                        : isDarkMode 
                          ? 'text-white/60 hover:text-white hover:bg-white/5' 
                          : 'text-gray-600 hover:text-[#F97316] hover:bg-orange-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {getCategoryIcon(cat.name)}
                      <span>{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* Product count badge */}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : isDarkMode 
                            ? 'bg-gray-850 text-white/50' 
                            : 'bg-orange-50 text-[#F97316]'
                      }`}>
                        {getProductCount(cat.name)}
                      </span>

                      {/* Expand Button for sub-category */}
                      {hasSubs && (
                        <button 
                          onClick={(e) => toggleExpand(cat.id, e)}
                          className={`p-1 rounded-lg hover:bg-neutral-500/10 transition-colors ${
                            isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-650'
                          }`}
                        >
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Subcategories with Framer Motion */}
                  <AnimatePresence initial={false}>
                    {hasSubs && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-7 flex flex-col gap-1 mt-1 border-l border-orange-100/40 dark:border-white/5 ml-5"
                      >
                        {subs.map(sub => {
                          const isSubActive = filters.category === sub.name;
                          return (
                            <div
                              key={sub.id}
                              onClick={() => handleCategorySelect(sub.name)}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                isSubActive 
                                  ? 'bg-[#F97316]/10 text-[#F97316]' 
                                  : isDarkMode 
                                    ? 'text-white/40 hover:text-white' 
                                    : 'text-gray-500 hover:text-[#F97316]'
                              }`}
                            >
                              <span>{sub.name}</span>
                              <span className={`text-[8px] font-black italic px-1 rounded ${
                                isSubActive 
                                  ? 'bg-[#F97316]/20' 
                                  : isDarkMode 
                                    ? 'bg-gray-800 text-white/30' 
                                    : 'bg-gray-100 text-gray-400'
                              }`}>
                                {getProductCount(sub.name, true)}
                              </span>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredParents.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-xs font-bold">
                No matching Category
              </div>
            )}
          </div>
        </div>

        {/* Budget Ceiling Range Filter */}
        <div className={`p-5 rounded-[2rem] border ${
          isDarkMode ? 'bg-gray-950/80 border-white/10' : 'bg-white border-orange-100 shadow-[0_10px_30px_-15px_rgba(249,115,22,0.1)]'
        }`}>
          <h4 className="text-[10px] font-black uppercase tracking-[2px] text-[#F97316] mb-4">Budget Ceiling</h4>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className={`w-full accent-[#F97316] h-1.5 rounded-full appearance-none cursor-pointer ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}
          />
          <div className="flex justify-between mt-3 font-bold text-xs">
            <span className={isDarkMode ? 'text-white/20' : 'text-gray-400'}>Min</span>
            <span className="text-[#F97316] italic">৳ {filters.maxPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Algorithm Sort Selector */}
        <div className={`p-5 rounded-[2rem] border ${
          isDarkMode ? 'bg-gray-950/80 border-white/10' : 'bg-white border-orange-100 shadow-[0_10px_30px_-15px_rgba(249,115,22,0.1)]'
        }`}>
          <h4 className="text-[10px] font-black uppercase tracking-[2px] text-[#F97316] mb-4">Sort Priority</h4>
          <div className={`p-1 rounded-xl border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-orange-100 bg-white'}`}>
            <select 
              value={filters.sort || "newest"}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className={`w-full p-2 bg-transparent text-xs font-bold focus:outline-none appearance-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            >
              <option value="newest" className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Fresh Arrivals</option>
              <option value="price-low" className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Value Price: Low to High</option>
              <option value="price-high" className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Premium: High to Low</option>
              <option value="popular" className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Popular Match</option>
            </select>
          </div>
        </div>

        {/* Reset Configuration */}
        <button 
          onClick={clearFilters}
          className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all transform active:scale-95 ${
            isDarkMode 
              ? 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10' 
              : 'bg-orange-50 border border-orange-150 text-gray-600 hover:text-[#F97316] hover:bg-orange-100'
          }`}
        >
          Reset Filters
        </button>
      </div>
    </>
  );
};

export default CategorySidebar;
