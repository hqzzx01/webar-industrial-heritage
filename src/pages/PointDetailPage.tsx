import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getMainFlowNumber, getNextPoint, getPointById } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';

export function PointDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const point = getPointById(id);
  const visitPoint = useExperienceStore((state) => state.visitPoint);
  const collectPoint = useExperienceStore((state) => state.collectPoint);
  const checked = useExperienceStore((state) => point ? state.checkedPointIds.includes(point.id) : false);

  useEffect(() => {
    if (point) visitPoint(point.id);
  }, [point, visitPoint]);

  if (!point) {
    return <section className="page"><h1>点位不存在</h1><Link to="/map">返回地图</Link></section>;
  }
  const next = getNextPoint(point.id);
  const flowNumber = getMainFlowNumber(point.id);

  return (
    <section className="page point-detail-page">
      <img className="detail-hero" src={point.image} alt={point.title} />
      <div className="detail-content">
        <span className="kicker">{flowNumber ?? point.code} {point.area === 'external' ? '园区外部' : '厂房内部'}</span>
        <h1>{point.title}</h1>
        <p>{point.fullDesc}</p>
        <div className="detail-grid">
          <article><b>历史说明</b><span>{point.fullDesc}</span></article>
          <article><b>工艺说明</b><span>{point.processDesc}</span></article>
          <article><b>空间说明</b><span>{point.spaceDesc}</span></article>
        </div>
        <div className="tag-row">
          {point.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="fixed-actions">
        <button type="button" className="secondary-action" onClick={() => collectPoint(point.id)}>{checked ? '已收藏' : '收藏记忆'}</button>
        <Link className="secondary-action" to={`/ar-story/${point.id}`}>查看 AR</Link>
        <Link className="primary-action" to={`/checkin/${point.id}`}>拍照打卡</Link>
        <button type="button" className="secondary-action" onClick={() => navigate(`/point/${next.id}`)}>下一点</button>
      </div>
    </section>
  );
}
