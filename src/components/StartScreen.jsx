import { useMemo, useState } from 'react';

const pages = [
  { id: 'home', icon: '⌂', label: '首页', title: '工业记忆导览', pose: 'idle' },
  { id: 'scan', icon: '⌗', label: '扫一扫', title: '扫描识别', pose: 'scan' },
  { id: 'points', icon: '⌖', label: '点位', title: '点位详情', pose: 'explain' },
  { id: 'route', icon: '⌁', label: '路线', title: '路线导览', pose: 'explain' },
  { id: 'album', icon: '▣', label: '卡册', title: '记忆卡册', pose: 'photo' },
  { id: 'me', icon: '◎', label: '我的', title: '个人中心', pose: 'success' }
];

const pointCards = [
  ['furnace', '01', '炉口点亮', '识别白模炉体，点亮炉火与热区。', '未开始'],
  ['pipe', '02', '管道流光', '显示能源流向与工艺路径。', '未开始'],
  ['memory', '03', '空间记忆', '弹出厂区历史与空间叙事。', '未开始'],
  ['overview', '04', '总览打卡', '生成工业遗产记忆卡。', '未开始']
];

const memoryCards = [
  ['炉口余温', '炉火升起瞬间', '已收集'],
  ['管道流光', '能源路径记录', '未打卡'],
  ['空间记忆', '厂区历史片段', '未打卡'],
  ['总览打卡', '完整路线纪念', '未打卡']
];

