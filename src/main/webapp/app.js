window.onload = fetchStations()

function fetchStations() {
    fetch('stations')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('stations');
            container.innerHTML = '';

            data.forEach(station => {
                const div = document.createElement('div');

                const playerElement = createStationPlayer(station);

                div.innerHTML = `
                                <img src="${station.favicon || './res/default-icon.png'}" alt="Logo" style="height: 32px; vertical-align: middle;" />
                                <strong>${station.name}</strong><br/>
                                <a href="${station.url}" target="_blank">${station.url}</a><br/>`;

                div.appendChild(playerElement);
                div.innerHTML += `<hr/>`;

                container.appendChild(div);
            });
        });
}

function createStationPlayer(station) {
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
            hls.attachMedia(audio);
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = url;
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

function searchStations() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    fetch(`searchStations?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('stations');
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = '<p>No stations found.</p>';
                return;
            }

            data.forEach(station => {
                const div = document.createElement('div');

                const playerElement = createStationPlayer(station);

                div.innerHTML = `
          <img src="${station.favicon || ''}" alt="Logo" style="height: 32px; vertical-align: middle;" />
          <strong>${station.name}</strong><br/>
          <a href="${station.url}" target="_blank">${station.url}</a><br/>`;

                div.appendChild(playerElement);
                div.innerHTML += `<hr/>`;

                container.appendChild(div);
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById('stations').innerHTML = '<p>Error loading stations.</p>';
        });
}
