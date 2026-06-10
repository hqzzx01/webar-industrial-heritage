import { Link, useParams } from 'react-router-dom';
import { ARNpcModel } from '../components/ARNpcModel';
import { ARPointModel } from '../components/ARPointModel';
import { ARCameraView } from '../components/ARCameraView';
import { CameraBackButton } from '../components/CameraBackButton';
import { MobileCameraPanel } from '../components/MobileCameraPanel';
import { getMainFlowNumber, getPointById } from '../data/points';
import { storyLayers } from '../data/stories';

export function ARStoryPage() {
  const { id } = useParams();
  const point = getPointById(id);

  if (!point) {
    return <section className="page"><h1>点位不存在</h1><Link to="/map">返回地图</Link></section>;
  }
  const flowNumber = getMainFlowNumber(point.id);
  const displayCode = flowNumber ? `${flowNumber}` : point.code;

  return (
    <section className="camera-page ar-story-page">
      <ARCameraView label="横屏浏览 AR 叙事内容">
        <header className="camera-topbar">
          <CameraBackButton fallback={`/point/${point.id}`}>返回详情</CameraBackButton>
          <span>{displayCode} {point.title}</span>
          <Link to={`/checkin/${point.id}`}>拍照</Link>
        </header>
        <div className="story-floating-label" style={{ left: `${point.mapPosition.x}%`, top: `${point.mapPosition.y}%` }}>
          <b>{displayCode}</b>
          <span>{point.title}</span>
        </div>
        <aside className="ar-info-card">
          <span>{point.area === 'external' ? '园区外部点位' : '厂房内部点位'}</span>
          <h1>{point.title}</h1>
          <p>{point.fullDesc}</p>
          <div className="layer-toggles">
            {storyLayers.map((layer) => <button type="button" key={layer.id}>{layer.label}</button>)}
          </div>
        </aside>
        <ARPointModel
          modelUrl={point.model}
          title={point.title}
          code={displayCode}
          note={point.modelNote ?? point.processDesc}
          tags={point.tags}
        />
        <ARNpcModel label={`${displayCode} ${point.title} 的 3D NPC 导览员`} />
        <MobileCameraPanel title={`${displayCode} ${point.title}`}>
          <span className="mobile-camera-panel__kicker">{point.area === 'external' ? '园区外部点位' : '厂房内部点位'}</span>
          <p>{point.fullDesc}</p>
          <h2>模型说明</h2>
          <p>{point.modelNote ?? point.processDesc}</p>
          <div className="layer-toggles">
            {storyLayers.map((layer) => <button type="button" key={layer.id}>{layer.label}</button>)}
          </div>
        </MobileCameraPanel>
      </ARCameraView>
    </section>
  );
}
