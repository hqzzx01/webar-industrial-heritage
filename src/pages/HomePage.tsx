import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { points } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const rootRef = useRef<HTMLElement>(null);
  const checked = useExperienceStore((state) => state.checkedPointIds.length);
  const score = useExperienceStore((state) => state.score);
  const progress = Math.round((checked / points.length) * 100);
  const remaining = Math.max(points.length - checked, 0);
  const nextPoint = points[checked] ?? points[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        canHover: '(hover: hover) and (pointer: fine)'
      },
      (context) => {
        const { reduceMotion, canHover } = context.conditions ?? {};
        const ctx = gsap.context(() => {
          gsap.defaults({ ease: 'power2.out', duration: reduceMotion ? 0 : 0.62 });

          if (reduceMotion) {
            gsap.set('.js-hero-item, .js-feature-card', { autoAlpha: 1, y: 0, scale: 1 });
            return;
          }

          gsap.from('.js-hero-item', {
            autoAlpha: 0,
            y: 22,
            stagger: 0.08,
            clearProps: 'transform,visibility'
          });

          ScrollTrigger.batch('.js-feature-card', {
            scroller: root,
            start: 'top 84%',
            once: true,
            batchMax: 4,
            interval: 0.08,
            onEnter: (cards) => {
              gsap.fromTo(
                cards,
                { autoAlpha: 0, y: 24 },
                {
                  autoAlpha: 1,
                  y: 0,
                  stagger: 0.08,
                  duration: 0.48,
                  clearProps: 'transform,visibility'
                }
              );
            }
          });

          if (canHover) {
            const actions = gsap.utils.toArray<HTMLElement>('.js-action');
            const enterHandlers = new Map<HTMLElement, () => void>();
            const leaveHandlers = new Map<HTMLElement, () => void>();

            actions.forEach((action) => {
              const onEnter = () => gsap.to(action, { y: -2, scale: 1.015, duration: 0.2, overwrite: 'auto' });
              const onLeave = () => gsap.to(action, { y: 0, scale: 1, duration: 0.22, overwrite: 'auto' });
              enterHandlers.set(action, onEnter);
              leaveHandlers.set(action, onLeave);
              action.addEventListener('mouseenter', onEnter);
              action.addEventListener('mouseleave', onLeave);
              action.addEventListener('blur', onLeave);
            });

            return () => {
              actions.forEach((action) => {
                const onEnter = enterHandlers.get(action);
                const onLeave = leaveHandlers.get(action);
                if (onEnter) action.removeEventListener('mouseenter', onEnter);
                if (onLeave) {
                  action.removeEventListener('mouseleave', onLeave);
                  action.removeEventListener('blur', onLeave);
                }
              });
            };
          }
        }, root);

        return () => ctx.revert();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="page home-page" ref={rootRef}>
      <div className="home-hero">
        <div className="home-hero__content">
          <span className="kicker js-hero-item">炉光记忆 WebAR</span>
          <p className="home-hero__eyebrow js-hero-item">白模识别 · 园区导览 · 工业记忆采集</p>
          <h1 className="js-hero-item">打开相机，沿着真实点位完成工业遗产探索</h1>
          <p className="home-hero__summary js-hero-item">
            从园区入口到厂房内部，系统会按点位引导识别白模、叠加 AR 内容、记录打卡照片，并在结束后生成个人记忆卡。
          </p>
          <div className="hero-actions js-hero-item" aria-label="主要操作">
            <Link className="primary-action primary-action--large js-action" to="/scan">开始 AR 扫描</Link>
            <Link className="secondary-action js-action" to="/map">查看路线地图</Link>
          </div>
        </div>

        <aside className="home-hero__status js-hero-item" aria-label="当前体验状态">
          <div className="home-status-card">
            <span>今日进度</span>
            <strong>{progress}%</strong>
            <div className="home-progress" aria-label={`已完成 ${checked} 个点位，共 ${points.length} 个`}>
              <i style={{ width: `${progress}%` }} />
            </div>
            <p>{checked} / {points.length} 个点位完成，剩余 {remaining} 个</p>
          </div>
          <div className="home-next-point">
            <span>下一推荐点位</span>
            <b>{nextPoint.code} · {nextPoint.title}</b>
            <p>{nextPoint.shortDesc}</p>
          </div>
        </aside>
      </div>

      <div className="home-dashboard" aria-label="体验数据">
        <article className="js-feature-card">
          <span>完成点位</span>
          <b>{checked}</b>
          <em>共 {points.length} 个识别点</em>
        </article>
        <article className="js-feature-card">
          <span>当前积分</span>
          <b>{score}</b>
          <em>每次打卡 +10</em>
        </article>
        <article className="js-feature-card">
          <span>路线阶段</span>
          <b>{checked < 5 ? '外部' : '内部'}</b>
          <em>按点位顺序推进</em>
        </article>
      </div>

      <div className="home-section-heading">
        <span>工作流入口</span>
        <h2>选择你现在要完成的任务</h2>
      </div>

      <div className="home-entry-grid">
        <Link className="home-entry home-entry--primary js-feature-card js-action" to="/scan">
          <span>01</span>
          <b>扫描白模点位</b>
          <em>调用相机，识别二维码或白模标识</em>
        </Link>
        <Link className="home-entry js-feature-card js-action" to="/ar-recognition">
          <span>02</span>
          <b>模拟识别成功</b>
          <em>快速预览 AR 叙事和交互状态</em>
        </Link>
        <Link className="home-entry js-feature-card js-action" to="/progress">
          <span>03</span>
          <b>查看收集进度</b>
          <em>核对打卡、徽章和路线完成度</em>
        </Link>
        <Link className="home-entry js-feature-card js-action" to="/memory-card">
          <span>04</span>
          <b>生成工业记忆卡</b>
          <em>汇总照片、点位和个人探索结果</em>
        </Link>
      </div>
    </section>
  );
}
