import { useEffect } from 'react';

export type ARMarkerScannerEvent =
  | { type: 'ready'; message: string }
  | { type: 'error'; message: string }
  | { type: 'found'; targetRoute: string; title: string; subtitle: string; markerId: string };

type Props = {
  onScannerEvent: (event: ARMarkerScannerEvent) => void;
};

export function ARMarkerScanner({ onScannerEvent }: Props) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as ARMarkerScannerEvent | undefined;
      if (!data || typeof data !== 'object') return;
      if (!('type' in data)) return;
      if (data.type === 'ready' || data.type === 'error' || data.type === 'found') {
        onScannerEvent(data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onScannerEvent]);

  return (
    <iframe
      className="ar-marker-scanner"
      src="/ar-marker-runtime.html"
      title="真实 AR Marker 识别"
      allow="camera; autoplay; fullscreen; xr-spatial-tracking"
    />
  );
}
