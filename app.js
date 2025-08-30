// Configuration
const BOUNDING_BOX = [
    [17.3617798628895, 78.41079711914064], // Southwest corner (lat, lon)
    [17.451611, 78.504916]  // Northeast corner (lat, lon)
];

// Image path configuration - change this for different environments
const CUSTOM_TILE_IMAGE_PATH = 'tile_symbol.png';

// Function to check if coordinates are within the bounding box
function isWithinBoundingBox(lat, lng) {
    const [southWest, northEast] = BOUNDING_BOX;
    const [minLat, minLng] = southWest;
    const [maxLat, maxLng] = northEast;
    
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

// Function to convert tile coordinates (x, y, z) to latitude and longitude
function tileToLatLng(x, y, z) {
    const n = Math.pow(2, z);
    const lon = x / n * 360 - 180;
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
    return { lat: lat, lng: lon };
}

// Function to convert lat/lng to tile coordinates
function latLngToTile(lat, lng, z) {
    const n = Math.pow(2, z);
    const x = Math.floor((lng + 180) / 360 * n);
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
    return { x: x, y: y };
}

const map = L.map('map', {
    maxBounds: BOUNDING_BOX,
    maxBoundsViscosity: 1.0, // Prevents panning outside bounds
    minZoom: 10, // Prevents zooming out beyond level 10
    maxZoom: 19  // Maximum zoom level
}).setView([17.481671724450763, 78.29818725585939], 11);

// Custom tile layer that shows the image for tiles within bounding box
const customTileLayer = L.TileLayer.extend({
    getTileUrl: function(coords) {
        // Convert tile coordinates to lat/lng for the tile corners
        const tileLatLng = tileToLatLng(coords.x, coords.y, coords.z);
        
        // Check if any part of the tile is within the bounding box
        // We'll check the tile center and approximate if it overlaps
        if (isWithinBoundingBox(tileLatLng.lat, tileLatLng.lng)) {
            // Return the path to your custom image
            return CUSTOM_TILE_IMAGE_PATH;
        }
        
        // Otherwise, return a transparent tile or use OpenStreetMap
        return `https://${this._getSubdomain(coords)}.tile.openstreetmap.org/${coords.z}/${coords.x}/${coords.y}.png`;
    },
    _getSubdomain: function(coords) {
        // OpenStreetMap uses subdomains a, b, c
        const subdomains = ['a', 'b', 'c'];
        return subdomains[(coords.x + coords.y) % subdomains.length];
    }
});

const tileLayer = new customTileLayer('', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
tileLayer.addTo(map);

const marker = L.marker([51.5, -0.09]).addTo(map);

map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    // alert("Coordinates: " + lat + ", " + lng);
});

// let marker = L.marker([17.481671724450763, 78.29818725585939]).addTo(map);

document.getElementById('search-btn').addEventListener('click', function() {
    const lat = parseFloat(document.getElementById('lat-input').value);
    const lon = parseFloat(document.getElementById('lon-input').value);

    if (isNaN(lat) || isNaN(lon)) {
        alert('Please enter valid latitude and longitude values.');
        return;
    }

    if (!isWithinBoundingBox(lat, lon)) {
        alert('Coordinates are outside the defined bounding box.');
        return;
    }

    map.setView([lat, lon], map.getZoom());
    marker.setLatLng([lat, lon]);
    document.getElementById('coordinates').textContent = `Coordinates: ${lat}, ${lon} | Zoom: ${map.getZoom()}`;
});

map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    marker.setLatLng([lat, lng]);
    
    // Check if clicked coordinates are within bounding box
    const withinBounds = isWithinBoundingBox(lat, lng);
    const statusText = withinBounds ? ' (within bounds)' : ' (outside bounds)';
    document.getElementById('coordinates').textContent = `Coordinates: ${lat}, ${lng} | Zoom: ${map.getZoom()}${statusText}`;
});

// Draw a rectangle to show the bounding box
const boundsRectangle = L.rectangle(BOUNDING_BOX, {
    color: "#ff7800",
    weight: 2,
    fillOpacity: 0.1,
    fillColor: "#ff7800"
}).addTo(map);

// Add a tooltip to the bounding box
boundsRectangle.bindTooltip("Aera of Interest", {
    permanent: false,
    direction: 'center'
});