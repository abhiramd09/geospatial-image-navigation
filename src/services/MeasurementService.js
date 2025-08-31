// Example service demonstrating how to add new features
// This service handles distance and area measurements

import { metersToLatLngDelta } from '../utils/coordinateUtils.js';

export class MeasurementService {
    constructor(map) {
        this.map = map;
        this.measurements = [];
        this.isMeasuring = false;
        this.currentPolyline = null;
        this.currentPolygon = null;
    }

    /**
     * Start distance measurement mode
     */
    startDistanceMeasurement() {
        this.isMeasuring = true;
        this.currentPolyline = L.polyline([], {
            color: 'red',
            weight: 3
        }).addTo(this.map);
        
        this.map.on('click', this.handleMeasurementClick.bind(this));
    }

    /**
     * Stop measurement mode
     */
    stopMeasurement() {
        this.isMeasuring = false;
        if (this.currentPolyline) {
            this.map.removeLayer(this.currentPolyline);
            this.currentPolyline = null;
        }
        this.map.off('click', this.handleMeasurementClick.bind(this));
    }

    /**
     * Handle clicks during measurement
     * @param {Object} e - Leaflet click event
     */
    handleMeasurementClick(e) {
        if (!this.isMeasuring) return;

        const latlng = e.latlng;
        const latlngs = this.currentPolyline.getLatLngs();
        latlngs.push(latlng);
        this.currentPolyline.setLatLngs(latlngs);

        // Calculate distance
        const distance = this.calculateDistance(latlngs);
        console.log(`Distance: ${distance.toFixed(2)} meters`);
    }

    /**
     * Calculate distance between points
     * @param {Array} latlngs - Array of latlng points
     * @returns {number} - Distance in meters
     */
    calculateDistance(latlngs) {
        if (latlngs.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 1; i < latlngs.length; i++) {
            totalDistance += latlngs[i-1].distanceTo(latlngs[i]);
        }
        return totalDistance;
    }

    /**
     * Calculate area of a polygon
     * @param {Array} latlngs - Array of latlng points forming a polygon
     * @returns {number} - Area in square meters
     */
    calculateArea(latlngs) {
        if (latlngs.length < 3) return 0;

        // Simple area calculation using shoelace formula
        let area = 0;
        const n = latlngs.length;
        
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += latlngs[i].lng * latlngs[j].lat;
            area -= latlngs[j].lng * latlngs[i].lat;
        }
        
        area = Math.abs(area) / 2;
        // Convert to approximate square meters (rough conversion)
        return area * 111320 * 111320;
    }

    /**
     * Get all measurements
     * @returns {Array} - Array of measurement objects
     */
    getMeasurements() {
        return this.measurements;
    }

    /**
     * Clear all measurements
     */
    clearMeasurements() {
        this.measurements.forEach(measurement => {
            if (measurement.layer) {
                this.map.removeLayer(measurement.layer);
            }
        });
        this.measurements = [];
    }
}
