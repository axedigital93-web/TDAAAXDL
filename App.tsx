import React, { useState, useEffect } from 'react';
import Preloader from './src/components/Preloader';
import CursorGlow from './src/components/CursorGlow';
import Navbar from './src/components/Navbar';
import Hero from './src/components/Hero';
import Stats from './src/components/Stats';
import Portfolio from './src/components/Portfolio';
import ProblemSection from './src/components/ProblemSection';
import SolutionsSection from './src/components/SolutionsSection';
import PricingSection from './src/components/PricingSection';
import WhySection from './src/components/WhySection';
import SolutionSection from './src/components/SolutionSection';
import TestimonialSection from './src/components/TestimonialSection';
import CTASection from './src/components/CTASection';
import Footer from './src/components/Footer';
import AxeStacks from './src/components/AxeStacks';
import MentionsLegales from './src/components/MentionsLegales';
import PolitiqueConfidentialite from './src/components/PolitiqueConfidentialite';
import ConditionsGenerales from './src/components/ConditionsGenerales';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '');

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPath(window.location.hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <>
      <Preloader />
      <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <CursorGlow />
      <Navbar currentPath={currentPath} />
      {currentPath === '#axe-stacks' ? (
        <AxeStacks />
      ) : currentPath === '#mentions-legales' ? (
        <MentionsLegales />
      ) : currentPath === '#politique-confidentialite' ? (
        <PolitiqueConfidentialite />
      ) : currentPath === '#conditions-generales' ? (
        <ConditionsGenerales />
      ) : (
        <main>
          <Hero />
          <Stats />
          <Portfolio />
          <ProblemSection />
          <SolutionsSection />
          <PricingSection />
          <WhySection />
          <SolutionSection />
          <TestimonialSection />
          <CTASection />
        </main>
      )}
      <Footer />
      </div>
    </>
  );
};

export default App;
