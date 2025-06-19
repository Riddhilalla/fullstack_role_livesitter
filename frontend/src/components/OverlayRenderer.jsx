import { Rnd } from 'react-rnd';
import { useState, useEffect } from 'react';
import api from '../api';

export default function OverlayRenderer() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    api.get('/overlays').then(res => setContents(res.data));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {contents.map(o => (
        <Rnd
          key={o._id}
          default={{
            x: (o.position.x / 100) * window.innerWidth * 0.8,
            y: (o.position.y / 100) * window.innerHeight * 0.45,
            width: o.size?.width || 150,
            height: o.size?.height || (o.type === 'text' ? 50 : 150)
          }}
          bounds="parent"
          enableResizing={true}
          disableDragging={false}
          style={{ zIndex: 10 }}
        >
          {o.type === 'text' ? (
            <div className="text-white font-bold text-xl drop-shadow-lg m-3 p-3">
              {o.content}
            </div>
          ) : (
            <img src={o.content} alt="overlay" className="w-full h-full object-contain m-3 p-3" />
          )}
        </Rnd>
      ))}
    </div>
  );
}
