import React from 'react';
import { X, Filter } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';

const FilterSidebar = ({ filters, setFilters, onClose, isOpen }) => {
  const { isDarkMode } = useTheme();

  const handleCategoryChange = (cat) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === cat ? "" : cat
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

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed lg:sticky top-0 lg:top-40 left-0 h-full lg:h-fit w-[300px] glass-panel z-[101] lg:z-10 p-8 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'border-white/10' : 'border-orange-100'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <h3 className={`font-black tracking-tight text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
          </div>
          <button onClick={onClose} className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/15' : 'hover:bg-gray-100'}`}>
            <X className={`w-6 h-6 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <h4 className="text-[10px] font-black uppercase tracking-[2.5px] text-primary mb-6">Expertise</h4>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-left px-5 py-3 rounded-2xl text-sm font-bold tracking-tight transition-all ${
                  filters.category === cat 
                  ? 'bg-primary text-white orange-shadow scale-105' 
                  : isDarkMode 
                    ? 'text-white/40 hover:text-white hover:bg-white/5' 
                    : 'text-gray-500 hover:text-primary hover:bg-orange-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-10">
          <h4 className="text-[10px] font-black uppercase tracking-[2.5px] text-primary mb-6">Budget Ceiling</h4>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className={`w-full accent-primary h-1.5 rounded-full appearance-none cursor-pointer ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}
          />
          <div className="flex justify-between mt-4">
            <span className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Base</span>
            <span className="text-sm font-black text-primary italic">৳ {filters.maxPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Sorting */}
        <div className="mb-10">
           <h4 className="text-[10px] font-black uppercase tracking-[2.5px] text-primary mb-6">Algorithm</h4>
           <div className={`glass-panel p-1 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-orange-100 bg-white'}`}>
             <select 
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className={`w-full p-3 bg-transparent text-sm font-bold focus:outline-none appearance-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
             >
                <option value="newest" className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Fresh Arrivals</option>
                <option value="price-low" className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Value Priority</option>
                <option value="price-high" className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Premium Tier</option>
                <option value="popular" className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>Popular Match</option>
             </select>
           </div>
        </div>

        <button 
          onClick={clearFilters}
          className={`w-full py-4 glass-panel text-xs font-black uppercase tracking-widest transition-all transform active:scale-95 ${
            isDarkMode 
              ? 'border-white/10 bg-white/5 text-white/60 hover:text-white' 
              : 'border-orange-150 bg-orange-50 text-gray-600 hover:text-primary hover:bg-orange-100'
          }`}
        >
          Reset Config
        </button>
      </div>
    </>
  );
};

export default FilterSidebar;
