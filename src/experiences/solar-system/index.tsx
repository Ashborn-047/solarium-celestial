import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEngineInstance } from '../../shared/three/use-engine';
import { SolarSystemEngine } from './engine';
import { SystemNode } from './engine/system-builder';
import { LabelItem } from './engine/labels';
import { SystemHud } from './ui/SystemHud';

export const SolarSystemExperience: React.FC = () => {
  const navigate = useNavigate();
  const [focusedNode, setFocusedNode] = useState<SystemNode | null>(null);
  const [selectedRelNode, setSelectedRelNode] = useState<SystemNode | null>(null);
  const [primaryNodes, setPrimaryNodes] = useState<SystemNode[]>([]);
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [paused, setPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);

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
    engine.onDiveReady = () => {
      navigate('/black-hole?collapse=1');
    };
    return engine;
  });

  useEffect(() => {
    if (engineRef.current) {
      const sun = engineRef.current.getSunNode();
      if (sun) {
        setPrimaryNodes([sun, ...sun.children]);
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('collapse') === '1') {
        engineRef.current.collapseManager.triggerCollapse();
        setCollapsed(true);
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

  const handleStepSpeed = useCallback(
    (delta = 1) => {
      if (engineRef.current) {
        const speed = engineRef.current.time.stepSpeed(delta);
        setSpeedMultiplier(speed);
      }
    },
    [engineRef]
  );

  const handleToggleCollapse = useCallback(() => {
    if (engineRef.current) {
      if (collapsed) {
        engineRef.current.collapseManager.restore();
        setCollapsed(false);
      } else {
        engineRef.current.collapseManager.triggerCollapse();
        setCollapsed(true);
      }
    }
  }, [engineRef, collapsed]);

  const handleToggleShadows = useCallback(() => {
    if (engineRef.current) {
      const isShadowed = engineRef.current.toggleShadows();
      setShadowsEnabled(isShadowed);
    }
  }, [engineRef]);

  const handleDiveToSun = useCallback(() => {
    if (engineRef.current) {
      const sun = engineRef.current.getSunNode();
      if (sun) {
        engineRef.current.setFocus(sun);
        engineRef.current.cameraRig.tDist = 30;
      }
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
        collapsed={collapsed}
        shadowsEnabled={shadowsEnabled}
        onTogglePause={handleTogglePause}
        onStepSpeed={handleStepSpeed}
        onToggleCollapse={handleToggleCollapse}
        onDiveToSun={handleDiveToSun}
        onSelectNode={handleSelectNode}
        onToggleShadows={handleToggleShadows}
      />
    </>
  );
};

export default SolarSystemExperience;
