import { playStation } from './player.js';
import { checkStreamStatus } from './streamStatus.js';

export function renderStation(station, container) {
    // Outer wrapper
    const stationDiv = document.createElement('div');
    stationDiv.classList.add('station');

    // Image
    const img = document.createElement('img');
    img.src = station.favicon || './res/default-icon.png';
    img.alt = `📻 ${station.name}`;
    img.onerror = () => {
        img.onerror = null;
        img.src = './res/default-icon.png';
    };
    stationDiv.appendChild(img);

    // Content wrapper
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('station-content');

    // Wrapper for title + status
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('station-header');

    // Title
    const title = document.createElement('strong');
    title.classList.add('station-title');

    const link = document.createElement('a');
    link.href = station.url;
    link.target = '_blank';
    link.textContent = station.name;

    title.appendChild(link);
    headerDiv.appendChild(title);

    // Status
    const status = document.createElement('span');
    status.classList.add('status');
    status.textContent = 'Checking...';
    headerDiv.appendChild(status);

    // Add to content
    contentDiv.appendChild(headerDiv);

    // Buttons wrapper
    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('station-controls');

    const playBtn = document.createElement('button');
    playBtn.classList.add('play-btn');
    playBtn.textContent = '▶️ Play';
    playBtn.addEventListener('click', () => {
        playStation(station);
    });

    const favBtn = document.createElement('button');
    favBtn.classList.add('favorite-btn');
    favBtn.textContent = '⭐ Favorite';
    favBtn.addEventListener('click', () => {
        favoriteStation(station);
    });

    controlsDiv.appendChild(playBtn);
    controlsDiv.appendChild(favBtn);
    contentDiv.appendChild(controlsDiv);

    // Assemble
    stationDiv.appendChild(contentDiv);
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

// TODO move this IN JAVA SERVLET 😭
function favoriteStation(station) {
    fetch('favorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uuid: station.stationuuid,
            name: station.name,
            url: station.url,
            favicon: station.favicon
        })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message || "Favorited!");
        })
        .catch(err => {
            console.error("Favorite failed", err);
            alert("Could not favorite this station.");
        });
}
