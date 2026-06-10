import { useState } from 'react';

export function SharePanel() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard?.writeText(window.location.origin);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: '炉光记忆',
        text: '我生成了一张工业遗产记忆卡。',
        url: window.location.origin
      });
    } else {
      await copyLink();
    }
  };

  return (
    <section className="share-panel">
      <button type="button" onClick={nativeShare}>调用系统分享</button>
      <button type="button" onClick={copyLink}>{copied ? '已复制' : '复制链接'}</button>
      <a href="/memory-card">返回记忆卡</a>
      <a href="/map">继续探索</a>
    </section>
  );
}
