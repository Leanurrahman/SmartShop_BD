import React, { useState } from 'react';
import { Ticket, Loader2 } from 'lucide-react';
import { validateCoupon } from '../services/couponService';
import Swal from 'sweetalert2';

const CouponBox = ({ orderAmount, onApply, initialCoupon }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(initialCoupon || null);

  React.useEffect(() => {
    if (initialCoupon) {
      setApplied(initialCoupon);
      setCode(initialCoupon.code);
    }
  }, [initialCoupon]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const coupon = await validateCoupon(code.trim(), orderAmount);
      setApplied(coupon);
      onApply(coupon);
      Swal.fire({
        icon: 'success',
        title: 'Coupon Applied!',
        text: `You got a discount of ${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' TK'}.`,
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Coupon',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary/5 border border-dashed border-primary/30 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Ticket className="text-primary w-5 h-5" />
        <h4 className="font-bold">Have a Coupon?</h4>
      </div>
      
      {applied ? (
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-primary/20">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Applied Code</p>
            <p className="font-bold text-primary">{applied.code}</p>
          </div>
          <button 
            onClick={() => { setApplied(null); onApply(null); setCode(""); }}
            className="text-xs font-bold text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            className="flex-1 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl text-sm focus:outline-none border border-transparent focus:border-primary/30"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CouponBox;
