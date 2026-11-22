import * as THREE from 'three';

let fallbackTexture: THREE.CanvasTexture | null = null;

function getFallbackTexture(): THREE.CanvasTexture {
  if (!fallbackTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#666666';
      ctx.fillRect(0, 0, 16, 16);
    }
    fallbackTexture = new THREE.CanvasTexture(canvas);
  }
  return fallbackTexture;
}

export function loadTexture(
  url: string,
  colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace,
  timeoutMs = 20000
): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    let resolved = false;
    const loader = new THREE.TextureLoader();

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn(`Texture load timed out after ${timeoutMs}ms: ${url}. Using fallback.`);
        resolve(getFallbackTexture());
      }
    }, timeoutMs);

    loader.load(
      url,
      (tex) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          tex.colorSpace = colorSpace;
          resolve(tex);
        }
      },
      undefined,
      (err) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          console.warn(`Failed to load texture ${url}:`, err);
          resolve(getFallbackTexture());
        }
      }
    );
  });
}
