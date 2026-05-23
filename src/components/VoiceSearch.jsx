import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const VoiceSearch = ({ className = '', onSearch, placeholder }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const { isDarkMode } = useTheme();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Detect changes in search query to manage clear buttons
    setShowClear(query.length > 0);
  }, [query]);

  // Clean up SpeechRecognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery) {
      if (onSearch) {
        onSearch(cleanQuery);
      } else {
        navigate(`/products?search=${encodeURIComponent(cleanQuery)}`);
      }
    }
  };

  const getRecognitionLanguageCode = () => {
    switch (language) {
      case 'bn': return 'bn-BD';
      case 'hi': return 'hi-IN';
      case 'ur': return 'ur-PK';
      default: return 'en-US';
    }
  };

  const toggleVoiceListening = () => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Swal.fire({
        icon: 'warning',
        title: t('voice_not_supported_title') || 'Web Speech API Unsupported',
        text: t('voice_not_supported_desc') || 'Your browser does not support voice input. Please try updating Google Chrome, Safari, or Microsoft Edge for the best experience.',
        confirmButtonColor: '#F97316',
        background: isDarkMode ? '#111827' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#111827',
      });
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setIsListening(false);

            // Automatically trigger search when voice-to-text finishes
            setTimeout(() => {
              if (onSearch) {
                onSearch(transcript.trim());
              } else {
                navigate(`/products?search=${encodeURIComponent(transcript.trim())}`);
              }
            }, 600);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (event.error === 'not-allowed') {
            Swal.fire({
              icon: 'warning',
              title: 'Microphone Access Denied',
              text: 'Please grant microphone access permission in your browser or iframe settings. If you’re testing in the sandboxed preview, clicking "Open in New Tab" can help bypass strict iframe security policies.',
              confirmButtonColor: '#F97316',
              background: isDarkMode ? '#111827' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#111827',
            });
          } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
            Swal.fire({
              icon: 'error',
              title: 'Voice Search Error',
              text: `Speech recognition encountered an error: ${event.error}`,
              confirmButtonColor: '#F97316',
              background: isDarkMode ? '#111827' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#111827',
            });
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      // Configure current language code
      recognitionRef.current.lang = getRecognitionLanguageCode();
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form 
      onSubmit={handleSearchSubmit} 
      className={`w-full relative group transition-all duration-300 ${className}`}
      aria-label="Product Search"
    >
      <div className={`glass-panel p-2 flex items-center shadow-2xl relative transition-all duration-300 ${
        isListening
          ? 'ring-2 ring-[#F97316] border-[#F97316]/50 bg-orange-50/5 dark:bg-[#F97316]/5'
          : isDarkMode
            ? 'border-white/10 bg-white/5 hover:border-white/20'
            : 'border-orange-100 bg-white hover:border-orange-200'
      } rounded-3xl backdrop-blur-3xl`}>
        
        {/* Search Icon */}
        <div className="pl-4 text-primary shrink-0 flex items-center justify-center">
          <Search className={`w-5 h-5 transition-transform duration-300 ${isListening ? 'scale-110 text-[#F97316]' : 'text-gray-400 group-hover:scale-105'}`} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isListening ? (language === 'bn' ? 'শুনছি... অনুগ্রহ করে বলুুুুুুুুুন' : language === 'hi' ? 'सुन रहा हूँ... बोलिए' : language === 'ur' ? 'سن رہا ہوں...' : 'Listening... speak clearly') : (placeholder || t('nav_search_placeholder'))}
          className="w-full bg-transparent border-none px-4 py-3.5 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-450 dark:placeholder:text-white/30 focus:outline-none focus:ring-0"
          aria-label="Search items"
          disabled={isListening}
        />

        {/* Action Controls */}
        <div className="flex items-center gap-2 pr-2 shrink-0">
          <AnimatePresence>
            {showClear && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                className={`p-2 rounded-xl transition-colors shrink-0 flex items-center justify-center ${
                  isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
                title="Clear Search"
                aria-label="Clear Search Input"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Microphone Voice Search Button */}
          <div className="relative flex items-center justify-center shrink-0">
            {isListening && (
              <>
                <motion.span
                  animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 bg-[#F97316]/30 dark:bg-[#F97316]/40 rounded-full"
                />
                <motion.span
                  animate={{ scale: [1, 2.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="absolute inset-0 bg-[#F97316]/25 dark:bg-[#F97316]/30 rounded-full"
                />
              </>
            )}

            <button
              type="button"
              onClick={toggleVoiceListening}
              className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer relative z-10 ${
                isListening
                  ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/50'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-400 hover:text-[#F97316] hover:bg-gray-750'
                    : 'bg-orange-50 text-gray-500 hover:text-[#F97316] hover:bg-orange-100/50'
              }`}
              title={isListening ? "Stop listening" : "Search by voice"}
              aria-label={isListening ? "Stop listening to voice" : "Search using Voice Recognition"}
              aria-pressed={isListening}
            >
              {isListening ? (
                <Mic className="w-4.5 h-4.5 animate-bounce" />
              ) : (
                <Mic className="w-4.5 h-4.5" />
              )}
            </button>
          </div>

          {/* Search Button (Hidden on tiny screens to optimize layout space, prominent elsewhere) */}
          <button
            type="submit"
            className="hidden sm:inline-flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all transform active:scale-95 cursor-pointer shrink-0"
            aria-label="Confirm Search Query"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Screen Reader Announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {isListening ? "Speech recognition engine active. Speak now." : ""}
        {query && !isListening ? `Recognized text: ${query}` : ""}
      </div>
    </form>
  );
};

export default VoiceSearch;
