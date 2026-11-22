import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEngineInstance } from '../../shared/three/use-engine';
import { BodiesEngine } from './engine';
import { InspectorHud } from './ui/InspectorHud';
import { INSPECTOR_BODIES } from '../../bodies';
import { BodyData } from '../../shared/types/body';

export const BodiesExperience: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedId = searchParams.get('id');

  const primaryBodies = useMemo(() => INSPECTOR_BODIES.map((b) => b.data), []);

  const defaultBody = useMemo(() => {
    if (requestedId) {
      for (const p of primaryBodies) {
        if (p.id === requestedId) return p;
        if (p.children) {
          const found = p.children.find((c) => c.id === requestedId);
          if (found) return found;
        }
      }
    }
    return primaryBodies.find((b) => b.id === 'earth') || primaryBodies[0];
  }, [primaryBodies, requestedId]);

  const defaultPrimary = useMemo(() => {
    if (defaultBody.parentId) {
      return primaryBodies.find((b) => b.id === defaultBody.parentId) || defaultBody;
    }
    return defaultBody;
  }, [primaryBodies, defaultBody]);

  const [selectedPrimary, setSelectedPrimary] = useState<BodyData>(defaultPrimary);
  const [currentBody, setCurrentBody] = useState<BodyData>(defaultBody);
  const [loading, setLoading] = useState(false);
  const [loadingName, setLoadingName] = useState(defaultBody.name);

  const { canvasRef, engineRef } = useEngineInstance(() => {
    const engine = new BodiesEngine();
    engine.onLoadingChange = (isLoading, name) => {
      setLoading(isLoading);
      setLoadingName(name);
    };
    return engine;
  });

  const selectBody = useCallback(
    (body: BodyData) => {
      setCurrentBody(body);
      engineRef.current?.selectBody(body);
    },
    [engineRef]
  );

  const handleSelectPrimary = useCallback(
    (body: BodyData) => {
      setSelectedPrimary(body);
      selectBody(body);
    },
    [selectBody]
  );

  const handleSelectMoon = useCallback(
    (moon: BodyData) => {
      selectBody(moon);
    },
    [selectBody]
  );

  useEffect(() => {
    engineRef.current?.selectBody(defaultBody);
  }, [engineRef, defaultBody]);

  return (
    <>
      <canvas ref={canvasRef} />
      <InspectorHud
        currentBody={currentBody}
        primaryBodies={primaryBodies}
        selectedPrimary={selectedPrimary}
        onSelectPrimary={handleSelectPrimary}
        onSelectMoon={handleSelectMoon}
        loading={loading}
        loadingName={loadingName}
      />
    </>
  );
};

export default BodiesExperience;
