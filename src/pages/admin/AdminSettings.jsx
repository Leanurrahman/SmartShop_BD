import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Image as ImageIcon, 
  Bell, 
  Shield, 
  Save, 
  Loader2, 
  Cloud,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Database,
  Lock,
  Mail,
  Camera
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const AdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Registry Sync Complete',
        text: 'Administrative configurations updated successfully.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    }, 1500);
  };

  const tabs = [
    { id: 'profile', label: 'Admin Identity', icon: User },
    { id: 'visuals', label: 'Display Matrix', icon: ImageIcon },
    { id: 'security', label: 'Security Protocols', icon: Shield },
    { id: 'system', label: 'Core Engine', icon: Monitor },
  ];

  return (
    <AdminLayout>
       <div className="space-y-8 pb-20">
         {/* Top Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h2 className="text-4xl font-black tracking-tighter text-gray-900 leading-none italic uppercase">
                 Engine <span className="text-primary underline decoration-primary/20 underline-offset-8">Metrics</span>
               </h2>
               <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4">Localizing administrative parameters</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[3px] text-xs flex items-center gap-3 shadow-xl orange-shadow hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
              Commit Changes
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
               {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] font-bold text-sm transition-all ${
                        activeTab === tab.id 
                          ? 'bg-white text-primary shadow-sm border-l-4 border-primary' 
                          : 'text-gray-400 hover:bg-white/50 hover:text-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {tab.label}
                    </button>
                  );
               })}
               
               <div className="mt-8 p-6 bg-orange-600 rounded-[2.5rem] text-white relative overflow-hidden shadow-lg orange-shadow group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                     <Cloud className="w-32 h-32" />
                  </div>
                  <h4 className="font-black italic text-lg mb-2 relative z-10 leading-tight">Cloud Sync<br/>Service</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 relative z-10 mb-4 whitespace-nowrap">Status: Operational</p>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative z-10">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        className="h-full bg-white shadow-[0_0_10px_#fff]"
                     ></motion.div>
                  </div>
               </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-8">
               <motion.div 
                 key={activeTab}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm"
               >
                  {activeTab === 'profile' && (
                    <div className="space-y-10">
                       <div className="flex flex-col md:flex-row gap-10 items-start">
                          <div className="relative group">
                             <div className="w-40 h-40 rounded-[3rem] bg-orange-100 border-4 border-white shadow-xl flex items-center justify-center text-primary text-5xl font-black">
                                {user?.email?.charAt(0).toUpperCase()}
                             </div>
                             <button className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-all active:scale-95">
                                <Camera className="w-5 h-5" />
                             </button>
                          </div>
                          <div className="flex-1 space-y-6 w-full">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Registry Name</label>
                                  <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                                    <input
                                      type="text"
                                      defaultValue="Lead Administrator"
                                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary transition-all font-bold"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Monitor Email</label>
                                  <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                                    <input
                                      type="email"
                                      readOnly
                                      value={user?.email}
                                      className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-14 pr-6 focus:outline-none font-bold text-gray-500 cursor-not-allowed"
                                    />
                                  </div>
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Administrative Role Key</label>
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <Shield className="w-5 h-5 text-primary" />
                                      <span className="font-black text-gray-900 uppercase tracking-widest text-sm italic">Master Node Access</span>
                                   </div>
                                   <span className="bg-primary text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Permanent</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-8">
                       <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex items-start gap-5">
                          <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                             <AlertCircle className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-black text-red-900 tracking-tight leading-none mb-2">High Privilege Zone</h4>
                             <p className="text-xs font-bold text-red-600 uppercase tracking-widest leading-relaxed">Adjusting these values may cause system de-alignment. Proceed with caution.</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">System Access Code</label>
                             <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input
                                  type="password"
                                  placeholder="Update access key..."
                                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary transition-all font-bold"
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Token Re-Validation</label>
                             <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input
                                  type="password"
                                  placeholder="Confirm new key..."
                                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary transition-all font-bold"
                                />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                             <div>
                                <h5 className="font-black text-gray-900 tracking-tight leading-none mb-1">Two-Factor Pulse</h5>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Enhanced biometric validation</p>
                             </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                             </label>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'system' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                           <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group">
                              <Database className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-200 group-hover:text-primary/10 transition-colors" />
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Cloud Storage</h5>
                              <p className="text-3xl font-black text-gray-900 tracking-tighter">8.4 / 20 GB</p>
                              <div className="mt-4 w-full h-1.5 bg-gray-200 rounded-full">
                                 <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '42%' }}></div>
                              </div>
                           </div>
                           <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group">
                              <Bell className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-200 group-hover:text-primary/10 transition-colors" />
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Registry Traffic</h5>
                              <p className="text-3xl font-black text-gray-900 tracking-tighter">342 ms</p>
                              <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-1 italic">Optimal Latency</p>
                           </div>
                       </div>

                       <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white">
                          <h5 className="text-sm font-black uppercase tracking-[3px] text-primary mb-6 italic">Terminal Logs</h5>
                          <div className="font-mono text-[11px] space-y-2 opacity-80 overflow-hidden">
                             <p className="text-green-400">{`[ ${new Date().toISOString()} ] Node authorization successful.`}</p>
                             <p className="text-blue-400">{`[ ${new Date().toISOString()} ] Inventory re-alignment triggered.`}</p>
                             <p className="text-white/40">{`[ ${new Date().toISOString()} ] Heartbeat check... Pulse detected.`}</p>
                             <p className="text-orange-400">{`[ ${new Date().toISOString()} ] Warning: Latency spike detected in /api/transactions.`}</p>
                             <p className="text-white/40">{`[ ${new Date().toISOString()} ] System recovery starting.`}</p>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'visuals' && (
                    <div className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <h5 className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-2">Homepage Master Banner</h5>
                             <div className="aspect-[21/9] bg-gray-100 rounded-[2rem] relative overflow-hidden border-2 border-dashed border-gray-200 group flex items-center justify-center">
                                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Banner" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                   <button className="bg-white/90 p-4 rounded-2xl text-primary shadow-xl scale-90 group-hover:scale-100 transition-all active:scale-95">
                                      <Upload className="w-6 h-6" />
                                   </button>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-gray-500 italic text-center px-6">Optimal dimension: 1920x800px. Max payload: 2MB.</p>
                          </div>
                          
                          <div className="space-y-8">
                             <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-6 border border-gray-100">
                                <div>
                                   <h6 className="font-black text-gray-900 tracking-tight leading-none mb-1">Color Interface</h6>
                                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Global UI primary vector</p>
                                </div>
                                <div className="flex gap-4">
                                   {['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#141414'].map((color) => (
                                     <button 
                                        key={color} 
                                        className={`w-10 h-10 rounded-xl shadow-lg border-4 border-white transition-all active:scale-90 ${color === '#F97316' ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-110'}`} 
                                        style={{ backgroundColor: color }}
                                     ></button>
                                   ))}
                                </div>
                             </div>
                             
                             <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group">
                                <div>
                                   <h6 className="font-black text-gray-900 tracking-tight leading-none mb-1">Grid Overlay</h6>
                                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Product scannability metrics</p>
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-black text-gray-400">Cozy</span>
                                   <div className="w-12 h-6 bg-primary/20 rounded-full relative p-1 cursor-pointer">
                                      <div className="w-4 h-4 bg-primary rounded-full absolute right-1"></div>
                                   </div>
                                   <span className="text-[10px] font-black text-primary italic">Dense</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
               </motion.div>
            </div>
         </div>
       </div>
    </AdminLayout>
  );
};

export default AdminSettings;

const Upload = ({ className, ...props }) => <motion.svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></motion.svg>;
