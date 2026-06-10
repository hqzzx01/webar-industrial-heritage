import { useEffect, useRef, useState } from 'react';
import type * as Three from 'three';

type Props = {
  modelUrl?: string;
  title: string;
  code: string;
  note: string;
  tags?: string[];
};

function createPlaceholderModel(THREE: typeof import('three')) {
  const group = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.48,
    metalness: 0.25
  });
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.52,
    metalness: 0.32
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.38,
    metalness: 0.18,
    emissive: 0x0f172a
  });
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.26
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.26, 1.55), darkMaterial);
  base.position.y = -0.76;
  group.add(base);

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.28, 1.1, 1.18), bodyMaterial);
  body.position.y = -0.02;
  group.add(body);

  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), edgeMaterial);
  edges.position.copy(body.position);
  group.add(edges);

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.28, 24), darkMaterial);
  tower.position.set(0.74, 0.18, -0.24);
  group.add(tower);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.34, 0.72), accentMaterial);
  head.position.set(-0.28, 0.72, 0.08);
  group.add(head);

  const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.36, 18), accentMaterial);
  marker.rotation.z = Math.PI / 2;
  marker.position.set(-0.88, 0.14, 0.64);
  group.add(marker);

  group.rotation.y = -0.35;
  return group;
}

export function ARPointModel({ modelUrl, title, code, note, tags = [] }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const isPlaceholder = !modelUrl;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};
    setLoaded(false);
    setFailed(false);

    async function setupScene() {
      const THREE = await import('three');
      if (disposed) return;

      let frameId = 0;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 1.05, 5.8);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      mount.appendChild(renderer.domElement);

      const key = new THREE.DirectionalLight(0xffffff, 2.5);
      key.position.set(3, 4, 4);
      scene.add(key);
      scene.add(new THREE.HemisphereLight(0xe0f2fe, 0x1e1712, 1.5));

      const group = new THREE.Group();
      group.position.y = -0.12;
      scene.add(group);

      const base = new THREE.Mesh(
        new THREE.RingGeometry(0.74, 1.42, 72),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
      );
      base.rotation.x = -Math.PI / 2;
      base.position.y = -1.18;
      scene.add(base);

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

      if (modelUrl) {
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        if (disposed) return;

        new GLTFLoader().load(
          modelUrl,
          (gltf) => {
            if (disposed) return;
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxAxis = Math.max(size.x, size.y, size.z) || 1;
            model.position.sub(center);
            model.scale.setScalar(3.15 / maxAxis);
            model.rotation.y = -0.35;
            group.add(model);
            setLoaded(true);
          },
          undefined,
          () => {
            if (!disposed) setFailed(true);
          }
        );
      } else {
        group.add(createPlaceholderModel(THREE));
        setLoaded(true);
      }

      const render = () => {
        const time = performance.now() * 0.001;
        if (!reduceMotion) {
          group.rotation.y = Math.sin(time * 0.42) * 0.12;
          group.position.y = -0.12 + Math.sin(time * 1.1) * 0.02;
          base.scale.setScalar(1 + Math.sin(time * 1.6) * 0.035);
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
          if (renderable.geometry) {
            renderable.geometry.dispose();
          }
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
  }, [modelUrl]);

  return (
    <aside
      className={`ar-point-model${loaded ? ' is-loaded' : ''}${failed ? ' is-failed' : ''}${isPlaceholder ? ' is-placeholder' : ''}`}
      aria-label={`${title} ${isPlaceholder ? '方块占位模型' : '3D 模型'}与说明卡片`}
    >
      <div className="ar-point-model__stage" ref={mountRef} />
      <div className="ar-point-model__caption" aria-live="polite">
        <b>{failed ? '模型暂未加载' : loaded ? (isPlaceholder ? '方块占位模型' : '设备 3D 模型') : '设备模型加载中'}</b>
        <span>{code} {title}</span>
      </div>
      <div className="ar-point-model__note">
        <span>{isPlaceholder ? '待替换模型说明' : '模型说明'}</span>
        <h2>{code} {title}</h2>
        <p>{note}</p>
        {tags.length > 0 && (
          <div className="ar-point-model__tags" aria-label="点位标签">
            {tags.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}
          </div>
        )}
      </div>
    </aside>
  );
}