export function StartScreen() {
  const [activeId, setActiveId] = useState('home');
  const active = useMemo(() => pages.find((page) => page.id === activeId) || pages[0], [activeId]);

  const switchPage = (pageId) => {
    setActiveId(pageId);
    window.dispatchEvent(new CustomEvent('preview-screen-change', { detail: { screenId: pageId } }));
  };

  return (
    <main id="landing" className="landing app-landing">
      <section className="app-shell" aria-label="炉光记忆应用">
        <AppHeader />

        <div className="app-body">
          <aside className="desktop-nav" aria-label="应用导航">
            {pages.map((page) => (
              <button className={page.id === active.id ? 'is-active' : ''} type="button" onClick={() => switchPage(page.id)} key={page.id}>
                <span>{page.icon}</span>
                {page.label}
              </button>
            ))}
          </aside>

          <section className="app-content" aria-label={active.title}>
            {active.id === 'home' && <HomePage />}
            {active.id === 'scan' && <ScanPage />}
            {active.id === 'points' && <PointsPage />}
            {active.id === 'route' && <RoutePage />}
            {active.id === 'album' && <AlbumPage />}
            {active.id === 'me' && <ProfilePage />}
          </section>
        </div>

        <nav className="bottom-nav" aria-label="底部导航">
          {pages.map((page) => (
            <button className={page.id === active.id ? 'is-active' : ''} type="button" onClick={() => switchPage(page.id)} key={page.id}>
              <span>{page.icon}</span>
              {page.label}
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}

function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-title">
        <b>炉光记忆</b>
        <span>工业遗产白模 AR 体验系统</span>
      </div>
      <div className="header-actions">
        <a href="/marker-guide.html" target="_blank" rel="noreferrer">生成 Marker</a>
        <a href="/arjs-official-test.html" target="_blank" rel="noreferrer">AR.js 测试</a>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <div className="page-grid page-home">
      <section className="hero-card">
        <span className="page-kicker">首页 / 导览页</span>
        <h1>扫描白模点位，点亮工业遗产现场记忆。</h1>
        <p>从白模标签进入 AR 导览，依次完成点位识别、内容浏览、拍照打卡和记忆卡收集。</p>
        <div className="start-dock">
          <div>
            <p id="orientationPrompt" className="orientation-prompt">请横屏进入 AR 扫描</p>
            <p id="bootStatus" className="boot-status">点击开始体验，允许摄像头后开始扫描点位标签。</p>
          </div>
          <button id="startButton" data-start-ar className="primary-button has-icon icon-start" type="button">开始 AR</button>
        </div>
      </section>

      <section className="quick-card">
        <h2>快速入口</h2>
        <div className="quick-grid">
          <button data-demo-marker="furnace" type="button">模拟炉口点位</button>
          <button data-demo-marker="official-hiro" type="button">官方 Hiro 测试</button>
          <button data-demo-marker="official-kanji" type="button">官方 Kanji 测试</button>
          <a href="/official-markers.html" target="_blank" rel="noreferrer">打开标识图</a>
        </div>
      </section>

      <section className="route-summary">
        <h2>今日路线</h2>
        {pointCards.map(([id, code, title, desc]) => (
          <button data-demo-marker={id} type="button" key={id}>
            <b>{code}</b>
            <span>{title}</span>
            <em>{desc}</em>
          </button>
        ))}
      </section>
    </div>
  );
}

function ScanPage() {
  return (
    <div className="scan-page">
      <section className="scan-preview">
        <img src="/assets/backgrounds/hero-generated.png" alt="工业白模扫描预览" />
        <div className="scan-box">
          <i />
          <span>将点位标签放入框内</span>
        </div>
      </section>
      <aside className="scan-tools">
        <h1>扫一扫 / 扫描页</h1>
        <p>对准白模二维码或点位标签，识别成功后进入 AR 扫描与点位内容。</p>
        <button data-start-ar className="primary-button has-icon icon-start" type="button">启动摄像头</button>
        <div className="tool-list">
          <span>扫描识别框</span>
          <span>手电筒</span>
          <span>相册导入</span>
          <span>扫描记录</span>
        </div>
      </aside>
    </div>
  );
}

function PointsPage() {
  return (
    <div className="card-list-page">
      <header className="page-header">
        <span className="page-kicker">点位详情页</span>
        <h1>选择点位，查看故事与 AR 内容</h1>
      </header>
      <div className="point-grid">
        {pointCards.map(([id, code, title, desc, status]) => (
          <article className="point-card" key={id}>
            <img src="/assets/backgrounds/hero-generated.png" alt="" />
            <div>
              <b>{code}</b>
              <h2>{title}</h2>
              <p>{desc}</p>
              <span>{status}</span>
            </div>
            <button data-demo-marker={id} type="button">查看</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function RoutePage() {
  return (
    <div className="route-page">
      <section className="map-panel">
        {[1, 2, 3, 4, 5, 6].map((item) => <i key={item}>{item}</i>)}
      </section>
      <aside className="route-detail">
        <span className="page-kicker">路线导览页</span>
        <h1>发现探索 → 深度体验 → 记录传播</h1>
        <p>路线页用于查看当前进度，快速定位下一处点位。</p>
        <div className="progress-card"><b>25%</b><span>已完成 1 / 4 个点位</span></div>
      </aside>
    </div>
  );
}

function AlbumPage() {
  return (
    <div className="album-page">
      <header className="page-header">
        <span className="page-kicker">记忆卡册页</span>
        <h1>我的记忆卡</h1>
      </header>
      <div className="memory-grid">
        {memoryCards.map(([title, desc, status]) => (
          <article key={title}>
            <img src="/assets/backgrounds/hero-generated.png" alt="" />
            <h2>{title}</h2>
            <p>{desc}</p>
            <span>{status}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="profile-page">
      <section className="profile-card">
        <img src="/assets/images/npc/idle.png" alt="" />
        <div>
          <span className="page-kicker">个人中心页</span>
          <h1>工业探索者</h1>
          <p>管理记忆卡、成就、离线地图和系统设置。</p>
        </div>
      </section>
      <div className="stats-grid">
        <article><b>120</b><span>积分</span></article>
        <article><b>4</b><span>点位</span></article>
        <article><b>1</b><span>记忆卡</span></article>
      </div>
      <div className="settings-list">
        <button type="button">我的路线</button>
        <button type="button">我的成就</button>
        <button type="button">离线地图</button>
        <button type="button">帮助与反馈</button>
      </div>
    </div>
  );
}
