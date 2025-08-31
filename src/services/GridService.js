// Service class for managing grid overlays

import { MAP_CONFIG, TILE_CONFIG, GRID_CONFIG } from '../config/constants.js';
import { metersToLatLngDelta } from '../utils/coordinateUtils.js';

export class GridService {
    constructor(map) {
        this.map = map;
        this.gridOverlays = [];
    }

    /**
     * Create 500m x 500m grid overlays
     */
    createGridOverlays() {
        const [sw, ne] = MAP_CONFIG.BOUNDING_BOX;
        const minLat = sw[0];
        const minLng = sw[1];
        const maxLat = ne[0];
        const maxLng = ne[1];

        // Use the latitude at the bottom of the box for deltaLng calculation
        const { deltaLat, deltaLng } = metersToLatLngDelta(minLat, GRID_CONFIG.GRID_SIZE_METERS);

        for (let lat = minLat; lat < maxLat; lat += deltaLat) {
            // Prevent overshooting the maxLat
            const nextLat = Math.min(lat + deltaLat, maxLat);
            for (let lng = minLng; lng < maxLng; lng += deltaLng) {
                // Prevent overshooting the maxLng
                const nextLng = Math.min(lng + deltaLng, maxLng);

                // Each 500mx500m box
                const smallBox = [
                    [lat, lng],
                    [nextLat, nextLng]
                ];

                const overlay = L.imageOverlay(
                    TILE_CONFIG.CUSTOM_TILE_IMAGE_PATH,
                    smallBox,
                    { interactive: false }
                ).addTo(this.map);

                this.gridOverlays.push(overlay);
            }
        }
    }

    /**
     * Clear all grid overlays
     */
    clearGridOverlays() {
        this.gridOverlays.forEach(overlay => {
            this.map.removeLayer(overlay);
        });
        this.gridOverlays = [];
    }

    /**
     * Get grid overlays count
     * @returns {number} - Number of grid overlays
     */
    getGridOverlaysCount() {
        return this.gridOverlays.length;
    }
}
