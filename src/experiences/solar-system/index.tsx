import React, { useState, useCallback, useEffect } from 'react';
import { useEngineInstance } from '../../shared/three/use-engine';
import { SolarSystemEngine } from './engine';
import { SystemNode } from './engine/system-builder';
import { LabelItem } from './engine/labels';
import { SystemHud } from './ui/SystemHud';

export const SolarSystemExperience: React.FC = () => {
  const [focusedNode, setFocusedNode] = useState<SystemNode | null>(null);
  const [selectedRelNode, setSelectedRelNode] = useState<SystemNode | null>(null);
  const [primaryNodes, setPrimaryNodes] = useState<SystemNode[]>([]);
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [paused, setPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(10);

  const { canvasRef, engineRef } = useEngineInstance(() => {
    const engine = new SolarSystemEngine();
    engine.onLabelsUpdate = (lbls) => {
      setLabels(lbls);
    };
    engine.onFocusChange = (node) => {
      setFocusedNode(node);
      const sun = engine.getSunNode();
      const rel = node && node !== sun ? (!node.parent || node.parent === sun ? node : node.parent) : null;
      setSelectedRelNode(rel);
    };
    return engine;
  });

  useEffect(() => {
    if (engineRef.current) {
      const sun = engineRef.current.getSunNode();
      if (sun) {
        setPrimaryNodes([sun, ...sun.children]);
      }
    }
  }, [engineRef]);

  const handleSelectNode = useCallback(
    (node: SystemNode | null) => {
      engineRef.current?.setFocus(node);
    },
    [engineRef]
  );

  const handleTogglePause = useCallback(() => {
    if (engineRef.current) {
      const isPaused = engineRef.current.time.togglePause();
      setPaused(isPaused);
    }
  }, [engineRef]);

  const handleStepSpeed = useCallback(() => {
    if (engineRef.current) {
      const speed = engineRef.current.time.stepSpeed();
      setSpeedMultiplier(speed);
    }
  }, [engineRef]);

  return (
    <>
      <canvas ref={canvasRef} />
      <SystemHud
        focusedNode={focusedNode}
        primaryNodes={primaryNodes}
        selectedRelNode={selectedRelNode}
        labels={labels}
        paused={paused}
        speedMultiplier={speedMultiplier}
        onTogglePause={handleTogglePause}
        onStepSpeed={handleStepSpeed}
        onSelectNode={handleSelectNode}
      />
    </>
  );
};

export default SolarSystemExperience;
