import { gsap } from 'gsap';
import { MARKER_POINTS, NPC_POSES, STORAGE_KEY, defaultCalibration } from './config.js';
import { getElements } from './dom.js';

const state = {
  started: false,
  furnaceOn: false,
  hotspotsVisible: true,
  calibrationOpen: false,
  activePoint: null,
  calibration: loadCalibration()
};

const els = getElements();
let sceneEl;
let overlayRoot;
let effectsRoot;
let activeMarkerId = null;

registerAframeComponents();
buildCalibrationPanel();
bindUi();
bindPreviewGuide();
bindArRuntimeEvents();
preloadNpcPoses();
initMotion();
syncOrientation();
window.addEventListener('resize', syncOrientation);
window.addEventListener('orientationchange', syncOrientation);

function registerAframeComponents() {
  if (!window.AFRAME) {
    els.bootStatus.textContent = 'A-Frame 没有加载成功，请检查网络或 CDN。';
    return;
  }

  AFRAME.registerComponent('marker-state-bridge', {
    schema: { point: { type: 'string' } },
    init() {
      this.wasVisible = false;
      this.point = MARKER_POINTS.find((item) => item.id === this.data.point);
      this.el.addEventListener('markerFound', () => activatePoint(this.point));
      this.el.addEventListener('markerLost', () => releasePoint(this.point));
    },
    tick() {
      const visible = this.el.object3D.visible;
      if (visible && !this.wasVisible) activatePoint(this.point);
      if (!visible && this.wasVisible) releasePoint(this.point);
      this.wasVisible = visible;
    }
  });

  AFRAME.registerComponent('furnace-particles', {
    schema: { active: { type: 'boolean', default: false }, count: { type: 'number', default: 40 } },
    init() {
      this.sprites = [];
      this.clock = 0;
      const texture = new THREE.TextureLoader().load('/assets/images/glow-particle.png');
      for (let i = 0; i < this.data.count; i += 1) {
        const material = new THREE.SpriteMaterial({
          map: texture,
          color: '#ff8a1c',
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(material);
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.03 + Math.random() * 0.15;
        const size = 0.018 + Math.random() * 0.032;
        sprite.position.set(Math.cos(angle) * radius, Math.random() * 0.12, Math.sin(angle) * radius);
        sprite.scale.set(size, size, size);
        sprite.userData.speed = 0.08 + Math.random() * 0.14;
        this.el.object3D.add(sprite);
        this.sprites.push(sprite);
      }
    },
    update() {
      for (const sprite of this.sprites || []) sprite.material.opacity = this.data.active ? 0.72 : 0;
    },
    tick(_time, delta) {
      if (!this.data.active) return;
      this.clock += delta / 1000;
      for (const sprite of this.sprites) {
        sprite.position.y += sprite.userData.speed * delta / 1000;
        sprite.position.x += Math.sin(this.clock * 4 + sprite.position.z * 20) * 0.0009;
        if (sprite.position.y > 0.52) sprite.position.y = 0.02;
      }
    }
  });

  AFRAME.registerComponent('pipe-flow', {
    schema: { active: { type: 'boolean', default: false }, color: { type: 'color', default: '#ff9b2f' } },
    init() {
      this.lines = [];
      const paths = [
        [[-0.34, 0.08, 0.07], [-0.2, 0.12, 0.02], [-0.1, 0.18, -0.02], [0.03, 0.2, -0.04]],
        [[0.3, 0.09, 0.07], [0.18, 0.14, 0.02], [0.1, 0.2, -0.03], [-0.03, 0.22, -0.05]],
        [[-0.24, 0.29, -0.04], [-0.07, 0.34, -0.05], [0.1, 0.3, -0.03], [0.24, 0.24, 0.02]]
      ];
      for (const points of paths) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p)));
        const material = new THREE.LineBasicMaterial({ color: this.data.color, transparent: true, opacity: 0.18, depthWrite: false });
        const line = new THREE.Line(geometry, material);
        this.el.object3D.add(line);
        this.lines.push(line);
      }
    },
    update() {
      for (const line of this.lines || []) {
        line.material.color.set(this.data.color);
        line.material.opacity = this.data.active ? 0.85 : 0.18;
      }
    },
    tick(time) {
      if (!this.data.active) return;
      const pulse = 0.52 + Math.sin(time / 170) * 0.34;
      for (const [index, line] of this.lines.entries()) line.material.opacity = Math.max(0.25, pulse - index * 0.08);
    }
  });
}

