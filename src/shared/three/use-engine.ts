import { useEffect, useRef } from 'react';
import { Engine } from '../types/engine';

export function useEngine<T extends Engine>(
  factory: () => T,
  deps: React.DependencyList = []
): React.RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = factory();
    engine.mount(canvas);

    return () => {
      engine.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return canvasRef;
}

export function useEngineInstance<T extends Engine>(
  factory: () => T,
  deps: React.DependencyList = []
): { canvasRef: React.RefObject<HTMLCanvasElement>; engineRef: React.MutableRefObject<T | null> } {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<T | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = factory();
    engineRef.current = engine;
    engine.mount(canvas);

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { canvasRef, engineRef };
}
