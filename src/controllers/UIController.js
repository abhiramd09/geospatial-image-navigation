// Controller for handling UI interactions

import { isWithinBoundingBox } from '../utils/coordinateUtils.js';

export class UIController {
    constructor(mapService) {
        this.mapService = mapService;
        this.elements = {};
        this.initializeElements();
        this.setupEventListeners();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.elements = {
            latInput: document.getElementById('lat-input'),
            lonInput: document.getElementById('lon-input'),
            searchBtn: document.getElementById('search-btn'),
            coordinates: document.getElementById('coordinates')
        };
    }

    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Search button click
        this.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });

        // Map click event
        this.mapService.onMapClick = (e) => {
            this.handleMapClick(e);
        };
    }

    /**
     * Handle search button click
     */
    handleSearch() {
        const lat = parseFloat(this.elements.latInput.value);
        const lon = parseFloat(this.elements.lonInput.value);

        if (isNaN(lat) || isNaN(lon)) {
            this.showAlert('Please enter valid latitude and longitude values.');
            return;
        }

        if (!isWithinBoundingBox(lat, lon)) {
            this.showAlert('Coordinates are outside the defined bounding box.');
            return;
        }

        this.mapService.setView(lat, lon);
        this.updateCoordinatesDisplay(lat, lon, this.mapService.getZoom());
    }

    /**
     * Handle map click events
     * @param {Object} e - Leaflet click event
     */
    handleMapClick(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        this.mapService.getMarker().setLatLng([lat, lng]);
        
        // Check if clicked coordinates are within bounding box
        const withinBounds = isWithinBoundingBox(lat, lng);
        const statusText = withinBounds ? ' (within bounds)' : ' (outside bounds)';
        
        this.updateCoordinatesDisplay(lat, lng, this.mapService.getZoom(), statusText);
    }

    /**
     * Update coordinates display
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} zoom - Zoom level
     * @param {string} statusText - Status text (optional)
     */
    updateCoordinatesDisplay(lat, lng, zoom, statusText = '') {
        this.elements.coordinates.textContent = `Coordinates: ${lat}, ${lng} | Zoom: ${zoom}${statusText}`;
    }

    /**
     * Show alert message
     * @param {string} message - Alert message
     */
    showAlert(message) {
        alert(message);
    }

    /**
     * Get DOM elements
     * @returns {Object} - DOM elements
     */
    getElements() {
        return this.elements;
    }
}
