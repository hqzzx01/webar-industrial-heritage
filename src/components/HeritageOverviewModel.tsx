import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type * as Three from 'three';
import type { Point } from '../data/points';

const OVERVIEW_MODEL_URL = '/assets/3D/555-webar.glb';
const DRACO_DECODER_PATH = '/vendor/draco/gltf/';

type Props = {
  points: Point[];
  onVisit: (pointId: string) => void;
};

export function HeritageOverviewModel({ points, onVisit }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};
    setLoaded(false);
    setFailed(false);
    setProgress(0);

    async function setupScene() {
      const THREE = await import('three');
      const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/loaders/DRACOLoader.js')
      ]);
      if (disposed) return;

      let frameId = 0;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(5.6, 4.6, 7.8);
      camera.lookAt(0, -0.2, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xf8fafc, 0x172033, 2.25));
      const key = new THREE.DirectionalLight(0xffffff, 3.2);
      key.position.set(7, 10, 6);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x67e8f9, 1.15);
      rim.position.set(-6, 3, -5);
      scene.add(rim);

      const group = new THREE.Group();
      group.rotation.y = -0.18;
      scene.add(group);

      const platformMaterial = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
      });
      const platform = new THREE.Mesh(new THREE.CircleGeometry(3.25, 96), platformMaterial);
      platform.rotation.x = -Math.PI / 2;
      platform.position.y = -1.02;
      scene.add(platform);

      const resize = () => {
        const rect = mount.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(mount);

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
      dracoLoader.setDecoderConfig({ type: 'wasm' });
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        OVERVIEW_MODEL_URL,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxAxis = Math.max(size.x, size.y, size.z) || 1;
          model.position.sub(center);
          model.scale.setScalar(6.3 / maxAxis);
          group.add(model);
          setProgress(100);
          setLoaded(true);
        },
        (event) => {
          if (!disposed && event.total > 0) {
            setProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
          }
        },
        () => {
          if (!disposed) setFailed(true);
        }
      );

      const render = () => {
        const time = performance.now() * 0.001;
        if (!reduceMotion) {
          group.position.y = Math.sin(time * 0.75) * 0.025;
          platformMaterial.opacity = 0.07 + Math.sin(time * 1.2) * 0.015;
        }
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };
      render();

      cleanup = () => {
        observer.disconnect();
        window.cancelAnimationFrame(frameId);
        dracoLoader.dispose();
        scene.traverse((object) => {
          const renderable = object as Three.Object3D & {
            geometry?: Three.BufferGeometry;
            material?: Three.Material | Three.Material[];
          };
          renderable.geometry?.dispose();
          if (renderable.material) {
            const materials = Array.isArray(renderable.material) ? renderable.material : [renderable.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    setupScene().catch(() => {
      if (!disposed) setFailed(true);
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <section className={`heritage-overview-model${loaded ? ' is-loaded' : ''}${failed ? ' is-failed' : ''}`}>
      <div className="heritage-overview-model__stage" ref={mountRef} />
      {points.map((point, index) => (
        <Link
          to={`/ar-story/${point.id}`}
          className="heritage-overview-model__point"
          style={{ left: `${point.mapPosition.x}%`, top: `${point.mapPosition.y}%` }}
          onClick={() => onVisit(point.id)}
          aria-label={`${index + 1} ${point.title}`}
          key={point.id}
        >
          {index + 1}
        </Link>
      ))}
      <div className="heritage-overview-model__caption" aria-live="polite">
        <b>{failed ? '白膜模型暂未加载' : loaded ? '园区白膜总览' : `白膜模型加载中 ${progress}%`}</b>
        <span>点击模型上的 1–5 点位进入 AR 故事</span>
      </div>
    </section>
  );
}