function bindUi() {
  els.startButton.addEventListener('click', startAr);
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-start-ar]')) startAr();
  });
  els.infoButton.addEventListener('click', () => {
    togglePanel(els.infoPanel);
    setNpcMessage('这里展示工业遗产背景信息。扫描不同点位后，内容会切换到对应章节。', '历史信息', 'explain');
  });
  els.closeInfoButton.addEventListener('click', () => hidePanel(els.infoPanel));
  els.glowButton.addEventListener('click', toggleFurnace);
  els.hotspotButton.addEventListener('click', toggleHotspots);
  els.photoButton.addEventListener('click', createPoster);
  els.calibrationButton.addEventListener('click', toggleCalibration);
  els.resetButton.addEventListener('click', resetExperience);
  els.closePosterButton.addEventListener('click', () => hidePanel(els.posterModal));

  for (const item of document.querySelectorAll('[data-demo-marker]')) {
    item.addEventListener('click', () => {
      const point = MARKER_POINTS.find((entry) => entry.id === item.dataset.demoMarker);
      if (point) activatePoint(point);
    });
  }

  window.addEventListener('keydown', (event) => {
    const index = Number(event.key) - 1;
    if (index >= 0 && index < MARKER_POINTS.length) activatePoint(MARKER_POINTS[index]);
    if (event.key.toLowerCase() === 'h') activatePoint(MARKER_POINTS.find((entry) => entry.id === 'official-hiro'));
    if (event.key.toLowerCase() === 'k') activatePoint(MARKER_POINTS.find((entry) => entry.id === 'official-kanji'));
  });
}

function bindPreviewGuide() {
  const guideByScreen = {
    home: ['这里是首页导览。用户可以从扫码、记忆卡册或成就入口开始体验。', '首页导览', 'idle'],
    scan: ['扫描页需要最清楚的准星和反馈。把点位标签放进框内，识别成功后会进入点位内容。', '扫描辅助', 'scan'],
    points: ['点位页承接识别结果，集中展示图文、音频讲解和 3D 互动入口。', '点位讲解', 'explain'],
    detail: ['点位详情页承接识别结果，集中展示图文、音频讲解和 3D 互动入口。', '点位讲解', 'explain'],
    route: ['路线页负责告诉用户下一站在哪里，并显示已经完成的点位数量。', '路线导览', 'explain'],
    checkin: ['打卡成功后给积分和情绪记录，用户会更愿意继续收集下一张记忆卡。', '打卡反馈', 'success'],
    album: ['记忆卡册展示收集成果，可以按已打卡和未打卡筛选。', '卡册收集', 'explain'],
    card: ['卡片详情页适合放完整故事、历史照片和收藏分享入口。', '卡片详情', 'explain'],
    achievements: ['成就页给用户长期目标，等级、徽章和进度会提升复访动机。', '成就激励', 'success'],
    profile: ['个人中心放离线地图、设置和帮助反馈，不占用主体验流程。', '个人中心', 'calibrate'],
    me: ['个人中心放记忆卡、成就、离线地图和帮助反馈，不占用主体验流程。', '个人中心', 'calibrate'],
    share: ['分享页生成海报，把现场打卡转成可传播的记忆卡。', '分享传播', 'photo']
  };

  window.addEventListener('preview-screen-change', (event) => {
    const [message, mood, pose] = guideByScreen[event.detail?.screenId] || guideByScreen.home;
    setNpcMessage(message, mood, pose);
  });
}

