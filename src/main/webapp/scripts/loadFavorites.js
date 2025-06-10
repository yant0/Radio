import { playStation } from "./player.js";

export function loadFavoriteStations() {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '<div class="spinner"></div>';

    fetch('loadFavorites')
        .then(res => {
            if (res.status === 401) throw new Error("Not logged in");
            return res.json();
        })
        .then(data => {
            container.innerHTML = '';

            if (!data.length) {
                container.innerHTML = '<p>No favorite stations.</p>';
                return;
            }

            data.forEach(station => {
                const item = document.createElement('div');
                item.className = 'favorite-item';
                item.addEventListener('click', () => playStation(station));

                const imgWrap = document.createElement('div');
                imgWrap.className = 'favorite-img';

                const img = document.createElement('img');
                img.src = station.favicon || './res/default-icon.png';
                img.alt = station.name;
                img.onerror = () => {
                    img.onerror = null;
                    img.src = './res/default-icon.png';
                };
                imgWrap.appendChild(img);
                item.appendChild(imgWrap);

                const nameDiv = document.createElement('div');
                nameDiv.className = 'favorite-name';
                nameDiv.textContent = station.name;
                item.appendChild(nameDiv);

                const star = document.createElement('div');
                star.className = 'favorite-star';
                star.textContent = '⛔';
                star.addEventListener('click', (event) => {
                    event.stopPropagation();
                    unfavoriteStation(station.url, item);
                });
                item.appendChild(star);

                container.appendChild(item);
            });
        })
        .catch(err => {
            container.innerHTML = '<p>You must be logged in to view favorites.</p>';
            console.error(err);
        });
}
