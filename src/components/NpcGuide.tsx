import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { npcGuideByRoute } from '../data/stories';

const poses = {
  idle: '/assets/images/npc/idle.png',
  scan: '/assets/images/npc/scan.png',
  explain: '/assets/images/npc/explain.png',
  success: '/assets/images/npc/success.png',
  calibrate: '/assets/images/npc/calibrate.png',
  photo: '/assets/images/npc/photo.png'
};

type Props = {
  compact?: boolean;
};

function getGuide(pathname: string) {
  if (pathname.startsWith('/point')) {
    return { mood: '点位讲解', message: '点位详情页可以查看历史、工艺、空间说明，也能进入 AR 或拍照打卡。', pose: 'explain' as const };
  }
  if (pathname.startsWith('/ar-story')) {
    return { mood: 'AR 叙事', message: '这里是伪 AR 演示：摄像头背景叠加标签、图文卡片和工艺信息。', pose: 'scan' as const };
  }
  if (pathname.startsWith('/checkin')) {
    return { mood: '拍照打卡', message: '对准白模或展区拍照，保存后会解锁印章并写入记忆卡。', pose: 'photo' as const };
  }
  return npcGuideByRoute[pathname] || npcGuideByRoute['/'];
}

export function NpcGuide({ compact = false }: Props) {
  const { pathname } = useLocation();
  const guide = getGuide(pathname);
  const [messageVisible, setMessageVisible] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  const scheduleHide = () => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setMessageVisible(false), 5000);
  };

  useEffect(() => {
    setMessageVisible(true);
    scheduleHide();
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [pathname]);

  const showMessage = () => {
    setMessageVisible(true);
    scheduleHide();
  };

  return (
    <aside className={`${compact ? 'npc-guide npc-guide--compact' : 'npc-guide'}${messageVisible ? ' is-talking' : ''}`} aria-label="NPC 引导">
      <button type="button" className="npc-guide__trigger" onClick={showMessage} aria-label="打开 NPC 引导对话">
        <img src={poses[guide.pose]} alt="炉光记忆引导员" />
        <span>点我讲解</span>
      </button>
      {messageVisible && (
        <div className="npc-bubble" aria-live="polite">
          <span>{guide.mood}</span>
          <p>{guide.message}</p>
        </div>
      )}
    </aside>
  );
}
