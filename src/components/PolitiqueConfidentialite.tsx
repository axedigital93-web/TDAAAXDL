import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PolitiqueConfidentialite: React.FC = () => {
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">Politique de Confidentialité</h1>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 prose max-w-none text-gray-600">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Collecte des données</h2>
            <p className="mb-6">
              Dans le cadre de nos activités d'intégration de solutions IA et digitales, nous pouvons être amenés à collecter certaines données (nom, email, informations sur votre entreprise) lorsque vous utilisez nos formulaires de contact ou nos services en ligne.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Utilisation des données</h2>
            <p className="mb-6">
              Vos données sont utilisées exclusivement pour vous fournir nos services (audit IA, accompagnement digital), vous recontacter suite à une demande, et améliorer l'expérience sur nos plateformes. Axe Digital s'engage à ne jamais revendre vos données à des tiers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Sécurité</h2>
            <p className="mb-6">
              Nos agents IA (comme Axe Health, Axso, etc.) sont développés avec une architecture sécurisée pour garantir la confidentialité absolue de vos données et de celles de vos patients ou clients.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PolitiqueConfidentialite;
