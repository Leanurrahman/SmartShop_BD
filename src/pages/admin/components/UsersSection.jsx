import React from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { updateUserBlockStatus, updateUserRole } from '../../../services/adminService';

const UsersSection = ({ users, onUpdate, darkMode, t }) => {
  const toggleBlock = async (user) => {
    try {
      Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading(),
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      await updateUserBlockStatus(user.id, !user.isBlocked);
      Swal.fire({
        icon: 'success', 
        title: 'Success',
        text: `User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`,
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      onUpdate();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    }
  };

  const toggleAdmin = async (user) => {
    if (user.email === 'admin@leanssmartshopbd.com') {
      return Swal.fire({
        icon: 'info',
        title: 'Protected',
        text: "Cannot modify status of Main Admin",
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    }
    
    try {
      Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading(),
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await updateUserRole(user.id, newRole);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `User role updated to ${newRole}`,
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
      onUpdate();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.users} Management ({users.length})</h3>
      <div className={`rounded-2xl border overflow-hidden shadow-sm overflow-x-auto transition-colors ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-gray-100'}`}>
        <table className="w-full text-left">
          <thead className={`border-b transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-[#FFF7ED] border-gray-100 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Email</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors ${darkMode ? 'divide-gray-700 text-gray-300' : 'divide-gray-100'}`}>
            {users.map((u) => (
              <tr key={u.id} className={`transition-colors text-sm ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{u.displayName || 'Unnamed User'}</td>
                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'} ${darkMode ? 'bg-opacity-20' : ''}`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} ${darkMode ? 'bg-opacity-20' : ''}`}>
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleBlock(u)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all ${u.isBlocked ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button 
                      onClick={() => toggleAdmin(u)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersSection;
