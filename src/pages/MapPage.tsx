import { useState } from 'react';
import { PointCard } from '../components/PointCard';
import { PointMap } from '../components/PointMap';
import { points, type PointArea } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';

type Filter = PointArea | 'all';

export function MapPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const checked = useExperienceStore((state) => state.checkedPointIds.length);
  const filtered = filter === 'all' ? points : points.filter((point) => point.area === filter);

  return (
    <section className="page map-page">
      <header className="page-title">
        <span className="kicker">点位地图页</span>
        <h1>白模点位地图</h1>
        <p>点击主流程 1-10 进入对应详情。当前进度：{checked} / {points.length}</p>
      </header>
      <div className="segmented">
        <button className={filter === 'all' ? 'active' : ''} type="button" onClick={() => setFilter('all')}>全部</button>
        <button className={filter === 'external' ? 'active' : ''} type="button" onClick={() => setFilter('external')}>园区外部</button>
        <button className={filter === 'internal' ? 'active' : ''} type="button" onClick={() => setFilter('internal')}>厂房内部</button>
      </div>
      <PointMap area={filter} />
      <div className="point-list">
        {filtered.map((point) => <PointCard point={point} key={point.id} />)}
      </div>
    </section>
  );
}
