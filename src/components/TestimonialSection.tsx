import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import AppImage from '../image/AppImage';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../utils/whatsapp';

const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Richkard Kamena",
      position: "Directeur",
      company: "Lyxera",
      image: AppImage.testimonialRichkardKamena,
      rating: 5,
      text: "“Avant de travailler avec Axe digital, notre entreprise perdait un temps fou sur des tâches manuelles. Grâce à l'intégration de leur agent IA, nous avons automatisé 80% de notre support client et nos revenus ont doublé en moins de 3 mois”"
    },
    {
      id: 2,
      name: "Junior Tenevock",
      position: "Head of performance",
      company: "Zaninii",
      image: "https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fe5d8f020c9edd2dbef742_photo_2025-10-23_16-51-49.jpg",
      rating: 5,
      text: "“Ce que j'ai le plus apprécié, c'est leur approche humaine. Ils ne se contentent pas de donner des solutions génériques, ils prennent vraiment le temps de comprendre nos besoins et de construire une application métier adaptée. Aujourd'hui, je gère mes opérations avec beaucoup plus de confiance.”"
    },
    {
      id: 3,
      name: "Eleanor Pena",
      position: "Directeur General",
      company: "Mapa Sarl",
      image: "https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fe5f611cc7aebc6ff09b35_photo_2025-10-26_18-49-00.jpg",
      rating: 5,
      text: "“J'avais déjà essayé plusieurs formations en ligne, mais rien n'était concret. Avec axe digital, j'ai eu un vrai suivi et des résultats mesurables. Mon taux de conversion a augmenté de 40% !”"
    },
    {
      id: 4,
      name: "Jalil Ketou",
      position: "Fondateur",
      company: "Skynesis",
      image: "https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fe5e3015c4dd76313db95d_photo_2025-10-26_17-07-29.jpg",
      rating: 5,
      text: "“Leur expertise dans le domaine du marketing digital m'a permis d'éviter de nombreuses erreurs coûteuses. Aujourd'hui, ma marque est bien positionnée et attire des clients de manière constante”"
    },
    {
      id: 5,
      name: "Marcel Kop",
      position: "CEO",
      company: "Symphoni Social",
      image: "https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fe5d8fbf9836d34768d35b_photo_2025-10-26_17-14-34.jpg",
      rating: 5,
      text: "“Ce que j'ai aimé, c'est leur disponibilité et leur réactivité. À chaque fois que j'avais une difficulté technique ou stratégique, ils étaient là pour me guider. C'est plus qu'un accompagnement, c'est un vrai partenariat”"
    },
    {
      id: 6,
      name: "Merveille Noumo",
      position: "Gérante",
      company: "La grande Royale",
      image: "https://cdn.prod.website-files.com/68f591d26620d8104ef1dae4/68fe5d8fc39e0e661cd184a7_photo_2025-10-26_18-39-25.jpg",
      rating: 5,
      text: "“Je recommande vivement Axe Digital à toutes les entreprises qui veulent digitaliser leurs processus avec l'IA. Leur accompagnement pas à pas nous a permis d'optimiser nos coûts, sans jamais nous sentir perdus.”"
    }
  ];

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-600">
          {rating}/5
        </span>
      </div>
    );
  };

  return (
    <section id="ils-nous-font-confiance" className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
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
            Ils nous font <span className="text-[#0238d6]">confiance</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les retours d'expérience de nos clients
            qui ont transformé leur activité avec nos solutions.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              {/* Testimonial Card */}
              <div className="relative h-full backdrop-blur-sm bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/30 transition-all duration-300">
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-[#0238d6]/10 rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-[#0238d6]" />
                </div>

                {/* Client Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0238d6] rounded-full border-2 border-white flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.position}</p>
                    <p className="text-[#0238d6] font-semibold text-sm">{testimonial.company}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 leading-relaxed italic">
                  {testimonial.text}
                </blockquote>

                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-[#0238d6]/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-[#0238d6] to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/25 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100 text-sm">Clients satisfaits</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">5.0</div>
                <div className="text-blue-100 text-sm">Note moyenne</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">+50</div>
                <div className="text-blue-100 text-sm">Projets réalisés</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">2x</div>
                <div className="text-blue-100 text-sm">Croissance moyenne</div>
              </div>
            </div>
          </div>
        </motion.div>

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
              Vous aussi, rejoignez nos clients satisfaits
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Discutons de votre projet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openWhatsApp(WHATSAPP_MESSAGES.commander)}
                className="bg-[#0238d6] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
              >
                Commencer maintenant
              </motion.button>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all"
              >
                Voir plus de témoignages
              </motion.button> */}
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

export default TestimonialSection;