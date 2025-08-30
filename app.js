// Configuration of 2x2 km region
const BOUNDING_BOX = [
    [17.39503644739134, 78.44787597656251], // Southwest corner (lat, lon)
    [17.413108, 78.466698]  // Northeast corner (lat, lon)
];

// Image path configuration - change this for different environments
const CUSTOM_TILE_IMAGE_PATH = 'tile_symbol.png';

// Store tile rectangles for different zoom levels
const tileRectangles = new Map();

// Function to check if coordinates are within the bounding box
function isWithinBoundingBox(lat, lng) {
    const [southWest, northEast] = BOUNDING_BOX;
    const [minLat, minLng] = southWest;
    const [maxLat, maxLng] = northEast;
    
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

// Function to check if a tile intersects with the bounding box
function tileIntersectsBoundingBox(tileX, tileY, tileZ) {
    const tileBounds = getTileBounds(tileX, tileY, tileZ);
    const [southWest, northEast] = BOUNDING_BOX;
    
    // Check if the tile bounds overlap with the bounding box
    // Tile bounds: [south, west], [north, east]
    // Bounding box: [minLat, minLng], [maxLat, maxLng]
    
    const tileSouth = tileBounds[0][0];
    const tileWest = tileBounds[0][1];
    const tileNorth = tileBounds[1][0];
    const tileEast = tileBounds[1][1];
    
    const boxMinLat = southWest[0];
    const boxMinLng = southWest[1];
    const boxMaxLat = northEast[0];
    const boxMaxLng = northEast[1];
    
    // Check for intersection: not (tile is completely outside the box)
    return !(tileEast < boxMinLng || tileWest > boxMaxLng || tileNorth < boxMinLat || tileSouth > boxMaxLat);
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

// Function to get tile bounds (lat/lng coordinates of tile corners)
function getTileBounds(x, y, z) {
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

// Function to get all tiles within bounding box for a given zoom level
function getTilesInBoundingBox(zoomLevel) {
    const [southWest, northEast] = BOUNDING_BOX;
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

// Function to draw tile boxes for a specific zoom level
function drawTileBoxes(zoomLevel) {
    // Remove existing rectangles for this zoom level
    if (tileRectangles.has(zoomLevel)) {
        tileRectangles.get(zoomLevel).forEach(rect => map.removeLayer(rect));
        tileRectangles.delete(zoomLevel);
    }
    
    const tiles = getTilesInBoundingBox(zoomLevel);
    const rectangles = [];
    
    tiles.forEach(tile => {
        const bounds = getTileBounds(tile.x, tile.y, tile.z);
        const rectangle = L.rectangle(bounds, {
            color: '#0066cc',
            weight: 1,
            fillOpacity: 0,
            fillColor: '#0066cc'
        }).addTo(map);
        
        // Add tooltip with tile coordinates
        rectangle.bindTooltip(`Tile: ${tile.x}, ${tile.y}, ${tile.z}`, {
            permanent: false,
            direction: 'center'
        });
        
        rectangles.push(rectangle);
    });
    
    tileRectangles.set(zoomLevel, rectangles);
}

// Function to update tile boxes for current zoom level
function updateTileBoxes() {
    const currentZoom = map.getZoom();
    
    // Clear all existing tile boxes
    tileRectangles.forEach((rectangles, zoomLevel) => {
        rectangles.forEach(rect => map.removeLayer(rect));
    });
    tileRectangles.clear();
    
    // Draw tile boxes for current zoom level
    drawTileBoxes(currentZoom);
}

const map = L.map('map', {
    maxBounds: BOUNDING_BOX,
    maxBoundsViscosity: 1.0, // Prevents panning outside bounds
    minZoom: 12, // Prevents zooming out beyond level 13
    maxZoom: 19  // Maximum zoom level
}).setView([17.481671724450763, 78.29818725585939], 11);

// Custom tile layer that shows the image for tiles within bounding box
const customTileLayer = L.TileLayer.extend({
    getTileUrl: function(coords) {
        // Check if any part of the tile intersects with the bounding box
        // if (tileIntersectsBoundingBox(coords.x, coords.y, coords.z)) {
        //     // Return the path to your custom image
        //     return CUSTOM_TILE_IMAGE_PATH;
        // }
        
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

// Split the defined BOUNDING_BOX into 500m x 500m boxes and overlay the image in each

// Helper function to calculate the distance in degrees for 500 meters
function metersToLatLngDelta(lat, meters) {
    // 1 deg latitude ~= 111320 meters
    const deltaLat = meters / 111320;
    // 1 deg longitude ~= 111320 * cos(latitude) meters
    const deltaLng = meters / (111320 * Math.cos(lat * Math.PI / 180));
    return { deltaLat, deltaLng };
}

(function overlay500mTiles() {
    const [sw, ne] = BOUNDING_BOX;
    const minLat = sw[0];
    const minLng = sw[1];
    const maxLat = ne[0];
    const maxLng = ne[1];

    // Use the latitude at the bottom of the box for deltaLng calculation
    const { deltaLat, deltaLng } = metersToLatLngDelta(minLat, 500);

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

            L.imageOverlay(
                CUSTOM_TILE_IMAGE_PATH,
                smallBox,
                { interactive: false }
            ).addTo(map);
        }
    }
})();

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
boundsRectangle.bindTooltip("Area of Interest", {
    permanent: false,
    direction: 'center'
});

// Add zoom change event listener to automatically update tile boxes
map.on('zoomend', function() {
    updateTileBoxes();
});

// Add initial tile boxes for the starting zoom level
setTimeout(function() {
    updateTileBoxes();
}, 100);

