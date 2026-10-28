import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';



const SolutionsSection: React.FC = () => {
  const solutions = [
    {
      id: 1,
      title: "Agents IA",
      highlightedTitle: "intelligents",
      description: "Des assistants virtuels qui travaillent 24h/24, 7j/7. Automatisation du service client, de la qualification de leads, du traitement de documents, et bien plus encore.",
      imageSrc: '/assets/solutions/img1.webp', // ✅ PERF: WebP (61Ko au lieu de 1,7Mo)
      cta: "Je veux un agent IA pour mon entreprise",
      reverse: false
    },
    {
      id: 2,
      title: "Applications métiers",
      highlightedTitle: "sur-mesure",
      description: "Des logiciels de gestion adaptés à votre secteur d'activité. Gestion de stock, CRM, ERP, RH, comptabilité : on construit l'outil qu'aucun éditeur ne peut vous fournir.",
      imageSrc: '/assets/solutions/img2.webp', // ✅ PERF: WebP (46Ko au lieu de 1,6Mo)
      cta: "Je veux mon application métier",
      reverse: true
    },
    {
      id: 3,
      title: "Applications mobiles",
      highlightedTitle: "pour l'Afrique",
      description: "Des applications Android et iOS pensées pour l'Afrique. Optimisées pour les connexions instables, légères en données, et adaptées aux usages locaux.",
      imageSrc: '/assets/solutions/img3.webp', // ✅ PERF: WebP (99Ko au lieu de 1,7Mo)
      cta: "Je veux mon application mobile",
      reverse: false
    }
  ];


  const handleSolutionClick = (solutionName: string) => {
    const message = `Bonjour, je suis intéressé(e) par votre solution : ${solutionName}. Pouvez-vous me donner plus de détails ?`;
    openWhatsApp(message);
  };

  return (
    <section id="solutions-ia" className="relative py-20 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
        >
          3 solutions sur-mesure<br />
          pour votre <span className="text-brand-blue">entreprise en Afrique</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed"
        >
          Chaque solution est conçue, développée et testée
          pour fonctionner dans le contexte africain.
        </motion.p>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-8 lg:space-y-12">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="relative"
            >
              <div className={`
                relative backdrop-blur-lg bg-white/80 rounded-3xl 
                border border-white/20 shadow-lg
                hover:shadow-xl transition-all duration-500
                overflow-hidden
                ${solution.reverse ? 'lg:pr-8' : 'lg:pl-8'}
              `}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 rounded-3xl"></div>
                <div className="absolute inset-0 rounded-3xl border border-white/40 shadow-inner"></div>
                <div className={`relative flex flex-col ${
                  solution.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-6 lg:gap-8 p-6 lg:p-8`}>
                  <div className="flex-1 lg:w-1/2 relative z-10">
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                        {solution.title}{' '}
                        <span className="text-brand-blue bg-clip-text">
                          {solution.highlightedTitle}
                        </span>
                      </h3>
                    </div>
                    <div className="mb-6 lg:mb-8">
                      <p className="text-lg text-gray-700 leading-relaxed backdrop-blur-sm">
                        {solution.description}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSolutionClick(solution.cta)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {solution.cta} <ArrowRight className="w-4 h-4" />
                    </motion.button>
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/10 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-blue/10 rounded-full blur-sm"></div>
                  </div>
                  <div className="flex-1 lg:w-1/2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="relative w-full h-full">
                          <img
                            src={solution.imageSrc}
                            alt={`${solution.title} ${solution.highlightedTitle}`}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent" />
                          {/* titre supprimé ici pour éviter tout élément/overlay non désiré */}

                        </div>

                    </motion.div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/30 rounded-tl-3xl"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-blue/30 rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/30 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-blue/30 rounded-br-3xl"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default SolutionsSection;
