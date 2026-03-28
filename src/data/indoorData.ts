import type { Floor, POI, Room } from '../types';

export const FLOORS: Floor[] = [
  { id: 'B1', label: 'B1', description: 'Basement / Parking' },
  { id: 'G', label: 'G', description: 'Ground Floor / Lobby' },
  { id: '1', label: '1F', description: 'First Floor' },
  { id: '2', label: '2F', description: 'Second Floor' },
  { id: '3', label: '3F', description: 'Third Floor / Rooftop' },
];

// Sample office building coordinates (Sydney CBD area as reference)
const BASE_LNG = 151.2093;
const BASE_LAT = -33.8688;
const SCALE = 0.0008;

export const POINTS_OF_INTEREST: POI[] = [
  // Ground Floor
  { id: 'poi-reception', name: 'Reception', category: 'reception', floor: 'G', coordinates: [BASE_LNG, BASE_LAT + SCALE * 0.5], description: 'Main building reception', available: true, tags: ['entrance', 'info'] },
  { id: 'poi-cafe', name: 'Staff Café', category: 'cafeteria', floor: 'G', coordinates: [BASE_LNG + SCALE * 1.5, BASE_LAT + SCALE * 1.2], description: 'Coffee & snacks available 7am–4pm', available: true, tags: ['food', 'drink'] },
  { id: 'poi-exit-main', name: 'Main Exit', category: 'exit', floor: 'G', coordinates: [BASE_LNG - SCALE * 0.5, BASE_LAT - SCALE * 0.3], description: 'Emergency exit', available: true, tags: ['exit', 'emergency'] },
  { id: 'poi-wc-g', name: 'Restrooms (G)', category: 'bathroom', floor: 'G', coordinates: [BASE_LNG + SCALE * 0.8, BASE_LAT - SCALE * 0.6], description: 'Ground floor restrooms', available: true },

  // First Floor
  { id: 'poi-desk-101', name: 'Workstation 101', category: 'desk', floor: '1', coordinates: [BASE_LNG - SCALE * 0.8, BASE_LAT + SCALE * 0.8], description: 'Hot desk — 1 monitor', available: true, tags: ['hot-desk'] },
  { id: 'poi-desk-102', name: 'Workstation 102', category: 'desk', floor: '1', coordinates: [BASE_LNG - SCALE * 0.3, BASE_LAT + SCALE * 0.9], description: 'Assigned desk', available: false, tags: ['assigned'] },
  { id: 'poi-desk-103', name: 'Workstation 103', category: 'desk', floor: '1', coordinates: [BASE_LNG + SCALE * 0.4, BASE_LAT + SCALE * 0.7], description: 'Hot desk — standing', available: true, tags: ['hot-desk', 'standing'] },
  { id: 'poi-desk-104', name: 'Workstation 104', category: 'desk', floor: '1', coordinates: [BASE_LNG + SCALE * 0.9, BASE_LAT + SCALE * 0.9], description: 'Hot desk', available: true, tags: ['hot-desk'] },
  { id: 'poi-desk-105', name: 'Workstation 105', category: 'desk', floor: '1', coordinates: [BASE_LNG + SCALE * 1.4, BASE_LAT + SCALE * 0.5], description: 'Assigned desk', available: false },
  { id: 'poi-meeting-alpha', name: 'Alpha Room', category: 'meeting-room', floor: '1', coordinates: [BASE_LNG - SCALE * 1.2, BASE_LAT + SCALE * 0.2], description: 'Meeting room — 8 seats', capacity: 8, available: true, tags: ['video-conf'] },
  { id: 'poi-meeting-beta', name: 'Beta Room', category: 'meeting-room', floor: '1', coordinates: [BASE_LNG + SCALE * 1.2, BASE_LAT - SCALE * 0.4], description: 'Meeting room — 4 seats', capacity: 4, available: false, tags: ['whiteboard'] },
  { id: 'poi-lounge-1', name: 'Break Lounge', category: 'lounge', floor: '1', coordinates: [BASE_LNG + SCALE * 0.2, BASE_LAT - SCALE * 0.8], description: 'Relax space', available: true },
  { id: 'poi-wc-1', name: 'Restrooms (1F)', category: 'bathroom', floor: '1', coordinates: [BASE_LNG - SCALE * 0.6, BASE_LAT - SCALE * 0.5], available: true },
  { id: 'poi-exit-1', name: 'Fire Exit 1F', category: 'exit', floor: '1', coordinates: [BASE_LNG + SCALE * 1.8, BASE_LAT + SCALE * 0.1], available: true, tags: ['emergency'] },

  // Second Floor
  { id: 'poi-desk-201', name: 'Workstation 201', category: 'desk', floor: '2', coordinates: [BASE_LNG - SCALE * 0.9, BASE_LAT + SCALE * 1.0], available: true, tags: ['hot-desk'] },
  { id: 'poi-desk-202', name: 'Workstation 202', category: 'desk', floor: '2', coordinates: [BASE_LNG - SCALE * 0.1, BASE_LAT + SCALE * 1.1], available: false },
  { id: 'poi-desk-203', name: 'Workstation 203', category: 'desk', floor: '2', coordinates: [BASE_LNG + SCALE * 0.7, BASE_LAT + SCALE * 1.0], available: true, tags: ['hot-desk', 'dual-monitor'] },
  { id: 'poi-meeting-gamma', name: 'Gamma Suite', category: 'meeting-room', floor: '2', coordinates: [BASE_LNG - SCALE * 1.3, BASE_LAT + SCALE * 0.3], description: 'Board room — 20 seats', capacity: 20, available: true, tags: ['video-conf', 'catering'] },
  { id: 'poi-server', name: 'Server Room', category: 'server-room', floor: '2', coordinates: [BASE_LNG + SCALE * 1.5, BASE_LAT - SCALE * 0.2], description: 'IT infrastructure — restricted', available: false, tags: ['restricted'] },
  { id: 'poi-wc-2', name: 'Restrooms (2F)', category: 'bathroom', floor: '2', coordinates: [BASE_LNG + SCALE * 0.5, BASE_LAT - SCALE * 0.9], available: true },
];

