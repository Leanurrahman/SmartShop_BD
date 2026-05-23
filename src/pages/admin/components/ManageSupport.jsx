import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, HelpCircle, FileText, 
  RefreshCw, Save, Headphones, Check, ShieldAlert, Truck 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { 
  getFAQs, 
  addFAQ, 
  updateFAQ, 
  deleteFAQ, 
  getSupportPolicy, 
  saveSupportPolicy 
} from '../../../services/adminService';
import { InputField } from './AdminUI';

const DEFAULT_FAQ_SEED = [
  { question: 'How do I track my order?', answer: 'You can check your order delivery status by using the "Track Order" utility on this support portal. Simply paste your Order ID, which is emailed to you after checkout, and press lookup.' },
  { question: 'What payment methods do you accept?', answer: 'We accept bKash, Nagad, Cash On Delivery (COD), Stripe, and major international credit cards like Visa or Mastercard for smooth transactions.' },
  { question: 'What is your refund policy?', answer: 'We provide a 7-day hassle-free return policy if products are returned intact with their original seals, price tags, and packing inserts.' },
  { question: 'How long does shipment take in Dhaka?', answer: 'Delivery within Dhaka takes 24 to 48 hours maximum. Outside of Dhaka, delivery generally requires between 3 to 5 business days.' }
];

const DEFAULT_RETURNS_POLICY = `
### 7-Days Easy Return & Exchange Policy

At **SmartShop BD**, we prioritize your satisfaction. If you are not completely satisfied with your purchase, we are here to assist with an easy refund or exchange.

#### Standard Requirements for Returns:
1. **Timeframe:** Return request must be initiated within **7 days** of the delivery date.
2. **Product State:** The item must be unused, unwashed, and in its original packaging with all security seals, tags, barcodes, and manuals intact.
3. **Receipt Required:** A valid invoice or proof of purchase is mandatory.
`;

const DEFAULT_SHIPPING_POLICY = `
### Courier & Delivery Information

We design our dispatch logs carefully to guarantee rapid, secure courier shipping across all 64 regions of Bangladesh. 

#### Shipping Charges:
1. **Inside Dhaka Metro:** Flat rate of **৳ 60** per order. 
2. **Outside Dhaka Metro:** Flat rate of **৳ 120** per order.

#### Estimated Cargo transit limits:
- **DHAKA METROPOLITAN:** Deliveries occur within **24 to 48 hours**.
- **DIVISIONS & SUBURBS (Exterior):** Orders will reach destination in **3 to 5 business days**.
`;

