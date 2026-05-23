import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight, Printer, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';
import { formatPrice } from '../utils/helpers';
import { getOrderById } from '../services/orderService';

const generatePrintableHtml = (order) => {
  const invoiceId = order.id || order.orderId || 'N/A';
  const customerName = order.customerName || order.shippingAddress?.name || 'Customer';
  const phone = order.phone || order.shippingAddress?.phone || 'N/A';
  const email = order.customerEmail || order.shippingAddress?.email || 'N/A';
  const fullAddress = order.shippingAddress 
    ? `${order.shippingAddress.address || ''}, ${order.shippingAddress.district || ''}, ${order.shippingAddress.country || ''} - ${order.shippingAddress.zipCode || ''}` 
    : 'N/A';
  
  const paymentMethod = order.paymentMethod || 'COD';
  const paymentStatus = order.paymentStatus || 'Pending';
  const txId = order.transactionId || 'N/A';
  const subtotal = order.subtotal || 0;
  const discount = order.discount || 0;
  const total = order.total || 0;
  const dateStr = order.createdAt?.toDate 
    ? order.createdAt.toDate().toLocaleString() 
    : (order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString());

  const itemsRows = (order.items || []).map((item) => {
    const itemPrice = item.discountPrice || item.price || 0;
    const rowTotal = itemPrice * (item.quantity || 1);
    return `
      <tr style="border-bottom: 1px solid #edf2f7;">
        <td style="padding: 12px 8px; font-weight: 600; color: #1a202c; text-align: left;">${item.name}</td>
        <td style="padding: 12px 8px; text-align: center; color: #4a5568;">৳ ${itemPrice}</td>
        <td style="padding: 12px 8px; text-align: center; color: #4a5568;">${item.quantity || 1}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #f97316;">৳ ${rowTotal}</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bishwas Mart - Invoice #${invoiceId.slice(0, 8).toUpperCase()}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #2d3748;
      background-color: #f7fafc;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
    }
    .invoice-card {
      max-width: 800px;
      margin: 40px auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      border: 1px solid #edf2f7;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f97316;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo-area h1 {
      color: #f97316;
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -1px;
    }
    .logo-area p {
      margin: 4px 0 0 0;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      color: #a0aec0;
      letter-spacing: 2px;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h2 {
      margin: 0;
      color: #1a202c;
      font-size: 24px;
      font-weight: 900;
    }
    .invoice-title p {
      margin: 5px 0 0 0;
      color: #718096;
      font-size: 14px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    .info-section h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #a0aec0;
      margin-bottom: 12px;
      border-bottom: 1px solid #edf2f7;
      padding-bottom: 6px;
    }
    .info-section p {
      margin: 6px 0;
      font-size: 14px;
      line-height: 1.5;
    }
    .info-section strong {
      color: #1a202c;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table th {
      background-color: #fff7ed;
      color: #f97316;
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      padding: 12px 8px;
      text-align: left;
    }
    .items-table th.right { text-align: right; }
    .items-table th.center { text-align: center; }
    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    .totals-box {
      width: 300px;
      font-size: 14px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #edf2f7;
    }
    .total-row.grand-total {
      font-size: 18px;
      font-weight: 800;
      color: #f97316;
      border-bottom: none;
      padding-top: 15px;
    }
    .actions-bar {
      max-width: 800px;
      margin: 20px auto;
      text-align: right;
    }
    .btn {
      background-color: #f97316;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(249,115,22,0.15);
      transition: background 0.2s;
    }
    .btn:hover {
      background-color: #ea580c;
    }
    @media print {
      body { background-color: #ffffff; }
      .invoice-card {
        box-shadow: none;
        border: none;
        margin: 0;
        padding: 0;
      }
      .actions-bar, .btn {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="actions-bar">
    <button class="btn" onclick="window.print()">Print This Invoice</button>
  </div>
  <div class="invoice-card">
    <div class="header">
      <div class="logo-area">
        <h1>Bishwas Mart</h1>
        <p>Premium Digital Nexus</p>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <p>ID: #${invoiceId.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-section">
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Shipping Address:</strong> ${fullAddress}</p>
      </div>
      <div class="info-section">
        <h3>Order Parameters</h3>
        <p><strong>Date:</strong> ${dateStr}</p>
        <p><strong>Order Status:</strong> ${order.orderStatus || 'Pending'}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${paymentStatus}</p>
        ${txId !== 'N/A' && txId ? `<p><strong>TxID:</strong> ${txId}</p>` : ''}
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Product / Asset Name</th>
          <th class="center" style="width: 100px;">Price</th>
          <th class="center" style="width: 80px;">Qty</th>
          <th class="right" style="width: 120px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows.length > 0 ? itemsRows : `
          <tr>
            <td colSpan="4" style="padding: 12px 8px; text-align: center; color: #a0aec0;">Purchase assets registered.</td>
          </tr>
        `}
      </tbody>
    </table>

    <div class="totals-area">
      <div class="totals-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>৳ ${subtotal}</span>
        </div>
        <div class="total-row">
          <span>Discount Applied:</span>
          <span>- ৳ ${discount}</span>
        </div>
        <div class="total-row grand-total">
          <span>Grand Total:</span>
          <span>৳ ${total}</span>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;
};

const OrderSuccess = () => {
  const { state } = useLocation();
  const { width, height } = useWindowSize();
  const { isDarkMode } = useTheme();

  const [orderData, setOrderData] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    if (state && state.orderId) {
      setLoadingOrder(true);
      getOrderById(state.orderId)
        .then(data => {
          setOrderData(data);
          setLoadingOrder(false);
        })
        .catch(err => {
          console.error("Error fetching order description:", err);
          setLoadingOrder(false);
        });
    } else {
      setLoadingOrder(false);
    }
  }, [state]);

  if (!state) return <Navigate to="/" />;

  const handlePrintClick = () => {
    // 1. Try iframe standard printer context
    try {
      window.print();
    } catch (e) {
      console.warn("Direct iframe print denied, starting fallback download:", e);
    }

    // 2. Build high fidelity order printable
    const fallbackOrder = orderData || {
      id: state.orderId,
      total: state.total,
      subtotal: state.total,
      discount: 0,
      customerName: 'Customer',
      createdAt: new Date().toISOString(),
      items: []
    };

    const printableHtml = generatePrintableHtml(fallbackOrder);
    const blob = new Blob([printableHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BishwasMart_Receipt_${state.orderId.slice(0, 8).toUpperCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Invoice Exported!',
      text: 'A print-ready digital invoice HTML has been compiled and downloaded securely. Open it to print automatically or keep it for records!',
      confirmButtonColor: '#F97316',
      background: isDarkMode ? '#111827' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    });
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="pt-40 pb-20 min-h-screen flex items-center justify-center relative overflow-hidden">
        <Confetti width={width} height={height} numberOfPieces={200} recycle={false} colors={['#FF9900', isDarkMode ? '#ffffff' : '#f97316', isDarkMode ? '#222222' : '#fef3c7']} />
        
        {/* Background Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 max-w-2xl text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-40 h-40 glass-panel border-green-500/20 bg-green-400/5 text-green-400 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-[0_0_100px_rgba(74,222,128,0.2)]"
          >
            <CheckCircle className="w-20 h-20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h1 className={`text-6xl md:text-7xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>Acquisition Confirmed</h1>
              <p className={`font-black uppercase text-[10px] tracking-[6px] max-w-md mx-auto leading-relaxed ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Your order has been successfully logged into the nexus registry.</p>
            </div>
            
            <div className={`glass-panel p-10 rounded-[4rem] shadow-2xl inline-block w-full ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-orange-100 bg-white'}`}>
               <div className="flex flex-col sm:flex-row justify-between items-center gap-10">
                  <div className="text-center sm:text-left space-y-2">
                     <p className={`text-[9px] font-black uppercase tracking-[4px] ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Mission ID</p>
                     <p className={`text-2xl font-black italic tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>#{state.orderId.slice(0, 8)}</p>
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                     <p className={`text-[9px] font-black uppercase tracking-[4px] ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Clearance Value</p>
                     <p className="text-2xl font-black italic text-primary tracking-tight leading-none">৳ {formatPrice(state.total).replace('TK', '')}</p>
                  </div>
                  <button 
                    onClick={handlePrintClick} 
                    className={`flex items-center gap-3 font-black uppercase tracking-[3px] text-[10px] transition-all glass-panel px-6 py-3 rounded-2xl print:hidden ${isDarkMode ? 'text-white/40 hover:text-white border-white/5 bg-white/5' : 'text-gray-500 hover:text-primary border-orange-100 bg-orange-50/50'}`}
                  >
                    {loadingOrder ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Printer className="w-4 h-4" />
                    )}
                    Hard Copy
                  </button>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6 print:hidden">
               <Link to="/orders" className={`w-full sm:w-auto px-12 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] flex items-center justify-center gap-4 glass-panel transition-all shadow-2xl ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'}`}>
                 Inspect Archive
               </Link>
               <Link to="/products" className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[4px] text-[10px] flex items-center justify-center gap-4 hover:scale-105 transition-all orange-shadow">
                 Continue Mission <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default OrderSuccess;
