import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const statsData = [
  { value: '+50', label: 'projets IA et solutions', sub: 'numériques réalisés depuis 2024' },
  { value: '+250', label: 'de gain de productivité', sub: 'moyen pour nos clients' },
  { value: '+97%', label: 'de clients satisfaits', sub: 'recommandent nos services' },
];

const Stats: React.FC = () => {
  // Fonction pour extraire la valeur numérique et les symboles
  const parseStatValue = (value: string) => {
    const match = value.match(/([^0-9]*)(\d+)([^0-9]*)/);
    if (!match) return { prefix: '', number: 0, suffix: '' };
    
    return {
      prefix: match[1] || '',
      number: parseInt(match[2], 10),
      suffix: match[3] || ''
    };
  };

  return (
    <section className="py-16 bg-white border-y border-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {statsData.map((stat, index) => {
            const { prefix, number, suffix } = parseStatValue(stat.value);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="py-4 md:py-0"
              >
                <div className="text-5xl md:text-6xl font-extrabold text-brand-blue mb-2">
                  {prefix}
                  <CountUp 
                    end={number}
                    duration={2.5}
                    separator=""
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  {suffix}
                </div>
                <div className="text-lg font-semibold text-gray-900 leading-tight">
                  {stat.label}
                </div>
                <div className="text-gray-500">
                  {stat.sub}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;