import { categoryColors } from '../configs/category-color';
import type { POICategory } from '../types';

const LEGEND_ITEMS: { category: POICategory; label: string }[] = [
  { category: 'desk', label: 'Workstation' },
  { category: 'meeting-room', label: 'Meeting Room' },
  { category: 'cafeteria', label: 'Café / Kitchen' },
  { category: 'bathroom', label: 'Restrooms' },
  { category: 'exit', label: 'Exit / Stairs' },
  { category: 'lounge', label: 'Lounge' },
  { category: 'reception', label: 'Reception' },
  { category: 'server-room', label: 'Server Room' },
];

export default function LegendPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-3 min-w-40">
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Legend</div>
      <div className="space-y-1.5">
        {LEGEND_ITEMS.map(({ category, label }) => (
          <div key={category} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: categoryColors[category] }}
            />
            <span className="text-xs text-slate-600">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 mt-1">
          <span className="w-8 h-2 rounded-full shrink-0" style={{ backgroundColor: '#facc15' }} />
          <span className="text-xs text-slate-600">Nav route</span>
        </div>
      </div>
    </div>
  );
}
 