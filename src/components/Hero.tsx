import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AppImage from "../image/AppImage";
import logoKreads from "../image/logo_Kreads.png";
import { openWhatsApp, WHATSAPP_MESSAGES } from "../utils/whatsapp";
import HeroGlobe from "./HeroGlobe";

/* ── Main Hero Component ── */
const Hero: React.FC = () => {

  return (
    <section style={{ position:"relative", minHeight:"100vh", overflow:"hidden", backgroundColor:"#ffffff" }}
      className="pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-20 px-4 flex flex-col items-center justify-center">

      {/* ── Globe de bulles bleues ── */}
      <HeroGlobe />

      {/* ── Main content ── */}
      <div className="container mx-auto max-w-6xl text-center relative z-10">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] text-gray-900 mb-8">
            L&apos;<span className="text-[#0238d6]">I</span>ntelligence <span className="text-[#0238d6]">A</span>rtificielle<br />
            au service de votre <span className="text-[#0238d6]">croissance</span><br />
            en <span className="text-[#0238d6]">Afrique</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-10 leading-relaxed relative z-10 pt-2">
            Nous concevons des agents IA, applications métiers et solutions
            numériques sur-mesure pour propulser votre organisation dans l'ère du digital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16 md:mb-20 relative z-10">
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
              onClick={() => document.getElementById('nous-contacter')?.scrollIntoView({ behavior:'smooth' })}
              className="bg-brand-blue text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
              Demandez votre audit IA gratuit <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
              onClick={() => openWhatsApp(WHATSAPP_MESSAGES.appel)}
              className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
              Passez un appel découverte
            </motion.button>
          </div>
        </motion.div>

        {/* Logos */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.4, duration:.8 }} className="w-full overflow-hidden">
          <h3 className="font-bold text-base sm:text-lg mb-6 sm:mb-8">Ils nous font <span className="text-brand-blue">confiance</span>{" "}</h3>
          <div className="relative flex overflow-hidden">
            <motion.div className="flex items-center gap-8 sm:gap-12 md:gap-20 whitespace-nowrap"
              animate={{ x:["-50%","0%"] }} transition={{ x:{ repeat:Infinity, repeatType:"loop", duration:20, ease:"linear" } }}>
              {[
                logoKreads, AppImage.partenaireCodecCm, AppImage.partenaireLyxera, AppImage.partenaireSkynesys,
AppImage.partenaireSymphoniSocial, AppImage.partenaireZenaeBrand, AppImage.partenaire4,
                '/assets/Logo/log1.png', '/assets/Logo/log2.png',
                logoKreads, AppImage.partenaireCodecCm, AppImage.partenaireLyxera, AppImage.partenaireSkynesys,
                AppImage.partenaireSymphoniSocial, AppImage.partenaireZenaeBrand, AppImage.partenaire4,
                '/assets/Logo/log1.png', '/assets/Logo/log2.png',
].map((src, i) => <img key={i} src={src} alt="" className={src === logoKreads ? "h-7 sm:h-9 md:h-11 w-auto object-contain" : "h-12 sm:h-16 md:h-20 w-auto object-contain"} />)}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
