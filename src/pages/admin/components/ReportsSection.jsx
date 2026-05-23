import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const ReportsSection = ({ orders }) => {
  const [reportType, setReportType] = useState('monthly');
  const [previewData, setPreviewData] = useState([]);

  useEffect(() => {
    generatePreview();
  }, [reportType, orders]);

  const generatePreview = () => {
    const now = new Date();
    let filtered = orders;
    
    if (reportType === 'daily') {
      filtered = orders.filter(o => {
        const d = new Date(o.createdAt?.seconds * 1000);
        return d.toDateString() === now.toDateString();
      });
    } else if (reportType === 'weekly') {
       const weekAgo = new Date(now.setDate(now.getDate() - 7));
       filtered = orders.filter(o => new Date(o.createdAt?.seconds * 1000) >= weekAgo);
    } else if (reportType === 'monthly') {
       const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
       filtered = orders.filter(o => new Date(o.createdAt?.seconds * 1000) >= monthAgo);
    } else if (reportType === 'yearly') {
       const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
       filtered = orders.filter(o => new Date(o.createdAt?.seconds * 1000) >= yearAgo);
    }

    setPreviewData(filtered);
  };

  const handleDownload = () => {
    if (previewData.length === 0) return Swal.fire('Wait', 'No data to export for this range', 'info');

    const data = previewData.map(o => ({
      'Order ID': o.id,
      'Customer Name': o.userName,
      'Email': o.email,
      'Total Amount': `$${o.total}`,
      'Order Status': o.status,
      'Payment Method': o.paymentMethod,
      'Payment Status': o.paymentStatus,
      'Date': o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleString() : 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${reportType}_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    Swal.fire({
      icon: 'success',
      title: reportType.charAt(0).toUpperCase() + reportType.slice(1) + ' Report Generated!',
      text: 'Excel file has been downloaded successfully.',
      timer: 2000,
      showConfirmButton: false,
      iconColor: '#F97316'
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Business Reports</h3>
            <p className="text-sm text-gray-400 mt-1">Generate and export historical performance data</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 bg-gray-50 border rounded-xl outline-none text-sm font-bold text-gray-700"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
            </select>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-[#F97316] text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-all"
            >
              <Download size={18} /> Export Excel
            </button>
          </div>
        </div>

        <div className="bg-[#FFF7ED] p-4 rounded-xl mb-8 flex justify-around text-center">
           <div>
             <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Orders Found</p>
             <p className="text-xl font-black text-[#F97316]">{previewData.length}</p>
           </div>
           <div className="w-px bg-orange-100 h-10" />
           <div>
             <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Total Revenue</p>
             <p className="text-xl font-black text-[#F97316]">${previewData.reduce((s,o) => s + (o.total || 0), 0).toLocaleString()}</p>
           </div>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-gray-400">Order Information</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-gray-400">Status</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-gray-400 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {previewData.slice(0, 8).map(o => (
                <tr key={o.id}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{o.userName}</p>
                    <p className="text-[10px] text-gray-400">ID: {o.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-500 rounded-full">{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-700">${o.total}</td>
                </tr>
              ))}
              {previewData.length > 8 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-400 italic text-xs">And {previewData.length - 8} more records available in export...</td>
                </tr>
              )}
            </tbody>
          </table>
          {previewData.length === 0 && <p className="text-center py-20 text-gray-400 italic">No records found for selected period</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsSection;
