import { BUILDING_TYPES, WORLD_SIZE } from './config.js';

// Village buildings - expanded village
export const buildings = [
    // === MAIN VILLAGE CENTER ===
    // Central tower/watchtower
    { type: BUILDING_TYPES.TOWER, x: 950, y: 950, width: 60, depth: 60 },

    // Church near center
    { type: BUILDING_TYPES.CHURCH, x: 800, y: 850, width: 80, depth: 120 },

    // Central well
    { type: BUILDING_TYPES.WELL, x: 1050, y: 980, width: 35, depth: 35 },

    // === RESIDENTIAL DISTRICT (Northwest) ===
    { type: BUILDING_TYPES.HOUSE, x: 300, y: 300, width: 80, depth: 60 },
    { type: BUILDING_TYPES.HOUSE, x: 450, y: 280, width: 70, depth: 70 },
    { type: BUILDING_TYPES.HOUSE, x: 600, y: 320, width: 75, depth: 65 },
    { type: BUILDING_TYPES.HOUSE, x: 320, y: 450, width: 65, depth: 75 },
    { type: BUILDING_TYPES.HOUSE, x: 480, y: 420, width: 80, depth: 60 },
    { type: BUILDING_TYPES.HOUSE, x: 640, y: 480, width: 70, depth: 70 },
    { type: BUILDING_TYPES.HOUSE, x: 280, y: 600, width: 75, depth: 65 },
    { type: BUILDING_TYPES.HOUSE, x: 450, y: 580, width: 60, depth: 80 },

    // === RESIDENTIAL DISTRICT (Northeast) ===
    { type: BUILDING_TYPES.HOUSE, x: 1200, y: 300, width: 80, depth: 65 },
    { type: BUILDING_TYPES.HOUSE, x: 1350, y: 280, width: 70, depth: 70 },
    { type: BUILDING_TYPES.HOUSE, x: 1500, y: 350, width: 75, depth: 60 },
    { type: BUILDING_TYPES.HOUSE, x: 1180, y: 450, width: 65, depth: 75 },
    { type: BUILDING_TYPES.HOUSE, x: 1380, y: 420, width: 80, depth: 70 },
    { type: BUILDING_TYPES.HOUSE, x: 1550, y: 500, width: 70, depth: 65 },

    // === RESIDENTIAL DISTRICT (Southwest) ===
    { type: BUILDING_TYPES.HOUSE, x: 300, y: 1200, width: 75, depth: 70 },
    { type: BUILDING_TYPES.HOUSE, x: 480, y: 1180, width: 70, depth: 65 },
    { type: BUILDING_TYPES.HOUSE, x: 280, y: 1350, width: 80, depth: 60 },
    { type: BUILDING_TYPES.HOUSE, x: 450, y: 1380, width: 65, depth: 75 },
    { type: BUILDING_TYPES.HOUSE, x: 620, y: 1300, width: 70, depth: 70 },

    // === RESIDENTIAL DISTRICT (Southeast) ===
    { type: BUILDING_TYPES.HOUSE, x: 1250, y: 1200, width: 75, depth: 65 },
    { type: BUILDING_TYPES.HOUSE, x: 1420, y: 1250, width: 70, depth: 70 },
    { type: BUILDING_TYPES.HOUSE, x: 1580, y: 1180, width: 65, depth: 75 },
    { type: BUILDING_TYPES.HOUSE, x: 1300, y: 1380, width: 80, depth: 60 },
    { type: BUILDING_TYPES.HOUSE, x: 1500, y: 1400, width: 70, depth: 70 },

    // === MARKET/COMMERCIAL AREA (East of center) ===
    { type: BUILDING_TYPES.HOUSE, x: 1150, y: 800, width: 90, depth: 70 },
    { type: BUILDING_TYPES.HOUSE, x: 1150, y: 920, width: 85, depth: 65 },
    { type: BUILDING_TYPES.HOUSE, x: 1150, y: 1040, width: 80, depth: 70 },
    { type: BUILDING_TYPES.WELL, x: 1280, y: 900, width: 30, depth: 30 },
    { type: BUILDING_TYPES.WELL, x: 1280, y: 1000, width: 30, depth: 30 },

    // === FARM AREA (Far East) - with fenced enclosure ===
    { type: BUILDING_TYPES.BARN, x: 1650, y: 800, width: 120, depth: 80 },
    { type: BUILDING_TYPES.BARN, x: 1650, y: 950, width: 100, depth: 70 },
    { type: BUILDING_TYPES.HOUSE, x: 1800, y: 780, width: 70, depth: 60 }, // Farmhouse

    // Farm fencing (partial enclosure)
    { type: BUILDING_TYPES.FENCE, x: 1600, y: 750, width: 300, depth: 8 },  // North fence
    { type: BUILDING_TYPES.FENCE, x: 1600, y: 750, width: 8, depth: 320 },  // West fence
    { type: BUILDING_TYPES.FENCE, x: 1600, y: 1062, width: 300, depth: 8 }, // South fence
    { type: BUILDING_TYPES.FENCE, x: 1892, y: 750, width: 8, depth: 320 },  // East fence

    // === SECOND FARM (Far South) ===
    { type: BUILDING_TYPES.BARN, x: 850, y: 1550, width: 110, depth: 75 },
    { type: BUILDING_TYPES.BARN, x: 1000, y: 1580, width: 90, depth: 65 },
    { type: BUILDING_TYPES.HOUSE, x: 950, y: 1450, width: 65, depth: 60 }, // Farmhouse

    // Small animal pen fencing
    { type: BUILDING_TYPES.FENCE, x: 1100, y: 1520, width: 120, depth: 8 },
    { type: BUILDING_TYPES.FENCE, x: 1100, y: 1520, width: 8, depth: 150 },
    { type: BUILDING_TYPES.FENCE, x: 1100, y: 1662, width: 120, depth: 8 },
    { type: BUILDING_TYPES.FENCE, x: 1212, y: 1520, width: 8, depth: 150 },

    // === OUTPOST/WATCHTOWERS ===
    { type: BUILDING_TYPES.TOWER, x: 200, y: 200, width: 50, depth: 50 },   // Northwest
    { type: BUILDING_TYPES.TOWER, x: 1750, y: 200, width: 50, depth: 50 },  // Northeast
    { type: BUILDING_TYPES.TOWER, x: 200, y: 1750, width: 50, depth: 50 },  // Southwest
    { type: BUILDING_TYPES.TOWER, x: 1750, y: 1750, width: 50, depth: 50 }, // Southeast

    // === ADDITIONAL WELLS scattered around ===
    { type: BUILDING_TYPES.WELL, x: 550, y: 350, width: 28, depth: 28 },
    { type: BUILDING_TYPES.WELL, x: 1400, y: 550, width: 28, depth: 28 },
    { type: BUILDING_TYPES.WELL, x: 400, y: 1280, width: 28, depth: 28 },
    { type: BUILDING_TYPES.WELL, x: 1450, y: 1320, width: 28, depth: 28 },

    // === SMALL GARDEN with fence (near center-west) ===
    { type: BUILDING_TYPES.FENCE, x: 650, y: 850, width: 100, depth: 8 },
    { type: BUILDING_TYPES.FENCE, x: 650, y: 850, width: 8, depth: 100 },
    { type: BUILDING_TYPES.FENCE, x: 650, y: 942, width: 100, depth: 8 },
    { type: BUILDING_TYPES.FENCE, x: 742, y: 850, width: 8, depth: 100 },

    // === ADDITIONAL CHURCHES/CHAPELS ===
    { type: BUILDING_TYPES.CHURCH, x: 1400, y: 700, width: 70, depth: 100 },

    // === STORAGE BUILDINGS ===
    { type: BUILDING_TYPES.BARN, x: 580, y: 700, width: 60, depth: 50 },
    { type: BUILDING_TYPES.BARN, x: 1350, y: 1100, width: 70, depth: 55 },
];

