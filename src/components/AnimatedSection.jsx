import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({ children, className, variant = "container" }) => {
  const variants = {
    container: {
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.8 } }
    },
    slideIn: {
      hidden: { opacity: 0, x: -50 },
      show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants[variant]}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
