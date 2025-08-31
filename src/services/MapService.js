// Service class for managing map operations

import { MAP_CONFIG, TILE_CONFIG, UI_CONFIG } from '../config/constants.js';
import { tileIntersectsBoundingBox } from '../utils/coordinateUtils.js';

export class MapService {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        this.tileLayer = null;
        this.boundsRectangle = null;
        this.marker = null;
    }

    /**
     * Initialize the map
     */
    initialize() {
        this.map = L.map(this.containerId, {
            maxBounds: MAP_CONFIG.BOUNDING_BOX,
            maxBoundsViscosity: MAP_CONFIG.MAX_BOUNDS_VISCOSITY,
            minZoom: MAP_CONFIG.MIN_ZOOM,
            maxZoom: MAP_CONFIG.MAX_ZOOM
        }).setView(MAP_CONFIG.DEFAULT_VIEW, MAP_CONFIG.DEFAULT_ZOOM);

        this.setupTileLayer();
        this.setupBoundingBox();
        this.setupMarker();
        this.setupEventListeners();

        return this.map;
    }

    /**
     * Setup custom tile layer
     */
    setupTileLayer() {
        const CustomTileLayer = L.TileLayer.extend({
            getTileUrl: function(coords) {
                // Check if any part of the tile intersects with the bounding box
                // if (tileIntersectsBoundingBox(coords.x, coords.y, coords.z)) {
                //     return TILE_CONFIG.CUSTOM_TILE_IMAGE_PATH;
                // }
                
                return `https://${this._getSubdomain(coords)}.tile.openstreetmap.org/${coords.z}/${coords.x}/${coords.y}.png`;
            },
            _getSubdomain: function(coords) {
                return TILE_CONFIG.OSM_SUBDOMAINS[(coords.x + coords.y) % TILE_CONFIG.OSM_SUBDOMAINS.length];
            }
        });

        this.tileLayer = new CustomTileLayer('', {
            maxZoom: MAP_CONFIG.MAX_ZOOM,
            attribution: TILE_CONFIG.OSM_ATTRIBUTION
        });
        this.tileLayer.addTo(this.map);
    }

    /**
     * Setup bounding box rectangle
     */
    setupBoundingBox() {
        this.boundsRectangle = L.rectangle(MAP_CONFIG.BOUNDING_BOX, {
            color: UI_CONFIG.BOUNDING_BOX_COLOR,
            weight: UI_CONFIG.BOUNDING_BOX_WEIGHT,
            fillOpacity: UI_CONFIG.BOUNDING_BOX_FILL_OPACITY,
            fillColor: UI_CONFIG.BOUNDING_BOX_COLOR
        }).addTo(this.map);

        this.boundsRectangle.bindTooltip("Area of Interest", {
            permanent: false,
            direction: 'center'
        });
    }

    /**
     * Setup marker
     */
    setupMarker() {
        this.marker = L.marker([51.5, -0.09]).addTo(this.map);
    }

    /**
     * Setup map event listeners
     */
    setupEventListeners() {
        // Zoom change event
        this.map.on('zoomend', () => {
            if (this.onZoomEnd) {
                this.onZoomEnd();
            }
        });

        // Click event
        this.map.on('click', (e) => {
            if (this.onMapClick) {
                this.onMapClick(e);
            }
        });
    }

    /**
     * Set map view to coordinates
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} zoom - Zoom level (optional)
     */
    setView(lat, lng, zoom = null) {
        const zoomLevel = zoom || this.map.getZoom();
        this.map.setView([lat, lng], zoomLevel);
        this.marker.setLatLng([lat, lng]);
    }

    /**
     * Get current map zoom level
     * @returns {number} - Current zoom level
     */
    getZoom() {
        return this.map.getZoom();
    }

    /**
     * Get map instance
     * @returns {L.Map} - Leaflet map instance
     */
    getMap() {
        return this.map;
    }

    /**
     * Get marker instance
     * @returns {L.Marker} - Leaflet marker instance
     */
    getMarker() {
        return this.marker;
    }
}
