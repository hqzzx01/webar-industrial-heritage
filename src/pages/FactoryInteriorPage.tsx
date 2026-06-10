import { Link } from 'react-router-dom';
import { ARCameraView } from '../components/ARCameraView';
import { FactoryInteriorModel } from '../components/FactoryInteriorModel';

const internalFlow = [
  ['6', '厂房入口', '进入内部体验起点'],
  ['7', '生产线回溯', '感受空间尺度与生产场景'],
  ['8', '设备结构拆解', '认识核心设备构造'],
  ['9', '工艺流程展示', '理解生产过程与逻辑'],
  ['10', '人物记忆与知识拓展', '连接人物故事与延伸学习']
];

export function FactoryInteriorPage() {
  return (
    <section className="camera-page factory-page">
      <ARCameraView label="厂房内部结构 6-10">
        <header className="camera-topbar">
          <Link to="/scan">返回扫描</Link>
          <span>厂房内部 6-10</span>
          <Link to="/map">地图</Link>
        </header>
        <aside className="factory-overview-card">
          <span>厂房内部结构</span>
          <h1>主流程点位 6-10</h1>
          <p>扫描白膜内部厂房识别点后，先进入这张内部结构总览，再按 6-10 查看厂房入口、生产线、设备拆解、工艺流程和人物记忆。</p>
          <div>
            {internalFlow.map(([number, title, desc]) => (
              <Link to={`/ar-story/b${Number(number) - 5}`} key={number}>
                <b>{number}</b>
                <span>{title}</span>
                <small>{desc}</small>
              </Link>
            ))}
          </div>
        </aside>
        <FactoryInteriorModel />
      </ARCameraView>
    </section>
  );
}
