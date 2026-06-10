import { ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  children?: ReactNode;
  label?: string;
  showReticle?: boolean;
  cameraEnabled?: boolean;
  cameraLayer?: ReactNode;
};

export function ARCameraView({
  children,
  label = '请将点位标签放入框内',
  showReticle = true,
  cameraEnabled = true,
  cameraLayer
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cameraEnabled) {
      setReady(true);
      setError(null);
      return;
    }

    let stream: MediaStream | null = null;
    let active = true;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (!active) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch {
        setError('摄像头未启动。请确认 HTTPS、权限和浏览器支持。');
      }
    }

    startCamera();
    return () => {
      active = false;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraEnabled]);

  return (
    <section className="ar-camera-view">
      {cameraEnabled && <video ref={videoRef} playsInline muted />}
      {cameraLayer}
      {cameraEnabled && !ready && !error && <div className="camera-fallback">摄像头启动中...</div>}
      {error && (
        <div className="camera-fallback camera-fallback--image">
          <img src="/assets/backgrounds/hero-generated.png" alt="" />
          <p>{error}</p>
        </div>
      )}
      {showReticle && (
        <div className="scan-reticle">
          <i className="corner corner-tl" />
          <i className="corner corner-tr" />
          <i className="corner corner-bl" />
          <i className="corner corner-br" />
          <span className="crosshair" />
          <p>{label}</p>
        </div>
      )}
      <div className="ar-overlay">{children}</div>
    </section>
  );
}
