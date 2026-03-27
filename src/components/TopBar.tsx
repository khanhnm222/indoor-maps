import { useState } from 'react';
import type { FloorId, Floor } from '../types';

interface Props {
  activeFloor: FloorId;
  floors: Floor[];
  onFloorChange: (floor: FloorId) => void;
}

export default function TopBar({ activeFloor, floors, onFloorChange }: Readonly<Props>) {
  const [showFloorDrop, setShowFloorDrop] = useState(false);
  const current = floors.find((f) => f.id === activeFloor);

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-100 shadow-sm z-10 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div>
          <span className="font-bold text-slate-800 text-sm">IndoorMaps</span>
          <span className="ml-2 text-xs text-slate-400">Sydney</span>
        </div>
      </div>

      {/* Centre: floor switcher */}
      <div className="relative">
        <button
          onClick={() => setShowFloorDrop((v) => !v)}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="4" rx="1"/>
            <rect x="3" y="10" width="18" height="4" rx="1"/>
            <rect x="3" y="17" width="18" height="4" rx="1"/>
          </svg>
          {current?.description ?? activeFloor}
          <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showFloorDrop ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {showFloorDrop && (
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-50 z-50">
            {floors.map((floor) => (
              <button
                key={floor.id}
                onClick={() => { onFloorChange(floor.id); setShowFloorDrop(false); }}
                className={[
                  'w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer',
                  activeFloor === floor.id ? 'text-teal-600 font-semibold' : 'text-slate-700',
                ].join(' ')}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${activeFloor === floor.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {floor.label}
                </span>
                {floor.description}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-700">Live</span>
        </div>
        <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer" title="Settings">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
 