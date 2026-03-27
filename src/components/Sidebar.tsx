import { useState, useMemo } from "react";
import type { POI, POICategory, FloorId } from "../types";
import POIIcon from "./POIIcon";
import { categoryColors } from "../configs/category-color";

interface Props {
  readonly pois: POI[];
  readonly activeFloor: FloorId;
  readonly selectedPOI: POI | null;
  readonly isNavigating: boolean;
  readonly onPOISelect: (poi: POI) => void;
  readonly onNavigateTo: (poi: POI) => void;
  readonly onClearNavigation: () => void;
}

const CATEGORIES: { id: POICategory; label: string }[] = [
  { id: "desk", label: "Desks" },
  { id: "meeting-room", label: "Meeting" },
  { id: "cafeteria", label: "Café" },
  { id: "bathroom", label: "WC" },
  { id: "exit", label: "Exit" },
  { id: "lounge", label: "Lounge" },
  { id: "reception", label: "Reception" },
  { id: "server-room", label: "IT" },
];

export default function Sidebar({
  pois,
  activeFloor,
  selectedPOI,
  isNavigating,
  onPOISelect,
  onNavigateTo,
  onClearNavigation,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<POICategory>>(
    new Set(),
  );
  const [collapsed, setCollapsed] = useState(false);

  const toggleCategory = (cat: POICategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    return pois.filter((p) => {
      const matchFloor = p.floor === activeFloor;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat =
        activeCategories.size === 0 || activeCategories.has(p.category);
      return matchFloor && matchSearch && matchCat;
    });
  }, [pois, activeFloor, search, activeCategories]);

  const available = filtered.filter((p) => p.available !== false);
  const occupied = filtered.filter((p) => p.available === false);

  return (
    <aside
      className={[
        "flex flex-col bg-white border-r border-slate-100 shadow-sm h-full overflow-hidden",
        "transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-14" : "w-80",
      ].join(" ")}
    >
      {/* Collapsed strip */}
      {collapsed && (
        <div className="flex flex-col items-center pt-4 gap-3">
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white hover:bg-teal-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="w-px h-4 bg-slate-200" />
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              title={cat.label}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${categoryColors[cat.id]}18` }}
            >
              <POIIcon category={cat.id} size={16} />
            </div>
          ))}
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 text-sm leading-tight">
              Office
            </div>
            <div className="text-xs text-slate-400">
              Level 1, 91 York St, Sydney
            </div>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search rooms, desks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={[
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                activeCategories.has(cat.id)
                  ? "text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100",
              ].join(" ")}
              style={
                activeCategories.has(cat.id)
                  ? { backgroundColor: categoryColors[cat.id] }
                  : {}
              }
            >
              <POIIcon category={cat.id} size={12} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation banner */}
      {isNavigating && (
        <div className="mx-4 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">🧭</span>
            <div>
              <div className="text-xs font-semibold text-yellow-800">
                Navigating
              </div>
              <div className="text-xs text-yellow-600 truncate max-w-35">
                To: {selectedPOI?.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClearNavigation}
            className="text-xs px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg cursor-pointer transition-colors"
          >
            End
          </button>
        </div>
      )}

      {/* POI list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-sm">No results found</div>
          </div>
        ) : (
          <>
            {available.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Available ({available.length})
                </div>
                {available.map((poi) => (
                  <POIListItem
                    key={poi.id}
                    poi={poi}
                    isSelected={selectedPOI?.id === poi.id}
                    onSelect={onPOISelect}
                    onNavigate={onNavigateTo}
                  />
                ))}
              </div>
            )}
            {occupied.length > 0 && (
              <div className="mt-2">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Occupied / Restricted ({occupied.length})
                </div>
                {occupied.map((poi) => (
                  <POIListItem
                    key={poi.id}
                    poi={poi}
                    isSelected={selectedPOI?.id === poi.id}
                    onSelect={onPOISelect}
                    onNavigate={onNavigateTo}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer stats */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
        <div className="flex justify-between text-xs text-slate-500">
          <span>
            <span className="font-semibold text-teal-600">
              {available.length}
            </span>{" "}
            available
          </span>
          <span>
            <span className="font-semibold text-red-500">
              {occupied.length}
            </span>{" "}
            occupied
          </span>
          <span>
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>{" "}
            total
          </span>
        </div>
      </div>
        </>
      )}
    </aside>
  );
}

function POIListItem({
  poi,
  isSelected,
  onSelect,
  onNavigate,
}: {
  readonly poi: POI;
  readonly isSelected: boolean;
  readonly onSelect: (p: POI) => void;
  readonly onNavigate: (p: POI) => void;
}) {
  return (
    <div
      tabIndex={0}
      onClick={() => onSelect(poi)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(poi)}
      className={[
        "flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-150 group text-left",
        isSelected
          ? "bg-teal-50 border border-teal-200"
          : "hover:bg-slate-50 border border-transparent",
        poi.available === false ? "opacity-60" : "",
      ].join(" ")}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${categoryColors[poi.category]}18` }}
      >
        <POIIcon category={poi.category} size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-800 truncate">
          {poi.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              backgroundColor: poi.available === false ? "#dc2626" : "#16a34a",
            }}
          />
          <span className="text-xs text-slate-400 truncate">
            {poi.available === false ? "Occupied" : "Available"}
            {poi.capacity ? ` · ${poi.capacity} seats` : ""}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(poi);
        }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-all cursor-pointer shrink-0"
        title="Navigate here"
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polygon points="3,11 22,2 13,21 11,13" />
        </svg>
      </button>
    </div>
  );
}
 