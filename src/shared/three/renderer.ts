import * as THREE from 'three';

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 700;
}

export interface RendererOptions {
  antialias?: boolean;
  alpha?: boolean;
  exposure?: number;
  shadowMap?: boolean;
  mobilePixelRatio?: number;
  desktopPixelRatioMax?: number;
  onContextLost?: (e: Event) => void;
  onContextRestored?: () => void;
}

export function isWebGL2Available(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  options: RendererOptions = {}
): THREE.WebGLRenderer | null {
  if (!isWebGL2Available()) {
    console.error('WebGL2 is not supported by your browser or hardware.');
    return null;
  }

  const {
    antialias = false,
    alpha = false,
    exposure = 1.05,
    shadowMap = false,
    mobilePixelRatio = 0.85,
    desktopPixelRatioMax = 1.25,
    onContextLost,
    onContextRestored,
  } = options;

  const mobile = isMobile();
  const pr = mobile ? mobilePixelRatio : Math.min(window.devicePixelRatio, desktopPixelRatioMax);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias,
    alpha,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(pr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;

  if (shadowMap) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.warn('WebGL context lost.');
    onContextLost?.(e);
  });

  canvas.addEventListener('webglcontextrestored', () => {
    console.info('WebGL context restored.');
    onContextRestored?.();
  });

  return renderer;
}
