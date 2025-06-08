import { renderStation } from './stationRenderer.js';

export function fetchStations() {
    fetch('stations')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('stations');
            container.innerHTML = '';
            data.forEach(station => renderStation(station, container));
        });
}

export function searchStations() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    fetch(`searchStations?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            const stationContainer = document.getElementById('stations');
            stationContainer.innerHTML = '';

            if (data.length === 0) {
                stationContainer.innerHTML = '<p>No stations found.</p>';
                return;
            }

            data.forEach(station => renderStation(station, stationContainer));
        })
        .catch(err => {
            console.error(err);
            document.getElementById('stations').innerHTML = '<p>Error loading stations.</p>';
        });
}
