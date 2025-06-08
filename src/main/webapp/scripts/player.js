export function playStation(station) {
    const playerPanel = document.getElementById('playerPanel');

    if (!playerPanel) return;

    // Clear previously played station content
    playerPanel.innerHTML = '';

    const url = station.url;
    const isHLS = url.endsWith('.m3u8');

    // Create wrapper for the station card
    const stationCard = document.createElement('div');
    stationCard.className = 'station-card';
    stationCard.style.marginBottom = '20px';

    // Title
    const title = document.createElement('h3');
    title.textContent = `${station.name}`;
    stationCard.appendChild(title);

    // Image
    const img = document.createElement('img');
    img.src = station.favicon || './res/default-icon.png';
    img.alt = `📻 ${station.name}`;
    img.onerror = () => {
        img.onerror = null;
        img.src = './res/default-icon.png';
    };
    stationCard.appendChild(img);

    // Media player
    const mediaContainer = document.createElement('div');

    if (isHLS) {
        const video = document.createElement('video');
        video.controls = true;
        video.style.display = 'block';
        video.autoplay = true;
        video.width = 300;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        } else {
            video.innerHTML = '<p>Your browser does not support HLS playback.</p>';
        }

        mediaContainer.appendChild(video);
    } else {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.style.display = 'block';
        audio.src = url;
        audio.autoplay = true;
        mediaContainer.appendChild(audio);
    }

    stationCard.appendChild(mediaContainer);

    // Append the new card to the panel
    playerPanel.appendChild(stationCard);
}
