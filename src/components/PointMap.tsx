import { Link } from 'react-router-dom';
import { getMainFlowNumber, points } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';

type Props = {
  area?: 'external' | 'internal' | 'all';
};

export function PointMap({ area = 'all' }: Props) {
  const visited = useExperienceStore((state) => state.visitedPointIds);
  const checked = useExperienceStore((state) => state.checkedPointIds);
  const current = useExperienceStore((state) => state.currentPointId);
  const filtered = area === 'all' ? points : points.filter((point) => point.area === area);

  return (
    <div className="point-map">
      <img src="/assets/backgrounds/heritage-points.png" alt="工业遗产白模点位图" />
      {filtered.map((point) => {
        const status = checked.includes(point.id) ? 'checked' : current === point.id ? 'current' : visited.includes(point.id) ? 'visited' : 'idle';
        const flowNumber = getMainFlowNumber(point.id);
        return (
          <Link
            to={`/point/${point.id}`}
            className={`map-pin ${status}`}
            style={{ left: `${point.mapPosition.x}%`, top: `${point.mapPosition.y}%` }}
            key={point.id}
          >
            {flowNumber ?? point.code}
          </Link>
        );
      })}
    </div>
  );
}
