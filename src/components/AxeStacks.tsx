import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const AxeStacks: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-20 px-4 flex flex-col items-center justify-center bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Découvrez <span className="text-[#0238d6]">Axe Stack</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Nos solutions propriétaires conçues pour propulser votre entreprise dans l'ère du digital. 
            Découvrez nos agents IA et outils métiers spécialisés.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Axe Health Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Image Frame */}
            <div className="w-full h-48 rounded-2xl bg-gray-50 flex items-center justify-center p-2 mb-6 border border-gray-100">
              <img 
                src="/assets/Logo/axe-health-logo.png" 
                alt="Axe Health Logo" 
                className="w-full h-full object-contain drop-shadow-md scale-125"
              />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Axe Health</h3>
            <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
              L'assistant IA dédié aux structures de santé. Axe Health révolutionne la gestion hospitalière en automatisant vos tâches quotidiennes en temps réel pour un accompagnement patient optimal.
            </p>

            {/* Button */}
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="bg-[#0238d6] text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group mt-auto"
            >
              Découvrir la solution
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Axso Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Image Frame */}
            <div className="w-full h-48 rounded-2xl bg-gray-50 flex items-center justify-center p-6 mb-6 border border-gray-100">
              <img 
                src="/assets/Logo/logo_noir.png" 
                alt="Axso Logo" 
                className="max-w-full max-h-full object-contain drop-shadow-md"
              />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Axso</h3>
            <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
              La plateforme e-commerce pensée pour les entrepreneurs africains. Simple, puissante, et adaptée à vos besoins.
            </p>

            {/* Button */}
            <a 
              href="https://axso.vercel.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0238d6] text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group mt-auto"
            >
              Découvrir la solution
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AxeStacks;