// Create texture key lookup map
const typeToTextureKey = new Map();
for (const [key, type] of Object.entries(BUILDING_TYPES)) {
    typeToTextureKey.set(type, key);
}

// Pre-compute building data for performance
export function initBuildings() {
    for (const building of buildings) {
        building.textureKey = typeToTextureKey.get(building.type) || 'HOUSE';
        building.walls = [
            { x1: building.x, y1: building.y, x2: building.x + building.width, y2: building.y, side: 'front' },
            { x1: building.x + building.width, y1: building.y, x2: building.x + building.width, y2: building.y + building.depth, side: 'right' },
            { x1: building.x, y1: building.y + building.depth, x2: building.x + building.width, y2: building.y + building.depth, side: 'back' },
            { x1: building.x, y1: building.y, x2: building.x, y2: building.y + building.depth, side: 'left' }
        ];
        // Pre-compute bounding box for quick rejection
        building.minX = building.x;
        building.maxX = building.x + building.width;
        building.minY = building.y;
        building.maxY = building.y + building.depth;
    }
}

// Pre-compute world boundaries (created once, not per ray)
export const worldBoundaries = [
    { x1: 0, y1: 0, x2: 900, y2: 0, type: 'boundary' },
    { x1: 1100, y1: 0, x2: WORLD_SIZE, y2: 0, type: 'boundary' },
    { x1: WORLD_SIZE, y1: 0, x2: WORLD_SIZE, y2: WORLD_SIZE, type: 'boundary' },
    { x1: 0, y1: WORLD_SIZE, x2: WORLD_SIZE, y2: WORLD_SIZE, type: 'boundary' },
    { x1: 0, y1: 0, x2: 0, y2: WORLD_SIZE, type: 'boundary' }
];

export const boundaryType = {
    wallHeight: 100,
    roofHeight: 0,
    roofType: 'none',
    wallColor: { r: 60, g: 60, b: 70 }
};

// Check if point is inside a building
export function pointInBuilding(x, y) {
    for (const building of buildings) {
        if (x >= building.x && x < building.x + building.width &&
            y >= building.y && y < building.y + building.depth) {
            return building;
        }
    }
    return null;
}
