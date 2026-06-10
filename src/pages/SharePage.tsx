import { SharePanel } from '../components/SharePanel';
import { useExperienceStore } from '../store/useExperienceStore';

export function SharePage() {
  const records = useExperienceStore((state) => state.checkinRecords);
  const score = useExperienceStore((state) => state.score);

  return (
    <section className="page share-page">
      <header className="page-title">
        <span className="kicker">分享页</span>
        <h1>分享你的工业记忆</h1>
        <p>保存记忆卡图片、复制链接或继续探索其他点位。</p>
      </header>
      <div className="share-preview">
        <img src={records[0]?.photoUrl || '/assets/backgrounds/hero-generated.png'} alt="记忆卡预览" />
        <div>
          <b>炉光记忆</b>
          <span>已记录 {records.length} 张照片 / {score} 积分</span>
        </div>
      </div>
      <SharePanel />
    </section>
  );
}
