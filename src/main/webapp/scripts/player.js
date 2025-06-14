export function playStation(station) {
    const playerSection = document.getElementById('playerSection');
    if (!playerSection) return;

    // Clear previously played station content
    playerSection.innerHTML = '';

    const url = station.url;
    const isHLS = url.endsWith('.m3u8');

    // Create wrapper for the station card
    const stationCard = document.createElement('div');
    stationCard.className = 'station-card';

    // Title
    const title = document.createElement('h3');
    title.textContent = `${station.name}`;
    stationCard.appendChild(title);

    // Image
    const img = document.createElement('img');
    img.src = station.favicon || './res/default-icon.png';
    img.alt = `📻 ${station.name}`;
    img.style.cursor = 'pointer';
    img.onerror = () => {
        img.onerror = null;
        img.src = './res/default-icon.png';
    };

    stationCard.appendChild(img);

    // Media player
    const mediaContainer = document.createElement('div');

    let audioOrVideo;

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

        audioOrVideo = video;
        mediaContainer.appendChild(video);
    } else {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.style.display = 'block';
        audio.src = url;
        audio.autoplay = true;

        audioOrVideo = audio;
        mediaContainer.appendChild(audio);
    }

    // Add play/pause toggle on image click
    img.addEventListener('click', () => {
        if (!audioOrVideo) return;

        if (audioOrVideo.paused) {
            audioOrVideo.play();
        } else {
            audioOrVideo.pause();
        }
    });

    stationCard.appendChild(mediaContainer);
    playerSection.appendChild(stationCard);
}
