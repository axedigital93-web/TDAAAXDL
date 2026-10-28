import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, Zap, Users, Bot } from 'lucide-react';

const WhySection: React.FC = () => {
  const comparisonData = [
    {
      id: 1,
      title: "Approche traditionnelle",
      icon: <Bot className="w-6 h-6" />,
      featured: false,
      items: [
        "Solutions importées non adaptées",
        "Pas d'expertise IA",
        "Applications non fonctionnelles hors-ligne",
        "Maintenance facturée en sus",
        "Accompagnement limité"
      ],
      color: "gray"
    },
    {
      id: 2,
      title: "Freelance ou agence classique",
      icon: <Users className="w-6 h-6" />,
      featured: false,
      items: [
        "Adaptation au contexte local : rare",
        "Agents IA : inexistants",
        "Apps mobiles offline : non",
        "Maintenance locale : payante à l'heure",
        "Accompagnement : limité"
      ],
      color: "gray"
    },
    {
      id: 3,
      title: "Axe Digital",
      icon: <Zap className="w-6 h-6" />,
      featured: true,
      items: [
        "Conçu pour l'Afrique (jamais importé)",
        "Expertise centrale en agents IA",
        "Applications mobiles offline",
        "Maintenance locale incluse",
        "Accompagnement de A à Z"
      ],
      color: "brand"
    }
  ];

  return (
    <section id="why" className="relative py-20 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Pourquoi <span className="text-[#0238d6]">50 entreprises</span><br />nous ont-elles choisi ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La différence entre un projet numérique qui échoue
            et une transformation qui réussit.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {comparisonData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className={`relative group ${
                item.featured ? 'lg:scale-105 lg:-translate-y-2' : ''
              }`}
            >
              {/* Main Card */}
              <div className={`relative h-full backdrop-blur-sm border-2 rounded-3xl overflow-hidden transition-all duration-300 ${
                item.featured
                  ? 'bg-gradient-to-br from-[#0238d6] to-blue-700 text-white shadow-2xl shadow-blue-500/25 border-blue-200'
                  : 'bg-white/80 text-gray-900 shadow-xl shadow-gray-200/50 border-gray-100 hover:shadow-2xl hover:shadow-gray-300/30'
              }`}>
                
                {/* Featured Ribbon */}
                {/* {item.featured && (
                  <div className="absolute top-6 -right-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 text-sm font-bold shadow-lg rotate-45 translate-x-2">
                    <Star className="w-4 h-4 inline mr-1" />
                    RECOMMANDÉ
                  </div>
                )} */}

                <div className="relative p-8 h-full flex flex-col">
                  {/* Card Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                      item.featured
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-blue-50 text-[#0238d6] border border-blue-100'
                    }`}>
                      {item.icon}
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold ${
                      item.featured ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                  </div>

                  {/* Features List */}
                  <div className="flex-1 space-y-4">
                    {item.items.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: featureIndex * 0.1 + index * 0.1 }}
                        className={`flex items-start gap-3 p-3 rounded-xl ${
                          item.featured
                            ? 'bg-white/10 border border-white/20'
                            : 'bg-blue-50/50 border border-blue-100'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                          item.featured
                            ? 'bg-green-400/20 text-green-300'
                            : item.id === 3
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-500'
                        }`}>
                          {item.id === 3 ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          item.featured ? 'text-blue-50' : 'text-gray-700'
                        }`}>
                          {feature}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom Status */}
                  <div className="mt-8 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      item.featured
                        ? 'bg-white/20 text-white border border-white/30'
                        : item.id === 1
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {item.id === 3 ? (
                        <>
                          <Check className="w-4 h-4" />
                          Solution optimale
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          {item.id === 1 ? 'Risqué' : 'Intermédiaire'}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                {item.featured && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl pointer-events-none"></div>
                )}
              </div>

              {/* Connection Lines for Desktop */}
              {index < comparisonData.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-gray-200 z-0"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}        {/* CTA under comparison table */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="backdrop-blur-sm bg-white/80 rounded-3xl p-8 border border-gray-100 shadow-xl max-w-lg mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Rejoignez la catégorie "Solution optimale"
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById('nous-contacter');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="bg-[#0238d6] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all inline-flex items-center gap-2"
            >
              Réservez votre appel découverte
            </motion.button>
          </div>
        </motion.div> */}

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#0238d6] to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/25 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">+85%</div>
                <div className="text-blue-100">Augmentation conversion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">-60%</div>
                <div className="text-blue-100">Coût d'acquisition</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">×3</div>
                <div className="text-blue-100">Retour sur investissement</div>
              </div>
            </div>
          </div> 
        </motion.div>*/}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <div className="backdrop-blur-sm bg-white/80 rounded-3xl p-8 border border-gray-100 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Prêt à transformer votre entreprise avec l'IA ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Rejoignez les marques qui ont choisi l'excellence et obtiennent des résultats concrets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => {
                  const element = document.getElementById('nos-formules');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#0238d6] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Démarrer mon projet
              </motion.button>
              <motion.a
                href="#portfolio"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#portfolio')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all inline-block cursor-pointer"
              >
                Voir nos réalisations
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-blue-300 rounded-full opacity-40 animate-float"></div>
      <div className="absolute bottom-40 left-20 w-6 h-6 bg-blue-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-40 w-3 h-3 bg-blue-300 rounded-full opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
          }
          50% { 
            transform: translateY(-15px) scale(1.05); 
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default WhySection;