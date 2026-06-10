import { Link } from 'react-router-dom';
import { ARNpcModel } from '../components/ARNpcModel';
import { ARCameraView } from '../components/ARCameraView';
import { CameraBackButton } from '../components/CameraBackButton';
import { MobileCameraPanel } from '../components/MobileCameraPanel';
import { points } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';

export function ARRecognitionPage() {
  const visitPoint = useExperienceStore((state) => state.visitPoint);
  const externalPoints = points.filter((point) => point.area === 'external');

  return (
    <section className="camera-page recognition-page">
      <ARCameraView label="白模识别成功，可点击点位标签">
        <header className="camera-topbar">
          <CameraBackButton fallback="/scan">返回扫描</CameraBackButton>
          <span>白模识别成功</span>
          <Link to="/map">地图</Link>
        </header>
        <div className="model-overlay-card">
          <b>园区外部总览</b>
          <p>这里先展示主流程 1-5。进入厂房后，请扫描白膜内部厂房识别点，打开 6-10 内部结构总览。</p>
        </div>
        <ARNpcModel
          label="白模识别成功后的 3D NPC 导览员"
          dialogueTitle="园区外部总览"
          dialogue="白模识别成功。请点击画面中的 1-5 点位编号进入对应故事，也可以打开右侧内容面板选择点位。"
        />
        <div className="floating-point-layer">
          {externalPoints.map((point, index) => (
            <Link
              to={`/ar-story/${point.id}`}
              className="floating-point external has-placeholder"
              style={{ left: `${point.mapPosition.x}%`, top: `${point.mapPosition.y}%` }}
              onClick={() => visitPoint(point.id)}
              key={point.id}
              aria-label={`${index + 1} ${point.title}`}
            >
              {index + 1}
            </Link>
          ))}
        </div>
        <div className="fixed-actions fixed-actions--camera">
          <Link className="secondary-action" to="/map">查看全部点位</Link>
          <Link className="primary-action" to="/map">继续导览</Link>
        </div>
        <MobileCameraPanel title="园区外部总览">
          <p>点击画面中的编号进入点位，也可以从这里选择主流程 1-5。</p>
          <div className="mobile-camera-panel__links">
            {externalPoints.map((point, index) => (
              <Link to={`/ar-story/${point.id}`} onClick={() => visitPoint(point.id)} key={point.id}>
                <b>{index + 1}</b><span>{point.title}</span>
              </Link>
            ))}
          </div>
        </MobileCameraPanel>
      </ARCameraView>
    </section>
  );
}
