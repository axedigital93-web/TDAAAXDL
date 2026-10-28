import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    name: "FINITRANS",
    category: "Application de gestion de Transit et Dédouanement",
    video: "/assets/Portfolio/video1.mp4",
    color: "bg-orange-500",
  },
  {
    name: "Stella AI",
    category: "Agent intelligent pour PC",
    video: "/assets/Portfolio/video2.mp4",
    color: "bg-violet-600",
  },
  {
    name: "SULTAN",
    category: "Application de Gestion d'une boucherie moderne",
    video: "/assets/Portfolio/video3.mp4",
    color: "bg-red-600",
  },
];

/* ✅ PERF: Vidéo avec lazy loading — ne charge que quand elle entre dans le viewport */
const LazyVideo: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.src = src; // charge la source seulement maintenant
            video.load();
            video.play().catch(() => {});
            observer.disconnect(); // une seule fois suffit
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
};

const Portfolio: React.FC = () => {
  return (
    <section id="nos-realisations" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 mb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Nos <span className="text-brand-blue">réalisations</span> en IA<br />et solutions <span className="text-brand-blue">numériques</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Des projets concrets qui transforment le quotidien
            des entreprises africaines.
          </motion.p>
        </div>
      </div>

      {/* Centered wide container with vertical alignment, spacing, and rounded corners */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="group relative w-full rounded-3xl overflow-hidden cursor-pointer aspect-[16/9] md:aspect-[21/9] shadow-lg"
          >
            {/* ✅ PERF: LazyVideo — charge et joue seulement à l'entrée dans le viewport */}
            <div className="w-full h-full bg-gray-100">
              <LazyVideo src={project.video} />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 md:p-16 z-20">
              <h3 className="text-white text-2xl md:text-4xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {project.name}
              </h3>
              <p className="text-gray-300 text-base md:text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                {project.category}
              </p>
              <div
                className={`h-1 w-20 md:w-28 ${project.color} mt-4 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100`}
              ></div>
            </div>

            {/* Badge always visible */}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold shadow-sm z-10">
              {project.name}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
