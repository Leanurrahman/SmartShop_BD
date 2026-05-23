import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  CheckCircle,
  MoreVertical,
  Mail,
  Calendar,
  Loader2,
  Trash2,
  Shield,
  UserPlus
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const result = await Swal.fire({
      title: `Elevate to ${newRole.toUpperCase()}?`,
      text: "This user will gain administrative privileges.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      confirmButtonText: 'Confirm Elevation'
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, "users", userId), { role: newRole });
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        Swal.fire('Identity Updated!', 'User privilege level adjusted.', 'success');
      } catch (error) {
        Swal.fire('Access Denied', error.message, 'error');
      }
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    const action = isBlocked ? 'Unblock' : 'Block';
    const result = await Swal.fire({
      title: `${action} Node?`,
      text: `Are you sure you want to ${action.toLowerCase()} this user from system access?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBlocked ? '#10B981' : '#EF4444',
      confirmButtonText: `Yes, ${action}!`
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, "users", userId), { isBlocked: !isBlocked });
        setUsers(users.map(u => u.id === userId ? { ...u, isBlocked: !isBlocked } : u));
        Swal.fire('Node Adjusted!', `User has been ${isBlocked ? 'reactivated' : 'quarantined'}.`, 'success');
      } catch (error) {
        Swal.fire('Operation Failed', error.message, 'error');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.uid?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-none">
                Customer <span className="text-teal-600 italic">Nodes</span>
              </h2>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Managing {users.length} active directory entries</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold w-full md:w-80 shadow-inner focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
           {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            </div>
          ) : null}

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">User Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Access Key</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Registry Entry</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Authorization</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    key={user.id}
                    className="hover:bg-teal-50/10 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-teal-600 uppercase border-2 border-transparent group-hover:border-teal-200 transition-all">
                          {user.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-none mb-1 group-hover:text-teal-600 transition-colors">{user.email}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {user.role} Privilege
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className="font-mono text-[10px] bg-gray-50 px-2 py-1 rounded text-gray-500 border border-gray-100">
                          ID-{user.uid?.slice(-8).toUpperCase()}
                       </span>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'Initial Boot'}
                       </div>
                    </td>
                    <td className="p-6">
                       <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${user.isBlocked ? 'bg-red-50 text-red-500 font-bold' : 'bg-green-50 text-green-600 font-bold'}`}>
                         {user.isBlocked ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                         <span className="text-[10px] font-black uppercase tracking-widest">{user.isBlocked ? 'Blocked' : 'Verified'}</span>
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center justify-end gap-2">
                          {user.role !== 'admin' ? (
                            <button 
                              onClick={() => handleRoleChange(user.id, 'admin')}
                              className="p-3 hover:bg-teal-50 rounded-xl text-gray-400 hover:text-teal-600 transition-all active:scale-90"
                              title="Make Admin"
                            >
                              <ShieldCheck className="w-5 h-5" />
                            </button>
                          ) : (
                             <button 
                              onClick={() => handleRoleChange(user.id, 'user')}
                              className="p-3 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-600 transition-all active:scale-90"
                              title="Revoke Admin"
                            >
                              <ShieldAlert className="w-5 h-5" />
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleBlockUser(user.id, !!user.isBlocked)}
                            className={`p-3 rounded-xl transition-all active:scale-90 ${user.isBlocked ? 'hover:bg-green-50 text-green-400 hover:text-green-600' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'}`}
                            title={user.isBlocked ? 'Unblock' : 'Block'}
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
             </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
