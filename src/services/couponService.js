import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const validateCoupon = async (code, orderAmount) => {
  try {
    const q = query(collection(db, "coupons"), where("code", "==", code), where("active", "==", true));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Invalid or inactive coupon code.");
    }
    
    const coupon = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    
    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      throw new Error("Coupon has expired.");
    }
    
    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached.");
    }
    
    // Check minimum amount
    if (orderAmount < coupon.minimumOrderAmount) {
      throw new Error(`Minimum order amount of ${coupon.minimumOrderAmount} TK required.`);
    }
    
    return coupon;
  } catch (error) {
    console.error("Coupon Validation Error:", error);
    throw error;
  }
};

export const incrementCouponUsage = async (couponId) => {
  const couponRef = doc(db, "coupons", couponId);
  const couponSnap = await getDoc(couponRef);
  if (couponSnap.exists()) {
    await updateDoc(couponRef, {
      usedCount: (couponSnap.data().usedCount || 0) + 1
    });
  }
};
