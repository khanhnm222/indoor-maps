import type { Floor, FloorId } from '../types';

interface Props {
  floors: Floor[];
  activeFloor: FloorId;
  onChange: (floor: FloorId) => void;
}

export default function FloorSelector({ floors, activeFloor, onChange }: Readonly<Props>) {
  return (
    <div className="flex flex-col gap-1 bg-white rounded-2xl shadow-lg border border-slate-100 p-1.5 overflow-hidden">
      <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Floor</div>
      {[...floors].reverse().map((floor) => (
        <button
          key={floor.id}
          title={floor.description}
          onClick={() => onChange(floor.id)}
          className={[
            'w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer',
            'flex items-center justify-center',
            activeFloor === floor.id
              ? 'bg-teal-600 text-white shadow-md scale-105'
              : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600',
          ].join(' ')}
        >
          {floor.label}
        </button>
      ))}
    </div>
  );
}
 