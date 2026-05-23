import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import SupportSidebar from '../components/support/SupportSidebar';
import ContactUs from '../components/support/ContactUs';
import FAQs from '../components/support/FAQs';
import TrackOrder from '../components/support/TrackOrder';
import ReturnsPolicy from '../components/support/ReturnsPolicy';
import ShippingPolicy from '../components/support/ShippingPolicy';
import { HelpCircle, ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Support = ({ activeSection: defaultSection = '' }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('contact');

  // Dynamically resolve section from pathname if passed from react-router-dom
  useEffect(() => {
    if (defaultSection) {
      setActiveSection(defaultSection);
    } else {
      const path = location.pathname.toLowerCase();
      if (path.includes('contact')) setActiveSection('contact');
      else if (path.includes('faq')) setActiveSection('faqs');
      else if (path.includes('track')) setActiveSection('track');
      else if (path.includes('return')) setActiveSection('returns');
      else if (path.includes('shipping')) setActiveSection('shipping');
    }
  }, [location.pathname, defaultSection]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'contact':
        return <ContactUs />;
      case 'faqs':
        return <FAQs />;
      case 'track':
        return <TrackOrder />;
      case 'returns':
        return <ReturnsPolicy />;
      case 'shipping':
        return <ShippingPolicy />;
      default:
        return <ContactUs />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'contact': return 'Contact Customer Care';
      case 'faqs': return 'Help & FAQs Search';
      case 'track': return 'Real-time Cargo Tracking';
      case 'returns': return 'Exchange & Return Schemes';
      case 'shipping': return 'Shipping Fees & Deliveries';
      default: return 'Support Hub';
    }
  };

  return (
    <PageTransition>
      <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50/50 text-gray-900'
      }`}>
        <Navbar />

        {/* Elegant Header Banner */}
        <div className={`relative pt-32 pb-16 overflow-hidden ${
          isDarkMode ? 'bg-gradient-to-b from-gray-905 to-gray-900 border-b border-white/5' : 'bg-gradient-to-b from-orange-50/40 to-white border-b border-orange-50'
        }`}>
          <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
              <a href="/" className="flex items-center gap-1 hover:text-[#F97316] transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </a>
              <ChevronRight className="w-3 h-3 text-gray-500" />
              <span className="text-[#F97316]">Support Hub</span>
              <ChevronRight className="w-3 h-3 text-gray-500" />
              <span className="text-gray-500 truncate max-w-[120px] sm:max-w-none">{getSectionTitle()}</span>
            </div>

            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Help &amp; <span className="text-[#F97316]">Support Desk</span>
            </h1>
            <p className={`text-xs md:text-sm max-w-md mx-auto font-medium ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
              Have questions? Our support desk works round the clock to resolve your shopping and logistics challenges.
            </p>
          </div>
        </div>

        {/* Main Workspace Portal */}
        <main className="container mx-auto px-4 flex-grow py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation (Col 1 of 4) */}
            <div className="lg:col-span-1">
              <SupportSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>

            {/* Support Content Panels (Col 3 of 4) */}
            <div className="lg:col-span-3">
              {renderActiveSection()}
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Support;
