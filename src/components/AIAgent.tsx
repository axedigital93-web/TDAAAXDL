import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './AIAgent.css';

interface AIAgentProps {
  index: number;
  x: number;
  y: number;
  rotateY: number;
}

const HologramPanel = ({ index }: { index: number }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.to(panelRef.current, {
      y: '+=2', duration: 3 + Math.random(), yoyo: true, repeat: -1, ease: 'sine.inOut'
    });
  }, []);
  return (
    <div className="hologram-panel-container">
      <div ref={panelRef} className="hologram-panel">
        <div className="hologram-header" />
        <div className="hologram-content">
          <div className="hologram-line long" />
          <div className="hologram-line med" />
          <div className="hologram-line short" />
          {index === 1 && <div className="hologram-line med" />}
          {index === 2 && <div className="hologram-line long" />}
        </div>
      </div>
    </div>
  );
};

const AIAgent: React.FC<AIAgentProps> = ({ index, x, y, rotateY }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headRef   = useRef<HTMLDivElement>(null);
  const lArmRef   = useRef<HTMLDivElement>(null);
  const rArmRef   = useRef<HTMLDivElement>(null);
  const lLegRef   = useRef<HTMLDivElement>(null);
  const rLegRef   = useRef<HTMLDivElement>(null);

  const isRightSide = index === 1 || index === 4;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const delay    = Math.random() * 2.5;
      const duration = 5 + Math.random();

      // Float
      gsap.to(wrapperRef.current, {
        y: '+=5', duration, yoyo: true, repeat: -1, ease: 'sine.inOut', delay
      });

      // Head idle
      gsap.to(headRef.current, {
        rotationZ: () => -3 + Math.random() * 6,
        duration: 2.5 + Math.random() * 2,
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      });

      // Leg sway
      gsap.to([lLegRef.current, rLegRef.current], {
        rotationZ: () => -2 + Math.random() * 4,
        duration, yoyo: true, repeat: -1, ease: 'sine.inOut'
      });

      // Arm task animation — works on top of CSS base orientation
      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 2 });

      if (isRightSide) {
        // Arms already oriented left via CSS; animate subtle reach/tap gestures
        tl.to([lArmRef.current, rArmRef.current], { rotationZ: '+=8', duration: 0.5, ease: 'power1.inOut' })
          .to([lArmRef.current, rArmRef.current], { rotationZ: '-=8', duration: 0.5, ease: 'power1.inOut' })
          .to([lArmRef.current, rArmRef.current], { rotationZ: '+=12', duration: 0.3, yoyo: true, repeat: 4 })
          .to({}, { duration: 1 });
      } else {
        tl.to([lArmRef.current, rArmRef.current], { rotationZ: '-=8', duration: 0.5, ease: 'power1.inOut' })
          .to([lArmRef.current, rArmRef.current], { rotationZ: '+=8', duration: 0.5, ease: 'power1.inOut' })
          .to([lArmRef.current, rArmRef.current], { rotationZ: '-=12', duration: 0.25, yoyo: true, repeat: 6 })
          .to({}, { duration: 1.2 });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [index, isRightSide]);

  return (
    <div
      className="ai-agent-position-wrapper"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` } as React.CSSProperties}
    >
      <div
        className="ai-agent-transform-layer"
        ref={wrapperRef}
        style={{ '--agent-rotateY': `${rotateY}deg` } as React.CSSProperties}
      >
        <HologramPanel index={index} />

        {/* Head */}
        <div className="robot-head-container" ref={headRef}>
          <div className="robot-part robot-head">
            <div className="robot-head-ear left"></div>
            <div className="robot-head-ear right"></div>
            <div className="robot-visor">
              <div className="robot-eye"></div>
              <div className="robot-eye"></div>
            </div>
          </div>
        </div>

        {/* Neck */}
        <div className="robot-neck"></div>

        {/* Torso */}
        <div className="robot-part robot-torso"></div>
        <div className="robot-chest-panel"></div>
        <div className="robot-waist-joint"></div>

        {/* Arms — mirrored class flips both arms LEFT via CSS 3D rotateY */}
        <div className={`robot-arm-group${isRightSide ? ' mirrored' : ''}`}>
          <div className="robot-arm-container left" ref={lArmRef}>
            <div className="robot-joint robot-shoulder"></div>
            <div className="robot-part robot-single-arm">
              <div className="robot-wrist-metal"></div>
              <div className="robot-hand">
                <div className="robot-palm">
                  <div className="robot-finger thumb"></div>
                  <div className="robot-finger-group">
                    <div className="robot-finger"></div>
                    <div className="robot-finger"></div>
                    <div className="robot-finger"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="robot-arm-container right" ref={rArmRef}>
            <div className="robot-joint robot-shoulder"></div>
            <div className="robot-part robot-single-arm">
              <div className="robot-wrist-metal"></div>
              <div className="robot-hand">
                <div className="robot-palm">
                  <div className="robot-finger thumb"></div>
                  <div className="robot-finger-group">
                    <div className="robot-finger"></div>
                    <div className="robot-finger"></div>
                    <div className="robot-finger"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legs */}
        <div className="robot-leg-group">
          <div className="robot-leg left" ref={lLegRef}>
            <div className="robot-joint robot-hip"></div>
            <div className="robot-part robot-single-leg"></div>
            <div className="robot-ankle-metal"></div>
            <div className="robot-part robot-foot"></div>
          </div>
          <div className="robot-leg right" ref={rLegRef}>
            <div className="robot-joint robot-hip"></div>
            <div className="robot-part robot-single-leg"></div>
            <div className="robot-ankle-metal"></div>
            <div className="robot-part robot-foot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
