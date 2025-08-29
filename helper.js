function latLonToTileCoords(lat, lon, zoom) {
    const latRad = lat * Math.PI / 180;
    const n = Math.pow(2, zoom);
    const x = Math.floor((lon + 180) / 360 * n);
    const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
    return { x, y, z: zoom };
}

// Example usage:
const coords = latLonToTileCoords(17.23000493050636, 78.43139648437501, 15);
console.log(coords); // { x: ..., y: ..., z: 15 }