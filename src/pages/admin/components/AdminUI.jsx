import React from 'react';
import { TrendingUp } from 'lucide-react';

export const StatCard = ({ label, value, icon: Icon, color, darkMode }) => (
  <div className={`p-6 rounded-2xl shadow-sm border group hover:shadow-md transition-all ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} text-white shadow-lg transition-transform group-hover:scale-110`}>
        <Icon size={24} />
      </div>
      <TrendingUp size={20} className="text-green-500" />
    </div>
    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
    <h3 className={`text-2xl font-black mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{value}</h3>
  </div>
);

export const InputField = ({ label, value, onChange, type = "text", placeholder, required = false, disabled = false, darkMode }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium disabled:opacity-50 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:bg-gray-900' 
          : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-orange-500 focus:bg-white'
      }`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
