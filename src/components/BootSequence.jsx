export function BootSequence() {
  return (
    <section id="bootSequence" className="boot-sequence is-hidden" aria-label="启动进度">
      <div className="boot-card">
        <div className="boot-model">
          <img src="/assets/backgrounds/hero-generated.png" alt="工业白模启动画面" />
          <div className="scan-line" />
        </div>
        <div className="boot-copy">
          <span>模型定位中</span>
          <h2>正在加载 AR 识别系统</h2>
          <div className="boot-bar"><i id="bootProgress" /></div>
          <div className="boot-runner" aria-hidden="true">
            <div className="runner-track"><i id="runnerProgress" /></div>
            <img id="bootRunner" src="/assets/images/npc/scan.png" alt="" />
          </div>
          <p id="bootStepText">读取点位标签配置...</p>
        </div>
      </div>
    </section>
  );
}
