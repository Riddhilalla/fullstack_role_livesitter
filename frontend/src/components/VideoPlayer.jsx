import { useRef, useEffect, useState } from 'react';
import OverlayRenderer from './OverlayRenderer';
import Hls from 'hls.js';
import clsx from 'clsx';

export default function VideoPlayer({ src }) {
  const videoRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
      return () => hls.destroy();
    } else {
      video.src = src;
      video.onloadedmetadata = () => video.play();
    }
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    v.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (playing) v.pause(); else v.play();
    setPlaying(!playing);
  };

  const toggleFullscreen = () => {
    const el = videoRef.current.parentElement;
    if (!fullscreen) el.requestFullscreen?.(); 
    else document.exitFullscreen();
    setFullscreen(!fullscreen);
  };

  return (
    <div className="relative w-full h-full bg-black group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        
      />
      <OverlayRenderer/>
      <div className={clsx(
        'absolute bottom-3 left-3 right-3 bg-black/40 backdrop-blur-md rounded-lg flex items-center p-2 gap-4 opacity-0 group-hover:opacity-100 transition-opacity'
      )}>
        <button onClick={togglePlay} className="text-white text-2xl">
          {playing ? '❚❚' : '▶️'}
        </button>

        <div className="flex items-center space-x-2">
          <button onClick={() => setVolume(v => Math.max(0, v - 0.1))} className="text-white">🔉</button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-24"
          />
          <button onClick={() => setVolume(v => Math.min(1, v + 0.1))} className="text-white">🔊</button>
        </div>

        <button onClick={toggleFullscreen} className="text-white text-xl">
          {fullscreen ? '🡽' : '⛶'}
        </button>
      </div>
    </div>
  );
}
// This component renders a video player with play/pause, volume control, and fullscreen toggle.
