import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Star, TrendingUp } from 'lucide-react';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../utils/whatsapp';

const CTASection: React.FC = () => {
  return (
    <section id="cta" className="relative py-20 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201.png"
          loading="lazy"
          sizes="(max-width: 4500px) 100vw, 4500px"
          srcSet="https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201-p-500.png 500w, https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201-p-800.png 800w, https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201-p-1080.png 1080w, https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201-p-1600.png 1600w, https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201-p-2000.png 2000w, https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201-p-2600.png 2600w, https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201-p-3200.png 3200w, https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fedcbe1b91502bcf846b4b_FAQ%20sans%20background_Plan%20de%20travail%201.png 4500w"
          alt="Background pattern"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#0238d6]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0238d6]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#0238d6]/10 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#0238d6] text-white rounded-full px-6 py-3 mb-8 shadow-lg shadow-[#0238d6]/30"
            >
              <Rocket className="w-5 h-5" />
              <span className="font-semibold text-sm">Prêt à passer à l'IA ?</span>
            </motion.div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Prêt à faire entrer votre entreprise<br />
              dans l'<span className="text-[#0238d6]">ère de l'IA</span> ?
            </h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Parlons de votre projet en 30 minutes.
              <br />
              <span className="text-gray-900 font-semibold">Sans engagement, sans pression.</span>
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto"
            >
              {[
                { icon: Star, text: "Stratégie personnalisée" },
                { icon: TrendingUp, text: "Résultats garantis" },
                { icon: Rocket, text: "Accompagnement expert" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <feature.icon className="w-6 h-6 text-[#0238d6]" />
                  <span className="text-gray-900 font-medium text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                onClick={() => {
                  const element = document.getElementById('nos-formules');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#0238d6] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl shadow-[#0238d6]/30 hover:shadow-[#0238d6]/50 transition-all duration-300 flex items-center gap-3"
              >
                <span>Réservez mon appel découverte</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => openWhatsApp(WHATSAPP_MESSAGES.contact)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                <span>Prendre rendez-vous</span>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">5/5 sur 50+ avis</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <div className="text-sm font-medium">+50 projets IA et solutions numériques</div>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <div className="text-sm font-medium">Support réactif 7j/7</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-[#0238d6]/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#0238d6]/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-[#0238d6]/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};

export default CTASection;