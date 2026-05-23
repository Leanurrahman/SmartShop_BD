import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import { saveSupportMessage } from '../../services/adminService';
import { useTheme } from '../../context/ThemeContext';

const ContactUs = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'All fields are mandatory.',
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
      return;
    }

    setLoading(true);
    try {
      await saveSupportMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      Swal.fire({
        icon: 'success',
        title: 'Message Transmitted!',
        text: 'Thank you for reaching out. Our support squad will contact you shortly.',
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });

      // Clear Form state
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.message || 'Something went wrong',
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-8"
    >
      {/* Contact Information panels */}
      <div className="lg:col-span-2 space-y-6">
        <div className={`p-6 rounded-[2rem] border ${
          isDarkMode ? 'bg-gray-950/80 border-white/10' : 'bg-[#FFFDF9] border-orange-100'
        }`}>
          <h3 className="text-sm font-black uppercase tracking-[2px] text-[#F97316] mb-6">Direct Line</h3>
          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            Need immediate support? Feel free to contact our local support desk from Saturday through Thursday.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#F97316]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Call Center</p>
                <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>+880 1234 567 890</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#F97316]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Query</p>
                <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>support@smartshopbd.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#F97316]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Headquarters</p>
                <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>House 42, Sector 3, Uttara, Dhaka</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Form Panel */}
      <div className={`lg:col-span-3 p-6 sm:p-8 rounded-[2rem] border ${
        isDarkMode ? 'bg-gray-950/80 border-white/10' : 'bg-white border-orange-100 shadow-[0_15px_35px_-15px_rgba(249,115,22,0.1)]'
      }`}>
        <h3 className="text-sm font-black uppercase tracking-[2px] text-[#F97316] mb-6">Send an Inquiry</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Tanvir Rahman"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold border outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-gray-900 border-white/10 text-white focus:border-[#F97316]' 
                    : 'bg-orange-50/20 border-orange-100/70 text-gray-805 focus:border-[#F97316]'
                }`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Email Address</label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold border outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-gray-900 border-white/10 text-white focus:border-[#F97316]' 
                    : 'bg-orange-50/20 border-orange-100/70 text-gray-805 focus:border-[#F97316]'
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Subject</label>
            <input
              type="text"
              placeholder="How can we help you?"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold border outline-none transition-all ${
                isDarkMode 
                  ? 'bg-gray-900 border-white/10 text-white focus:border-[#F97316]' 
                  : 'bg-orange-50/20 border-orange-100/70 text-gray-805 focus:border-[#F97316]'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Message Text</label>
            <textarea
              rows={5}
              placeholder="Describe your issue detailed..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl text-xs font-semibold border outline-none transition-all resize-none ${
                isDarkMode 
                  ? 'bg-gray-900 border-white/10 text-white focus:border-[#F97316]' 
                  : 'bg-orange-50/20 border-orange-100/70 text-gray-805 focus:border-[#F97316]'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-[#F97316] hover:bg-orange-600 shadow-lg shadow-orange-500/10'
            }`}
          >
            {loading ? 'Submitting...' : <><Send className="w-3.5 h-3.5" /> Submit Inquiry</>}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactUs;
