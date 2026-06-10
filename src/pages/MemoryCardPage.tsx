import { Link } from 'react-router-dom';
import { MemoryCardCanvas } from '../components/MemoryCardCanvas';

export function MemoryCardPage() {
  return (
    <section className="page memory-card-page">
      <header className="page-title">
        <span className="kicker">记忆卡生成页</span>
        <h1>我的工业记忆卡</h1>
        <p>系统会根据本地保存的打卡照片、点位、时间、印章和徽章自动生成纪念卡。</p>
      </header>
      <MemoryCardCanvas />
      <nav className="memory-page-actions" aria-label="记忆卡页面导航">
        <Link className="secondary-action" to="/progress">返回进度</Link>
        <Link className="primary-action" to="/share">去分享</Link>
      </nav>
    </section>
  );
}
