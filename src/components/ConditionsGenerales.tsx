import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ConditionsGenerales: React.FC = () => {
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">Conditions Générales</h1>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 prose max-w-none text-gray-600">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Objet</h2>
            <p className="mb-6">
              Les présentes conditions visent à définir les modalités de prestation de services de la société Axe Digital, spécialisée dans la création de solutions numériques et l'intégration d'intelligence artificielle pour les entreprises africaines.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Prestations</h2>
            <p className="mb-6">
              Axe Digital propose le développement d'agents IA (Axe Stack), la refonte de sites web, et des audits digitaux. Toute prestation fait l'objet d'un devis préalable ou de la souscription à une de nos formules d'abonnement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Responsabilité</h2>
            <p className="mb-6">
              Axe Digital s'engage à mettre en œuvre tous les moyens nécessaires pour fournir un service de haute qualité technologique. Toutefois, Axe Digital ne saurait être tenue responsable des interruptions de service liées à des facteurs externes (pannes d'hébergement tierces, etc.).
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConditionsGenerales;
