import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import * as THREE from 'three';

interface MetricOverlayProps {
  metric: string;
  point: { lat: number; lng: number };
  percentage: number;
  active: boolean;
}

export const MetricOverlay: React.FC<MetricOverlayProps> = ({ metric, point, percentage, active }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const spriteRef = useRef<THREE.Sprite | null>(null);
  const map = useMap();
  const animRef = useRef<number | undefined>(undefined);

  const createGradientTexture = (color: string) => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grd = ctx.createRadialGradient(size/2, size/2, 4, size/2, size/2, size/2);
    grd.addColorStop(0, color);
    grd.addColorStop(0.4, color + 'cc');
    grd.addColorStop(0.75, color + '33');
    grd.addColorStop(1, color + '00');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,size,size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  };

  const pickColor = () => {
    const p = Math.min(1, Math.max(0, percentage/100));
    if (p < 0.5) {
      const t = p/0.5;
      const lerp = (a:number,b:number)=> Math.round(a+(b-a)*t);
      const c1 = [0x15,0x7c,0xf0];
      const c2 = [0xff,0x7a,0x33];
      const c = [lerp(c1[0],c2[0]), lerp(c1[1],c2[1]), lerp(c1[2],c2[2])];
      return '#' + c.map(x=>x.toString(16).padStart(2,'0')).join('');
    } else {
      const t = (p-0.5)/0.5;
      const lerp = (a:number,b:number)=> Math.round(a+(b-a)*t);
      const c1 = [0xff,0x7a,0x33];
      const c2 = [0xe0,0x19,0x31];
      const c = [lerp(c1[0],c2[0]), lerp(c1[1],c2[1]), lerp(c1[2],c2[2])];
      return '#' + c.map(x=>x.toString(16).padStart(2,'0')).join('');
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(0, width, height, 0, -10, 10);
    cameraRef.current = camera;

    const color = pickColor();
    const texture = createGradientTexture(color);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    spriteRef.current = sprite;
    scene.add(sprite);

    const updatePositionAndScale = () => {
      if (!spriteRef.current) return;
      const pt = map.latLngToLayerPoint(point as any);
      spriteRef.current.position.set(pt.x, pt.y, 0);
      const z = map.getZoom();
      const base = 220;
      const scaleFactor = Math.pow(1.18, z - 5);
      const intensity = 0.5 + (percentage/100)*0.7;
      const size = base * scaleFactor * intensity;
      spriteRef.current.scale.set(size, size, 1);
    };

    const handleMap = () => {
      if (!rendererRef.current || !cameraRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      rendererRef.current.setSize(w,h);
      cameraRef.current.right = w;
      cameraRef.current.left = 0;
      cameraRef.current.top = 0;
      cameraRef.current.bottom = h;
      cameraRef.current.updateProjectionMatrix();
      updatePositionAndScale();
    };

    updatePositionAndScale();
    map.on('zoom', updatePositionAndScale);
    map.on('move', updatePositionAndScale);
    window.addEventListener('resize', handleMap);

    let t = 0;
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      t += 0.01;
      if (spriteRef.current) {
        const pulse = 0.85 + Math.sin(t*2)*0.15;
        spriteRef.current.material.opacity = pulse;
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      map.off('zoom', updatePositionAndScale);
      map.off('move', updatePositionAndScale);
      window.removeEventListener('resize', handleMap);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement.remove();
      }
      texture.dispose();
      material.dispose();
    };
  }, [metric, point.lat, point.lng, percentage]);

  if (!active) return null;
  return <div ref={containerRef} className="three-overlay" aria-label={metric + ' visualization'} />;
};
