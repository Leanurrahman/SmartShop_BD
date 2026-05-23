import { 
  db, 
  auth 
} from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy, 
  where,
  setDoc
} from 'firebase/firestore';

// --- Product Functions ---
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// --- Order Functions ---
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { 
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// --- User Functions ---
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const updateUserBlockStatus = async (userId, blocked) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { isBlocked: blocked });
  } catch (error) {
    console.error("Error updating user block status:", error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// --- Coupon Functions ---
export const createCoupon = async (couponData) => {
  try {
    const docRef = await addDoc(collection(db, "coupons"), {
      ...couponData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

export const getCoupons = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "coupons"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting coupons:", error);
    throw error;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    await deleteDoc(doc(db, "coupons", couponId));
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

// --- Settings Functions ---
export const updateHomepageBanner = async (bannerUrl) => {
  try {
    const settingsRef = doc(db, "settings", "homepageBanner");
    await setDoc(settingsRef, { url: bannerUrl, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

export const getHomepageBanner = async () => {
  try {
    const docSnap = await getDoc(doc(db, "settings", "homepageBanner"));
    return docSnap.exists() ? docSnap.data().url : null;
  } catch (error) {
    console.error("Error getting banner:", error);
    return null;
  }
};

// --- Lottery/Spin Offers & Spins ---

export const addLotteryOffer = async (offerData) => {
  try {
    const docRef = await addDoc(collection(db, "lotteryOffers"), {
      ...offerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding lottery offer:", error);
    throw error;
  }
};

export const updateLotteryOffer = async (offerId, updatedData) => {
  try {
    const offerRef = doc(db, "lotteryOffers", offerId);
    await updateDoc(offerRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating lottery offer:", error);
    throw error;
  }
};

export const deleteLotteryOffer = async (offerId) => {
  try {
    await deleteDoc(doc(db, "lotteryOffers", offerId));
  } catch (error) {
    console.error("Error deleting lottery offer:", error);
    throw error;
  }
};

export const getAllLotteryOffers = async () => {
  try {
    const q = query(collection(db, "lotteryOffers"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all lottery offers:", error);
    throw error;
  }
};

export const getActiveLotteryOffers = async (occasion = "") => {
  try {
    const allOffers = await getAllLotteryOffers();
    const todayStr = new Date().toISOString().split('T')[0];
    
    const activeOffers = allOffers.filter(offer => {
      if (!offer.expiryDate) return true;
      return offer.expiryDate >= todayStr;
    });

    if (occasion) {
      return activeOffers.filter(off => off.occasion?.toLowerCase() === occasion.toLowerCase());
    }
    return activeOffers;
  } catch (error) {
    console.error("Error getting active lottery offers:", error);
    throw error;
  }
};

export const checkUserEligibility = async (userId, occasion) => {
  try {
    if (!userId || !occasion) return true;
    const q = query(
      collection(db, "userSpins"), 
      where("userId", "==", userId), 
      where("occasion", "==", occasion)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error checking user spin eligibility:", error);
    return true;
  }
};

export const recordUserSpin = async (userId, userEmail, spinData) => {
  try {
    const docRef = await addDoc(collection(db, "userSpins"), {
      userId: userId || "",
      userEmail: userEmail || "",
      offerId: spinData.offerId || spinData.id || "default_offer",
      offerName: spinData.offerName || spinData.name || "Discount Offer",
      discount: Number(spinData.discount || 0),
      discountType: spinData.discountType || "percentage",
      occasion: spinData.occasion || "Seasonal",
      code: spinData.code || "SPIN-REWARD",
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error recording user spin:", error);
    throw error;
  }
};

export const getAllUserSpins = async () => {
  try {
    const q = query(collection(db, "userSpins"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all user spins:", error);
    throw error;
  }
};

// --- Category Functions ---
export const getCategories = async () => {
  try {
    const q = query(collection(db, "categories"));
    const querySnapshot = await getDocs(q);
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort manually by displayOrder or fallback to name
    return list.sort((a, b) => {
      const orderA = a.displayOrder !== undefined ? Number(a.displayOrder) : 999;
      const orderB = b.displayOrder !== undefined ? Number(b.displayOrder) : 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || "").localeCompare(b.name || "");
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      parentCategoryId: categoryData.parentCategoryId || null,
      displayOrder: Number(categoryData.displayOrder || 0),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (categoryId, updatedData) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    await updateDoc(categoryRef, {
      name: updatedData.name,
      slug: updatedData.slug || updatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      parentCategoryId: updatedData.parentCategoryId || null,
      displayOrder: Number(updatedData.displayOrder || 0),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// --- FAQ Functions ---
export const getFAQs = async () => {
  try {
    const q = query(collection(db, "faqs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting FAQs:", error);
    throw error;
  }
};

export const addFAQ = async (faqData) => {
  try {
    const docRef = await addDoc(collection(db, "faqs"), {
      question: faqData.question,
      answer: faqData.answer,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding FAQ:", error);
    throw error;
  }
};

export const updateFAQ = async (faqId, updatedData) => {
  try {
    const faqRef = doc(db, "faqs", faqId);
    await updateDoc(faqRef, {
      question: updatedData.question,
      answer: updatedData.answer,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
};

export const deleteFAQ = async (faqId) => {
  try {
    await deleteDoc(doc(db, "faqs", faqId));
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
};

// --- Support Policy Functions ---
export const getSupportPolicy = async (type) => {
  try {
    const docRef = doc(db, "supportPolicies", type);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting support policy:", error);
    throw error;
  }
};

export const saveSupportPolicy = async (type, content) => {
  try {
    const docRef = doc(db, "supportPolicies", type);
    await setDoc(docRef, {
      type,
      content,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving support policy:", error);
    throw error;
  }
};

// --- Support Message Functions ---
export const saveSupportMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, "supportMessages"), {
      ...messageData,
      status: "unread",
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving support message:", error);
    throw error;
  }
};

