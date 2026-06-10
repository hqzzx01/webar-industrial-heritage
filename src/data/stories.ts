export type StoryLayer = {
  id: string;
  label: string;
  description: string;
};

export const storyLayers: StoryLayer[] = [
  { id: 'photo', label: '历史照片', description: '叠加历史影像，展示点位过去与现在的对比。' },
  { id: 'model', label: '3D 模型', description: '展示设备结构、建筑轮廓或白模对应关系。' },
  { id: 'process', label: '工艺流程', description: '用流光路径和节点标签解释生产工艺。' },
  { id: 'memory', label: '人物记忆', description: '补充工人口述、知识拓展和参观提示。' }
];

export const npcGuideByRoute: Record<string, { mood: string; message: string; pose: 'idle' | 'scan' | 'explain' | 'success' | 'calibrate' | 'photo' }> = {
  '/': {
    mood: '准备就绪',
    message: '从首页开始体验。建议先进入扫描页，再按 A1-A5、B1-B5 的路线完成打卡。',
    pose: 'idle'
  },
  '/scan': {
    mood: '开始扫描',
    message: '把二维码、白模识别图或任意点位标识放到扫描框中。MVP 阶段也可以用按钮模拟识别。',
    pose: 'scan'
  },
  '/ar-recognition': {
    mood: '白模识别',
    message: '白模识别成功后，点位标签会叠加在画面上。点击 A1-A5 或 B1-B5 进入对应详情。',
    pose: 'success'
  },
  '/map': {
    mood: '路线导览',
    message: '地图页可以查看所有点位状态。已访问、已打卡和推荐点位会用不同状态显示。',
    pose: 'explain'
  },
  '/progress': {
    mood: '收集进度',
    message: '这里会统计已访问点位、已打卡照片、印章和徽章。',
    pose: 'success'
  },
  '/memory-card': {
    mood: '生成记忆卡',
    message: '记忆卡会自动汇总照片、路线、点位和印章，可生成图片保存。',
    pose: 'photo'
  },
  '/share': {
    mood: '分享传播',
    message: '保存图片或复制链接，把你的工业记忆卡分享给其他人。',
    pose: 'photo'
  }
};
