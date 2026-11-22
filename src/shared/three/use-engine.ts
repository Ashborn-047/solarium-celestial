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
