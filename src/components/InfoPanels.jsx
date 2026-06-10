export function InfoPanels() {
  return (
    <>
      <aside id="infoPanel" className="info-panel is-hidden" aria-label="历史信息">
        <button id="closeInfoButton" className="icon-button" type="button" aria-label="关闭">×</button>
        <h3>工业遗产记忆</h3>
        <p>白模负责呈现空间体量，AR 叠加工艺流程、炉火状态、参观点位和城市记忆。</p>
        <p>识别点位后，右侧操作可以切换历史信息、炉光效果、热点讲解和打卡海报。</p>
        <div className="debug-links" aria-label="官方测试工具">
          <span>测试工具</span>
          <a href="/marker-guide.html" target="_blank" rel="noreferrer">生成 Marker</a>
          <a href="/official-markers.html" target="_blank" rel="noreferrer">官方标识页</a>
          <a href="/arjs-official-test.html" target="_blank" rel="noreferrer">AR.js 最小测试</a>
          <button data-demo-marker="official-hiro" type="button">模拟 Hiro</button>
          <button data-demo-marker="official-kanji" type="button">模拟 Kanji</button>
        </div>
      </aside>

      <aside id="calibrationPanel" className="calibration-panel is-hidden" aria-label="校准面板">
        <div className="panel-title">
          <h3>校准面板</h3>
          <span>自动保存</span>
        </div>
        <div id="calibrationFields" className="calibration-fields" />
      </aside>

      <section id="posterModal" className="poster-modal is-hidden" aria-label="打卡海报">
        <div className="poster-card">
          <button id="closePosterButton" className="icon-button" type="button" aria-label="关闭">×</button>
          <img id="posterPreview" alt="炉光记忆打卡海报" />
          <a id="downloadPoster" className="primary-button" download="炉光记忆-打卡海报.png">保存海报</a>
        </div>
      </section>
    </>
  );
}
