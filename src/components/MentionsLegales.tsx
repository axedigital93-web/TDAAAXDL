import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const MentionsLegales: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-20 px-4 flex flex-col items-center justify-center bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">Mentions Légales</h1>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 prose max-w-none text-gray-600">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Éditeur du site</h2>
            <p className="mb-6">
              Le site est édité par Axe Digital, cabinet de consulting IA & Solutions numériques.<br/>
              Adresse : Ange Raphael, fin barrière ESSEC<br/>
              Email : contact@axedigital.agency<br/>
              Téléphone : (+237) 656523837
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Hébergement</h2>
            <p className="mb-6">
              Le site est hébergé par des fournisseurs d'infrastructures cloud professionnels garantissant la sécurité et la disponibilité de nos services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Propriété intellectuelle</h2>
            <p className="mb-6">
              L'ensemble du contenu (textes, images, vidéos, architectures des solutions IA, etc.) est la propriété exclusive de Axe Digital. Toute reproduction est strictement interdite sans autorisation préalable.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MentionsLegales;
