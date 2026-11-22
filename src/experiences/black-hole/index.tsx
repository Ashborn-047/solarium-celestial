import React from 'react';
import { useEngine } from '../../shared/three/use-engine';
import { BlackHoleEngine } from './engine';
import { Hud } from './ui/Hud';

export const BlackHoleExperience: React.FC = () => {
  const canvasRef = useEngine(() => new BlackHoleEngine());

  return (
    <>
      <canvas ref={canvasRef} />
      <Hud />
    </>
  );
};

export default BlackHoleExperience;
