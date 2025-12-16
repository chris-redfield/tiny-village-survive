// World settings
export const WORLD_SIZE = 2000;
export const CELL_SIZE = 40;

// Building definitions with heights
export const BUILDING_TYPES = {
    HOUSE: {
        name: 'House',
        wallHeight: 60,
        roofHeight: 30,
        roofType: 'peaked',
        wallColor: { r: 180, g: 140, b: 100 },
        roofColor: { r: 139, g: 69, b: 19 }
    },
    TOWER: {
        name: 'Tower',
        wallHeight: 120,
        roofHeight: 40,
        roofType: 'peaked',
        wallColor: { r: 120, g: 120, b: 130 },
        roofColor: { r: 80, g: 80, b: 90 }
    },
    BARN: {
        name: 'Barn',
        wallHeight: 50,
        roofHeight: 35,
        roofType: 'peaked',
        wallColor: { r: 160, g: 82, b: 45 },
        roofColor: { r: 100, g: 50, b: 30 }
    },
    WELL: {
        name: 'Well',
        wallHeight: 25,
        roofHeight: 15,
        roofType: 'flat',
        wallColor: { r: 100, g: 100, b: 110 },
        roofColor: { r: 80, g: 60, b: 40 }
    },
    CHURCH: {
        name: 'Church',
        wallHeight: 90,
        roofHeight: 50,
        roofType: 'peaked',
        wallColor: { r: 200, g: 200, b: 210 },
        roofColor: { r: 60, g: 60, b: 70 }
    },
    FENCE: {
        name: 'Fence',
        wallHeight: 20,
        roofHeight: 0,
        roofType: 'none',
        wallColor: { r: 139, g: 90, b: 43 },
        roofColor: { r: 0, g: 0, b: 0 }
    }
};

// Sky gradient colors (fallback for when texture not loaded)
export const skyColors = {
    top: { r: 10, g: 10, b: 30 },
    bottom: { r: 30, g: 30, b: 60 }
};
