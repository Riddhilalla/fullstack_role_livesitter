import { useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import OverlayManager from './OverlayManager';
import OverlaySelector from '../components/OverlaySelector';
import { useState } from 'react';

export default function Stream() {
  const hlsUrl = 'http://localhost:8888/mystream/index.m3u8';
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-green-400">
          My Streaming Platform
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
          Start Stream
        </button>
        <div className="flex items-center space-x-3">
          <img src="/avatar.png" alt="User" className="w-10 h-10 rounded-full" />
          <span>StreamerName</span>
        </div>
      </header>

      <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl mb-6">
        <VideoPlayer key={refreshKey} src={hlsUrl} />
      </div>

      <OverlaySelector onOverlayAdded={refresh} />
      <OverlayManager onUpdate={refresh} />
    </div>
  );
}
// This is the main streaming page where the video player and overlays are managed.