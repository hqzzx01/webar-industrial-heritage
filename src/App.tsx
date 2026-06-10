import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { NpcGuide } from './components/NpcGuide';
import { LaunchGate } from './components/LaunchGate';
import { ARRecognitionPage } from './pages/ARRecognitionPage';
import { ARStoryPage } from './pages/ARStoryPage';
import { CheckinPage } from './pages/CheckinPage';
import { FactoryInteriorPage } from './pages/FactoryInteriorPage';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { MemoryCardPage } from './pages/MemoryCardPage';
import { PointDetailPage } from './pages/PointDetailPage';
import { ProgressPage } from './pages/ProgressPage';
import { ScanPage } from './pages/ScanPage';
import { SharePage } from './pages/SharePage';

export function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const location = useLocation();
  const isMemoryCardPage = location.pathname === '/memory-card';
  const isCameraMode = ['/scan', '/ar-recognition', '/ar-factory-interior'].includes(location.pathname)
    || location.pathname.startsWith('/ar-story')
    || location.pathname.startsWith('/checkin');
  const hasThreeDimensionalNpc = location.pathname === '/ar-recognition'
    || location.pathname === '/ar-factory-interior'
    || location.pathname.startsWith('/ar-story');

  if (!hasEntered) {
    return <LaunchGate onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className={`${isCameraMode ? 'app app--camera' : 'app'}${isMemoryCardPage ? ' app--memory-card' : ''}`}>
      {!isCameraMode && <AppHeader />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/ar-recognition" element={<ARRecognitionPage />} />
          <Route path="/ar-factory-interior" element={<FactoryInteriorPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/point/:id" element={<PointDetailPage />} />
          <Route path="/ar-story/:id" element={<ARStoryPage />} />
          <Route path="/checkin/:id" element={<CheckinPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/memory-card" element={<MemoryCardPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isCameraMode && <BottomNav />}
      {!hasThreeDimensionalNpc && <NpcGuide compact={isCameraMode} />}
    </div>
  );
}
