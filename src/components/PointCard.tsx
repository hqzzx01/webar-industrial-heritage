import { Link } from 'react-router-dom';
import { getMainFlowNumber, type Point } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';

type Props = {
  point: Point;
};

export function PointCard({ point }: Props) {
  const visited = useExperienceStore((state) => state.visitedPointIds.includes(point.id));
  const checked = useExperienceStore((state) => state.checkedPointIds.includes(point.id));
  const flowNumber = getMainFlowNumber(point.id);

  return (
    <article className="point-card">
      <img src={point.image} alt={point.title} />
      <div>
        <div className="point-card__meta">
          <b>{flowNumber ?? point.code}</b>
          <span className={checked ? 'state checked' : visited ? 'state visited' : 'state'}>{checked ? '已打卡' : visited ? '已访问' : '未访问'}</span>
        </div>
        <h2>{point.title}</h2>
        <p>{point.shortDesc}</p>
        <div className="tag-row">
          {point.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <Link to={`/point/${point.id}`}>查看</Link>
    </article>
  );
}
