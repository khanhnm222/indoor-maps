export type FloorId = 'B1' | 'G' | '1' | '2' | '3';

export interface Floor {
  id: FloorId;
  label: string;
  description: string;
}

export type POICategory =
  | 'desk'
  | 'meeting-room'
  | 'bathroom'
  | 'exit'
  | 'cafeteria'
  | 'reception'
  | 'server-room'
  | 'lounge';

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  floor: FloorId;
  coordinates: [number, number]; // [lng, lat]
  description?: string;
  capacity?: number;
  available?: boolean;
  tags?: string[];
}

export interface Room {
  id: string;
  name: string;
  floor: FloorId;
  category: POICategory;
  color: string;
  coordinates: [number, number][][]; // GeoJSON polygon coordinates
}

export interface NavigationRoute {
  from: POI | null;
  to: POI | null;
  path: [number, number][];
  distance?: number;
  duration?: number;
}

export interface MapState {
  activeFloor: FloorId;
  selectedPOI: POI | null;
  navigationRoute: NavigationRoute | null;
  isNavigating: boolean;
  searchQuery: string;
  filteredCategories: POICategory[];
}
 