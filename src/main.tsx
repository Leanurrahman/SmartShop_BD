import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { NotificationProvider } from './context/NotificationContext';
import { seedDatabase } from './services/seedService';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './services/firebaseConfig';

// Test Firebase Connection and Seed Data
const initApp = async () => {
    try {
        await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
            console.error("Please check your Firebase configuration.");
        }
    }
    await seedDatabase();
};

initApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <App />
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
