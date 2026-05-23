import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        Swal.fire({
          icon: 'info',
          title: 'Removed from Wishlist',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500
        });
        return prev.filter(item => item.id !== product.id);
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Added to Wishlist',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500
        });
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
