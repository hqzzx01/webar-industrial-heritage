import { useEffect, useRef, useState } from 'react';

type Props = {
  pointName: string;
  pointCode: string;
  onSave: (photoUrl: string) => void;
};

export function CheckinCamera({ pointName, pointCode, onSave }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let active = true;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (!active || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch {
        setError('摄像头未启动。演示时请使用 HTTPS 或 localhost，并允许摄像头权限。');
      }
    }

    start();
    return () => {
      active = false;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;
    if (video && video.readyState >= 2) {
      const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      const sw = canvas.width / scale;
      const sh = canvas.height / scale;
      ctx.drawImage(video, (video.videoWidth - sw) / 2, (video.videoHeight - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height);
    } else {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        setPhotoUrl(canvas.toDataURL('image/png'));
      };
      image.src = '/assets/backgrounds/hero-generated.png';
      return;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f0d8b8';
    ctx.lineWidth = 10;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
    ctx.fillStyle = '#fff5df';
    ctx.font = '700 54px KaiTi, STKaiti, serif';
    ctx.fillText(`${pointCode} ${pointName}`, 80, 104);
    ctx.font = '400 28px KaiTi, STKaiti, serif';
    ctx.fillText(new Date().toLocaleString(), 80, 150);
    setPhotoUrl(canvas.toDataURL('image/png'));
  };

  return (
    <section className="checkin-camera">
      <div className="camera-frame">
        {photoUrl ? <img src={photoUrl} alt="打卡照片预览" /> : <video ref={videoRef} playsInline muted />}
        {error && <div className="camera-fallback"><p>{error}</p></div>}
        <div className="composition-frame">
          <span>{pointCode} {pointName}</span>
          <em>推荐构图框</em>
        </div>
      </div>
      <div className="fixed-actions">
        {photoUrl ? (
          <>
            <button type="button" className="secondary-action" onClick={() => setPhotoUrl(null)}>重拍</button>
            <button type="button" className="primary-action" onClick={() => onSave(photoUrl)}>保存打卡</button>
          </>
        ) : (
          <button type="button" className="primary-action shutter-action" onClick={takePhoto}>拍照打卡</button>
        )}
      </div>
      <canvas ref={canvasRef} hidden />
    </section>
  );
}
