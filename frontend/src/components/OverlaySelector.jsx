import { useState } from 'react';
import api from '../api';

export default function OverlaySelector({ onOverlayAdded }) {
  const [type, setType] = useState('text');
  const [content, setContent] = useState('');
  const [pos, setPos] = useState({x:50,y:50});
  const [size, setSize] = useState({w:200,h:100});
  const logos = [
    { name: 'Streamer Logo', url: 'https://images.pexels.com/photos/7696446/pexels-photo-7696446.jpeg' },
    { name: 'Custom URL', url: 'custom' }
  ];

  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/overlays', {
      type, content, position: pos, ...(type === 'image' && { size })
    });
    setContent(''); setPos({x:50,y:50}); setSize({w:200,h:100});
    onOverlayAdded();
  };

  return (
    <form onSubmit={handleAdd} className="w-full max-w-4xl bg-black/60 backdrop-blur-lg rounded-3xl p-6 mt-6 shadow-xl space-y-4">
      <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">➕ Add Overlay</h2>

      <div className="flex space-x-4">
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-xl focus:ring-purple-500"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        {type === 'image' && (
          <select
            onChange={e => {
              if (e.target.value !== 'custom') setContent(e.target.value);
            }}
            className="bg-gray-800 text-white px-3 py-2 rounded-xl focus:ring-purple-500"
          >
            <option value="">Select Logo</option>
            {logos.map((l,i) => (
              <option key={i} value={l.url}>{l.name}</option>
            ))}
          </select>
        )}
      </div>

      <input
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={type === 'text' ? 'Enter text...' : 'Image URL...'}
        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl"
      />

      <div className="flex space-x-4">
        <label className="text-gray-400 flex items-center px-2">
          Position of X %
        </label>
        <input
          type="number"
          value={pos.x}
          onChange={e => setPos(p => ({...p, x:+e.target.value}))}
          className="bg-gray-800 text-white px-3 py-2 w-20 rounded-xl"
          placeholder="X%"
        />
        <label className="text-gray-400 flex items-center px-2">
          Position of Y %
        </label>
        <input
          type="number"
          value={pos.y}
          onChange={e => setPos(p => ({...p, y:+e.target.value}))}
          className="bg-gray-800 text-white px-3 py-2 w-20 rounded-xl"
          placeholder="Y%"
        />
        {type === 'image' && (
          <>
            <input
              type="number"
              value={size.w}
              onChange={e => setSize(s => ({...s, w:+e.target.value}))}
              className="bg-gray-800 text-white px-3 py-2 w-20 rounded-xl"
              placeholder="W px"
            />
            <input
              type="number"
              value={size.h}
              onChange={e => setSize(s => ({...s, h:+e.target.value}))}
              className="bg-gray-800 text-white px-3 py-2 w-20 rounded-xl"
              placeholder="H px"
            />
          </>
        )}
      </div>

      <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-500 rounded-xl font-semibold hover:scale-105 transition">
        Add Overlay
      </button>
    </form>
  );
}
