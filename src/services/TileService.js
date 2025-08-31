// Service class for managing tile operations and state

import { getTilesInBoundingBox, getTileBounds } from '../utils/coordinateUtils.js';
import { UI_CONFIG } from '../config/constants.js';

export class TileService {
    constructor(map) {
        this.map = map;
        this.tileRectangles = new Map();
    }

    /**
     * Draw tile boxes for a specific zoom level
     * @param {number} zoomLevel - Zoom level to draw tiles for
     */
    drawTileBoxes(zoomLevel) {
        // Remove existing rectangles for this zoom level
        this.clearTileBoxes(zoomLevel);
        
        const tiles = getTilesInBoundingBox(zoomLevel);
        const rectangles = [];
        
        tiles.forEach(tile => {
            const bounds = getTileBounds(tile.x, tile.y, tile.z);
            const rectangle = L.rectangle(bounds, {
                color: UI_CONFIG.TILE_BOX_COLOR,
                weight: 1,
                fillOpacity: 0,
                fillColor: UI_CONFIG.TILE_BOX_COLOR
            }).addTo(this.map);
            
            // Add tooltip with tile coordinates
            rectangle.bindTooltip(`Tile: ${tile.x}, ${tile.y}, ${tile.z}`, {
                permanent: false,
                direction: 'center'
            });
            
            rectangles.push(rectangle);
        });
        
        this.tileRectangles.set(zoomLevel, rectangles);
    }

    /**
     * Clear tile boxes for a specific zoom level
     * @param {number} zoomLevel - Zoom level to clear
     */
    clearTileBoxes(zoomLevel) {
        if (this.tileRectangles.has(zoomLevel)) {
            this.tileRectangles.get(zoomLevel).forEach(rect => this.map.removeLayer(rect));
            this.tileRectangles.delete(zoomLevel);
        }
    }

    /**
     * Clear all tile boxes
     */
    clearAllTileBoxes() {
        this.tileRectangles.forEach((rectangles, zoomLevel) => {
            rectangles.forEach(rect => this.map.removeLayer(rect));
        });
        this.tileRectangles.clear();
    }

    /**
     * Update tile boxes for current zoom level
     */
    updateTileBoxes() {
        const currentZoom = this.map.getZoom();
        
        // Clear all existing tile boxes
        this.clearAllTileBoxes();
        
        // Draw tile boxes for current zoom level
        this.drawTileBoxes(currentZoom);
    }
}
