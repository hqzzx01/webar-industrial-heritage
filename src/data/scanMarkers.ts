export type ScanMarker = {
  id: string;
  title: string;
  subtitle: string;
  targetRoute: string;
  pattern: string;
  image: string;
};

export const scanMarkers: ScanMarker[] = [
  {
    id: 'marker-flow-01',
    title: '1 园区入口',
    subtitle: '园区外部主流程',
    targetRoute: '/ar-story/a1',
    pattern: '/assets/marker/pattern-overview-simple.patt',
    image: '/assets/marker/pattern-overview-simple.png'
  },
  {
    id: 'marker-flow-02',
    title: '2 建厂初期',
    subtitle: '园区外部主流程',
    targetRoute: '/ar-story/a2',
    pattern: '/assets/marker/pattern-furnace-simple.patt',
    image: '/assets/marker/pattern-furnace-simple.png'
  },
  {
    id: 'marker-flow-03',
    title: '3 园区格局',
    subtitle: '园区外部主流程',
    targetRoute: '/ar-story/a3',
    pattern: '/assets/marker/pattern-pipe-simple.patt',
    image: '/assets/marker/pattern-pipe-simple.png'
  },
  {
    id: 'marker-flow-04',
    title: '4 技术革新',
    subtitle: '园区外部主流程',
    targetRoute: '/ar-story/a4',
    pattern: '/assets/marker/pattern-memory-simple.patt',
    image: '/assets/marker/pattern-memory-simple.png'
  },
  {
    id: 'marker-flow-05',
    title: '5 停产与转型',
    subtitle: '园区外部主流程',
    targetRoute: '/ar-story/a5',
    pattern: '/assets/marker/official/pattern-hiro.patt',
    image: '/assets/marker/official/pattern-hiro.png'
  },
  {
    id: 'marker-factory-interior',
    title: '厂房内部结构',
    subtitle: '厂房内部 6-10 总览',
    targetRoute: '/ar-factory-interior',
    pattern: '/assets/marker/other/overview-marker.patt',
    image: '/assets/marker/other/overview-marker.png'
  }
];