export const ROOMS: Room[] = [
  // First floor rooms (GeoJSON polygons)
  {
    id: 'room-alpha',
    name: 'Alpha Room',
    floor: '1',
    category: 'meeting-room',
    color: '#0d9488',
    coordinates: [[
      [BASE_LNG - SCALE * 1.6, BASE_LAT - SCALE * 0.2],
      [BASE_LNG - SCALE * 0.8, BASE_LAT - SCALE * 0.2],
      [BASE_LNG - SCALE * 0.8, BASE_LAT + SCALE * 0.6],
      [BASE_LNG - SCALE * 1.6, BASE_LAT + SCALE * 0.6],
      [BASE_LNG - SCALE * 1.6, BASE_LAT - SCALE * 0.2],
    ]],
  },
  {
    id: 'room-beta',
    name: 'Beta Room',
    floor: '1',
    category: 'meeting-room',
    color: '#f59e0b',
    coordinates: [[
      [BASE_LNG + SCALE * 0.8, BASE_LAT - SCALE * 0.8],
      [BASE_LNG + SCALE * 1.6, BASE_LAT - SCALE * 0.8],
      [BASE_LNG + SCALE * 1.6, BASE_LAT],
      [BASE_LNG + SCALE * 0.8, BASE_LAT],
      [BASE_LNG + SCALE * 0.8, BASE_LAT - SCALE * 0.8],
    ]],
  },
  {
    id: 'room-lounge',
    name: 'Break Lounge',
    floor: '1',
    category: 'lounge',
    color: '#84cc16',
    coordinates: [[
      [BASE_LNG - SCALE * 0.2, BASE_LAT - SCALE * 1.2],
      [BASE_LNG + SCALE * 0.6, BASE_LAT - SCALE * 1.2],
      [BASE_LNG + SCALE * 0.6, BASE_LAT - SCALE * 0.4],
      [BASE_LNG - SCALE * 0.2, BASE_LAT - SCALE * 0.4],
      [BASE_LNG - SCALE * 0.2, BASE_LAT - SCALE * 1.2],
    ]],
  },
];

// A simple nav path connecting reception to Alpha Room via corridors
export const SAMPLE_NAV_PATH: [number, number][] = [
  [BASE_LNG, BASE_LAT + SCALE * 0.5],
  [BASE_LNG, BASE_LAT + SCALE * 0.1],
  [BASE_LNG - SCALE * 0.6, BASE_LAT + SCALE * 0.1],
  [BASE_LNG - SCALE * 1.2, BASE_LAT + SCALE * 0.1],
  [BASE_LNG - SCALE * 1.2, BASE_LAT + SCALE * 0.2],
];

export const DEFAULT_MAP_CENTER: [number, number] = [BASE_LNG, BASE_LAT];
export const DEFAULT_ZOOM = 18.5;
 