import { Link } from 'react-router-dom';
import { ARCameraView } from '../components/ARCameraView';
import { CameraBackButton } from '../components/CameraBackButton';
import { ARNpcModel } from '../components/ARNpcModel';
import { FactoryInteriorModel } from '../components/FactoryInteriorModel';
import { MobileCameraPanel } from '../components/MobileCameraPanel';

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
          <CameraBackButton fallback="/scan">返回扫描</CameraBackButton>
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
        <ARNpcModel
          label="厂房内部 3D NPC 导览员"
          dialogueTitle="厂房内部 6-10"
          dialogue="这里是厂房内部总览。请依次选择 6-10 点位，了解厂房入口、生产线、设备结构、工艺流程和人物记忆。"
        />
        <MobileCameraPanel title="厂房内部 6-10">
          <p>选择内部点位，查看厂房入口、生产线、设备、工艺和人物记忆。</p>
          <div className="mobile-camera-panel__links">
            {internalFlow.map(([number, title]) => (
              <Link to={`/ar-story/b${Number(number) - 5}`} key={number}>
                <b>{number}</b><span>{title}</span>
              </Link>
            ))}
          </div>
        </MobileCameraPanel>
      </ARCameraView>
    </section>
  );
}
