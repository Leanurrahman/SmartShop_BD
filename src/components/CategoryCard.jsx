import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useTheme } from '../context/ThemeContext';

const CategoryCard = ({ category }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Link to={`/products?category=${category.name}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className={`glass-panel p-8 flex flex-col items-center justify-center text-center gap-4 transition-all cursor-pointer group shadow-xl ${isDarkMode ? 'border-white/10 hover:shadow-primary/20' : 'border-orange-50 hover:shadow-orange-100 hover:bg-white'}`}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-all duration-500">
          <div className="text-primary group-hover:text-white transition-colors duration-500">
            {category.icon}
          </div>
        </div>
        <div>
          <h4 className={`font-bold text-lg tracking-tight group-hover:text-primary transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{category.name}</h4>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{category.itemCount || '1.2k'} Products</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