function initMotion() {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.app-header', { y: 8, duration: 0.28 }, 0.02)
    .from('.desktop-nav button', { x: -10, duration: 0.28, stagger: 0.035 }, 0.08)
    .from('.app-content > *', { y: 14, duration: 0.34 }, 0.12)
    .from('.bottom-nav button', { y: 8, duration: 0.28, stagger: 0.025 }, 0.18);
}

function showPanel(panel) {
  panel.classList.remove('is-hidden');
  gsap.fromTo(panel, { autoAlpha: 0, y: 12, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' });
}

function hidePanel(panel) {
  gsap.to(panel, {
    autoAlpha: 0,
    y: 8,
    duration: 0.16,
    ease: 'power2.in',
    onComplete: () => {
      panel.classList.add('is-hidden');
      gsap.set(panel, { clearProps: 'all' });
    }
  });
}

function togglePanel(panel) {
  if (panel.classList.contains('is-hidden')) showPanel(panel);
  else hidePanel(panel);
}

function bindArRuntimeEvents() {
  window.addEventListener('camera-init', () => {
    els.trackingBadge.textContent = '等待识别';
    setNpcMessage('摄像头已启动。先用官方 Hiro 或 Kanji 测试标识验证识别链路。', '摄像头就绪', 'scan');
  });

  window.addEventListener('camera-error', () => {
    els.trackingBadge.textContent = '摄像头异常';
    setNpcMessage('摄像头权限或 HTTPS 环境异常。请确认浏览器已经允许摄像头。', '摄像头异常', 'explain');
  });
}

function syncOrientation() {
  const isLandscape = window.innerWidth >= window.innerHeight;
  document.body.classList.toggle('is-landscape', isLandscape);
  els.startButton.disabled = !isLandscape || state.started;
  els.orientationPrompt.textContent = isLandscape ? '请将点位标签完整放入画面中央' : '请横屏进入体验';
  if (!state.started) {
    els.bootStatus.textContent = isLandscape
      ? '点击开始体验，允许摄像头后开始扫描点位标签。'
      : '手机请先横屏；横屏后界面会按 AR 操作区重新排布。';
    setNpcMessage(isLandscape ? '可以开始了。启动后把镜头对准任意一张点位标签。' : '先横屏，右侧工具栏和底部引导会自动避开画面中心。', isLandscape ? '准备就绪' : '横屏提示', isLandscape ? 'explain' : 'idle');
  }
}

function startAr() {
  if (state.started) return;
  if (!window.AFRAME) {
    setNpcMessage('A-Frame 没有加载成功，请检查网络或 CDN。', '加载失败', 'explain');
    return;
  }
  state.started = true;
  gsap.to(els.landing, {
    autoAlpha: 0,
    duration: 0.24,
    ease: 'power2.in',
    onComplete: () => {
      els.landing.classList.add('is-hidden');
      showPanel(els.bootSequence);
      els.arRoot.removeAttribute('aria-hidden');
      createArScene();
      runBootSequence();
      monitorCamera();
      syncOrientation();
    }
  });
}

function runBootSequence() {
  const steps = ['读取点位标签配置...', '建立白模坐标系...', '加载炉光与热点素材...', '准备摄像头扫描界面...'];
  let index = 0;
  setBootProgress(8);
  const timer = window.setInterval(() => {
    index += 1;
    setBootProgress(Math.min(100, 8 + index * 28));
    els.bootStepText.textContent = steps[Math.min(index, steps.length - 1)];
    if (index >= steps.length) {
      window.clearInterval(timer);
      hidePanel(els.bootSequence);
      els.hud.classList.remove('is-hidden');
      gsap.fromTo([els.hud.querySelector('.hud__header'), els.hud.querySelector('.action-rail'), els.hud.querySelector('.scan-reticle')],
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.05, ease: 'power2.out' }
      );
      setNpcMessage('现在进入扫描。把任意一张点位标签放到画面中央，识别后会弹出内容卡片。', '开始扫描', 'scan');
    }
  }, 420);
}

function setBootProgress(value) {
  const progress = `${value}%`;
  els.bootProgress.style.width = progress;
  if (els.runnerProgress) els.runnerProgress.style.width = progress;
  if (els.bootRunner) els.bootRunner.style.left = progress;
}

function createArScene() {
  sceneEl = document.createElement('a-scene');
  sceneEl.setAttribute('embedded', '');
  sceneEl.setAttribute('renderer', 'antialias: true; alpha: true; colorManagement: true; logarithmicDepthBuffer: true');
  sceneEl.setAttribute('vr-mode-ui', 'enabled: false');
  sceneEl.setAttribute('device-orientation-permission-ui', 'enabled: false');
  sceneEl.setAttribute(
    'arjs',
    'sourceType: webcam; debugUIEnabled: false;'
  );

  const assets = document.createElement('a-assets');
  assets.innerHTML = `
    <img id="npc-guide-texture" src="/assets/images/npc/explain.png" crossorigin="anonymous">
    <img id="particle" src="/assets/images/glow-particle.png" crossorigin="anonymous">
  `;
  sceneEl.appendChild(assets);

  for (const point of MARKER_POINTS) {
    const marker = document.createElement('a-marker');
    marker.setAttribute('id', `marker-${point.id}`);
    if (point.preset) {
      marker.setAttribute('preset', point.preset);
    } else {
      marker.setAttribute('type', 'pattern');
      marker.setAttribute('url', point.patt);
    }
    marker.setAttribute('size', '1');
    marker.setAttribute('emitevents', 'true');
    marker.setAttribute('smooth', 'true');
    marker.setAttribute('smooth-count', '10');
    marker.setAttribute('smoothCount', '10');
    marker.setAttribute('smooth-tolerance', '0.01');
    marker.setAttribute('smoothTolerance', '0.01');
    marker.setAttribute('smooth-threshold', '5');
    marker.setAttribute('smoothThreshold', '5');
    marker.setAttribute('marker-state-bridge', `point: ${point.id}`);
    bindMarkerEvents(marker, point);
    marker.appendChild(createOverlay(point));
    sceneEl.appendChild(marker);
  }

  const camera = document.createElement('a-entity');
  camera.setAttribute('camera', '');
  sceneEl.appendChild(camera);
  els.arRoot.appendChild(sceneEl);
}

function bindMarkerEvents(marker, point) {
  marker.addEventListener('markerFound', () => activatePoint(point));
  marker.addEventListener('markerLost', () => releasePoint(point));
  marker.addEventListener('loaded', () => {
    if (point.patt) console.info(`[AR marker loaded] ${point.id}: ${point.patt}`);
  });
  marker.addEventListener('error', (event) => {
    console.warn(`[AR marker failed] ${point.id}`, event);
    els.trackingBadge.textContent = '标识加载异常';
  });
}

function createOverlay(point) {
  const root = document.createElement('a-entity');
  root.setAttribute('class', 'overlay-root');

  const contour = document.createElement('a-entity');
  contour.innerHTML = `
    <a-cylinder position="0 0.16 0" radius="0.105" height="0.3" open-ended="true"
      material="color: ${point.color}; transparent: true; opacity: 0.2; wireframe: true"></a-cylinder>
    <a-cone position="0 0.34 0" radius-bottom="0.13" radius-top="0.055" height="0.18" open-ended="true"
      material="color: ${point.color}; transparent: true; opacity: 0.2; wireframe: true"></a-cone>
    <a-box position="-0.23 0.1 0.03" width="0.17" height="0.12" depth="0.08"
      material="color: #ffffff; transparent: true; opacity: 0.1; wireframe: true"></a-box>
    <a-box position="0.24 0.12 0.02" width="0.16" height="0.15" depth="0.08"
      material="color: #ffffff; transparent: true; opacity: 0.1; wireframe: true"></a-box>
  `;

  const effects = document.createElement('a-entity');
  effects.setAttribute('class', 'effects-root');
  effects.setAttribute('pipe-flow', `active: false; color: ${point.color}`);
  effects.innerHTML = `
    <a-cylinder class="furnace-effect" position="0 0.035 0" radius="0.13" height="0.018"
      material="color: ${point.color}; emissive: ${point.color}; transparent: true; opacity: 0.22"></a-cylinder>
    <a-torus class="furnace-effect" position="0 0.43 0" rotation="90 0 0" radius="0.125" radius-tubular="0.006"
      material="color: ${point.color}; emissive: ${point.color}; transparent: true; opacity: 0.34"></a-torus>
    <a-entity class="particle-field" position="0 0.04 0" furnace-particles="active: false; count: 44"></a-entity>
  `;

  const popModel = document.createElement('a-entity');
  popModel.setAttribute('class', 'pop-model-root');
  popModel.innerHTML = `
    <a-entity position="0 0.03 0" animation="property: rotation; to: 0 360 0; dur: 12000; easing: linear; loop: true">
      <a-box position="0 0.015 0" width="0.56" height="0.03" depth="0.38"
        material="color: #14110d; metalness: 0.25; roughness: 0.7; transparent: true; opacity: 0.92"></a-box>
      <a-cylinder position="-0.14 0.16 0.02" radius="0.055" height="0.28"
        material="color: ${point.color}; emissive: ${point.color}; emissiveIntensity: 0.35; metalness: 0.2; roughness: 0.45; transparent: true; opacity: 0.72"></a-cylinder>
      <a-cone position="-0.14 0.34 0.02" radius-bottom="0.07" radius-top="0.035" height="0.12"
        material="color: ${point.color}; emissive: ${point.color}; emissiveIntensity: 0.45; transparent: true; opacity: 0.82"></a-cone>
      <a-cylinder position="0.1 0.13 0.04" radius="0.035" height="0.2"
        material="color: #d8c7a2; metalness: 0.35; roughness: 0.55; transparent: true; opacity: 0.72"></a-cylinder>
      <a-torus position="-0.02 0.19 0.03" rotation="90 0 0" radius="0.19" radius-tubular="0.006"
        material="color: ${point.color}; emissive: ${point.color}; transparent: true; opacity: 0.9"></a-torus>
      <a-box position="0.18 0.09 -0.08" rotation="0 0 24" width="0.32" height="0.025" depth="0.035"
        material="color: #ffd36a; emissive: #ff9b32; transparent: true; opacity: 0.78"></a-box>
    </a-entity>
    <a-entity position="0.18 0.37 0.13" rotation="-18 -18 0">
      <a-box position="0.012 -0.012 -0.012" width="0.42" height="0.22" depth="0.018"
        material="color: #000000; transparent: true; opacity: 0.42"></a-box>
      <a-plane width="0.42" height="0.22"
        material="color: #120e0a; transparent: true; opacity: 0.9; side: double"></a-plane>
      <a-text position="-0.18 0.065 0.012" value="${point.name}" color="#fff5df" align="left" width="0.76"></a-text>
      <a-text position="-0.18 -0.02 0.012" value="识别成功，内容已弹出" color="#ffd36a" align="left" width="0.58"></a-text>
    </a-entity>
  `;

  const hotspots = document.createElement('a-entity');
  hotspots.setAttribute('class', 'hotspot-root');
  hotspots.innerHTML = `
    ${hotspotMarkup(point.hotspots[0], '0 0.28 0.14', point.color)}
    ${hotspotMarkup(point.hotspots[1], '-0.28 0.18 0.06', '#ffd36a')}
    ${hotspotMarkup(point.hotspots[2], '0.28 0.22 -0.02', '#8ee6ff')}
  `;

  const label = document.createElement('a-entity');
  label.innerHTML = `
    <a-plane position="0 0.54 0.04" width="0.46" height="0.1" material="color: #080706; transparent: true; opacity: 0.74"></a-plane>
    <a-text position="-0.2 0.55 0.05" value="${point.code} ${point.name}" color="#fff4df" align="left" width="0.9"></a-text>
  `;

  const guide = document.createElement('a-image');
  guide.setAttribute('src', '#npc-guide-texture');
  guide.setAttribute('position', '-0.43 0.18 0.16');
  guide.setAttribute('rotation', '0 18 0');
  guide.setAttribute('width', '0.2');
  guide.setAttribute('height', '0.28');
  guide.setAttribute('material', 'transparent: true; opacity: 0.86; depthWrite: false');

  root.append(contour, effects, popModel, hotspots, label, guide);
  applyCalibration(root);
  return root;
}

function hotspotMarkup(label, position, color) {
  return `
    <a-entity class="hotspot" position="${position}">
      <a-sphere radius="0.025" material="color: ${color}; emissive: ${color}; transparent: true; opacity: 0.92"></a-sphere>
      <a-ring rotation="90 0 0" radius-inner="0.035" radius-outer="0.044" material="color: ${color}; transparent: true; opacity: 0.55"></a-ring>
      <a-plane position="0.12 0.018 0" width="0.2" height="0.052" material="color: #0b0b0c; transparent: true; opacity: 0.66"></a-plane>
      <a-text position="0.035 0.014 0.004" value="${label}" color="#fff5df" align="left" width="0.52"></a-text>
    </a-entity>
  `;
}

function activatePoint(point) {
  if (!point) return;
  state.activePoint = point;
  activeMarkerId = point.id;
  overlayRoot = document.querySelector(`#marker-${point.id} .overlay-root`);
  effectsRoot = overlayRoot?.querySelector('.effects-root');
  applyCalibration(overlayRoot);
  updateStory(point);
  setFurnaceActive(state.furnaceOn || point.id === 'furnace' || point.id === 'overview');
  els.trackingBadge.textContent = `${point.code} 已识别`;
  els.trackingBadge.classList.add('is-found');
  gsap.fromTo(els.storyCard, { autoAlpha: 0, x: -16, scale: 0.98 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.26, ease: 'back.out(1.4)' });
  gsap.fromTo(els.trackingBadge, { scale: 0.88 }, { scale: 1, duration: 0.22, ease: 'back.out(2)' });
  setNpcMessage(point.npc, point.name, point.pose);
}

function releasePoint(point) {
  if (!point || activeMarkerId !== point.id) return;
  activeMarkerId = null;
  els.trackingBadge.textContent = '等待识别';
  els.trackingBadge.classList.remove('is-found');
  setNpcMessage('标签暂时丢失。稍微后退一点，让整张黑白标签回到画面中央。', '继续对准', 'scan');
}

function updateStory(point) {
  els.activeTitle.textContent = point.name;
  els.activeSummary.textContent = point.story;
  els.storyKicker.textContent = `点位 ${point.code}`;
  els.storyTitle.textContent = point.name;
  els.storyText.textContent = point.story;
  els.storyCard?.classList.add('is-visible');
}

function toggleFurnace() {
  state.furnaceOn = !state.furnaceOn;
  els.glowButton.classList.toggle('is-active', state.furnaceOn);
  els.glowButton.textContent = state.furnaceOn ? '炉光熄灭' : '炉光点亮';
  setFurnaceActive(state.furnaceOn);
  setNpcMessage(state.furnaceOn ? '炉火已经点亮。观察炉口橙光、粒子上升和管道流光。' : '炉光已关闭，保留基础轮廓和热点。', state.furnaceOn ? '炉光点亮' : '基础模式', state.furnaceOn ? 'success' : 'explain');
}

function setFurnaceActive(active) {
  if (!effectsRoot) return;
  effectsRoot.setAttribute('pipe-flow', `active: ${active}; color: ${state.activePoint?.color || '#ff9b2f'}`);
  effectsRoot.querySelector('.particle-field')?.setAttribute('furnace-particles', `active: ${active}; count: 44`);
  for (const el of effectsRoot.querySelectorAll('.furnace-effect')) {
    el.setAttribute('animation__pulse', active
      ? 'property: material.opacity; from: 0.34; to: 0.92; dur: 900; dir: alternate; loop: true; easing: easeInOutSine'
      : 'property: material.opacity; to: 0.18; dur: 240; easing: easeOutQuad');
  }
}

function toggleHotspots() {
  state.hotspotsVisible = !state.hotspotsVisible;
  els.hotspotButton.textContent = state.hotspotsVisible ? '热点隐藏' : '热点显示';
  els.hotspotButton.classList.toggle('is-active', state.hotspotsVisible);
  for (const root of document.querySelectorAll('.hotspot-root')) root.setAttribute('visible', String(state.hotspotsVisible));
  setNpcMessage(state.hotspotsVisible ? '热点已显示，每个点位会出现三条讲解标签。' : '热点已隐藏，现在更适合拍照打卡。', state.hotspotsVisible ? '热点讲解' : '清爽画面', state.hotspotsVisible ? 'explain' : 'photo');
}

function toggleCalibration() {
  state.calibrationOpen = !state.calibrationOpen;
  if (state.calibrationOpen) showPanel(els.calibrationPanel);
  else hidePanel(els.calibrationPanel);
  els.calibrationButton.classList.toggle('is-active', state.calibrationOpen);
  setNpcMessage(state.calibrationOpen ? '先调 z 轴，让特效移动到白模上方，再微调 x、y 和缩放。' : '校准面板已收起，参数已经保存。', state.calibrationOpen ? '校准模式' : '校准保存', state.calibrationOpen ? 'calibrate' : 'success');
}

function resetExperience() {
  state.calibration = { ...defaultCalibration };
  state.furnaceOn = false;
  state.hotspotsVisible = true;
  saveCalibration();
  updateCalibrationFields();
  applyCalibrationToAll();
  setFurnaceActive(false);
  els.glowButton.textContent = '炉光点亮';
  els.hotspotButton.textContent = '热点隐藏';
  els.glowButton.classList.remove('is-active');
  els.hotspotButton.classList.add('is-active');
  for (const root of document.querySelectorAll('.hotspot-root')) root.setAttribute('visible', 'true');
  setNpcMessage('炉光、热点和校准参数已经恢复默认。', '已重置', 'idle');
}

function buildCalibrationPanel() {
  const fields = [
    ['px', 'overlay position x', -0.5, 0.5, 0.01],
    ['py', 'overlay position y', -0.2, 0.6, 0.01],
    ['pz', 'overlay position z', -0.7, 0.2, 0.01],
    ['rx', 'overlay rotation x', -90, 90, 1],
    ['ry', 'overlay rotation y', -180, 180, 1],
    ['rz', 'overlay rotation z', -90, 90, 1],
    ['scale', 'overlay scale', 0.2, 2.2, 0.01]
  ];
  els.calibrationFields.innerHTML = fields.map(([key, label, min, max, step]) => `
    <label class="calibration-row" for="cal-${key}">
      <span>${label}</span>
      <input id="cal-${key}" data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state.calibration[key]}">
      <input class="number-input" data-key="${key}" type="number" min="${min}" max="${max}" step="${step}" value="${state.calibration[key]}">
    </label>
  `).join('');
  els.calibrationFields.addEventListener('input', (event) => {
    const key = event.target.dataset.key;
    if (!key) return;
    state.calibration[key] = Number(event.target.value);
    saveCalibration();
    updateCalibrationFields(key);
    applyCalibrationToAll();
  });
}

function updateCalibrationFields(changedKey) {
  for (const input of els.calibrationFields.querySelectorAll('input[data-key]')) {
    if (!changedKey || input.dataset.key === changedKey) input.value = state.calibration[input.dataset.key];
  }
}

function applyCalibration(target = overlayRoot) {
  if (!target) return;
  const c = state.calibration;
  target.setAttribute('position', `${c.px} ${c.py} ${c.pz}`);
  target.setAttribute('rotation', `${c.rx} ${c.ry} ${c.rz}`);
  target.setAttribute('scale', `${c.scale} ${c.scale} ${c.scale}`);
}

function applyCalibrationToAll() {
  for (const root of document.querySelectorAll('.overlay-root')) applyCalibration(root);
}

function setNpcMessage(message, mood = '引导员', pose = 'idle') {
  els.npcMessage.textContent = message;
  els.npcMood.textContent = mood;
  setNpcPose(pose);
}

function setNpcPose(pose) {
  const src = NPC_POSES[pose] || NPC_POSES.idle;
  if (els.npcSprite.getAttribute('src') === src) return;
  els.npcSprite.classList.remove('is-swapping');
  requestAnimationFrame(() => {
    els.npcSprite.src = src;
    els.npcSprite.classList.add('is-swapping');
  });
}

function preloadNpcPoses() {
  for (const src of Object.values(NPC_POSES)) {
    const image = new Image();
    image.src = src;
  }
}

function monitorCamera() {
  let checks = 0;
  const timer = window.setInterval(() => {
    checks += 1;
    forceCameraVideoVisible();
    const video = document.querySelector('video');
    const hasStream = video && video.readyState >= 2 && video.videoWidth > 0;
    if (hasStream) {
      els.trackingBadge.textContent = '等待识别';
      window.clearInterval(timer);
      return;
    }
    els.trackingBadge.textContent = '摄像头启动中';
    if (checks >= 12) {
      window.clearInterval(timer);
      setNpcMessage('摄像头画面还没有出现。请确认地址是 HTTPS，并且已经允许摄像头权限。', '摄像头异常', 'explain');
      els.trackingBadge.textContent = '摄像头未就绪';
    }
  }, 700);
}

function forceCameraVideoVisible() {
  const video = document.querySelector('video');
  if (!video) return;
  video.setAttribute('playsinline', '');
  video.style.position = 'fixed';
  video.style.inset = '0';
  video.style.width = '100vw';
  video.style.height = '100vh';
  video.style.objectFit = 'cover';
  video.style.zIndex = '0';
  video.style.opacity = '1';
  video.style.visibility = 'visible';
  video.style.pointerEvents = 'none';
}

function loadCalibration() {
  try {
    return { ...defaultCalibration, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaultCalibration };
  }
}

function saveCalibration() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.calibration));
}

