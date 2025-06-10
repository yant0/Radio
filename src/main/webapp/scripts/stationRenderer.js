import { playStation } from './player.js';
import { checkStreamStatus } from './streamStatus.js';
import { loadFavoriteStations } from './loadFavorites.js';

export function renderStation(station, container) {
    const stationDiv = document.createElement('div');
    stationDiv.classList.add('station-list-item');

    // Image
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'station-img';
    const img = document.createElement('img');
    img.src = station.favicon || './res/default-icon.png';
    img.alt = `📻 ${station.name}`;
    img.onerror = () => {
        img.onerror = null;
        img.src = './res/default-icon.png';
    };
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => playStation(station));
    imgWrapper.appendChild(img);

    // Name
    const nameDiv = document.createElement('div');
    nameDiv.className = 'station-name';

    const nameText = document.createTextNode(station.name);
    nameDiv.appendChild(nameText);

    // Status
    const status = document.createElement('div');
    status.className = 'station-status';
    status.textContent = 'Checking...';
    nameDiv.appendChild(status);

    // Meta Info
    const meta = document.createElement('div');
    meta.className = 'station-meta';

    // Country (emoji if possible)
    if (station.country) {
        const country = document.createElement('div');
        country.className = 'meta-item';
        country.textContent = getFlagEmoji(station.country) + ' ' + station.country.toUpperCase();
        meta.appendChild(country);
    }

    // Codec
    if (station.codec) {
        const codec = document.createElement('div');
        codec.className = 'meta-item';
        codec.textContent = station.codec.toUpperCase();
        meta.appendChild(codec);
    }

    // HLS
    if (station.hls === '1') {
        const hls = document.createElement('div');
        hls.className = 'meta-item';
        hls.textContent = 'HLS';
        meta.appendChild(hls);
    }

    // Tags
    if (station.tags) {
        const tags = document.createElement('div');
        tags.className = 'meta-item';
        tags.textContent = station.tags;
        meta.appendChild(tags);
    }

    nameDiv.appendChild(meta);

    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.className = 'station-star';
    favBtn.textContent = '⭐';
    favBtn.style.background = 'none';
    favBtn.style.color = '#aaa';
    favBtn.addEventListener('click', () => {
        const isSelected = favBtn.classList.toggle('selected');
        favBtn.style.color = isSelected ? '#ffc107' : '#aaa'; // yellow star when selected
        favoriteStation(station, favBtn);
    });

    // Assemble
    stationDiv.appendChild(imgWrapper);
    stationDiv.appendChild(nameDiv);
    stationDiv.appendChild(favBtn);
    container.appendChild(stationDiv);

    // Async status check
    checkStreamStatus(station.url).then(s => {
        status.textContent = s;
        status.style.color = {
            OK: 'green',
            Checking: 'orange',
            Offline: 'red'
        }[s];
    });
}

// Helper: Convert country code to flag emoji
function getFlagEmoji(countryCode) {
    if (!countryCode) return '';
    return countryCode.toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
}


function favoriteStation(station, btn) {
    fetch('addFavorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: station.name,
            url: station.url,
            favicon: station.favicon
        })
    })
        .then(res => res.json())
        .then(data => {
            btn.disabled = true;
            btn.classList.add('disabled');
            loadFavoriteStations();
        })
        .catch(err => {
            console.error("Favorite failed", err);
        });
}
