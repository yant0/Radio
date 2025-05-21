window.onload = fetchStations()

function renderStation(station, container) {
    console.log("renderStation");
    const div = document.createElement('div');
    const playerElement = createStationPlayer(station);

    div.innerHTML = `
        <img src="${station.favicon || './res/default-icon.png'}" alt="📻" style="vertical-align: middle; max-width: 8rem;" />
        <strong><a href="${station.url}">${station.name}</a></strong>
        <span class="status">Checking...</span><br/>
        <!-- <a href="${station.url}" target="_blank">${station.url}</a> -->`;
    div.appendChild(playerElement);
    div.innerHTML += `<hr/>`;
    container.appendChild(div);

    const statusSpan = div.querySelector('.status');
    checkStreamStatus(station.url).then(status => {
        statusSpan.textContent = status;
        statusSpan.style.color = {
            'OK': 'green',
            'Loading': 'orange',
            'Offline': 'red'
        }[status];
    });
}

function fetchStations() {
    console.log("fetchStations")
    fetch('stations')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('stations');
            container.innerHTML = '';

            data.forEach(station => {
                renderStation(station, container);
            });
        });
}

function createStationPlayer(station) {
    console.log("createStationPlayer")
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

function searchStations() {
    console.log("searchStations")
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
                renderStation(station, container);
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById('stations').innerHTML = '<p>Error loading stations.</p>';
        });
}

async function checkStreamStatus(url) {
    console.log("checkStreamStatus");
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(url, {
            method: 'GET',
            mode: 'no-cors', // CORS-safe mode
            signal: controller.signal
        });

        clearTimeout(timeout);
        // In no-cors mode, we can't inspect status, so assume it's okay if no error
        return 'OK';
    } catch (err) {
        if (err.name === 'AbortError') return 'Pending';
        return 'Offline';
    }
}

