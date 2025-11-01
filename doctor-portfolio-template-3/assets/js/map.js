// Simple demo map initialization using Leaflet + OpenStreetMap tiles
// Centers on Patiala, India (demo coordinates). Replace coords as needed.

document.addEventListener('DOMContentLoaded', function () {
    var mapEl = document.getElementById('map');
    if (!mapEl) return; // no map container on this page

    try {
        // Create the Leaflet map
        var map = L.map('map', {
            center: [30.3398, 76.3869], // Patiala, Punjab (demo)
            zoom: 13,
            scrollWheelZoom: false
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add a demo marker with popup
        var marker = L.marker([30.3398, 76.3869]).addTo(map).bindPopup('Demo location — replace with your coordinates').openPopup();
    } catch (e) {
        // If Leaflet wasn't loaded or something broke, leave a simple fallback
        console.warn('Map init failed:', e);
    }
});