const ManageSupport = ({ darkMode }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('faqs'); // 'faqs' | 'policies'
  
  // FAQ Form state
  const [faqForm, setFaqForm] = useState({ id: '', question: '', answer: '' });
  const [isEditingFAQ, setIsEditingFAQ] = useState(false);
  const [showFAQForm, setShowFAQForm] = useState(false);

  // Policies content state
  const [policies, setPolicies] = useState({
    returns: '',
    shipping: ''
  });
  const [savingPolicy, setSavingPolicy] = useState({ returns: false, shipping: false });

  useEffect(() => {
    fetchFaqs();
    fetchPolicies();
  }, []);

  const fetchFaqs = async () => {
    try {
      const data = await getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      const returnsDoc = await getSupportPolicy('returns');
      const shippingDoc = await getSupportPolicy('shipping');
      setPolicies({
        returns: returnsDoc?.content || DEFAULT_RETURNS_POLICY.trim(),
        shipping: shippingDoc?.content || DEFAULT_SHIPPING_POLICY.trim()
      });
    } catch (err) {
      console.error(err);
    }
  };

  // FAQ CRUD
  const handleResetFAQForm = () => {
    setFaqForm({ id: '', question: '', answer: '' });
    setIsEditingFAQ(false);
    setShowFAQForm(false);
  };

  const handleFAQSubmit = async (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    try {
      Swal.fire({
        title: isEditingFAQ ? 'Adjusting Ask...' : 'Registering Question...',
        didOpen: () => Swal.showLoading(),
        background: darkMode ? '#111827' : '#fff',
      });

      if (isEditingFAQ) {
        await updateFAQ(faqForm.id, {
          question: faqForm.question.trim(),
          answer: faqForm.answer.trim()
        });
        Swal.fire({
          icon: 'success',
          title: 'FAQ Updated!',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      } else {
        await addFAQ({
          question: faqForm.question.trim(),
          answer: faqForm.answer.trim()
        });
        Swal.fire({
          icon: 'success',
          title: 'FAQ Registered!',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
          color: darkMode ? '#fff' : '#000',
        });
      }

      handleResetFAQForm();
      fetchFaqs();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: err.message,
        confirmButtonColor: '#F97316',
        background: darkMode ? '#111827' : '#fff',
      });
    }
  };

  const handleEditFAQ = (faq) => {
    setFaqForm({ id: faq.id, question: faq.question, answer: faq.answer });
    setIsEditingFAQ(true);
    setShowFAQForm(true);
  };

  const handleDeleteFAQ = async (id) => {
    const res = await Swal.fire({
      title: 'Delete FAQ?',
      text: 'Are you sure you want to remove this question?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove now',
      background: darkMode ? '#111827' : '#fff',
      color: darkMode ? '#fff' : '#000',
    });

    if (res.isConfirmed) {
      try {
        await deleteFAQ(id);
        Swal.fire({
          title: 'FAQ Removed!',
          icon: 'success',
          confirmButtonColor: '#F97316',
          background: darkMode ? '#111827' : '#fff',
        });
        fetchFaqs();
      } catch (e) {
        Swal.fire({
          title: 'Error',
          text: e.message,
          icon: 'error',
          background: darkMode ? '#111827' : '#fff',
        });
      }
    }
  };

  const handleSeedFAQs = async () => {
    try {
      Swal.fire({ title: 'Seeding standard Q&As...', didOpen: () => Swal.showLoading(), background: darkMode ? '#111827' : '#fff' });
      for (const faq of DEFAULT_FAQ_SEED) {
        await addFAQ(faq);
      }
      Swal.fire({ title: 'FAQs Seeded!', icon: 'success', confirmButtonColor: '#F97316', background: darkMode ? '#111827' : '#fff' });
      fetchFaqs();
    } catch (e) {
      console.error(e);
    }
  };

  // Policies Update
  const handleSavePolicy = async (type) => {
    setSavingPolicy(prev => ({ ...prev, [type]: true }));
    try {
      await saveSupportPolicy(type, policies[type]);
      Swal.fire({
        icon: 'success',
        title: 'Policy Updated!',
        text: `${type === 'returns' ? 'Returns & Refunds' : 'Shipping'} Policy successfully synced with Firestore.`,
        confirmButtonColor: '#F97316',
        background: darkMode ? '#111827' : '#fff',
        color: darkMode ? '#fff' : '#000',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Save',
        text: err.message,
        confirmButtonColor: '#F97316',
        background: darkMode ? '#111827' : '#fff',
      });
    } finally {
      setSavingPolicy(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Support Control Center</h3>
          <p className="text-sm text-gray-400 mt-1">Configure user-facing FAQs and support legal guidelines</p>
        </div>

        {activeSubTab === 'faqs' && (
          <div className="flex items-center gap-3">
            {faqs.length === 0 && (
              <button
                onClick={handleSeedFAQs}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
                  darkMode ? 'bg-gray-800 text-[#F97316] hover:bg-gray-700' : 'bg-orange-50 text-[#F97316]'
                }`}
              >
                Seed Default FAQs
              </button>
            )}
            <button
              onClick={() => {
                if (showFAQForm) handleResetFAQForm();
                else setShowFAQForm(true);
              }}
              className="flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider bg-[#F97316] text-white shadow-lg rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              {showFAQForm ? 'Hide Form' : <><Plus className="w-4 h-4" /> Add FAQ</>}
            </button>
          </div>
        )}
      </div>

      {/* Sub-tabs switch */}
      <div className="flex border-b border-orange-100 dark:border-gray-800 gap-6">
        <button
          onClick={() => setActiveSubTab('faqs')}
          className={`pb-3 text-xs font-black uppercase tracking-widest relative cursor-pointer ${
            activeSubTab === 'faqs' ? 'text-[#F97316]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {activeSubTab === 'faqs' && <motion.div layoutId="subTabSupportLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316]" />}
          Help Q&amp;As Accordions
        </button>
        <button
          onClick={() => setActiveSubTab('policies')}
          className={`pb-3 text-xs font-black uppercase tracking-widest relative cursor-pointer ${
            activeSubTab === 'policies' ? 'text-[#F97316]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {activeSubTab === 'policies' && <motion.div layoutId="subTabSupportLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316]" />}
          Policy Guidelines Editor
        </button>
      </div>

      {/* WORKSPACE FAQ TABS */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-6">
          {/* FAQ form */}
          {showFAQForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className={`p-6 rounded-2xl border transition-all ${
                darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-orange-100'
              }`}
            >
              <h4 className={`text-md font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {isEditingFAQ ? 'Update FAQ details' : 'Draft New Q&A'}
              </h4>
              <form onSubmit={handleFAQSubmit} className="space-y-4">
                <InputField
                  label="Question Text"
                  placeholder="e.g. How long does standard shipment take?"
                  value={faqForm.question}
                  onChange={v => setFaqForm({ ...faqForm, question: v })}
                  required
                  darkMode={darkMode}
                />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Answer Text</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details..."
                    value={faqForm.answer}
                    onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                    required
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold resize-none ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-[#F97316]' 
                        : 'bg-gray-55 border-gray-100 text-gray-900 focus:border-[#F97316]'
                    }`}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetFAQForm}
                    className={`px-5 py-3 text-xs font-bold rounded-xl transition-colors ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F97316] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-102 shadow-md shadow-orange-500/10 cursor-pointer"
                  >
                    Save FAQ
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* FAQs List Table */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-orange-100'}`}>
            {loading ? (
              <div className="p-20 text-center flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#F97316] animate-spin mb-3" />
                <p className="text-xs text-gray-400 font-bold tracking-wider">Syncing FAQs...</p>
              </div>
            ) : faqs.length > 0 ? (
              <div className="divide-y divide-gray-150 dark:divide-gray-800">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-5 flex items-start justify-between gap-4 hover:bg-orange-50/5 dark:hover:bg-white/5 transition-colors">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex gap-2 items-center">
                        <HelpCircle className="w-4 h-4 text-[#F97316] shrink-0" />
                        <h5 className={`font-black text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{faq.question}</h5>
                      </div>
                      <p className={`text-xs pl-6 leading-relaxed font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{faq.answer}</p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={() => handleEditFAQ(faq)}
                        className={`p-2 rounded-lg border text-blue-500 hover:bg-blue-500/10 transition-colors ${
                          darkMode ? 'border-gray-800' : 'border-orange-50'
                        }`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className={`p-2 rounded-lg border text-red-500 hover:bg-red-500/10 transition-colors ${
                          darkMode ? 'border-gray-800' : 'border-orange-50'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center space-y-4">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
                <h5 className="font-bold text-sm">No FAQs stored</h5>
                <p className="text-xs text-gray-400">Load standards instantly or draft custom entries above.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POLICY TEXT WORKSPACE EDITORS */}
      {activeSubTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* RETURNS & REFUNDS FORM EDITOR */}
          <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-orange-100 shadow-sm'
          }`}>
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <ShieldAlert className="w-5 h-5 text-[#F97316]" />
                <h4 className={`text-sm font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Returns &amp; Refunds Policy
                </h4>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-semibold mb-3">
                Update standard user-facing instructions regarding timeline constraints, packing guidelines, and non-returnable categories.
              </p>
              <textarea
                rows={12}
                value={policies.returns}
                onChange={e => setPolicies({ ...policies, returns: e.target.value })}
                className={`w-full p-4 rounded-xl border outline-none font-mono text-xs leading-relaxed resize-none ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 text-white focus:border-[#F97316]' 
                    : 'bg-orange-50/20 border-orange-100 text-gray-800 focus:border-[#F97316]'
                }`}
              />
            </div>
            
            <button
              onClick={() => handleSavePolicy('returns')}
              disabled={savingPolicy.returns}
              className={`w-full py-3.5 mt-5 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                savingPolicy.returns ? 'bg-orange-400' : 'bg-[#F97316] hover:bg-orange-655'
              }`}
            >
              {savingPolicy.returns ? 'Saving...' : <><Save className="w-4 h-4" /> Sync Return Guidelines</>}
            </button>
          </div>

          {/* SHIPPING & DISPATCH FORM EDITOR */}
          <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#111827] border-gray-700' : 'bg-white border-orange-100 shadow-sm'
          }`}>
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Truck className="w-5 h-5 text-[#F97316]" />
                <h4 className={`text-sm font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Shipping &amp; Courier Logistics
                </h4>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-semibold mb-3">
                Update fees inside/outside Dhaka metropolitan area, logistics service suppliers, cargo timelines, and recipient rules.
              </p>
              <textarea
                rows={12}
                value={policies.shipping}
                onChange={e => setPolicies({ ...policies, shipping: e.target.value })}
                className={`w-full p-4 rounded-xl border outline-none font-mono text-xs leading-relaxed resize-none ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 text-white focus:border-[#F97316]' 
                    : 'bg-orange-50/20 border-orange-100 text-gray-800 focus:border-[#F97316]'
                }`}
              />
            </div>

            <button
              onClick={() => handleSavePolicy('shipping')}
              disabled={savingPolicy.shipping}
              className={`w-full py-3.5 mt-5 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                savingPolicy.shipping ? 'bg-orange-400' : 'bg-[#F97316] hover:bg-orange-655'
              }`}
            >
              {savingPolicy.shipping ? 'Saving...' : <><Save className="w-4 h-4" /> Sync Courier Guidelines</>}
            </button>
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default ManageSupport;
