export const STORAGE_KEY = 'furnace-memory-calibration-v2';

export const NPC_POSES = {
  idle: '/assets/images/npc/idle.png',
  scan: '/assets/images/npc/scan.png',
  explain: '/assets/images/npc/explain.png',
  success: '/assets/images/npc/success.png',
  calibrate: '/assets/images/npc/calibrate.png',
  photo: '/assets/images/npc/photo.png'
};

export const MARKER_POINTS = [
  {
    id: 'furnace',
    code: '01',
    name: '炉口点亮',
    patt: '/assets/marker/pattern-furnace-simple.patt',
    color: '#ff8a28',
    pose: 'success',
    npc: '识别到炉口点位。现在可以点亮炉光，观察炉口余温、上升火星和顶部光环。',
    story: '高炉是工业遗产中最具识别度的核心装置。AR 用橙色光效还原炉火重新升起的瞬间。',
    hotspots: ['炉口余温', '上升火星', '顶部光环']
  },
  {
    id: 'pipe',
    code: '02',
    name: '管道流光',
    patt: '/assets/marker/pattern-pipe-simple.patt',
    color: '#ffd36a',
    pose: 'explain',
    npc: '识别到管道点位。流光线会表达原本看不见的能源与工艺流向。',
    story: '管道连接炉体、厂房和动力系统。流光动画把复杂工艺路径转译成可读的参观线索。',
    hotspots: ['输送路径', '能源流向', '工艺节点']
  },
  {
    id: 'memory',
    code: '03',
    name: '空间记忆',
    patt: '/assets/marker/pattern-memory-simple.patt',
    color: '#8ee6ff',
    pose: 'explain',
    npc: '识别到记忆点位。这里会弹出历史说明和空间轮廓，帮助理解遗址尺度。',
    story: '厂区保留的结构记录了生产、停用与更新的过程。AR 补充历史、声音和参观叙事。',
    hotspots: ['厂房轮廓', '工人记忆', '城市更新']
  },
  {
    id: 'overview',
    code: '04',
    name: '总览打卡',
    patt: '/assets/marker/pattern-overview-simple.patt',
    color: '#ff9b32',
    pose: 'photo',
    npc: '识别到总览点位。适合最后拍照打卡，把白模、炉光和导览文案一起留下。',
    story: '总览点位合并炉口、管道与空间叙事，形成完整的工业遗产白模 AR 体验。',
    hotspots: ['路线总览', '白模中心', '拍照打卡']
  },
  {
    id: 'official-hiro',
    code: 'H',
    name: '官方 Hiro 测试',
    preset: 'hiro',
    color: '#ff4f37',
    pose: 'success',
    npc: '识别到 AR.js 官方 Hiro 标识。说明摄像头、AR.js 和 marker 事件链路是通的。',
    story: '这是 AR.js 官方 marker 示例常用的 Hiro 图。它用于验证主应用的扫描事件是否正常。',
    hotspots: ['官方示例', '事件触发', '识别链路']
  },
  {
    id: 'official-kanji',
    code: 'K',
    name: '官方 Kanji 测试',
    preset: 'kanji',
    color: '#33d17a',
    pose: 'success',
    npc: '识别到 AR.js 官方 Kanji 标识。当前页面已经接入官方示例中的测试扫描。',
    story: 'Kanji 是 AR.js 另一张官方测试 marker。Hiro/Kanji 能识别而自定义不能识别时，通常是图片和 patt 不匹配。',
    hotspots: ['Kanji 标识', '官方测试', '稳定追踪']
  }
];

export const defaultCalibration = {
  px: 0,
  py: 0.03,
  pz: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  scale: 1
};
