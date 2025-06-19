import { useState, useEffect } from 'react';
import api from '../api';

export default function OverlayManager({ onUpdate }) {
  const [overlays, setOverlays] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ content: '', pos: {x:50,y:50}, size:{w:200,h:100} });

  useEffect(() => {
    api.get('/overlays').then(res => setOverlays(res.data));
  }, [onUpdate]);

  const save = async id => {
    await api.put(`/overlays/${id}`, {
      content: form.content,
      position: form.pos,
      size: form.size
    });
    setEditing(null);
    onUpdate();
  };

  return (
    <div className="w-full max-w-4xl bg-black/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl mt-6 space-y-4">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-pink-400">
        🎨 Overlay Manager
      </h2>

      {overlays.map(o => (
        <div key={o._id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
          {editing === o._id ? (
            <div className="w-full space-y-3">
              <input
                value={form.content} onChange={e => setForm(f => ({...f, content:e.target.value}))}
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={form.pos.x} onChange={e => setForm(f => ({...f, pos:{...f.pos, x:+e.target.value}}))}
                  className="p-2 rounded-lg bg-gray-700 text-white w-20"
                  placeholder="X%"
                />
                <input
                  type="number"
                  value={form.pos.y} onChange={e => setForm(f => ({...f, pos:{...f.pos, y:+e.target.value}}))}
                  className="p-2 rounded-lg bg-gray-700 text-white w-20"
                  placeholder="Y%"
                />
                <input
                  type="number"
                  value={form.size.w} onChange={e => setForm(f => ({...f, size:{...f.size, w:+e.target.value}}))}
                  className="p-2 rounded-lg bg-gray-700 text-white w-20"
                  placeholder="Wpx"
                />
                <input
                  type="number"
                  value={form.size.h} onChange={e => setForm(f => ({...f, size:{...f.size, h:+e.target.value}}))}
                  className="p-2 rounded-lg bg-gray-700 text-white w-20"
                  placeholder="Hpx"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => save(o._id)}
                  className="px-4 py-1 bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-1 bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="font-bold">{o.type}</div>
                <div className="text-sm text-gray-300">{o.content}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditing(o._id);
                    setForm({ content: o.content, pos: o.position, size: o.size || { w:100, h:100 } });
                  }}
                  className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    api.delete(`/overlays/${o._id}`)
                      .then(() => onUpdate());
                  }}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {overlays.length === 0 && (
        <p className="text-gray-400 italic text-center">No overlays yet</p>
      )}
    </div>
  );
}
