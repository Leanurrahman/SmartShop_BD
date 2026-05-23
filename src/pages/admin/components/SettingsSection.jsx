import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';
import { updateHomepageBanner } from '../../../services/adminService';
import { InputField } from './AdminUI';

const SettingsSection = ({ user, onUpdate }) => {
  const [bannerUrl, setBannerUrl] = useState('');

  const handleUpdateBanner = async () => {
    try {
      Swal.showLoading();
      await updateHomepageBanner(bannerUrl);
      Swal.fire('Success', 'Homepage banner updated', 'success');
      onUpdate();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-8">
      <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
        <h4 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <ImageIcon className="text-[#F97316]" /> Homepage Management
        </h4>
        <div className="space-y-4">
          <InputField label="Main Banner Image URL" value={bannerUrl} onChange={setBannerUrl} placeholder="https://..." />
          {bannerUrl && (
            <div className="rounded-xl overflow-hidden shadow-lg aspect-[21/9]">
              <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <button onClick={handleUpdateBanner} className="w-full bg-[#F97316] text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-100 transition-all hover:scale-[1.01]">Update Banner</button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
        <h4 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <UserPlus className="text-[#F97316]" /> Admin Profile
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputField label="Display Name" value={user?.displayName || 'Admin'} onChange={() => {}} disabled />
           <InputField label="Admin Email" value={user?.email || ''} onChange={() => {}} disabled />
           <p className="md:col-span-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
             Note: Personal info can only be updated through the main Profile settings for security reasons.
           </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsSection;
