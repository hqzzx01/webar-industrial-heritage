import { Link } from 'react-router-dom';
import { StampBadge } from '../components/StampBadge';
import { getMainFlowNumber, points } from '../data/points';
import { routeStages } from '../data/routes';
import { useExperienceStore } from '../store/useExperienceStore';

export function ProgressPage() {
  const checked = useExperienceStore((state) => state.checkedPointIds);
  const records = useExperienceStore((state) => state.checkinRecords);
  const badges = useExperienceStore((state) => state.badges);
  const score = useExperienceStore((state) => state.score);

  return (
    <section className="page progress-page">
      <header className="page-title">
        <span className="kicker">记忆收集进度页</span>
        <h1>已完成 {checked.length} / {points.length}</h1>
        <p>当前积分 {score}。完成园区或厂房全部点位后会自动解锁徽章。</p>
      </header>
      <div className="stage-grid">
        {routeStages.map((stage) => {
          const done = stage.pointIds.filter((id) => checked.includes(id)).length;
          return (
            <article key={stage.id}>
              <b>{stage.title}</b>
              <span>{done} / {stage.pointIds.length}</span>
              <i style={{ width: `${(done / stage.pointIds.length) * 100}%` }} />
            </article>
          );
        })}
      </div>
      <section className="stamp-section">
        <h2>点位印章</h2>
        <div className="stamp-wall">
          {points.map((point) => <StampBadge label={`${getMainFlowNumber(point.id) ?? point.code}`} active={checked.includes(point.id)} key={point.id} />)}
        </div>
      </section>
      <section className="photo-records">
        <h2>已拍照片</h2>
        <div className="record-grid">
          {records.map((record) => (
            <Link to={`/point/${record.pointId}`} key={record.id}>
              <img src={record.photoUrl} alt={record.pointName} />
              <b>{record.pointName}</b>
              <span>{new Date(record.timestamp).toLocaleString()}</span>
            </Link>
          ))}
          {!records.length && <p>还没有拍照打卡。进入点位详情后点击“拍照打卡”开始收集。</p>}
        </div>
      </section>
      <section className="badge-section">
        <h2>已解锁徽章</h2>
        <div className="tag-row">{badges.length ? badges.map((badge) => <span key={badge}>{badge}</span>) : <span>暂无徽章</span>}</div>
      </section>
      <div className="fixed-actions">
        <Link className="secondary-action" to="/map">继续探索</Link>
        <Link className="primary-action" to="/memory-card">生成记忆卡</Link>
      </div>
    </section>
  );
}
