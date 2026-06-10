import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type * as Three from 'three';

type Props = {
  label?: string;
  speaking?: boolean;
  dialogueTitle?: string;
  dialogue?: string;
};

const NPC_MODEL_URL = '/assets/3D/renwu.glb';
const NPC_FALLBACK_IMAGE = '/assets/images/npc/explain.png';

export function ARNpcModel({
  label = 'AI 导览员已进入 3D 模式',
  speaking = true,
  dialogueTitle = '3D 导览员',
  dialogue = '点击画面中的点位或打开内容面板，我会继续为你讲解工业遗产故事。'
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);

  useEffect(() => {
    if (!dialogueOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialogueOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [dialogueOpen]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};

    async function setupScene() {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (disposed) return;

      let frameId = 0;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(0, 1.15, 5.2);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      mount.appendChild(renderer.domElement);

      const key = new THREE.DirectionalLight(0xffffff, 2.8);
      key.position.set(2.5, 3.8, 4);
      scene.add(key);
      scene.add(new THREE.HemisphereLight(0xdbeafe, 0x24160f, 1.55));

      const floorGlow = new THREE.Mesh(
        new THREE.CircleGeometry(1.25, 48),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.14 })
      );
      floorGlow.rotation.x = -Math.PI / 2;
      floorGlow.position.y = -1.2;
      scene.add(floorGlow);

      const group = new THREE.Group();
      group.position.y = -0.2;
      scene.add(group);

      const waveGroup = new THREE.Group();
      waveGroup.position.set(0.62, 0.92, 0.08);
      group.add(waveGroup);

      const waveDots = [0, 1, 2].map((index) => {
        const material = new THREE.MeshBasicMaterial({
          color: index === 0 ? 0xfef3c7 : 0x38bdf8,
          transparent: true,
          opacity: 0.72
        });
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035 + index * 0.006, 18, 18), material);
        waveGroup.add(dot);
        return dot;
      });

      const speechRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.72, 0.01, 8, 72),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.18 })
      );
      speechRing.rotation.x = -Math.PI / 2;
      speechRing.position.y = -1.14;
      group.add(speechRing);

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
        NPC_MODEL_URL,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxAxis = Math.max(size.x, size.y, size.z) || 1;
          model.position.sub(center);
          model.scale.setScalar(2.45 / maxAxis);
          model.rotation.y = -0.28;
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
          const danceBeat = speaking ? Math.abs(Math.sin(time * 3.8)) : Math.sin(time * 1.4) * 0.5 + 0.5;
          group.rotation.y = -0.08 + Math.sin(time * (speaking ? 2.3 : 0.8)) * (speaking ? 0.18 : 0.08);
          group.rotation.z = speaking ? Math.sin(time * 4.2) * 0.025 : 0;
          group.position.y = -0.2 + Math.sin(time * (speaking ? 3.8 : 1.4)) * (speaking ? 0.075 : 0.035);
          group.scale.set(1 + danceBeat * 0.018, 1 - danceBeat * 0.012, 1 + danceBeat * 0.018);
          floorGlow.scale.setScalar(1 + Math.sin(time * (speaking ? 4.6 : 1.8)) * (speaking ? 0.075 : 0.035));
          speechRing.scale.setScalar(1 + danceBeat * 0.14);
          (speechRing.material as Three.MeshBasicMaterial).opacity = speaking ? 0.12 + danceBeat * 0.2 : 0.08;
          waveGroup.visible = speaking;
          waveDots.forEach((dot, index) => {
            const phase = time * 5.4 + index * 0.7;
            dot.position.set(Math.sin(phase) * 0.15, Math.cos(phase) * 0.14 - index * 0.035, 0.02);
            (dot.material as Three.MeshBasicMaterial).opacity = 0.35 + Math.abs(Math.sin(phase)) * 0.45;
          });
        }
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };

      render();

      cleanup = () => {
        observer.disconnect();
        window.cancelAnimationFrame(frameId);
        scene.traverse((object) => {
          const mesh = object as Three.Mesh;
          if (mesh.isMesh) {
            mesh.geometry?.dispose();
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
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
    <>
      <aside className={`ar-npc-model${loaded ? ' is-loaded' : ''}${failed ? ' is-failed' : ''}${speaking ? ' is-speaking' : ''}`} aria-label={label}>
        <button type="button" className="ar-npc-model__trigger" onClick={() => setDialogueOpen(true)} aria-haspopup="dialog">
          <div className="ar-npc-model__stage" ref={mountRef}>
            {!loaded && <img className="ar-npc-model__sprite" src={NPC_FALLBACK_IMAGE} alt="" />}
          </div>
          <div className="ar-npc-model__caption">
            <b>{failed ? '3D 模型暂未加载' : loaded ? '点击 NPC 对话' : '导览员正在进入 3D'}</b>
            <span>{failed ? '点击打开文字讲解' : '点我查看当前点位讲解'}</span>
          </div>
        </button>
      </aside>
      {dialogueOpen && createPortal(
        <div className="npc-dialog" role="presentation" onClick={() => setDialogueOpen(false)}>
          <section className="npc-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="npc-dialog-title" onClick={(event) => event.stopPropagation()}>
            <img src={NPC_FALLBACK_IMAGE} alt="3D 导览员" />
            <div>
              <span>NPC 导览讲解</span>
              <h2 id="npc-dialog-title">{dialogueTitle}</h2>
              <p>{dialogue}</p>
              <button type="button" onClick={() => setDialogueOpen(false)}>知道了</button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </>
  );
}
