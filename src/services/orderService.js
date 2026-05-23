import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sendNotification } from './notificationService';

export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp(),
      orderStatus: "Pending"
    });
    
    await sendNotification(orderData.userId, "Order Placed", `Your order #${docRef.id.slice(0, 5)} has been placed successfully.`);
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, userId, status) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { orderStatus: status });
  await sendNotification(userId, "Order Status Updated", `Your order #${orderId.slice(0, 5)} is now ${status}.`);
};

export const getOrdersByUser = async (userId) => {
  const q = query(collection(db, "orders"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return orders.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};

export const getOrderById = async (orderId) => {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Order not found");
  }
};
