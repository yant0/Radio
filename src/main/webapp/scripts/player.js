export function createStationPlayer(station) {
    const url = station.url;
    const isHLS = url.endsWith('.m3u8');

    if (isHLS) {
        const video = document.createElement('video');
        video.controls = true;
        video.width = 300;
        video.style.display = 'block';

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        }

        return video;
    } else {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;
        audio.style.display = 'block';
        return audio;
    }
}
