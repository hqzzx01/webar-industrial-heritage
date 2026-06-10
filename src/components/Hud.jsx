const actions = [
  ['infoButton', 'icon-info', '历史信息'],
  ['glowButton', 'icon-furnace', '炉光点亮'],
  ['hotspotButton', 'icon-hotspot is-active', '热点隐藏'],
  ['photoButton', 'icon-camera', '拍照打卡'],
  ['calibrationButton', 'icon-calibrate', '校准模式'],
  ['resetButton', 'icon-reset', '重置']
];

export function Hud() {
  return (
    <section id="hud" className="hud is-hidden" aria-label="AR 操作界面">
      <header className="hud__header">
        <div>
          <h2 id="activeTitle">炉光记忆</h2>
          <p id="activeSummary">等待识别白模点位标签</p>
        </div>
        <span id="trackingBadge" className="tracking-badge">等待识别</span>
      </header>

      <aside id="storyCard" className="story-card">
        <span id="storyKicker">当前点位</span>
        <h3 id="storyTitle">请扫描标签</h3>
        <p id="storyText">将白模上的点位标签完整放入画面中央，识别后会弹出对应内容。</p>
      </aside>

      <nav className="action-rail" aria-label="AR 操作">
        {actions.map(([id, icon, label]) => (
          <button id={id} className={`tool-button has-icon ${icon}`} type="button" key={id}>{label}</button>
        ))}
      </nav>

      <div className="side-meter" aria-hidden="true"><i /></div>

      <div className="scan-reticle" aria-hidden="true">
        <i className="corner corner-tl" />
        <i className="corner corner-tr" />
        <i className="corner corner-bl" />
        <i className="corner corner-br" />
        <span className="reticle-crosshair" />
        <p>将标签放入框内</p>
      </div>
    </section>
  );
}
