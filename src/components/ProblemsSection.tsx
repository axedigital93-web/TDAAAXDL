import React from 'react';
import { motion } from 'framer-motion';
import AppImage from '../image/AppImage';

const ProblemsSection: React.FC = () => {
  const problems = [
    {
      id: 1,
      title: "Sans IA, votre service client",
      highlightedTitle: "perd des opportunités",
      description: "Sans agent IA, vos équipes passent 80% de leur temps sur des tâches répétitives. Les demandes clients s'accumulent et les opportunités disparaissent la nuit, le week-end, pendant les fêtes.",
      image: {
        src: AppImage.problemAiAgent,
        srcSet: "",
        alt: "Dashboard agent IA pour service client"
      },
      reverse: false
    },
    {
      id: 2,
      title: "Des logiciels génériques qui",
      highlightedTitle: "ne correspondent pas",
      description: "Les outils standard ignorent les spécificités du marché africain : devises locales, langues, paiements mobile money, connectivité. Résultat : des processus hybrides, des erreurs et une perte de temps colossale.",
      image: {
        src: AppImage.problemBusinessApp,
        srcSet: "",
        alt: "Application métier sur-mesure pour Afrique"
      },
      reverse: true
    },
    {
      id: 3,
      title: "Applications mobiles qui",
      highlightedTitle: "ne fonctionnent pas en Afrique",
      description: "Les apps conçues ailleurs tombent en panne dès que la connexion est instable, consomment trop de données et ignorent les usages locaux. Vos utilisateurs abandonnent après la première déception.",
      image: {
        src: AppImage.problemMobileApp,
        srcSet: "",
        alt: "Application mobile offline-first pour l'Afrique"
      },
      reverse: false
    },
    {
      id: 4,
      title: "Gestion manuelle",
      highlightedTitle: "chronophage et risquée",
      description: "Tableaux Excel, papiers, appels téléphoniques : votre organisation perd en efficacité et en compétitivité. Chaque heure perdue sur l'administratif est une heure de moins pour développer votre activité.",
      image: {
        src: AppImage.problemNoDigital,
        srcSet: "",
        alt: "Gestion manuelle sans outils digitaux"
      },
      reverse: true
    }
  ];

  return (
    <section id="problems" className="relative py-20 bg-gradient-to-b from-white to-gray-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Section Header */}
      <div className="container mx-auto px-4 text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
        >
          Pourquoi votre entreprise <br />
          <span className="text-brand-blue">n'avance pas sans IA</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed"
        >
          Les erreurs stratégiques qui ralentissent votre croissance digitale
        </motion.p>
      </div>

      {/* Problems Grid */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-8 lg:space-y-20">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="relative"
            >
              {/* Glass Container */}
              <div className={`
                relative backdrop-blur-lg bg-white/70 rounded-3xl 
                border border-white/20 shadow-2xl
                hover:shadow-3xl transition-all duration-500
                overflow-hidden
                ${problem.reverse ? 'lg:pr-8' : 'lg:pl-8'}
              `}>
                {/* 3D Shadow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 rounded-3xl"></div>
                
                {/* Inner Glow */}
                <div className="absolute inset-0 rounded-3xl border border-white/40 shadow-inner"></div>

                <div className={`relative flex flex-col ${
                  problem.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-6 lg:gap-8 p-6 lg:p-8`}>
                  
                  {/* Text Content */}
                  <div className="flex-1 lg:w-1/2 relative z-10">
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-4xl lg:text-4xl font-bold text-gray-900">
                        {problem.title}{' '}
                        <span className="text-brand-blue bg-clip-text ">
                          {problem.highlightedTitle}
                        </span>
                      </h3>
                    </div>
                    
                    <div className="mb-6 lg:mb-8">
                      <p className="text-lg text-gray-700 leading-relaxed backdrop-blur-sm">
                        {problem.description}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand-blue/10 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500/10 rounded-full blur-sm"></div>
                  </div>

                  {/* Image Content */}
                  <div className="flex-1 lg:w-1/2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative rounded-2xl overflow-hidden shadow-xl 
                        border border-white/20 
                        bg-gradient-to-br from-white to-gray-50
                        hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Image Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 z-10 pointer-events-none"></div>
                      
                      <img
                        src={problem.image.src}
                        alt={problem.image.alt}
                        loading="lazy"
                        className="w-full h-auto object-cover relative z-0"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-blue/30 rounded-tl-3xl"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/30 rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-blue/30 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/30 rounded-br-3xl"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 w-4 h-4 bg-brand-blue/20 rounded-full blur-sm animate-float"></div>
      <div className="absolute bottom-1/3 left-10 w-6 h-6 bg-purple-500/20 rounded-full blur-sm animate-float" style={{ animationDelay: '2s' }}></div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ProblemsSection;