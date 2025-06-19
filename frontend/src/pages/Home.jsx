import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (url) navigate(`/stream?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-black/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl w-full max-w-md ring-1 ring-gray-700">
        <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          🎥 Streamer Dashboard
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            type="text"
            placeholder="RTSP URL..."
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 transition"
          />
          <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition transform hover:scale-105">
            Start Streaming
          </button>
        </form>
      </div>
    </div>
  );
}
