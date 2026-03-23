import { useEffect, useRef, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { POI, FloorId, Room } from "../types";
import { categoryColors } from "../configs/category-color";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

interface Props {
  activeFloor: FloorId;
  pois: POI[];
  rooms: Room[];
  selectedPOI: POI | null;
  navigationPath: [number, number][] | null;
  onPOISelect: (poi: POI) => void;
  mapRef: React.RefObject<mapboxgl.Map | null>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const FLOOR_OPACITY: Record<FloorId, number> = {
  B1: 0.5,
  G: 0.65,
  "1": 0.7,
  "2": 0.65,
  "3": 0.6,
};

export default function MapView({
  activeFloor,
  pois,
  rooms,
  selectedPOI,
  navigationPath,
  onPOISelect,
  mapRef,
  containerRef,
}: Props) {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const initialized = useRef(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Build marker elements
  const createMarkerEl = useCallback((poi: POI): HTMLElement => {
    const color = categoryColors[poi.category];

    // Outer wrapper — Mapbox GL applies its own translate() to this element
    // for positioning. Never set transform on this element or it will override
    // Mapbox's translate and snap the marker to the wrong position.
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      width: 32px; height: 32px;
      cursor: pointer;
    `;

    // Inner pin — safe to rotate/scale here without touching Mapbox's transform.
    const pin = document.createElement("div");
    pin.style.cssText = `
      position: relative;
      width: 32px; height: 32px;
      background: ${color};
      border: 2.5px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      transform-origin: 0% 100%;
      box-shadow: 0 3px 10px rgba(0,0,0,0.25);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    `;
    pin.innerHTML = `<div style="
      position:absolute; inset:0;
      display:flex; align-items:center; justify-content:center;
      transform:rotate(45deg); color:white;
      opacity:${poi.available === false ? "0.5" : "1"};
    ">
      ${poi.available === false ? "🔒" : getCategoryEmoji(poi.category)}
    </div>`;

    wrapper.appendChild(pin);

    wrapper.addEventListener("mouseenter", () => {
      pin.style.transform = "rotate(-45deg) scale(1.2)";
      pin.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
    });
    wrapper.addEventListener("mouseleave", () => {
      pin.style.transform = "rotate(-45deg) scale(1)";
      pin.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)";
    });

    return wrapper;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || initialized.current) return;
    initialized.current = true;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [151.2093, -33.8688],
      zoom: 18.5,
      pitch: 45,
      bearing: -20,
      antialias: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "bottom-right",
    );
    map.addControl(
      new mapboxgl.ScaleControl({ unit: "metric" }),
      "bottom-left",
    );
    map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

    map.on("load", () => {
      // Ensure canvas fills the container after React has painted
      map.resize();
      setMapLoaded(true);
      // Add 3D buildings from Mapbox
      const layers = map.getStyle()?.layers ?? [];
      const labelLayerId = layers.find(
        (l) =>
          l.type === "symbol" &&
          (l.layout as Record<string, unknown>)?.["text-field"],
      )?.id;

      map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#e2e8f0",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.7,
          },
        },
        labelLayerId,
      );

      // Add floor room fills
      rooms.forEach((room) => {
        const srcId = `room-src-${room.id}`;
        const fillId = `room-fill-${room.id}`;
        const outlineId = `room-outline-${room.id}`;

        map.addSource(srcId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: { name: room.name, category: room.category },
            geometry: { type: "Polygon", coordinates: room.coordinates },
          },
        });

        map.addLayer({
          id: fillId,
          type: "fill",
          source: srcId,
          paint: {
            "fill-color": room.color,
            "fill-opacity": 0.15,
          },
        });

        map.addLayer({
          id: outlineId,
          type: "line",
          source: srcId,
          paint: {
            "line-color": room.color,
            "line-width": 2,
            "line-opacity": 0.6,
          },
        });
      });

      // Navigation path
      map.addSource("nav-path", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [] },
        },
      });

      map.addLayer({
        id: "nav-path-bg",
        type: "line",
        source: "nav-path",
        paint: {
          "line-color": "#facc15",
          "line-width": 12,
          "line-opacity": 0.3,
          // "line-cap": "round",
        },
      });

      map.addLayer({
        id: "nav-path-line",
        type: "line",
        source: "nav-path",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#facc15",
          "line-width": 5,
          "line-opacity": 0.95,
          "line-dasharray": [0, 2],
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      initialized.current = false;
    };
  }, []); // eslint-disable-line

  // Sync markers whenever floor or POIs change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const floorPOIs = pois.filter((p) => p.floor === activeFloor);
    floorPOIs.forEach((poi) => {
      const el = createMarkerEl(poi);
      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(poi.coordinates)
        .addTo(map);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onPOISelect(poi);
      });
      markersRef.current.push(marker);
    });
  }, [activeFloor, pois, createMarkerEl, onPOISelect, mapRef, mapLoaded]);

  // Show popup for selected POI
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    popupRef.current?.remove();
    if (!selectedPOI) return;

    const tagsHtml = selectedPOI.tags?.length
      ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">${selectedPOI.tags.map((t) => `<span style="background:#f1f5f9;border-radius:4px;padding:2px 6px;font-size:11px;color:#475569;">${t}</span>`).join("")}</div>`
      : "";

    const html = `
      <div style="font-family:system-ui,sans-serif; min-width:180px;">
        <div style="background:${categoryColors[selectedPOI.category]};padding:12px 44px 12px 16px;color:white;">
          <div style="font-size:11px;opacity:0.8;text-transform:uppercase;letter-spacing:0.05em;">${selectedPOI.category.replace("-", " ")}</div>
          <div style="font-size:16px;font-weight:600;margin-top:2px;">${selectedPOI.name}</div>
        </div>
        <div style="padding:12px 16px;">
          ${selectedPOI.description ? `<p style="margin:0 0 8px;font-size:13px;color:#64748b;">${selectedPOI.description}</p>` : ""}
          ${selectedPOI.capacity ? `<div style="font-size:12px;color:#64748b;">👥 Capacity: ${selectedPOI.capacity}</div>` : ""}
          <div style="margin-top:8px;display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:${selectedPOI.available === false ? "#dc2626" : "#16a34a"}">
            <span style="width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block;"></span>
            ${selectedPOI.available === false ? "Occupied / Restricted" : "Available"}
          </div>
          ${tagsHtml}
        </div>
      </div>`;

    popupRef.current = new mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false,
      maxWidth: "280px",
    })
      .setLngLat(selectedPOI.coordinates)
      .setHTML(html)
      .addTo(map);
  }, [selectedPOI, mapRef]);

  // Update navigation path
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const src = map.getSource("nav-path") as mapboxgl.GeoJSONSource;
    if (!src) return;

    src.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: navigationPath ?? [],
      },
    });
  }, [navigationPath, mapRef, mapLoaded]);

  // Update room visibility based on floor
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    rooms.forEach((room) => {
      const opacity =
        room.floor === activeFloor ? FLOOR_OPACITY[activeFloor] : 0;
      if (map.getLayer(`room-fill-${room.id}`)) {
        map.setPaintProperty(
          `room-fill-${room.id}`,
          "fill-opacity",
          opacity * 0.2,
        );
        map.setPaintProperty(
          `room-outline-${room.id}`,
          "line-opacity",
          opacity * 0.8,
        );
      }
    });
  }, [activeFloor, rooms, mapRef, mapLoaded]);

  return null; // renders into containerRef
}

function getCategoryEmoji(cat: string) {
  const map: Record<string, string> = {
    desk: "🖥",
    "meeting-room": "👥",
    bathroom: "🚻",
    exit: "🚪",
    cafeteria: "☕",
    reception: "🏢",
    "server-room": "⚙️",
    lounge: "🛋",
  };
  return map[cat] ?? "📍";
}
 