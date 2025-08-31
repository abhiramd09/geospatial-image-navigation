// Example test file for coordinateUtils
// This demonstrates how the modular structure enables easy testing

import { isWithinBoundingBox, latLngToTile, tileToLatLng } from '../src/utils/coordinateUtils.js';

describe('coordinateUtils', () => {
    describe('isWithinBoundingBox', () => {
        it('should return true for coordinates within bounds', () => {
            const result = isWithinBoundingBox(17.4, 78.45);
            expect(result).toBe(true);
        });

        it('should return false for coordinates outside bounds', () => {
            const result = isWithinBoundingBox(20.0, 80.0);
            expect(result).toBe(false);
        });

        it('should return true for coordinates on the boundary', () => {
            const result = isWithinBoundingBox(17.39503644739134, 78.44787597656251);
            expect(result).toBe(true);
        });
    });

    describe('latLngToTile', () => {
        it('should convert lat/lng to tile coordinates', () => {
            const result = latLngToTile(17.4, 78.45, 10);
            expect(result).toHaveProperty('x');
            expect(result).toHaveProperty('y');
            expect(typeof result.x).toBe('number');
            expect(typeof result.y).toBe('number');
        });

        it('should return different coordinates for different zoom levels', () => {
            const result1 = latLngToTile(17.4, 78.45, 10);
            const result2 = latLngToTile(17.4, 78.45, 11);
            expect(result1.x).not.toBe(result2.x);
            expect(result1.y).not.toBe(result2.y);
        });
    });

    describe('tileToLatLng', () => {
        it('should convert tile coordinates to lat/lng', () => {
            const result = tileToLatLng(735, 461, 10);
            expect(result).toHaveProperty('lat');
            expect(result).toHaveProperty('lng');
            expect(typeof result.lat).toBe('number');
            expect(typeof result.lng).toBe('number');
        });

        it('should be inverse of latLngToTile', () => {
            const originalLat = 17.4;
            const originalLng = 78.45;
            const zoom = 10;
            
            const tile = latLngToTile(originalLat, originalLng, zoom);
            const latLng = tileToLatLng(tile.x, tile.y, zoom);
            
            expect(Math.abs(latLng.lat - originalLat)).toBeLessThan(0.1);
            expect(Math.abs(latLng.lng - originalLng)).toBeLessThan(0.1);
        });
    });
});
