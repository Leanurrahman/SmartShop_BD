import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const sendNotification = async (userId, title, message, type = "info") => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const getUserNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, "notifications"), 
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    const notifications = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort in-memory to avoid requiring a composite index
    return notifications.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};
