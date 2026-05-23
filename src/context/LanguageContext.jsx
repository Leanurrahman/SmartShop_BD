import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    nav_home: "Home",
    nav_products: "Lab",
    nav_wishlist: "Wishlist",
    nav_cart: "Cart",
    nav_admin: "Admin Panel",
    nav_profile: "My Profile",
    nav_orders: "My Orders",
    nav_logout: "Logout",
    nav_search_placeholder: "Search AI-curated products...",
    nav_login: "Login",
    
    hero_tag: "Powered by Gemini AI",
    hero_title_1: "Upgrade Your",
    hero_title_2: "Digital Lifestyle",
    hero_desc: "Experience the next generation of e-commerce in Bangladesh with real-time AI recommendations and seamless bKash integration.",
    button_explore: "Explore Collection",
    button_learn: "Learn More",
    ai_rec_title: "AI Recommended",
    ai_rec_tagline: "SmartShop AI suggests these based on your interest in high-performance electronics and premium build quality.",
    match: "match",
    
    badge_secure: "Secure Payment",
    badge_secure_desc: "100% Secured Payments",
    badge_shipping: "Free Shipping",
    badge_shipping_desc: "On all orders over 5000 TK",
    badge_returns: "Easy Returns",
    badge_returns_desc: "7-Day easy return policy",
    badge_support: "AI Support",
    badge_support_desc: "24/7 Smart Assistance",
    
    section_explore: "Explore By",
    section_popular_categories: "Popular Categories",
    cat_electronics: "Electronics",
    cat_fashion: "Fashion",
    cat_home: "Home & Living",
    cat_groceries: "Groceries",
    products_count: "Products",
    
    promo_tag: "Limited Offer",
    promo_title: "Up to 70% Off on Winter Fashion!",
    promo_desc: "Upgrade your wardrobe with our premium winter collection at unbeatable prices.",
    promo_btn: "Shop Deals",
    
    integrity_matrix_title: "Integrity Matrix",
    integrity_matrix_sub: "SmartShop Validated Protocol",
    integrity_origin: "Authentic Genetic Origin",
    integrity_bkash: "End-to-End Secure bKash Node",
    integrity_return: "7-Epoch Return Gateway",
    
    priority_layer_title: "Priority Layer",
    priority_logistic: "Logistic Parameters",
    priority_policy: "Policy Framework",
    priority_contact: "Contact Uplink",
    
    write_review: "Write Review",
    sentiment_value: "Sentiment Value",
    transmission_data: "Transmission Data",
    comment_placeholder: "Decrypt your experience here...",
    "btn_submit_review": "Authorize Submission",
    zero_reviews: "Zero Transmission Found",
    first_review: "Be the first to establish signal!",
    pulse_reviews: "Pulse Reviews",
    validated_matrix: "Validated Experience Matrix",
    btn_ai_summary: "Generate Core Matrix",
    synthetic_overview: "Synthetic Intelligence Overview",
    
    btn_init_access: "Initialize Access",
    logistics_label: "Logistics",
    global_express: "Global Express",
    standard_label: "Standard",
    seven_d_res: "7D Resolution",
    protocol_label: "Protocol:",
    sync_link: "Sync Link"
  },
  bn: {
    nav_home: "হোম",
    nav_products: "ল্যাব",
    nav_wishlist: "পছন্দের তালিকা",
    nav_cart: "কার্ট",
    nav_admin: "অ্যাডমিন প্যানেল",
    nav_profile: "আমার প্রোফাইল",
    nav_orders: "আমার অর্ডার",
    nav_logout: "লগআউট",
    nav_search_placeholder: "এআই-কিউরেটেড পণ্য খুঁজুন...",
    nav_login: "লগইন",
    
    hero_tag: "জেমিনি এআই দ্বারা চালিত",
    "hero_title_1": "আপগ্রেড করুন আপনার",
    "hero_title_2": "ডিজিটাল লাইফস্টাইল",
    hero_desc: "রিয়েল-টাইম এআই সুপারিশ এবং নির্বিঘ্ন বিকাশ পেমেন্ট সমন্বয় সহ বাংলাদেশে পরবর্তী প্রজন্মের ই-কমার্সের অভিজ্ঞতা নিন।",
    button_explore: "কালেকশন এক্সপ্লোর করুন",
    button_learn: "আরও জানুন",
    ai_rec_title: "এআই প্রস্তাবিত",
    ai_rec_tagline: "উচ্চ-কার্যক্ষমতার ইলেকট্রনিক্স এবং প্রিমিয়াম পারফরম্যান্সের প্রতি আপনার আগ্রহের ভিত্তিতে স্মার্টশপ এআই এগুলো প্রস্তাব করছে।",
    match: "ম্যাচ",
    
    badge_secure: "নিরাপদ পেমেন্ট",
    badge_secure_desc: "১০০% সুরক্ষিত পেমেন্ট",
    badge_shipping: "ফ্রি শিপিং",
    badge_shipping_desc: "৫০০০ টাকার বেশি অর্ডারে",
    badge_returns: "সহজ রিটার্ন",
    badge_returns_desc: "৭ দিনের সহজ রিটার্ন পলিসি",
    badge_support: "এআই সাপোর্ট",
    badge_support_desc: "২৪/৭ স্মার্ট সহায়তা",
    
    section_explore: "এক্সপ্লোর করুন",
    "section_popular_categories": "জনপ্রিয় ক্যাটাগরি",
    cat_electronics: "ইলেকট্রনিক্স",
    cat_fashion: "ফ্যাশন",
    cat_home: "হোম ও লিভিং",
    cat_groceries: "মুদি সামগ্রী",
    products_count: "টি পণ্য",
    
    promo_tag: "সীমিত অফার",
    promo_title: "শীতকালীন পোশাকে ৭০% পর্যন্ত ছাড়!",
    promo_desc: "অপরাজেয় মূল্যে আমাদের প্রিমিয়াম শীতকালীন পোশাক দিয়ে আপনার ওয়ারড্রোব আপগ্রেড করুন।",
    promo_btn: "ডিল কিনুন",
    
    integrity_matrix_title: "সততা ম্যাট্রিক্স",
    integrity_matrix_sub: "স্মার্টশপ যাচাইকৃত প্রটোকল",
    integrity_origin: "শতভাগ খাঁটি পণ্য উৎস",
    integrity_bkash: "সম্পূর্ণ সুরক্ষিত বিকাশ লেনদেন",
    integrity_return: "৭ দিনের রিটার্ন সুবিধা",
    
    priority_layer_title: "অগ্রাধিকার স্তর",
    priority_logistic: "লজিস্টিক প্যারামিটার",
    priority_policy: "পলিসি ফ্রেমওয়ার্ক",
    priority_contact: "যোগাযোগ মাধ্যম",
    
    write_review: "রিভিউ লিখুন",
    sentiment_value: "রেটিং এর মান",
    transmission_data: "মন্তব্য বিবরণ",
    comment_placeholder: "আপনার অভিজ্ঞতা এখানে লিখুন...",
    "btn_submit_review": "দাখিল করুন",
    zero_reviews: "কোন মন্তব্য পাওয়া যায়নি",
    first_review: "প্রথম মন্তব্যকারী হয়ে যান!",
    pulse_reviews: "গ্রাহক পর্যালোচনা",
    validated_matrix: "যাচাইকৃত অভিজ্ঞতা ম্যাট্রিক্স",
    btn_ai_summary: "এআই জেনারেশন",
    synthetic_overview: "কৃত্রিম বুদ্ধিমত্তা সারসংক্ষেপ",
    
    btn_init_access: "কার্টে যোগ করুন",
    logistics_label: "লজিস্টিকস",
    global_express: "গ্লোবাল এক্সপ্রেস",
    standard_label: "স্ট্যান্ডার্ড",
    seven_d_res: "৭ দিন রেজোলিউশন",
    protocol_label: "প্রটোকল:",
    sync_link: "লিঙ্ক সিঙ্ক"
  },
  hi: {
    nav_home: "होम",
    nav_products: "लैब",
    nav_wishlist: "इच्छा-सूची",
    nav_cart: "कार्ट",
    nav_admin: "एडमिन पैनल",
    nav_profile: "मेरी प्रोफाइल",
    nav_orders: "मेरे ऑर्डर्स",
    nav_logout: "लॉगआउट",
    nav_search_placeholder: "AI-क्यूरेटेड उत्पाद खोजें...",
    nav_login: "लॉगिन",
    
    hero_tag: "जेमिनी AI द्वारा संचालित",
    hero_title_1: "अपग्रेड करें अपनी",
    hero_title_2: "डिजिटल जीवन शैली",
    hero_desc: "वास्तविक समय AI अनुशंसाओं और निर्बाध bKash भुगतान एकीकरण के साथ बांग्लादेश में अगली पीढ़ी के ई-कॉमर्स का अनुभव करें।",
    button_explore: "संग्रह का पता लगाएं",
    button_learn: "अधिक जानें",
    ai_rec_title: "AI द्वारा अनुशंसित",
    ai_rec_tagline: "स्मार्टशॉप AI इन्हें आपके उच्च-प्रदर्शन इलेक्ट्रॉनिक्स और प्रीमियम निर्माण गुणवत्ता में रुचि के आधार पर सुझाता है।",
    match: "मैच",
    
    badge_secure: "सुरक्षित भुगतान",
    badge_secure_desc: "100% सुरक्षित भुगतान",
    badge_shipping: "मुफ़्त शिपिंग",
    badge_shipping_desc: "५००० टका से अधिक के ऑर्डर पर",
    badge_returns: "आसान रिटर्न",
    badge_returns_desc: "7-दिवसीय आसान वापसी नीति",
    badge_support: "AI सहायता",
    badge_support_desc: "24/7 स्मार्ट सहायता",
    
    section_explore: "एक्सप्लोर करें",
    section_popular_categories: "लोकप्रिय श्रेणियां",
    cat_electronics: "इलेक्ट्रॉनिक्स",
    cat_fashion: "फैशन",
    cat_home: "होम एंड लिविंग",
    cat_groceries: "किराना",
    products_count: "उत्पाद",
    
    promo_tag: "सीमित समय ऑफर",
    promo_title: "शीतकालीन पहनावे पर 70% तक की छूट!",
    promo_desc: "अद्वितीय कीमतों पर हमारे प्रीमियम शीतकालीन संग्रह के साथ अपनी अलमारी को अपग्रेड करें।",
    promo_btn: "डील्स खरीदें",
    
    integrity_matrix_title: "ईमानदारी मैट्रिक्स",
    integrity_matrix_sub: "स्मार्टशॉप सत्यापित प्रोटोकॉल",
    integrity_origin: "प्रामाणिक उत्पाद स्रोत",
    integrity_bkash: "सुरक्षित bKash भुगतान नोड",
    integrity_return: "7-दिवसीय रिटर्न गेटवे",
    
    priority_layer_title: "प्राथमिकता स्तर",
    priority_logistic: "लॉजिस्टिक्स पैरामीटर",
    priority_policy: "नीति ढांचा",
    priority_contact: "संपर्क लिंक",
    
    write_review: "समीक्षा लिखें",
    sentiment_value: "रेटिंग मूल्य",
    transmission_data: "अनुभव डेटा",
    comment_placeholder: "अपना अनुभव यहाँ लिखें...",
    "btn_submit_review": "समीक्षा सबमिट करें",
    zero_reviews: "कोई समीक्षा नहीं मिली",
    first_review: "पहले समीक्षा करने वाले बनें!",
    pulse_reviews: "पल्स समीक्षाएं",
    validated_matrix: "सत्यापित अनुभव मैट्रिक्स",
    btn_ai_summary: "मूल मैट्रिक्स उत्पन्न करें",
    synthetic_overview: "कृत्रिम बुद्धिमत्ता अवलोकन",
    
    btn_init_access: "कार्ट में जोड़ें",
    logistics_label: "लॉजिस्टिक्स",
    global_express: "ग्लोबल एक्सप्रेस",
    standard_label: "मानक",
    seven_d_res: "7D समाधान",
    protocol_label: "प्रोटोकॉल:",
    sync_link: "लिंक्स सिंक करें"
  },
  ur: {
    nav_home: "ہوم",
    nav_products: "لیب",
    nav_wishlist: "خواہش کی فہرست",
    nav_cart: "کارٹ",
    nav_admin: "ایڈمن پینل",
    nav_profile: "میری پروفائل",
    nav_orders: "میرے آرڈرز",
    nav_logout: "لاگ آؤٹ",
    nav_search_placeholder: "مصنوعات تلاش کریں...",
    nav_login: "لاگ ان",
    
    hero_tag: "جیمنی AI سے چلنے والا",
    hero_title_1: "اپ گریڈ کریں اپنی",
    hero_title_2: "ڈیجیٹل لائف اسٹائل",
    hero_desc: "بنگلہ دیش میں ریئل ٹائم AI تجاویز اور ہموار bKash ادائیگی کے ساتھ اگلی نسل کے ای کامرس کا تجربہ کریں۔",
    button_explore: "مجموعہ تلاش کریں",
    button_learn: "مزید جانیں",
    ai_rec_title: "AI تجویز کردہ",
    ai_rec_tagline: "اسمارٹ شاپ AI اعلیٰ کارکردگی والے الیکٹرانکس اور پریمیم کوالٹی میں آپ کی دلچسپی کی بنیاد پر ان کی تجویز کرتا ہے۔",
    match: "میچ",
    
    badge_secure: "محفوظ ادائیگی",
    badge_secure_desc: "100% محفوظ ادائیگیاں",
    badge_shipping: "مفت شپنگ",
    badge_shipping_desc: "5000 ٹکا سے زیادہ کے آرڈرز پر",
    badge_returns: "آسان واپسی",
    badge_returns_desc: "7 دن کی آسان واپسی کی پالیسی",
    badge_support: "AI مدد",
    badge_support_desc: "24/7 اسمارٹ امداد",
    
    section_explore: "ایکسپلور کریں",
    section_popular_categories: "مقبول زمرے",
    cat_electronics: "الیکٹرانکس",
    cat_fashion: "فیشن",
    cat_home: "ہوم اور لیونگ",
    cat_groceries: "گروسری",
    products_count: "مصنوعات",
    
    promo_tag: "محدود پیشکش",
    promo_title: "سرمائی لباس پر 70 فیصد تک کی رعایت!",
    promo_desc: "بے مثال قیمتوں پر ہمارے پریمیم سرمائی مجموعہ کے ساتھ اپنی الماری کو اپ گریڈ کریں۔",
    promo_btn: "آفرز خریدیں",
    
    integrity_matrix_title: "سچائی میٹرکس",
    integrity_matrix_sub: "اسمارٹ شاپ تصدیق شدہ پروٹوکول",
    integrity_origin: "پراڈکٹ کا مستند ذریعہ",
    integrity_bkash: "محفوظ bKash ادائیگی نوڈ",
    integrity_return: "7 دن کی واپسی کا گیٹ وے",
    
    priority_layer_title: "ترجیحی سطح",
    priority_logistic: "لاجسٹکس پیرامیٹرز",
    priority_policy: "پالیسی فریم ورک",
    priority_contact: "رابطہ لنکس",
    
    write_review: "تبصرہ لکھیں",
    sentiment_value: "درجہ بندی کی قدر",
    transmission_data: "تبصرہ کی تفصیلات",
    comment_placeholder: "اپنا تجربہ یہاں درج کریں...",
    "btn_submit_review": "تبصرہ جمع کریں",
    zero_reviews: "کوئی تبصرہ نہیں ملا",
    first_review: "پہلا تبصرہ کرنے والے بنیں!",
    pulse_reviews: "نبض کے جائزے",
    validated_matrix: "تصدیق شدہ تجربہ میٹرکس",
    btn_ai_summary: "بنیادی میٹرکس بنایں",
    synthetic_overview: "مصنوعی ذہانت جائزہ",
    
    btn_init_access: "کارٹ میں شامل کریں",
    logistics_label: "لاجسٹکس",
    global_express: "گلوبل ایکسپریس",
    standard_label: "معیاری",
    seven_d_res: "7D حل",
    protocol_label: "پروٹوکول:",
    sync_link: "لنک مطابقت پذیری"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
