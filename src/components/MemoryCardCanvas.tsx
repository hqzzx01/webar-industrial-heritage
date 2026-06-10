import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { getMainFlowNumber, points } from '../data/points';
import { useExperienceStore } from '../store/useExperienceStore';
import { StampBadge } from './StampBadge';

export function MemoryCardCanvas() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const checkedPointIds = useExperienceStore((state) => state.checkedPointIds);
  const records = useExperienceStore((state) => state.checkinRecords);
  const badges = useExperienceStore((state) => state.badges);
  const score = useExperienceStore((state) => state.score);

  const generate = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2, useCORS: true });
    setImageUrl(canvas.toDataURL('image/png'));
  };

  return (
    <section className="memory-card-tool">
      <div className="memory-card" ref={cardRef}>
        <div className="memory-card__header">
          <span>炉光记忆</span>
          <b>我的工业记忆卡</b>
          <em>{new Date().toLocaleDateString()}</em>
        </div>
        <div className="photo-collage">
          {(records.length ? records.slice(0, 4) : [null, null, null, null]).map((record, index) => (
            record ? <img src={record.photoUrl} alt={record.pointName} key={record.id} /> : <div key={index}>待收集</div>
          ))}
        </div>
        <div className="memory-card__stats">
          <article><b>{checkedPointIds.length}</b><span>完成点位</span></article>
          <article><b>{score}</b><span>积分</span></article>
          <article><b>{badges.length}</b><span>徽章</span></article>
        </div>
        <div className="stamp-wall">
          {points.map((point) => (
            <StampBadge key={point.id} label={`${getMainFlowNumber(point.id) ?? point.code}`} active={checkedPointIds.includes(point.id)} />
          ))}
        </div>
        <p className="memory-card__note">扫描实体白模，记录工业遗产现场的路线、照片、印章与记忆。</p>
      </div>
      <div className="fixed-actions">
        <button type="button" className="secondary-action" onClick={generate}>生成图片</button>
        {imageUrl && <a className="primary-action" href={imageUrl} download="炉光记忆-工业记忆卡.png">保存 PNG</a>}
      </div>
      {imageUrl && <img className="generated-preview" src={imageUrl} alt="生成的工业记忆卡" />}
    </section>
  );
}
