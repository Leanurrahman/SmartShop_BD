import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ className }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${query.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative group ${className}`}>
      <div className="glass-panel p-2 flex items-center shadow-2xl border-white/10 dark:border-gray-800 bg-white/80 dark:bg-white/5 backdrop-blur-3xl">
        <div className="pl-4 text-primary">
          <Search className="w-6 h-6" />
        </div>
        <input
          type="text"
          placeholder="Search for electronics, fashion, and more..."
          className="w-full bg-transparent border-none px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold orange-shadow hover:bg-primary-dark transition-all transform active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
