import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Bell, 
  LogOut, 
  Camera, 
  Shield, 
  ChevronRight,
  Edit2,
  Upload,
  X,
  Check,
  Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { notifications } = useNotifications();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  const fileInputRef = React.useRef(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || "");
  const [isSaving, setIsSaving] = useState(false);

  const presetAvatars = [
    { id: 'av1', name: 'Aesthetic Orange', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { id: 'av2', name: 'Cool Glasses', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { id: 'av3', name: 'Bearded Techie', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80' },
    { id: 'av4', name: 'Summer Vibes', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
    { id: 'av5', name: 'Urban Look', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
    { id: 'av6', name: 'Aesthetic Studio', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
    { id: 'av7', name: 'Smart Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
    { id: 'av8', name: 'Vintage Shades', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=80' },
  ];

  const openEditModal = () => {
    setNewName(user?.displayName || "");
    setSelectedAvatar(user?.photoURL || "");
    setIsGalleryOpen(true);
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Please select an image smaller than 2MB for optimized performance.',
        icon: 'error',
        confirmButtonColor: '#FF9900'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedAvatar(reader.result);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Custom Photo loaded! Click "Save Profile" below to persist changes.',
        showConfirmButton: false,
        timer: 3000
      });
    };
    reader.readAsDataURL(file);
  };

  const saveProfileUpdates = async () => {
    if (!newName.trim()) {
      Swal.fire({
        title: 'Name Required',
        text: 'Please provide a display name.',
        icon: 'warning',
        confirmButtonColor: '#FF9900'
      });
      return;
    }
    setIsSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({
          displayName: newName,
          photoURL: selectedAvatar
        });
      }
      Swal.fire({
        title: 'Profile Saved!',
        text: 'Your profile has been successfully updated.',
        icon: 'success',
        confirmButtonColor: '#FF9900'
      });
      setIsGalleryOpen(false);
    } catch (error) {
      Swal.fire({
        title: 'Error Saving',
        text: error.message || 'Something went wrong while updating profile info.',
        icon: 'error',
        confirmButtonColor: '#FF9900'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    const res = await Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      confirmButtonColor: '#FF9900'
    });
    if (res.isConfirmed) {
      await logout();
      window.location.href = "/";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package, link: "/orders" },
    { id: "wishlist", label: "Wishlist", icon: Heart, link: "/wishlist" },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
               <div className={`glass-panel p-6 shadow-2xl text-center rounded-[3rem] ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'}`}>
                  <div className="relative inline-block mb-8 cursor-pointer group" onClick={openEditModal}>
                     <div className={`w-32 h-32 glass-panel rounded-[2.5rem] flex items-center justify-center overflow-hidden p-2 shadow-[0_0_50px_rgba(255,153,0,0.2)] transition-all group-hover:scale-105 duration-300 ${
                       isDarkMode ? 'border-primary/20 bg-primary/5' : 'border-orange-200 bg-orange-50'
                     }`}>
                       {user?.photoURL ? (
                         <img src={user.photoURL} className="w-full h-full object-cover rounded-3xl" alt="profile" />
                       ) : (
                         <User className="w-16 h-16 text-primary/40" />
                       )}
                     </div>
                     <button className={`absolute -bottom-2 -right-2 w-10 h-10 glass-panel text-white flex items-center justify-center rounded-xl hover:scale-110 transition-transform orange-shadow bg-primary ${
                       isDarkMode ? 'border-white/20' : 'border-orange-200'
                     }`}>
                       <Camera className="w-5 h-5" />
                     </button>
                  </div>
                  <h3 className={`text-2xl font-black italic tracking-tight mb-2 line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>{user?.displayName || 'User'}</h3>
                  <p className={`text-[9px] font-black tracking-[3px] uppercase mb-8 truncate px-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>{user?.email}</p>
                  
                  <div className="flex flex-col gap-3">
                     {tabs.map((tab) => (
                        tab.link ? (
                           <Link 
                             key={tab.id}
                             to={tab.link}
                             className={`flex items-center justify-between px-4 py-4 rounded-[1.5rem] glass-panel transition-all group ${
                               isDarkMode 
                                 ? 'border-white/5 bg-white/5 hover:border-primary/30 text-white/80' 
                                 : 'border-orange-100/50 bg-gray-50/50 hover:border-primary/30 hover:bg-orange-50/20 text-gray-700'
                             }`}
                           >
                             <div className="flex items-center gap-3 min-w-0">
                               <tab.icon className={`w-5 h-5 shrink-0 transition-colors ${
                                 isDarkMode ? 'text-white/20 group-hover:text-primary' : 'text-gray-400 group-hover:text-primary'
                               }`} />
                               <span className="text-[10px] font-black uppercase tracking-[1px] truncate">{tab.label}</span>
                             </div>
                             <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                               isDarkMode ? 'text-white/10 group-hover:text-primary' : 'text-gray-300 group-hover:text-primary'
                             }`} />
                           </Link>
                        ) : (
                           <button 
                             key={tab.id}
                             onClick={() => setActiveTab(tab.id)}
                             className={`flex items-center justify-between px-4 py-4 rounded-[1.5rem] glass-panel transition-all group ${
                               activeTab === tab.id 
                                 ? 'bg-primary/10 border-primary/20 text-primary' 
                                 : isDarkMode 
                                   ? 'bg-white/5 border-white/5 text-white/80 hover:border-white/20' 
                                   : 'bg-gray-50/50 border-orange-100/30 text-gray-700 hover:border-orange-200 hover:bg-orange-50/20'
                             }`}
                           >
                             <div className="flex items-center gap-3 min-w-0">
                               <tab.icon className={`w-5 h-5 shrink-0 ${
                                 activeTab === tab.id 
                                   ? 'text-primary' 
                                   : isDarkMode 
                                     ? 'text-white/20 group-hover:text-primary' 
                                     : 'text-gray-400 group-hover:text-primary'
                               }`} />
                               <span className="text-[10px] font-black uppercase tracking-[1px] truncate">{tab.label}</span>
                             </div>
                             <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                               activeTab === tab.id 
                                 ? 'text-primary' 
                                 : isDarkMode 
                                   ? 'text-white/10' 
                                   : 'text-gray-300'
                             }`} />
                           </button>
                        )
                     ))}
                     <button 
                      onClick={handleLogout}
                      className={`flex items-center gap-4 px-4 py-4 rounded-[1.5rem] transition-all mt-6 glass-panel border ${
                        isDarkMode 
                          ? 'border-white/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/5' 
                          : 'border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200'
                      }`}
                     >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-[1px] truncate">Deauthorize</span>
                     </button>
                  </div>
               </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
               <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                       <div className={`glass-panel p-12 shadow-2xl rounded-[3.5rem] ${
                         isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'
                       }`}>
                          <div className="flex items-center justify-between mb-12">
                             <div className="space-y-2">
                               <h2 className="text-4xl font-black italic tracking-tight">Profile Data</h2>
                               <p className={`text-[10px] font-black uppercase tracking-[4px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Master Identity Profile</p>
                             </div>
                             <button onClick={openEditModal} className="flex items-center gap-3 text-primary font-black uppercase tracking-[3px] text-[10px] hover:text-[#E07B00] transition-all">
                               <Edit2 className="w-4 h-4" /> Edit Ledger
                             </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-3">
                                <p className={`text-[9px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Identity Header</p>
                                <p className="text-xl font-bold italic tracking-tight">{user?.displayName || 'Not Set'}</p>
                             </div>
                             <div className="space-y-3">
                                <p className={`text-[9px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Comms Channel</p>
                                <p className="text-xl font-bold tracking-tight">{user?.email}</p>
                             </div>
                             <div className="space-y-3">
                                <p className={`text-[9px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Credential Status</p>
                                <div className={`inline-flex items-center gap-3 text-[10px] glass-panel px-6 py-2 rounded-full font-black uppercase tracking-widest ${
                                  isDarkMode 
                                    ? 'border-green-500/20 text-green-400 bg-green-400/5' 
                                    : 'border-green-150 text-green-600 bg-green-50'
                                }`}>
                                   <Shield className="w-4 h-4" /> Authenticated Entry
                                </div>
                             </div>
                             <div className="space-y-3">
                                <p className={`text-[9px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Index Origin</p>
                                <p className="text-xl font-bold italic tracking-tight">Q2 2024</p>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className={`glass-panel p-12 rounded-[3.5rem] shadow-[0_30px_100px_-20px_rgba(255,153,0,0.2)] relative overflow-hidden group ${
                            isDarkMode ? 'border-primary/20 bg-primary/5 text-white' : 'border-orange-150 bg-orange-50/30 text-gray-900'
                          }`}>
                             <Package className="w-16 h-16 mb-8 text-primary/30 group-hover:text-primary transition-colors" />
                             <h3 className="text-6xl font-black italic mb-2 tracking-tighter">12</h3>
                             <p className={`text-[10px] font-black uppercase tracking-[4px] mb-10 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Historical Acquisitions</p>
                             <Link to="/orders" className={`glass-panel px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-[3px] text-[10px] inline-block transition-all shadow-2xl relative z-10 ${
                               isDarkMode ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : 'border-orange-200 bg-white hover:bg-gray-50 text-gray-900'
                             }`}>Analyze History</Link>
                             <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-primary/10 rounded-full" />
                          </div>
                          <div className={`glass-panel p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group ${
                            isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'
                          }`}>
                             <Heart className="w-16 h-16 mb-8 text-white/10 group-hover:text-red-500/40 transition-colors" />
                             <h3 className="text-6xl font-black italic mb-2 tracking-tighter">24</h3>
                             <p className={`text-[10px] font-black uppercase tracking-[4px] mb-10 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Tracked Units</p>
                             <Link to="/wishlist" className="bg-primary text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-[3px] text-[10px] inline-block hover:bg-[#E07B00] transition-all orange-shadow relative z-10">Examine Matrix</Link>
                             <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-white/5 rounded-full" />
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`glass-panel p-12 shadow-2xl rounded-[3.5rem] ${
                        isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'
                      }`}
                    >
                       <div className="space-y-2 mb-12">
                         <h2 className="text-4xl font-black italic tracking-tight">Encrypted Comms</h2>
                         <p className={`text-[10px] font-black uppercase tracking-[4px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>System Broadcast Archive</p>
                       </div>
                       <div className="space-y-6">
                           {notifications.length > 0 ? (
                             notifications.map((n) => (
                               <div key={n.id} className={`p-8 glass-panel border-l-8 border-l-primary rounded-3xl flex items-start gap-6 group transition-colors shadow-2xl ${
                                 isDarkMode 
                                   ? 'border-white/5 bg-white/5 hover:border-white/10 text-white' 
                                   : 'border-orange-100 bg-orange-50/20 hover:border-orange-200 text-gray-900'
                               }`}>
                                  <div className={`w-14 h-14 glass-panel text-primary rounded-2xl flex items-center justify-center shrink-0 ${
                                    isDarkMode ? 'border-primary/20 bg-primary/5' : 'border-orange-200 bg-orange-50'
                                  }`}>
                                    <Bell className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1">
                                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                        <h4 className="font-black italic text-xl tracking-tight leading-none">{n.title}</h4>
                                        <span className={`text-[9px] glass-panel px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                                          isDarkMode ? 'border-white/10 bg-white/10 text-white/40' : 'border-orange-100 bg-orange-50 text-gray-500'
                                        }`}>2h Origin</span>
                                     </div>
                                     <p className={`text-sm font-medium leading-relaxed tracking-tight ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>{n.message}</p>
                                  </div>
                               </div>
                             ))
                           ) : (
                             <div className="text-center py-32 text-gray-400">
                                <Bell className={`w-24 h-24 mx-auto mb-6 opacity-20 animate-pulse ${isDarkMode ? 'text-white' : 'text-gray-300'}`} />
                                <p className={`text-[10px] font-black uppercase tracking-[4px] ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Zero Signals Detected</p>
                             </div>
                           )}
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`glass-panel p-12 shadow-2xl rounded-[3.5rem] ${
                        isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-orange-100 bg-white text-gray-900'
                      }`}
                    >
                       <div className="space-y-2 mb-12">
                         <h2 className="text-4xl font-black italic tracking-tight">Security Protocol</h2>
                         <p className={`text-[10px] font-black uppercase tracking-[4px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>System Firewall and Access Logs</p>
                       </div>
                       <div className="space-y-8">
                          <div className={`p-8 glass-panel border-l-8 border-l-green-500 rounded-3xl flex items-start gap-6 shadow-2xl ${
                            isDarkMode ? 'border-white/5 bg-white/5' : 'border-orange-100 bg-orange-50/20'
                          }`}>
                             <div className={`w-14 h-14 glass-panel text-green-500 rounded-2xl flex items-center justify-center shrink-0 animate-pulse ${
                               isDarkMode ? 'border-green-500/20 bg-green-500/5' : 'border-green-150 bg-green-50'
                             }`}>
                               <Shield className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="font-black italic text-xl tracking-tight mb-2">Firewall Active</h4>
                                <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>Your secure token channel is encrypted with 256-bit elliptic curves. Last login detected from standard web ingress.</p>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Profile & Image Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            id="profile-edit-modal-wrapper"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className={`w-full max-w-2xl rounded-[3rem] p-8 md:p-10 border shadow-2xl overflow-y-auto max-h-[90vh] ${
                isDarkMode ? 'bg-[#151922] border-white/10 text-white shadow-none' : 'bg-white border-orange-105 text-gray-900 shadow-2xl'
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">Modify Identity Ledger</h3>
                  <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-gray-450' : 'text-gray-500'}`}>
                    Choose a preset avatar, upload custom media, or edit your handle.
                  </p>
                </div>
                <button 
                  onClick={() => setIsGalleryOpen(false)}
                  className={`p-2.5 rounded-2xl border transition-all hover:scale-110 active:scale-95 ${
                    isDarkMode ? 'border-white/5 bg-white/5 hover:bg-white/10 text-white' : 'border-orange-100 bg-orange-50/50 hover:bg-orange-100 text-gray-650'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Display Name Field */}
              <div className="mb-8 space-y-2">
                <label className={`block text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                  Handle / Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your handle..."
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                      isDarkMode 
                        ? 'bg-gray-950/40 border-white/5 text-white placeholder-white/20' 
                        : 'bg-gray-50 border-orange-100 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              {/* Grid of presets */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                    Predefined Visuals Gallery
                  </span>
                  
                  {/* Custom File Upload Hidden Trigger */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleCustomFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:text-orange-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload custom File</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {presetAvatars.map((av) => {
                    const isSelected = selectedAvatar === av.url;
                    return (
                      <div
                        key={av.id}
                        onClick={() => setSelectedAvatar(av.url)}
                        className={`relative aspect-square rounded-[1.5rem] cursor-pointer overflow-hidden p-1 border transition-all duration-300 hover:scale-[1.05] ${
                          isSelected 
                            ? 'border-primary shadow-[0_0_20px_rgba(255,153,0,0.4)] scale-102 bg-primary/10' 
                            : 'border-transparent bg-white/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          className="w-full h-full object-cover rounded-[1.25rem]"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="p-1 px-1.5 bg-primary text-white rounded-full">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Base64 preview indicator of loaded file */}
              {selectedAvatar && !presetAvatars.some(av => av.url === selectedAvatar) && (
                <div className={`p-4 rounded-2xl mb-8 flex items-center gap-4 border ${
                  isDarkMode ? 'bg-primary/5 border-primary/20 text-white' : 'bg-orange-50 border-orange-200 text-gray-950'
                }`}>
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-primary/40">
                    <img src={selectedAvatar} className="w-full h-full object-cover" alt="Custom upload" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">Custom Media Loaded</span>
                    <p className={`text-xs mt-0.5 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>This custom snapshot belongs to you. Press "Save Profile Data" to lock it.</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  disabled={isSaving}
                  className={`px-6 py-4 rounded-xl font-black uppercase tracking-wider text-xs border transition-all ${
                    isDarkMode 
                      ? 'border-white/5 bg-white/5 hover:bg-white/10 text-white' 
                      : 'border-orange-100 bg-gray-50/50 hover:bg-orange-100 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfileUpdates}
                  disabled={isSaving}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-black uppercase tracking-wider text-xs hover:bg-[#E07B00] transition-all orange-shadow flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Ledger...
                    </>
                  ) : (
                    <>
                      Save Profile Data
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </PageTransition>
  );
};

export default Profile;
