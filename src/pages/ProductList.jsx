import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, SlidersHorizontal, Search as SearchIcon, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';
import SkeletonCard from '../components/SkeletonCard';
import PageTransition from '../components/PageTransition';
import AnimatedSection from '../components/AnimatedSection';
import { getAllProducts } from '../services/dbService';
import { useTheme } from '../context/ThemeContext';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const { isDarkMode } = useTheme();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || "",
    search: searchParams.get('search') || "",
    minPrice: 0,
    maxPrice: 100000,
    sort: "newest"
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products.filter(p => {
      const matchesCategory = (() => {
        if (!filters.category) return true;
        const target = filters.category.toLowerCase();
        const pCat = (p.category || "").toLowerCase();
        const pSub = (p.subcategory || "").toLowerCase();
        const pCats = (p.categories || []).map(c => c.toLowerCase());
        
        if (target === "fashion") {
          return pCat === "fashion" || 
                 pSub === "men" || pSub === "women" || pSub === "kids" || 
                 pCats.includes("fashion") || pCats.includes("men") || pCats.includes("women") || pCats.includes("kids");
        }
        
        return pCat === target || pSub === target || pCats.includes(target);
      })();
      
      const matchesSearch = (() => {
        if (!filters.search) return true;
        const queryClean = filters.search.toLowerCase().trim();
        if (!queryClean) return true;

        const pName = (p.name || "").toLowerCase();
        const pDesc = (p.description || "").toLowerCase();
        const pBrand = (p.brand || "").toLowerCase();
        const pCat = (p.category || "").toLowerCase();
        const pSub = (p.subcategory || "").toLowerCase();

        // 1. Direct includes matches on any of the core text fields
        if (
          pName.includes(queryClean) ||
          pDesc.includes(queryClean) ||
          pBrand.includes(queryClean) ||
          pCat.includes(queryClean) ||
          pSub.includes(queryClean)
        ) {
          return true;
        }

        // 2. Keyword matching: split query into individual words and find partial matches
        const queryWords = queryClean.split(/[\s,\-\:\.\+\/]+/).filter(w => w.length > 1);
        if (queryWords.length > 0) {
          // If any keywords are found in name, brand, category, subcategory, or description, return true
          return queryWords.some(word => 
            pName.includes(word) || 
            pBrand.includes(word) || 
            pCat.includes(word) || 
            pSub.includes(word) ||
            pDesc.includes(word)
          );
        }

        return false;
      })();
      const matchesPrice = p.price <= filters.maxPrice;
      return matchesCategory && matchesSearch && matchesPrice;
    });

    // Sorting
    if (filters.sort === 'price-low') result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (filters.sort === 'price-high') result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (filters.sort === 'popular') result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    
    setFilteredProducts(result);
  }, [filters, products]);

  // Update filters when search params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || "",
      search: searchParams.get('search') || ""
    }));
  }, [searchParams]);

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 glass-panel p-10 shadow-2xl ${isDarkMode ? 'border-white/10' : 'border-orange-100 bg-white'}`}>
            <div>
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[3px] text-xs mb-3">
                <Sparkles className="w-4 h-4" /> Smart Selection
              </div>
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
                {filters.category || (filters.search ? `Results for "${filters.search}"` : "All Collection")}
              </h1>
              <p className={`text-sm mt-3 font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Curating {filteredProducts.length} high-performance items</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className={`hidden sm:flex glass-panel p-1 ${isDarkMode ? 'border-white/10' : 'border-orange-100 bg-orange-50/50'}`}>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white orange-shadow' : (isDarkMode ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-650')}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-2xl transition-all ${viewMode === 'list' ? 'bg-primary text-white orange-shadow' : (isDarkMode ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-650')}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-3 bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest orange-shadow"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <CategorySidebar 
              filters={filters} 
              setFilters={setFilters} 
              isOpen={isFilterOpen} 
              onClose={() => setIsFilterOpen(false)} 
            />

            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                  layout
                  className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((p) => (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard product={p} viewMode={viewMode} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                   <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                     <SearchIcon className="w-10 h-10 text-gray-300" />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
                   <p className="text-gray-400 max-w-xs">We couldn't find any products matching your current filters.</p>
                   <button 
                    onClick={() => setFilters({ category: "", search: "", minPrice: 0, maxPrice: 100000, sort: "newest" })}
                    className="mt-8 text-primary font-bold hover:underline"
                   >
                     Clear all filters
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default ProductList;
