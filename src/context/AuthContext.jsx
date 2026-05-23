import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import Swal from 'sweetalert2';
import { handleFirestoreError, OperationType } from '../services/dbService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...currentUser, ...userData });
            const isAdminUser = userData.role === 'admin';
            setIsAdmin(isAdminUser);
            if (isAdminUser) {
              import('../services/seedService').then(({ seedDatabase }) => {
                seedDatabase();
              }).catch(err => console.error("Dynamic seeding failed:", err));
            }
          } else {
            // Create user doc if not exists (e.g. first Google Login)
            const newUser = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'user',
              createdAt: serverTimestamp()
            };
            try {
              await setDoc(doc(db, "users", currentUser.uid), newUser);
              setUser({ ...currentUser, ...newUser });
              setIsAdmin(false);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
            }
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          if (error.code === 'permission-denied') {
             handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          }
          setLoading(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = {
      uid: res.user.uid,
      email,
      displayName: name,
      role: 'user',
      createdAt: serverTimestamp()
    };
    await setDoc(doc(db, "users", res.user.uid), newUser);
    return res;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateProfile = async (updatedFields) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), updatedFields, { merge: true });
      setUser(prev => ({ ...prev, ...updatedFields }));
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signup, login, googleLogin, logout, resetPassword, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
