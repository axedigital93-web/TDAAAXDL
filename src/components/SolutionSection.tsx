import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  TrendingUp,
  MousePointer2,
} from "lucide-react";
import { openWhatsApp, WHATSAPP_MESSAGES } from '../utils/whatsapp';

const SolutionSection: React.FC = () => {
  return (
    <section id="axe-growth" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Et si votre transformation numérique
            <br />
            devenait votre <span className="text-brand-blue">meilleur investissement</span> ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto mt-6"
          >
            Avec notre accompagnement de A à Z, nos clients obtiennent
            un ROI +350% en 6 mois.



          </motion.p>

        </div>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Visual Representation (Mock Dashboard) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Mock Browser Header */}
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              {/* Mock Dashboard Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-8 w-48 bg-gray-800 rounded"></div>
                  </div>
            <div className="h-10 w-10 bg-brand-blue rounded-full flex items-center justify-center text-white">
                    <TrendingUp size={20} />
                  </div>
                </div>
                {/* Graph Mockup */}
                <div className="flex items-end gap-2 h-40 mb-6 px-2 border-b border-l border-gray-100">
                  {[40, 65, 50, 80, 75, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-brand-blue/10 rounded-t-md hover:bg-brand-blue/80 transition-colors relative group"
                      style={{ height: `${h}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                        {h * 12}K
                      </div>
                    </div>
                  ))}
                </div>
                {/* Stats Cards Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="text-green-600 text-sm font-medium mb-1">
                      Productivité
                    </div>
                      <div className="text-2xl font-bold text-gray-900">
                      350%
                    </div>
                    <div className="text-green-600 text-xs mt-1">↗ 350%</div>



                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-brand-blue text-sm font-medium mb-1">
                      Orders
                    </div>
                    <div className="text-2xl font-bold text-gray-900">616</div>
                    <div className="text-brand-blue text-xs mt-1">↗ 5.5K%</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-10 -right-10 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 z-20"
            >
              <div className="text-blue-500 font-bold text-4xl">AI</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, delay: 1 }}
              className="absolute -bottom-5 -left-5 bg-[#000] text-white px-4 py-2 rounded-lg shadow-lg z-20 text-sm font-bold flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              ROI +350% en 6 mois
            </motion.div>
          </motion.div>
          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Une technologie sur-mesure pour automatiser et propulser votre croissance
            </h3>
            {[
              {
                title: "Agents IA intelligents",
                desc: "Des assistants virtuels 24h/24 qui automatisent votre service client, la gestion de leads et le traitement de documents.",
              },
              {
                title: "Applications métiers sur-mesure",
                desc: "Des logiciels de gestion (CRM, ERP, RH, stock) adaptés à votre secteur et aux réalités du marché africain.",
              },
              {
                title: "Applications mobiles offline-first",
                desc: "Des apps Android et iOS légères, optimisées pour les connexions instables et conçues pour les usages locaux.",
              },
            ].map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {solution.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {solution.desc}
                  </p>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              viewport={{ once: true }}
              className="pt-6 flex justify-center lg:justify-start"
            >
              <button
                onClick={() => {
                  const element = document.getElementById('nous-contacter');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-brand-blue text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                Découvrir notre méthodologie IA <MousePointer2 size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SolutionSection;
