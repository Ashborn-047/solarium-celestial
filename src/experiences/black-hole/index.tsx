import React, { useState, useCallback, useEffect } from 'react';
import { useEngineInstance } from '../../shared/three/use-engine';
import { BlackHoleEngine } from './engine';
import { Hud } from './ui/Hud';
import { STORY_PHASES } from '../../bodies/sun/collapse';

export const BlackHoleExperience: React.FC = () => {
  const [phaseTitle, setPhaseTitle] = useState(STORY_PHASES[0].title);
  const [phaseDesc, setPhaseDesc] = useState(STORY_PHASES[0].description);
  const [collapsed, setCollapsed] = useState(false);
  const [diving, setDiving] = useState(false);
  const [showDisk, setShowDisk] = useState(true);

  const { canvasRef, engineRef } = useEngineInstance(() => {
    const engine = new BlackHoleEngine();
    engine.onPhaseChange = (_phase, title, desc) => {
      setPhaseTitle(title);
      setPhaseDesc(desc);
    };
    return engine;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('collapse') === '1' && engineRef.current) {
      const isCol = engineRef.current.toggleCollapse();
      setCollapsed(isCol);
    }
  }, [engineRef]);

  const handleToggleCollapse = useCallback(() => {
    if (engineRef.current) {
      const isCol = engineRef.current.toggleCollapse();
      setCollapsed(isCol);
    }
  }, [engineRef]);

  const handleToggleDive = useCallback(() => {
    if (engineRef.current) {
      const isDiv = engineRef.current.toggleDive();
      setDiving(isDiv);
    }
  }, [engineRef]);

  const handleToggleDisk = useCallback(() => {
    if (engineRef.current) {
      const isDisk = engineRef.current.toggleGlowDisk();
      setShowDisk(isDisk);
    }
  }, [engineRef]);

  return (
    <>
      <canvas ref={canvasRef} />
      <Hud
        phaseTitle={phaseTitle}
        phaseDesc={phaseDesc}
        collapsed={collapsed}
        diving={diving}
        showDisk={showDisk}
        onToggleCollapse={handleToggleCollapse}
        onToggleDive={handleToggleDive}
        onToggleDisk={handleToggleDisk}
      />
    </>
  );
};

export default BlackHoleExperience;
