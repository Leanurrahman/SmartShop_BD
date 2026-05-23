export const simulateBkashPayment = async (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: "BKASH_SANDBOX_" + Date.now(),
        paymentStatus: "Paid"
      });
    }, 2000);
  });
};
