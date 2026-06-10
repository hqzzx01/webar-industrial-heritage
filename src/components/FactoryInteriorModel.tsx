import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type * as Three from 'three';

const FACTORY_MODEL_URL = '/assets/3D/%E5%8E%82%E6%88%BF.glb';

const internalStops = [
  { number: 6, id: 'b1', title: '厂房入口', x: 13, y: 62 },
  { number: 7, id: 'b2', title: '生产线回溯', x: 35, y: 36 },
  { number: 8, id: 'b3', title: '设备结构拆解', x: 54, y: 52 },
  { number: 9, id: 'b4', title: '工艺流程展示', x: 74, y: 39 },
  { number: 10, id: 'b5', title: '人物记忆与知识拓展', x: 88, y: 68 }
];

export function FactoryInteriorModel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};
    setLoaded(false);
    setFailed(false);

    async function setupScene() {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (disposed) return;

      let frameId = 0;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
      camera.position.set(0, 3.25, 7.5);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x1f2937, 1.8));
      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(5, 7, 5);
      scene.add(key);

      const group = new THREE.Group();
      group.rotation.x = -0.06;
      scene.add(group);

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

      new GLTFLoader().load(
        FACTORY_MODEL_URL,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxAxis = Math.max(size.x, size.y, size.z) || 1;
          model.position.sub(center);
          model.scale.setScalar(5.8 / maxAxis);
          model.rotation.y = -0.22;
          group.add(model);
          setLoaded(true);
        },
        undefined,
        () => {
          if (!disposed) setFailed(true);
        }
      );

      const render = () => {
        const time = performance.now() * 0.001;
        if (!reduceMotion) {
          group.rotation.y = -0.04 + Math.sin(time * 0.28) * 0.035;
        }
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };

      render();

      cleanup = () => {
        observer.disconnect();
        window.cancelAnimationFrame(frameId);
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
    <section className={`factory-model${loaded ? ' is-loaded' : ''}${failed ? ' is-failed' : ''}`}>
      <div className="factory-model__stage" ref={mountRef} />
      <div className="factory-route-line" aria-hidden="true" />
      {internalStops.map((stop) => (
        <Link
          className="factory-stop"
          style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
          to={`/ar-story/${stop.id}`}
          aria-label={`${stop.number} ${stop.title}`}
          key={stop.id}
        >
          <b>{stop.number}</b>
          <span>{stop.title}</span>
        </Link>
      ))}
      <div className="factory-model__caption" aria-live="polite">
        <b>{failed ? '厂房模型暂未加载' : loaded ? '厂房内部结构图' : '厂房模型加载中'}</b>
        <span>主流程点位 6-10</span>
      </div>
    </section>
  );
}
