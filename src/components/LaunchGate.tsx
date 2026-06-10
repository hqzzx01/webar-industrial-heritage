import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type Props = {
  onEnter: () => void;
};

const preloadAssets = [
  '/assets/backgrounds/heritage-points.png',
  '/assets/backgrounds/hero-generated.png',
  '/assets/images/npc/scan.png',
  '/assets/images/glow-particle.png'
];

const loadingSteps = [
  '正在唤醒工业遗产记忆...',
  '正在读取园区与厂房点位...',
  '正在准备 AR 模型与导览员...',
  '系统准备完成，点击进入体验'
];

export function LaunchGate({ onEnter }: Props) {
  const [progress, setProgress] = useState(3);
  const ready = progress >= 100;
  const particles = useMemo(() => Array.from({ length: 18 }, (_, index) => index), []);

  useEffect(() => {
    let active = true;
    let animationFrame = 0;
    const startedAt = performance.now();
    let assetsReady = false;

    Promise.all(preloadAssets.map((src) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
    }))).then(() => {
      assetsReady = true;
    });

    const update = (now: number) => {
      if (!active) return;
      const elapsed = now - startedAt;
      const timedProgress = Math.min(94, 3 + (elapsed / 2800) * 91);
      const nextProgress = assetsReady && elapsed >= 2200 ? 100 : timedProgress;
      setProgress(Math.round(nextProgress));
      if (nextProgress < 100) animationFrame = window.requestAnimationFrame(update);
    };

    animationFrame = window.requestAnimationFrame(update);
    return () => {
      active = false;
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const stepIndex = ready ? 3 : progress >= 68 ? 2 : progress >= 34 ? 1 : 0;

  return (
    <main className={`launch-gate${ready ? ' is-ready' : ''}`} aria-label="炉光记忆启动界面">
      <div className="launch-gate__particles" aria-hidden="true">
        {particles.map((particle) => (
          <i
            style={{
              '--particle-index': particle,
              '--particle-x': `${(particle * 37 + 9) % 96}%`,
              '--particle-y': `${(particle * 23 + 12) % 92}%`,
              '--particle-size': `${3 + (particle % 3) * 2}px`
            } as CSSProperties}
            key={particle}
          />
        ))}
      </div>
      <section className="launch-gate__card">
        <div className="launch-gate__visual">
          <span className="launch-gate__eyebrow">工业遗产白模 AR 体验系统</span>
          <h1>炉光记忆</h1>
          <p>跟随导览员进入园区，在白模、设备和人物故事之间完成一场工业记忆探索。</p>
          <div className="launch-gate__rings" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="launch-gate__loading">
          <div className="launch-gate__status">
            <span>{loadingSteps[stepIndex]}</span>
            <b>{progress}%</b>
          </div>
          <div className="launch-runner" aria-label={`启动进度 ${progress}%`}>
            <div className="launch-runner__track">
              <i style={{ width: `${progress}%` }} />
              <img style={{ left: `${progress}%` }} src="/assets/images/npc/scan.png" alt="正在奔跑的 NPC 导览员" />
            </div>
          </div>
          <button type="button" disabled={!ready} onClick={onEnter}>
            {ready ? '点击进入系统' : '系统加载中'}
          </button>
          <small>{ready ? '已完成加载，点击后开始工业遗产 AR 导览' : '请稍候，导览员正在为你准备体验内容'}</small>
        </div>
      </section>
    </main>
  );
}
