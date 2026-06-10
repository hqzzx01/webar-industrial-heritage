import { useNavigate, useParams } from 'react-router-dom';
import { CheckinCamera } from '../components/CheckinCamera';
import { CameraBackButton } from '../components/CameraBackButton';
import { getMainFlowNumber, getPointById } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';

export function CheckinPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const point = getPointById(id);
  const checkinPoint = useExperienceStore((state) => state.checkinPoint);

  if (!point) return <section className="page"><h1>点位不存在</h1></section>;

  const save = (photoUrl: string) => {
    checkinPoint(point.id, photoUrl);
    navigate('/progress');
  };

  return (
    <section className="camera-page checkin-page">
      <div className="camera-back-floating">
        <CameraBackButton fallback={`/point/${point.id}`}>返回详情</CameraBackButton>
      </div>
      <CheckinCamera pointCode={`${getMainFlowNumber(point.id) ?? point.code}`} pointName={point.title} onSave={save} />
    </section>
  );
}
