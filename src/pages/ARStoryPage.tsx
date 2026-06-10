import { Link, useParams } from 'react-router-dom';
import { ARNpcModel } from '../components/ARNpcModel';
import { ARPointModel } from '../components/ARPointModel';
import { ARCameraView } from '../components/ARCameraView';
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
          <Link to={`/point/${point.id}`}>返回详情</Link>
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
      </ARCameraView>
    </section>
  );
}
