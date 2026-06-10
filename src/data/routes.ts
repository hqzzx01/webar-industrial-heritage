import { points } from './points';

export const routeStages = [
  {
    id: 'external',
    title: '园区外部',
    range: 'A1-A5',
    description: '发现探索：入口、烟囱、格局、技术革新、停产转型。',
    pointIds: points.filter((point) => point.area === 'external').map((point) => point.id)
  },
  {
    id: 'internal',
    title: '厂房内部',
    range: 'B1-B5',
    description: '深度体验：厂房入口、生产线、设备结构、工艺流程、人物记忆。',
    pointIds: points.filter((point) => point.area === 'internal').map((point) => point.id)
  }
] as const;

export const recommendedRoute = points.map((point) => point.id);
