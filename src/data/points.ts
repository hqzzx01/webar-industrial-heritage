export type PointArea = 'external' | 'internal';

export type Point = {
  id: string;
  code: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5';
  title: string;
  area: PointArea;
  shortDesc: string;
  fullDesc: string;
  processDesc: string;
  spaceDesc: string;
  image: string;
  model?: string;
  // 替换模型旁边说明卡的文案：在对应点位对象里填写 modelNote。
  modelNote?: string;
  audio?: string;
  tags: string[];
  mapPosition: { x: number; y: number };
};

export const pointImage = '/assets/backgrounds/heritage-points.webp';
export const heroImage = '/assets/backgrounds/hero-generated.png';

export const points: Point[] = [
  {
    id: 'a1',
    code: 'A1',
    title: '园区入口',
    area: 'external',
    shortDesc: '进入工业遗产园区的第一处识别点。',
    fullDesc: '园区入口连接城市道路与厂区内部空间，是参观者理解工业遗产尺度和路线结构的起点。',
    processDesc: '入口点展示从扫码进入、识别白模到启动路线导览的完整流程。',
    spaceDesc: '该点位帮助用户建立园区方位，理解厂门、道路、铁路和主体厂房之间的关系。',
    image: '/assets/points/point-01.png',
    tags: ['入口', '路线', '导览'],
    mapPosition: { x: 14, y: 55 }
  },
  {
    id: 'a2',
    code: 'A2',
    title: '旧烟囱',
    area: 'external',
    shortDesc: '厂区重要工业符号，记录生产时期的空间记忆。',
    fullDesc: '旧烟囱是厂区天际线中最醒目的结构之一，见证了能源转换、生产高峰与城市工业化记忆。',
    processDesc: 'AR 内容以历史照片叠加和高度标注为主，展示烟囱与炉体、厂房之间的生产关系。',
    spaceDesc: '烟囱所在位置是园区外部路线的重要视觉锚点，适合作为拍照打卡背景。',
    image: '/assets/points/point-02.png',
    tags: ['烟囱', '地标', '历史照片'],
    mapPosition: { x: 31, y: 49 }
  },
  {
    id: 'a3',
    code: 'A3',
    title: '园区格局',
    area: 'external',
    shortDesc: '观察厂区道路、建筑群和生产空间的组织方式。',
    fullDesc: '园区格局展示了工业生产对空间组织的影响，厂房、铁路、仓储和绿化共同构成完整的生产场景。',
    processDesc: 'AR 叙事以路线指引和建筑轮廓标注为主，帮助用户按顺序探索外部点位。',
    spaceDesc: '该点位适合从白模俯视角理解厂区结构，辨认主体厂房、道路和铁路走向。',
    image: '/assets/points/point-03.png',
    tags: ['格局', '俯视图', '路线'],
    mapPosition: { x: 45, y: 45 }
  },
  {
    id: 'a4',
    code: 'A4',
    title: '技术革新',
    area: 'external',
    shortDesc: '展示厂区技术更新与设备迭代的节点。',
    fullDesc: '技术革新点位说明工业遗产并非静止的建筑，而是不断经历设备更新、工艺调整和生产组织变化。',
    processDesc: 'AR 内容通过时间轴、设备更替标签和工艺节点高亮呈现技术演化。',
    spaceDesc: '该点位连接外部参观与内部设备展示，是进入厂房叙事之前的过渡节点。',
    image: '/assets/points/point-04.png',
    tags: ['技术', '更新', '时间轴'],
    mapPosition: { x: 61, y: 36 }
  },
  {
    id: 'a5',
    code: 'A5',
    title: '停产与转型',
    area: 'external',
    shortDesc: '记录厂区从生产空间转向公共文化空间的过程。',
    fullDesc: '停产与转型点位展示工业遗产从生产功能退出后，如何通过保护、更新与再利用进入城市公共生活。',
    processDesc: 'AR 内容用对比卡片呈现生产时期、停产时期和更新后的空间变化。',
    spaceDesc: '该点位强调城市更新中的记忆保留，让用户理解白模装置背后的社会意义。',
    image: '/assets/points/point-05.png',
    tags: ['转型', '城市更新', '保护'],
    mapPosition: { x: 75, y: 42 }
  },
  {
    id: 'b1',
    code: 'B1',
    title: '厂房入口',
    area: 'internal',
    shortDesc: '从园区外部进入厂房内部叙事的入口。',
    fullDesc: '厂房入口连接外部空间和生产内部，是理解设备结构、工艺流程和人物记忆的起点。',
    processDesc: 'AR 内容提示用户从外部参观切换到内部生产线空间。',
    spaceDesc: '该点位展示厂房门厅、通道和设备区之间的空间关系。',
    image: '/assets/points/point-06.png',
    tags: ['厂房', '入口', '空间切换'],
    mapPosition: { x: 35, y: 78 }
  },
  {
    id: 'b2',
    code: 'B2',
    title: '生产线空间',
    area: 'internal',
    shortDesc: '理解生产线布置与工艺路线。',
    fullDesc: '生产线空间展示原料、设备、人员和运输路线之间的组织关系，是厂房内部体验的核心。',
    processDesc: 'AR 内容以流程箭头和节点高亮展示生产线运行逻辑。',
    spaceDesc: '用户可以通过该点位理解大型工业空间中设备排列与通行路径。',
    image: '/assets/points/point-07.png',
    tags: ['生产线', '路线', '流程'],
    mapPosition: { x: 52, y: 72 }
  },
  {
    id: 'b3',
    code: 'B3',
    title: '设备结构拆解',
    area: 'internal',
    shortDesc: '查看关键设备结构和拆解层级。',
    fullDesc: '设备结构拆解点位用于解释大型设备的构成，帮助非专业观众理解工业设施的基本原理。',
    processDesc: 'AR 内容可切换 3D 模型、结构爆炸图和关键部件标注。',
    spaceDesc: '设备位于厂房内部核心区域，是从空间体验进入技术理解的重要节点。',
    image: '/assets/points/point-08.png',
    model: '/assets/3D/%E6%9C%BA%E5%99%A81.glb',
    modelNote: '这里展示机器 1 的 3D 模型，可用于说明设备外形、核心结构和拆解层级。后续可把这段文字替换成正式展陈说明。',
    tags: ['设备', '结构', '3D 模型'],
    mapPosition: { x: 65, y: 68 }
  },
  {
    id: 'b4',
    code: 'B4',
    title: '工艺流程展示',
    area: 'internal',
    shortDesc: '以流程动画解释生产工艺。',
    fullDesc: '工艺流程展示点位将抽象生产过程转译为可视化路径，让用户理解能源、材料和设备之间的关系。',
    processDesc: 'AR 内容以工艺节点、流光路径和分步说明展示流程。',
    spaceDesc: '该点位适合与生产线空间联动，形成从空间到工艺的连续理解。',
    image: '/assets/points/point-09.png',
    model: '/assets/3D/%E6%9C%BA%E5%99%A82.glb',
    modelNote: '这里展示机器 2 的 3D 模型，可用于说明工艺流程、能量路径和关键运转节点。后续可把这段文字替换成正式展陈说明。',
    tags: ['工艺', '动画', '流程'],
    mapPosition: { x: 72, y: 58 }
  },
  {
    id: 'b5',
    code: 'B5',
    title: '人物记忆与知识拓展',
    area: 'internal',
    shortDesc: '补充工人记忆、知识问答与拓展内容。',
    fullDesc: '人物记忆点位从个人叙事进入工业遗产，补充声音、照片和知识卡片，让参观体验更具温度。',
    processDesc: 'AR 内容以人物卡片、语音片段和知识问答组成。',
    spaceDesc: '该点位通常位于路线末段，用于收束体验并引导生成记忆卡。',
    image: '/assets/points/point-10.png',
    tags: ['人物', '声音', '知识'],
    mapPosition: { x: 82, y: 36 }
  }
];

export function getPointById(pointId?: string | null) {
  return points.find((point) => point.id === pointId || point.code.toLowerCase() === pointId?.toLowerCase());
}

export function getMainFlowNumber(pointId: string) {
  const index = points.findIndex((point) => point.id === pointId);
  return index >= 0 ? index + 1 : null;
}

export function getNextPoint(pointId: string) {
  const index = points.findIndex((point) => point.id === pointId);
  return points[(index + 1) % points.length];
}
