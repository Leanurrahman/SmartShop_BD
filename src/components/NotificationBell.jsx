import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { unreadCount, notifications } = useNotifications();

  return (
    <div className="relative group">
      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-white dark:bg-accent border dark:border-gray-800 rounded-2xl shadow-xl w-80 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
            <h4 className="font-bold">Notifications</h4>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg">{unreadCount} New</span>
          </div>
          
          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className={`p-4 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                  <p className="text-sm font-bold mb-1">{notif.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{notif.message}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Bell className="mx-auto w-8 h-8 mb-3 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>
          
          <Link to="/profile" className="block text-center py-3 text-primary text-xs font-bold bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white transition-colors">
            View All Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
