import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AppImage from "../image/AppImage";

const Counter: React.FC<{
  value: string;
  suffix?: string;
  description: string;
}> = ({ value, suffix, description }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
    >
      <div className="counter-text flex justify-center items-baseline mb-4">
        <div className="flex items-baseline">
          {value.split("").map((char, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="count-text text-4xl font-bold text-gray-900"
            >
              {char}
            </motion.div>
          ))}
          {suffix && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: value.length * 0.1 }}
              className="count-text text-4xl font-bold text-gray-900 ml-1"
            >
              {suffix}
            </motion.div>
          )}
        </div>
      </div>
      <div className="counter-des">
        <div className="black-des text-lg font-semibold text-gray-800">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

const SuccessMetrics: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Et si votre <span className="text-brand-blue"> entreprise</span>{" "}
              <br />
              atteignait de <span className="text-brand-blue">nouveaux </span>
              sommets grâce à l'IA ?
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez comment nos solutions et nos applications métiers transforment 
            les entreprises ambitieuses et les propulsent vers une croissance <br />
            sans précédent.
          </p>
        </motion.div>

        {/* Image Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
          }
          transition={{ duration: 0.7, delay: 0.2 }}
          
        >
          <img
            src={AppImage.heroImageSansBackground}
            loading="lazy"
            alt="Dashboard montrant les performances de l'entreprise"
            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessMetrics;
