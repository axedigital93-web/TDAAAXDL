import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Settings, Smartphone, ArrowRight } from 'lucide-react';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../utils/whatsapp';

const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <Settings className="w-10 h-10 text-red-500" />,
      title: "Vous utilisez encore des processus manuels",
      description: "Des tâches répétitives consomment votre temps et votre énergie. Nos agents IA les automatisent en quelques semaines."
    },
    {
      icon: <Smartphone className="w-10 h-10 text-orange-500" />,
      title: "Vos outils numériques ne sont pas adaptés à l'Afrique",
      description: "Les solutions venues d'ailleurs échouent souvent sur le continent. Nous concevons des applications qui marchent réellement ici."
    },
    {
      icon: <AlertCircle className="w-10 h-10 text-brand-blue" />,
      title: "Vous n'avez pas de stratégie IA claire",
      description: "L'IA sans stratégie, c'est du budget gaspillé. Nous vous accompagnons de la réflexion à l'exécution."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Pourquoi votre <span className="text-brand-blue">entreprise</span><br />
            n'exploite pas encore tout le <span className="text-brand-blue">potentiel</span><br />
            de l'<span className="text-brand-blue">IA</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Les 3 erreurs qui freinent votre transformation numérique
            (et comment les corriger dès maintenant)
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openWhatsApp(WHATSAPP_MESSAGES.contact)}
            className="bg-brand-blue text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40 transition-all inline-flex items-center gap-2"
          >
            Corrigez ces 3 erreurs dès maintenant <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
