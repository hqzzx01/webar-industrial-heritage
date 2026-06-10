import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export function MobileCameraPanel({ title, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <div className={`mobile-camera-panel${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="mobile-camera-panel__toggle"
        aria-expanded={open}
        aria-controls="mobile-camera-drawer"
        onClick={() => setOpen(true)}
      >
        内容
      </button>
      <button
        type="button"
        className="mobile-camera-panel__backdrop"
        aria-label="关闭侧边栏"
        onClick={() => setOpen(false)}
      />
      <aside id="mobile-camera-drawer" className="mobile-camera-panel__drawer" aria-hidden={!open}>
        <header>
          <b>{title}</b>
          <button type="button" onClick={() => setOpen(false)} aria-label="关闭侧边栏">关闭</button>
        </header>
        <div className="mobile-camera-panel__content">{children}</div>
      </aside>
    </div>
  );
}
