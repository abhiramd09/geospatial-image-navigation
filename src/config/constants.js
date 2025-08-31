// Configuration constants for the geospatial application

export const MAP_CONFIG = {
    BOUNDING_BOX: [
        [17.39503644739134, 78.44787597656251], // Southwest corner (lat, lon)
        [17.413108, 78.466698]  // Northeast corner (lat, lon)
    ],
    DEFAULT_VIEW: [17.481671724450763, 78.29818725585939],
    DEFAULT_ZOOM: 11,
    MIN_ZOOM: 12,
    MAX_ZOOM: 19,
    MAX_BOUNDS_VISCOSITY: 1.0
};

export const TILE_CONFIG = {
    CUSTOM_TILE_IMAGE_PATH: 'assets/tile_symbol.png',
    OSM_SUBDOMAINS: ['a', 'b', 'c'],
    OSM_ATTRIBUTION: '© OpenStreetMap'
};

export const GRID_CONFIG = {
    GRID_SIZE_METERS: 500,
    DEGREES_PER_METER_LAT: 1 / 111320,
    DEGREES_PER_METER_LNG: 1 / (111320 * Math.cos(17.39503644739134 * Math.PI / 180))
};

export const UI_CONFIG = {
    TILE_BOX_COLOR: '#0066cc',
    BOUNDING_BOX_COLOR: '#ff7800',
    BOUNDING_BOX_WEIGHT: 2,
    BOUNDING_BOX_FILL_OPACITY: 0.1
};