async function createPoster() {
  setNpcMessage('正在生成横屏打卡海报。', '拍照打卡', 'photo');
  const canvas = els.posterCanvas;
  const ctx = canvas.getContext('2d');
  const video = document.querySelector('video');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (video && video.readyState >= 2) drawVideoCover(ctx, video, canvas.width, canvas.height);
  else {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#15110d');
    gradient.addColorStop(1, '#3b1a08');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  try {
    const frame = await loadImage('/assets/images/checkin-frame.png');
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  } catch {
    ctx.strokeStyle = 'rgba(255, 138, 30, 0.9)';
    ctx.lineWidth = 14;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
  }
  ctx.fillStyle = '#fff4df';
  ctx.font = '700 92px "STXingkai", "KaiTi", serif';
  ctx.fillText('炉光记忆', 104, 650);
  ctx.font = '500 38px "STXingkai", "KaiTi", serif';
  ctx.fillText('我在工业遗产现场点亮了城市记忆', 108, 714);
  ctx.font = '400 28px "STXingkai", "KaiTi", serif';
  ctx.fillStyle = 'rgba(255, 244, 223, 0.88)';
  ctx.fillText('扫描实体白模，重见工业时代的炉火与空间记忆', 108, 768);
  ctx.fillStyle = '#ff982d';
  ctx.fillRect(108, 596, 220, 8);
  const dataUrl = canvas.toDataURL('image/png');
  els.posterPreview.src = dataUrl;
  els.downloadPoster.href = dataUrl;
  showPanel(els.posterModal);
}

function drawVideoCover(ctx, video, width, height) {
  const vw = video.videoWidth || width;
  const vh = video.videoHeight || height;
  const scale = Math.max(width / vw, height / vh);
  const sw = width / scale;
  const sh = height / scale;
  ctx.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, width, height);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
