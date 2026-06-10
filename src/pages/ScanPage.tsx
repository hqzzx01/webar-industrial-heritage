import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ARCameraView } from '../components/ARCameraView';
import { ARMarkerScanner, type ARMarkerScannerEvent } from '../components/ARMarkerScanner';
import { scanMarkers } from '../data/scanMarkers';

export function ScanPage() {
  const navigate = useNavigate();
  const [scanStatus, setScanStatus] = useState('正在启动真实识别摄像头...');
  const [recognizedLabel, setRecognizedLabel] = useState<string | null>(null);
  const navigationLockRef = useRef(false);
  const navigationTimerRef = useRef<number | null>(null);

  const completeScan = useCallback((targetRoute: string, label: string) => {
    if (navigationLockRef.current) return;
    navigationLockRef.current = true;
    setRecognizedLabel(label);
    setScanStatus(`识别成功：${label}，正在进入对应 AR 总览...`);
    navigationTimerRef.current = window.setTimeout(() => navigate(targetRoute), 650);
  }, [navigate]);

  const handleScannerEvent = useCallback((event: ARMarkerScannerEvent) => {
    if (event.type === 'ready') {
      setScanStatus('真实识别已启动，请把主流程 Marker 放入扫描框内。');
      return;
    }

    if (event.type === 'error') {
      setScanStatus(event.message);
      return;
    }

    completeScan(event.targetRoute, `${event.title} ${event.subtitle}`);
  }, [completeScan]);

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current) {
        window.clearTimeout(navigationTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="camera-page">
      <ARCameraView
        cameraEnabled={false}
        cameraLayer={<ARMarkerScanner onScannerEvent={handleScannerEvent} />}
        label="请对准主流程识别图"
      >
        <header className="camera-topbar">
          <Link to="/">返回</Link>
          <span>真实 AR 识别</span>
          <button type="button">帮助</button>
        </header>
        <div className={`scan-status-card${recognizedLabel ? ' is-recognized' : ''}`}>
          <b>{recognizedLabel ? '识别成功' : '请对准主流程 Marker'}</b>
          <p>{scanStatus}</p>
          <small>已绑定 {scanMarkers.length} 张识别图：1-5 每个主点位独立识别，厂房内部 6-10 使用总览识别图。A/B 辅助点位暂不启用。</small>
        </div>
        <div className="scan-actions">
          <a className="scan-actions__print" href="/scan-markers.html" target="_blank" rel="noreferrer">打开识别图</a>
          {scanMarkers.map((marker) => (
            <button
              className={marker.targetRoute.includes('factory') ? 'scan-actions__model' : 'scan-actions__placeholder'}
              type="button"
              onClick={() => completeScan(marker.targetRoute, `${marker.title} ${marker.subtitle}`)}
              key={marker.id}
            >
              手动进入 {marker.title}
            </button>
          ))}
        </div>
      </ARCameraView>
    </section>
  );
}
