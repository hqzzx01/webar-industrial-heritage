import { Link } from 'react-router-dom';
import { points } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';

export function AppHeader() {
  const checked = useExperienceStore((state) => state.checkedPointIds.length);
  const score = useExperienceStore((state) => state.score);

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        <strong>炉光记忆</strong>
        <span>工业遗产白模 AR 体验系统</span>
      </Link>
      <div className="header-status" aria-label="当前体验进度">
        <span>{checked} / {points.length}</span>
        <b>{score} 分</b>
      </div>
    </header>
  );
}
