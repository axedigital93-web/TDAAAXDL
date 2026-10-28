import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { WHATSAPP_PHONE, WHATSAPP_MESSAGES } from '../utils/whatsapp';

const PricingSection: React.FC = () => {
  const pricingPlans = [
    {
      id: 1,
      name: "Découverte",
      price: "350 000",
      currency: "FCFA",
      description: "L'essentiel pour démarrer votre transformation numérique.",
      featured: false,
      buttonText: "Je réserve mon audit",
      features: [
        "Audit de votre système d'information",
        "Identification des processus automatisables",
        "Recommandations stratégiques IA",
        "Rapport détaillé",
        "1 séance de conseil"
      ]
    },
    {
      id: 2,
      name: "Croissance",
      price: "750 000",

      currency: "FCFA",
      description: "Pour passer à l'action avec des résultats concrets.",
      featured: true,
      buttonText: "Je démarre ma transformation",
      features: [
        "Tout de la formule Découverte +",
        "Conception et déploiement d'un agent IA pilote",
        "Développement d'une application métier simple",
        "Suivi et optimisation continues",
        "Support prioritaire"
      ]
    },
    {
      id: 3,
      name: "Performance",
      price: "1 500 000",
      currency: "FCFA",
      
      description: "La solution complète pour les entreprises ambitieuses.",
      featured: false,
      buttonText: "Je veux une solution sur-mesure",
      features: [
        "Tout de la formule Croissance +",
        "Agents IA déployés à grande échelle",
        "Applications métiers complexes",
        "Application mobile incluse",
        "Équipe dédiée (chef de projet, développeurs, data scientist)",
        "Maintenance et évolution en continu"
      ]
    }
  ];

  const CheckIcon = ({ isFeatured = false }: { isFeatured?: boolean }) => (
    <Check className={`w-5 h-5 ${isFeatured ? 'text-white' : 'text-green-500'}`} />
  );

  return (
    <section id="nos-formules" className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full"></div>
      
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
            Nos formules adaptées à chaque projet
            <br />
            <span className="text-brand-blue  bg-clip-text">
              et chaque budget
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Une tarification transparente qui respecte votre budget. Pas de mauvaise surprise.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative ${
                index === 1
                  ? 'bg-[#0238d6] shadow-2xl border border-[#0238d6]'
                  : 'bg-white shadow-xl border border-gray-200'
              } rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300`}
            >
              <div className="relative p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                    index === 1 ? 'text-white' : 'text-gray-900'
                  }`}>
                    Pack{' '}
                    <span className={index === 1 ? 'text-white' : 'text-brand-blue'}>
                      {plan.name}
                    </span>
                  </h3>
                  
                  {(index === 1 || index === 2) && (
                    <div className={`text-sm font-medium mb-1 ${
                      index === 1 ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      À partir de
                    </div>
                  )}
                  
                  <div className="flex items-baseline justify-center mb-4">
                    <span className={`text-4xl md:text-5xl font-bold ${
                      index === 1 ? 'text-white' : 'text-brand-blue'
                    }`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ml-2 ${
                      index === 1 ? 'text-white/80' : 'text-gray-600'
                    }`}>{plan.currency}</span>
                  </div>

                  <p className={`leading-relaxed ${
                    index === 1 ? 'text-white/90' : 'text-gray-600'
                  }`}>{plan.description}</p>
                </div>

                {/* Features List */}
                <div className="mb-8">
                  <h4 className={`text-lg font-semibold mb-4 ${
                    index === 1 ? 'text-white' : 'text-gray-900'
                  }`}>Ce qui est inclus</h4>
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full ${
                          index === 1 ? 'bg-white/20' : 'bg-green-100'
                        } flex items-center justify-center mt-0.5`}>
                          <Check className={`w-5 h-5 ${
                            index === 1 ? 'text-white' : 'text-green-500'
                          }`} />
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          index === 1 ? 'text-white/90' : 'text-gray-600'
                        }`}>
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <motion.a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGES.pack(plan.name))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`block w-full text-center py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    index === 1
                      ? 'bg-white text-[#0238d6] shadow-lg hover:shadow-xl'
                      : 'bg-[#0238d6] text-white shadow-lg shadow-[#0238d6]/30 hover:shadow-xl hover:shadow-[#0238d6]/40'
                  }`}
                >
                  {plan.buttonText}
                </motion.a>
              </div>

              {/* Corner Accents */}
              <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${
                index === 1 ? 'border-white/30' : 'border-brand-blue/30'
              } rounded-tl-3xl`}></div>
              <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${
                index === 1 ? 'border-white/30' : 'border-purple-500/30'
              } rounded-tr-3xl`}></div>
              <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${
                index === 1 ? 'border-white/30' : 'border-brand-blue/30'
              } rounded-bl-3xl`}></div>
              <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${
                index === 1 ? 'border-white/30' : 'border-purple-500/30'
              } rounded-br-3xl`}></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Background Shapes */}
      <div className="absolute left-0 bottom-1/4 w-32 h-32 bg-blue-200/20 rounded-full"></div>
      <div className="absolute right-0 top-1/3 w-40 h-40 bg-purple-200/20 rounded-full"></div>
    </section>
  );
};

export default PricingSection;