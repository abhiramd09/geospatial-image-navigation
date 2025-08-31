// Utility functions for coordinate and tile calculations

import { MAP_CONFIG } from '../config/constants.js';

/**
 * Check if coordinates are within the bounding box
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - True if within bounds
 */
export function isWithinBoundingBox(lat, lng) {
    const [southWest, northEast] = MAP_CONFIG.BOUNDING_BOX;
    const [minLat, minLng] = southWest;
    const [maxLat, maxLng] = northEast;
    
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

/**
 * Convert tile coordinates (x, y, z) to latitude and longitude
 * @param {number} x - Tile X coordinate
 * @param {number} y - Tile Y coordinate
 * @param {number} z - Zoom level
 * @returns {Object} - {lat, lng}
 */
export function tileToLatLng(x, y, z) {
    const n = Math.pow(2, z);
    const lon = x / n * 360 - 180;
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
    return { lat, lng: lon };
}

/**
 * Convert lat/lng to tile coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} z - Zoom level
 * @returns {Object} - {x, y}
 */
export function latLngToTile(lat, lng, z) {
    const n = Math.pow(2, z);
    const x = Math.floor((lng + 180) / 360 * n);
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
    return { x, y };
}

/**
 * Get tile bounds (lat/lng coordinates of tile corners)
 * @param {number} x - Tile X coordinate
 * @param {number} y - Tile Y coordinate
 * @param {number} z - Zoom level
 * @returns {Array} - [[south, west], [north, east]]
 */
export function getTileBounds(x, y, z) {
    const n = Math.pow(2, z);
    const west = x / n * 360 - 180;
    const east = (x + 1) / n * 360 - 180;
    const north = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
    const south = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * 180 / Math.PI;
    
    return [
        [south, west],  // Southwest corner
        [north, east]   // Northeast corner
    ];
}

/**
 * Check if a tile intersects with the bounding box
 * @param {number} tileX - Tile X coordinate
 * @param {number} tileY - Tile Y coordinate
 * @param {number} tileZ - Zoom level
 * @returns {boolean} - True if tile intersects with bounding box
 */
export function tileIntersectsBoundingBox(tileX, tileY, tileZ) {
    const tileBounds = getTileBounds(tileX, tileY, tileZ);
    const [southWest, northEast] = MAP_CONFIG.BOUNDING_BOX;
    
    const tileSouth = tileBounds[0][0];
    const tileWest = tileBounds[0][1];
    const tileNorth = tileBounds[1][0];
    const tileEast = tileBounds[1][1];
    
    const boxMinLat = southWest[0];
    const boxMinLng = southWest[1];
    const boxMaxLat = northEast[0];
    const boxMaxLng = northEast[1];
    
    return !(tileEast < boxMinLng || tileWest > boxMaxLng || tileNorth < boxMinLat || tileSouth > boxMaxLat);
}

/**
 * Get all tiles within bounding box for a given zoom level
 * @param {number} zoomLevel - Zoom level
 * @returns {Array} - Array of tile objects {x, y, z}
 */
export function getTilesInBoundingBox(zoomLevel) {
    const [southWest, northEast] = MAP_CONFIG.BOUNDING_BOX;
    const [minLat, minLng] = southWest;
    const [maxLat, maxLng] = northEast;
    
    const minTile = latLngToTile(minLat, minLng, zoomLevel);
    const maxTile = latLngToTile(maxLat, maxLng, zoomLevel);
    
    const tiles = [];
    for (let x = minTile.x; x <= maxTile.x; x++) {
        for (let y = maxTile.y; y <= minTile.y; y++) {
            tiles.push({ x, y, z: zoomLevel });
        }
    }
    return tiles;
}

/**
 * Calculate the distance in degrees for given meters
 * @param {number} lat - Latitude for longitude calculation
 * @param {number} meters - Distance in meters
 * @returns {Object} - {deltaLat, deltaLng}
 */
export function metersToLatLngDelta(lat, meters) {
    const deltaLat = meters / 111320;
    const deltaLng = meters / (111320 * Math.cos(lat * Math.PI / 180));
    return { deltaLat, deltaLng };
}
