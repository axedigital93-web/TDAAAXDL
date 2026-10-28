import React, { useState, useEffect } from 'react';
import AIAgent from './AIAgent';

const AIAgentsContainer: React.FC = () => {
  // ✅ PERF: robots désactivés sur mobile/tablette — trop coûteux en CPU
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ✅ PERF: réduit de 4 robots à 3 (retire le bottom-right moins visible)
  const agentsConfig = [
    // Top Left - face right (toward globe)
    { index: 0, x: -350, y: -230, rotateY: 75 },
    // Top Right - face left (toward globe)
    { index: 1, x: 350, y: -210, rotateY: -75 },
    // Middle Left - face right (toward globe)
    { index: 2, x: -410, y: 50, rotateY: 80 },
  ];

  if (!isDesktop) return null; // ✅ PERF: rien rendu sur mobile/tablette

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none', transformStyle: 'preserve-3d', perspective: '1200px' }}>
      {agentsConfig.map((config) => (
        <AIAgent 
          key={config.index}
          index={config.index}
          x={config.x}
          y={config.y}
          rotateY={config.rotateY}
        />
      ))}
    </div>
  );
};

export default AIAgentsContainer;

