import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '../image/AppImage';

/**
 * Preloader — Écran de chargement affiché au démarrage du site.
 * Utilise l'image preload.png (/assets/preload.png) comme logo.
 */
const Preloader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [windowReady, setWindowReady] = useState(false);

  useEffect(() => {
    // Garantit un délai maximum de 1s pour éviter tout blocage si des scripts tierces tardent
    const fallbackTimer = setTimeout(() => {
      setWindowReady(true);
    }, 1000);

    if (document.readyState === 'complete') {
      setWindowReady(true);
    } else {
      const onLoad = () => setWindowReady(true);
      window.addEventListener('load', onLoad);
      return () => {
        window.removeEventListener('load', onLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  useEffect(() => {
    if (windowReady) {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [windowReady]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
          aria-hidden="true"
        >
          <motion.img
            src={AppImage.preload}
            alt="Axe Digital"
            initial={{ opacity: 1, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-40 w-40 md:h-56 md:w-56 object-contain"
            loading="eager"
            decoding="sync"
          />
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-gray-200"
          >
            <motion.div
              className="h-full rounded-full bg-brand-blue"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

};

export default Preloader;
