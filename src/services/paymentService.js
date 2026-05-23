export { simulateBkashPayment } from './bkashService';

export const processCODPayment = async (orderData) => {
  return {
    success: true,
    transactionId: "COD_" + Date.now(),
    paymentStatus: "Unpaid"
  };
};

export const simulateStripePayment = async (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: "STRIPE_DEMO_" + Date.now(),
        paymentStatus: "Paid"
      });
    }, 1500);
  });
};

export const simulatePaypalPayment = async (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: "PAYPAL_DEMO_" + Date.now(),
        paymentStatus: "Paid"
      });
    }, 1500);
  });
};
