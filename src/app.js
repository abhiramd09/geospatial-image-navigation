// Main application entry point

import { MapService } from './services/MapService.js';
import { TileService } from './services/TileService.js';
import { GridService } from './services/GridService.js';
import { UIController } from './controllers/UIController.js';

class GeospatialApp {
    constructor() {
        this.mapService = null;
        this.tileService = null;
        this.gridService = null;
        this.uiController = null;
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            // Initialize map service
            this.mapService = new MapService('map');
            const map = this.mapService.initialize();

            // Initialize tile service
            this.tileService = new TileService(map);

            // Initialize grid service
            this.gridService = new GridService(map);

            // Initialize UI controller
            this.uiController = new UIController(this.mapService);

            // Setup event handlers
            this.setupEventHandlers();

            // Create grid overlays
            this.gridService.createGridOverlays();

            // Initialize tile boxes
            setTimeout(() => {
                this.tileService.updateTileBoxes();
            }, 100);

            console.log('Geospatial application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Handle zoom end events
        this.mapService.onZoomEnd = () => {
            this.tileService.updateTileBoxes();
        };
    }

    /**
     * Get map service instance
     * @returns {MapService} - Map service instance
     */
    getMapService() {
        return this.mapService;
    }

    /**
     * Get tile service instance
     * @returns {TileService} - Tile service instance
     */
    getTileService() {
        return this.tileService;
    }

    /**
     * Get grid service instance
     * @returns {GridService} - Grid service instance
     */
    getGridService() {
        return this.gridService;
    }

    /**
     * Get UI controller instance
     * @returns {UIController} - UI controller instance
     */
    getUIController() {
        return this.uiController;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GeospatialApp();
    app.initialize();
    
    // Make app available globally for debugging
    window.geospatialApp = app;
});
