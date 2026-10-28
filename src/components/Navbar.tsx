import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '../image/AppImage';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../utils/whatsapp';

interface NavbarProps {
  currentPath?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href === '#axe-stacks') {
      window.location.hash = href;
      window.scrollTo(0, 0);
      return;
    }

    if (window.location.hash === '#axe-stacks') {
      // Navigate back to the home page first
      window.location.hash = href === '#' ? '' : href;
      // Delay scrolling to allow DOM to render the home page sections
      setTimeout(() => {
        const targetId = href.replace('#', '');
        if (targetId) {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const targetId = href.replace('#', '');
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    openWhatsApp(WHATSAPP_MESSAGES.commander);
  };

  const navLinks = [
    { name: 'Nos réalisations', href: '#nos-realisations' },
    { name: 'Nos solutions', href: '#solutions-ia' },
    { name: 'Axe Stack', href: '#axe-stacks' },
    { name: 'Nos formules', href: '#nos-formules' },
    { name: 'Ils nous font confiance', href: '#ils-nous-font-confiance' },
    { name: 'Nous contacter', href: '#nous-contacter' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex justify-center pt-3 md:pt-4 px-4 md:px-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full max-w-6xl transition-all duration-300 rounded-full px-4 md:px-8 py-3 md:py-3 flex items-center justify-between ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg border border-gray-100' 
            : 'bg-white shadow-md'
        }`}
      >
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="text-2xl font-bold flex items-center gap-1">
            <img src={AppImage.partenaire2} alt="Logo" className="h-12 md:h-20 w-auto" />
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button 
            onClick={handleWhatsAppClick}
            className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black hover:scale-105 transition-all duration-300 shadow-md"
          >
            Demander un audit
          </button>
        </div>
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="text-gray-800 w-5 h-5" /> : <Menu className="text-gray-800 w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 md:hidden border border-gray-100"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  handleNavClick(e, link.href);
                  setIsMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={handleWhatsAppClick}
              className="bg-black text-white w-full py-3 rounded-xl mt-2 font-medium"
            >
              Demander un audit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;